const ALPHA_VANTAGE_API_KEY = "demo"; // Replace with actual key via secrets

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export async function fetchStockPrice(symbol: string): Promise<StockQuote> {
  const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }

  const data = await response.json();

  // Check for rate limit or error
  if (data["Note"] || data["Information"]) {
    throw new Error("API rate limit reached. Please enter price manually.");
  }

  const quote = data["Global Quote"];
  if (!quote || !quote["05. price"]) {
    throw new Error(`No data found for symbol: ${symbol}`);
  }

  return {
    symbol: quote["01. symbol"],
    price: parseFloat(quote["05. price"]),
    change: parseFloat(quote["09. change"]),
    changePercent: parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
  };
}

export async function fetchMultipleStockPrices(
  symbols: string[]
): Promise<{ success: StockQuote[]; failed: string[] }> {
  const results: StockQuote[] = [];
  const failed: string[] = [];

  // Fetch sequentially to avoid rate limits
  for (const symbol of symbols) {
    try {
      // Add delay between requests to avoid rate limiting
      if (results.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      const quote = await fetchStockPrice(symbol);
      results.push(quote);
    } catch (error) {
      failed.push(symbol);
    }
  }

  return { success: results, failed };
}
