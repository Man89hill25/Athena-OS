# 105_SEARCH_ENGINE_SPECIFICATION.md - المواصفات الهندسية لمحرك الكشف الأكاديمي والبحث الهجين (Unified Academic Discovery Engine)

## 1. المقدمة والأداء العام (Overview & Philosophy)
نظام البحث في **Athena X** ليس مجرد محرك بحث نصي تقليدي (Full-Text Search Engine)، ولا محرك بحث متجهي نقي (Vector Search Engine)، ولا أداة RAG معزولة؛ بل هو **محرك الكشف الأكاديمي الشامل (Unified Academic Discovery Engine)**.

صُمم هذا المحرك ليكون العقل المستكشف لنظام التشغيل المعرفي Athena X، حيث يتعامل مع الاستعلامات الأكاديمية المعقدة الممتدة عبر لغات تراثية متعددة (العربية، اليونانية القديمة، القبطية، السريانية، اللاتينية، العبرية، الإثيوبية/الجيئز، واللغات الحديثة)، مع ربط النتائج بالسياقات التاريخية، الكنسية، المخطوطية، الجغرافية، والشبكات العقائدية والآبائية.

---

## 2. المعمارية الهيكلية لمحرك الكشف الأكاديمي الشامل

```
+-----------------------------------------------------------------------------------+
|                   UNIFIED ACADEMIC DISCOVERY ENGINE (ATHENA SEARCH)               |
+-----------------------------------------------------------------------------------+
| 1. Query Understanding & Intent Parsing | 2. Multilingual Normalizer & Stemmer    |
|    - Academic, Biblical, Historical Intent   - Arabic, Greek, Coptic, Syriac, Latin  |
+-----------------------------------------------------------------------------------+
|                        HYBRID RETRIEVAL ORCHESTRATOR (RRF)                        |
|   +-----------------------+-----------------------+---------------------------+   |
|   | Tantivy FTS Engine    | LanceDB Vector Engine | Knowledge Graph Traversal |   |
|   | (BM25 Sparse Search)  | (Dense Vector Search) | (Entity & Relation Hop)   |   |
|   +-----------------------+-----------------------+---------------------------+   |
+-----------------------------------------------------------------------------------+
|                        MULTI-FACTOR ACADEMIC RANKING ENGINE                       |
|   RRF Score + BM25 + Dense Similarity + Citation Score + Historical & Authority   |
+-----------------------------------------------------------------------------------+
|                         SEARCH INTELLIGENCE & CACHING LAYER                       |
|   - Query Suggestions     - Related Entities      - Academic Citation Formatter |
|   - LRU / Persistent Cache- Smart Reranker        - Zero-Trust Audit Logger   |
+-----------------------------------------------------------------------------------+
```

---

## 3. الأنظمة الفرعية للبحث (Search Subsystems Specifications)

يشتمل محرك Athena Search على الأنظمة الفرعية التالية، وكل نظام مؤطر بهيكل مكتمل:

### 3.1. محرك البحث الهجين المركب (Hybrid Search Subsystem)
* **الغرض**: دمج البحث الحرفي السريع مع البحث الدلالي والمتجهي والشبكي لتوليد قائمة نتائج موحدة ومجودة.
* **المسؤوليات**: موازنة الأوزان بين المطابقة الحرفية الصارمة للمفردات والمطابقة الدلالية للمفاهيم عبر معادلة Reciprocal Rank Fusion (RRF).
* **المدخلات**: `SearchQueryContext` (الاستعلام، الفلاتر، معلمات اللغة، حدود الثقة).
* **المخرجات**: `UnifiedSearchResultList` (قائمة النتائج الموزونة بالأدلة والاستشهادات).
* **الاعتماديات**: `Tantivy Engine`, `LanceDB Vector Store`, `Knowledge Graph Subsystem`.
* **سير العمل (Workflow)**:
  1. استقبال الاستعلام وتحليله في `QueryUnderstandingEngine`.
  2. إرسال الاستعلام بالتوازي إلى Tantivy (FTS) و LanceDB (Vector) و Graph Engine.
  3. تجميع النتائج المتصدرة من كل محرك (Top-K).
  4. تطبيق معادلة الدمج `RRF Score = sum(1 / (k + rank_i))` مع دمج أوزان السلطة العلمية والتوثيق الأكاديمي.
  5. ترتيب النتائج وإعادتها مع وسوم الأدلة (Evidence Badges).
