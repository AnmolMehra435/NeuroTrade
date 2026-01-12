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
import { Sparkles, TrendingUp, BarChart3, Shield, Zap, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Data",
      description: "Live market prices from Alpha Vantage"
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description: "Powered by Google Gemini AI"
    },
    {
      icon: BarChart3,
      title: "Technical Indicators",
      description: "RSI, MACD, Moving Averages & more"
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Volatility analysis & position sizing"
    },
    {
      icon: Zap,
      title: "Smart Money Concepts",
      description: "Order blocks & liquidity zones"
    },
    {
      icon: Target,
      title: "Entry/Exit Strategy",
      description: "Precise trade setups with targets"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            AI-Powered Stock Intelligence
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get professional-grade technical analysis, smart money concepts, and actionable trading strategies powered by Google Gemini AI.
          </p>
        </div>

        {/* Feature Cards - Full Width */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mode Selector - Centered */}
        <div className="max-w-xl mx-auto mb-8">
          <ModeSelector mode={mode} onModeChange={handleModeChange} />
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 min-h-[600px]">
          {/* Left Column - Input Forms */}
          <div className="space-y-6">
            <div className="sticky top-24">
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

              {/* Quick Tips Card */}
              <Card className="mt-6 bg-accent/5 border-accent/20">
                <CardContent className="p-5">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Quick Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Use stock tickers like AAPL, TSLA, MSFT for US stocks
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Choose your timeframe based on your trading style
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Risk profile affects stop-loss and position sizing
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      Compare up to 5 stocks for optimal portfolio allocation
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="min-h-[500px]">
            {mode === "single" && (
              <AnalysisResult data={analysisResult} isLoading={isLoading} />
            )}
            {mode === "multi" && (
              <ComparisonResult data={comparisonResult} isLoading={isLoading} />
            )}
            {mode === "image" && (
              <Card className="glass-card h-full min-h-[500px] flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Chart analysis results will appear here
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Upload a candlestick chart image when the feature launches
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-2">NeuroTrade</h4>
              <p className="text-sm text-muted-foreground">
                AI-Powered Stock Intelligence Platform for modern traders.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Powered By</h4>
              <p className="text-sm text-muted-foreground">
                Google Gemini AI • Alpha Vantage API • Lovable Cloud
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Disclaimer</h4>
              <p className="text-sm text-muted-foreground">
                For educational purposes only. Not financial advice.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
