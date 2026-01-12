import { useState } from "react";
import { Header } from "@/components/Header";
import { ModeSelector } from "@/components/ModeSelector";
import { SingleStockForm } from "@/components/SingleStockForm";
import { MultiStockForm } from "@/components/MultiStockForm";
import { ImageAnalysisPlaceholder } from "@/components/ImageAnalysisPlaceholder";
import { AnalysisResult, type AnalysisData } from "@/components/AnalysisResult";
import { ComparisonResult, type ComparisonData, type StockData } from "@/components/ComparisonResult";
import { fetchStockPrice, fetchMultipleStockPrices } from "@/lib/stockApi";
import { generateMockAnalysis, generateMockComparison } from "@/lib/mockAnalysis";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

      // Try to fetch price if not provided manually
      if (price === null) {
        try {
          const quote = await fetchStockPrice(data.symbol);
          price = quote.price;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch price";
          setPriceError(errorMessage);
          setIsLoading(false);
          return;
        }
      }

      // Generate analysis (mock for now - will use Gemini via edge function)
      const result = generateMockAnalysis(data.symbol, price, data.timeframe, data.riskProfile);
      setAnalysisResult(result);

      toast({
        title: "Analysis Complete",
        description: `${data.symbol} analyzed successfully`,
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

      // Generate comparison (mock for now)
      const result = generateMockComparison(stocks);
      setComparisonResult(result);

      toast({
        title: "Comparison Complete",
        description: `${stocks.length} stocks analyzed`,
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

      <main className="container mx-auto px-4 py-6">
        {/* API Notice */}
        <Alert className="mb-6 border-primary/30 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle>Demo Mode</AlertTitle>
          <AlertDescription>
            Using Alpha Vantage demo API (limited requests). For full functionality, connect your API keys via the backend.
          </AlertDescription>
        </Alert>

        {/* Mode Selector */}
        <div className="mb-6">
          <ModeSelector mode={mode} onModeChange={handleModeChange} />
        </div>

        {/* Main Content - Two Column Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input Forms */}
          <div className="space-y-6">
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

          {/* Right Column - Results */}
          <div>
            {mode === "single" && (
              <AnalysisResult data={analysisResult} isLoading={isLoading} />
            )}
            {mode === "multi" && (
              <ComparisonResult data={comparisonResult} isLoading={isLoading} />
            )}
            {mode === "image" && (
              <div className="glass-card rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Chart analysis results will appear here when the feature launches.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>NeuroTrade — AI-Powered Stock Intelligence Platform</p>
          <p className="mt-1">For educational purposes only. Not financial advice.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
