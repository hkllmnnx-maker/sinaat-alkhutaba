/**
 * بروكسي عكسي (Reverse Proxy) لموقع "صناعة الخطباء"
 * يجلب المحتوى من Cloudflare Pages الأصلي ويقدّمه عبر نطاق workers.dev
 * كرابط بديل لتجاوز الحجب في بعض الدول (مثل اليمن).
 *
 * الفكرة: المتصفّح يتصل بنطاق workers.dev (غير محظور غالبًا)،
 * والـ Worker — الذي يعمل داخل شبكة Cloudflare — يجلب الصفحة من
 * sinaat-alkhutaba.pages.dev (الاتصال من خادم لخادم لا يمرّ عبر مزوّد
 * الإنترنت لدى الزائر، فلا يخضع للحجب) ويعيدها للزائر.
 */

const ORIGIN = 'https://sinaat-alkhutaba.pages.dev';

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);

    // نبني عنوان الأصل بنفس المسار والمعاملات
    const targetUrl = ORIGIN + incomingUrl.pathname + incomingUrl.search;

    // ننسخ الطلب الوارد إلى الأصل
    const init = {
      method: request.method,
      headers: new Headers(request.headers),
      redirect: 'follow',
    };

    // نمرّر الجسم لطلبات POST/PUT وغيرها
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = request.body;
    }

    // نضبط ترويسة المضيف لتطابق الأصل
    init.headers.set('Host', new URL(ORIGIN).host);

    let originResponse;
    try {
      originResponse = await fetch(targetUrl, init);
    } catch (err) {
      return new Response(
        'تعذّر الوصول إلى الموقع الأصلي مؤقتًا. حاول لاحقًا.\n' + String(err),
        { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    // ننسخ الاستجابة ونضيف ترويسات تسمح بالوصول
    const response = new Response(originResponse.body, originResponse);
    response.headers.set('Access-Control-Allow-Origin', '*');
    // نزيل أي ترويسات تمنع التضمين
    response.headers.delete('X-Frame-Options');
    response.headers.delete('Content-Security-Policy');

    return response;
  },
};