* **استراتيجية الترتيب والتقييم**: دمج BM25 و Dense Cosine Distance و PageRank العقد الشبكية.
* **استراتيجية التصفية والفرز**: التصفية حسب المجلد، الطبعة، العصر التاريخي، اللغة، درجة اليقين الأكاديمي.
* **استراتيجية التخزين المؤقت**: تخزين نتائج الاستعلامات الشائعة في `LRU Cache` مع إبطال تلقائي فور تحديث الفهرس.
* **قواعد الأمان**: خضوع جميع الاستعلامات لقيود الصلاحيات المحددة في `SecurityKernel`.
* **مستهدفات الأداء**: وقت الاستجابة الإجمالي < 50ms لاستعلام ممتد عبر 5 ملايين صفحة.
* **أنماط الفشل والتعافي**: في حال تعطل محرك المتجهات، يتم الانتقال التلقائي للعمل بمحرك Tantivy الحرفي فقط (Graceful Degradation).

---

### 3.2. الأقسام الفرعية التخصصية للبحث (Specialized Search Subsystems)

#### 1. البحث النصي والحرفي (Full-Text & Sparse Search Engine)
* **المسؤولية**: المطابقة الحرفية للكلمات، الجذور الصرفية، والعبارات المقتبسة باستخدام Tantivy Rust Engine و BM25 Scoring.
* **القدرات**: معالجة التشكيل، تنقية الحروف العربية (الألف والياء والتاء المربوطة)، وحساب المسافة اللفظية (Levenshtein Distance) للأخطاء الإملائية.

#### 2. البحث الدلالي والمتجهي (Semantic & Vector Search Engine)
* **المسؤولية**: البحث عن المعنى والدلالات الفكرية باستخدام تضمينات `text-embedding-004` سحابياً و `BGE-M3` محلياً عبر مكتبة LanceDB.

#### 3. بحث النصوص الكتابية والمجموعات القانونية (Bible, Patristic & Canon Law Search)
* **المسؤولية**: البحث الدقيق في أسفار الكتاب المقدس وآياته، شروحات الآباء الكنسية، والمجموعات القانونية والمجاميع المسكونية مع التوثيق المتبادل بالباب والأصل.

#### 4. بحث المخطوطات والتحقيق الضوئي (Manuscript & OCR Search)
* **المسؤولية**: البحث في النصوص المستخرجة ضوئياً من المخطوطات النادرة والكتب القديمة مع الربط برقم الجرف المكتبي وصورة المخطوط الأصلي.

#### 5. بحث الشبكة المعرفية والخط الزمني (Knowledge Graph & Timeline Search)
* **المسؤولية**: البحث عن العلاقات المنطقية بين الأشخاص، المفاهيم، المجامع، والأحداث التاريخية وتصفيتها وفق النطاق الزمني الهجري/الميلادي.

#### 6. البحث متعدد اللغات والترجمات المقارنة (Cross-Language & Translation Search)
* **المسؤولية**: التجسير اللغوي التلقائي بحيث يتيح للباحث البحث باللغة العربية للوصول إلى النصوص الأصلية باليونانية أو اللاتينية أو القبطية أو السريانية واسترجاع الترجمات المقارنة.

---

## 4. فهم الاستعلامات وتحليل النوايا (Query Understanding & Intent Detection)

يتولى `QueryUnderstandingEngine` تحليل استعلام الباحث وتحديد نية الاستعلام (Intent Discovery) وتوجيهه للمحرك الأنسب:

* **Intent Types (أنواع النوايا)**:
  * **Biblical Intent**: استعلام يستهدف آية أو سفراً (مثال: "يوحنا 1: 1" -> توجيه لبحث الأسفار والشروح الآبائية).
  * **Patristic Intent**: استعلام يستهدف نصوص وتعاليم آباء الكنيسة (مثال: "تجسد الكلمة أثناسيوس" -> توجيه لبحث الآبائيات والكتب).
  * **Historical / Timeline Intent**: استعلام يرتبط بحقبة أو مجمع تاريخي (مثال: "قرارات مجمع نيقية 325م" -> توجيه للخط الزمني والمجامع).
  * **Theological / Doctrine Intent**: استعلام عن قضية عقائدية أو لاهوتية (مثال: "طبيعة الكلمة" -> توجيه لشبكة المفاهيم والعقائد).
  * **Research / Manuscript Intent**: استعلام عن أطروحة أو مخطوط معين (مثال: "مخطوطة دير السريان رقم 14" -> توجيه للمخطوطات والكتب).

