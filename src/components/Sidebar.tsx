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
        'w-full shrink-0 border-[#d9eee1] bg-[#f1f8f4] print:hidden dark:border-[#333] dark:bg-[#1a2120]',
        narrowScreenDrawer
          ? [
              'fixed inset-y-0 left-0 z-50 flex max-h-none w-[min(100%,21rem)] max-w-[100vw] flex-col overflow-hidden border-y-0 border-l-0 border-r border-[#d9eee1] shadow-2xl transition-transform duration-200 ease-out lg:static lg:inset-auto lg:z-auto lg:max-h-none lg:max-w-none lg:w-72 lg:translate-x-0 lg:shadow-none',
              narrowDrawerOpen
                ? 'translate-x-0'
                : '-translate-x-full lg:translate-x-0',
            ].join(' ')
          : [
              'shrink-0 border-b lg:w-72 lg:border-b-0 lg:border-r lg:border-[#d9eee1] lg:dark:border-[#333]',
            ].join(' '),
      ].join(' ')}
    >
        <div className="grow overflow-y-auto p-4 lg:sticky lg:top-0 lg:max-h-screen">
          {narrowScreenDrawer ? (
            <div className="mb-4 flex justify-end lg:hidden">
              <button
                type="button"
                onClick={() => onNarrowDrawerClose?.()}
                className="rounded-lg border border-[#cdebd8] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#282c35] hover:bg-white dark:border-[#3c4944] dark:text-[#e8e8e8] dark:hover:bg-[#222b28]"
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
                'mb-4 flex w-full items-center justify-between gap-2 rounded-lg border-2 px-3 py-3 text-left text-sm font-bold transition',
                skillsStudioActive
                  ? 'border-[#04aa6d] bg-[#d9eee1] text-[#1a1e2e] shadow-sm dark:border-[#89d185] dark:bg-[#253329] dark:text-[#cce8d4] dark:shadow-inner'
                  : 'border-[#cdebd8] bg-white text-[#282c35] hover:border-[#04aa6d]/60 hover:bg-white dark:border-[#2d3834] dark:bg-[#222b28] dark:text-[#ddd] dark:hover:border-[#89d185]/50 dark:hover:bg-[#26302c]',
              ].join(' ')}
            >
            <span>Çalışma stüdyosu</span>
            <span
              className="font-mono text-xs text-[#3c9c6c] dark:text-[#89d185]"
              aria-hidden
            >
              ≡
            </span>
          </button>
        ) : null}
        <h2 className="mb-4 border-b border-[#d9eee1] pb-3 text-lg font-semibold text-[#282c35] dark:border-[#333] dark:text-[#e8e8e8]">
          {heading}
        </h2>
        {showEmptySearch ? (
          <p
            className="rounded-md border border-[#cdebd8] bg-white/80 px-3 py-4 text-center text-sm text-[#5f6368] dark:border-[#3c4944] dark:bg-[#1e2523] dark:text-[#aeb4b2]"
            role="status"
          >
            Sonuç bulunamadı
          </p>
        ) : (
          <nav aria-label="Ders listesi" className="space-y-6">
            {sections.map((section) => (
              <div key={section.sectionKey}>
                <h3 className="mb-2 pl-1 text-xs font-bold uppercase tracking-wider text-[#3c9c6c] dark:text-[#89d185]">
                  {section.sectionTitle}
                </h3>
                <ul className="ml-2 space-y-0.5 border-l-2 border-[#cdebd8] pl-3 dark:border-[#2d3834]">
                  {section.lessons.map((lesson) => {
                    const selected = lesson.id === selectedLessonId
                    const done = completedLessons.includes(lesson.id)
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => handleLessonClick(lesson.id)}
                          className={[
                            'group flex w-full items-start gap-2 rounded-r-md border-l-4 py-2.5 pl-3 pr-2 text-left text-sm transition-colors',
                            selected
                              ? 'border-l-[#04aa6d] bg-[#d9eee1] text-[#1a1e2e] shadow-sm dark:border-l-[#89d185] dark:bg-[#253329] dark:text-[#e8f8ef] dark:shadow-md'
                              : 'border-l-transparent bg-transparent text-[#3c4043] hover:bg-white/80 dark:text-[#c9cfcc] dark:hover:bg-[#222b28]',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'min-w-0 flex-1 leading-snug',
                              selected ? 'font-semibold' : 'font-normal',
                            ].join(' ')}
                          >
                            {lesson.title}
                            <span className="mt-0.5 block text-xs font-normal text-[#5f6368] dark:text-[#8f9a94]">
                              {lesson.difficulty}
                            </span>
                          </span>
                          {done ? (
                            <CheckIcon className="mt-0.5 shrink-0 text-[#04aa6d] dark:text-[#89d185]" />
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
