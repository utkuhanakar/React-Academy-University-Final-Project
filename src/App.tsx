import { Suspense, lazy, useCallback, useMemo, useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import LessonWorkspace from './components/LessonWorkspace'
import Sidebar from './components/Sidebar'
import CloudSyncPanel from './components/CloudSyncPanel'

const CategoriesPage = lazy(() => import('./components/CategoriesPage'))
const SkillsStudioPage = lazy(() => import('./components/SkillsStudioPage'))
const LearningGuidePage = lazy(() => import('./components/LearningGuidePage'))
import { lessons } from './data/lessons'
import { useSyncedLearningProgress } from './hooks/useSyncedLearningProgress'
import type { LessonModuleId } from './types'
const totalLessonCount = lessons.length

const SECTION_ORDER: LessonModuleId[] = [
  'intro',
  'components',
  'state-lists',
  'hooks',
  'expert',
]

const SECTION_TITLES: Record<LessonModuleId, string> = {
  intro: 'ES6 & JSX temelleri',
  components: 'Bileşenler & Props',
  'state-lists': 'State, Listeler & Formlar',
  hooks: 'React Hooks',
  expert: 'Uzman Seviyesi',
}

/** Lazy paneller ilk kez görünürken kısa yük bildirimi. */
function LazyPanelSkeleton({ title }: { title: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[42vh] flex-col items-center justify-center gap-4 px-6 py-14 text-neutral-600 dark:text-[#bdbdbd]"
    >
      <span
        className="inline-block h-11 w-11 animate-spin rounded-full border-[3px] border-neutral-200 border-t-green-600 dark:border-[#474747] dark:border-t-[#89d185]"
        aria-hidden
      />
      <p className="text-sm font-semibold">{title}</p>
    </div>
  )
}

type MainPanel = 'lesson' | 'skills' | 'categories' | 'guide'

export default function App() {
  const LESSON_CURRICULUM_IDS = useMemo(() => lessons.map((l) => l.id), [])
  const firstLessonId = LESSON_CURRICULUM_IDS[0] ?? ''

  const {
    hydrated: progressHydrated,
    cloudConfigured,
    cloudSessionActive,
    userEmail,
    syncError,
    completedLessonIds,
    lastLessonId: syncedLastLessonId,
    setLastLessonId,
    markLessonCompleted,
    extended,
    updateExtended,
    setSkillsStudioTab,
    requestEmailOtp,
    verifyEmailOtp,
    signOutCloud,
  } = useSyncedLearningProgress(LESSON_CURRICULUM_IDS)

  const [mainPanel, setMainPanel] = useState<MainPanel>('lesson')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentLessonId, setCurrentLessonId] = useState<string>(() => firstLessonId)
  const [lessonChoiceExplicit, setLessonChoiceExplicit] = useState(false)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)

  const mergedLessonId = useMemo(() => {
    if (!progressHydrated) return currentLessonId || firstLessonId
    if (lessonChoiceExplicit) return currentLessonId || firstLessonId
    return syncedLastLessonId || firstLessonId
  }, [
    progressHydrated,
    lessonChoiceExplicit,
    currentLessonId,
    syncedLastLessonId,
    firstLessonId,
  ])

  const filteredLessons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return lessons
    return lessons.filter((lesson) => {
      const matchesTitleOrBody =
        lesson.title.toLowerCase().includes(q) ||
        lesson.content.toLowerCase().includes(q)
      if (matchesTitleOrBody) return true
      return lesson.codeExamples.some(
        (ex) =>
          ex.title.toLowerCase().includes(q) ||
          ex.code.toLowerCase().includes(q) ||
          (ex.caption?.toLowerCase().includes(q) ?? false),
      )
    })
  }, [searchQuery])

  const activeLesson = useMemo(() => {
    const lessonMatchingCurrentId = lessons.find(
      (lesson) => lesson.id === mergedLessonId,
    )
    return lessonMatchingCurrentId ?? lessons[0]
  }, [mergedLessonId])

  const sidebarSections = useMemo(
    () =>
      SECTION_ORDER.map((moduleId) => ({
        sectionKey: moduleId,
        sectionTitle: SECTION_TITLES[moduleId],
        lessons: filteredLessons
          .filter((l) => l.moduleId === moduleId)
          .map((l) => ({
            id: l.id,
            title: l.title,
            difficulty: l.difficulty,
          })),
      })).filter((s) => s.lessons.length > 0),
    [filteredLessons],
  )

  const showEmptySearch = searchQuery.trim().length > 0 && filteredLessons.length === 0

  const activeLessonIndex = useMemo(
    () => lessons.findIndex((l) => l.id === mergedLessonId),
    [mergedLessonId],
  )

  const nextLessonId =
    activeLessonIndex >= 0 && activeLessonIndex < lessons.length - 1
      ? lessons[activeLessonIndex + 1]!.id
      : null

  const completedLessonCount = completedLessonIds.length

  const isCurrentLessonAlreadyCompleted = useMemo(
    () =>
      activeLesson ? completedLessonIds.includes(activeLesson.id) : false,
    [activeLesson, completedLessonIds],
  )

  const handleLessonFinished = useCallback(
    (lessonId: string) => {
      markLessonCompleted(lessonId)
    },
    [markLessonCompleted],
  )

  const handleSelectLessonFromSidebar = useCallback(
    (lessonId: string) => {
      setLessonChoiceExplicit(true)
      setSidebarMobileOpen(false)
      setMainPanel('lesson')
      setCurrentLessonId(lessonId)
      setLastLessonId(lessonId)
    },
    [setLastLessonId],
  )

  const handleOpenSkillsStudio = useCallback(() => {
    setSidebarMobileOpen(false)
    setMainPanel('skills')
  }, [])

  const handleOpenCategories = useCallback(() => {
    setSidebarMobileOpen(false)
    setMainPanel('categories')
  }, [])

  const handleOpenLearningGuide = useCallback(() => {
    setSidebarMobileOpen(false)
    setMainPanel('guide')
  }, [])

  const handleGoToNextLessonWrapped = useCallback(() => {
    setMainPanel('lesson')
    if (!nextLessonId) return
    setLessonChoiceExplicit(true)
    setCurrentLessonId(nextLessonId)
    setLastLessonId(nextLessonId)
  }, [nextLessonId, setLastLessonId])

  const footerTagline = useMemo(() => {
    let intro = ''
    if (cloudConfigured) {
      intro = cloudSessionActive
        ? 'Bulutta senkron açık. '
        : 'İsteğe bağlı hesap bağlantısı ile ilerlemeniz cihazlar arasında tutulabilir; '
    }
    return (
      `${intro}` +
      'Yerel önbelleğe ek olarak bulut hesabı bağlıysanız ders tamamlanmaları ve alıştırma yolu istatistikleri de senkron kalabilir. ' +
      'Metinler Markdown ile işlenir; görevleri canlı kod alanından deneyin.'
    )
  }, [cloudConfigured, cloudSessionActive])

  if (!activeLesson && totalLessonCount === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-[#0d0d0f]">
        <Header
          appTitle="React Akademi"
          logoSrc={`${import.meta.env.BASE_URL}favicon.svg`}
          logoAlt="React Akademi logosu"
          progressCurrent={0}
          progressTotal={1}
          progressDescription="Tamamlanan dersler"
        />
        <p className="p-10 text-center text-neutral-600 dark:text-[#cccccc]">
          Henüz yayınlanmış ders bulunmuyor.
        </p>
        <Footer
          siteName="React Akademi"
          tagline="İçerikler `data` klasöründeki modül dosyalarından yüklenir."
        />
      </div>
    )
  }

  return (
      <div className="flex min-h-screen flex-col bg-neutral-100 print:bg-white dark:bg-[#0d0d0f]">
        <a
          href="#main-content"
          className="fixed left-4 top-0 z-[200] -translate-y-full rounded-b-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg outline-none ring-emerald-300 transition-transform hover:bg-emerald-800 focus-visible:translate-y-0 focus-visible:ring-4 dark:bg-emerald-800 dark:ring-emerald-500/50"
        >
          Ana içeriğe atla
        </a>
        <Header
          appTitle="React Akademi"
          logoSrc={`${import.meta.env.BASE_URL}favicon.svg`}
          logoAlt="React Akademi logosu"
          progressCurrent={completedLessonCount}
          progressTotal={Math.max(totalLessonCount, 1)}
          progressDescription="Tamamlanan dersler"
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          skillsStudioActive={mainPanel === 'skills'}
          onOpenSkillsStudio={handleOpenSkillsStudio}
          categoriesActive={mainPanel === 'categories'}
          onOpenCategories={handleOpenCategories}
          guideActive={mainPanel === 'guide'}
          onOpenLearningGuide={handleOpenLearningGuide}
          lessonNavExpanded={sidebarMobileOpen}
          onToggleLessonNav={() => setSidebarMobileOpen((x) => !x)}
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col border-x border-neutral-200 bg-white shadow-sm dark:border-[#3c3c3c] dark:bg-[#1e1e1e] lg:flex-row">
        {sidebarMobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-black/45 lg:hidden"
            aria-label="Menüyü kapat"
            onClick={() => setSidebarMobileOpen(false)}
          />
        ) : null}
        <Sidebar
          heading="Dersler"
          sections={sidebarSections}
          selectedLessonId={
            mainPanel === 'skills' ||
            mainPanel === 'categories' ||
            mainPanel === 'guide'
              ? null
              : activeLesson.id
          }
          onSelectLesson={handleSelectLessonFromSidebar}
          completedLessons={completedLessonIds}
          showEmptySearch={showEmptySearch}
          skillsStudioActive={mainPanel === 'skills'}
          onOpenSkillsStudio={handleOpenSkillsStudio}
          narrowScreenDrawer
          narrowDrawerOpen={sidebarMobileOpen}
          onNarrowDrawerClose={() => setSidebarMobileOpen(false)}
        />

        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 bg-white outline-none dark:bg-[#1e1e1e]">
          <Suspense
            fallback={
              <LazyPanelSkeleton
                title={
                  mainPanel === 'skills'
                    ? 'Çalışma stüdyosu hazırlanıyor…'
                    : mainPanel === 'guide'
                      ? 'Öğrenme rehberi yükleniyor…'
                      : mainPanel === 'categories'
                        ? 'Modül özeti hazırlanıyor…'
                        : 'Yükleniyor…'
                }
              />
            }
          >
            {mainPanel === 'categories' ? (
            <CategoriesPage
              sections={sidebarSections}
              onPickLesson={handleSelectLessonFromSidebar}
              completedLessonIds={completedLessonIds}
              onOpenLearningGuide={handleOpenLearningGuide}
            />
          ) : mainPanel === 'guide' ? (
            <LearningGuidePage
              lessons={lessons}
              completedLessonIds={completedLessonIds}
              onPickLesson={handleSelectLessonFromSidebar}
              onOpenStudio={handleOpenSkillsStudio}
            />
          ) : mainPanel === 'skills' ? (
            <SkillsStudioPage
              extended={extended}
              updateExtended={updateExtended}
              setSkillsStudioTab={setSkillsStudioTab}
            />
          ) : (
            <LessonWorkspace
              key={activeLesson.id}
              lesson={activeLesson}
              isLessonAlreadyCompleted={isCurrentLessonAlreadyCompleted}
              nextLessonId={nextLessonId}
              onLessonFinished={handleLessonFinished}
              onGoToNextLesson={handleGoToNextLessonWrapped}
            />
          )}
          </Suspense>
        </main>
      </div>

      <CloudSyncPanel
        cloudConfigured={cloudConfigured}
        hydrated={progressHydrated}
        cloudSessionActive={cloudSessionActive}
        userEmail={userEmail}
        syncError={syncError}
        requestEmailOtp={(email) => requestEmailOtp(email)}
        verifyEmailOtp={(email, token) => verifyEmailOtp(email, token)}
        signOutCloud={signOutCloud}
      />

      <Footer siteName="React Akademi" tagline={footerTagline} />
    </div>
  )
}
