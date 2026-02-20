import { useHistory } from "@/hooks/use-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, Mic, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function History() {
  const { data: history, isLoading } = useHistory();

  if (isLoading) return <div className="p-8 text-center">Loading history...</div>;

  const getIcon = (type: string) => {
    switch (type) {
      case 'voice': return <Mic className="w-5 h-5 text-pink-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      default: return <FileText className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Analysis History</h1>
      
      <div className="grid gap-4">
        {history?.map((log) => (
          <Card key={log.id} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full">
                  {getIcon(log.type)}
                </div>
                <div>
                  <CardTitle className="text-lg capitalize">{log.type} Analysis</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(log.createdAt), 'PPpp')}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">{log.type}</Badge>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 line-clamp-2 mb-3">
                "{log.input}"
              </div>
              <div className="flex justify-end">
                <p className="text-xs text-primary font-medium flex items-center cursor-pointer hover:underline">
                  View full details <ArrowRight className="w-3 h-3 ml-1" />
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {history?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">
            No history found. Start analyzing your health today.
          </div>
        )}
      </div>
    </div>
  );
}
