import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Lesson, LessonModuleId } from '../types'
import {
  createMarkdownComponents,
  markdownRemarkPlugins,
} from './MarkdownCodeBlocks'
import LessonReadingGuide from './LessonReadingGuide'
import ClozeChallenge from './lessonActivities/ClozeChallenge'
import DragCodeChallenge from './lessonActivities/DragCodeChallenge'
import DragOrderChallenge from './lessonActivities/DragOrderChallenge'
import Quiz from './Quiz'
import {
  getShuffledQuizView,
  resolveLessonQuizCorrectIndex,
} from '../utils/lessonQuizHelpers'
import { precomputeLessonH2Anchors } from '../utils/lessonReadingMeta'

export interface LessonCardProps {
  /** Gösterilecek ders kaydı. */
  lesson: Lesson
  /** Quiz doğru cevap verildiğinde / sıfırlandığında üst bileşene bildirir. */
  onQuizPassedChange?: (passed: boolean) => void
  /** Ek etkinlikler (sıra kod boşluk) tamamlanması */
  onInteractiveGatesChange?: (passed: boolean) => void
}

const moduleBasliklari: Record<LessonModuleId, string> = {
  intro: 'Giriş — ES6 & JSX',
  components: 'Bileşenler & Props',
  'state-lists': 'State, Listeler & Formlar',
  hooks: 'React Hooks',
  expert: 'Uzman Seviyesi',
}

