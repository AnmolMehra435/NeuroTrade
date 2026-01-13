import { useState } from "react";
import { Header } from "@/components/Header";
import { ModeSelector } from "@/components/ModeSelector";
import { SingleStockForm } from "@/components/SingleStockForm";
import { MultiStockForm } from "@/components/MultiStockForm";
import { ImageAnalysisPlaceholder } from "@/components/ImageAnalysisPlaceholder";
import { AnalysisResult, type AnalysisData } from "@/components/AnalysisResult";
import { ComparisonResult, type ComparisonData, type StockData } from "@/components/ComparisonResult";
import { fetchStockPrice, fetchMultipleStockPrices } from "@/lib/stockApi";
import { analyzeStock, compareStocks } from "@/lib/analysisApi";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [mode, setMode] = useState("single");
  const [isLoading, setIsLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonData | null>(null);
  const { toast } = useToast();

  const handleSingleAnalysis = async (data: {
    symbol: string;
    price: number | null;
    timeframe: string;
    riskProfile: string;
  }) => {
    setIsLoading(true);
    setPriceError(null);
    setAnalysisResult(null);

    try {
      let price = data.price;

      if (price === null) {
        try {
          const quote = await fetchStockPrice(data.symbol);
          price = quote.price;
          toast({
            title: "Price fetched",
            description: `${data.symbol}: $${price.toFixed(2)}`,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch price";
          setPriceError(errorMessage);
          setIsLoading(false);
          return;
        }
      }

      const result = await analyzeStock(data.symbol, price, data.timeframe, data.riskProfile);
      setAnalysisResult(result);

      toast({
        title: "Analysis Complete",
        description: `${data.symbol}: ${result.signal} (${result.confidence}% confidence)`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultiComparison = async (symbols: string[]) => {
    setIsLoading(true);
    setComparisonResult(null);

    try {
      const { success, failed } = await fetchMultipleStockPrices(symbols);

      if (success.length === 0) {
        toast({
          title: "Failed to fetch prices",
          description: "Could not retrieve data for any symbols. API rate limit may be reached.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (failed.length > 0) {
        toast({
          title: "Partial data retrieved",
          description: `Could not fetch: ${failed.join(", ")}`,
        });
      }

      const stocks: StockData[] = success.map((q) => ({
        symbol: q.symbol,
        price: q.price,
      }));

      const result = await compareStocks(stocks);
      setComparisonResult(result);

      toast({
        title: "Comparison Complete",
        description: `${stocks.length} stocks ranked by AI`,
      });
    } catch (error) {
      toast({
        title: "Comparison Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    setPriceError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Description */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            AI-Powered Stock Analysis
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get instant technical analysis, chart pattern recognition, and actionable trading signals powered by advanced AI models.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="max-w-2xl mx-auto mb-8">
          <ModeSelector mode={mode} onModeChange={handleModeChange} />
        </div>

        {/* Input Form - Centered */}
        <div className="max-w-2xl mx-auto mb-8">
          {mode === "single" && (
            <SingleStockForm
              onAnalyze={handleSingleAnalysis}
              isLoading={isLoading}
              priceError={priceError}
            />
          )}
          {mode === "multi" && (
            <MultiStockForm onCompare={handleMultiComparison} isLoading={isLoading} />
          )}
          {mode === "image" && <ImageAnalysisPlaceholder />}
        </div>

        {/* Results - Full Width for Analysis */}
        <div>
          {mode === "single" && (
            <AnalysisResult data={analysisResult} isLoading={isLoading} />
          )}
          {mode === "multi" && (
            <ComparisonResult data={comparisonResult} isLoading={isLoading} />
          )}
          {mode === "image" && analysisResult === null && (
            <div className="max-w-md mx-auto glass-card rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Chart analysis results will appear here when the feature launches.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 py-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>NeuroTrade — AI-Powered Stock Intelligence Platform</p>
          <p className="mt-1">For educational purposes only. Not financial advice.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
