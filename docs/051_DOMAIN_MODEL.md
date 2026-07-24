# 051_DOMAIN_MODEL.md - المواصفات الهندسية لنموذج المجال (Domain Model Specification)

## 1. المقدمة والأداء العام (Overview & Philosophy)
نظام **Athena X** ليس مجرد مكتبة رقمية، ولا تطبيقاً للملاحظات، ولا نظام إدارة ملفات PDF أو روبوت محادثة؛ بل هو **نظام تشغيل معرفي أكاديمي شمولِي (Knowledge Operating System - KOS)**.
يتمحور كل عنصر بداخل هذا النظام حول **المعرفة (Knowledge)** بوصفها كائناً حياً متطوراً، مترابطاً، قابلاً للاستدلال، وموثقاً بالدليل التاريخي والأكاديمي.

تتبع هذه المواصفات معايير **التصميم الموجه بالمجال (Domain-Driven Design - DDD)** مع تطبيق أعلى درجات التجرد المعماري المستوحاة من معماريي منصات Microsoft وJetBrains وIntelliJ لضمان استمرار وصمود النموذج حتى عام 2045 على الأقل.

---

## 2. كيانات المجال الأساسية (Domain Entities)

### 2.1. الكيانات المعرفية والنصية (Knowledge & Textual Entities)

#### Entity: `KnowledgeObject` (كائن المعرفة)
* **Purpose**: الكائن الجذري الفائق الذي يمثل أي وحدة معرفية قابلة للاستدلال والربط بداخل النظام.
* **Attributes**: `id: UUID`, `uri: KnowledgeURI`, `type: KnowledgeType`, `title: NormalizedString`, `summary: Text`, `confidenceScore: Float`, `createdAt: Timestamp`, `updatedAt: Timestamp`.
* **Relationships**: يمتلك علاقة 1-to-N مع `KnowledgeGraphNode` و N-to-M مع `Tag` و `Concept`.
* **Lifecycle**: `Draft` -> `Verified` -> `Indexed` -> `Deprecated` -> `Archived`.
* **Business Rules**: لا يمكن حذف أي `KnowledgeObject` له استشهاد أكاديمي نِشط بداخل `ResearchProject`؛ بل يُحرم أو يُؤرشّف فقط.
* **Validation Rules**: الـ `uri` يجب أن يكون فريداً على مستوى النظام بأكمله ومتبعاً لنسق `athena://knowledge/{type}/{id}`.
* **Events**: `KnowledgeCreated`, `KnowledgeUpdated`, `KnowledgeDeprecated`.
* **Permissions**: قراءة عامة للجميع؛ التعديل والإلغاء يقتصر على المحقق أو مالك النطاق المعرفي.
* **Dependencies**: لا يعتمد على أي تقنية تخزين؛ نقي بنسبة 100%.
* **Future Extensions**: دعم التضمين متعدد الأبعاد (Hyper-Dimensional Knowledge State).

#### Entity: `Corpus` (المدونة / الجسد المعرفي)
* **Purpose**: تجميع موسوعي شامل لمجموعة من الأرشيفات والكتب والمخطوطات حول مدرسة فكرية أو حُقبة تاريخية محددة.
* **Attributes**: `id: UUID`, `code: String`, `name: String`, `description: Text`, `scope: GeographicTemporalScope`, `metadata: Dictionary`.
* **Relationships**: يحتوي على 1-to-N من `Library` و 1-to-N من `Archive`.
* **Lifecycle**: `Active` -> `Locked` -> `Archived`.
* **Business Rules**: لا يمكن إضافة كتاب إلى `Corpus` مغلق دون موافقة مجلس التحقيق المعرفي.
* **Validation Rules**: الاسم رمزياً يجب ألا يقل عن 3 أحرف وألا يحتوي على رموز خاصة.
* **Events**: `CorpusCreated`, `CorpusLocked`.
* **Permissions**: الإدارة للمحقق الرئيسي فقط.
* **Dependencies**: يعتمد على `Language` و `HistoricalPeriod`.
* **Future Extensions**: الربط التلقائي عبر المستودعات العالمية التراكمية.

