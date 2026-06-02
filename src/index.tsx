import { Hono } from 'hono'
import { renderer } from './renderer'
import { modules } from './data/course'
import { Home } from './pages/home'
import { CoursePage } from './pages/course'
import { ModulePage } from './pages/module'
import { LessonPage } from './pages/lesson'
import { MindMapsPage } from './pages/mindmaps'
import { AboutPage } from './pages/about'

const app = new Hono()

app.use(renderer)

// الصفحة الرئيسية
app.get('/', (c) => {
  return c.render(<Home />, { title: '' } as any)
})

// صفحة الدورة (كل الوحدات)
app.get('/course', (c) => {
  return c.render(<CoursePage />, { title: 'الدورة التعليمية' } as any)
})

// صفحة وحدة واحدة
app.get('/module/:id', (c) => {
  const id = c.req.param('id')
  const mod = modules.find((m) => m.id === id)
  if (!mod) return c.notFound()
  return c.render(<ModulePage module={mod} />, { title: mod.title } as any)
})

// صفحة درس واحد
app.get('/lesson/:id', (c) => {
  const id = c.req.param('id')
  let found: { lesson: any; module: any } | null = null
  for (const m of modules) {
    const l = m.lessons.find((x) => x.id === id)
    if (l) {
      found = { lesson: l, module: m }
      break
    }
  }
  if (!found) return c.notFound()
  return c.render(<LessonPage lesson={found.lesson} module={found.module} />, {
    title: found.lesson.title,
    lessonId: found.lesson.id,
  } as any)
})

// الخرائط الذهنية
app.get('/mindmaps', (c) => {
  return c.render(<MindMapsPage />, { title: 'الخرائط الذهنية' } as any)
})

// عن المجموعة
app.get('/about', (c) => {
  return c.render(<AboutPage />, { title: 'عن المجموعة' } as any)
})

// 404
app.notFound((c) => {
  return c.render(
    (
      <section class="section" style="text-align:center;padding:90px 0;">
        <div class="container">
          <div style="font-size:5rem;color:var(--blue-100);font-weight:800;">٤٠٤</div>
          <h1 style="color:var(--blue-900);">الصفحة غير موجودة</h1>
          <p style="color:var(--muted);">عذرًا، الصفحة التي تبحث عنها غير متوفّرة.</p>
          <a href="/" class="btn btn-gold" style="margin-top:16px;">
            <i class="fa-solid fa-house"></i> العودة للرئيسية
          </a>
        </div>
      </section>
    ) as any,
    { title: 'الصفحة غير موجودة' } as any
  )
})

export default app
