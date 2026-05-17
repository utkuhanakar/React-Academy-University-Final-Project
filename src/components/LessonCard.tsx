import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Lesson, LessonModuleId } from '../types'
import {
  createMarkdownComponents,
  markdownRemarkPlugins,
} from './MarkdownCodeBlocks'
import ClozeChallenge from './lessonActivities/ClozeChallenge'
import DragCodeChallenge from './lessonActivities/DragCodeChallenge'
import DragOrderChallenge from './lessonActivities/DragOrderChallenge'
import Quiz from './Quiz'
import {
  resolveLessonQuizCorrectIndex,
} from '../utils/lessonQuizHelpers'

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
  const markdownComponents = useMemo(() => createMarkdownComponents(), [])
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
            <span className="inline-block rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-violet-800 dark:border-violet-500/40 dark:bg-violet-950/60 dark:text-violet-200">
              {moduleAdi}
            </span>
            <span className="inline-block rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#c8c8c8]">
              {lesson.difficulty}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-[#f3f3f3] sm:text-3xl">
            {lesson.title}
          </h1>
        </header>

        <section className="mb-12" aria-labelledby="lesson-content-heading">
          <h2
            id="lesson-content-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-[#cccccc]"
          >
            Konu anlatımı
          </h2>
          <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert prose-headings:scroll-mt-20 max-w-full overflow-x-auto dark:prose-blockquote:border-l-emerald-500 dark:prose-blockquote:bg-emerald-950/30 prose-a:text-green-700 prose-a:no-underline prose-blockquote:border-l-green-600 prose-blockquote:bg-green-50/60 prose-blockquote:py-0.5 prose-blockquote:pl-4 prose-blockquote:text-neutral-800 hover:prose-a:underline dark:prose-a:text-green-400 dark:prose-blockquote:text-neutral-200">
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
            className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-[#cccccc]"
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
                <div className="max-w-full overflow-hidden rounded-lg border border-[#44475a] shadow-md ring-1 ring-black/5 dark:ring-white/10">
                  <SyntaxHighlighter
                    language="tsx"
                    style={dracula}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: 12,
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
          className="mb-12 rounded-md border border-sky-200 bg-sky-50 p-6 dark:border-sky-900/60 dark:bg-sky-950/35"
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
                return (
                  <div key={`${lesson.id}-check-${i}`}>
                    {quickChecks.length > 1 ? (
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300/90">
                        Soru {i + 1} / {quickChecks.length}
                      </p>
                    ) : null}
                    <Quiz
                      key={`${lesson.id}-check-${i}`}
                      question={q.question}
                      options={q.choices}
                      correctAnswerIndex={ix}
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
