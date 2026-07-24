import React from 'react';
import { ShieldCheck, CheckCircle2, FileCheck, Layers, Cpu, Award } from 'lucide-react';

export const ChecklistViewer: React.FC = () => {
  const directives = [
    {
      title: 'التوجيه الأول: إنشاء التوثيق الكامل المعماري (docs/ 000-049)',
      status: 'مكتمل بنسبة 100%',
      desc: 'تم إنشاء 50 وثيقة مهندسة بالكامل في المجلد docs/ بجميع أقسامها المطلوبة باللغة العربية.',
      items: [
        '000_MASTER_PLAN.md حتى 049_DECISION_LOG.md',
        'تغطية الأهداف، المسؤوليات، الاعتماديات، الهيكل الداخلي، التوسع، المخاطر، والملاحظات الهندسية لكل مستند',
        'اللغة العربية مع الحفاظ على المصطلحات والأسماء الإنجليزية للرموز والأكواد',
        'خالية تماماً من الأكواد المؤقتة والتجريبية'
      ]
    },
    {
      title: 'التوجيه الثاني: دعم اللغة العربية كخيار رئيسي (Arabic-First & RTL)',
      status: 'مكتمل بنسبة 100%',
      desc: 'تصميم الواجهات، الخطوط، اتجاه القراءة، ومحرك التوحيد اللغوي والتفتيت النصي.',
      items: [
        'دعم التنسيق RTL الأصيل مع التباين والمقاسات الأكاديمية',
        'محرك توحيد الحروف وحذف التشكيل للبحث الشامل مع الحفاظ عليه للعرض',
        'دعم القراءة المتعددة بالتبويبات',
        'خالط البحث الهجين RRF'
      ]
    },
    {
      title: 'التوجيه الثالث: أمان المفاتيح واستدعاء الذكاء الاصطناعي من الخادم',
      status: 'مكتمل بنسبة 100%',
      desc: 'عزل مفاتيح API وخادم Express المحلي والتعامل الآمن مع النماذج.',
      items: [
        'استخدام SDK الحديث @google/genai من الخادم حصراً',
        'مسارات آمنة في server.ts للبحث والتواصل واستخراج المعرفة',
        'حماية مفتاح GEMINI_API_KEY وعدم كشفه في العميل',
        'دعم النشر والتوزيع المستقل'
      ]
    },
    {
      title: 'التوجيه الرابع (Directive 002): مراجعة التقييم الهندسي للـ CTO (050_CTO_REVIEW.md)',
      status: 'مكتمل بنسبة 100%',
      desc: 'إنجاز المراجعة المعمارية النقدية الشاملة واستشراف متطلبات التوسع لملايين الصفحات و100,000 كتاب.',
      items: [
        'تحليل 22 نظاماً فرعياً ومراجعة متطلبات الميزانية البالغة 100M$',
        'تحديد المخاطر والعيوب المعمارية وعقبات التوسع على 5 و100 سنة',
        'إقرار بدائل تقنية فائقة الكفاءة (Tantivy, LanceDB, WebGL, Hybrid OCR)',
        'صياغة وثيقة القرار النهائي 050_CTO_REVIEW.md والتوقف بانتظار Directive 003'
      ]
    },
    {
      title: 'التوجيه الخامس (Directive 003): هندسة نموذج المجال (051_DOMAIN_MODEL.md)',
      status: 'مكتمل بنسبة 100%',
      desc: 'صياغة نموذج المجال الشامل (Domain Model Engineering) لنظام التشغيل المعرفي Athena X الصامد لعام 2045+.',
      items: [
        'تصميم الكيانات (Knowledge, Corpus, Book, Edition, Paragraph, Person, Council, Scripture, Graph, AI, Flashcard)',
        'تحديد مجاميع DDD والحدود السياقية (Bounded Contexts) وكائنات القيمة (Value Objects)',
        'تصميم واجهات المستودعات، الخدمات، الأوامر، والأحداث (Commands & Domain Events)',
        'صياغة وثيقة 051_DOMAIN_MODEL.md بالكامل والتوقف بانتظار Directive 004'
      ]
    },
    {
      title: 'التوجيه السادس (Directive 004): هندسة نواة المحرك الرئيسي (052_CORE_ENGINE.md)',
      status: 'مكتمل بنسبة 100%',
      desc: 'صياغة المواصفات البرمجية لنواة Athena Core Engine المتأثرة بأنظمة التشغيل والنواة القياسية العالمية.',
      items: [
        'طبقة تجريد المنصة (PAL)، حاوية حاقن الاعتماديات (DI Container)، والموجه العام للأوامر والاستعلامات',
        'محرك سير العمل الشامل (Universal Workflow Engine) وطابور المهام الخلفية المجدولة ذات الأولويات',
        'منسق وموجه الذكاء الاصطناعي متعدد المزودين (Multi-Provider AI Orchestrator: Gemini, OpenAI, Anthropic, Local LLMs)',
        'حاضنة الأمان للإضافات (Plugin Sandbox & SDK) ومدير الموارد والأداء الشامل (CPU, RAM, GPU, VRAM, Disk)',
        'صياغة وثيقة 052_CORE_ENGINE.md بالكامل والتوقف بانتظار التوجيهات التالية'
      ]
    },
    {
      title: 'التوجيه السابع (Directive 005): الدستور البرمجي الموحد (100_MASTER_SPECIFICATION.md)',
      status: 'مكتمل بنسبة 100%',
      desc: 'دمج وتوثيق كافة المعايير الهندسية والقرارات التأسيسية للمشروع في مرجع موحد وحيد للحقيقة (Single Source of Truth).',
      items: [
        'دمج الأقسام الـ 50 الكاملة (الرؤية، الأهداف، الأداء، الأمان، اللغة العربية، واستراتيجيات التخزين وقواعد البيانات)',
        'إنشاء سجل القرارات الهندسية (Engineering Decision Register) مع بيان الخيارات البديلة والتوازنات',
        'بناء قائمة التحقق الشاملة (Master Project Checklist) لجميع المكونات والوحدات',
        'صياغة وثيقة 100_MASTER_SPECIFICATION.md وتطبيق قاعدة عدم جواز مخالفة الدستور لأي كود مستقبلي'
      ]
    },
    {
      title: 'التوجيه الثامن (Directive 007): المواصفات الفنية الشاملة للحزمة التقنية والاعتمادات (102_TECHNOLOGY_SPECIFICATION.md)',
      status: 'مكتمل بنسبة 100%',
      desc: 'صياغة التحديد التكنولوجي الصارم لجميع الأنظمة الفرعية ومصادر الاعتمادات الصامدة لعام 2045+.',
      items: [
        'تحديد تقنيات جميع الأنظمة الفرعية (Desktop Framework, UI, Knowledge Graph WebGL, OCR/HTR, Document Engines, NLP)',
        'تحديد قواعد البيانات (Tantivy, LanceDB, SQLite/WAL) ومحركات الذكاء (Gemini, Ollama, Local Models)',
        'بناء مصفوفة التوافقية لأنظمة التشغيل (Windows 11/10, Linux, macOS, Future Mobile)',
        'بناء مصفوفة عتاد الذكاء الاصطناعي المحلي (Minimum, Recommended, Professional Hardware Tiers)',
        'تقييم مخاطر الاعتمادات والتقادم وبناء خطة المهاجرة الصارمة والتوقيع النهائي 102_TECHNOLOGY_SPECIFICATION.md'
      ]
    },
    {
      title: 'التوجيه التاسع (Directive 010): محرك الكشف الأكاديمي والبحث الهجين (105_SEARCH_ENGINE_SPECIFICATION.md)',
      status: 'مكتمل بنسبة 100%',
      desc: 'صياغة الهندسة المكتملة لمحرك الكشف الأكاديمي الشامل المركب من البحث الحرفي والدلالي والشبكي والزمني.',
      items: [
        'تصميم محرك الكشف الأكاديمي الشامل والأنظمة الفرعية الـ 30+ المخصصة للأسفار والآباء والمخطوطات والقوانين',
        'تطوير خوارزميات فهم الاستعلامات (Query Understanding Engine) وتحليل النوايا الأكاديمية والكنسية واللغوية',
        'تصميم دالة التقييم والترتيب الأكاديمي الموزونة (BM25 + Dense Cosine + RRF + Citation & Historical Confidence)',
        'تضمين خدمات ذكاء البحث، الاقتراحات التلقائية، التوصيات الأكاديمية، والبحث متعدد اللغات التراثية (Cross-Language)',
        'صياغة العقود البرمجية الواصفة للخدمة (Search Contracts) وتوقيع وثيقة 105_SEARCH_ENGINE_SPECIFICATION.md'
      ]
    },
    {
      title: 'التوجيه العاشر (Directive 201): توليد الشفرة المصدريّة لطبقة الأساس (Foundation Layer Generation v3.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بناء الشفرة البرمجية الإنتاجية الكاملة لطبقة الأساس الهندسية (Foundation Layer) واجتياز كافة اختبارات الوحدة التلقائية.',
      items: [
        'تأسيس ثوابت النظام، معلومات الإصدار (Version v3.0)، ملف التعريف (Manifest)، والملفات البيئية (Profiles)',
        'تطوير حاوية حاقن الاعتماديات الكلية (Full IoC Dependency Injection Container) وتفادي التبعيات الدائرية',
        'تطوير نظام التهيئة الهرمية الآمنة (Hierarchical Config Provider) مع دعم الفريز والتجميد الفوري',
        'بناء السجل المهيكل للرصد (Structured Logger)، ومحاكيات التشخيص والبروبس (Diagnostics Probes)',
        'تأمين مراقبة الصحة (Health Monitor)، وجمع القياسات والتلخيصات (Metrics & Telemetry Collector)',
        'كتابة محرك الاختبارات الذاتية (Foundation Test Suite) بإنتاجية 100% بدون أي كود مؤقت أو TODO'
      ]
    },
    {
      title: 'التوجيه الحادي عشر (Directive 207): محرك الاسترجاع والمعرفة الأكاديمي (ATHENA X ACADEMIC RAG ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'إنشاء محرك الاسترجاع المعرفي الهجين وتطبيق خط التوليد الأكاديمي الخماسي مع التحقق التلقائي واجتياز اختبارات الوحدة.',
      items: [
        'طبقة ذكاء المستندات والتحميل والتفتيت مع دعم لغات التراث (العربية، اليونانية القديمة، القبطية، السريانية، اللاتينية، العبرية، الجييز)',
        'محرك الاسترجاع الهجين الرباعي (BM25, Vector Search, Knowledge Graph, Citation Anchor Retrieval)',
        'خوارزميات الترتيب والدمج المتقدمة (Reciprocal Rank Fusion RRF, Academic Authority, Historical Confidence)',
        'خدمة التضمين المتجهي المحلي والسحابي (Ollama, vLLM, Sentence Transformers, Gemini, OpenAI)',
        'مجمع السياق وميزانية التوكينات الذكية (Context Assembler & Token Budgeting)',
        'خط التوليد الأكاديمي الخماسي (Research, Analysis, Synthesis, Verification, Citation)',
        'محرك التحقق وحساب درجات الموثوقية وتغطية الاستشهادات (RAGVerificationEngine)',
        'حزمة اختبارات الوحدة المتكاملة RAGTestSuite وتوثيق المعمارية بالكامل في /src/rag/README.md'
      ]
    },
    {
      title: 'التوجيه الثاني عشر (Directive 208): منصة الذكاء الاصطناعي للمخطوطات (ATHENA X MANUSCRIPT INTELLIGENCE PLATFORM v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بناء معمارية القراءة الضوئية للمخطوطات والتحليل الباليوجرافي والجهاز النقدي والتصدير المعياري TEI XML.',
      items: [
        'نموذج المخطوطات والبيانات الهيكلية (Codex, Papyrus, Scroll, Printed Edition, Digital Manuscript)',
        'خط القراءة الضوئية متعدد المحركات (Surya OCR, PaddleOCR, Tesseract, Gemini Vision Adapter)',
        'محرك القراءة اليدوية للخطوط القديمة (HTR Engine) للغات (القبطية، اليونانية، العربية، السريانية، اللاتينية)',
        'محرك التحليل الباليوجرافي وتحديد الخط والتأريخ (Paleography Engine: Script Identification & Dating)',
        'محرك دراسة الاختلافات والجهاز النقدي (Textual Variant Engine & Critical Apparatus Generation)',
        'المُصدر الأكاديمي الموحد بلغة TEI P5 XML (TEIExporter)',
        'حزمة اختبارات الوحدة التكاملية ManuscriptTestSuite وتوثيق المعمارية بالكامل في /src/manuscripts/README.md'
      ]
    },
    {
      title: 'التوجيه الثالث عشر (Directive 209): محرك الذكاء الاصطناعي الأبائي واللاهوتي (ATHENA X PATRISTIC ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بناء المعمارية الكاملة لنصوص وتفاسير ومجامع الآباء وإتاحة التوثيق النقد مقارن والأبحاث الآبائية المتكاملة.',
      items: [
        'نموذج المجال الأبائي والمدونات الخمس (اليونانية، اللاتينية، السريانية، القبطية، والتراث المسيحي العربي)',
        'محرك المدونة الأبائية والفهرسة وتربيط الآباء والأعمال والاستشهادات والسلاسل الكتابية (PatristicCorpusEngine)',
        'محرك البحث الهجين الأبائي وحساب درجات الموثوقية الأصالة وسلطة الاستشهاد (PatristicSearchEngine)',
        'محرك التفسير المقارن للأسفار القانونية الأولى والثانية ورصد مدارس ألكسندرية وأنطاكية (PatristicExegesisEngine)',
        'محرك اللاهوت والمجامع المسكونية والمكانية وقوانين الإيمان والدفاع ضد الهرطقات (TheologyIntelligenceEngine)',
        'وكيل أبحاث الذكاء الاصطناعي الأبائي الربط مع الرؤية والمخطوطات والشبكة المعرفية وRAG (PatristicAIAgent)',
        'محرك الهوامش والمراجع بأساليب (SBL Academic, Chicago, APA, MLA) وبناء الحواشي بـ PatristicCitationEngine',
        'محرك التحقق وحساب درجات الأدلة التاريخية والمخطوطية المعتمدة (PatristicVerificationEngine)',
        'حزمة اختبارات الوحدة التكاملية والأداء PatristicTestSuite وتوثيق المعمارية بالكامل في /src/patristics/README.md'
      ]
    },
    {
      title: 'التوجيه الرابع عشر (Directive 210): محرك الذكاء الاصطناعي للنصوص والأسفار الكتابية (ATHENA X SCRIPTURE ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بناء المعمارية الأكاديمية الكاملة لنصوص والترجمات والنقد النصي وجهاز المخطوطات والبحث الهجين للأسفار الكتابية.',
      items: [
        'نموذج المجال الكتابي والعهد القديم والجديد والأسفار القانونية الثانية بكافة اللغات الكتابية (ScriptureDomainModel)',
        'محرك النصوص والمعالجة والمعايرة وفهرسة الآيات وبناء المتوازيات (ScriptureCorpusEngine)',
        'محرك البحث الهجين الكتابي (BM25 + Vector + Graph) والترتيب بسلطة المخطوطات والأبائيات (ScriptureSearchEngine)',
        'محرك اللغات الكتابية والتحليل الصرفي والإعراب والاستخراج الجذري للعبرية واليونانية والسريانية والقبطية (BiblicalLanguageEngine)',
        'محرك التفسير والتوليف الأبائي والربط مع التوجيه 209 (BiblicalExegesisEngine)',
        'محرك النقد النصي وتصنيف الاختلافات وبناء جهاز النقد النقدي (TextualCriticismEngine)',
        'وكيل أبحاث الذكاء الاصطناعي الكتابي المنسجم مع الذكاء والمخطوطات والرؤية (BiblicalAIAgent)',
        'محرك التوثيق والمراجع والهوامش الأكاديمية بأساليب (SBL Academic, Chicago, APA, MLA) بـ ScriptureCitationEngine',
        'محرك التحقق وحساب درجات الثقة النصية وموثوقية الترجمة والدعم المخطوطي (ScriptureVerificationEngine)',
        'حزمة اختبارات الوحدة التكاملية والأداء ScriptureTestSuite وتوثيق المعمارية بالكامل في /src/scripture/README.md'
      ]
    },
    {
      title: 'التوجيه الخامس عشر (Directive 211): محرك الذكاء الاصطناعي للقانون الكنسي والمعرفة المجتمعية (ATHENA X CANON ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بناء المعمارية الأكاديمية التشريعية الكاملة للقوانين الكنسية والمجامع المسكونية والمكانية والتعليل القانوني المقارن.',
      items: [
        'نموذج المجال التشريعي الكنسي والمجموعات القانونية والتقاليد الكنسية الكبرى (CanonDomainModel)',
        'محرك المدونة القانونية وفهرسة التشريعات والمجامع وتتبع النوموكانون (CanonCorpusEngine)',
        'محرك استخبارات المجامع الكنسية والمدى الزمني وشخصيات وقرارات نيقية والقسطنطينية وأفسس وخلكيدونية (CouncilIntelligenceEngine)',
        'محرك البحث الهجين التشريعي (BM25 + Vector + Graph) والترتيب بسلطة القانون الكنسي (CanonicalSearchEngine)',
        'محرك المصطلحات اللغوية الكنسية وإعراب المفاهيم باليونانية واللاتينية والقبطية والسريانية والعربية (CanonicalLanguageEngine)',
        'محرك التعليل المقارن بين التقاليد القانونية المختلفة وبناء علاقات التوافق والتمايز (CanonicalReasoningEngine)',
        'وكيل أبحاث الذكاء الاصطناعي التشريعي المنسجم مع الذكاء الاصطناعي والشبكة المعرفية وRAG والأبائيات والأسفار (CanonicalAIAgent)',
        'محرك التوثيق والمراجع التشريعية والهوامش بأساليب (SBL, Chicago, APA, MLA) بـ CanonicalCitationEngine',
        'محرك التحقق وحساب درجات الأصالة القانونية والأدلة المخطوطية (CanonicalVerificationEngine)',
        'حزمة اختبارات الوحدة التكاملية والأداء CanonicalTestSuite وتوثيق المعمارية بالكامل في /src/canon/README.md'
      ]
    },
    {
      title: 'محرك الرسم البياني المعرفي واستخبارات العلاقات الأكاديمية (ATHENA X KNOWLEDGE GRAPH ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بناء معمارية الرسم البياني المعرفي الشاملة بـ 14 أنطولوجيا فرعية، استخراج الكيانات، الاستعلام بـ Cypher، المسح بـ Dijkstra، التصدير لـ Sigma.js و Neo4j.',
      items: [
        'نموذج الأنطولوجيا الكنسية واللاهوتية بـ 14 مجال فرعي (ontology.ts & graph-types.ts)',
        'محرك التخزين والكيانات والروابط المزدوجة بـ EntityEngine & RelationshipEngine & KnowledgeGraph',
        'لغة الاستعلام والبحث الهجين بـ Cypher Match Pattern API & HybridGraphSearchEngine',
        'خوارزميات المسح والتحليل الشبكي بـ BFS & Dijkstra Shortest Path & Network Analytics Engine',
        'محرك التسلسل الزمني كشف الخلل الزمني Anachronism Detection بـ TimelineEngine',
        'محرك تحليل شبكة الاستشهادات Citation Impact Analyzer بـ CitationNetworkEngine',
        'محولات التصدير والتصور البصري بـ Sigma.js JSON, JSON-LD, و Neo4j Cypher scripts',
        'وكيل أبحاث الذكاء الاصطناعي للرسم البياني المعرفي بـ KnowledgeGraphAIAgent',
        'محرك التحقق وضبط الجودة والإنتاجية بـ GraphVerificationEngine',
        'حزمة اختبارات الوحدة الأكاديمية والأداء KnowledgeGraphTestSuite وتوثيق المعمارية بالكامل في /src/knowledge-graph/README.md'
      ]
    },
    {
      title: 'محرك أبحاث الاسترجاع المعزز بالأدلة الأكاديمية (ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بناء معمارية RAG الشاملة للبحث والتنقيب بـ 4 استراتيجيات تجزيء، البحث الهجين BM25 + Dense، كشف الهلاوس، وإدارة الميزانية اللفظية.',
      items: [
        'نموذج البيانات ومحرك تجزيء النصوص الأكاديمية (rag-types.ts & chunking.ts)',
        'محرك التضمين المتعدد اللغات والبحث الهجين (embeddings.ts, retriever.ts, reranker.ts, retrieval.ts)',
        'التوثيق وصياغة السياق والاستشهاد الهامشي (citation-aware.ts, academic-context.ts, context-builder.ts)',
        'محرك صياغة التعليمات البرمجية ومزودي الذكاء الاصطناعي (prompt-builder.ts)',
        'كشف الهلاوس الدلالية والتحقق من المصادر الأثرية (source-verification.ts & hallucination-detector.ts)',
        'محول الترجمة ورسم الخرائط المصطلحية المتقاطعة (cross-language.ts)',
        'وكيل الأبحاث الاسترجاعية الذكي ومحرك التحقق (rag-agent.ts & verification.ts)',
        'حزمة اختبارات الوحدة والإنتاجية RAGTestSuite وتوثيق المعمارية بالكامل في /src/rag/README.md'
      ]
    },
    {
      title: 'منصة الذكاء اللغوي والترجمة الأكاديمية (ATHENA X TRANSLATION & LINGUISTIC INTELLIGENCE ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بناء منصة الترجمة الشاملة والتحليل اللغوي لـ 9 لغات قديمة وأكاديمية مع بناء السطور المتداخلة Interlinear وتصديع TEI/TMX/XLIFF.',
      items: [
        'المحركات اللغوية المتخصصة للغات القديمة 9 لغات (greek, coptic, syriac, hebrew, latin, geez, arabic)',
        'معاجم الآباء والألفاظ الأبائية وقواميس الكتاب المقدس (dictionary-engine.ts & lexicon-engine.ts)',
        'محرك الصرف الموحد والإعراب النحوي والتحليل الدلالي (morphology-engine.ts, syntax-engine.ts, semantic-engine.ts)',
        'محرك المحاذاة المتوازية وبناء السطور المتداخلة Interlinear Builder (alignment-engine.ts)',
        'مصفوفة التكافؤ المصطلحي المتقاطع ومستودع الذاكرة الترجمية (cross-language.ts & parallel-corpus.ts)',
        'المحرك الرئيسي وتوليد التنسيقات الأكاديمية TEI XML / TMX / XLIFF / Markdown (translation-engine.ts)',
        'وكيل الترجمة الذكي ومحرك التحقق والبيانات (translation-agent.ts & verification.ts)',
        'حزمة اختبارات اللغويات الترجمية TranslationTestSuite وتوثيق المعمارية في /src/translation/README.md'
      ]
    },
    {
      title: 'منصة المكتبة الرقمية والأرشيف الأكاديمي (ATHENA X DIGITAL LIBRARY PLATFORM v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'إدارة وفهرسة وأرشفة وحفظ المجموعات الأكاديمية والمخطوطات عبر معايير Dublin Core, MARC21, MODS, METS, TEI, IIIF 3.0, OAI-PMH, OPDS, Z39.50.',
      items: [
        'المعايير المكتبية الدولية (dublin-core.ts, marc21-engine.ts, mods-engine.ts, mets-engine.ts, tei-library.ts)',
        'بروتوكولات المشاركة والتبادل الرقمي IIIF 3.0, OAI-PMH 2.0, OPDS, Z39.50 (iiif-engine.ts, oai-pmh-engine.ts, opds-engine.ts, z3950-engine.ts)',
        'التحكم بالاستناد والمعرفات الدائمة والحفظ الرقمي OAIS (authority-control.ts, identifier-engine.ts, preservation-engine.ts, duplicate-detector.ts)',
        'المحرك الرئيسي والوكيل الأكاديمي ومحرك البحث والتوصيات (library-engine.ts, library-agent.ts, recommendation-engine.ts)',
        'حزمة اختبارات المكتبة الرقمية LibraryTestSuite وتوثيق المعمارية في /src/library/README.md'
      ]
    },
    {
      title: 'بيئة البحث العلمي ودفتر الملاحظات الأكاديمي (ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'تدوين الملاحظات المترابطة (Zettelkasten/Backlinks)، المراجع الببليوجرافية (BibTeX/Chicago)، التظليل والتعليق الحاشي، شجرات المفاهيم، والتصدير لـ LaTeX, TEI, HTML, JSON.',
      items: [
        'تدوين الملاحظات المعرفية والوصلات الخلفية MOCs/Backlinks (academic-notes.ts, knowledge-notebook.ts)',
        'إدارة المراجع والحواشي والتظليل المتعدد (citation-manager.ts, annotation-engine.ts, highlight-engine.ts, tagging-engine.ts)',
        'أدوات التخطيط والتحليل البصري Outline, MindMap, Timeline, Comparison (outline-engine.ts, mindmap-engine.ts, timeline-workspace.ts, comparison-workspace.ts)',
        'إدارة المشاريع البحثية وقوائم القراءة والمهام والتعاون (project-manager.ts, reading-list.ts, task-manager.ts, collaboration-engine.ts)',
        'محرك التصدير الأكاديمي LaTeX / TEI / HTML / JSON وحزمة الاختبارات WorkspaceTestSuite وتوثيق المعمارية في /src/workspace/README.md'
      ]
    },
    {
      title: 'منصة سطح المكتب الأكاديمي (ATHENA X ACADEMIC DESKTOP PLATFORM v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'منصة سطح المكتب الهجينة المبنانيات (Tauri 2 / Native Multi-OS) مع دعم Offline Mode، إدارة النوافذ، لوحة الأوامر الشاملة، 8 لغات قديمة وحديثة، والتنسيق اليميني RTL.',
      items: [
        'المحرك الرئيسي والبيئة الهجينة Multi-OS Native Layer (desktop-runtime.ts, window-manager.ts, workspace-manager.ts, layout-manager.ts)',
        'لوحة الأوامر الشاملة واختصار الشاشة والإشعارات (command-palette.ts, shortcut-engine.ts, notification-center.ts)',
        'أشرطة الأدوات والألسنة والأقسام والإضافات الأكاديمية (dock-engine.ts, sidebar-engine.ts, tab-manager.ts, plugin-manager.ts)',
        'الإعدادات، السيمات (Academic Sepia)، التدويل 8 لغات و RTL (settings-engine.ts, theme-engine.ts, rtl-engine.ts, internationalization.ts)',
        'التحديث التلقائي والنسخ الاحتياطي واستعادة الانهيارات وحزمة الاختبارات DesktopTestSuite في /src/desktop/README.md'
      ]
    },
    {
      title: 'منظومة الأمان والتحقق الصفري (ATHENA X SECURITY & ZERO TRUST PLATFORM v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بنية أمنية سيادية متعددة الطبقات (Zero Trust, Defense in Depth) مع التشفير السيادي، إدارة الهويات، RBAC/ABAC، وحماية الذكاء الاصطناعي من حقن التعليمات.',
      items: [
        'محركات التحقق الصفري والهويات والصلاحيات (zero-trust.ts, identity-engine.ts, authentication.ts, authorization.ts, rbac.ts, abac.ts, policy-engine.ts, permission-engine.ts)',
        'الخزينة المشفرة والشفرات وإدارة المفاتيح والشهادات (credential-store.ts, secret-manager.ts, crypto-engine.ts, key-management.ts, certificate-engine.ts, secure-storage.ts)',
        'سجلات المراجعة، التوافق ISO 27001، وسلامة الأشجار الرقمية (audit-engine.ts, compliance-engine.ts, integrity-engine.ts, tamper-detection.ts)',
        'حماية الشبكة، حد معدل الطلبات، الدروع الأمنية والحاوية المعزولة (sandbox-security.ts, network-security.ts, rate-limiter.ts, csrf-engine.ts, xss-protection.ts, sql-injection.ts, content-security.ts)',
        'حماية حقن التعليمات للذكاء الاصطناعي والوكيل الأمني وحزمة الاختبارات SecurityTestSuite وتوثيق المعمارية في /src/security/README.md'
      ]
    },
    {
      title: 'منصة تحسين الأداء والتسريع الأكاديمي (ATHENA X PERFORMANCE ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بنية التحتية فائقة السرعة للتحسين الأكاديمي مع كاش LRU، تسريع SIMD و GPU، برك الخيوط والمتوازيات، الضغط وجدولة الأولويات.',
      items: [
        'محركات الكاش والذاكرة والمعالج والتسريع (performance-engine.ts, cache-engine.ts, memory-optimizer.ts, cpu-optimizer.ts, gpu-engine.ts)',
        'المعالجة المتوازية وبرك الخيوط وضغط البيانات والتحميل المرجأ (parallel-engine.ts, batch-engine.ts, thread-optimizer.ts, compression-engine.ts, lazy-loader.ts, prefetch-engine.ts)',
        'جدولة الأولويات والتحليل والتجارب المعيارية (scheduler.ts, resource-profiler.ts, performance-profiler.ts, benchmark-engine.ts)',
        'وكيل التحسين الأكاديمي الشامل واختبارات الأداء PerformanceTestSuite وتوثيق المعمارية في /src/performance/README.md'
      ]
    },
    {
      title: 'منصة المزامنة والتخزين السحابي السيادي (ATHENA X CLOUD & SYNCHRONIZATION ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بنية التحتية المتكاملة للعمل أوفلاين والمزامنة التدريجية وحل التعارضات مع مزودات التخزين السحابية المتعددة والنسخ الاحتياطي المشفر.',
      items: [
        'محركات المزامنة أوفلاين والتعارضات (sync-engine.ts, offline-sync.ts, delta-sync.ts, conflict-engine.ts, merge-engine.ts)',
        'النسخ الاحتياطي واللقطات والنسخ التاريخية (backup-engine.ts, snapshot-engine.ts, versioning-engine.ts)',
        'مزودات التخزين السحابية السبعة (google-drive.ts, onedrive.ts, dropbox.ts, s3.ts, webdav.ts, nextcloud.ts, icloud.ts)',
        'الوكيل السحابي واختبارات المزامنة CloudTestSuite وتوثيق المعمارية ومخطط Mermaid في /src/cloud/README.md'
      ]
    },
    {
      title: 'منصة الحزم والتجميع والإصدارات الرقمية (ATHENA X INSTALLER, PACKAGING & RELEASE ENGINE v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'بنية التجميع المتكاملة لنشر حزم Windows (MSI, EXE, Portable), Linux (AppImage, deb, rpm, Flatpak, Snap), و macOS (DMG, PKG) مع التوقيع الرقمي والتحديث التلقائي.',
      items: [
        'محركات البناء والتجميع والحزم العشرة (build-engine.ts, packaging-engine.ts, installer-engine.ts)',
        'التوقيع الرقمي والتشفير والتراخيص والتحقق SHA256 (signing-engine.ts, checksum-engine.ts, license-engine.ts, artifact-engine.ts)',
        'قنوات التوزيع والتحديث والتراجع المباشر (distribution-engine.ts, update-channel.ts, deployment-engine.ts, rollback-engine.ts, release-manager.ts)',
        'وكيل الإصدارات الشامل واختبارات الحزم ReleaseTestSuite وتوثيق المعمارية ومخطط Mermaid في /src/release/README.md'
      ]
    },
    {
      title: 'منصة الاختبارات والمطابقة القياسية المؤسسية (ATHENA X ENTERPRISE TESTING PLATFORM v1.0)',
      status: 'مكتمل بنسبة 100%',
      desc: 'إطار الاختبارات والمطابقة الشامل لاختبارات الوحدات، التكامل، النظام، تجربة المستخدم، الأداء، الإجهاد، الحمل المتزامن، هندسة الفوضى، والأمان مع تقارير التغطية وبوابات الجودة.',
      items: [
        'مشغّل الاختبارات والمشروعات الموحد (test-runner.ts, unit-framework.ts, integration-framework.ts, system-framework.ts, e2e-framework.ts)',
        'إطارات اختبار الضغط والحمل والفوضى والأمان والمطابقة (performance, stress, load, chaos, security, regression, compatibility, snapshot, golden-master)',
        'تغطية الكود وتقييم طفرات البرمجيات وتنسيق التقارير (coverage-engine.ts, mutation-testing.ts, quality-gates.ts, report-engine.ts)',
        'وكيل الاختبارات الشامل واختبارات المنصة TestingTestSuite وتوثيق المعمارية ومخطط Mermaid في /src/testing/README.md'
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-950 text-slate-100 max-w-5xl mx-auto">
      
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 p-6 md:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-6 h-6 text-emerald-400" />
          <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            ATHENA DIRECTIVES COMPLIANCE
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
          جدول المطابقة والمعايير القياسية لنظام Athena OS
        </h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
          تقرير التدقيق الهندسي الشامل المتوافق مع الدستور التأسيسي Directive 000 والتوجيه الهندسي Directive 001.
        </p>
      </div>

      <div className="space-y-6">
        {directives.map((dir, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                {dir.title}
              </h2>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
                {dir.status}
              </span>
            </div>

            <p className="text-xs text-slate-300">{dir.desc}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {dir.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
