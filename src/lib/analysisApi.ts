import { supabase } from "@/integrations/supabase/client";
import type { AnalysisData } from "@/components/AnalysisResult";
import type { ComparisonData, StockData } from "@/components/ComparisonResult";

export async function analyzeStock(
  symbol: string,
  price: number,
  timeframe: string,
  riskProfile: string
): Promise<AnalysisData> {
  const { data, error } = await supabase.functions.invoke('stock-analyze', {
    body: {
      type: 'single',
      symbol,
      price,
      timeframe,
      riskProfile,
    },
  });

  if (error) {
    console.error("Error analyzing stock:", error);
    throw new Error("Failed to analyze stock. Please try again.");
  }

  // Validate and normalize the signal
  let signal: "BUY" | "SELL" | "HOLD" = "HOLD";
  if (data.signal === "BUY" || data.signal === "SELL" || data.signal === "HOLD") {
    signal = data.signal;
  }

  // Ensure confidence is a valid number
  const confidence = Math.min(100, Math.max(0, Number(data.confidence) || 50));

  const timeframeText = {
    intraday: "Intraday",
    swing: "Swing (1-4 weeks)",
    longterm: "Long-term (3+ months)",
  }[timeframe] || timeframe;

  const riskText = {
    conservative: "Conservative",
    moderate: "Moderate",
    aggressive: "Aggressive",
  }[riskProfile] || riskProfile;

  return {
    symbol,
    price,
    signal,
    confidence,
    analysis: data.analysis || "Analysis unavailable.",
    timeframe: timeframeText,
    riskProfile: riskText,
  };
}

export async function compareStocks(stocks: StockData[]): Promise<ComparisonData> {
  const { data, error } = await supabase.functions.invoke('stock-analyze', {
    body: {
      type: 'multi',
      prices: stocks.map(s => ({ symbol: s.symbol, price: s.price })),
    },
  });

  if (error) {
    console.error("Error comparing stocks:", error);
    throw new Error("Failed to compare stocks. Please try again.");
  }

  // Ensure rankings are properly formatted
  const rankings = (data.rankings || []).map((r: any, index: number) => ({
    rank: r.rank || index + 1,
    symbol: r.symbol || "Unknown",
    recommendation: r.recommendation || "No recommendation",
  }));

  return {
    stocks,
    rankings,
    analysis: data.analysis || "Comparison unavailable.",
  };
}