#### Entity: `Book` (الكتاب الأكاديمي/التراثي)
* **Purpose**: التمثيل التجميعي القياسي لأي كتاب أو مجلد علمي أو تحقيق أكاديمي.
* **Attributes**: `id: UUID`, `primaryTitle: String`, `subTitle: String`, `originalLanguage: LanguageCode`, `classificationCode: String`, `isbn: Option<String>`.
* **Relationships**: يربطه N-to-1 بـ `Author` و N-to-1 بـ `Corpus` و 1-to-N بـ `BookEdition` و 1-to-N بـ `BookVolume`.
* **Lifecycle**: `Draft` -> `Published` -> `Annotated` -> `Digitized`.
* **Business Rules**: كل كتاب يجب أن ينسب لمؤلف واحد على الأقل أو أن يُوسم بـ `AnonymousAuthor`.
* **Validation Rules**: العناوين يجب أن تخضع للتنقية الحرفية عبر `ArabicNormalizer`.
* **Events**: `BookCataloged`, `BookMetadataUpdated`.
* **Permissions**: القراءة والتصفح لجميع المستخدمين.
* **Dependencies**: `Author`, `Language`.
* **Future Extensions**: المقارنة التلقائية بين النسخ المطبوعة والمخطوطة.

#### Entity: `BookEdition` (طبعة الكتاب)
* **Purpose**: تمثيل طبعة أو تحقيق رقمي محدد لكتاب معين.
* **Attributes**: `id: UUID`, `bookId: UUID`, `editionNumber: Integer`, `publicationYear: HijriGregorianYear`, `editorId: Option<UUID>`, `publisherId: Option<UUID>`.
* **Relationships**: تنتمي لـ `Book`؛ تحتوي على 1-to-N `BookVolume`.
* **Lifecycle**: `Prepared` -> `Verified` -> `Deprecated`.
* **Business Rules**: لا يجوز خلط صفحات طبعة بطبعة أخرى في الاستشهاد الأكاديمي.
* **Validation Rules**: سنة الطبع يجب ألا تتجاوز السنة الحالية.
* **Events**: `EditionAdded`, `EditionDeprecated`.
* **Permissions**: التحقيق والتحديث للباحثين المصرح لهم.
* **Dependencies**: `Publisher`, `Editor`.
* **Future Extensions**: التفاعل مع معايير الفهارس العالمية DOI.

#### Entity: `BookChapter` & `Section` (الفصل والمبحث)
* **Purpose**: التجميع الهيكلي المنطقي للنص داخل المجلد.
* **Attributes**: `id: UUID`, `volumeId: UUID`, `chapterIndex: Integer`, `title: String`, `startPage: Integer`, `endPage: Integer`.
* **Relationships**: ينتمي لـ `BookVolume`؛ يحتوي على 1-to-N `Paragraph`.
* **Lifecycle**: `Static`.
* **Business Rules**: تسلسل الأجزاء يجب أن يكون متصلاً وغير متقاطع.
* **Validation Rules**: `startPage` <= `endPage`.
* **Events**: `ChapterIndexed`.
* **Permissions**: قراءة فقط.
* **Dependencies**: `BookVolume`.
* **Future Extensions**: التلخيص الهيكلي التلقائي بواسطة الوكلاء.

#### Entity: `Paragraph` & `Sentence` (الفقرة والجملة)
* **Purpose**: الذرة النصية الأساسية للاسترجاع المتجهي والبحث الهجين والاستشهاد.
* **Attributes**: `id: UUID`, `chapterId: UUID`, `pageNumber: Integer`, `rawContent: Text`, `normalizedContent: Text`, `hasVocalizedText: Boolean`.
* **Relationships**: تنتمي لـ `Section`؛ ترتبط بـ 1-to-1 `Embedding` و 1-to-N `Footnote`.
* **Lifecycle**: `Indexed`.
* **Business Rules**: يجب تنظيف النص الخام وتوليد النسخة المفتوحة من التشكيل فور الإنشاء.
* **Validation Rules**: الفقرة لا يجوز أن تكون فارغة.
* **Events**: `ParagraphChunked`, `SentenceParsed`.
* **Permissions**: قراءة عامة.
* **Dependencies**: `ArabicNormalizer`.
* **Future Extensions**: التحليل النحوي والصرفي المتقدم لأسلوب الكاتب.

