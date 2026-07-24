# 052_CORE_ENGINE.md - المواصفات الهندسية لنواة المحرك الرئيسي (Athena Core Engine Specification)

## 1. فلسفة النواة والمعمارية العامة (Core Philosophy & Architecture)

تُشكل **نواة Athena X (Athena Core Engine)** القلب النابض والمركز الإداري الأعلى لنظام التشغيل المعرفي الأكاديمي. استناداً إلى مبادئ نُظم التشغيل والمنصات التحريرية والتطويرية الكبرى (مثل Microsoft Windows Kernel, JetBrains IntelliJ Platform, VS Code, Unreal Engine, Chrome, LLVM):

1. **السيادة المطلقة للنواة (Core Sovereignty)**: لا توجد أي وحدة، إضافة (Plugin)، واجهة مستخدم (UI)، أو خدمة خلفية تملك حق الوصول المباشر إلى الموارد أو قواعد البيانات دون المرور بالنواة عبر ناقل الأوامر والحافلات الرسمية (Command & Query Bus).
2. **الاستقلالية التامة عن المنصة (Platform Independence)**: تعتمد النواة حشواً هندسياً مجرداً يُعرف بـ **طبقة تجريد المنصة (Platform Abstraction Layer - PAL)** للتعامل مع نظام التشغيل السفلي (Windows, macOS, Linux/POSIX).
3. **العزل والأمان الشامل (Zero-Trust Security & Sandboxing)**: تعمل كافة الإضافات والعمليات غير التابعة للنواة داخل سياقات معزولة محددة الصلاحيات بالكامل.
4. **المزامنة والتوازي الموجه بالأحداث (Event-Driven Reactive Architecture)**: تبادل الرسائل والأوامر يعتمد على ناقل الأحداث (Event Bus) ذي الكفاءة العالية لمنع قفل خيوط المعالجة الرئيسية (Non-blocking I/O).

---

## 2. الهيكل والمكونات الداخلية لنواة Athena X

```
+-----------------------------------------------------------------------------------+
|                                  ATHENA CORE KERNEL                               |
+-----------------------------------------------------------------------------------+
| 1. Platform Abstraction Layer (PAL) | 2. Dependency Injection & Service Locator    |
| 3. Application Lifecycle & Startup   | 4. Security & Permissions Engine           |
+-----------------------------------------------------------------------------------+
|                          INTERNAL COMMUNICATION BUSES                             |
|    - Command Bus         - Query Bus         - Event Bus         - Hook System    |
+-----------------------------------------------------------------------------------+
|                             CORE SUBSYSTEM MANAGERS                               |
+--------------------------+--------------------------+-----------------------------+
| Workflow & Job Processing| AI Provider Orchestrator | Plugin & SDK Manager        |
| - Universal Workflows    - Multi-Model Router       - Dynamic Hot-Loading         |
| - Priority Queue Jobs    - RAG Context Manager      - Sandbox Isolation           |
+--------------------------+--------------------------+-----------------------------+
| Resource & Performance   | Knowledge Management     | Storage, Index & Search     |
| - CPU / RAM / GPU / VRAM - Object Lifecycle         - Vector / FTS Engine         |
| - Cache & Temp Manager   - Sync & History Engine    - Knowledge Graph Subsystem   |
+--------------------------+--------------------------+-----------------------------+
```

---

## 3. الوحدات والمدراء الأساسيون في النواة (Core Modules)

### 3.1. مدير المنصة والخدمات (Platform, DI & Services)
* **`PlatformAbstractionLayer (PAL)`**:
  * **الهدف**: توحيد جميع الاستدعاءات الخاصة بالعتاد، القرص، الذاكرة، وخيوط المعالجة عبر جميع نظم التشغيل.
  * **الواجهات**: `IFileSystem`, `INetworkClient`, `IProcessLauncher`, `ISystemClock`.
* **`DependencyInjectionContainer (DI)`**:
  * **الهدف**: إدارة دورة حياة كافة الخدمات داخل النظام (Singleton, Transient, Scoped) مع حاقن اعتماديات تلقائي مُمتاز لتجنب التعارضات.
  * **عقود الخدمة**: `RegisterSingleton<TInterface, TImpl>()`, `Resolve<TInterface>()`.

### 3.2. حافلات التواصل الداخلي (Internal Communication Buses)
* **`CommandBus`**: إدارة كافة الأوامر المُحدثة للحالة (State Mutations) بطريقة متزامنة أو غير متزامنة مع دعم المعاملات الذرية (Transactions) والإلغاء (Undo/Redo).
* **`QueryBus`**: استرجاع البيانات المحضّة بصفاء (Read-Only Side) لضمان فصل القراءة عن التحديث (CQRS Pattern).
* **`EventBus`**: ناقل أحداث عالمي (Publisher/Subscriber) يتيح لجميع الوحدات والإضافات التفاعل مع الأحداث الداخلية لحظياً دون إيجاد اعتماديات مباشرة (Loose Coupling).
* **`HookSystem & ExtensionPoints`**: نقاط تعليق واكتمال تتيح للإضافات (Plugins) حقن المنطق قبل وبعد تنفيذ أي عملية (Pre-Execution & Post-Execution Hooks).

### 3.3. محرك سير العمل والمهام المجدولة (Workflow & Job Processing Engine)
* **`WorkflowEngine`**:
  * **الهدف**: تمثيل كل عملية معقدة داخل Athena X كـ **سلسلة خطوات قابلة للإيقاف والتحكم (Workflow)**.
  * **أمثلة سير العمل**:
    1. *ImportBookWorkflow*: فحص الملف -> OCR -> التوحيد اللغوي -> التفتيت -> الفهرسة -> توليد المتجهات -> التحديث الشبكي.
    2. *AcademicRAGWorkflow*: معالجة الاستعلام -> استخراج المتجهات -> البحث الهجين RRF -> استدعاء Gemini -> تدقيق الاستشهادات.
