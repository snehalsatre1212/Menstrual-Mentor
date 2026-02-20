import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CycleLogResponse, type PredictionResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertCycleLog } from "@shared/schema";

export function useCycleLogs() {
  return useQuery({
    queryKey: [api.cycle.list.path],
    queryFn: async () => {
      const res = await fetch(api.cycle.list.path);
      if (!res.ok) throw new Error("Failed to fetch cycle logs");
      return api.cycle.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCycleLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCycleLog) => {
      const res = await fetch(api.cycle.create.path, {
        method: api.cycle.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create cycle log");
      }
      
      return api.cycle.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.cycle.list.path] });
      toast({
        title: "Cycle Logged Successfully",
        description: `Next period estimated for ${new Date(data.nextPeriodDate).toLocaleDateString()}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