#### Entity: `Footnote` (الحاشية / الهامش)
* **Purpose**: توثيق الشروح، الهوامش، والتعليقات التحقيقية المصاحبة للنص الأصلي.
* **Attributes**: `id: UUID`, `paragraphId: UUID`, `markerSymbol: String`, `content: Text`, `isOriginal: Boolean`.
* **Relationships**: ترتبط بـ `Paragraph` و `Citation`.
* **Lifecycle**: `Created` -> `Verified`.
* **Business Rules**: الهوامش الأصلية للكاتب تميز عن هوامش المحقق الأكاديمي.
* **Validation Rules**: رمز الحاشية يجب أن يتطابق مع الموضع في النص.
* **Events**: `FootnoteAttached`.
* **Permissions**: التحرير للمحققين.
* **Dependencies**: `Paragraph`.
* **Future Extensions**: الترجمة الآلية المستقلة للهوامش.

---

### 2.2. كيانات التوثيق والأشخاص والتاريخ (Bibliographic, Historical & Personal Entities)

#### Entity: `Person` / `ChurchFather` / `Author` (الشخصيات والعلماء والآباء)
* **Purpose**: تمثيل الشخصيات التاريخية والعلماء والمؤلفين والآباء الكنسيين.
* **Attributes**: `id: UUID`, `primaryName: String`, `titles: List<String>`, `birthYear: Option<HijriGregorianYear>`, `deathYear: Option<HijriGregorianYear>`, `biography: Text`.
* **Relationships**: يمتلك N-to-M علاقات مع `Book`, `HistoricalPeriod`, `Council`, و `KnowledgeGraphNode`.
* **Lifecycle**: `Immutable`.
* **Business Rules**: كل شخصية يجب أن تملك معرّفاً فريداً لمنع الخلط والتداخل في الأسماء المتشابهة.
* **Validation Rules**: سنة الوفاة يجب أن تكون بعد سنة الميلاد إذا توفرتا.
* **Events**: `PersonProfileCreated`, `PersonDisambiguated`.
* **Permissions**: تعديل البيانات البيوغرافية يقتصر على قسم المراجعة الأكاديمية.
* **Dependencies**: `HistoricalPeriod`, `City`.
* **Future Extensions**: شجرة الأنساب والتلمذة والتأثر الفكري (Intellectual Genealogy).

#### Entity: `Manuscript` & `ManuscriptWitness` (المخطوطة والشاهد)
* **Purpose**: توثيق النسخ الخطيّة النادرة والشهود المخطوطين للمصادر التراثية.
* **Attributes**: `id: UUID`, `manuscriptCode: String`, `holdingInstitution: String`, `scribeName: Option<String>`, `copyYear: Option<HijriGregorianYear>`, `conditionRating: Enum`.
* **Relationships**: تنتمي لـ `Book` أو `BookEdition`؛ تحتوي على N-to-M `Image` و `OCRDocument`.
* **Lifecycle**: `Cataloged` -> `Restored` -> `Digitized`.
* **Business Rules**: يجب توثيق مكان حفظ المخطوطة ورقم الجرف المكتبي (Shelfmark).
* **Validation Rules**: كود المخطوطة فريد على مستوى المؤسسة الحافظة.
* **Events**: `ManuscriptDigitized`, `WitnessLinked`.
* **Permissions**: الاطلاع مقيد بحسب حقوق النشر والمؤسسة الحافظة.
* **Dependencies**: `OCRDocument`, `Image`.
* **Future Extensions**: التحليل الرقمي لأنواع الأحبار والأوراق والتجليد.

