import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'

/** GFM tablolar, çizgiye çarpma vb. için `ReactMarkdown`'a verin (\`remarkPlugins={markdownRemarkPlugins}\`). */
export const markdownRemarkPlugins = [remarkGfm]

/**
 * `react-markdown` için fenced code + satır içi kod; bloklar Prism + dracula ile renklendirilir.
 */
export function createMarkdownComponents(): Components {
  return {
    pre({ children }) {
      return (
        <div className="not-prose my-4 max-w-full overflow-x-auto rounded-lg">{children}</div>
      )
    },
    code({ className, children, ...props }) {
      const text = String(children).replace(/\n$/, '')
      const match = /language-([\w-]+)/.exec(className ?? '')
      const isBlock = match !== null || text.includes('\n')

      if (!isBlock) {
        return (
          <code
            className="rounded bg-violet-100/90 px-1.5 py-0.5 font-mono text-[0.875em] text-violet-900 dark:bg-violet-900/55 dark:text-violet-100"
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
            borderRadius: 12,
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
        <div className="not-prose my-5 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-600 dark:bg-[#252526]">
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
        <th className="border border-neutral-200 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-neutral-700 dark:border-neutral-600 dark:text-neutral-100">
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
}
