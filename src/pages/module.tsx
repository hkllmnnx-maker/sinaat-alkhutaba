import type { FC } from 'hono/jsx'
import type { Module } from '../data/course'

export const ModulePage: FC<{ module: Module }> = ({ module: m }) => {
  return (
    <>
      <section class="page-hero">
        <div class="container">
          <div style="margin-bottom:10px;font-size:.95rem;opacity:.85;">
            <a href="/course" style="color:var(--gold-400);">الدورة</a> ·
            الوحدة {m.order}
          </div>
          <h1>
            <i class={m.icon}></i> {m.title}
          </h1>
          <p>{m.tagline} — {m.description}</p>
        </div>
      </section>

      <section class="section bg-pattern">
        <div class="container" style="max-width:860px;">
          <div style="display:grid;gap:14px;">
            {m.lessons.map((l, i) => (
              <a
                href={`/lesson/${l.id}`}
                data-lesson-link={l.id}
                class="lesson-row"
                style="display:flex;align-items:center;gap:16px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px 22px;box-shadow:var(--shadow-sm);transition:all .2s;"
              >
                <span style="flex:0 0 auto;width:46px;height:46px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--blue-800),var(--blue-600));color:#fff;font-weight:800;font-size:1.1rem;">
                  {i + 1}
                </span>
                <span style="flex:1;">
                  <strong style="color:var(--blue-900);display:block;font-size:1.1rem;">
                    {l.title}
                  </strong>
                  <span style="color:var(--muted);font-size:.92rem;">{l.summary}</span>
                  <span style="display:inline-flex;gap:14px;margin-top:8px;font-size:.82rem;color:var(--gold-700);">
                    <span><i class="fa-solid fa-dumbbell"></i> {l.exercises.length} أنشطة</span>
                    <span><i class="fa-solid fa-circle-question"></i> {l.quiz.length} أسئلة</span>
                  </span>
                </span>
                <span class="done-badge" style="display:none;color:#1f9d6b;font-size:1.3rem;">
                  <i class="fa-solid fa-circle-check"></i>
                </span>
                <i class="fa-solid fa-arrow-left" style="color:var(--gold-600);"></i>
              </a>
            ))}
          </div>

          <div style="text-align:center;margin-top:36px;">
            <a href="/course" class="btn btn-outline">
              <i class="fa-solid fa-arrow-right"></i> العودة لكل الوحدات
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .lesson-row:hover { transform: translateX(-4px); border-color: var(--gold-400); box-shadow: var(--shadow-md); }
        .lesson-row.completed { border-color:#9fe3c6; background:linear-gradient(135deg,#f3fbf7,#fff); }
      `}</style>
    </>
  )
}