#### Entity: `TimelineEvent` & `HistoricalPeriod` (الحدث والحقبة التاريخية)
* **Purpose**: تأطير الأحداث والمحطات الفكرية والتاريخية والكنسية زمنياً وجغرافياً.
* **Attributes**: `id: UUID`, `title: String`, `startYear: HijriGregorianYear`, `endYear: Option<HijriGregorianYear>`, `location: LocationPoint`, `summary: Text`.
* **Relationships**: ترتبط بـ N-to-M `Person`, `Council`, `Book`, و `KnowledgeGraphNode`.
* **Lifecycle**: `Active`.
* **Business Rules**: التواريخ التراثية غير المحددة بدقة تُوسم بـ `Circa`.
* **Validation Rules**: تسلسل السنوات صحيح منطقياً.
* **Events**: `TimelineEventRecorded`.
* **Permissions**: تعديل عام للباحثين والمؤرخين.
* **Dependencies**: `Location`, `HijriGregorianConverter`.
* **Future Extensions**: الخرائط التاريخية التفاعلية ثلاثية الأبعاد.

#### Entity: `Council` / `Synod` / `Empire` (المجامع والدول والإمبراطوريات)
* **Purpose**: توثيق المؤسسات الدينية، المجامع المسكونية والمحلية، الكيانات السياسية، والقرارات الكنسية.
* **Attributes**: `id: UUID`, `name: String`, `year: HijriGregorianYear`, `locationCityId: UUID`, `canonsIssued: List<String>`, `outcomes: Text`.
* **Relationships**: يرتبط بـ N-to-M `Person`, `Canon`, و `HistoricalPeriod`.
* **Lifecycle**: `HistoricalImmutable`.
* **Business Rules**: يجب تدوين القرارات والمراسيم الناتجة عن المجمع بوضوح.
* **Validation Rules**: يجب وجود موقع جغرافي وسنة محددة.
* **Events**: `CouncilCataloged`.
* **Permissions**: تعديل أكاديمي محمي.
* **Dependencies**: `City`, `Canon`.
* **Future Extensions**: الربط الذكي مع المجموعات القانونية والكنسية العالمية.

---

### 2.3. الكيانات اللاهوتية والدينية والنسكية (Theological & Scriptural Entities)

#### Entity: `BibleBook`, `BibleChapter` & `BibleVerse` (النص الكتابي المقدس)
* **Purpose**: التوثيق الدقيق لأسفار الكتاب المقدس بفصوله وآياته والترجمات التاريخية المختلفة.
* **Attributes**: `id: UUID`, `testament: Enum(OldTestament, NewTestament, Deuterocanonical)`, `bookIndex: Integer`, `chapterIndex: Integer`, `verseIndex: Integer`, `text: Text`, `translationVersion: String`.
* **Relationships**: ترتبط بـ 1-to-N `Commentary` و `PatristicCommentary` و `Citation`.
* **Lifecycle**: `CanonicalImmutable`.
* **Business Rules**: لا يجوز تعديل النص الكتابي المعتمد؛ التعديلات فقط في الشروح أو الترجمات المقارنة.
* **Validation Rules**: ترقيم الآيات يجب أن يتطابق مع النطاق المعياري لكل سفر.
* **Events**: `ScriptureReferenced`.
* **Permissions**: قراءة عامة، غير قابل للتعديل المباشر.
* **Dependencies**: None.
* **Future Extensions**: مقارنة الترجمات بالنصوص الأصلية باللغات العبرية واليونانية والآرامية.

#### Entity: `PatristicCommentary` (الشروحات والتفاسير الآبائية)
* **Purpose**: توثيق تفاسير الآباء والكتابات اللاهوتية القديمة للأسفار والموضوعات.
* **Attributes**: `id: UUID`, `fatherId: UUID`, `verseId: UUID`, `theme: String`, `excerptText: Text`, `originalSourceBookId: UUID`.
* **Relationships**: ينتمي لـ `ChurchFather` و `BibleVerse` و `Book`.
* **Lifecycle**: `Verified`.
* **Business Rules**: يجب ربط التفسير بمصدره الحقيقي في كتب الآباء برقم الصفحة والجزء.
* **Validation Rules**: لا يقبل تفسير بدون تحديد الآية أو الموضوع المصاحب.
* **Events**: `PatristicCommentaryLinked`.
* **Permissions**: مراجعة أكاديمية.
* **Dependencies**: `ChurchFather`, `BibleVerse`, `Book`.
* **Future Extensions**: الاستخراج التلقائي للموضوعات اللاهوتية المشتركة بين الآباء.

