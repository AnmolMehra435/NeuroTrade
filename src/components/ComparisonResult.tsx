import { Trophy, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Target, Zap, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export interface StockData {
  symbol: string;
  price: number;
}

interface RankingItem {
  rank: number;
  symbol: string;
  signal?: "BUY" | "SELL" | "HOLD";
  confidence?: number;
  strength?: "STRONG" | "MODERATE" | "WEAK";
  volatility?: "HIGH" | "MEDIUM" | "LOW";
  recommendation: string;
}

interface TopPick {
  symbol: string;
  reasoning: string;
}

interface ComparativeAnalysis {
  strengthComparison?: string;
  riskComparison?: string;
  sectorAnalysis?: string;
}

export interface ComparisonData {
  stocks: StockData[];
  rankings: RankingItem[];
  topPick?: TopPick;
  comparativeAnalysis?: ComparativeAnalysis;
  analysis: string;
}

interface ComparisonResultProps {
  data: ComparisonData | null;
  isLoading: boolean;
}

function SignalBadge({ signal }: { signal?: string }) {
  if (!signal) return null;
  const styles = {
    BUY: "bg-success/10 text-success border-success/20",
    SELL: "bg-destructive/10 text-destructive border-destructive/20",
    HOLD: "bg-muted text-muted-foreground border-muted",
  }[signal] || "bg-muted text-muted-foreground border-muted";
  
  return (
    <Badge variant="outline" className={`${styles} text-xs font-medium`}>
      {signal}
    </Badge>
  );
}

function StrengthBadge({ strength }: { strength?: string }) {
  if (!strength) return null;
  const styles = {
    STRONG: "bg-success/10 text-success border-success/20",
    MODERATE: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
    WEAK: "bg-destructive/10 text-destructive border-destructive/20",
  }[strength] || "";
  
  return (
    <Badge variant="outline" className={`${styles} text-xs`}>
      {strength}
    </Badge>
  );
}

function VolatilityBadge({ volatility }: { volatility?: string }) {
  if (!volatility) return null;
  const styles = {
    LOW: "bg-success/10 text-success border-success/20",
    MEDIUM: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
    HIGH: "bg-destructive/10 text-destructive border-destructive/20",
  }[volatility] || "";
  
  return (
    <Badge variant="outline" className={`${styles} text-xs`}>
      {volatility}
    </Badge>
  );
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
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Compare strength, volatility, and risk across multiple assets with AI-powered rankings
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3 text-primary" />
              Signal per stock
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-primary" />
              Strength analysis
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-primary" />
              Volatility rating
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-3 w-3 text-primary" />
              AI rankings
            </div>
          </div>
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

  return (
    <Card className="glass-card h-full animate-fade-in overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Comparison Results
        </CardTitle>
        <CardDescription>
          {data.stocks.length} stocks analyzed and ranked
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        {/* Top Pick Highlight */}
        {data.topPick && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-warning/10 to-primary/10 border border-warning/30">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-warning" />
              <span className="font-semibold">Top Pick: {data.topPick.symbol}</span>
            </div>
            <p className="text-sm text-muted-foreground">{data.topPick.reasoning}</p>
          </div>
        )}

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

        {/* Enhanced Rankings */}
        <div className="space-y-3">
          <h4 className="font-semibold">AI Rankings</h4>
          <div className="space-y-3">
            {data.rankings.map((item) => (
              <div
                key={item.symbol}
                className={`p-4 rounded-lg border ${
                  item.rank === 1 ? "border-warning/50 bg-warning/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getRankBadge(item.rank)}
                    <span className="font-mono font-semibold text-lg">{item.symbol}</span>
                  </div>
                  <SignalBadge signal={item.signal} />
                </div>
                
                {/* Confidence bar */}
                {item.confidence && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">{item.confidence}%</span>
                    </div>
                    <Progress value={item.confidence} className="h-1.5" />
                  </div>
                )}
                
                {/* Badges row */}
                <div className="flex gap-2 mb-2 flex-wrap">
                  {item.strength && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Strength:</span>
                      <StrengthBadge strength={item.strength} />
                    </div>
                  )}
                  {item.volatility && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Volatility:</span>
                      <VolatilityBadge volatility={item.volatility} />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">{item.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparative Analysis */}
        {data.comparativeAnalysis && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold">Comparative Analysis</h4>
              <div className="grid gap-3">
                {data.comparativeAnalysis.strengthComparison && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Strength Comparison</p>
                    <p className="text-sm">{data.comparativeAnalysis.strengthComparison}</p>
                  </div>
                )}
                {data.comparativeAnalysis.riskComparison && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Risk Comparison</p>
                    <p className="text-sm">{data.comparativeAnalysis.riskComparison}</p>
                  </div>
                )}
                {data.comparativeAnalysis.sectorAnalysis && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Sector Analysis</p>
                    <p className="text-sm">{data.comparativeAnalysis.sectorAnalysis}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Full Analysis */}
        <div className="space-y-3">
          <h4 className="font-semibold">Detailed Analysis</h4>
          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {data.analysis}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> This analysis is for educational purposes only and should not be considered as financial advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
