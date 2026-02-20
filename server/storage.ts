import { db } from "./db";
import {
  cycleLogs,
  analysisLogs,
  type InsertCycleLog,
  type CycleLog,
  type InsertAnalysisLog,
  type AnalysisLog,
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createCycleLog(log: InsertCycleLog): Promise<CycleLog>;
  getCycleLogs(): Promise<CycleLog[]>;
  createAnalysisLog(log: InsertAnalysisLog): Promise<AnalysisLog>;
  getAnalysisLogs(): Promise<AnalysisLog[]>;
}

export class DatabaseStorage implements IStorage {
  async createCycleLog(log: InsertCycleLog): Promise<CycleLog> {
    try {
      console.log("Creating cycle log:", log);

      const [inserted] = await db
        .insert(cycleLogs)
        .values({
          ...log,
        })
        .returning();

      return inserted;
    } catch (error) {
      console.error("Error creating cycle log:", error);
      throw new Error("Failed to create cycle log");
    }
  }

  async getCycleLogs(): Promise<CycleLog[]> {
    try {
      return await db
        .select()
        .from(cycleLogs)
        .orderBy(desc(cycleLogs.startDate));
    } catch (error) {
      console.error("Error fetching cycle logs:", error);
      throw new Error("Failed to fetch cycle logs");
    }
  }

  async createAnalysisLog(log: InsertAnalysisLog): Promise<AnalysisLog> {
    try {
      const [inserted] = await db
        .insert(analysisLogs)
        .values(log)
        .returning();

      return inserted;
    } catch (error) {
      console.error("Error creating analysis log:", error);
      throw new Error("Failed to create analysis log");
    }
  }

  async getAnalysisLogs(): Promise<AnalysisLog[]> {
    try {
      return await db
        .select()
        .from(analysisLogs)
        .orderBy(desc(analysisLogs.createdAt));
    } catch (error) {
      console.error("Error fetching analysis logs:", error);
      throw new Error("Failed to fetch analysis logs");
    }
  }
}

export const storage = new DatabaseStorage();