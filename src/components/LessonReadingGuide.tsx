import { useMemo } from 'react'
import type { Lesson } from '../types'
import {
  estimateLessonReadMinutes,
  type LessonH2Anchor,
  precomputeLessonH2Anchors,
} from '../utils/lessonReadingMeta'

export interface LessonReadingGuideProps {
  lesson: Lesson
}

/**
 * Ders üstünde: tahmini okuma süresi + H2 içindekiler (sayfa içi bağlantılar).
 */
export default function LessonReadingGuide({ lesson }: LessonReadingGuideProps) {
  const anchors = useMemo(
    (): readonly LessonH2Anchor[] => precomputeLessonH2Anchors(lesson.content),
    [lesson.content],
  )

  const minutes = useMemo(
    () =>
      estimateLessonReadMinutes(
        lesson.content,
        lesson.codeExamples.map((e) => e.code),
      ),
    [lesson.codeExamples, lesson.content],
  )

  return (
    <aside
      className="mb-8 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm shadow-sm dark:border-neutral-600 dark:bg-zinc-900/55"
      aria-labelledby="lesson-reading-guide-heading"
    >
      <h2
        id="lesson-reading-guide-heading"
        className="sr-only"
      >
        Özet bilgi ve içindekiler
      </h2>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-neutral-200 pb-3 dark:border-neutral-600">
        <p className="font-medium text-neutral-800 dark:text-neutral-100">
          Tahmini süre · yaklaşık <span className="tabular-nums">{minutes}</span> dk
          <span className="sr-only">
            Bu süre gövde metni ve kod örneği satırlarına göre yaklaşık hesaplanır.
          </span>
        </p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Konu özeti için hızlı rehber; satır içi bağlantılar aşağıdan ilgili bölüme kayar.
        </p>
      </div>

      {anchors.length > 0 ? (
        <nav className="pt-3" aria-label="İçindekiler">
          <p className="mb-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Bu konuda
          </p>
          <ul className="m-0 list-none space-y-1 p-0">
            {anchors.map((a, i) => (
              <li key={`${a.id}-${i}`}>
                <a
                  href={`#${a.id}`}
                  className="text-neutral-800 underline-offset-2 transition hover:text-emerald-700 hover:underline dark:text-neutral-100 dark:hover:text-emerald-400/95"
                >
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </aside>
  )
}
