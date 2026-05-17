import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import type { LessonModuleId } from '../types'
import type { SidebarSection } from './Sidebar'
import { createMarkdownComponents, markdownRemarkPlugins } from './MarkdownCodeBlocks'

export interface CategoriesPageProps {
  sections: readonly SidebarSection[]
  sectionHomeworkBullets?: Partial<Record<LessonModuleId, readonly string[]>>
  onPickLesson: (lessonId: string) => void
  completedLessonIds: readonly string[]
  /** Modül özeti içinden Öğrenme Rehberi’ni açmak için */
  onOpenLearningGuide?: () => void
}

const DEFAULT_TASKS: Record<LessonModuleId, readonly string[]> = {
  intro: [
    'ES6 sözdizimini özetteki örneklerle eşleyin.',
    'JSX ifadelerinde `{ }` kullanımını mini bir bileşende deneyin.',
  ],
  components: [
    'Props ile veri indiren küçük bir kart bileşeni yazın.',
    '`children` ile saran bir layout bileşeni kurun.',
  ],
  'state-lists': [
    'Liste + stabil `key` ile bir gösterim seçin.',
    'Kontrollü tek alanlı form oluşturun.',
  ],
  hooks: [
    '`useEffect` bağımlılık listesi üzerinden kısa not çıkarın.',
    'Tek bir özelleştirilmiş hook iskeleti yazın.',
  ],
  expert: [
    '`expert-site-mimarisi` dersini okuyarak bu repodaki `src/` klasörünü ve dosya akışını eşleyin.',
    '`expert-performans-ve-bundle` için **lazy/Suspense** veya paket bölmesi fikrini iki madde ile özetleyin.',
    '`expert-build-env-ve-yayinlama` dersinde `npm run build` çıktısını (**dist/**) ve güvenli **ortam değişkenleri** ayrımını kısa raporda bağlayın. (Slug ASCII: `expert-build-env-ve-yayinlama`; anlam olarak **yayımlama**.)',
    'İsteğe bağlı Supabase yapı taşlarını yerel `localStorage` ile karşılaştırın.',
  ],
}

export default function CategoriesPage({
  sections,
  sectionHomeworkBullets,
  onPickLesson,
  completedLessonIds,
  onOpenLearningGuide,
}: CategoriesPageProps) {
  const mdBullet = useMemo(() => createMarkdownComponents(), [])
  return (
    <article className="border-b border-neutral-200 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 text-neutral-900 dark:border-[#333] dark:from-zinc-900/40 dark:via-[#1e1e1e] dark:to-[#181818] dark:text-[#ececec]">
      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
        <header className="mb-10 border-b border-neutral-200 pb-8 dark:border-slate-700">
          <p className="text-xs font-medium tracking-tight text-neutral-600 dark:text-neutral-400">
            Özet · modül kartları · kontrol listesi
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
            Modül kategorileri
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-700 dark:text-slate-300">
            Konulara modül modül göz atabilir veya doğrudan bir derse geçebilirsiniz. Her kartta öğrenmeyi özetleyen
            iki kısa kontrol maddesi yer alır — kendi çalışma planınıza göre uyarlarsınız.
          </p>
          {onOpenLearningGuide ? (
            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-600 dark:bg-zinc-900/50">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Tam ders dizini, teknik özet ve sözlük
              </p>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Mimari özet, dosya–görev eşlemesi ve sözlük tekrar kullanımı için tek sayfada düzenlenmiştir;
                belge veya kendi notlarınıza aktarırken doğrudan bu başlıkları izleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={onOpenLearningGuide}
                className="mt-4 rounded-lg border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Öğrenme rehberine git — tam ders dizini
              </button>
            </div>
          ) : null}
        </header>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sections.map((section, i) => {
            const bullets =
              sectionHomeworkBullets?.[section.sectionKey] ??
              DEFAULT_TASKS[section.sectionKey]
            const completedInSection = section.lessons.filter((l) =>
              completedLessonIds.includes(l.id),
            ).length
            const firstLesson = section.lessons[0]
            return (
              <li key={section.sectionKey}>
                <section className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200/90 bg-white shadow-md ring-1 ring-black/5 dark:border-slate-700/80 dark:bg-slate-900/50 dark:ring-white/5">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 bg-neutral-50/90 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-slate-400">
                        ({i + 1}) Modül · {section.sectionKey}
                      </span>
                      <h2 className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                        {section.sectionTitle}
                      </h2>
                    </div>
                    <span className="shrink-0 rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-600 dark:bg-zinc-800 dark:text-neutral-200">
                      {completedInSection}/{section.lessons.length} tamamlanan
                    </span>
                  </div>
                  <div className="grow space-y-4 px-5 py-5 text-sm leading-relaxed text-neutral-700 dark:text-slate-300">
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-400">
                      Öğrenme çıktıları (özet)
                    </p>
                    <ul className="list-disc space-y-2 pl-5">
                      {bullets.map((b) => (
                        <li key={b} className="marker:text-emerald-700 dark:marker:text-emerald-500/95">
                          <div className="lesson-md prose prose-sm max-w-none dark:prose-invert prose-p:my-0 prose-li:my-0 prose-headings:my-1 prose-a:text-emerald-800 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-emerald-400/95">
                            <ReactMarkdown
                              remarkPlugins={markdownRemarkPlugins}
                              components={mdBullet}
                            >
                              {b}
                            </ReactMarkdown>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-neutral-100 bg-neutral-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/70">
                    {firstLesson ? (
                      <button
                        type="button"
                        onClick={() => onPickLesson(firstLesson.id)}
                        className="w-full rounded-lg border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                      >
                        Bu modülde ilk derse git — {firstLesson.title}
                      </button>
                    ) : (
                      <p className="text-xs text-neutral-500">Henüz ders yok.</p>
                    )}
                  </div>
                </section>
              </li>
            )
          })}
        </ol>
      </div>
    </article>
  )
}
