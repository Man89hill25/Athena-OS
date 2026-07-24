# 102_TECHNOLOGY_SPECIFICATION.md - المواصفات الفنية الشاملة للحزمة التقنية والاعتمادات (Technology Stack & Dependency Specification)

## 1. الغرض والرؤية الاستراتيجية للحزمة التقنية (Purpose & Strategic Vision)
تُحدد هذه الوثيقة المرجعية المواصفات الهندسية النهائية للحزمة التقنية (Production Technology Stack) ونظام الاعتمادات المعتمد لبناء **Athena X**، بوصفه نظام تشغيل معرفي أكاديمي صامد ومستدام حتى عام **2045 وما بعده**. 

تم اختيار وتقييم كل تقنية بناءً على معايير صارمة تشمل: الأداء العالي عند التعامل مع **100,000+ كتاب** و **5 ملايين+ صفحة**، استقلالية التشغيل المحلي (Local-First)، دعم اللغات التاريخية والشرقية وفي مقدمتها اللغة العربية، الأمان المطلق، والقدرة على الهجرة أو الاستبدال السلس بدون تعطيل النظام.

---

## 2. جدول الحزمة التقنية الشامل للأنظمة الفرعية (Comprehensive Subsystems Tech Stack)

### 2.1. إطار سطح المكتب والواجهة (Desktop & UI Framework)
* **Desktop Framework**:
  * **التقنية الرئيسية**: `Tauri 2.0 (Rust Core + Webview2 / WebKitGTK)`.
  * **التقنية البديلة**: `Electron 30+`.
  * **الأسباب والمزايا**: حجم تطبيقي أقل من 50MB، استهلاك ذاكرة ساكنة أقل من 100MB RAM، أمان عالي مع حظر الاستدعاءات غير المصرح بها، دعم Rust النواة.
  * **السلبيات**: الفروقات بين محركات Webview حسب نظام التشغيل.
  * **العمر المتوقع**: 20+ سنة.
  * **استراتيجية التحديث والتحديث**: التحديث الدوري لحزم Tauri عبر Cargo وترقية محركات Webview.

* **Desktop UI & Styling**:
  * **التقنية الرئيسية**: `React 19 + Tailwind CSS v4`.
  * **التقنية البديلة**: `Vue 3 + Tailwind CSS`.
  * **الأسباب والمزايا**: معالجة معمارية الألياف الجديدة (React Fiber/Compiler)، أداء رندر فائق، دعم اتجاه النصوص RTL وأصول CSS المنطقية (Logical Properties).
  * **السلبيات**: تعقيد إدارة إعادة الرندر التلقائي في المكونات الضخمة.
  * **العمر المتوقع**: 15+ سنة.

* **UI Components**:
  * **التقنية الرئيسية**: `Radix UI Primitives + Lucide React`.
  * **التقنية البديلة**: `Headless UI`.
  * **الأسباب والمزايا**: مكونات مرنة وسلسة بدون أنماط جافة (Unstyled Primitives)، دعم إتاحة وصول قياسي (WCAG 2.1 AA)، متوافقة كلياً مع RTL.

### 2.2. البيانيات وعرض الشبكات المعرفية (Visualization & Knowledge Graph)
* **Knowledge Graph Visualization**:
  * **التقنية الرئيسية**: `Sigma.js / Cosmograph (WebGL Rendering Engine)`.
  * **التقنية البديلة**: `Cytoscape.js (Canvas Fallback)`.
  * **الأسباب والمزايا**: القدرة على عرض وتحديث +500,000 عقدة وحافة بسرعة 60fps ثابتة باستخدام محرك WebGL دون إجهاد خيط المتصفح.
  * **السلبيات**: يتطلب وجود بطاقة رسوميات (GPU) لتحقيق الأداء الأقصى.

* **Charts & Analytics**:
  * **التقنية الرئيسية**: `Recharts + D3.js (Modular Utils)`.
  * **التقنية البديلة**: `Chart.js`.
  * **الأسباب والمزايا**: التوافق الكامل مع بيئة React، مرونة رياضية عالية في D3 لمعالجة التوزيعات الإحصائية للكلمات والتحليل الزمني.

### 2.3. التعرف الضوئي والخطوط المخطوطة والمستندات (OCR, HTR & Document Engines)
* **OCR & HTR Engine (التعرف الضوئي والخطي)**:
  * **التقنية الرئيسية**: `Surya OCR / PaddleOCR (Local) + Gemini 2.5 Flash / Pro Vision (Cloud Fallback)`.
  * **التقنية البديلة**: `Tesseract 5 + TrOCR (PyTorch Core)`.
  * **الأسباب والمزايا**: Surya يوفر دقة عالية في قراءة الأعمدة المتعددة والهوامش العربية للتراث، مع دعم HTR للخطوط الخطيّة النادرة عبر Gemini Vision.

