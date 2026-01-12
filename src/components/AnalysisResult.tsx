import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BarChart3, 
  Target, 
  Shield, 
  Clock, 
  Activity,
  Layers,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUpIcon,
  LineChart,
  Crosshair,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TechnicalAnalysis {
  rsi?: string;
  macd?: string;
  movingAverages?: string;
  volume?: string;
  supportResistance?: string;
}

interface ChartPatterns {
  candlestick?: string;
  formations?: string;
  interpretation?: string;
}

interface SmartMoneyConcepts {
  orderBlocks?: string;
  liquidityZones?: string;
  fairValueGaps?: string;
  marketStructure?: string;
}

interface TrendAnalysis {
  direction?: "BULLISH" | "BEARISH" | "SIDEWAYS";
  strength?: "STRONG" | "MODERATE" | "WEAK";
  keyLevels?: string;
  reversalSignals?: string;
}

interface Strategy {
  entryZone?: string;
  stopLoss?: string;
  takeProfit?: string[];
  riskReward?: string;
}

interface RiskAssessment {
  volatility?: "HIGH" | "MEDIUM" | "LOW";
  overallRisk?: "HIGH" | "MEDIUM" | "LOW";
  positionSizing?: string;
  warnings?: string;
}

export interface AnalysisData {
  symbol: string;
  price: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  summary?: string;
  analysis?: string;
  technicalAnalysis?: TechnicalAnalysis;
  chartPatterns?: ChartPatterns;
  smartMoneyConcepts?: SmartMoneyConcepts;
  trendAnalysis?: TrendAnalysis;
  strategy?: Strategy;
  riskAssessment?: RiskAssessment;
  timeframe: string;
  riskProfile: string;
}

interface AnalysisResultProps {
  data: AnalysisData | null;
  isLoading: boolean;
}

