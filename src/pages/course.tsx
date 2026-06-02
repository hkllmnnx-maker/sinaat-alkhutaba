import type { FC } from 'hono/jsx'
import { modules, courseMeta } from '../data/course'

const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0)

export const CoursePage: FC = () => {
  return (
    <>
      <section class="page-hero">
        <div class="container">
          <h1>
            <i class="fa-solid fa-graduation-cap"></i> {courseMeta.title}
          </h1>
          <p>{courseMeta.subtitle} · {courseMeta.level}</p>
        </div>
      </section>

      <section class="section bg-pattern">
        <div class="container">
          {/* شريط التقدّم العام */}
          <div
            class="reveal in"
            style="background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:22px 26px;box-shadow:var(--shadow-sm);margin-bottom:36px;"
          >
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
              <div>
                <strong style="color:var(--blue-900);font-size:1.1rem;">
                  <i class="fa-solid fa-chart-line"></i> تقدّمك في الدورة
                </strong>
                <p style="margin:4px 0 0;color:var(--muted);font-size:.9rem;">
                  يُحفظ تقدّمك تلقائيًا على جهازك
                </p>
              </div>
              <div
                id="progressCounter"
                data-total={totalLessons}
                style="font-weight:800;font-size:1.4rem;color:var(--gold-600);"
              >
                0 / {totalLessons}
              </div>
            </div>
            <div style="margin-top:14px;height:12px;background:var(--blue-50);border-radius:999px;overflow:hidden;">
              <div
                id="progressFill"
                style="height:100%;width:0%;background:linear-gradient(90deg,var(--blue-700),var(--gold-500));border-radius:999px;transition:width .5s;"
              ></div>
            </div>
          </div>

          {/* الوحدات */}
          {modules.map((m) => (
            <div class="reveal" style="margin-bottom:40px;">
              <div
                style="display:flex;align-items:center;gap:14px;margin-bottom:18px;"
              >
                <div class="module-icon" style="width:54px;height:54px;font-size:1.3rem;">
                  <i class={m.icon}></i>
                </div>
                <div>
                  <span class="module-order">الوحدة {m.order} · {m.tagline}</span>
                  <h2 style="margin:2px 0 0;color:var(--blue-900);font-size:1.6rem;">
                    {m.title}
                  </h2>
                </div>
              </div>
              <p style="color:var(--muted);margin:0 0 18px;">{m.description}</p>

              <div style="display:grid;gap:12px;">
                {m.lessons.map((l, i) => (
                  <a
                    href={`/lesson/${l.id}`}
                    data-lesson-link={l.id}
                    class="lesson-row"
                    style="display:flex;align-items:center;gap:16px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 20px;box-shadow:var(--shadow-sm);transition:all .2s;"
                  >
                    <span
                      style="flex:0 0 auto;width:40px;height:40px;border-radius:10px;display:grid;place-items:center;background:var(--blue-50);color:var(--blue-800);font-weight:800;"
                    >
                      {i + 1}
                    </span>
                    <span style="flex:1;">
                      <strong style="color:var(--blue-900);display:block;">
                        {l.title}
                      </strong>
                      <span style="color:var(--muted);font-size:.9rem;">
                        {l.summary}
                      </span>
                    </span>
                    <span
                      class="done-badge"
                      style="display:none;color:#1f9d6b;font-size:1.2rem;"
                    >
                      <i class="fa-solid fa-circle-check"></i>
                    </span>
                    <i
                      class="fa-solid fa-arrow-left"
                      style="color:var(--gold-600);"
                    ></i>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .lesson-row:hover { transform: translateX(-4px); border-color: var(--gold-400); box-shadow: var(--shadow-md); }
        .lesson-row.completed { border-color:#9fe3c6; background:linear-gradient(135deg,#f3fbf7,#fff); }
      `}</style>
    </>
  )
}
