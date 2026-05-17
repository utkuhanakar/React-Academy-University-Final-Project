import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { LessonH2Anchor } from '../utils/lessonReadingMeta'

/** GFM tablolar, çizgiye çarpma vb. için `ReactMarkdown`'a verin (\`remarkPlugins={markdownRemarkPlugins}\`). */
export const markdownRemarkPlugins = [remarkGfm]

export interface MarkdownComponentsOptions {
  /** Ders kartı Markdown’ında H2 sırasına göre \`id\` — içindekiler ile eşlemek için. */
  readonly h2AnchorPlan?: readonly Pick<LessonH2Anchor, 'id'>[]
}

/**
 * `react-markdown` için fenced code + satır içi kod; bloklar Prism + dracula ile renklendirilir.
 */
export function createMarkdownComponents(
  opts: MarkdownComponentsOptions = {},
): Components {
  let h2Ix = 0

  const base: Components = {
    pre({ children }) {
      return (
        <div className="not-prose my-4 max-w-full overflow-x-auto rounded-md">
          {children}
        </div>
      )
    },
    code({ className, children, ...props }) {
      const text = String(children).replace(/\n$/, '')
      const match = /language-([\w-]+)/.exec(className ?? '')
      const isBlock = match !== null || text.includes('\n')

      if (!isBlock) {
        return (
          <code
            className="rounded-sm border border-neutral-300/95 bg-neutral-100 px-[0.35rem] py-px font-mono text-[0.8425em] font-normal leading-snug text-neutral-900 dark:border-neutral-500 dark:bg-neutral-800/95 dark:text-neutral-100"
            {...props}
          >
            {children}
          </code>
        )
      }

      let lang = match?.[1] ?? 'tsx'
      if (lang === 'js') lang = 'javascript'
      if (lang === 'ts') lang = 'typescript'

      return (
        <SyntaxHighlighter
          language={lang}
          style={dracula}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: 6,
            fontSize: 'clamp(11px, 3.6vw, 0.8125rem)',
            lineHeight: 1.55,
          }}
        >
          {text}
        </SyntaxHighlighter>
      )
    },
    /** GFM tabloları prose dışına taşımış net çerçeve + yatay kaydırma ile okunabilir yapar */
    table({ children }) {
      return (
        <div className="not-prose my-5 overflow-x-auto rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-600 dark:bg-[#252526]">
          <table className="min-w-full border-collapse text-left text-[14px] text-neutral-800 dark:text-neutral-200">
            {children}
          </table>
        </div>
      )
    },
    thead({ children }) {
      return (
        <thead className="bg-neutral-50 dark:bg-neutral-800/95">{children}</thead>
      )
    },
    th({ children }) {
      return (
        <th className="border border-neutral-200 px-3 py-2.5 text-xs font-semibold tracking-normal text-neutral-700 dark:border-neutral-600 dark:text-neutral-100">
          {children}
        </th>
      )
    },
    td({ children }) {
      return (
        <td className="border border-neutral-200 px-3 py-2.5 align-top dark:border-neutral-600">
          {children}
        </td>
      )
    },
  }

  const plan = opts.h2AnchorPlan
  return {
    ...base,
    h2({ children, ...rest }) {
      const id = plan?.[h2Ix++]?.id
      if (!id) {
        return <h2 {...rest}>{children}</h2>
      }
      const mergedCls = ['scroll-mt-20', rest.className].filter(Boolean).join(' ')
      return (
        <h2 {...rest} id={id} className={mergedCls}>
          {children}
        </h2>
      )
    },
  }
}
