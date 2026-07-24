# 004_TECH_STACK.md - حزمة التقنيات والبرمجيات المعتمدة

## 1. Purpose (الهدف)
توثيق كافة التقنيات والمكتبات والأدوات المستخدمة في تطوير Athena OS مع بيان المبررات الهندسية لكل اختيار تكنولوجي.

## 2. Responsibilities (المسؤوليات)
* تحديد لغة البرمجة الرئيسية: **TypeScript** بوضع متشدد (Strict Mode).
* اختيار مكتبات واجهة المستخدم: **React 19**, **Tailwind CSS v4**, **Motion**, **Lucide React**.
* تحديد الخادم والتقنيات الخلفية: **Node.js Express**, **tsx**, **esbuild**.
* تحديد تقنيات الذكاء الاصطناعي: **@google/genai SDK (Gemini 2.5/Gemini 2.0)**.
* تحديد قواعد البيانات: **SQLite (FTS5)** للبيانات المهيكلة والنصية، و **Vector Storage** للمتجهات.

## 3. Dependencies (الاعتماديات)
* يرتبط بـ `package.json` و `003_ARCHITECTURE.md`.
* يوجه عملية التثبيت في `018_CODING_STANDARDS.md`.

## 4. Internal Structure (الهيكل الداخلي)
* **Frontend**: React 19 + Vite + Tailwind CSS v4 + Motion animation engine.
* **Backend Runtime**: Node.js + Express Server + TypeScript Native Typings.
* **AI Engine**: Google Gemini API SDK (`@google/genai`) لمعالجة الاستدلال، الملخصات، و RAG.
* **Storage Engines**: SQLite3 المحلي مع امتداد البحث النصي الشامل FTS5.

## 5. Future Expansion (التوسع المستقبلي)
* دمج Tauri للإنتاج المترجم محلياً (Native Desktop Application) بلغة Rust.
* إضافة محرك DuckDB للمعالجات التحليلية السريعة جداً على البيانات الضخمة (OLAP queries).

## 6. Risks (المخاطر)
* تغييرات التوافق بين إصدارات React 19 والمكتبات الثانوية.
* تحديثات واجهات برمجة تطبيقات Google Gemini التي تتطلب تتبع التغييرات في المستندات الرسمية.

## 7. Engineering Notes (الملاحظات الهندسية)
* جميع التبعيات (Dependencies) يجب تثبيتها بمبدأ التوافق والتحقق عبر `compile_applet` و `lint_applet`.
