import { z } from 'zod';
import { insertCycleLogSchema, insertAnalysisLogSchema, cycleLogs, analysisLogs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  cycle: {
    list: {
      method: 'GET' as const,
      path: '/api/cycle' as const,
      responses: {
        200: z.array(z.custom<typeof cycleLogs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/cycle' as const,
      input: insertCycleLogSchema,
      responses: {
        201: z.object({
          averageCycleLength: z.number(),
          nextPeriodDate: z.string(),
          riskLevel: z.string(),
          currentPhase: z.string(),
          suggestions: z.array(z.string()),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  analyze: {
    text: {
      method: 'POST' as const,
      path: '/api/analyze/text' as const,
      input: z.object({ text: z.string() }),
      responses: {
        200: z.object({
          summary: z.string(),
          detectedIssue: z.string(),
          riskLevel: z.string(),
          guidance: z.string(),
          nutritionAdvice: z.string(),
          activityAdvice: z.string(),
          disclaimer: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
    voice: {
      method: 'POST' as const,
      path: '/api/analyze/voice' as const,
      input: z.object({ text: z.string() }),
      responses: {
        200: z.object({
          summary: z.string(),
          detectedIssue: z.string(),
          riskLevel: z.string(),
          guidance: z.string(),
          nutritionAdvice: z.string(),
          activityAdvice: z.string(),
          disclaimer: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
    image: {
      method: 'POST' as const,
      path: '/api/analyze/image' as const,
      // Input is FormData (multipart/form-data) containing 'image'
      responses: {
        200: z.object({
          color: z.string(),
          explanation: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history' as const,
      responses: {
        200: z.array(z.custom<typeof analysisLogs.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CycleLogResponse = z.infer<typeof api.cycle.list.responses[200]>[number];
export type PredictionResponse = z.infer<typeof api.cycle.create.responses[201]>;
export type AnalysisResponse = z.infer<typeof api.analyze.text.responses[200]>;
export type HistoryLogResponse = z.infer<typeof api.history.list.responses[200]>[number];
export type ImageAnalysisResponse = z.infer<typeof api.analyze.image.responses[200]>;
