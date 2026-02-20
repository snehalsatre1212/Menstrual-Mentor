import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cycleLogs = pgTable("cycle_logs", {
  id: serial("id").primaryKey(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  mood: text("mood").notNull(),
  energyLevel: text("energy_level").notNull(),
  symptoms: text("symptoms").notNull(),
  flowIntensity: text("flow_intensity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analysisLogs = pgTable("analysis_logs", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "text", "image", "voice"
  input: text("input").notNull(),
  result: text("result").notNull(), // Stored as JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCycleLogSchema = createInsertSchema(cycleLogs).omit({ id: true, createdAt: true });
export const insertAnalysisLogSchema = createInsertSchema(analysisLogs).omit({ id: true, createdAt: true });

export type CycleLog = typeof cycleLogs.$inferSelect;
export type InsertCycleLog = z.infer<typeof insertCycleLogSchema>;
export type AnalysisLog = typeof analysisLogs.$inferSelect;
export type InsertAnalysisLog = z.infer<typeof insertAnalysisLogSchema>;
