import { Image, Clock, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ImageAnalysisPlaceholder() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-primary" />
          Chart Image Analysis
        </CardTitle>
        <CardDescription>
          Upload technical charts for AI-powered pattern recognition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
              <Image className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-warning" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            Gemini Vision-based chart analysis will allow you to upload candlestick charts, 
            identify patterns, and get instant AI insights.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-2 rounded-full">
            <Sparkles className="h-3 w-3" />
            Powered by Gemini Vision API
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