---

## 5. خوارزميات التقييم والترتيب الأكاديمي (Ranking & Scoring Algorithms)

تُحسب الدرجة النهائية لكل نتيجة بحث `FinalSearchScore` بناءً على دالة رياضية مركبة تجمع العوامل التالية:

$$\text{FinalScore} = (w_1 \cdot \text{RRFScore}) + (w_2 \cdot \text{BM25Normalized}) + (w_3 \cdot \text{DenseCosineSimilarity}) + (w_4 \cdot \text{CitationAuthority}) + (w_5 \cdot \text{HistoricalAccuracy})$$

* **BM25 Score**: تقييم مطابقة المفردات الحرفية والتكرار.
* **Dense Similarity Score**: تقييم التشابه المتجهي الدلالي في lanceDB.
* **RRF Score**: درجة الترتيب المدمج التبادلي $\frac{1}{k + \text{rank}}$.
* **Citation Authority Score**: وزن المصدر الأكاديمي ومدى استشهاد الأطاريح الأخرى به.
* **Historical & Academic Confidence Score**: درجة موثوقية الطبعة أو المخطوط المعتمد.

---

## 6. ذكاء البحث والتوصيات البحثية (Search Intelligence & Recommendations)

يقدم المحرك خدمات استكشافية ذكية تزيد من عمق البحث الأكاديمي:
* **Suggested Queries**: الاقتراح التلقائي للعبارات البحثية الأكاديمية المصحوبة بالتشكيل الصحيح.
* **Related Concepts & Fathers**: إظهار الكيانات المرتبطة فوراً بالبحث (الأشخاص، الكتب، المجامع، العقائد).
* **Research Recommendations**: توصية الباحث بمراجع ومقالات علمية مشابها ومكملة لموضوع بحثه الحالي.

---

## 7. العقود البرمجية المجردة للبحث (Search Service Contracts Interface)

تُعرّف هذه العقود الواجهات البرمجية النظيفة دون كود تنفيذي تفصيلي لضمان عدم خرق الدستور البرمجي:

```typescript
export interface SearchQueryContext {
  queryText: string;
  normalizedQuery: string;
  detectedLanguage: string;
  intents: string[];
  filters: {
    corpusIds?: string[];
    bookIds?: string[];
    authorIds?: string[];
    dateRange?: { startYear: number; endYear: number };
    languages?: string[];
  };
  pagination: { page: number; pageSize: number };
}

export interface SearchResultItem {
  id: string;
  knowledgeUri: string;
  title: string;
  excerpt: string;
  score: number;
  matchType: 'FULL_TEXT' | 'VECTOR_SEMANTIC' | 'GRAPH_RELATION' | 'HYBRID';
  sourceMetadata: {
    bookTitle: string;
    authorName: string;
    volumeNumber?: number;
    pageNumber?: number;
    footnoteNumber?: number;
  };
  citationReference: string;
}

export interface UnifiedSearchResultList {
  queryContext: SearchQueryContext;
  totalHits: number;
  executionTimeMs: number;
  results: SearchResultItem[];
  relatedConcepts: string[];
  suggestedFollowups: string[];
}

export interface ISearchEngineService {
  executeHybridSearch(context: SearchQueryContext): Promise<UnifiedSearchResultList>;
  executeBibleSearch(verseReference: string): Promise<UnifiedSearchResultList>;
  executeGraphDiscovery(entityId: string, depth: number): Promise<UnifiedSearchResultList>;
  getSearchSuggestions(partialQuery: string): Promise<string[]>;
}
```

---

## 8. الخاتمة والتوقيع الهندسي
تعد هذه الوثيقة `105_SEARCH_ENGINE_SPECIFICATION.md` المواصفة الهندسية المعتمدة لمحرك البحث والتنقيب الأكاديمي في نظام **Athena X**، وتلتزم كافة التطبيقات البرمجية المستقبلية بالخضوع لهذه القواعد دون أدنى مخالفة.

---
**توقيع معمارية محرك البحث**: *Athena X Academic Search Specification - Certified Enterprise Standard for 2045+*.
