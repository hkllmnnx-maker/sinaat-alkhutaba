import type { FC } from 'hono/jsx'
import { goals } from '../data/course'

export const AboutPage: FC = () => {
  return (
    <>
      <section class="page-hero">
        <div class="container">
          <h1>
            <i class="fa-solid fa-mosque"></i> عن مجموعة صناعة الخطباء
          </h1>
          <p>نَصْنَعُ خطيبًا مؤثّرًا.. يهدي القلوب إلى الله سبحانه وتعالى</p>
        </div>
      </section>

      <section class="section">
        <div class="container" style="max-width:880px;">
          <div
            class="reveal in"
            style="background:#fff;border:1px solid var(--line);border-radius:var(--radius-lg);padding:38px;box-shadow:var(--shadow-sm);text-align:center;"
          >
            <img
              src="/static/logo.png"
              alt="شعار صناعة الخطباء"
              style="width:160px;height:160px;border-radius:50%;margin:0 auto 22px;border:3px solid var(--gold-400);box-shadow:var(--shadow-md);"
            />
            <h2 style="color:var(--blue-900);margin:0 0 14px;">رسالتنا</h2>
            <p style="color:var(--muted);font-size:1.12rem;max-width:620px;margin:0 auto;">
              مبادرة تعليمية دعوية تُعنى بتأهيل الخطباء وتنمية مهاراتهم في فنّ
              الخطابة والإلقاء، إيمانًا بأنّ الكلمة الطيّبة الصادقة قادرةٌ على هداية
              القلوب وإصلاح المجتمعات. نحن نصنع الخطيب: علمًا، ومهارةً، وأثرًا.
            </p>
          </div>

          {/* المحاور */}
          <div style="margin-top:46px;">
            <div class="section-head reveal in" style="margin-bottom:34px;">
              <span class="eyebrow">أهدافنا</span>
              <h2>محاور المجموعة الأربعة</h2>
              <div class="divider-orn"></div>
            </div>
            <div style="display:grid;gap:18px;">
              {goals.map((g) => (
                <div
                  class="reveal in"
                  style="display:flex;gap:18px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px 24px;box-shadow:var(--shadow-sm);"
                >
                  <div class="goal-icon" style="flex:0 0 auto;margin:0;">
                    <i class={g.icon}></i>
                  </div>
                  <div>
                    <h3 style="margin:0 0 6px;color:var(--blue-900);">
                      {g.num}. {g.title}
                    </h3>
                    <p style="margin:0;color:var(--muted);">{g.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* القيم */}
          <div
            class="quote-box reveal in"
            style="margin-top:40px;font-size:1.25rem;text-align:center;"
          >
            <i class="fa-solid fa-quote-right" style="opacity:.4;"></i> وَمَنْ
            أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا
            <span class="src">— سورة فصلت: 33</span>
          </div>

          <div style="text-align:center;margin-top:40px;">
            <a href="/course" class="btn btn-gold">
              <i class="fa-solid fa-graduation-cap"></i> انضمّ إلى الدورة
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
