import { supabase } from "@/integrations/supabase/client";

export interface StockQuote {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
}

export async function fetchStockPrice(symbol: string): Promise<StockQuote> {
  const { data, error } = await supabase.functions.invoke('fetch-stock-price', {
    body: { symbols: [symbol] },
  });

  if (error) {
    console.error("Error fetching stock price:", error);
    throw new Error("Failed to fetch stock data. Please enter price manually.");
  }

  if (!data.success || data.success.length === 0) {
    throw new Error(`No data found for ${symbol}. API rate limit may be reached.`);
  }

  return data.success[0];
}

export async function fetchMultipleStockPrices(
  symbols: string[]
): Promise<{ success: StockQuote[]; failed: string[] }> {
  const { data, error } = await supabase.functions.invoke('fetch-stock-price', {
    body: { symbols },
  });

  if (error) {
    console.error("Error fetching stock prices:", error);
    return { success: [], failed: symbols };
  }

  return {
    success: data.success || [],
    failed: data.failed || [],
  };
}