#### Entity: `Doctrine` / `Dogma` / `Canon` (العقائد والقوانين)
* **Purpose**: الكيان البنائي للموضوعات اللاهوتية والعقائدية والقوانين الكنسية والمقررات الفقهية.
* **Attributes**: `id: UUID`, `title: String`, `category: String`, `formulationText: Text`, `historicalContext: Text`.
* **Relationships**: يرتبط بـ N-to-M `Council`, `ChurchFather`, `BibleVerse`, و `KnowledgeGraphNode`.
* **Lifecycle**: `Active`.
* **Business Rules**: العقيدة أو القانون يربط بالمجمع الصادر عنه وبالمصادر الكتابية المعتمدة عليها.
* **Validation Rules**: عنوان العقيدة/القانون فريد.
* **Events**: `DoctrineFormulated`.
* **Permissions**: محمي للباحثين الأكاديميين.
* **Dependencies**: `Council`, `BibleVerse`.
* **Future Extensions**: محرك الاستدلال المقارن لتطور الصيغ اللاهوتية.

---

### 2.4. كيانات البحث والشبكة المعرفية والذكاء الاصطناعي (Research, Graph & AI Entities)

#### Entity: `ResearchProject` & `Notebook` (المشروع البحثي والدفتر)
* **Purpose**: بيئة العمل الفردية أو التشاركية للباحث لإعداد الأطروحة أو المقال العلمي.
* **Attributes**: `id: UUID`, `title: String`, `abstract: Text`, `ownerId: UUID`, `status: ResearchStatus`, `createdAt: Timestamp`.
* **Relationships**: يحتوي على 1-to-N `MarkdownDocument`, N-to-M `Citation`, و N-to-M `Book`.
* **Lifecycle**: `InPlanning` -> `Drafting` -> `PeerReview` -> `Published` -> `Archived`.
* **Business Rules**: المشروع يحتوي على شجرة مصادر وملاحظات مستقلا عن قواعد البيانات العامة.
* **Validation Rules**: يجب تدوين ملخص الأطروحة الإشكالي قبل خوض مراحل التوثيق.
* **Events**: `ResearchStarted`, `CitationAddedToResearch`, `ThesisExported`.
* **Permissions**: خاص بالباحث أو الفريق المشارك.
* **Dependencies**: `Citation`, `MarkdownDocument`.
* **Future Extensions**: التحكيم الأكاديمي المباشر عبر الشراكات المؤسسية.

#### Entity: `KnowledgeGraphNode` & `KnowledgeGraphEdge` (عقد وحواف الشبكة)
* **Purpose**: البنية التحتية الرياضية المستقلة لتمثيل شبكة المعارف والروابط المنطقية.
* **Attributes**:
  * Node: `id: UUID`, `entityId: UUID`, `label: String`, `type: NodeType`, `weight: Float`.
  * Edge: `id: UUID`, `sourceNodeId: UUID`, `targetNodeId: UUID`, `relationType: RelationType`, `weight: Float`, `evidenceCitationId: UUID`.
* **Relationships**: تربط كل الكيانات المعرفية ببعضها البعض.
* **Lifecycle**: `Dynamic`.
* **Business Rules**: كل حافة ارتباط بين عقدتين يجب أن تمتلك دليل استشهاد (Evidence) يسندها.
* **Validation Rules**: يمنع وجود حواف حلقية ذاتية (Self-loop) إلا في حالات الإحالة الذاتية الصريحة.
* **Events**: `GraphNodeAdded`, `GraphEdgeLinked`, `GraphClusterCalculated`.
* **Permissions**: القراءة للجميع؛ التحديث تلقائي عبر محرك استخراج الكيانات أو يدوياً.
* **Dependencies**: `KnowledgeObject`.
* **Future Extensions**: الخوارزميات المتقدمة لحساب المركزية والتكتل (PageRank & Louvain Community Detection).

