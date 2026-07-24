# 016_DEPLOYMENT_PLAN.md - خطة النشر والتشغيل الإنتاجي

## 1. Purpose (الهدف)
توثيق آليات البناء والنشر عبر الحاويات المتقدمة والتشغيل المحلي وعلى Cloud Run وفي الأجهزة المكتبيّة.

## 2. Responsibilities (المسؤوليات)
* ضمان تنفيذ سكربتات البناء عبر `npm run build` التي تنتج حزمة خافية ممتازة في `dist/`.
* تكامل خادم Express المدمج مع Vite middleware في بيئة التطوير والخدمة الاستاتيكية في الإنتاج.
* ربط المنفذ 3000 بورت تلقائياً دون محاولة تغييره.

## 3. Dependencies (الاعتماديات)
* يرتبط بـ `package.json` و `vite.config.ts`.

## 4. Internal Structure (الهيكل الداخلي)
* **Build Script**: `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
* **Start Script**: `node dist/server.cjs`.

## 5. Future Expansion (التوسع المستقبلي)
* أتمتة عمليات النشر عبر GitHub Actions و Docker Containers موحدة.

## 6. Risks (المخاطر)
* فشل البناء بسبب خطأ في الاستيراد أو حزم مفقودة أثناء تجميع esbuild.

## 7. Engineering Notes (الملاحظات الهندسية)
* يجب أن تعمل الخوادم دائماً على العنوان `0.0.0.0` والمنفذ `3000` لضمان التوافق مع الحاويات المعزولة.
