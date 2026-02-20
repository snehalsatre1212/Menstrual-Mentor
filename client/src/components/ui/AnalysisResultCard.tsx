import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultProps {
  title: string;
  data: {
    summary?: string;
    detectedIssue?: string;
    riskLevel?: string;
    guidance?: string;
    nutritionAdvice?: string;
    activityAdvice?: string;
    explanation?: string; // For image response
    color?: string; // For image response
  };
  className?: string;
}

export function AnalysisResultCard({ title, data, className }: AnalysisResultProps) {
  const getRiskColor = (risk?: string) => {
    switch (risk?.toLowerCase()) {
      case "high": return "text-destructive border-destructive/20 bg-destructive/5";
      case "medium": return "text-orange-500 border-orange-200 bg-orange-50";
      case "low": return "text-green-500 border-green-200 bg-green-50";
      default: return "text-muted-foreground border-border bg-muted/20";
    }
  };

  return (
    <Card className={cn("overflow-hidden border-t-4 border-t-primary shadow-lg", className)}>
      <CardHeader className="bg-primary/5 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-primary">{title}</CardTitle>
            <CardDescription className="mt-2">AI-Powered Health Insights</CardDescription>
          </div>
          {data.riskLevel && (
            <div className={cn("px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2", getRiskColor(data.riskLevel))}>
              <AlertCircle className="w-4 h-4" />
              Risk Level: {data.riskLevel}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="-mt-6 grid gap-6 p-6 bg-card rounded-t-3xl border-t border-border/50">
        {data.summary && (
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> Analysis Summary
            </h4>
            <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
          </div>
        )}

        {data.detectedIssue && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-semibold text-slate-700 mb-1">Detected Issue</h4>
            <p className="text-slate-600">{data.detectedIssue}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {data.nutritionAdvice && (
            <div className="p-4 rounded-xl bg-green-50/50 border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">🍏 Nutrition</h4>
              <p className="text-sm text-green-700">{data.nutritionAdvice}</p>
            </div>
          )}
          {data.activityAdvice && (
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-2">🧘‍♀️ Activity</h4>
              <p className="text-sm text-purple-700">{data.activityAdvice}</p>
            </div>
          )}
        </div>

        {data.explanation && (
          <div className="space-y-2">
            <h4 className="font-semibold">Explanation</h4>
            <p className="text-muted-foreground">{data.explanation}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t flex items-start gap-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            <strong>Disclaimer:</strong> This app provides wellness guidance only and does not replace professional medical consultation. 
            If you have severe symptoms, please consult a healthcare provider.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
