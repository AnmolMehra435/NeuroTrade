import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  type: 'single' | 'multi';
  symbol?: string;
  symbols?: string[];
  price?: number;
  prices?: { symbol: string; price: number }[];
  timeframe?: string;
  riskProfile?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    const body: AnalysisRequest = await req.json();
    console.log("Received analysis request:", JSON.stringify(body));

    let systemPrompt = "";
    let userPrompt = "";

    if (body.type === 'single') {
      systemPrompt = `You are a professional stock analyst AI assistant called NeuroTrade. You provide detailed technical and fundamental analysis based on given stock data. 

Your analysis MUST include:
1. A clear recommendation: BUY, SELL, or HOLD
2. A confidence score from 0-100%
3. Detailed analysis covering technical indicators, market position, and risk assessment

Format your response EXACTLY as JSON with this structure:
{
  "signal": "BUY" | "SELL" | "HOLD",
  "confidence": <number 0-100>,
  "analysis": "<detailed analysis text>"
}

Do NOT include any text outside the JSON object. The analysis should be professional, detailed, and tailored to the user's timeframe and risk profile.`;

      userPrompt = `Analyze ${body.symbol} stock.
Current Price: $${body.price?.toFixed(2)}
Timeframe: ${body.timeframe}
Risk Profile: ${body.riskProfile}

Provide a comprehensive analysis with a clear BUY/SELL/HOLD recommendation, confidence score, and detailed reasoning. Consider technical indicators, market trends, and the specified risk profile.`;
    } else if (body.type === 'multi') {
      systemPrompt = `You are a professional stock analyst AI assistant called NeuroTrade. You compare multiple stocks and rank them by investment potential.

Your analysis MUST include:
1. Rankings from best to worst investment opportunity
2. A recommendation for each stock
3. Comparative analysis of strength, volatility, and risk

Format your response EXACTLY as JSON with this structure:
{
  "rankings": [
    { "rank": 1, "symbol": "XXX", "recommendation": "<brief recommendation>" },
    ...
  ],
  "analysis": "<detailed comparative analysis>"
}

Do NOT include any text outside the JSON object.`;

      const stockList = body.prices?.map(s => `${s.symbol}: $${s.price.toFixed(2)}`).join('\n') || '';
      userPrompt = `Compare these stocks and rank them from best to worst investment opportunity:

${stockList}

Analyze their relative strength, volatility, risk factors, and provide clear recommendations for each. Identify the top pick and explain your reasoning.`;
    }

    console.log("Sending request to AI gateway...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI response received");
    
    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("Raw AI content:", content);

    // Parse the JSON response
    let parsedResult;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return a fallback structure
      parsedResult = body.type === 'single' 
        ? { signal: "HOLD", confidence: 50, analysis: content }
        : { rankings: [], analysis: content };
    }

    console.log("Parsed result:", JSON.stringify(parsedResult));

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in stock-analyze function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
