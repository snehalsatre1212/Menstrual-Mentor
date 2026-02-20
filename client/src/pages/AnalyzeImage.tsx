import { useState, useRef } from "react";
import { useImageAnalysis } from "@/hooks/use-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisResultCard } from "@/components/ui/AnalysisResultCard";
import { Upload, ImageIcon, Loader2, X } from "lucide-react";

export default function AnalyzeImage() {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, data, isPending } = useImageAnalysis();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = () => {
    if (fileInputRef.current?.files?.[0]) {
      const formData = new FormData();
      formData.append("image", fileInputRef.current.files[0]);
      mutate(formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold">Visual Scan</h1>
        <p className="text-muted-foreground mt-2">
          Upload an image of symptoms or menstrual products for color analysis and guidance.
        </p>
      </div>

      <Card className="overflow-hidden border-dashed border-2 border-border bg-slate-50/50">
        <CardContent className="p-0">
          {!preview ? (
            <div 
              className="h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/80 transition-colors p-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-lg text-slate-700">Click to upload image</p>
              <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG</p>
            </div>
          ) : (
            <div className="relative h-96 bg-black flex items-center justify-center">
              <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 rounded-full"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>

      {preview && !data && (
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={handleUpload} 
            disabled={isPending}
            className="rounded-xl px-12"
          >
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Image...</>
            ) : (
              <><ImageIcon className="mr-2 h-4 w-4" /> Start Analysis</>
            )}
          </Button>
        </div>
      )}

      {data && (
        <AnalysisResultCard 
          title="Visual Analysis Results" 
          data={data} 
          className="border-t-blue-500 animate-in fade-in slide-in-from-bottom-4"
        />
      )}
    </div>
  );
}
