# 006_DATABASE_ARCHITECTURE.md - معمارية قواعد البيانات

## 1. Purpose (الهدف)
تصميم وتوثيق البنية التحتية لتخزين واسترجاع البيانات النصية والهيكلية والمتجهية في نظام Athena OS.

## 2. Responsibilities (المسؤوليات)
* إدارة تخزين الكتب، الصفحات، الفصول، الحواشي، والافتراضات البحثية.
* دعم البحث النصي المتقدم باللغة العربية عبر امتداد FTS5 في SQLite مع إزالة الفواصل والتشكيل.
* تخزين واستعلام المتجهات الرياضية (Embeddings) والارتباطات في الرسم البياني للكيانات.

## 3. Dependencies (الاعتماديات)
* يرتبط بـ `002_SOFTWARE_REQUIREMENTS.md`, `023_VECTOR_DATABASE.md`, و `024_SQL_DATABASE.md`.

## 4. Internal Structure (الهيكل الداخلي)
* **الجداول الرئيسية في SQLite**:
  * `books`: (id, title, author, year, category, total_pages, file_path, created_at)
  * `pages`: (id, book_id, page_number, raw_text, normalized_text, embedding_id)
  * `entities`: (id, name, type, period, description, metadata)
  * `relationships`: (id, source_id, target_id, relation_type, confidence_score)
  * `events`: (id, title, year_hijri, year_gregorian, description, location_id)
  * `fts_pages`: جدول FTS5 مجاز ومخصص للبحث السريع مع إغفال التشكيل والتنوين.

## 5. Future Expansion (التوسع المستقبلي)
* الدعم التلقائي للربط الفرعي عبر المكونات الجغرافية GIS المكانية.
* دعم التراجع والـ Migration السلس بضغطة زر دون تدمير أي بيانات سابقة.

## 6. Risks (المخاطر)
* تعارض الفهارس عند المعالجة بالتوازي لأكثر من 10,000 كتاب في نفس الوقت.

## 7. Engineering Notes (الملاحظات الهندسية)
* يجب استخدام معاملات الأمان (Transactions) في SQLite عند إدخال أو تحين الصفحات المجمعة لمنع فساد ملف قاعدة البيانات.
