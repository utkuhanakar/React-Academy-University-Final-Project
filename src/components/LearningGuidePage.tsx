import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Lesson, LessonModuleId } from '../types'
import {
  GLOSSARY,
  GUIDE_SECTION_ORDER,
  GUIDE_SECTION_TITLES,
  LEARNING_GUIDE_MARKDOWN,
} from '../data/learningGuideContent'
import {
  createMarkdownComponents,
  markdownRemarkPlugins,
} from './MarkdownCodeBlocks'

export interface LearningGuidePageProps {
  lessons: readonly Lesson[]
  completedLessonIds: readonly string[]
  onPickLesson: (lessonId: string) => void
  onOpenStudio: () => void
}

export default function LearningGuidePage({
  lessons,
  completedLessonIds,
  onPickLesson,
  onOpenStudio,
}: LearningGuidePageProps) {
  const md = useMemo(() => createMarkdownComponents(), [])
  const bySection = useMemo(() => {
    const m = new Map<LessonModuleId, Lesson[]>()
    for (const id of GUIDE_SECTION_ORDER) m.set(id, [])
    for (const l of lessons) {
      const arr = m.get(l.moduleId)
      if (arr) arr.push(l)
    }
    return m
  }, [lessons])
  const done = useMemo(() => new Set(completedLessonIds), [completedLessonIds])

  return (
    <article className="border-b border-neutral-200 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 text-neutral-900 print:border-0 print:bg-white print:text-neutral-950 print:shadow-none dark:border-[#333] dark:from-zinc-900/35 dark:via-[#1e1e1e] dark:to-[#181818] dark:text-[#ececec]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 lg:px-8 lg:py-14">
        <header className="mb-10 border-b border-neutral-200 pb-8 dark:border-slate-700">
          <p className="text-xs font-medium tracking-tight text-neutral-600 dark:text-neutral-400">
            Tüm içerik · teknik özet · ders haritası
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
            Öğrenme rehberi — React Akademi
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-700 dark:text-slate-300">
            Bu sayfadaki Markdown rehber; mimari öz, tüm klasör‑dosya envanteri, veri‑modeli ve komutların
            birleştirilmiş tek teknik dokümandır. Aşağıdaki tam ders diziniyle birlikte projeyi yalnızca buradan okuyarak
            uçtan uca öğrenebilirsiniz.
          </p>
          <button
            type="button"
            onClick={onOpenStudio}
            className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:border-neutral-600 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Tekrar için stüdyoyu aç
          </button>
        </header>

        <div className="lesson-md prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-p:text-[15px] prose-p:leading-relaxed prose-li:text-[15px] prose-a:text-emerald-800 hover:prose-a:underline dark:prose-a:text-emerald-400/95">
          <ReactMarkdown
            remarkPlugins={markdownRemarkPlugins}
            components={md}
          >
            {LEARNING_GUIDE_MARKDOWN}
          </ReactMarkdown>
        </div>

        <section className="mt-14" aria-labelledby="full-index-heading">
          <h2
            id="full-index-heading"
            className="text-xl font-bold text-neutral-900 dark:text-white"
          >
            Tam ders dizini — tüm başlıklara tıklayınca doğrudan açılır
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-neutral-600 dark:text-slate-400">
            Aşağıdaki listede bu repoda yüklü her başlık vardır. Tamamladığınız derslerde yeşil
            damga görünür; arama kutusu üst barda kalır.
          </p>
          <div className="mt-8 space-y-10">
            {GUIDE_SECTION_ORDER.map((mod) => (
              <div key={mod}>
                <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                  {GUIDE_SECTION_TITLES[mod]}
                  <span className="ml-2 font-mono text-xs font-normal opacity-75">
                    ({mod})
                  </span>
                </h3>
                <ul className="mt-4 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-[#3c3c3c] dark:border-[#474747] dark:bg-[#252526]">
                  {(bySection.get(mod) ?? []).map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => onPickLesson(l.id)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-sky-50/90 dark:hover:bg-sky-950/35"
                      >
                        <span
                          className={[
                            'mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                            done.has(l.id)
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/35 dark:text-emerald-100'
                              : 'bg-neutral-100 text-neutral-600 dark:bg-[#3c3c3c] dark:text-[#bdbdbd]',
                          ].join(' ')}
                          aria-hidden
                        >
                          {done.has(l.id) ? 'ok' : '•'}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-neutral-900 dark:text-[#f3f3f3]">
                            {l.title}
                          </span>
                          <span className="mt-0.5 block font-mono text-[11px] text-neutral-500 dark:text-[#858585]">
                            {l.id} · {l.difficulty}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="glossary-heading">
          <h2
            id="glossary-heading"
            className="text-xl font-bold text-neutral-900 dark:text-white"
          >
            Kısa sözlük (düşük jargon)
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-neutral-600 dark:text-slate-400">
            Terimi okuyun; ilgili derse atlasan yeter — derin teoriyi yine kartın içinden alırsınız.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-[#474747] dark:bg-[#252526]">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-[#474747] dark:bg-[#2d2d2d]">
                  <th className="px-4 py-3 font-semibold">Terim</th>
                  <th className="px-4 py-3 font-semibold">Özet</th>
                  <th className="px-4 py-3 font-semibold">İlgili ders</th>
                </tr>
              </thead>
              <tbody>
                {GLOSSARY.map((row) => {
                  const id = row.lessonIdHint
                  const title = id
                    ? lessons.find((x) => x.id === id)?.title ?? id
                    : '—'
                  return (
                    <tr
                      key={row.term}
                      className="border-b border-neutral-100 last:border-0 dark:border-[#383838]"
                    >
                      <td className="px-4 py-3 font-semibold text-sky-900 dark:text-sky-200">
                        {row.term}
                      </td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-[#cccccc]">
                        {row.blurp}
                      </td>
                      <td className="px-4 py-3">
                        {id ? (
                          <button
                            type="button"
                            onClick={() => onPickLesson(id)}
                            className="text-left text-sm font-medium text-green-700 underline decoration-green-700/35 underline-offset-2 hover:text-green-800 dark:text-[#89d185] dark:decoration-[#89d185]/35"
                          >
                            {title}
                          </button>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  )
}
