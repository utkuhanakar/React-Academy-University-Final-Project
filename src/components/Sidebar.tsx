import type { LessonModuleId } from '../types'

export interface SidebarLessonRow {
  id: string
  title: string
  difficulty: string
}

export interface SidebarSection {
  sectionKey: LessonModuleId
  sectionTitle: string
  lessons: readonly SidebarLessonRow[]
}

export interface SidebarProps {
  heading: string
  sections: readonly SidebarSection[]
  selectedLessonId: string | null
  onSelectLesson: (lessonId: string) => void
  completedLessons?: readonly string[]
  /** Arama sonucu ders yoksa gösterilir */
  showEmptySearch?: boolean
  skillsStudioActive?: boolean
  onOpenSkillsStudio?: () => void
  /** Küçük ekranda çekmece; masaüstünde nötr kalır */
  narrowScreenDrawer?: boolean
  narrowDrawerOpen?: boolean
  onNarrowDrawerClose?: () => void
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
      <path
        d="M6 10.25l2.5 2.5L14 7.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Sidebar({
  heading,
  sections,
  selectedLessonId,
  onSelectLesson,
  completedLessons = [],
  showEmptySearch = false,
  skillsStudioActive = false,
  onOpenSkillsStudio,
  narrowScreenDrawer = false,
  narrowDrawerOpen = false,
  onNarrowDrawerClose,
}: SidebarProps) {
  const closeIfDrawer = () => {
    if (narrowScreenDrawer && narrowDrawerOpen) onNarrowDrawerClose?.()
  }

  const handleLessonClick = (id: string) => {
    onSelectLesson(id)
    closeIfDrawer()
  }

  return (
    <aside
      id="sidebar-ders-cekmecesi"
      className={[
        'w-full shrink-0 border-neutral-200 bg-neutral-50 print:hidden dark:border-neutral-700 dark:bg-zinc-950/85',
        narrowScreenDrawer
          ? [
              'fixed inset-y-0 left-0 z-50 flex max-h-none w-[min(100%,21rem)] max-w-[100vw] flex-col overflow-hidden border-y-0 border-l-0 border-r border-neutral-200 shadow-xl transition-transform duration-200 ease-out dark:border-neutral-700 lg:static lg:inset-auto lg:z-auto lg:max-h-none lg:max-w-none lg:w-72 lg:translate-x-0 lg:shadow-none',
              narrowDrawerOpen
                ? 'translate-x-0'
                : '-translate-x-full lg:translate-x-0',
            ].join(' ')
          : [
              'shrink-0 border-b lg:w-72 lg:border-b-0 lg:border-r lg:border-neutral-200 lg:dark:border-neutral-700',
            ].join(' '),
      ].join(' ')}
    >
        <div className="grow overflow-y-auto p-4 lg:sticky lg:top-0 lg:max-h-screen">
          {narrowScreenDrawer ? (
            <div className="mb-4 flex justify-end lg:hidden">
              <button
                type="button"
                onClick={() => onNarrowDrawerClose?.()}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-white dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-zinc-800"
              >
                Kapat
              </button>
            </div>
          ) : null}
          {onOpenSkillsStudio ? (
            <button
              type="button"
              onClick={() => {
                onOpenSkillsStudio()
                closeIfDrawer()
              }}
              aria-pressed={skillsStudioActive}
              className={[
                'mb-4 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-3 text-left text-sm font-semibold transition',
                skillsStudioActive
                  ? 'border-teal-600 bg-white shadow-sm ring-1 ring-teal-600/20 dark:border-teal-500 dark:bg-teal-950/35 dark:text-teal-50 dark:ring-teal-500/25'
                  : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-zinc-900 dark:text-neutral-200 dark:hover:bg-zinc-800',
              ].join(' ')}
            >
            <span>Çalışma stüdyosu</span>
            <span
              className="font-mono text-xs text-teal-700 dark:text-teal-400"
              aria-hidden
            >
              ≡
            </span>
          </button>
        ) : null}
        <h2 className="mb-4 border-b border-neutral-200 pb-3 text-lg font-semibold text-neutral-900 dark:border-neutral-700 dark:text-neutral-100">
          {heading}
        </h2>
        {showEmptySearch ? (
          <p
            className="rounded-md border border-neutral-200 bg-white px-3 py-4 text-center text-sm text-neutral-600 dark:border-neutral-600 dark:bg-zinc-900 dark:text-neutral-400"
            role="status"
          >
            Sonuç bulunamadı
          </p>
        ) : (
          <nav aria-label="Ders listesi" className="space-y-6">
            {sections.map((section) => (
              <div key={section.sectionKey}>
                <h3 className="mb-2 pl-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  {section.sectionTitle}
                </h3>
                <ul className="ml-2 space-y-0.5 border-l border-neutral-200 pl-3 dark:border-neutral-700">
                  {section.lessons.map((lesson) => {
                    const selected = lesson.id === selectedLessonId
                    const done = completedLessons.includes(lesson.id)
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => handleLessonClick(lesson.id)}
                          className={[
                            'group flex w-full items-start gap-2 rounded-r-md border-l-[3px] py-2.5 pl-3 pr-2 text-left text-sm transition-colors',
                            selected
                              ? 'border-l-teal-600 bg-white text-neutral-900 shadow-sm dark:border-l-teal-500 dark:bg-zinc-800 dark:text-neutral-50'
                              : 'border-l-transparent bg-transparent text-neutral-700 hover:bg-white/70 dark:text-neutral-300 dark:hover:bg-zinc-800/70',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'min-w-0 flex-1 leading-snug',
                              selected ? 'font-semibold' : 'font-normal',
                            ].join(' ')}
                          >
                            {lesson.title}
                            <span className="mt-0.5 block text-xs font-normal text-neutral-500 dark:text-neutral-500">
                              {lesson.difficulty}
                            </span>
                          </span>
                          {done ? (
                            <CheckIcon className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-400" />
                          ) : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </div>
    </aside>
  )
}
