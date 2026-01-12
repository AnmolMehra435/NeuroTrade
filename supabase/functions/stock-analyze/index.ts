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
      systemPrompt = `You are NeuroTrade, a professional AI-powered stock intelligence system. You provide comprehensive, professional-grade technical analysis similar to premium trading platforms.

Your analysis MUST be structured with these detailed sections:

1. **Signal & Confidence**: Clear BUY/SELL/HOLD with 0-100% confidence
2. **Technical Analysis**: RSI, MACD, Moving Averages, Volume analysis, key support/resistance levels
3. **Chart Patterns**: Identified candlestick patterns (doji, hammer, engulfing, etc.) and formations (head & shoulders, triangles, wedges)
4. **Smart Money Concepts**: Order blocks, liquidity zones, fair value gaps, market structure (higher highs/lows or lower highs/lows)
5. **Trend Analysis**: Current trend direction, trend strength, potential reversal signals
6. **Entry & Exit Strategy**: Suggested entry zones, stop-loss levels, take-profit targets based on risk profile
7. **Risk Assessment**: Volatility analysis, risk/reward ratio, position sizing suggestion

Format your response EXACTLY as JSON:
{
  "signal": "BUY" | "SELL" | "HOLD",
  "confidence": <number 0-100>,
  "summary": "<2-3 sentence executive summary>",
  "technicalAnalysis": {
    "rsi": "<RSI value and interpretation>",
    "macd": "<MACD analysis>",
    "movingAverages": "<MA analysis - 20, 50, 200 day>",
    "volume": "<Volume analysis>",
    "supportResistance": "<Key levels>"
  },
  "chartPatterns": {
    "candlestick": "<Identified candlestick patterns>",
    "formations": "<Chart formations identified>",
    "interpretation": "<What these patterns suggest>"
  },
  "smartMoneyConcepts": {
    "orderBlocks": "<Order block analysis>",
    "liquidityZones": "<Liquidity zones identified>",
    "fairValueGaps": "<FVG analysis>",
    "marketStructure": "<Current market structure>"
  },
  "trendAnalysis": {
    "direction": "BULLISH" | "BEARISH" | "SIDEWAYS",
    "strength": "STRONG" | "MODERATE" | "WEAK",
    "keyLevels": "<Important price levels>",
    "reversalSignals": "<Any reversal signals>"
  },
  "strategy": {
    "entryZone": "<Suggested entry price range>",
    "stopLoss": "<Stop-loss level>",
    "takeProfit": ["<TP1>", "<TP2>", "<TP3>"],
    "riskReward": "<Risk/reward ratio>"
  },
  "riskAssessment": {
    "volatility": "HIGH" | "MEDIUM" | "LOW",
    "overallRisk": "HIGH" | "MEDIUM" | "LOW",
    "positionSizing": "<Suggested position size %>",
    "warnings": "<Any specific warnings or cautions>"
  }
}

Do NOT include any text outside the JSON object. Provide professional, actionable insights.`;

      userPrompt = `Analyze ${body.symbol} stock with comprehensive technical analysis.
Current Price: $${body.price?.toFixed(2)}
Trading Timeframe: ${body.timeframe}
Risk Profile: ${body.riskProfile}

Provide a complete professional analysis covering all technical indicators, chart patterns, smart money concepts, and actionable trading strategy with specific entry/exit points. Tailor the analysis to the specified timeframe and risk tolerance.`;
    } else if (body.type === 'multi') {
      systemPrompt = `You are NeuroTrade, a professional AI-powered stock intelligence system. You compare multiple stocks and provide comprehensive ranking analysis.

Your comparison MUST include:
1. Rankings from best to worst investment opportunity
2. Individual stock assessments
3. Comparative strength analysis
4. Risk-adjusted recommendations

Format your response EXACTLY as JSON:
{
  "rankings": [
    { 
      "rank": 1, 
      "symbol": "XXX", 
      "signal": "BUY" | "SELL" | "HOLD",
      "confidence": <number 0-100>,
      "strength": "STRONG" | "MODERATE" | "WEAK",
      "volatility": "HIGH" | "MEDIUM" | "LOW",
      "recommendation": "<brief 1-2 sentence recommendation>"
    }
  ],
  "topPick": {
    "symbol": "<top pick symbol>",
    "reasoning": "<why this is the top pick>"
  },
  "comparativeAnalysis": {
    "strengthComparison": "<relative strength analysis>",
    "riskComparison": "<risk comparison>",
    "sectorAnalysis": "<sector/industry considerations>"
  },
  "analysis": "<detailed comparative analysis paragraph>"
}

Do NOT include any text outside the JSON object.`;

      const stockList = body.prices?.map(s => `${s.symbol}: $${s.price.toFixed(2)}`).join('\n') || '';
      userPrompt = `Compare these stocks and rank them from best to worst investment opportunity:

${stockList}

Analyze their relative strength, volatility, risk factors, and provide clear recommendations for each. Identify the top pick and explain your reasoning with specific metrics.`;
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
        ? { signal: "HOLD", confidence: 50, summary: content, technicalAnalysis: {}, chartPatterns: {}, smartMoneyConcepts: {}, trendAnalysis: {}, strategy: {}, riskAssessment: {} }
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
