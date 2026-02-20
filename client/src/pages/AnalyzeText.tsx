import { useState } from "react";
import { useTextAnalysis } from "@/hooks/use-analysis";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisResultCard } from "@/components/ui/AnalysisResultCard";
import { Loader2, Sparkles, Send } from "lucide-react";

export default function AnalyzeText() {
  const [text, setText] = useState("");
  const { mutate, data, isPending, error } = useTextAnalysis();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      mutate(text);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <h1 className="text-3xl font-display font-bold">Text Health Analysis</h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Describe your symptoms, feelings, or concerns in detail. Our AI will analyze them to provide personalized wellness insights.
        </p>
      </div>

      <Card className="shadow-lg border-t-4 border-t-purple-400">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="E.g., I've been feeling extremely tired lately and having severe cramps in the mornings..."
              className="min-h-[150px] text-lg p-4 rounded-xl resize-none focus-visible:ring-purple-400"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!text.trim() || isPending}
                className="bg-purple-600 hover:bg-purple-700 h-12 px-6 rounded-xl font-semibold shadow-md shadow-purple-200"
              >
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> Analyze Text</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AnalysisResultCard 
            title="Analysis Results" 
            data={data} 
            className="border-t-purple-500"
          />
        </div>
      )}
    </div>
  );
}
