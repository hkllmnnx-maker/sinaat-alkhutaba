# بروكسي "صناعة الخطباء" (Cloudflare Worker)

بروكسي عكسي يعمل كرابط بديل لموقع صناعة الخطباء لتجاوز الحجب في بعض الدول (اليمن وغيرها).

## كيف يعمل
- المتصفّح يتصل بنطاق `workers.dev` (نطاق مختلف عن `pages.dev` و`github.io`، وقد لا يكون محجوبًا).
- الـ Worker — الذي يعمل داخل شبكة Cloudflare — يجلب الصفحة من `sinaat-alkhutaba.pages.dev` ويعيدها للزائر. اتصال الـ Worker بالأصل يتمّ من خادم لخادم داخل شبكة Cloudflare، فلا يمرّ عبر مزوّد الإنترنت لدى الزائر ولا يخضع للحجب.

## الرابط
**https://khutaba-proxy.khutaba-portal.workers.dev**

## النشر / التحديث
```bash
cd proxy-worker
export CLOUDFLARE_API_TOKEN="<token>"
export CLOUDFLARE_ACCOUNT_ID="7ed903da8bafe53b4f1fb3ab4effe9a6"
npx wrangler deploy
```

البروكسي يجلب المحتوى الحيّ من الموقع الأصلي تلقائيًا، فلا يحتاج إعادة نشر عند تحديث الموقع — فقط أعد نشر الموقع الأصلي على Cloudflare Pages.

## الأصل (Origin)
يُضبط في `src/index.js` عبر الثابت `ORIGIN = 'https://sinaat-alkhutaba.pages.dev'`.
