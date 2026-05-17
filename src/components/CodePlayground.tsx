import * as React from 'react'
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  Fragment,
  Component,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import { themes } from 'prism-react-renderer'

export interface CodePlaygroundProps {
  /** Editörde başlangıçta gösterilecek ve çalıştırılacak kod. */
  initialCode: string
  /**
   * `true` iken kod çok satırlı/bileşen içerebilir; kök seviyede `render(<... />)` çağrısı beklenir.
   * @default true
   */
  noInline?: boolean
  /** Geniş kod alanı gerektiren ders için düzen (`laboratory` düzeni ile). */
  size?: 'default' | 'expanded'
}

const prismTheme = themes.vsDark

/** react-live kapsamında ders örnekleri için sınıf error boundary. */
export class PlaygroundErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[PlaygroundErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <p className="text-sm text-red-300">Alt bileşende hata oluştu.</p>
        )
      )
    }
    return this.props.children
  }
}

function usePlaygroundScope() {
  return useMemo(
    () => ({
      React,
      Component,
      createContext,
      useContext,
      useState,
      useReducer,
      useEffect,
      useMemo,
      useRef,
      useCallback,
      Fragment,
      createPortal,
      PlaygroundErrorBoundary,
    }),
    [],
  )
}

function PanelChrome({
  title,
  accent,
  rightSlot,
}: {
  title: string
  accent: 'editor' | 'preview'
  rightSlot?: ReactNode
}) {
  const dot =
    accent === 'editor'
      ? 'bg-[#f48771] shadow-[0_0_0_1px_#0003]'
      : 'bg-[#89d185] shadow-[0_0_0_1px_#0003]'
  return (
    <div className="flex h-9 items-center justify-between gap-2 border-b border-[#2d2d2d] bg-[#252526] px-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className={`h-3 w-3 shrink-0 rounded-full ${dot}`} aria-hidden />
        <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-wider text-[#cccccc]">
          {title}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {rightSlot}
        <span className="font-mono text-[10px] text-[#858585]" aria-hidden>
          ●
        </span>
      </div>
    </div>
  )
}

export default function CodePlayground({
  initialCode,
  noInline = true,
  size = 'default',
}: CodePlaygroundProps) {
  const scope = usePlaygroundScope()
  const [resetKey, setResetKey] = useState(0)

  const handleReset = useCallback(() => {
    setResetKey((n) => n + 1)
  }, [])

  const gridMin =
    size === 'expanded'
      ? 'min-h-[36rem] lg:min-h-[42rem]'
      : 'min-h-[22rem]'

  const resetButton = (
    <button
      type="button"
      onClick={handleReset}
      className="rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#d4d4d4] shadow-sm transition hover:border-[#505050] hover:bg-[#383838] hover:text-white active:translate-y-px"
      title="Başlangıç koduna dön"
    >
      Kodu sıfırla
    </button>
  )

  return (
    <LiveProvider
      key={resetKey}
      code={initialCode}
      scope={scope}
      theme={prismTheme}
      language="tsx"
      enableTypeScript
      noInline={noInline}
    >
      <div className="overflow-hidden rounded-lg border border-neutral-300 bg-[#1e1e1e] shadow-[0_12px_40px_rgba(0,0,0,0.35)] dark:border-[#3c3c3c]">
        <div className={`grid ${gridMin} grid-cols-1 lg:grid-cols-2`}>
          <section
            className={`flex flex-col border-b border-[#474747] bg-[#1e1e1e] lg:min-h-0 lg:border-b-0 lg:border-r lg:border-[#474747] ${gridMin}`}
            aria-label="Canlı kod editörü"
          >
            <PanelChrome
              title="Live Editor — TypeScript / JSX"
              accent="editor"
              rightSlot={resetButton}
            />
            <div className="min-h-0 min-w-0 flex-1 overflow-auto">
              <LiveEditor
                className="font-mono text-[11px] leading-relaxed sm:text-[13px] [&_textarea]:text-[11px] sm:[&_textarea]:text-[13px] [&_pre]:!min-h-[14rem] sm:[&_pre]:!min-h-[18rem] [&_pre]:!bg-[#1e1e1e] [&_pre]:!p-3 [&_pre]:!font-mono sm:[&_pre]:!p-4"
                style={{ minHeight: '100%' }}
              />
            </div>
          </section>

          <section
            className={`flex flex-col bg-[#181818] ${gridMin} lg:min-h-0`}
            aria-label="Önizleme"
          >
            <PanelChrome title="Önizleme" accent="preview" />
            <div className="min-h-0 min-w-0 flex-1 overflow-auto p-4">
              <div className="min-h-[10rem] rounded border border-[#333] bg-[#141414] p-4 shadow-inner">
                <LivePreview className="text-left text-[13px] leading-relaxed text-neutral-100 sm:text-[15px] [&_*]:outline-offset-2" />
              </div>
            </div>
          </section>
        </div>

        <div
          className="border-t border-[#474747] bg-[#0c0c0c]"
          aria-label="Çalışma zamanı çıktısı"
        >
          <div className="flex h-8 items-center border-b border-[#1a1a1a] bg-[#1b1b1b] px-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#c586c0]">
              terminal
            </span>
          </div>
          <LiveError className="min-h-[3rem] overflow-x-auto bg-[#0c0c0c] px-4 py-3 font-mono text-xs font-medium leading-relaxed text-[#f48771] [&:empty]:min-h-0 [&:empty]:p-0" />
        </div>
      </div>
    </LiveProvider>
  )
}
