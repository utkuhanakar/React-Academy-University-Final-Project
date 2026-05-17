import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { QUICK_REFERENCE_CARDS } from '../data/quickReferenceCards'
import {
  PRACTICE_PATH_STEP_IDS,
  PRACTICE_PATH_STEPS,
} from '../data/practicePath'
import { SKILLS_STUDIO_DRILLS } from '../data/skillsStudioDrills'
import {
  defaultPathPreferences,
  extendedWithEngagementTouch,
  type ExtendedUserProgressV1,
  type SkillsStudioTabId,
} from '../utils/extendedProgress'
import { resolveLessonQuizCorrectIndex } from '../utils/lessonQuizHelpers'
import {
  buildRandomMixedPracticePathOrder,
  isValidPathOrder,
  resolvePracticePathOrder,
} from '../utils/practicePathShuffle'
import { createMarkdownComponents, markdownRemarkPlugins } from './MarkdownCodeBlocks'
import Quiz from './Quiz'

export interface SkillsStudioPageProps {
  extended: ExtendedUserProgressV1
  updateExtended: (fn: (e: ExtendedUserProgressV1) => ExtendedUserProgressV1) => void
  setSkillsStudioTab: (t: SkillsStudioTabId) => void
}

export default function SkillsStudioPage({
  extended,
  updateExtended,
  setSkillsStudioTab,
}: SkillsStudioPageProps) {
  const tab: SkillsStudioTabId = extended.skillsLastTab ?? 'drills'
  const [drillIx, setDrillIx] = useState(0)
  const [pathQuizEpoch, setPathQuizEpoch] = useState(0)
  const md = useMemo(() => createMarkdownComponents(), [])

  const canonicalIds = PRACTICE_PATH_STEP_IDS
  const stepById = useMemo(
    () => new Map(PRACTICE_PATH_STEPS.map((s) => [s.id, s])),
    [],
  )

  const resolvedOrder = useMemo(
    () =>
      resolvePracticePathOrder(
        extended.practicePath.orderedStepIds,
        canonicalIds,
        PRACTICE_PATH_STEPS,
      ),
    [
      extended.practicePath.orderedStepIds,
      canonicalIds,
    ],
  )

  useEffect(() => {
    if (
      isValidPathOrder(extended.practicePath.orderedStepIds, canonicalIds)
    ) {
      return
    }
    const order = resolvePracticePathOrder(
      extended.practicePath.orderedStepIds,
      canonicalIds,
      PRACTICE_PATH_STEPS,
    )
    const maxIx = Math.max(0, order.length - 1)
    updateExtended((ext) => ({
      ...ext,
      practicePath: {
        ...ext.practicePath,
        orderedStepIds: order,
        cursor:
          order.length === 0
            ? 0
            : Math.min(Math.max(0, ext.practicePath.cursor), maxIx),
      },
    }))
  }, [
    canonicalIds,
    extended.practicePath.orderedStepIds,
    updateExtended,
  ])

  const orderedSteps = useMemo(
    () =>
      resolvedOrder
        .map((id) => stepById.get(id))
        .filter((x): x is NonNullable<typeof x> => x != null),
    [resolvedOrder, stepById],
  )

  const pathLen = orderedSteps.length
  const pp = extended.practicePath
  const maxIx = Math.max(0, pathLen - 1)
  const rawCursor = pp.cursor
  const safeCursor =
    pathLen === 0 ? 0 : Math.min(Math.max(0, rawCursor), maxIx)
  const step = orderedSteps[safeCursor] ?? null

  const reshufflePracticePath = useCallback(() => {
    const order = buildRandomMixedPracticePathOrder(PRACTICE_PATH_STEPS)
    updateExtended((ext) => ({
      ...ext,
      practicePath: {
        ...ext.practicePath,
        orderedStepIds: order,
        cursor: 0,
      },
    }))
    setPathQuizEpoch((n) => n + 1)
  }, [updateExtended])

  const pathCorrectIdx = step
    ? resolveLessonQuizCorrectIndex(
        step.quiz.choices,
        step.quiz.correctAnswer,
        step.moduleLabel,
      )
    : -1

  const activeDrill = SKILLS_STUDIO_DRILLS[drillIx] ?? SKILLS_STUDIO_DRILLS[0]
  const drillCorrectIx = activeDrill
    ? resolveLessonQuizCorrectIndex(
        activeDrill.quiz.choices,
        activeDrill.quiz.correctAnswer,
        activeDrill.title,
      )
    : -1

  const pathPrefs = extended.pathPreferences ?? defaultPathPreferences()

  const handlePathCorrect = useCallback(() => {
    if (pathLen === 0) return
    updateExtended((ext) => {
      const prefs = ext.pathPreferences ?? defaultPathPreferences()
      const cur = Math.min(Math.max(0, ext.practicePath.cursor), pathLen - 1)
      const nextAbs = cur + 1
      const streakReached = nextAbs
      let clears = ext.practicePath.fullPathClears
      let newCursor = nextAbs
      if (nextAbs >= pathLen) {
        clears += 1
        newCursor = 0
      }
      const fullRoundJustDone = cur === pathLen - 1 && nextAbs >= pathLen
      const timedBonus =
        prefs.timedModeEnabled && fullRoundJustDone
          ? { timedFullPathClears: (ext.practicePath.timedFullPathClears ?? 0) + 1 }
          : {}
      return extendedWithEngagementTouch({
        ...ext,
        practicePath: {
          ...ext.practicePath,
          cursor: newCursor,
          fullPathClears: clears,
          bestUnbrokenEver: Math.max(
            ext.practicePath.bestUnbrokenEver,
            streakReached,
          ),
          ...timedBonus,
        },
      })
    })
    setPathQuizEpoch((n) => n + 1)
  }, [pathLen, updateExtended])

  const handlePathWrongMark = useCallback(() => {
    updateExtended((ext) => ({
      ...ext,
      practicePath: {
        ...ext.practicePath,
        lifetimeWrongResets: ext.practicePath.lifetimeWrongResets + 1,
      },
    }))
  }, [updateExtended])

  /** Yanlış cevaptan sonra kullanıcı butona bastığında: ilk soruya dön. */
  const handleRestartPathFromBeginning = useCallback(() => {
    updateExtended((ext) => ({
      ...ext,
      practicePath: {
        ...ext.practicePath,
        cursor: 0,
      },
    }))
    setPathQuizEpoch((n) => n + 1)
  }, [updateExtended])

  const tabCls = (active: boolean) =>
    [
      'rounded-xl px-4 py-3 text-sm font-bold transition border-2',
      active
        ? 'border-green-600 bg-green-50 text-green-950 shadow-inner dark:border-[#89d185] dark:bg-[#1e2d24] dark:text-[#d8f6e6]'
        : 'border-neutral-200 bg-white text-neutral-700 hover:border-green-600/40 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#d4d4d4]',
    ].join(' ')

  return (
    <article className="border-b border-neutral-200 bg-gradient-to-b from-green-950/10 via-white to-neutral-50 text-neutral-900 dark:border-[#333] dark:from-green-950/15 dark:via-[#1e1e1e] dark:to-[#181818] dark:text-[#ececec]">
      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
        <header className="mb-8 border-b border-neutral-200 pb-8 dark:border-slate-700">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700 dark:text-green-400/90">
            Özet · alıştırma · kalıcı ilerleme
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
            Çalışma stüdyosu
          </h1>
          <div className="prose prose-sm prose-slate dark:prose-invert mt-4 max-w-3xl text-neutral-700 dark:text-slate-300">
            <ReactMarkdown remarkPlugins={markdownRemarkPlugins} components={md}>
              {`Burada **quiz ve kısa pekiştirmeler**, **hatırlatıcı kod kartları**
ve **peş peşe alıştırma yolu** bulunur. Hesabınızla oturum açıldığında yol üzerindeki sayaçlar **isteğe bağlı bulut ile senkronize** kalabilir.`}
            </ReactMarkdown>
          </div>
        </header>

        <div
          className="mb-10 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
          role="tablist"
          aria-label="Çalışma stüdyosu sekmeleri"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'drills'}
            className={tabCls(tab === 'drills')}
            onClick={() => setSkillsStudioTab('drills')}
          >
            Koçlu alıştırmalar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'reference'}
            className={tabCls(tab === 'reference')}
            onClick={() => setSkillsStudioTab('reference')}
          >
            Hızlı hatırlatıcılar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'path'}
            className={tabCls(tab === 'path')}
            onClick={() => setSkillsStudioTab('path')}
          >
            Peş peşe yol
          </button>
        </div>

        {tab === 'reference' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {QUICK_REFERENCE_CARDS.map((item) => (
              <section
                key={item.title}
                className="flex flex-col overflow-hidden rounded-xl border border-neutral-200/90 bg-white shadow-md ring-1 ring-black/5 dark:border-slate-700/80 dark:bg-slate-900/60 dark:ring-white/5"
              >
                <div className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-100/90 px-4 py-3 dark:border-slate-700/90 dark:bg-slate-800/80">
                  <h2 className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                    {item.title}
                  </h2>
                  <span className="rounded-full bg-emerald-600/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    {item.tag}
                  </span>
                </div>
                <p className="grow px-4 py-3 text-sm leading-relaxed text-neutral-700 dark:text-slate-300">
                  {item.summary}
                </p>
                <div className="border-t border-neutral-200 dark:border-slate-800">
                  <SyntaxHighlighter
                    language={item.lang}
                    style={dracula}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '0.75rem',
                      lineHeight: 1.5,
                      padding: '0.75rem 1rem 1rem',
                    }}
                    showLineNumbers={item.code.split('\n').length > 2}
                  >
                    {item.code.trim()}
                  </SyntaxHighlighter>
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {tab === 'drills' ? (
          <section aria-labelledby="drills-heading" className="space-y-6">
            <h2 id="drills-heading" className="sr-only">
              Koçlu alıştırmalar
            </h2>
            <div className="flex flex-wrap gap-2">
              {SKILLS_STUDIO_DRILLS.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                    drillIx === i
                      ? 'border-green-600 bg-green-100 text-green-900 dark:border-[#89d185] dark:bg-[#253329]'
                      : 'border-neutral-200 bg-white text-neutral-600 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#bdbdbd]'
                  }`}
                  onClick={() => setDrillIx(i)}
                >
                  {i + 1}. {d.title}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-[#474747] dark:bg-[#252526]">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-green-700 dark:text-[#89d185]">
                {activeDrill?.subtitle}
              </p>
              <p className="mb-6 text-xl font-semibold text-neutral-900 dark:text-[#ececec]">
                {activeDrill?.title}
              </p>
              {activeDrill && drillCorrectIx >= 0 ? (
                <Quiz
                  key={activeDrill.id}
                  question={activeDrill.quiz.question}
                  options={activeDrill.quiz.choices}
                  correctAnswerIndex={drillCorrectIx}
                />
              ) : (
                <p className="text-sm text-red-600 dark:text-red-300">
                  Alıştırma şıkkı yapılandırması hatası — veri güncellenmelidir.
                </p>
              )}
            </div>
          </section>
        ) : null}

        {tab === 'path' ? (
          <section aria-labelledby="path-heading" className="space-y-8">
            <h2 id="path-heading" className="sr-only">
              Peş peşe alıştırma yolu
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-[#474747] dark:bg-[#252526]">
                <p className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
                  Günlük seri
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums text-fuchsia-700 dark:text-fuchsia-300">
                  {extended.engagement?.dailyStreakCount ?? 0}
                </p>
                <p className="mt-2 text-[10px] font-medium uppercase text-neutral-500 dark:text-neutral-400">
                  Son katkı günü:{' '}
                  {extended.engagement?.lastStreakContributionDateLocal ?? '—'}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-[#474747] dark:bg-[#252526]">
                <p className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
                  En uzun kusursuz seri (soru sayısı)
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums text-green-700 dark:text-[#89d185]">
                  {pp.bestUnbrokenEver}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-[#474747] dark:bg-[#252526]">
                <p className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
                  Yol sıfırlandı
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums text-amber-700 dark:text-amber-300">
                  {pp.lifetimeWrongResets}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-[#474747] dark:bg-[#252526]">
                <p className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
                  Zamanlı tam tur (kusursuz)
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums text-purple-700 dark:text-purple-300">
                  {pp.timedFullPathClears ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-[#474747] dark:bg-[#252526]">
                <p className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
                  Kusursuz tam turlar (tüm zamanlar)
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums text-blue-700 dark:text-blue-300">
                  {pp.fullPathClears}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 px-4 py-5 dark:border-blue-900/55 dark:bg-blue-950/25">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-900 dark:text-blue-300/95">
                Zamanlı tur
              </p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-blue-950 dark:text-blue-50">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-blue-700 text-blue-600"
                    checked={pathPrefs.timedModeEnabled}
                    onChange={(e) => {
                      const on = e.target.checked
                      updateExtended((ext) => ({
                        ...ext,
                        pathPreferences: {
                          ...(ext.pathPreferences ?? defaultPathPreferences()),
                          timedModeEnabled: on,
                        },
                      }))
                      setPathQuizEpoch((n) => n + 1)
                    }}
                  />
                  Süre ile cevaplama (açıksa süre dolunca yanlış sayılır)
                </label>
                <label className="flex items-center gap-2 text-sm text-blue-950 dark:text-blue-50">
                  <span className="text-xs font-bold uppercase opacity-75">Saniye/soru</span>
                  <select
                    disabled={!pathPrefs.timedModeEnabled}
                    className="rounded-lg border border-blue-700/35 bg-white px-2 py-1 text-sm disabled:opacity-40 dark:bg-[#1e293b]"
                    value={pathPrefs.secondsPerQuestion}
                    onChange={(e) => {
                      updateExtended((ext) => ({
                        ...ext,
                        pathPreferences: {
                          ...(ext.pathPreferences ?? defaultPathPreferences()),
                          secondsPerQuestion: Number.parseInt(e.target.value, 10),
                        },
                      }))
                      setPathQuizEpoch((n) => n + 1)
                    }}
                  >
                    {[20, 30, 40, 45, 55, 60, 75, 90].map((x) => (
                      <option key={x} value={x}>{x}s</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-blue-920/95 dark:text-blue-100/85">
                Zamanlı mod sadece bu sekmedeki peş peşe yolu etkiler. Seri günlük: peş peşe yolu veya tamamlanan
                dersler ilk kez olduğunda (yerel tarih) artırılır — aynı gün sürekli yanıt saymaz ama doğru aktivite
                yeterlidir.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-xs text-neutral-600 dark:text-[#bdbdbd] sm:max-w-md">
                Sıra, kolay / orta / zor kümelerinden harmanlanır; listedeki konum soru dizisinin
                o anki akış sırasını gösterir (sabit müfredat sırasının aynası değildir).
              </p>
              <button
                type="button"
                className="shrink-0 rounded-xl border-2 border-amber-600/60 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-amber-950 transition hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-900/50"
                onClick={reshufflePracticePath}
              >
                Turu yeniden karıştır
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-dashed border-green-700/35 bg-green-50/40 px-4 py-5 dark:border-[#89d185]/35 dark:bg-[#1b2620]/60">
              <ol className="flex min-w-max items-start gap-2 pb-1">
                {orderedSteps.map((node, ix) => {
                  const reached = ix < safeCursor
                  const active = ix === safeCursor
                  return (
                    <li key={node.id} className="flex shrink-0 items-center gap-2">
                      <span
                        className={[
                          'flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-black',
                          active
                            ? 'border-green-700 bg-green-600 text-white dark:border-[#89d185] dark:bg-[#2d4736]'
                            : reached
                              ? 'border-green-300 bg-green-100 text-green-900 dark:border-[#3f5f4a] dark:bg-[#1e2d22] dark:text-[#c9f7d9]'
                              : 'border-neutral-200 bg-white text-neutral-400 dark:border-[#474747] dark:bg-[#2d2d2d]',
                        ].join(' ')}
                      >
                        {ix + 1}
                      </span>
                      {ix < orderedSteps.length - 1 ? (
                        <span
                          className="inline-block h-0.5 w-5 shrink-0 rounded-full bg-neutral-200 dark:bg-[#474747]"
                          aria-hidden
                        />
                      ) : null}
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-[#474747] dark:bg-[#252526]">
              {step && pathCorrectIdx >= 0 ? (
                <>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400">
                    {step.moduleLabel} · Soru {safeCursor + 1} / {pathLen}
                  </p>
                  <Quiz
                    key={`${safeCursor}-${pathQuizEpoch}-${pathPrefs.timedModeEnabled}-${pathPrefs.secondsPerQuestion}`}
                    question={step.quiz.question}
                    options={step.quiz.choices}
                    correctAnswerIndex={pathCorrectIdx}
                    timedSecondsBudget={
                      pathPrefs.timedModeEnabled
                        ? pathPrefs.secondsPerQuestion
                        : undefined
                    }
                    strictPracticeCallbacks={{
                      onCorrect: handlePathCorrect,
                      onWrongSubmit: handlePathWrongMark,
                      onRestartPathFromBeginning: handleRestartPathFromBeginning,
                    }}
                  />
                </>
              ) : (
                <p className="text-sm text-neutral-600 dark:text-[#bdbdbd]">
                  Alıştırma yolu yüklenemedi — veriyi kontrol edin.
                </p>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  )
}
