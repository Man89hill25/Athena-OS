# 003_ARCHITECTURE.md - البنية المعمارية للنظام

## 1. Purpose (الهدف)
تحديد المعمارية الهندسية الكلية لنظام Athena OS استناداً إلى أساليب الهندسة البرمجية النظيفة (Clean Architecture) المعزولة، لضمان استقلالية طبقات التطبيق وسهولة التطوير والصيانة على المدى الطويل.

## 2. Responsibilities (المسؤوليات)
* الفصل التام بين طبقة العرض (UI Layer)، النواة التشغيلية (Domain Core)، وطبقة البيانات والخدمات (Infrastructure).
* تنظيم تدفق البيانات الأحادي (Unidirectional Data Flow) والاستجابة للأحداث (Event-Driven Bus).
* إدارة الاتصال بين العمليات المتقاطعة (IPC Communication) والتفاعل الخادم/ العميل المحلي.

## 3. Dependencies (الاعتماديات)
* يعتمد على `002_SOFTWARE_REQUIREMENTS.md`.
* يحدد القواعد لـ `005_FOLDER_STRUCTURE.md` و `033_API_DESIGN.md`.

## 4. Internal Structure (الهيكل الداخلي)
* **Presentation Layer**: واجهة React 19 المحدثة، دعم التنسيق RTL، ومحرك الرسوم البيانية Recharts/D3.
* **Domain Layer**: الكيانات الأساسية (Book, Page, Citation, Entity, Event, TimelineNode, Note).
* **Application Layer**: حالات الاستخدام (Use Cases)، خدمات الاسترجاع المعرفي RAG، والوكلاء.
* **Infrastructure Layer**: SQLite + FTS5، LanceDB/VectorDB، Node.js Express Server، ونواة Gemini API.

## 5. Future Expansion (التوسع المستقبلي)
* تمكين المحركات المصغرة (Micro-Services Architecture) عبر بروتوكول gRPC/RPC محلي عند الانتقال إلى بيئة موزعة.
* دعم واجهات العرض ثلاثية الأبعاد (3D Entity Visualization) للرسم البياني المعرفي.

## 6. Risks (المخاطر)
* تعقيد إدارة حالة التطبيق (State Management) عند مزامنة المحركات المتعددة بنفس الوقت.
* مخاطر التسريب في الذاكرة (Memory Leaks) في بيئات WebView طويلة التشغيل.

## 7. Engineering Notes (الملاحظات الهندسية)
* يمنع استدعاء طبقة Infrastructure مباشرة من طبقة UI؛ يجب المرور دائماً عبر الموزعات (Services/Reducers) المعتمدة.
