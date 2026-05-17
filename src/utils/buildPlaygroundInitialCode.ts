/**
 * `data/lessons` içindeki örnek kodu, `react-live` ile `noInline` + `render()` kullanımına uyarlar.
 * - `react` import satırlarını kaldırır (kapsam `CodePlayground` içinde sağlanır).
 * - `export default function İsim` ifadesini `function İsim` yapar ve `render(<İsim />)` ekler.
 */
export function buildPlaygroundInitialCode(exampleCodeFromLesson: string): string {
  let code = exampleCodeFromLesson.trim()

  code = code.replace(/^import\s+[^;]+from\s+['"]react['"]\s*;?\s*$/gm, '')

  code = code.replace(/^import\s+[^;]+from\s+['"]react-dom['"]\s*;?\s*$/gm, '')

  code = code.replace(/\be:\s*FormEvent\b/g, 'e: React.FormEvent')

  const exportDefaultFunctionMatch = code.match(
    /export\s+default\s+function\s+(\w+)/,
  )
  const rootComponentName = exportDefaultFunctionMatch?.[1] ?? 'App'

  code = code.replace(/export\s+default\s+function\s+/g, 'function ')
  code = code.replace(/export\s+default\s+/g, '')

  return `${code.trim()}\n\nrender(<${rootComponentName} />)`
}
