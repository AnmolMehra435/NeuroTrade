import { TrendingUp, TrendingDown, Minus, BarChart3, Target, Shield, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface AnalysisData {
  symbol: string;
  price: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  analysis: string;
  timeframe: string;
  riskProfile: string;
}

interface AnalysisResultProps {
  data: AnalysisData | null;
  isLoading: boolean;
}

export function AnalysisResult({ data, isLoading }: AnalysisResultProps) {
  if (isLoading) {
    return (
      <Card className="glass-card h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary animate-pulse" />
            Analyzing...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
          </div>
          <div className="h-16 bg-muted animate-pulse rounded" />
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
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
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            AI Analysis
          </CardTitle>
          <CardDescription>
            Enter a stock symbol to see AI-powered analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            Get detailed technical analysis, market insights, and actionable recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  const getSignalStyles = () => {
    switch (data.signal) {
      case "BUY":
        return {
          bg: "signal-buy",
          icon: TrendingUp,
          text: "Strong Buy Signal",
        };
      case "SELL":
        return {
          bg: "signal-sell",
          icon: TrendingDown,
          text: "Sell Signal",
        };
      default:
        return {
          bg: "signal-hold",
          icon: Minus,
          text: "Hold Position",
        };
    }
  };

  const signalStyle = getSignalStyles();
  const SignalIcon = signalStyle.icon;

  return (
    <Card className="glass-card h-full animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              {data.symbol}
              <Badge variant="outline" className="font-mono">
                ${data.price.toFixed(2)}
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {data.timeframe}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {data.riskProfile}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Signal Badge */}
        <div className={`p-4 rounded-xl ${signalStyle.bg} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <SignalIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-xl">{data.signal}</p>
              <p className="text-sm opacity-90">{signalStyle.text}</p>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-semibold">{data.confidence}%</span>
          </div>
          <Progress value={data.confidence} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {data.confidence >= 80
              ? "High confidence - Strong conviction in this analysis"
              : data.confidence >= 60
              ? "Moderate confidence - Consider additional research"
              : "Lower confidence - Proceed with caution"}
          </p>
        </div>

        <Separator />

        {/* Analysis Report */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Detailed Analysis
          </h4>
          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {data.analysis}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
