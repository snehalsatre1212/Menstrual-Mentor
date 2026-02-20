import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const upload = multer({ dest: UPLOADS_DIR });

function analyzeTextLogic(text: string) {
  const lower = text.toLowerCase();
  
  let summary = "No specific issues detected.";
  let detectedIssue = "Normal";
  let riskLevel = "Low";
  let guidance = "Continue monitoring your cycle.";
  let nutritionAdvice = "Maintain a balanced diet.";
  let activityAdvice = "Light to moderate exercise is fine.";
  
  if (lower.includes("late") || lower.includes("delay")) {
    summary = "Delayed period detected.";
    detectedIssue = "Delayed Period";
    riskLevel = "Medium";
    guidance = "Stress, diet, and lifestyle can affect your cycle. Consider a pregnancy test if necessary.";
  } else if (lower.includes("pain") || lower.includes("cramps")) {
    summary = "Menstrual pain reported.";
    detectedIssue = "Menstrual Pain";
    riskLevel = "Medium";
    guidance = "A warm compress and over-the-counter pain relief can help.";
    nutritionAdvice = "Avoid caffeine and salty foods. Drink ginger tea.";
    activityAdvice = "Gentle yoga or stretching may alleviate cramps.";
  } else if (lower.includes("tired") || lower.includes("fatigue")) {
    summary = "Low energy reported.";
    detectedIssue = "Low Energy";
    riskLevel = "Low";
    guidance = "Ensure you are getting enough sleep.";
    nutritionAdvice = "Increase iron and vitamin B intake.";
  } else if (lower.includes("irregular")) {
    summary = "Irregular cycle detected.";
    detectedIssue = "Irregular Cycle";
    riskLevel = "Medium";
    guidance = "Track your cycle consistently to identify patterns.";
  } else if (lower.includes("mood")) {
    summary = "Mood fluctuations reported.";
    detectedIssue = "Mood Fluctuation";
    riskLevel = "Low";
    guidance = "Practice mindfulness and relaxation techniques.";
  }
  
  return {
    summary,
    detectedIssue,
    riskLevel,
    guidance,
    nutritionAdvice,
    activityAdvice,
    disclaimer: "This app provides wellness guidance only and does not replace medical consultation."
  };
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.post(api.cycle.create.path, async (req, res) => {
    try {
      const input = api.cycle.create.input.parse(req.body);
      
      // Save cycle log
      await storage.createCycleLog(input);
      
      // Calculate prediction
      const logs = await storage.getCycleLogs(); // Gets them ordered desc by startDate
      
      let averageCycleLength = 28;
      let nextPeriodDate = new Date();
      let riskLevel = "Low";
      let currentPhase = "Unknown";
      let suggestions = ["Track your symptoms daily"];
      
      if (logs.length >= 2) {
        // Sort chronologically for calculation
        const sorted = [...logs].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        
        let totalDays = 0;
        let diffs = [];
        for (let i = 1; i < sorted.length; i++) {
          const diffTime = sorted[i].startDate.getTime() - sorted[i-1].startDate.getTime();
          const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
          totalDays += diffDays;
          diffs.push(diffDays);
        }
        
        averageCycleLength = Math.round(totalDays / (sorted.length - 1));
        
        const lastStart = sorted[sorted.length - 1].startDate;
        nextPeriodDate = new Date(lastStart.getTime() + averageCycleLength * 24 * 60 * 60 * 1000);
        
        let minDiff = Math.min(...diffs);
        let maxDiff = Math.max(...diffs);
        
        if (averageCycleLength < 21) {
          riskLevel = "Medium";
          suggestions = ["Short cycle detected. Ensure adequate nutrition and rest."];
        } else if (averageCycleLength > 35) {
          riskLevel = "Medium";
          suggestions = ["Long cycle detected. Consider stress reduction techniques."];
        }
        
        if ((maxDiff - minDiff) > 7) {
          riskLevel = "High";
          suggestions = ["High cycle variation. Consider consulting a healthcare provider."];
        }
      } else if (logs.length === 1) {
         nextPeriodDate = new Date(logs[0].startDate.getTime() + 28 * 24 * 60 * 60 * 1000);
      }
      
      res.status(201).json({
        averageCycleLength,
        nextPeriodDate: nextPeriodDate.toISOString(),
        riskLevel,
        currentPhase,
        suggestions
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
         return res.status(400).json({
           message: err.errors[0].message,
           field: err.errors[0].path.join('.'),
         });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.cycle.list.path, async (req, res) => {
    const logs = await storage.getCycleLogs();
    res.json(logs);
  });

  app.post(api.analyze.text.path, async (req, res) => {
    try {
      const input = api.analyze.text.input.parse(req.body);
      const result = analyzeTextLogic(input.text);
      
      await storage.createAnalysisLog({
        type: 'text',
        input: input.text,
        result: JSON.stringify(result)
      });
      
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
         return res.status(400).json({
           message: err.errors[0].message,
           field: err.errors[0].path.join('.'),
         });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.analyze.voice.path, async (req, res) => {
    try {
      const input = api.analyze.voice.input.parse(req.body);
      const result = analyzeTextLogic(input.text);
      
      await storage.createAnalysisLog({
        type: 'voice',
        input: input.text,
        result: JSON.stringify(result)
      });
      
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
         return res.status(400).json({
           message: err.errors[0].message,
           field: err.errors[0].path.join('.'),
         });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.analyze.image.path, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }
      
      const { path: filepath } = req.file;
      
      // Analyze dominant color using sharp stats
      const stats = await sharp(filepath).stats();
      const dominant = stats.dominant;
      let r = dominant.r;
      let g = dominant.g;
      let b = dominant.b;
      
      let colorClass = "unknown";
      let explanation = "Could not classify the color clearly.";
      
      // Simple classification based on r, g, b
      if (r > 150 && g < 100 && b < 100) {
        colorClass = "bright red";
        explanation = "Bright red usually indicates fresh blood and a steady flow. This is common and normal.";
      } else if (r > 80 && r <= 150 && g < 80 && b < 80) {
        colorClass = "dark red";
        explanation = "Dark red is older blood. Often seen at the beginning or end of your cycle. It is completely normal.";
      } else if (r > g && g > b && r < 150) {
        colorClass = "brown";
        explanation = "Brown is very old blood that took extra time to leave the uterus. Typically normal, especially at the start or end of your period.";
      } else if (r > 180 && g > 150 && b > 150) {
        colorClass = "pale";
        explanation = "Pale or pink blood might be diluted with cervical fluid, which can be normal, particularly during light flow.";
      } else {
        colorClass = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
        explanation = "The color varies. If you notice unusual changes in flow color, consistency, or smell, consult a healthcare provider.";
      }
      
      // Cleanup image
      fs.unlinkSync(filepath);
      
      const result = {
        color: colorClass,
        explanation: explanation + " This app provides wellness guidance only and does not replace medical consultation."
      };
      
      await storage.createAnalysisLog({
        type: 'image',
        input: "Uploaded Image",
        result: JSON.stringify(result)
      });
      
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error analyzing image" });
    }
  });

  app.get(api.history.list.path, async (req, res) => {
    const logs = await storage.getAnalysisLogs();
    res.json(logs);
  });

  // Seed data function to populate on start if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingLogs = await storage.getCycleLogs();
  if (existingLogs.length === 0) {
    const today = new Date();
    const lastMonth = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(today.getTime() - 56 * 24 * 60 * 60 * 1000);

    await storage.createCycleLog({
      startDate: new Date(twoMonthsAgo.getTime() - 5 * 24 * 60 * 60 * 1000),
      endDate: twoMonthsAgo,
      mood: "Happy",
      energyLevel: "High",
      symptoms: "None",
      flowIntensity: "Medium"
    });

    await storage.createCycleLog({
      startDate: new Date(lastMonth.getTime() - 4 * 24 * 60 * 60 * 1000),
      endDate: lastMonth,
      mood: "Anxious",
      energyLevel: "Low",
      symptoms: "Cramps",
      flowIntensity: "Heavy"
    });

    await storage.createCycleLog({
      startDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      endDate: today,
      mood: "Calm",
      energyLevel: "Medium",
      symptoms: "Headache",
      flowIntensity: "Light"
    });
  }
}
