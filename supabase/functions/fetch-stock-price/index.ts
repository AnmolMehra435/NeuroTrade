import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");
    if (!ALPHA_VANTAGE_API_KEY) {
      console.error("ALPHA_VANTAGE_API_KEY is not configured");
      throw new Error("Stock data service not configured");
    }

    const { symbols } = await req.json();
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      throw new Error("Symbols array is required");
    }

    console.log("Fetching prices for symbols:", symbols);

    const results: { symbol: string; price: number; change?: number; changePercent?: number }[] = [];
    const failed: string[] = [];

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      
      // Add delay between requests to avoid rate limiting
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        console.log(`Fetching ${symbol}...`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`Failed to fetch ${symbol}: ${response.status}`);
          failed.push(symbol);
          continue;
        }

        const data = await response.json();
        
        // Check for rate limit or error messages
        if (data["Note"] || data["Information"]) {
          console.warn(`API limit hit for ${symbol}:`, data["Note"] || data["Information"]);
          failed.push(symbol);
          continue;
        }

        const quote = data["Global Quote"];
        if (!quote || !quote["05. price"]) {
          console.warn(`No data for ${symbol}`);
          failed.push(symbol);
          continue;
        }

        results.push({
          symbol: quote["01. symbol"],
          price: parseFloat(quote["05. price"]),
          change: parseFloat(quote["09. change"] || "0"),
          changePercent: parseFloat((quote["10. change percent"] || "0%").replace("%", "")),
        });
        
        console.log(`Success: ${symbol} = $${quote["05. price"]}`);
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        failed.push(symbol);
      }
    }

    console.log(`Completed: ${results.length} success, ${failed.length} failed`);

    return new Response(JSON.stringify({ success: results, failed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in fetch-stock-price function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