* **Document Engines (PDF, EPUB, DOCX, Markdown, HTML)**:
  * **PDF Engine**: `PDFium / pdfjs-dist` لاستخراج النصوص والطبقات الضوئية بدقة متناهية.
  * **Markdown Engine**: `unified / remark / retext / react-markdown` لمعالجة الملاحظات والهوامش الأكاديمية.
  * **EPUB Engine**: `foliate-js / epubjs` لقراءة وتحديد نصوص الكتب المرقمنة.
  * **DOCX Engine**: `mammoth.js / docx.js` للاستيراد والتصدير الأكاديمي.
  * **HTML Engine**: `Turndown + Cheerio` لتحويل مقالات شبكة الإنترنت لماركداون أكاديمي موثق.
  * **Image Engine**: `Sharp` للقص والضبط الرقمي والمعالجة المسبقة للصور الممسوحة ضوئياً.

### 2.4. معالجة اللغات الطبيعية والتاريخية (NLP Engines)
* **Arabic NLP**: `CamelTools + Farasa + Stanza Arabic` (للتنقية، التشكيل، التحليل الصرفي، واستخراج الكيانات).
* **Greek & Latin NLP**: `CLTK (Classical Language Toolkit) + Stanza Classical`.
* **Coptic & Syriac NLP**: `Coptic Scriptorium NLP + Beth Mardutho Toolkit`.
* **Hebrew & Ge'ez NLP**: `Dicta Hebrew NLP + HornMorpho Ethiopic`.
* **Language Detection**: `FastText / CLD3` لتحديد لغة الفقرات تلقائياً بمعدل دقة 99.8%.

### 2.5. الاسترجاع والبحث الهجين وقواعد البيانات (Search & Database Engines)
* **Hybrid Search Engine**:
  * **التقنية الرئيسية**: `Reciprocal Rank Fusion (RRF) Orchestrator`.
* **Full Text Search (FTS)**:
  * **التقنية الرئيسية**: `Tantivy (Rust Embedded Search Engine)` مع دعم `SQLite FTS5` للنسخ الخفيفة.
  * **المزايا**: أسرع بـ 10 أضعاف من FTS5 في الكلمات العربية المركبة مع دعم الجذور والمترادفات.
* **Vector Database**:
  * **التقنية الرئيسية**: `LanceDB Embedded (Zero-Copy Apache Arrow)` / `Qdrant Embedded`.
  * **المزايا**: معالجة المليارات من المتجهات محلياً على القرص دون تحميل كامل الذاكرة العشوائية.
* **Relational Database**:
  * **التقنية الرئيسية**: `SQLite3 (WAL Mode) + Drizzle ORM`.
  * **المزايا**: سرعة فائقة، أمان متكامل، وإمكانية إجراء المهاجرة والتحديثات بسهولة.

### 2.6. محرك الذكاء الاصطناعي والتوجيه (AI & Orchestration Stack)
* **LLM Providers Integration**:
  * **السحابي الرئيسي**: `@google/genai SDK` (لاستدعاء Gemini 2.5 Flash / Pro).
  * **السحابي البديل**: `Anthropic SDK`, `OpenAI SDK`, `OpenRouter`.
  * **المحلي**: `Ollama / llama.cpp / vLLM Native Wrapper`.
* **Embedding Models**:
  * `text-embedding-004` (Gemini Cloud) + `BGE-M3 (Multilingual Local Embedding)`.
* **Reranking Models**:
  * `BGE-Reranker-v2-m3` محلياً لتطبيق إعادة ترتيب نتائج البحث الأكاديمي.

### 2.7. البنية التحتية والنواة والنظام الفرعي (Infrastructure & Core Subsystems)
* **Workflow Engine**: `Universal Async DAG Workflow (TypeScript / Rust Worker-based)`.
* **Event Bus & Messaging**: `Typed EventEmitter2 / RxJS Core Bus`.
* **Command & Query Bus**: `Custom In-Memory CQRS Bus`.
* **Dependency Injection**: `tsyringe / InversifyJS`.
* **Logging**: `Pino (Low Overhead JSON Logger)`.
* **Secrets & Encryption**: `Keytar (OS Native Keyring) + Web Crypto API (AES-256-GCM)`.
* **Caching**: `LRU-Cache + LevelDB Persistent Cache`.
* **Background Jobs**: `Node.js Worker Threads Pool / Rust Tokio Async Workers`.
* **Plugin SDK Sandbox**: `QuickJS Engine / WebAssembly Component Model`.
* **Build System & Package Manager**: `Vite + Esbuild + Cargo` مع `pnpm`.

---

## 3. مصفوفة توافق أنظمة التشغيل (OS Compatibility Matrix)

