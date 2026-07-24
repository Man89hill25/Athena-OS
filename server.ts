import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      system: "Athena OS Kernel",
      version: "3.0.0",
      architecture: "Arabic AI Knowledge Operating System Blueprint",
      time: new Date().toISOString()
    });
  });

  // Foundation Layer Status & Self-Test Endpoint (Directive 201)
  app.get("/api/foundation/status", async (req, res) => {
    try {
      const { FoundationTestSuiteRunner, ATHENA_FOUNDATION_MANIFEST, ATHENA_VERSION_INFO } = await import("./src/foundation");
      const runner = new FoundationTestSuiteRunner();
      const testResults = await runner.runAllTests();

      return res.json({
        success: true,
        manifest: ATHENA_FOUNDATION_MANIFEST,
        version: ATHENA_VERSION_INFO.toString(),
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Docs API: List all generated blueprint files in /docs
  app.get("/api/docs", (req, res) => {
    try {
      const docsDir = path.join(process.cwd(), "docs");
      if (!fs.existsSync(docsDir)) {
        return res.json({ success: true, docs: [] });
      }

      const files = fs.readdirSync(docsDir);
      const docsList = files
        .filter((f) => f.endsWith(".md"))
        .sort()
        .map((file) => {
          const filePath = path.join(docsDir, file);
          const content = fs.readFileSync(filePath, "utf-8");
          const lines = content.split("\n");
          const titleLine = lines.find((l) => l.startsWith("# ")) || `# ${file}`;
          const title = titleLine.replace(/^#\s*/, "").trim();

          // Categorize document
          const num = parseInt(file.split("_")[0], 10);
          let category = "عام";
          if (num >= 0 && num <= 5) category = "الأساس والرؤية المعمارية";
          else if (num >= 6 && num <= 9) category = "القواعد والواجهات وRAG";
          else if (num >= 10 && num <= 19) category = "الأمان والأداء والأنظمة الفرعية";
          else if (num >= 20 && num <= 29) category = "محركات المعالجة والذكاء الاصطناعي";
          else if (num >= 30 && num <= 39) category = "المكتبات والتخزين والذاكرة";
          else if (num >= 40 && num <= 50) category = "الخارطة والمجلة والقرارات وتدقيق CTO";
          else if (num === 51) category = "نموذج المجال ونواة المعرفة (Domain Model)";
          else if (num === 52) category = "نواة المحرك الرئيسي (Athena Core Engine)";
          else if (num === 100) category = "الدستور البرمجي الموحد (Master Specification)";
          else if (num >= 101) category = "المواصفات التقنية والمواصفات التنفيذية (Tech & Implementation Specs)";

          return {
            id: file.replace(".md", ""),
            file,
            number: num,
            title,
            category,
            snippet: content.substring(0, 300) + "...",
            content
          };
        });

      return res.json({
        success: true,
        count: docsList.length,
        docs: docsList
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Unknown error" });
    }
  });

  // Get specific document by file ID
  app.get("/api/docs/:id", (req, res) => {
    try {
      const id = req.params.id;
      const fileName = id.endsWith(".md") ? id : `${id}.md`;
      const filePath = path.join(process.cwd(), "docs", fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: "Document not found" });
      }

      const content = fs.readFileSync(filePath, "utf-8");
      return res.json({
        success: true,
        id,
        file: fileName,
        content
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Unknown error" });
    }
  });

  // AI Subsystem Status & Test Endpoint (Directive 205)
  app.get("/api/ai/status", async (req, res) => {
    try {
      const { AIApplicationService, AIFullTestSuite } = await import("./src/ai");
      const service = new AIApplicationService();
      const status = service.getSystemStatus();
      const testResults = await AIFullTestSuite.runAllTests();

      return res.json({
        success: true,
        status,
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // RAG Engine Status & Test Endpoint (Directive 207)
  app.get("/api/rag/status", async (req, res) => {
    try {
      const { RAGTestSuite } = await import("./src/rag");
      const testResults = await RAGTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 207: ATHENA X ACADEMIC RAG ENGINE",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Manuscript Intelligence Platform Status & Test Endpoint (Directive 208)
  app.get("/api/manuscripts/status", async (req, res) => {
    try {
      const { ManuscriptTestSuite } = await import("./src/manuscripts");
      const testResults = await ManuscriptTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 208: ATHENA X MANUSCRIPT INTELLIGENCE PLATFORM",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Patristic & Theological Intelligence Engine Status & Test Endpoint (Directive 209)
  app.get("/api/patristics/status", async (req, res) => {
    try {
      const { PatristicTestSuite } = await import("./src/patristics");
      const testResults = await PatristicTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 209: ATHENA X PATRISTIC & THEOLOGICAL INTELLIGENCE ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Biblical Scripture Intelligence Engine Status & Test Endpoint (Directive 210)
  app.get("/api/scripture/status", async (req, res) => {
    try {
      const { ScriptureTestSuite } = await import("./src/scripture");
      const testResults = await ScriptureTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 210: ATHENA X BIBLICAL SCRIPTURE INTELLIGENCE ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Knowledge Graph Engine Status & Test Endpoint (Directive 211)
  app.get("/api/knowledge-graph/status", async (req, res) => {
    try {
      const { KnowledgeGraphTestSuite } = await import("./src/knowledge-graph");
      const testResults = await KnowledgeGraphTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 211: ATHENA X KNOWLEDGE GRAPH ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Enterprise Testing Platform Status & Test Endpoint (Directive 221)
  app.get("/api/testing/status", async (req, res) => {
    try {
      const { TestingTestSuite } = await import("./src/testing");
      const testResults = await TestingTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 221: ATHENA X ENTERPRISE TESTING PLATFORM v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Installer, Packaging & Release Engine Status & Test Endpoint (Directive 220)
  app.get("/api/release/status", async (req, res) => {
    try {
      const { ReleaseTestSuite } = await import("./src/release");
      const testResults = await ReleaseTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 220: ATHENA X INSTALLER, PACKAGING & RELEASE ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Cloud & Synchronization Engine Status & Test Endpoint (Directive 219)
  app.get("/api/cloud/status", async (req, res) => {
    try {
      const { CloudTestSuite } = await import("./src/cloud");
      const testResults = await CloudTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 219: ATHENA X CLOUD & SYNCHRONIZATION ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Performance Engine Status & Test Endpoint (Directive 218)
  app.get("/api/performance/status", async (req, res) => {
    try {
      const { PerformanceTestSuite } = await import("./src/performance");
      const testResults = await PerformanceTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 218: ATHENA X PERFORMANCE ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Security & Zero Trust Platform Status & Test Endpoint (Directive 217)
  app.get("/api/security/status", async (req, res) => {
    try {
      const { SecurityTestSuite } = await import("./src/security");
      const testResults = await SecurityTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 217: ATHENA X SECURITY & ZERO TRUST PLATFORM v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Desktop Platform Status & Test Endpoint (Directive 216)
  app.get("/api/desktop/status", async (req, res) => {
    try {
      const { DesktopTestSuite } = await import("./src/desktop");
      const testResults = await DesktopTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 216: ATHENA X ACADEMIC DESKTOP PLATFORM v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Research Workspace & Knowledge Notebook Status & Test Endpoint (Directive 215)
  app.get("/api/workspace/status", async (req, res) => {
    try {
      const { WorkspaceTestSuite } = await import("./src/workspace");
      const testResults = await WorkspaceTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 215: ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Digital Library Platform Status & Test Endpoint (Directive 214)
  app.get("/api/library/status", async (req, res) => {
    try {
      const { LibraryTestSuite } = await import("./src/library");
      const testResults = await LibraryTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 214: ATHENA X DIGITAL LIBRARY PLATFORM v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Translation & Linguistic Intelligence Engine Status & Test Endpoint (Directive 213)
  app.get("/api/translation/status", async (req, res) => {
    try {
      const { TranslationTestSuite } = await import("./src/translation");
      const testResults = await TranslationTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 213: ATHENA X TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // RAG Academic Research Engine Status & Test Endpoint (Directive 212)
  app.get("/api/rag/status", async (req, res) => {
    try {
      const { RAGTestSuite } = await import("./src/rag");
      const testResults = await RAGTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 212: ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Knowledge Graph Engine Status & Test Endpoint (Directive 206 / 211 Graph)
  app.get("/api/graph/status", async (req, res) => {
    try {
      const { GraphTestSuite } = await import("./src/graph");
      const testResults = await GraphTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "ATHENA X KNOWLEDGE GRAPH ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Canonical Law & Ecclesiastical Knowledge Engine Status & Test Endpoint (Directive 211)
  app.get("/api/canon/status", async (req, res) => {
    try {
      const { CanonicalTestSuite } = await import("./src/canon");
      const testResults = await CanonicalTestSuite.runAllTests();

      return res.json({
        success: true,
        directive: "Directive 211: ATHENA X CANONICAL LAW & ECCLESIASTICAL INTELLIGENCE ENGINE v1.0",
        verification: testResults,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || String(err) });
    }
  });

  // Server-Side AI Consultant using Gemini API
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { prompt, currentDocId } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, error: "Missing prompt" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          success: false,
          error: "GEMINI_API_KEY غير متوفر في مفاتيح النظام. يرجى تهيئته عبر إعدادات البيئة."
        });
      }

      // Load context from current doc or overview
      let docContext = "";
      if (currentDocId) {
        const filePath = path.join(process.cwd(), "docs", `${currentDocId}.md`);
        if (fs.existsSync(filePath)) {
          docContext = fs.readFileSync(filePath, "utf-8");
        }
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `أنت الخبير الهندسي والاستشاري التقني لنظام Athena OS (نظام تشغيل المعرفة والذكاء الاصطناعي العربي الأكاديمي).
تعتمد إجاباتك على الرصانة الهندسية واللغة العربية الفصيحة الدقيقة.
عند إجابة المستخدم، استشهد بالوثائق والمعايير المعمارية للمشروع (مثل 000_MASTER_PLAN, 003_ARCHITECTURE, 007_AI_ARCHITECTURE, 008_RAG_ARCHITECTURE, 019_ARABIC_SUPPORT, 022_SEARCH_ENGINE, إلخ).
قم بتقديم شروحات واضحة وعميقة هندسياً دون استخدام كلام إنشائي عام.`;

      const userMessage = docContext
        ? `بناءً على الوثيقة الحالية:\n${docContext.substring(0, 3000)}\n\nالسؤال: ${prompt}`
        : `سؤال المطور حول نظام Athena OS:\n${prompt}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: systemInstruction + "\n\n" + userMessage }] }
        ]
      });

      const reply = response.text || "لم أتمكن من الحصول على رد مفصل.";
      return res.json({ success: true, reply });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "AI request failed" });
    }
  });

  // Vite Middleware for Dev, Static serving for Prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Athena OS Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