#### Entity: `AIConversation`, `Prompt` & `Response` (محادثات واستدلال الذكاء الاصطناعي)
* **Purpose**: توثيق التفاعلات، الاستفسارات، وعمليات RAG الجارية بين الباحث ووكلاء Gemini.
* **Attributes**:
  * Conversation: `id: UUID`, `projectId: Option<UUID>`, `agentType: AgentType`, `startedAt: Timestamp`.
  * Prompt: `id: UUID`, `conversationId: UUID`, `userQuery: Text`, `retrievedContextIds: List<UUID>`.
  * Response: `id: UUID`, `promptId: UUID`, `generatedAnswer: Text`, `citations: List<Citation>`, `modelUsed: String`.
* **Relationships**: تنتمي لـ `ResearchProject` و `KnowledgeObject`.
* **Lifecycle**: `Active` -> `Archived`.
* **Business Rules**: كل استجابة ذكية يجب أن تتضمن قائمة بالمصادر المستشهد بها برقم الصفحة والجزء.
* **Validation Rules**: النص المولد يجب أن يتطابق مع إرشادات الأمان وعدم الهلوسة.
* **Events**: `AIQuerySent`, `AIResponseGenerated`, `CitationVerifiedBySystem`.
* **Permissions**: خاصة بالباحث.
* **Dependencies**: `@google/genai SDK`, `RAG Engine`.
* **Future Extensions**: التقييم البشري المباشر لدقة الاستجابة (Reinforcement Learning from Human Feedback - RLHF).

#### Entity: `Flashcard` & `Quiz` (بطاقات الاستذكار)
* **Purpose**: الدعم التعلمي والاستذكار التكراري المتباعد للباحث والطلاب.
* **Attributes**: `id: UUID`, `frontText: Text`, `backText: Text`, `interval: Integer`, `repetition: Integer`, `easeFactor: Float`, `nextDueDate: Timestamp`.
* **Relationships**: تنتمي لـ `Book`, `Concept`, أو `Person`.
* **Lifecycle**: `Learning` -> `Reviewing` -> `Mastered`.
* **Business Rules**: تتعدل مواعيد المراجعة بناء على خوارزمية التكرار المتباعد (Spaced Repetition SM-2/Anki Algorithm).
* **Validation Rules**: السؤال والجواب لا يجوز أن يكونا فارغين.
* **Events**: `FlashcardReviewed`, `MasteryAchieved`.
* **Permissions**: خاصة بالمستخدم.
* **Dependencies**: `Book`, `Concept`.
* **Future Extensions**: التوليد الآلي للأسئلة وبطاقات الاستذكار من الكتب بضغطة زر.

---

## 3. مجاميع DDD (Aggregates)

تتمحور معمارية Athena X حول أربعة مجاميع حاسمة تضمن الاتساق التام (Transactional Consistency Boundaries):

### 3.1. Aggregate: `LibraryAggregate`
* **Root**: `Library`
* **Entities Included**: `Book`, `BookEdition`, `BookVolume`, `Chapter`, `Section`, `Paragraph`, `Footnote`.
* **Consistency Guarantee**: أي تعديل في تسلسل الصفحات أو الهوامش يتطلب تحديثاً ذرياً (Atomic Update) بداخل جذر المكتبة لضمان سلامة الفهرس.

### 3.2. Aggregate: `ResearchAggregate`
* **Root**: `ResearchProject`
* **Entities Included**: `Notebook`, `MarkdownDocument`, `Citation`, `Reference`, `ResearchOutline`.
* **Consistency Guarantee**: استشهاد أي مسودة بمصدر يفرض تسجيلاً فورياً في جدول المراجع والمصادر التابع للمشروع بدون تعارض.

