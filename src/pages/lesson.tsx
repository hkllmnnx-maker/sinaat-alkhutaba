import type { FC } from 'hono/jsx'
import { modules, type Lesson, type Module } from '../data/course'

// بناء قائمة مسطّحة بكل الدروس لتحديد السابق/التالي
const flatLessons: { lesson: Lesson; module: Module }[] = []
modules.forEach((m) => m.lessons.forEach((l) => flatLessons.push({ lesson: l, module: m })))

export const LessonPage: FC<{ lesson: Lesson; module: Module }> = ({
  lesson: l,
  module: mod,
}) => {
  const idx = flatLessons.findIndex((x) => x.lesson.id === l.id)
  const prev = idx > 0 ? flatLessons[idx - 1] : null
  const next = idx < flatLessons.length - 1 ? flatLessons[idx + 1] : null

  return (
    <section class="section bg-pattern" style="padding-top:40px;">
      <div class="container">
        <div class="lesson-layout">
          {/* ===== الشريط الجانبي ===== */}
          <aside class="sidebar">
            <h4>
              <i class="fa-solid fa-list-ul"></i> محتوى الدورة
            </h4>
            {modules.map((m) => (
              <div class="side-module">
                <div class="sm-title">
                  <i class={m.icon}></i> {m.title}
                </div>
                <ul class="side-lessons">
                  {m.lessons.map((ll) => (
                    <li>
                      <a
                        href={`/lesson/${ll.id}`}
                        data-lesson-link={ll.id}
                        class={ll.id === l.id ? 'active' : ''}
                      >
                        {ll.title}
                        <span class="done-badge" style="display:none;color:#2fd699;margin-right:6px;">
                          <i class="fa-solid fa-circle-check"></i>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* ===== المحتوى الرئيسي ===== */}
          <article class="lesson-main">
            <div class="lesson-breadcrumb">
              <a href="/course">الدورة</a> ·{' '}
              <a href={`/module/${mod.id}`}>{mod.title}</a>
            </div>
            <h1>{l.title}</h1>
            <p class="lesson-summary">{l.summary}</p>

            {/* ===== لوحة نظام التدرّج (بدء الدرس + المؤقّت + شروط الفتح) ===== */}
            <div
              class="lesson-gate"
              id="lessonGate"
              data-quiz-total={l.quiz.length}
              data-min-minutes="5"
            >
              <div class="gate-head">
                <i class="fa-solid fa-lock gate-icon" id="gateIcon"></i>
                <div>
                  <strong class="gate-title" id="gateTitle">اختر مدّة الدراسة لبدء الدرس</strong>
                  <span class="gate-sub" id="gateSub">
                    اختر المدّة التي ترغب أن يُفتح بعدها قفل الانتقال للدرس التالي (من دقيقة إلى خمس دقائق)،
                    ثمّ أجب عن جميع أسئلة الاختبار بشكلٍ صحيح. يُفتح الانتقال عند تحقّق الشرطين معًا.
                  </span>
                </div>
              </div>

              <div class="gate-actions">
                {/* خيارات اختيار المدّة الزمنية (تظهر قبل بدء الدرس) */}
                <div class="gate-duration" id="gateDuration" aria-label="اختيار مدّة الدراسة">
                  <span class="gate-duration-label">
                    <i class="fa-regular fa-clock"></i> اختر المدّة:
                  </span>
                  <div class="gate-duration-opts" id="gateDurationOpts">
                    <button type="button" class="dur-opt" data-minutes="1">دقيقة واحدة</button>
                    <button type="button" class="dur-opt" data-minutes="2">دقيقتان</button>
                    <button type="button" class="dur-opt" data-minutes="3">٣ دقائق</button>
                    <button type="button" class="dur-opt" data-minutes="4">٤ دقائق</button>
                    <button type="button" class="dur-opt" data-minutes="5">٥ دقائق</button>
                  </div>
                </div>
                <button id="startLessonBtn" class="btn btn-blue" disabled>
                  <i class="fa-solid fa-play"></i> <span class="start-label">بدء الدرس</span>
                </button>
                <div class="gate-timer" id="gateTimer" style="display:none;">
                  <i class="fa-regular fa-clock"></i>
                  <span>الوقت المتبقّي لفتح الانتقال: </span>
                  <strong id="gateCountdown">٠٠:٠٠</strong>
                </div>
              </div>

              {/* مؤشّرات الشروط */}
              <ul class="gate-conditions">
                <li id="condTime" class="cond">
                  <i class="fa-regular fa-circle"></i>
                  <span id="condTimeText">مضيُّ المدّة المختارة على بدء الدرس</span>
                </li>
                <li id="condQuiz" class="cond">
                  <i class="fa-regular fa-circle"></i>
                  <span>
                    الإجابة الصحيحة عن جميع أسئلة الاختبار ({l.quiz.length} أسئلة)
                  </span>
                </li>
              </ul>
            </div>

            {/* ===== معرض المشجّرات المصوّرة (الخرائط الذهنية) ===== */}
            {l.diagrams && l.diagrams.length > 0 && (
              <section class="lesson-diagrams" aria-label="المشجّرات المصوّرة للدرس">
                <h2 class="diagrams-title">
                  <i class="fa-solid fa-sitemap"></i> المشجّرات المصوّرة للدرس
                </h2>
                <p class="diagrams-intro">
                  خرائط ذهنية مفصّلة تلخّص الدرس وتُبرز أفكاره الأساسية. اضغط أيّ صورة لعرضها بحجمها الكامل.
                </p>
                <div class="diagrams-grid">
                  {l.diagrams.map((d) => (
                    <figure class="diagram-card">
                      <a
                        href={d.src}
                        target="_blank"
                        rel="noopener"
                        title="اضغط لعرض الصورة بحجمها الكامل"
                      >
                        <img src={d.src} alt={`مشجّر مصوّر: ${d.title}`} loading="lazy" />
                        <span class="diagram-zoom">
                          <i class="fa-solid fa-magnifying-glass-plus"></i>
                        </span>
                      </a>
                      <figcaption>
                        <strong class="diagram-card-title">{d.title}</strong>
                        {d.caption && <span class="diagram-card-caption">{d.caption}</span>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {l.sections.map((s) => (
              <div class="lesson-section">
                <h2>{s.heading}</h2>
                {s.paragraphs?.map((p) => <p>{p}</p>)}
                {s.bullets && (
                  <ul>
                    {s.bullets.map((b) => (
                      <li>{b}</li>
                    ))}
                  </ul>
                )}
                {s.quote && (
                  <div class="quote-box">
                    <i class="fa-solid fa-quote-right" style="opacity:.4;"></i>{' '}
                    {s.quote.text}
                    {s.quote.source && <span class="src">— {s.quote.source}</span>}
                  </div>
                )}
                {s.tip && (
                  <div class="tip-box">
                    <i class="fa-solid fa-lightbulb"></i>
                    <span>
                      <b>فائدة: </b>
                      {s.tip}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* ===== الأنشطة والتمارين ===== */}
            <div class="lesson-section">
              <h2>
                <i class="fa-solid fa-dumbbell" style="font-size:1rem;"></i> أنشطة
                وتمارين
              </h2>
              {l.exercises.map((ex) => (
                <div class="exercise">
                  <div class="ex-head">
                    <span class={`ex-type ${ex.type}`}>{ex.type}</span>
                    <h4>{ex.title}</h4>
                  </div>
                  <p>{ex.body}</p>
                </div>
              ))}
            </div>

            {/* ===== الاختبار التفاعلي ===== */}
            {l.quiz.length > 0 && (
              <div class="quiz-block">
                <h2>
                  <i class="fa-solid fa-circle-question"></i> اختبر فهمك
                </h2>
                <p class="qsub">
                  اختر الإجابة الصحيحة، وستظهر لك النتيجة والشرح فورًا.
                </p>
                <div
                  id="quizScore"
                  style="margin-bottom:18px;font-weight:700;color:var(--gold-400);"
                >
                  أجبتَ على 0 من {l.quiz.length}
                </div>
                {l.quiz.map((q) => (
                  <div class="quiz-q" data-answer={q.answer}>
                    <div class="qtext">{q.question}</div>
                    <div class="quiz-options">
                      {q.options.map((opt, oi) => (
                        <div class="quiz-opt" data-idx={oi}>
                          <i class="fa-regular fa-circle"></i>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                    <div class="quiz-explain">
                      <b>التوضيح: </b>
                      {q.explain}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ===== التنقل بين الدروس ===== */}
            <div class="lesson-nav">
              {prev ? (
                <a href={`/lesson/${prev.lesson.id}`} class="btn btn-outline">
                  <i class="fa-solid fa-arrow-right"></i> الدرس السابق
                </a>
              ) : (
                <span></span>
              )}
              {next ? (
                <button
                  id="nextLessonBtn"
                  class="btn btn-blue is-locked"
                  data-next-href={`/lesson/${next.lesson.id}`}
                  disabled
                >
                  <i class="fa-solid fa-lock"></i>{' '}
                  <span class="next-label">الدرس التالي مقفل</span>
                </button>
              ) : (
                <button
                  id="nextLessonBtn"
                  class="btn btn-gold is-locked"
                  data-next-href="/course"
                  data-finish="1"
                  disabled
                >
                  <i class="fa-solid fa-lock"></i>{' '}
                  <span class="next-label">إنهاء الدورة مقفل</span>
                </button>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
