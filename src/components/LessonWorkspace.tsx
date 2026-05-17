import { useCallback, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import CodePlayground from './CodePlayground'
import LessonStudyAux from './LessonStudyAux'
import LessonCard from './LessonCard'
import { createMarkdownComponents, markdownRemarkPlugins } from './MarkdownCodeBlocks'
import type { Lesson } from '../types'
import { buildPlaygroundInitialCode } from '../utils/buildPlaygroundInitialCode'
import { lessonAllQuickChecksResolvable } from '../utils/lessonQuizHelpers'

export interface LessonWorkspaceProps {
  lesson: Lesson
  isLessonAlreadyCompleted: boolean
  /** Var ise sıradaki ders; yoksa kullanıcı son dersteymiş. */
  nextLessonId: string | null
  onLessonFinished: (lessonId: string) => void
  onGoToNextLesson: () => void
}

/**
 * `key={lesson.id}` ile App içinde kullanıldığında ders değişiminde
 * quiz / kod onayı state’i doğal olarak sıfırlanır (effect gerekmez).
 */
export default function LessonWorkspace({
  lesson,
  isLessonAlreadyCompleted,
  nextLessonId,
  onLessonFinished,
  onGoToNextLesson,
}: LessonWorkspaceProps) {
  const isLaboratory = lesson.lessonLayout === 'laboratory'
  const lessonQuizResolvable = lessonAllQuickChecksResolvable(lesson)
  const markdownComponents = useMemo(() => createMarkdownComponents(), [])

  const [isQuizPassed, setIsQuizPassed] = useState(false)
  const [interactiveGatesOk, setInteractiveGatesOk] = useState(
    () =>
      !lesson.dragOrderActivity &&
      !lesson.dragCodeActivity &&
      !lesson.clozeActivity,
  )
  const [isLiveCodeTaskConfirmed, setIsLiveCodeTaskConfirmed] = useState(false)
  const [sessionCelebration, setSessionCelebration] = useState(false)

  const playgroundInitialCode = useMemo(
    () => buildPlaygroundInitialCode(lesson.challenge.initialCode),
    [lesson.challenge.initialCode],
  )

  const handleQuizPassedChange = useCallback((passed: boolean) => {
    setIsQuizPassed(passed)
  }, [])

  const hasInteractiveExtras =
    Boolean(lesson.dragOrderActivity) ||
    Boolean(lesson.dragCodeActivity) ||
    Boolean(lesson.clozeActivity)

  const quizSatisfied =
    isLaboratory ? true : !lessonQuizResolvable ? true : isQuizPassed

  const interactiveSatisfied =
    isLaboratory ? true : !hasInteractiveExtras || interactiveGatesOk

  const canFinishLesson =
    quizSatisfied &&
    interactiveSatisfied &&
    isLiveCodeTaskConfirmed &&
    !isLessonAlreadyCompleted

  const handleFinishClick = useCallback(() => {
    if (!canFinishLesson) return
    onLessonFinished(lesson.id)
    setSessionCelebration(true)
  }, [canFinishLesson, lesson.id, onLessonFinished])

  return (
    <>
      <LessonStudyAux lessonId={lesson.id} />
      {isLaboratory ? (
        <article className="flex-1 border-b border-neutral-200 bg-gradient-to-b from-violet-950/5 to-white dark:border-[#3c3c3c] dark:from-violet-950/20 dark:to-[#1e1e1e]">
          <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-12">
            <header className="mb-8">
              <span className="mb-3 inline-block rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-violet-800 dark:border-violet-500/40 dark:bg-violet-950/50 dark:text-violet-200">
                Laboratuvar görevi
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-[#f3f3f3] sm:text-3xl">
                {lesson.title}
              </h1>
            </header>
            <div className="prose prose-slate dark:prose-invert prose-headings:scroll-mt-20 max-w-none dark:prose-blockquote:bg-violet-950/35 prose-a:text-green-700 prose-blockquote:border-l-violet-600 prose-blockquote:bg-violet-50/50 hover:prose-a:underline dark:prose-a:text-green-400 dark:prose-blockquote:border-violet-500">
              <ReactMarkdown
                remarkPlugins={markdownRemarkPlugins}
                components={markdownComponents}
              >
                {lesson.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      ) : (
        <LessonCard
          lesson={lesson}
          onQuizPassedChange={handleQuizPassedChange}
          onInteractiveGatesChange={setInteractiveGatesOk}
        />
      )}

      <section
        className="border-t border-neutral-200 bg-neutral-50 px-4 py-10 dark:border-[#3c3c3c] dark:bg-[#181818] sm:px-8 lg:px-10"
        aria-labelledby="live-code-heading"
      >
        <h2
          id="live-code-heading"
          className="mb-6 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-[#cccccc]"
        >
          {isLaboratory ? 'Canlı kod laboratuvarı' : 'Canlı kod alanı'}
        </h2>
        <CodePlayground
          initialCode={playgroundInitialCode}
          noInline
          size={isLaboratory ? 'expanded' : 'default'}
        />
      </section>

      <section
        className="border-t border-neutral-200 px-4 py-6 dark:border-[#3c3c3c] sm:px-8 lg:px-10"
        aria-labelledby="code-confirm-heading"
      >
        <h2 id="code-confirm-heading" className="sr-only">
          Canlı kod görevi onayı
        </h2>
        <label className="flex max-w-xl cursor-pointer items-start gap-3 rounded-md border border-neutral-200 bg-white p-4 text-sm text-neutral-800 shadow-sm dark:border-[#474747] dark:bg-[#252526] dark:text-[#d4d4d4]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 dark:border-[#5a5a5a] dark:bg-[#2d2d2d]"
            checked={isLiveCodeTaskConfirmed}
            disabled={isLessonAlreadyCompleted}
            onChange={(event) =>
              setIsLiveCodeTaskConfirmed(event.target.checked)
            }
          />
          <span>
            <span className="font-medium text-neutral-900 dark:text-[#ececec]">
              Canlı kod görevini tamamladım.
            </span>{' '}
            {isLaboratory
              ? 'Editörde Todo laboratuvarını geliştirdim; çalıştığını doğruladım.'
              : 'Yukarıdaki editörde denedim; önizleme beklenen davranışı gösteriyor veya görev talimatını karşılıyorum.'}
          </span>
        </label>
      </section>

      <section className="border-t border-neutral-200 px-4 py-10 dark:border-[#3c3c3c] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-[#a3a3a3]">
            Bu dersten çıkmadan önce
          </p>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-[#d4d4d4]">
            {!isLaboratory ? (
              <li className="flex items-center gap-2">
                <span
                  className={
                    interactiveSatisfied && hasInteractiveExtras
                      ? 'text-green-600 dark:text-[#89d185]'
                      : hasInteractiveExtras
                      ? 'text-neutral-400 dark:text-[#858585]'
                      : 'text-neutral-400 dark:text-[#858585]'
                  }
                  aria-hidden
                >
                  {hasInteractiveExtras ? (interactiveGatesOk ? '✓' : '○') : '—'}
                </span>
                {hasInteractiveExtras
                  ? 'Sürükle-bırak / boşluk etkinliklerini doğrulamak'
                  : 'Ek etkinlik yok'}
              </li>
            ) : null}
            {!isLaboratory ? (
              <li className="flex items-center gap-2">
                <span
                  className={
                    lessonQuizResolvable
                      ? isQuizPassed
                        ? 'text-green-600 dark:text-[#89d185]'
                        : 'text-neutral-400 dark:text-[#858585]'
                      : 'text-amber-600 dark:text-[#dcb922]'
                  }
                  aria-hidden
                >
                  {lessonQuizResolvable ? (isQuizPassed ? '✓' : '○') : '—'}
                </span>
                {lessonQuizResolvable
                  ? 'Tüm hızlı kontrolleri doğru cevaplamak'
                  : 'Quiz verisi doğrulanamadığı için bu kontroller şimdilik atlandı'}
              </li>
            ) : (
              <li className="flex items-center gap-2 text-neutral-500 dark:text-[#999]">
                <span className="text-green-600" aria-hidden>
                  —
                </span>
                Bu laboratuvar bağlamında klasik quiz adımı yok; görev tamamen editörde.
              </li>
            )}
            <li className="flex items-center gap-2">
              <span
                className={
                  isLiveCodeTaskConfirmed
                    ? 'text-green-600 dark:text-[#89d185]'
                    : 'text-neutral-400 dark:text-[#858585]'
                }
                aria-hidden
              >
                {isLiveCodeTaskConfirmed ? '✓' : '○'}
              </span>
              Canlı kod kutusu işaretli
            </li>
          </ul>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-neutral-600 dark:text-[#bdbdbd]">
              İlerleme bu tarayıcıda saklanır.{' '}
              {!isLaboratory
                ? 'Quiz ve canlı kod onayı tamamladığında aşağıdan derse kapanış verebilirsin.'
                : 'Canlı kod onayını işaretleyip görevi kapatabilirsin.'}
            </p>
            <button
              type="button"
              onClick={handleFinishClick}
              disabled={!canFinishLesson}
              className="inline-flex w-full items-center justify-center rounded-2xl border-b-[5px] border-[#449b04] bg-[#58cc02] px-8 py-5 text-xl font-extrabold tracking-tight text-white shadow-lg transition enabled:hover:translate-y-0.5 enabled:hover:border-b-[4px] enabled:hover:brightness-105 enabled:active:translate-y-1 enabled:active:border-b-0 disabled:cursor-not-allowed disabled:border-b-0 disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-[#474747] dark:disabled:text-[#858585] sm:w-auto sm:min-w-[280px]"
            >
              {isLessonAlreadyCompleted
                ? isLaboratory
                  ? 'Laboratuvar kaydı tamam'
                  : 'Bu ders tamamlandı'
                : isLaboratory
                  ? 'Görevi tamamla'
                  : 'Dersi bitir'}
            </button>

            {sessionCelebration && isLessonAlreadyCompleted ? (
              <div
                className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-950 shadow-sm dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-50"
                role="status"
              >
                <p className="text-base font-semibold leading-relaxed text-green-900 dark:text-green-100">
                  {isLaboratory
                    ? 'Laboratuvar görevin kaydedildi — eline sağlık.'
                    : 'Bu dersi başarıyla tamamladın.'}
                </p>
                {nextLessonId ? (
                  <button
                    type="button"
                    onClick={onGoToNextLesson}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-b-4 border-[#1d4ed8] bg-[#2563eb] px-6 py-3 text-base font-bold text-white shadow-md transition hover:translate-y-0.5 hover:border-b-[3px] hover:brightness-105 active:translate-y-1 active:border-b-0 sm:w-auto"
                  >
                    Sıradaki Derse Geç
                    <span aria-hidden>→</span>
                  </button>
                ) : (
                  <p className="mt-4 text-lg font-bold tracking-tight text-green-800 dark:text-[#89d185]">
                    Tebrikler, Eğitimi Tamamladın!
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {!isLessonAlreadyCompleted && !canFinishLesson ? (
            <p className="text-sm text-neutral-500 dark:text-[#a3a3a3]">
              {isLaboratory ? (
                !isLiveCodeTaskConfirmed ? (
                  'Aşağıdan canlı kod onayını işaretle.'
                ) : (
                  ''
                )
              ) : !lessonQuizResolvable && !isLiveCodeTaskConfirmed ? (
                'Bu derste quiz atlandı — canlı kod onayını işaretle.'
              ) : hasInteractiveExtras && !interactiveGatesOk ? (
                'Sürükle-bırak ve boşluk etkinliklerinde doğrula adımını tamamla.'
              ) : lessonQuizResolvable && !isQuizPassed ? (
                'Tüm hızlı kontrollerde doğru şıkkı seçip “Cevabı gönder” ile geç.'
              ) : !isLiveCodeTaskConfirmed ? (
                'Canlı kod kutusunu onayla.'
              ) : (
                ''
              )}
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