function AnalysisSection({ 
  icon: Icon, 
  title, 
  children, 
  defaultOpen = false 
}: { 
  icon: React.ElementType; 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <AccordionItem value={title} className="border-b border-border/50">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2 pb-4">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function DataRow({ label, value, highlight = false }: { label: string; value?: string; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start py-2 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm text-right max-w-[60%] ${highlight ? 'font-semibold text-primary' : ''}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ 
  value, 
  type 
}: { 
  value?: string; 
  type: 'trend' | 'strength' | 'risk' 
}) {
  if (!value) return null;
  
  const getColors = () => {
    if (type === 'trend') {
      if (value === 'BULLISH') return 'bg-success/10 text-success border-success/20';
      if (value === 'BEARISH') return 'bg-destructive/10 text-destructive border-destructive/20';
      return 'bg-muted text-muted-foreground border-muted';
    }
    if (type === 'strength') {
      if (value === 'STRONG') return 'bg-success/10 text-success border-success/20';
      if (value === 'WEAK') return 'bg-destructive/10 text-destructive border-destructive/20';
      return 'bg-accent-teal/10 text-accent-teal border-accent-teal/20';
    }
    if (type === 'risk') {
      if (value === 'LOW') return 'bg-success/10 text-success border-success/20';
      if (value === 'HIGH') return 'bg-destructive/10 text-destructive border-destructive/20';
      return 'bg-accent-teal/10 text-accent-teal border-accent-teal/20';
    }
    return '';
  };

  return (
    <Badge variant="outline" className={`${getColors()} font-medium`}>
      {value}
    </Badge>
  );
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
          <CardDescription>AI is processing your request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
          </div>
          <div className="h-20 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-muted animate-pulse rounded" />
            <div className="h-12 bg-muted animate-pulse rounded" />
            <div className="h-12 bg-muted animate-pulse rounded" />
            <div className="h-12 bg-muted animate-pulse rounded" />
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
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Get professional-grade technical analysis with smart money concepts, chart patterns, and actionable trading strategies
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-primary" />
              Technical Indicators
            </div>
            <div className="flex items-center gap-2">
              <LineChart className="h-3 w-3 text-primary" />
              Chart Patterns
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-3 w-3 text-primary" />
              Smart Money Concepts
            </div>
            <div className="flex items-center gap-2">
              <Crosshair className="h-3 w-3 text-primary" />
              Entry/Exit Strategy
            </div>
          </div>
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
  const displayText = data.summary || data.analysis || "";

  return (
    <Card className="glass-card h-full animate-fade-in overflow-hidden">
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
      
      <CardContent className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
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
          <div className="text-right">
            <p className="text-2xl font-bold">{data.confidence}%</p>
            <p className="text-xs opacity-80">Confidence</p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-1">
          <Progress value={data.confidence} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {data.confidence >= 80
              ? "High confidence - Strong conviction in this analysis"
              : data.confidence >= 60
              ? "Moderate confidence - Consider additional research"
              : "Lower confidence - Proceed with caution"}
          </p>
        </div>

        {/* Executive Summary */}
        {displayText && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm leading-relaxed">{displayText}</p>
          </div>
        )}

        <Separator />

        {/* Detailed Analysis Sections */}
        <Accordion type="multiple" className="w-full" defaultValue={["Technical Analysis", "Entry & Exit Strategy"]}>
          
          {/* Technical Analysis */}
          {data.technicalAnalysis && Object.keys(data.technicalAnalysis).length > 0 && (
            <AnalysisSection icon={Activity} title="Technical Analysis" defaultOpen>
              <div className="space-y-1">
                <DataRow label="RSI" value={data.technicalAnalysis.rsi} />
                <DataRow label="MACD" value={data.technicalAnalysis.macd} />
                <DataRow label="Moving Averages" value={data.technicalAnalysis.movingAverages} />
                <DataRow label="Volume" value={data.technicalAnalysis.volume} />
                <DataRow label="Support/Resistance" value={data.technicalAnalysis.supportResistance} highlight />
              </div>
            </AnalysisSection>
          )}

          {/* Chart Patterns */}
          {data.chartPatterns && Object.keys(data.chartPatterns).length > 0 && (
            <AnalysisSection icon={LineChart} title="Chart Patterns">
              <div className="space-y-1">
                <DataRow label="Candlestick Patterns" value={data.chartPatterns.candlestick} />
                <DataRow label="Chart Formations" value={data.chartPatterns.formations} />
                <DataRow label="Pattern Interpretation" value={data.chartPatterns.interpretation} highlight />
              </div>
            </AnalysisSection>
          )}

          {/* Smart Money Concepts */}
          {data.smartMoneyConcepts && Object.keys(data.smartMoneyConcepts).length > 0 && (
            <AnalysisSection icon={Layers} title="Smart Money Concepts">
              <div className="space-y-1">
                <DataRow label="Order Blocks" value={data.smartMoneyConcepts.orderBlocks} />
                <DataRow label="Liquidity Zones" value={data.smartMoneyConcepts.liquidityZones} />
                <DataRow label="Fair Value Gaps" value={data.smartMoneyConcepts.fairValueGaps} />
                <DataRow label="Market Structure" value={data.smartMoneyConcepts.marketStructure} highlight />
              </div>
            </AnalysisSection>
          )}

          {/* Trend Analysis */}
          {data.trendAnalysis && Object.keys(data.trendAnalysis).length > 0 && (
            <AnalysisSection icon={TrendingUpIcon} title="Trend Analysis">
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge value={data.trendAnalysis.direction} type="trend" />
                  <StatusBadge value={data.trendAnalysis.strength} type="strength" />
                </div>
                <div className="space-y-1">
                  <DataRow label="Key Levels" value={data.trendAnalysis.keyLevels} />
                  <DataRow label="Reversal Signals" value={data.trendAnalysis.reversalSignals} />
                </div>
              </div>
            </AnalysisSection>
          )}

          {/* Entry & Exit Strategy */}
          {data.strategy && Object.keys(data.strategy).length > 0 && (
            <AnalysisSection icon={Crosshair} title="Entry & Exit Strategy" defaultOpen>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-xs text-muted-foreground mb-1">Entry Zone</p>
                    <p className="font-semibold text-success text-sm">{data.strategy.entryZone || 'N/A'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
                    <p className="font-semibold text-destructive text-sm">{data.strategy.stopLoss || 'N/A'}</p>
                  </div>
                </div>
                {data.strategy.takeProfit && data.strategy.takeProfit.length > 0 && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-2">Take Profit Targets</p>
                    <div className="flex gap-2 flex-wrap">
                      {data.strategy.takeProfit.map((tp, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-primary/20">
                          TP{idx + 1}: {tp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <DataRow label="Risk/Reward Ratio" value={data.strategy.riskReward} highlight />
              </div>
            </AnalysisSection>
          )}

          {/* Risk Assessment */}
          {data.riskAssessment && Object.keys(data.riskAssessment).length > 0 && (
            <AnalysisSection icon={AlertTriangle} title="Risk Assessment">
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Volatility:</span>
                    <StatusBadge value={data.riskAssessment.volatility} type="risk" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Risk:</span>
                    <StatusBadge value={data.riskAssessment.overallRisk} type="risk" />
                  </div>
                </div>
                <DataRow label="Position Sizing" value={data.riskAssessment.positionSizing} />
                {data.riskAssessment.warnings && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-xs text-destructive font-medium flex items-center gap-1 mb-1">
                      <AlertTriangle className="h-3 w-3" /> Warnings
                    </p>
                    <p className="text-sm text-muted-foreground">{data.riskAssessment.warnings}</p>
                  </div>
                )}
              </div>
            </AnalysisSection>
          )}
        </Accordion>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> This analysis is for educational purposes only and should not be considered as financial advice. Always conduct your own research.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
