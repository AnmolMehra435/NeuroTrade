import { Trophy, TrendingUp, TrendingDown, AlertTriangle, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface StockData {
  symbol: string;
  price: number;
}

export interface ComparisonData {
  stocks: StockData[];
  rankings: Array<{
    rank: number;
    symbol: string;
    recommendation: string;
  }>;
  analysis: string;
}

interface ComparisonResultProps {
  data: ComparisonData | null;
  isLoading: boolean;
}

export function ComparisonResult({ data, isLoading }: ComparisonResultProps) {
  if (isLoading) {
    return (
      <Card className="glass-card h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary animate-pulse" />
            Comparing Stocks...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-muted animate-pulse rounded" />
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="glass-card h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-muted-foreground" />
            Comparison Results
          </CardTitle>
          <CardDescription>
            Enter multiple symbols to compare stocks
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            Compare strength, volatility, and risk across multiple assets with AI-powered rankings
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-warning text-warning-foreground"><Trophy className="h-3 w-3 mr-1" />1st</Badge>;
      case 2:
        return <Badge variant="secondary">2nd</Badge>;
      case 3:
        return <Badge variant="outline">3rd</Badge>;
      default:
        return <Badge variant="outline">{rank}th</Badge>;
    }
  };

  const getRecommendationIcon = (rec: string) => {
    const lower = rec.toLowerCase();
    if (lower.includes("buy") || lower.includes("strong")) {
      return <TrendingUp className="h-4 w-4 text-success" />;
    } else if (lower.includes("sell") || lower.includes("avoid")) {
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    }
    return <AlertTriangle className="h-4 w-4 text-warning" />;
  };

  return (
    <Card className="glass-card h-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Comparison Results
        </CardTitle>
        <CardDescription>
          {data.stocks.length} stocks analyzed and ranked
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.stocks.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-mono font-semibold">{stock.symbol}</TableCell>
                  <TableCell className="text-right font-mono">
                    <span className="flex items-center justify-end gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      {stock.price.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Rankings */}
        <div className="space-y-3">
          <h4 className="font-semibold">AI Rankings</h4>
          <div className="space-y-2">
            {data.rankings.map((item) => (
              <div
                key={item.symbol}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  item.rank === 1 ? "border-warning/50 bg-warning/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankBadge(item.rank)}
                  <span className="font-mono font-semibold">{item.symbol}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getRecommendationIcon(item.recommendation)}
                  <span className="max-w-32 truncate">{item.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Analysis */}
        <div className="space-y-3">
          <h4 className="font-semibold">Detailed Comparison</h4>
          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {data.analysis}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
