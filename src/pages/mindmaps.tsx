import type { FC } from 'hono/jsx'
import { mindMaps, type MindNode } from '../data/course'

const Branch: FC<{ node: MindNode }> = ({ node }) => (
  <div class="mm-branch">
    <div class="mm-cat">{node.label}</div>
    {node.children && node.children.length > 0 && (
      <div class="mm-leaves">
        {node.children.map((leaf) => (
          <div class="mm-leaf">{leaf.label}</div>
        ))}
      </div>
    )}
  </div>
)

export const MindMapsPage: FC = () => {
  return (
    <>
      <section class="page-hero">
        <div class="container">
          <h1>
            <i class="fa-solid fa-diagram-project"></i> الخرائط الذهنية والمشجرات
          </h1>
          <p>مخططات بصرية تلخّص أهمّ مفاهيم فن الخطابة لترسيخ الفهم والمراجعة السريعة</p>
        </div>
      </section>

      <section class="section bg-pattern">
        <div class="container">
          {mindMaps.map((map) => (
            <div class="mindmap reveal">
              <h3>
                <i class="fa-solid fa-sitemap" style="color:var(--gold-600);"></i>{' '}
                {map.title}
              </h3>
              <p class="mm-desc">{map.description}</p>
              <div class="mm-tree">
                <div class="mm-root">
                  <div class="mm-node">{map.root.label}</div>
                  {map.root.children && (
                    <div class="mm-branches">
                      {map.root.children.map((b) => (
                        <Branch node={b} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div style="text-align:center;margin-top:20px;">
            <a href="/course" class="btn btn-gold">
              <i class="fa-solid fa-graduation-cap"></i> ادرس الوحدات بالتفصيل
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