### 3.3. Aggregate: `KnowledgeGraphAggregate`
* **Root**: `Concept`
* **Entities Included**: `KnowledgeGraphNode`, `KnowledgeGraphEdge`, `Ontology`, `RelationshipEvidence`.
* **Consistency Guarantee**: إضافة حافة بين كيانين تتطلب التحقق من وجود العقدتين وصحة الدليل السندي المصاحب.

### 3.4. Aggregate: `AIInteractionAggregate`
* **Root**: `AIConversation`
* **Entities Included**: `Prompt`, `Response`, `RAGContextSnapshot`, `AgentState`.
* **Consistency Guarantee**: حفظ الاستجابة يتضمن تجميد لقطة السياق (Context Snapshot) المستخدم لحساب التوليد لضمان إمكانية مراجعة التحقيق مستقبلاً.

---

## 4. السياقات المحدودة (Bounded Contexts)

تم تقسيم Athena X إلى سياقات معزولة تماماً تتواصل فيما بينها بواسطة الأحداث (Domain Events):

```
+-----------------------------------------------------------------------------------+
|                                  ATHENA X KOS                                     |
+--------------------------+--------------------------+-----------------------------+
| 1. Library & Corpus      | 2. Hybrid Retrieval      | 3. Academic Knowledge Graph |
|    Bounded Context       |    & RAG Context         |    Bounded Context          |
|  - Book/Volume/Page      |  - Vector Indexing       |  - Entities & Relations     |
|  - OCR & Import Pipeline |  - Sparse FTS Indexing   |  - Historical Period/Event  |
|  - Publisher/Editor      |  - Smart Chunker         |  - Spatio-Temporal Map      |
+--------------------------+--------------------------+-----------------------------+
| 4. Theological & Script  | 5. AI Agent & Research   | 6. User Workspace & Study   |
|    Bounded Context       |    Bounded Context       |    Bounded Context          |
|  - BibleVerse & Text     |  - ResearchProject       |  - Notebooks & Flashcards   |
|  - Patristic Commentaries|  - Multi-Agent Orchestr. |  - Study Planner & Tasks    |
|  - Councils & Canons     |  - Citation Generator    |  - User Preferences & Logs  |
+--------------------------+--------------------------+-----------------------------+
```

---

## 5. كائنات القيمة (Value Objects)

كائنات غير قابلة للتغيير (Immutable) لا تملك معرّفاً ثابتاً وتُعرف بقيمها فقط:

* **`HijriGregorianYear`**: تمثيل التاريخ المزدوج الهجري/الميلادي وتوفير التحويل الحسابي الدقيق.
* **`KnowledgeURI`**: العنوان المعياري الموحد لأي قطعة معرفية (`athena://...`).
* **`GeographicPoint`**: الإحداثيات الجغرافية (الإحداثيات، اسم المدينة التاريخي، واسمها الحديث).
* **`CitationReference`**: صياغة التوثيق الأكاديمي الشاملة (اسم الكتاب، المحقق، الجزء، الصفحة، الحاشية).
* **`TextRange`**: التحديد النصي الدقيق بداخل الصفحة (`startOffset`, `endOffset`).
* **`ConfidenceLevel`**: درجة اليقين الأكاديمي أو الاحتمالية الذكية (من `0.0` إلى `1.0`).

---

## 6. خدمات المجال (Domain Services)

الخدمات التي تحتوي على منطق عمل لا ينتمي لكيان محدد بمفرده:

* **`ArabicNormalizerService`**: خدمة توحيد النصوص العربية، معالجة التشكيل، وتجريف الألف والياء والتاء المربوطة.
* **`HybridRankFusionService`**: خدمة دمج نتائج البحث النصي المتجهي والحرفي برياضيات Reciprocal Rank Fusion (RRF).
* **`CitationVerificationService`**: خدمة التحقق الأكاديمي من مطابقة اقتباس الباحث مع الصفحات الأصلية في قاعدة البيانات.
* **`CalendarConversionService`**: خدمة التحويل الفلكي والتاريخي بين التقويمات الهجرية، الميلادية، والقبطية/القديمة.
* **`GraphDisambiguationService`**: خدمة التمييز وإزالة التداخل بين الشخصيات والمفاهيم المتشابهة في الأسماء.

