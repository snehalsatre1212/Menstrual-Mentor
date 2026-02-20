import { db } from "./db";
import { cycleLogs, analysisLogs, type InsertCycleLog, type CycleLog, type InsertAnalysisLog, type AnalysisLog } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createCycleLog(log: InsertCycleLog): Promise<CycleLog>;
  getCycleLogs(): Promise<CycleLog[]>;
  createAnalysisLog(log: InsertAnalysisLog): Promise<AnalysisLog>;
  getAnalysisLogs(): Promise<AnalysisLog[]>;
}

export class DatabaseStorage implements IStorage {
  async createCycleLog(log: InsertCycleLog): Promise<CycleLog> {
    const [inserted] = await db.insert(cycleLogs).values({
      ...log,
      startDate: new Date(log.startDate),
      endDate: new Date(log.endDate),
    }).returning();
    return inserted;
  }

  async getCycleLogs(): Promise<CycleLog[]> {
    return await db.select().from(cycleLogs).orderBy(desc(cycleLogs.startDate));
  }

  async createAnalysisLog(log: InsertAnalysisLog): Promise<AnalysisLog> {
    const [inserted] = await db.insert(analysisLogs).values(log).returning();
    return inserted;
  }

  async getAnalysisLogs(): Promise<AnalysisLog[]> {
    return await db.select().from(analysisLogs).orderBy(desc(analysisLogs.createdAt));
  }
}

export const storage = new DatabaseStorage();
