import { useState } from "react";
import { GitCompare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MultiStockFormProps {
  onCompare: (symbols: string[]) => void;
  isLoading: boolean;
}

export function MultiStockForm({ onCompare, isLoading }: MultiStockFormProps) {
  const [symbolsInput, setSymbolsInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const symbols = symbolsInput
      .toUpperCase()
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    
    if (symbols.length < 2) return;
    onCompare(symbols);
  };

  const symbolCount = symbolsInput
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-primary" />
          Multi-Stock Comparison
        </CardTitle>
        <CardDescription>
          Compare multiple stocks side by side with AI-powered ranking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbols">Stock Symbols (comma-separated)</Label>
            <Input
              id="symbols"
              placeholder="e.g., AAPL, TSLA, MSFT, GOOGL"
              value={symbolsInput}
              onChange={(e) => setSymbolsInput(e.target.value.toUpperCase())}
              className="font-mono uppercase"
            />
            <p className="text-xs text-muted-foreground">
              {symbolCount} stock{symbolCount !== 1 ? "s" : ""} entered
              {symbolCount < 2 && " (minimum 2 required)"}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || symbolCount < 2}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <GitCompare className="mr-2 h-4 w-4" />
                Compare Stocks
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
