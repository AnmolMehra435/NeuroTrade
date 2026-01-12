import { useState } from "react";
import { Search, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SingleStockFormProps {
  onAnalyze: (data: {
    symbol: string;
    price: number | null;
    timeframe: string;
    riskProfile: string;
  }) => void;
  isLoading: boolean;
  priceError: string | null;
}

export function SingleStockForm({ onAnalyze, isLoading, priceError }: SingleStockFormProps) {
  const [symbol, setSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("swing");
  const [riskProfile, setRiskProfile] = useState("moderate");
  const [manualPrice, setManualPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    
    onAnalyze({
      symbol: symbol.toUpperCase().trim(),
      price: manualPrice ? parseFloat(manualPrice) : null,
      timeframe,
      riskProfile,
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Single Stock Analysis
        </CardTitle>
        <CardDescription>
          Enter a stock symbol to get AI-powered analysis and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              id="symbol"
              placeholder="e.g., AAPL, TSLA, MSFT"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="font-mono uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger id="timeframe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intraday">Intraday</SelectItem>
                  <SelectItem value="swing">Swing (1-4 weeks)</SelectItem>
                  <SelectItem value="longterm">Long-term (3+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk">Risk Profile</Label>
              <Select value={riskProfile} onValueChange={setRiskProfile}>
                <SelectTrigger id="risk">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {priceError && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-2">
                <span>{priceError}</span>
                <div className="space-y-1">
                  <Label htmlFor="manualPrice" className="text-xs">Enter price manually:</Label>
                  <Input
                    id="manualPrice"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 185.50"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    className="h-8 bg-background"
                  />
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !symbol.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Stock
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
