import { useMutation, useQuery } from "@tanstack/react-query";
import { api, type AnalysisResponse, type ImageAnalysisResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useTextAnalysis() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(api.analyze.text.path, {
        method: api.analyze.text.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      return api.analyze.text.responses[200].parse(await res.json());
    },
    onError: () => {
      toast({ title: "Analysis Failed", description: "Please try again later.", variant: "destructive" });
    }
  });
}

export function useVoiceAnalysis() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(api.analyze.voice.path, {
        method: api.analyze.voice.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Voice analysis failed");
      return api.analyze.voice.responses[200].parse(await res.json());
    },
    onError: () => {
      toast({ title: "Analysis Failed", description: "Please try again later.", variant: "destructive" });
    }
  });
}

export function useImageAnalysis() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.analyze.image.path, {
        method: api.analyze.image.method,
        body: formData, // Auto-sets Content-Type to multipart/form-data
      });
      if (!res.ok) throw new Error("Image analysis failed");
      return api.analyze.image.responses[200].parse(await res.json());
    },
    onError: () => {
      toast({ title: "Analysis Failed", description: "Could not process image.", variant: "destructive" });
    }
  });
}

export function useHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(api.history.list.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.history.list.responses[200].parse(await res.json());
    },
  });
}
