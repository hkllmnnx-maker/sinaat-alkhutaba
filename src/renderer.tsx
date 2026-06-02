import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title, lessonId }) => {
  const pageTitle = title ? `${title} | صناعة الخطباء` : 'صناعة الخطباء — دورة فن الخطابة والإلقاء'
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="موقع صناعة الخطباء — دورة تعليمية مكثفة وتفاعلية في فن الخطابة والإلقاء بمحتوى علمي رصين، أنشطة وتمارين وخرائط ذهنية لجميع المستويات."
        />
        <link rel="icon" type="image/png" href="/static/logo.png" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css"
          rel="stylesheet"
        />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body data-lesson-id={lessonId || undefined}>
        <div class="read-progress" id="readProgress"></div>

        {/* ===== Navbar ===== */}
        <header class="navbar">
          <div class="container navbar-inner">
            <a href="/" class="brand" aria-label="الصفحة الرئيسية">
              <img src="/static/logo.png" alt="شعار صناعة الخطباء" />
              <span>
                <span class="brand-title">صِناعةُ الخُطَباء</span>
                <br />
                <span class="brand-sub">نصنع خطيبًا مؤثّرًا</span>
              </span>
            </a>
            <button class="nav-toggle" id="navToggle" aria-label="القائمة">
              <i class="fa-solid fa-bars"></i>
            </button>
            <nav class="nav-links" id="navLinks">
              <a href="/">الرئيسية</a>
              <a href="/course">الدورة</a>
              <a href="/mindmaps">الخرائط الذهنية</a>
              <a href="/about">عن المجموعة</a>
              <a href="/course" class="nav-cta">
                <i class="fa-solid fa-graduation-cap"></i> ابدأ التعلّم
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* ===== Footer ===== */}
        <footer class="footer">
          <div class="container">
            <div class="footer-grid">
              <div>
                <div class="footer-brand">
                  <img src="/static/logo.png" alt="شعار صناعة الخطباء" />
                  <span class="ft">صِناعةُ الخُطَباء</span>
                </div>
                <p>
                  مبادرة تعليمية دعوية تهدف إلى صناعة خطيبٍ مؤثّر يهدي القلوب إلى
                  الله سبحانه وتعالى، عبر دورة منهجية في فن الخطابة والإلقاء.
                </p>
              </div>
              <div>
                <h4>روابط سريعة</h4>
                <ul>
                  <li><a href="/">الرئيسية</a></li>
                  <li><a href="/course">الدورة التعليمية</a></li>
                  <li><a href="/mindmaps">الخرائط الذهنية</a></li>
                  <li><a href="/about">عن المجموعة</a></li>
                </ul>
              </div>
              <div>
                <h4>محاور المجموعة</h4>
                <ul>
                  <li><a href="/about">تطوير المهارات</a></li>
                  <li><a href="/about">إعداد القادة</a></li>
                  <li><a href="/about">تبادل الخبرات</a></li>
                  <li><a href="/about">تغيير الواقع</a></li>
                </ul>
              </div>
            </div>
            <div class="footer-bottom">
              © {new Date().getFullYear()} صناعة الخطباء — جميع الحقوق محفوظة · صُنع
              لخدمة الدعوة وتأهيل الخطباء
            </div>
          </div>
        </footer>

        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
