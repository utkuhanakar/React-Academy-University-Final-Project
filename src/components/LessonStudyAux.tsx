import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { lessonExtraTasks, lessonRecapMarkdown } from '../data/lessonStudyAids'
import { createMarkdownComponents, markdownRemarkPlugins } from './MarkdownCodeBlocks'

export interface LessonStudyAuxProps {
  lessonId: string
}

/** Ders üstünde özet ve ek görevler — kartı yeniden uzun okutmaz */
export default function LessonStudyAux({ lessonId }: LessonStudyAuxProps) {
  const [recapOpen, setRecapOpen] = useState(true)
  const [extrasOpen, setExtrasOpen] = useState(false)
  const markdownComponents = useMemo(() => createMarkdownComponents(), [])
  const recapMd = lessonRecapMarkdown(lessonId)
  const extras = lessonExtraTasks(lessonId)

  return (
    <div className="border-b border-emerald-200/80 bg-emerald-50/40 px-5 py-4 dark:border-emerald-900/40 dark:bg-emerald-950/15 lg:px-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <details
          open={recapOpen}
          onToggle={(e) =>
            setRecapOpen((e.target as HTMLDetailsElement).open)
          }
          className="rounded-xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900/55 dark:bg-[#1e2824]"
        >
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-bold text-emerald-900 dark:text-emerald-200">
            Hızlı özet (tekrar okumayı kısalt)
          </summary>
          <div className="border-t border-emerald-100 px-4 py-4 dark:border-emerald-900/35">
            <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={markdownRemarkPlugins}
                components={markdownComponents}
              >
                {recapMd}
              </ReactMarkdown>
            </div>
          </div>
        </details>

        {extras.length > 0 ? (
          <details
            open={extrasOpen}
            onToggle={(e) =>
              setExtrasOpen((e.target as HTMLDetailsElement).open)
            }
            className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-[#474747] dark:bg-[#252526]"
          >
            <summary className="cursor-pointer select-none px-4 py-3 text-sm font-bold text-neutral-800 dark:text-[#ececec]">
              Ekstra görevler (isteğe bağlı derinlik)
            </summary>
            <ul className="list-disc border-t border-neutral-100 px-8 py-4 text-sm leading-relaxed text-neutral-700 dark:border-[#3c3c3c] dark:text-[#cfcfcf]">
              {extras.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    </div>
  )
}