* **`BackgroundJobEngine`**:
  * **الخصائص**: طابور مهام خلفي متعدد الخيوط مع دعم الأولويات (High, Normal, Low, Idle), أسباب الفشل والإعادة الذكية (Backoff Retry Policies), إمكانية التجميد المؤقت والاستئناف والإلغاء مع الحفظ الدائم لحالة المهام على القرص.

### 3.4. موجه ومتناسق الذكاء الاصطناعي (AI Orchestrator & Provider Manager)
تلتزم Athena X بعدم الارتهان بمزود ذكاء اصطناعي واحد، بل تملك طبقة تجريد فائق الموثوقية (Multi-Model Abstraction Layer):
* **المزودون المدعومون**:
  * **Gemini (Google)**: عبر حزمة `@google/genai` الرسمية (النموذج القياسي للعمليات المعقدة والتحليل العميق و RAG).
  * **OpenAI & Anthropic**: كخيار سحابي بديل عبر API Keys الخادمة.
  * **Ollama & LM Studio / Local LLM**: للتجميع والاستدلال المحلي الأوفلاين بالكامل لضمان الخصوصية وسرية المخطوطات.
* **مسؤوليات الـ AI Orchestrator**:
  1. **Routing Strategy**: توجيه كل مهمة للنموذج الأنسب (مثلاً: مهام التصنيف للنماذج السريعة، والتحقيق الأكاديمي لـ Gemini 2.5 Pro).
  2. **Prompt & Context Isolation**: ضمان حجب البيانات الحساسة أو تشفيرها قبل إرسالها.
  3. **Fallback Engine**: التبديل التلقائي للنموذج البديل في حال انقطاع الخدمة أو تجاوز الحدود (Rate Limits).

### 3.5. محرك الإضافات وحاضنة الأمان (Plugin Manager & Sandbox)
* **`PluginManager`**: المحرك المسؤول عن اكتشاف، تحميل، وتفعيل الإضافات ديناميكياً أثناء تشغيل النظام دون الحاجة لإعادة التشغيل (Hot-Loading / Hot-Unloading).
* **`PluginSDK`**: الحزمة البرمجية القياسية المتاحة للمطورين لبناء الإضافات مع تحديد الصلاحيات المطلوبة في بيان الإضافة (`plugin.manifest.json`).
* **`PluginSandbox`**: حاضنة أمان تعزل كود الإضافة وتمنعها من الوصول للقرص أو الشبكة إلا عبر الأذونات الممنوحة صراحة من المستخدم والنواة.

### 3.6. مدير الموارد والأداء (Resource & Performance Manager)
* **المراقبة والضبط اللحظي**:
  * **CPU Manager**: توزيع الأعدال الحسابية على خيوط المعالجة وإبعاد المهام الثقيلة عن خيط واجهة المستخدم.
  * **RAM & VRAM Manager**: مراقبة استهلاك الذاكرة العشوائية وتفريغ الكاش الذكي فور تجاوز حد الـ 80% لمنع تعليق النظام.
  * **Disk & Storage Cache Manager**: إدارة وتطهير الملفات المؤقتة، وفهارس التضمين المخبأة.

### 3.7. أمن وحماية النواة (Security Kernel & Encryption)
* **`SecurityKernel`**:
  * إدارة المفاتيح والحسابات بشكل معزول في الخادم.
  * التشفير الرقمي بالمعيار العسكري (AES-256-GCM) لجميع البيانات الحساسة ومفاتيح API المعتمدة.
  * سجل المراجعة والتفتيش (Audit Logging) لكل عملية تعديل أو استعلام يجري داخل النظام.

---

## 4. مسارات التواصل بين المكونات (System Communication Flow)

### 4.1. مسار تنفيذ الأوامر من الإضافة إلى النواة
```
Plugin -> Plugin Sandbox -> Plugin SDK
       -> CommandBus.Dispatch(Command)
       -> Security Kernel (Permission Audit)
       -> WorkflowEngine (Execute Steps)
       -> EventBus.Publish(DomainEvent) -> Core & External Listeners
```

### 4.2. مسار استدلال الذكاء الاصطناعي الأكاديمي (RAG Query Flow)
```
User Query -> QueryBus -> AI Orchestrator
           -> Search Manager (Hybrid RRF Index Query)
           -> Context Builder (Assemble Pages & Footnotes)
           -> Gemini / Local Provider API
           -> Verification & Citation Manager
           -> Return Response to User Interface
```

---

## 5. استراتيجيات التعافي وإدارة الأخطاء (Crash Recovery & Diagnostics)

* **`ErrorRecoveryManager`**:
  * حفظ حالة العمليات والمسودات تلقائياً كل 30 ثانية في سجل استعادة التغيرات (Write-Ahead Log - WAL).
  * عند حدوث أي انهيار غير متوقع (Crash)، يقدم النظام إعادة بناء فورية للحالة الأخيرة دون فقدان أي كلمة أو حاشية بحثية.
* **`DiagnosticsEngine & Performance Profiler`**:
  * قياس الزمن المستغرق لكل خطوة في المخطط الزمني وسير العمل بدقة الميكروثانية (Microseconds).
  * تنبيه الباحث عند وجود عنق زجاجة في سرعة استرجاع البيانات أو استجابة النواة.

---

**توقيع هندسة النواة**: *Athena Core Engine Specification - Certified Enterprise Architecture for 2045+*.
