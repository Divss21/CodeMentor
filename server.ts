import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { analyzeCodeWithGemini, evaluatePracticeWithGemini } from "./server/gemini";
import { store } from "./server/store";
import { ExplanationLevel, PracticeQuestion, SupportedLanguage } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      service: "CodeMentor AI Backend",
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
    });
  });

  // Profile endpoints
  app.get("/api/profile", (_req: Request, res: Response) => {
    res.json(store.getProfile());
  });

  app.post("/api/profile/toggle-demo", (req: Request, res: Response) => {
    const { enableDemo } = req.body;
    const profile = store.setDemoMode(Boolean(enableDemo));
    res.json(profile);
  });

  app.post("/api/profile/reset", (_req: Request, res: Response) => {
    const profile = store.resetProfile();
    res.json(profile);
  });

  // Analyze code endpoint
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      const { code, language, level } = req.body as {
        code: string;
        language: SupportedLanguage;
        level?: ExplanationLevel;
      };

      if (!code || typeof code !== "string" || !code.trim()) {
        return res.status(400).json({ error: "Please provide code to analyze." });
      }

      const selectedLanguage: SupportedLanguage = language || "python";
      const selectedLevel: ExplanationLevel = level || "beginner";

      // Include previous recurring mistakes context from the profile
      const profile = store.getProfile();
      const mistakeSummary = profile.recurringMistakes
        .map(m => `- ${m.concept}: ${m.mistakeType} (${m.count} times)`)
        .join("\n");

      const analysis = await analyzeCodeWithGemini(
        code,
        selectedLanguage,
        selectedLevel,
        mistakeSummary
      );

      // Automatically update the student's profile with the new submission
      const updatedProfile = store.recordSubmission(selectedLanguage, code, analysis);

      res.json({
        analysis,
        profile: updatedProfile
      });
    } catch (err: any) {
      console.error("API /api/analyze error:", err);
      res.status(500).json({
        error: "Failed to analyze code. Please try again or inspect the syntax.",
        details: err?.message
      });
    }
  });

  // Evaluate practice attempt
  app.post("/api/practice/evaluate", async (req: Request, res: Response) => {
    try {
      const { question, submittedCode, language } = req.body as {
        question: PracticeQuestion;
        submittedCode: string;
        language: SupportedLanguage;
      };

      if (!question || !submittedCode) {
        return res.status(400).json({ error: "Missing practice question or submitted code." });
      }

      const evaluation = await evaluatePracticeWithGemini(
        question,
        submittedCode,
        language || "python"
      );

      // Update student profile with practice attempt
      const updatedProfile = store.recordPracticeAttempt(
        question,
        submittedCode,
        evaluation,
        language || "python"
      );

      res.json({
        evaluation,
        profile: updatedProfile
      });
    } catch (err: any) {
      console.error("API /api/practice/evaluate error:", err);
      res.status(500).json({
        error: "Failed to evaluate practice answer.",
        details: err?.message
      });
    }
  });

  // Vite middleware in dev, static server in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeMentor AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});
