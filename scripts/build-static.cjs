#!/usr/bin/env node
/* ============================================================
 * توليد نسخة ثابتة (static) من الموقع لنشرها على GitHub Pages
 * كرابط بديل يعمل في الدول التي تُحجب فيها نطاقات pages.dev
 * ============================================================
 * يجلب كل المسارات من الخادم المحلي (http://localhost:3000)
 * ويحفظها كملفات HTML داخل مجلد ./docs مع نسخ الأصول الثابتة.
 * الروابط المطلقة (/lesson/..) تُحوّل لتعمل تحت مسار فرعي عبر <base>.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE = 'http://localhost:3000';
const OUT = path.join(__dirname, '..', 'docs');
// اسم المستودع على GitHub Pages (المسار الفرعي)
const REPO_BASE = '/sinaat-alkhutaba/';

// استخراج معرّفات الدروس والوحدات من course.ts
const courseSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'course.ts'), 'utf8');
const lessonIds = (courseSrc.match(/id: 'm\dl\d'/g) || []).map((s) => s.match(/m\dl\d/)[0]);
const moduleIds = [...new Set((courseSrc.match(/id: 'm\d'/g) || []).map((s) => s.match(/m\d/)[0]))];

// قائمة المسارات: (مسار الطلب) → (ملف الإخراج)
const routes = [
  ['/', 'index.html'],
  ['/course', 'course/index.html'],
  ['/mindmaps', 'mindmaps/index.html'],
  ['/about', 'about/index.html'],
];
moduleIds.forEach((id) => routes.push(['/module/' + id, 'module/' + id + '/index.html']));
lessonIds.forEach((id) => routes.push(['/lesson/' + id, 'lesson/' + id + '/index.html']));

function fetchPath(p) {
  return new Promise((resolve, reject) => {
    http.get(BASE + p, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// تحويل الـ HTML ليعمل تحت مسار فرعي على GitHub Pages
function transform(html) {
  // إضافة <base> بعد <head> لجعل الروابط المطلقة تعمل تحت /repo/
  // ملاحظة: <base> وحده لا يكفي للروابط المطلقة (/..)، لذا نحوّلها صراحةً.
  // نحوّل href="/.." و src="/.." إلى المسار الفرعي
  html = html.replace(/(href|src)="\/(?!\/)/g, '$1="' + REPO_BASE);
  // إصلاح المسارات المزدوجة المحتملة
  html = html.replace(new RegExp(REPO_BASE.replace(/\//g, '\\/') + REPO_BASE.slice(1), 'g'), REPO_BASE);
  return html;
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

(async () => {
  // تنظيف وإنشاء مجلد الإخراج
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  // نسخ الأصول الثابتة (public/static → docs/static)
  copyDir(path.join(__dirname, '..', 'public', 'static'), path.join(OUT, 'static'));

  // جلب وحفظ كل المسارات
  for (const [route, outFile] of routes) {
    const html = transform(await fetchPath(route));
    const full = path.join(OUT, outFile);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, html, 'utf8');
    console.log('✓ ' + route + ' → docs/' + outFile);
  }

  // صفحة 404 (نسخة من الرئيسية لتفادي أخطاء التوجيه)
  const notFound = transform(await fetchPath('/'));
  fs.writeFileSync(path.join(OUT, '404.html'), notFound, 'utf8');

  // ملف .nojekyll لمنع معالجة Jekyll (تظهر مجلدات تبدأ بـ _)
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '', 'utf8');

  console.log('\n✅ تم توليد النسخة الثابتة في مجلد docs/ (' + routes.length + ' صفحة)');
})().catch((e) => { console.error(e); process.exit(1); });
