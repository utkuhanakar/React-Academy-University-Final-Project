import type { LessonModuleId } from '../types'
import type { SidebarSection } from './Sidebar'

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
    '`expert-site-mimarisi` dersini okuyarak bu repodaki `src/` klasör sınırlarını ve akışları eşleyin.',
    '`expert-performans-ve-bundle` için **lazy/Suspense** veya paket bölmesi fikrini iki maddede özetleyin.',
    '`expert-build-env-ve-yayinlama` ile `npm run build` çıktısını (**`dist/`**) ve güvenli env ayrımını rapora bağlayın.',
    'İsteğe bağlı Supabase yapı taşları yerel `localStorage` ile karşılaştırın.',
  ],
}

export default function CategoriesPage({
  sections,
  sectionHomeworkBullets,
  onPickLesson,
  completedLessonIds,
  onOpenLearningGuide,
}: CategoriesPageProps) {
  return (
    <article className="border-b border-neutral-200 bg-gradient-to-br from-emerald-50/70 via-white to-neutral-50 text-neutral-900 dark:border-[#333] dark:from-emerald-950/20 dark:via-[#1e1e1e] dark:to-[#181818] dark:text-[#ececec]">
      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
        <header className="mb-10 border-b border-neutral-200 pb-8 dark:border-slate-700">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400/90">
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
            <div className="mt-6 rounded-2xl border border-sky-200/90 bg-sky-50/80 px-5 py-4 dark:border-sky-800/60 dark:bg-sky-950/30">
              <p className="text-sm font-semibold text-sky-950 dark:text-sky-100">
                Tam ders dizini, nötr dilde teknik özet ve sözlük
              </p>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-sky-900/90 dark:text-sky-100/85">
                Mimari özet, dosya–görev eşlemesi ve sözlük tekrar kullanımı için tek sayfada düzenlenmiştir;
                belge veya kendi notlarınıza aktarırken doğrudan bu başlıkları izleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={onOpenLearningGuide}
                className="mt-4 rounded-xl border border-sky-700/40 bg-sky-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-sky-800 dark:border-sky-500/30 dark:bg-sky-800 dark:hover:bg-sky-700"
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
                <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-md ring-1 ring-black/5 dark:border-slate-700/80 dark:bg-slate-900/50 dark:ring-white/5">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 bg-neutral-50/90 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-slate-400">
                        ({i + 1}) Modül · {section.sectionKey}
                      </span>
                      <h2 className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                        {section.sectionTitle}
                      </h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-600/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100">
                      {completedInSection}/{section.lessons.length} tamamlanan
                    </span>
                  </div>
                  <div className="grow space-y-4 px-5 py-5 text-sm leading-relaxed text-neutral-700 dark:text-slate-300">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400/95">
                      Öğrenme çıktıları (özet)
                    </p>
                    <ul className="list-disc space-y-1 pl-5">
                      {bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-neutral-100 bg-neutral-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/70">
                    {firstLesson ? (
                      <button
                        type="button"
                        onClick={() => onPickLesson(firstLesson.id)}
                        className="w-full rounded-xl border border-emerald-700/35 bg-emerald-600 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow hover:bg-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-800 dark:hover:bg-emerald-700"
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