export default function LessonCard({
  lesson,
  onQuizPassedChange,
  onInteractiveGatesChange,
}: LessonCardProps) {
  const h2AnchorPlan = useMemo(
    () => precomputeLessonH2Anchors(lesson.content),
    [lesson.content],
  )

  const markdownComponents = useMemo(
    () => createMarkdownComponents({ h2AnchorPlan }),
    [h2AnchorPlan],
  )
  const moduleAdi = moduleBasliklari[lesson.moduleId]

  const quickChecks = useMemo(
    () => [lesson.quiz, ...(lesson.extraQuizChecks ?? [])],
    [lesson],
  )

  const checkIndices = useMemo(
    () =>
      quickChecks.map((q, i) =>
        resolveLessonQuizCorrectIndex(
          q.choices,
          q.correctAnswer,
          `${lesson.title} (kontrol ${i + 1})`,
        ),
      ),
    [lesson.title, quickChecks],
  )

  /** Doğru cevap daima ilk veri sırasından metin ile eşleşir; ekranda şıklar ise ders+slot’a göre karışır. */
  const shuffledQuizViews = useMemo(
    () =>
      quickChecks.map((q, i) =>
        getShuffledQuizView(`${lesson.id}:check:${i}`, q.choices, q.correctAnswer),
      ),
    [lesson.id, quickChecks],
  )

  const allChecksValid = checkIndices.every((ix) => ix >= 0)

  const [checksPassed, setChecksPassed] = useState<boolean[]>(() =>
    quickChecks.map(() => false),
  )

  const [dragOrderOk, setDragOrderOk] = useState(() => !lesson.dragOrderActivity)
  const [dragCodeOk, setDragCodeOk] = useState(() => !lesson.dragCodeActivity)
  const [clozeOk, setClozeOk] = useState(() => !lesson.clozeActivity)

  useEffect(() => {
    const okExtras =
      (!lesson.dragOrderActivity || dragOrderOk) &&
      (!lesson.dragCodeActivity || dragCodeOk) &&
      (!lesson.clozeActivity || clozeOk)
    onInteractiveGatesChange?.(okExtras)
  }, [
    clozeOk,
    dragCodeOk,
    dragOrderOk,
    lesson.clozeActivity,
    lesson.dragCodeActivity,
    lesson.dragOrderActivity,
    onInteractiveGatesChange,
  ])

  useEffect(() => {
    onQuizPassedChange?.(
      checksPassed.length === quickChecks.length &&
        checksPassed.every(Boolean),
    )
  }, [checksPassed, onQuizPassedChange, quickChecks.length])

  return (
    <article className="flex-1 bg-white dark:bg-[#1e1e1e]">
      <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8 lg:py-12">
        <header className="mb-10 border-b border-neutral-200 pb-8 dark:border-[#3c3c3c]">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800/70 dark:text-neutral-200">
              {moduleAdi}
            </span>
            <span className="inline-block rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-600 dark:bg-zinc-800/70 dark:text-neutral-300">
              {lesson.difficulty}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-[#f3f3f3] sm:text-3xl">
            {lesson.title}
          </h1>
          <LessonReadingGuide lesson={lesson} />
        </header>

        <section className="mb-12" aria-labelledby="lesson-content-heading">
          <h2
            id="lesson-content-heading"
            className="mb-4 text-sm font-medium text-neutral-600 dark:text-neutral-400"
          >
            Konu anlatımı
          </h2>
          <div className="lesson-md prose prose-sm sm:prose-base prose-slate dark:prose-invert prose-headings:scroll-mt-20 max-w-full overflow-x-auto prose-a:text-emerald-700 prose-a:no-underline prose-blockquote:border-l-stone-400 prose-blockquote:bg-stone-50/90 prose-blockquote:py-2 prose-blockquote:pl-4 prose-blockquote:text-neutral-700 hover:prose-a:underline dark:prose-a:text-emerald-400/95 dark:prose-blockquote:border-stone-600 dark:prose-blockquote:bg-stone-900/35 dark:prose-blockquote:text-neutral-200">
            <ReactMarkdown
              remarkPlugins={markdownRemarkPlugins}
              components={markdownComponents}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>
        </section>

        <section
          className="mb-12 max-w-full overflow-x-auto"
          aria-labelledby="lesson-examples-heading"
        >
          <h2
            id="lesson-examples-heading"
            className="mb-4 text-sm font-medium text-neutral-600 dark:text-neutral-400"
          >
            Örnek kodlar
          </h2>
          <div className="flex flex-col gap-8">
            {lesson.codeExamples.map((ornek, index) => (
              <div key={ornek.title + index}>
                <h3 className="mb-2 text-base font-semibold text-neutral-900 dark:text-[#ececec]">
                  {ornek.title}
                </h3>
                {ornek.caption ? (
                  <p className="mb-3 text-sm leading-relaxed text-neutral-600 dark:text-[#b0b0b0]">
                    {ornek.caption}
                  </p>
                ) : null}
                <div className="max-w-full overflow-hidden rounded-md border border-[#44475a] shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                  <SyntaxHighlighter
                    language="tsx"
                    style={dracula}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: 8,
                      fontSize: 'clamp(0.7rem, 2.8vw, 0.8125rem)',
                      lineHeight: 1.55,
                      padding: '0.75rem 0.875rem',
                    }}
                    showLineNumbers={ornek.code.trim().split('\n').length > 3}
                  >
                    {ornek.code.trim()}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))}
          </div>
        </section>

        {lesson.dragOrderActivity ? (
          <section className="mb-12" aria-labelledby="lesson-drag-order">
            <p id="lesson-drag-order" className="sr-only">
              Kavram sıralama
            </p>
            <DragOrderChallenge
              {...lesson.dragOrderActivity}
              onSolvedChange={setDragOrderOk}
            />
          </section>
        ) : null}

        {lesson.dragCodeActivity ? (
          <section className="mb-12" aria-labelledby="lesson-drag-code">
            <p id="lesson-drag-code" className="sr-only">
              Kod parçası sıralama
            </p>
            <DragCodeChallenge
              {...lesson.dragCodeActivity}
              onSolvedChange={setDragCodeOk}
            />
          </section>
        ) : null}

        {lesson.clozeActivity ? (
          <section className="mb-12" aria-labelledby="lesson-cloze">
            <p id="lesson-cloze" className="sr-only">
              Boşluk doldurma
            </p>
            <ClozeChallenge key={lesson.id} {...lesson.clozeActivity} onSolvedChange={setClozeOk} />
          </section>
        ) : null}

        <section
          className="mb-12 rounded-lg border border-neutral-200/90 bg-neutral-50/95 p-6 dark:border-neutral-600 dark:bg-neutral-900/40"
          aria-labelledby="lesson-quiz-heading"
        >
          <h2
            id="lesson-quiz-heading"
            className="mb-4 text-base font-semibold text-neutral-900 dark:text-[#ececec]"
          >
            Hızlı kontrol{quickChecks.length > 1 ? ` (${quickChecks.length} soru)` : ''}
          </h2>
          {allChecksValid ? (
            <div className="space-y-8">
              {quickChecks.map((q, i) => {
                const ix = checkIndices[i] ?? -1
                const shuffle = shuffledQuizViews[i]
                const showIx =
                  shuffle && shuffle.displayCorrectIndex >= 0
                    ? shuffle.displayCorrectIndex
                    : ix
                const opts =
                  shuffle && shuffle.displayChoices.length === q.choices.length
                    ? shuffle.displayChoices
                    : [...q.choices]
                return (
                  <div key={`${lesson.id}-check-${i}`}>
                    {quickChecks.length > 1 ? (
                      <p className="mb-2 text-xs font-semibold tracking-tight text-neutral-600 dark:text-neutral-400">
                        Soru {i + 1} / {quickChecks.length}
                      </p>
                    ) : null}
                    <Quiz
                      key={`${lesson.id}-check-${i}`}
                      question={q.question}
                      options={opts}
                      correctAnswerIndex={showIx >= 0 ? showIx : ix}
                      onQuizPassedChange={(p) => {
                        setChecksPassed((prev) =>
                          prev.map((v, j) => (j === i ? p : v)),
                        )
                      }}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm font-medium leading-relaxed text-red-700 dark:text-red-300">
              Bu derste bazı sorular yapılandırma hatası içeriyor: doğru cevap metni şıklardan biriyle
              birebir eşleşmiyor. Lütfen veri düzeltmesi yapılana dek bu kontrolleri gözden geçirin —
              “Dersi bitir” sırasında hâlâ canlı kod onayı gerekecektir.
            </p>
          )}
        </section>

        <section
          className="rounded-md border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/55 dark:bg-amber-950/30"
          aria-labelledby="lesson-challenge-heading"
        >
          <h2
            id="lesson-challenge-heading"
            className="text-base font-semibold text-neutral-900 dark:text-[#ececec]"
          >
            Görev — beklenen çıktı
          </h2>
          <p className="mt-3 text-base leading-7 text-neutral-800 dark:text-[#d4d4d4]">
            {lesson.challenge.expectedOutputDescription}
          </p>
        </section>
      </div>
    </article>
  )
}
