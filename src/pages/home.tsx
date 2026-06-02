import type { FC } from 'hono/jsx'
import { goals, modules, courseMeta } from '../data/course'

const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0)
const totalExercises = modules.reduce(
  (s, m) => s + m.lessons.reduce((a, l) => a + l.exercises.length, 0),
  0
)

export const Home: FC = () => {
  return (
    <>
      {/* ===== Hero ===== */}
      <section class="hero">
        <div class="container hero-grid">
          <div>
            <span class="hero-badge">
              <i class="fa-solid fa-mosque"></i> مبادرة دعوية تعليمية
            </span>
            <h1>
              صِناعةُ <span class="accent">الخُطَباء</span>
            </h1>
            <p class="lead">
              نَصْنَعُ خطيبًا مؤثّرًا يهدي القلوب إلى الله سبحانه وتعالى. دورةٌ
              متكاملة وتفاعلية في فنّ الخطابة والإلقاء بمحتوى علمي رصين، أنشطة
              وتمارين وخرائط ذهنية — لجميع المستويات.
            </p>
            <div class="hero-actions">
              <a href="/course" class="btn btn-gold">
                <i class="fa-solid fa-graduation-cap"></i> ابدأ الدورة الآن
              </a>
              <a href="/mindmaps" class="btn btn-ghost">
                <i class="fa-solid fa-diagram-project"></i> الخرائط الذهنية
              </a>
            </div>
          </div>
          <div class="hero-logo-wrap">
            <img src="/static/logo.png" alt="شعار صناعة الخطباء" class="hero-logo" />
          </div>
        </div>

        <div class="container">
          <div class="hero-stats">
            <div class="stat">
              <div class="num">{modules.length}</div>
              <div class="lbl">وحدات تدريبية</div>
            </div>
            <div class="stat">
              <div class="num">{totalLessons}</div>
              <div class="lbl">درسًا متكاملًا</div>
            </div>
            <div class="stat">
              <div class="num">{totalExercises}+</div>
              <div class="lbl">نشاطًا وتمرينًا</div>
            </div>
            <div class="stat">
              <div class="num">4</div>
              <div class="lbl">خرائط ذهنية</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== الأهداف الأربعة ===== */}
      <section class="section bg-pattern" id="goals">
        <div class="container">
          <div class="section-head reveal">
            <span class="eyebrow">أهداف المجموعة</span>
            <h2>محاورنا الأربعة</h2>
            <p>
              رؤيتنا واضحة: صناعة خطيبٍ مؤثّر، عبر أربعة محاورَ متكاملة تبني
              المهارة وتصنع القائد.
            </p>
            <div class="divider-orn"></div>
          </div>
          <div class="goals-grid">
            {goals.map((g) => (
              <div class="goal-card reveal">
                <span class="goal-num">{g.num}</span>
                <div class="goal-icon">
                  <i class={g.icon}></i>
                </div>
                <h3>{g.title}</h3>
                <p>{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== مميزات الدورة ===== */}
      <section class="section" style="background:#fff;" id="features">
        <div class="container">
          <div class="section-head reveal">
            <span class="eyebrow">لماذا هذه الدورة؟</span>
            <h2>تعلّمٌ منهجي وتفاعلي</h2>
            <p>{courseMeta.subtitle}</p>
            <div class="divider-orn"></div>
          </div>
          <div class="features-grid">
            {[
              {
                ic: 'fa-solid fa-layer-group',
                t: 'محتوى متدرّج ومنظّم',
                d: 'من أساسيات المفهوم إلى صناعة القائد المؤثّر، بترتيب منطقي يناسب جميع المستويات.',
              },
              {
                ic: 'fa-solid fa-book-quran',
                t: 'تأصيل علمي رصين',
                d: 'محتوى مبنيٌّ على الكتاب والسنة وكلام أهل العلم، مع التزام بصحة المعلومة.',
              },
              {
                ic: 'fa-solid fa-dumbbell',
                t: 'أنشطة وتمارين عملية',
                d: 'تمارين تطبيقية وتأملية وصوتية وكتابية في كل درس، لتحويل العلم إلى مهارة.',
              },
              {
                ic: 'fa-solid fa-diagram-project',
                t: 'خرائط ذهنية ومشجرات',
                d: 'مخططات بصرية تلخّص أركان الخطابة ومهارات الأداء والإقناع لترسيخ الفهم.',
              },
              {
                ic: 'fa-solid fa-circle-question',
                t: 'اختبارات تفاعلية',
                d: 'اختبار قصير بعد كل درس مع تصحيح فوري وشرح، لقياس فهمك وتثبيته.',
              },
              {
                ic: 'fa-solid fa-chart-simple',
                t: 'تتبّع تقدّمك',
                d: 'يحفظ الموقع تقدّمك في الدروس تلقائيًا، فتعرف أين وصلت وما تبقّى عليك.',
              },
            ].map((f) => (
              <div class="feature reveal">
                <div class="ic">
                  <i class={f.ic}></i>
                </div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== لمحة عن الوحدات ===== */}
      <section class="section bg-pattern" id="modules-preview">
        <div class="container">
          <div class="section-head reveal">
            <span class="eyebrow">المنهج الدراسي</span>
            <h2>وحدات الدورة</h2>
            <p>رحلة من أربع محطات تبني الخطيب المؤثّر خطوةً خطوة.</p>
            <div class="divider-orn"></div>
          </div>
          <div class="modules-grid">
            {modules.map((m) => (
              <a href={`/module/${m.id}`} class="module-card reveal">
                <div class="module-top">
                  <div class="module-icon">
                    <i class={m.icon}></i>
                  </div>
                  <div>
                    <span class="module-order">الوحدة {m.order} · {m.tagline}</span>
                    <h3>{m.title}</h3>
                  </div>
                </div>
                <div class="module-body">
                  <p>{m.description}</p>
                  <div class="lesson-pills">
                    {m.lessons.map((l) => (
                      <span class="lesson-pill">{l.title}</span>
                    ))}
                  </div>
                </div>
                <div class="module-foot">
                  <span class="module-meta">
                    <i class="fa-solid fa-book-open"></i> {m.lessons.length} دروس
                  </span>
                  <span class="btn btn-outline" style="padding:8px 16px;font-size:.9rem;">
                    عرض الوحدة <i class="fa-solid fa-arrow-left"></i>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section class="section" style="padding-top:0;">
        <div class="container">
          <div class="cta-band reveal">
            <h2>ابدأ رحلتك في صناعة الخطباء اليوم</h2>
            <p>
              العلم خطوة، والممارسة خطوات. ابدأ الدرس الأول الآن، وتدرّج حتى تصبح
              خطيبًا مؤثّرًا بإذن الله.
            </p>
            <a href="/course" class="btn btn-gold">
              <i class="fa-solid fa-play"></i> انطلق إلى الدورة
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
