// Mock analysis functions for demo/hackathon purposes
// Replace with actual Gemini API calls via edge function

import type { AnalysisData } from "@/components/AnalysisResult";
import type { ComparisonData, StockData } from "@/components/ComparisonResult";

export function generateMockAnalysis(
  symbol: string,
  price: number,
  timeframe: string,
  riskProfile: string
): AnalysisData {
  const signals: Array<"BUY" | "SELL" | "HOLD"> = ["BUY", "HOLD", "SELL"];
  const signal = signals[Math.floor(Math.random() * 3)];
  const confidence = Math.floor(Math.random() * 40) + 55; // 55-95%

  const timeframeText = {
    intraday: "short-term intraday",
    swing: "swing trading (1-4 weeks)",
    longterm: "long-term investment (3+ months)",
  }[timeframe] || timeframe;

  const riskText = {
    conservative: "conservative approach with emphasis on capital preservation",
    moderate: "balanced approach between growth and stability",
    aggressive: "aggressive growth-focused strategy",
  }[riskProfile] || riskProfile;

  const analysis = `**Technical Analysis for ${symbol}**

Current Price: $${price.toFixed(2)}
Analysis Timeframe: ${timeframeText}
Risk Profile: ${riskText}

**Market Position:**
${symbol} is currently trading at ${price > 150 ? "elevated" : "moderate"} levels relative to its 50-day moving average. The stock shows ${
    signal === "BUY"
      ? "bullish momentum with strong buying pressure"
      : signal === "SELL"
      ? "bearish divergence with increased selling pressure"
      : "consolidation with mixed signals"
  }.

**Key Technical Indicators:**
• RSI (14): ${Math.floor(Math.random() * 30) + 35} - ${signal === "BUY" ? "Not overbought" : signal === "SELL" ? "Approaching oversold" : "Neutral zone"}
• MACD: ${signal === "BUY" ? "Bullish crossover detected" : signal === "SELL" ? "Bearish crossover forming" : "Converging near signal line"}
• Volume: ${signal === "BUY" ? "Above average" : "Below average"} trading activity

**Risk Assessment:**
Based on your ${riskProfile} risk profile, this trade ${
    confidence > 75
      ? "aligns well with your investment criteria"
      : "requires careful consideration of position sizing"
  }.

**Recommendation:**
${
  signal === "BUY"
    ? `Consider entering a position at current levels. Set stop-loss at $${(price * 0.95).toFixed(2)} and target at $${(price * 1.15).toFixed(2)} for the ${timeframe} timeframe.`
    : signal === "SELL"
    ? `Consider reducing exposure or exiting positions. Watch for support at $${(price * 0.9).toFixed(2)}.`
    : `Maintain current position. Wait for clearer directional signals before making new entries.`
}`;

  return {
    symbol,
    price,
    signal,
    confidence,
    analysis,
    timeframe: timeframeText,
    riskProfile: riskText,
  };
}

export function generateMockComparison(stocks: StockData[]): ComparisonData {
  const recommendations = [
    "Strong Buy - Best performer",
    "Buy - Good momentum",
    "Hold - Neutral outlook",
    "Reduce - Weakening",
  ];

  // Sort by a mock score (random for demo)
  const ranked = [...stocks]
    .map((s) => ({ ...s, score: Math.random() }))
    .sort((a, b) => b.score - a.score);

  const rankings = ranked.map((stock, index) => ({
    rank: index + 1,
    symbol: stock.symbol,
    recommendation: recommendations[Math.min(index, recommendations.length - 1)],
  }));

  const topPick = rankings[0].symbol;
  const analysis = `**Multi-Stock Comparison Analysis**

Analyzed ${stocks.length} stocks for relative strength and opportunity.

**Top Pick: ${topPick}**
${topPick} demonstrates the strongest technical setup among the compared assets, showing superior momentum and favorable risk/reward characteristics.

**Comparative Metrics:**
${rankings
  .map(
    (r, i) =>
      `${i + 1}. ${r.symbol}: ${r.recommendation}
   • Relative Strength: ${["Strong", "Moderate", "Weak", "Very Weak"][i] || "Weak"}
   • Volatility: ${["Low", "Moderate", "High", "Very High"][Math.floor(Math.random() * 3)]}
   • Trend: ${["Bullish", "Neutral", "Bearish"][Math.floor(Math.random() * 3)]}`
  )
  .join("\n\n")}

**Portfolio Recommendation:**
For a diversified approach, consider allocating:
• ${rankings[0]?.symbol}: 40-50% (Primary position)
• ${rankings[1]?.symbol}: 25-35% (Secondary position)
${rankings[2] ? `• ${rankings[2].symbol}: 15-25% (Small allocation)` : ""}

**Risk Note:**
This analysis is based on current market conditions. Always conduct your own due diligence and consider your personal risk tolerance before investing.`;

  return {
    stocks,
    rankings,
    analysis,
  };
}
