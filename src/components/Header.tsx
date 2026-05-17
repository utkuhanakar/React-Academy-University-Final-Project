import { useTheme } from '../theme/useTheme'

export interface HeaderProps {
  /** Uygulama adı; logo yanında veya görünür başlık olarak kullanılır. */
  appTitle: string
  /** Logo görseli yolu (ör. `/favicon.svg`). */
  logoSrc: string
  /** Logo için erişilebilir alternatif metin. */
  logoAlt: string
  /** Tamamlanan adım sayısı (ör. bitirilen ders). */
  progressCurrent: number
  /** Toplam adım sayısı. */
  progressTotal: number
  /** İlerleme çubuğu için kısa etiket (erişilebilirlik). */
  progressDescription?: string
  /** Arama kutusu (kontrollü). */
  searchQuery?: string
  onSearchQueryChange?: (query: string) => void
  /** Çalışma stüdyosu paneli aktif mi */
  skillsStudioActive?: boolean
  onOpenSkillsStudio?: () => void
  /** Modül kategorileri / konu özeti */
  categoriesActive?: boolean
  onOpenCategories?: () => void
  /** Öğrenme rehberi · tam müfredat haritası */
  guideActive?: boolean
  onOpenLearningGuide?: () => void
  /** Küçük ekranda ders listesi çekmecesi */
  lessonNavExpanded?: boolean
  onToggleLessonNav?: () => void
}

function clampProgress(current: number, total: number): number {
  if (total <= 0) return 0
  const ratio = current / total
  return Math.max(0, Math.min(100, Math.round(ratio * 100)))
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.36 5.64l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function MenuHamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export default function Header({
  appTitle,
  logoSrc,
  logoAlt,
  progressCurrent,
  progressTotal,
  progressDescription = 'Modül ilerlemesi',
  searchQuery = '',
  onSearchQueryChange,
  skillsStudioActive = false,
  onOpenSkillsStudio,
  categoriesActive = false,
  onOpenCategories,
  guideActive = false,
  onOpenLearningGuide,
  lessonNavExpanded = false,
  onToggleLessonNav,
}: HeaderProps) {
  const { resolvedTheme, storedPreference, toggleTheme } = useTheme()
  const percent = clampProgress(progressCurrent, progressTotal)
  const showSearch = onSearchQueryChange != null
  const showSkillsStudio = onOpenSkillsStudio != null
  const showCategories = onOpenCategories != null
  const showGuide = onOpenLearningGuide != null
  const showNavToggle = onToggleLessonNav != null

  return (
    <header className="border-b border-neutral-200 bg-white print:hidden dark:border-[#3c3c3c] dark:bg-[#252526]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:gap-6 sm:px-5 sm:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="flex min-w-0 items-start gap-2 sm:gap-4">
            {showNavToggle ? (
              <button
                type="button"
                onClick={onToggleLessonNav}
                aria-expanded={lessonNavExpanded}
                aria-controls="sidebar-ders-cekmecesi"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-800 lg:hidden dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#ececec]"
                aria-label="Ders menüsünü aç ya da kapat"
              >
                <MenuHamburgerIcon />
              </button>
            ) : null}
            <img
              src={logoSrc}
              alt={logoAlt}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-[#cccccc]/80">
                Öğren
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-[#f3f3f3] sm:text-2xl">
                {appTitle}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {showCategories ? (
                  <button
                    type="button"
                    onClick={onOpenCategories}
                    aria-pressed={categoriesActive}
                    className={[
                      'rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs',
                      categoriesActive
                        ? 'border-violet-500 bg-violet-500/15 text-violet-950 shadow-inner dark:border-violet-400 dark:bg-violet-950/40 dark:text-violet-100'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-violet-500/70 hover:bg-violet-50/60 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#d4d4d4]',
                    ].join(' ')}
                  >
                    Modüller
                  </button>
                ) : null}
                {showGuide ? (
                  <button
                    type="button"
                    onClick={onOpenLearningGuide}
                    aria-pressed={guideActive}
                    className={[
                      'rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs',
                      guideActive
                        ? 'border-sky-600 bg-sky-500/15 text-sky-950 shadow-inner dark:border-sky-400 dark:bg-sky-950/40 dark:text-sky-100'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-sky-500/70 hover:bg-sky-50/60 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#d4d4d4]',
                    ].join(' ')}
                  >
                    Rehber
                  </button>
                ) : null}
                {showSkillsStudio ? (
                  <button
                    type="button"
                    onClick={onOpenSkillsStudio}
                    aria-pressed={skillsStudioActive}
                    className={[
                      'rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs',
                      skillsStudioActive
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-200 shadow-inner dark:border-[#04aa6d] dark:bg-[#1e3d2f] dark:text-[#b6f0d1]'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#d4d4d4]',
                    ].join(' ')}
                  >
                    Stüdyo
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-full min-w-0 lg:max-w-sm">
            <div className="mb-2 flex items-center justify-between gap-2 text-xs text-neutral-600 sm:text-sm dark:text-[#cccccc]">
              <span className="min-w-0 truncate">{progressDescription}</span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-medium tabular-nums text-neutral-800 dark:text-[#f3f3f3]">
                  {progressCurrent} / {progressTotal}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-700 transition hover:bg-neutral-100 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#d4d4d4]"
                  title="Tema"
                  aria-label={
                    storedPreference === 'system'
                      ? 'Tema: işletim sistemi; tıkla sıradaki seçenek.'
                      : storedPreference === 'light'
                        ? 'Tema açık; tıklayınca koyu seçilir.'
                        : 'Tema koyu; tıklayınca sistemle senkron.'
                  }
                >
                  {resolvedTheme === 'dark' ? (
                    <SunIcon className="text-amber-300" />
                  ) : (
                    <MoonIcon className="text-slate-600" />
                  )}
                </button>
              </div>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 sm:h-3 dark:bg-[#3c3c3c]"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progressDescription}: yüzde ${percent}`}
            >
              <div
                className="h-full rounded-full bg-green-600 dark:bg-[#89d185]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {showSearch ? (
          <div className="w-full min-w-0">
            <label htmlFor="ders-arama" className="sr-only">
              Ders ara
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#858585]"
                aria-hidden
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                id="ders-arama"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange?.(e.target.value)}
                placeholder="Ders ara…"
                autoComplete="off"
                className="w-full rounded-xl border border-neutral-300 bg-neutral-50 py-2.5 pl-10 pr-4 text-[16px] text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/20 sm:text-sm dark:border-[#474747] dark:bg-[#1e1e1e] dark:text-[#ececec]"
              />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