---

## 7. مستودعات المجال (Repositories)

واجهات برمجية مجردة (Interfaces) لتخزين واسترجاع المجاميع دون الارتهان بقواعد بيانات محددة:

* **`ILibraryRepository`**: `findBookById`, `searchByAuthor`, `saveBook`, `deleteBook`.
* **`IKnowledgeGraphRepository`**: `getNodesByEntity`, `findShortestPath`, `saveEdge`, `getCluster`.
* **`IResearchRepository`**: `getProjectWithCitations`, `saveNotebook`, `exportThesis`.
* **`IScriptureRepository`**: `getVerseWithCommentaries`, `searchByPatristicTheme`.
* **`IVectorStoreRepository`**: `upsertEmbeddings`, `queryNearestNeighbors`.

---

## 8. المصانع والمواصفات والسياسات (Factories, Specifications & Policies)

### Factories
* **`BookImportFactory`**: بناء كائنات `Book` و `BookVolume` و `Paragraph` من الملفات المستوردة المجهزة.
* **`GraphNodeFactory`**: توليد عقد جديدة في الشبكة مع التحقق التلقائي من الكيانات.

### Specifications
* **`EligibleForRAGContextSpec`**: المواصفة التي تحدد ما إذا كانت قطعة النص تتمتع بدرجة ثقة كافية لتضمينها في سياق Gemini RAG.
* **`DuplicateBookSpec`**: فحص ما إذا كان الكتاب المستورد مكرراً عبر الهاش الرقمي والـ ISBN والعنوان.

### Policies
* **`DataRetentionPolicy`**: السياسة المسؤولة عن تنظيم حفظ الكاش والنسخ الاحتياطية وتاريخ الحوارات.
* **`CitationEnforcementPolicy`**: السياسة التي تمنع تصدير أي بحث أكاديمي دون اكتمال توثيق جميع المراجع.

---

## 9. الأوامر والأحداث (Commands & Events)

### Commands (الأوامر)
* `CatalogNewBookCommand`
* `RunHybridSearchCommand`
* `ExtractGraphEntitiesCommand`
* `GenerateAIResponseCommand`
* `ExportResearchProjectCommand`

### Domain Events (أحداث المجال)
* `BookCatalogedEvent`
* `ParagraphIndexedEvent`
* `EntityExtractedEvent`
* `CitationVerifiedEvent`
* `ResearchProjectExportedEvent`

---

## 10. نموذج المعرفة الكلي وتدفق الذكاء (The Knowledge Flow & Evolution)

كيف تتحول البيانات الخيرة إلى معرفة أكاديمية وذكاء استدلالي بداخل Athena X:

1. **مرحلة الاستيعاب (Ingestion & Normalization)**:
   - ورود الكتب والمخطوطات والملفات -> التفكيك والـ OCR -> التوحيد اللغوي والتفتيت (Normalizing & Chunking).
2. **مرحلة الفهرسة والربط (Indexing & Structuring)**:
   - إنشاء الفهارس النصية FTS5 والمتجهية Vector Embeddings -> استخراج الكيانات والعلاقات -> بناء الشبكة المعرفية والخط الزمني.
3. **مرحلة التفاعل والاسترجاع (Retrieval & Synthesis)**:
   - استعلام الباحث -> دمج البحث النصي المتجهي والحرفي (Hybrid RAG) -> استدعاء سياق Gemini مع شروط التوثيق.
4. **مرحلة الإنتاج والتحقيق (Research & Intelligence)**:
   - تجميع الأدلة بداخل Drafs و Notebooks -> الفحص والمراجعة النقدية عبر الوكلاء -> التصدير الأكاديمي الموثق بالصفحة والجزء.

---

**توقيع معمارية المعرفة**: *Athena X Domain Engineering Specification - Validated for 2045+ Standard*.