| نظام التشغيل (OS) | طراز المعالج (Arch) | الدعم والجاهزية | محرك الرندر (Webview) | الأداء المتوقع |
| :--- | :--- | :--- | :--- | :--- |
| **Windows 11** | x64 / ARM64 | دعم كامل ممتاز (Native) | WebView2 (Chromium) | 60 fps / < 50ms Search |
| **Windows 10** | x64 | دعم كامل ممتاز (Native) | WebView2 (Chromium) | 60 fps / < 50ms Search |
| **macOS 13+** | Apple Silicon (M1-M4) | دعم كامل ممتاز (Native) | WKWebView (Metal-accelerated) | 60 fps / < 30ms Search |
| **macOS 12+** | Intel x64 | دعم كامل (Native) | WKWebView | 60 fps / < 60ms Search |
| **Linux (Ubuntu/Debian/Fedora)** | x64 / ARM64 | دعم كامل ممتاز | WebKitGTK | 60 fps / < 50ms Search |
| **Future Mobile (iOS/Android)** | ARM64 | جاهزية معمارية مستقبلية | WKWebView / Android WebView | 30-60 fps (Lite View) |

---

## 4. مصفوفة مزودي الذكاء الاصطناعي (AI Provider Matrix)

| المزود (Provider) | النمط (Mode) | النماذج الرئيسية | حالات الاستخدام في Athena X | الاستقلالية المحلية |
| :--- | :--- | :--- | :--- | :--- |
| **Gemini (Google)** | Cloud API | `gemini-2.5-flash`, `gemini-2.5-pro` | التحقيق العميق، RAG الأكاديمي، OCR المخطوطات | يتطلب إنترنت |
| **Ollama** | Local LLM | `Llama-3.3-8B`, `Qwen-2.5-14B-Arabic` | الاستدلال الأوفلاين الكامل والتدقيق الصرفي | محلي 100% |
| **vLLM / LM Studio** | Local Server | `Mistral-Small`, `Gemma-2-27B` | معالجة الدفعات الحسابية الضخمة | محلي 100% |
| **Anthropic** | Cloud API | `claude-3-5-sonnet` | التفكير الأكاديمي وصياغة المقالات التخصصية | يتطلب إنترنت |
| **OpenAI** | Cloud API | `gpt-4o`, `o3-mini` | خيار بديل للاستعلام المقارن | يتطلب إنترنت |
| **OpenRouter** | Cloud Proxy | Multi-model Fallback | صمام أمان لاستمرارية الاستجابة | يتطلب إنترنت |

---

## 5. متطلبات العتاد والذكاء الاصطناعي المحلي (Local AI Hardware Matrix)

| مستوى العتاد (Tier) | المعالج (CPU) | الذاكرة (RAM) | بطاقة الرسوميات (GPU / VRAM) | النموذج المحلي القابل للتشغيل |
| :--- | :--- | :--- | :--- | :--- |
| **الحد الأدنى (Minimum)** | 4 Cores (Intel/AMD) | 8 GB RAM | Integrated GPU | `Qwen-2.5-3B-Instruct` / BGE-Small Vector |
| **الموصى به (Recommended)** | 8 Cores (Apple M1/Intel i7) | 16 GB RAM | 6-8 GB VRAM (RTX 3060 / M1 GPU) | `Llama-3.3-8B-Q4` / BGE-M3 Multilingual |
| **الاحترافي (Professional)** | 12+ Cores (M3 Max/i9/Ryzen 9) | 32-64 GB RAM | 12-24 GB VRAM (RTX 4080/4090/M3 Max) | `Qwen-2.5-14B` / `Gemma-2-27B` + Local OCR |

---

## 6. تقييم مخاطر الاعتمادات وخطة المهاجرة (Dependency Risk Assessment)

1. **مخاطر تغير رخص المكتبات المفتوحة (Licensing Risks)**:
   * **الخطر**: تحول بعض المكتبات من MIT/Apache2 إلى رخص تجارية مقيدة.
   * **خطة المهاجرة**: الاعتماد الحصري على مكتبات مسموحة تجارياً (MIT, Apache 2.0, BSD)، وتوفير طبقة تجريد (Adapters) لكل مكتبة خارجية.
2. **مخاطر تقادم محرك OCR المحلي (OCR Obsolete Risk)**:
   * **الخطر**: توقف دعم مكتبة Surya أو PaddleOCR.
   * **خطة المهاجرة**: تصميم `IOCIProvider` يسمح باستبدال المحرك بمحرك جديد (مثل Tesseract 6 أو ONNX Exported Custom Model) بأسلوب Plug-and-Play.
3. **مخاطر تغير واجهات برمجية الذكاء الاصطناعي (API Deprecation)**:
   * **الخطر**: إيقاف إحدى نسخ Gemini SDK.
   * **خطة المهاجرة**: حصر استدعاءات Gemini في الخادم الخلفي لـ Express وعزلها كلياً بداخل `GeminiProviderAdapter`.

---

## 7. التوقيع النهائي والاعتماد (Final Approval)
تُعتبر هذه المواصفات التقنية `102_TECHNOLOGY_SPECIFICATION.md` التحديد النهائي الملزم للحزمة التكنولوجية لنظام Athena X. لا يجوز إدخال أي تقنية أو مكتبة جديدة مخالفة لهذه الوثيقة إلا بموافقة صريحة ومراجعة معمارية رسمية.

---
**توقيع معمارية الحزمة التقنية**: *Athena X Technology Specification - Enterprise Certified Standard for 2045+*.
