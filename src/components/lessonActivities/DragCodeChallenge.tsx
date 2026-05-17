import { useCallback, useId, useMemo, useState } from 'react'

function shuffleIds<T extends { id: string }>(items: readonly T[]): string[] {
  const ids = items.map((i) => i.id)
  for (let k = ids.length - 1; k > 0; k -= 1) {
    const j = Math.floor(Math.random() * (k + 1))
    ;[ids[k], ids[j]] = [ids[j]!, ids[k]!]
  }
  return ids
}

export interface DragCodeChallengeProps {
  pieces: readonly { id: string; code: string }[]
  correctOrderIds: readonly string[]
  title: string
  description?: string
  onSolvedChange?: (ok: boolean) => void
}

export default function DragCodeChallenge({
  pieces,
  correctOrderIds,
  title,
  description,
  onSolvedChange,
}: DragCodeChallengeProps) {
  const reorderHelpId = useId()
  const byId = useMemo(() => new Map(pieces.map((p) => [p.id, p])), [pieces])

  const [order, setOrder] = useState<string[]>(() =>
    shuffleIds(pieces).filter((id) => byId.has(id)),
  )

  const move = useCallback((from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev]
      const [row] = next.splice(from, 1)
      if (row == null) return prev
      next.splice(to, 0, row)
      return next
    })
  }, [])

  const isCorrect =
    correctOrderIds.length === order.length &&
    correctOrderIds.every((id, i) => order[i] === id)

  const handleDragStart =
    (index: number) => (e: React.DragEvent<HTMLLIElement>) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(index))
    }

  const handleDrop =
    (toIndex: number) => (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault()
      const from = Number.parseInt(e.dataTransfer.getData('text/plain'), 10)
      if (Number.isNaN(from) || from === toIndex) return
      move(from, toIndex)
    }

  const check = () => {
    const ok =
      correctOrderIds.length === order.length &&
      correctOrderIds.every((id, i) => order[i] === id)
    onSolvedChange?.(ok)
  }

  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-4 dark:border-cyan-900/65 dark:bg-cyan-950/30">
      <h3 className="text-base font-semibold text-cyan-950 dark:text-cyan-100">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 text-sm text-cyan-900/85 dark:text-cyan-200/90">{description}</p>
      ) : null}
      <p id={reorderHelpId} className="sr-only">
        Kod satırına Tab ile odaklanın; ok tuşları veya ok düğmeleri ile sırayı değiştirin; fareyle
        sürükleyebilirsiniz.
      </p>
      <ol className="mt-4 space-y-2">
        {order.map((id, index) => {
          const row = byId.get(id)
          if (!row) return null
          return (
            <li
              key={id}
              draggable
              tabIndex={0}
              aria-describedby={reorderHelpId}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                  if (index === 0) return
                  move(index, index - 1)
                  e.preventDefault()
                  return
                }
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                  if (index >= order.length - 1) return
                  move(index, index + 1)
                  e.preventDefault()
                }
              }}
              onDragStart={handleDragStart(index)}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
              }}
              onDrop={handleDrop(index)}
              className="touch-manipulation"
            >
              <div className="flex gap-2 rounded-lg border border-cyan-200/90 bg-neutral-950 py-2 pl-2 pr-2 font-mono text-xs leading-relaxed text-cyan-100 shadow-inner dark:border-cyan-800/80">
                <div className="flex flex-col gap-1 sm:hidden">
                  <button
                    type="button"
                    aria-label="Yukarı"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    className="rounded border border-cyan-700 px-2 py-0.5 font-sans text-xs font-bold disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="Aşağı"
                    disabled={index === order.length - 1}
                    onClick={() => move(index, index + 1)}
                    className="rounded border border-cyan-700 px-2 py-0.5 font-sans text-xs font-bold disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-all">
                  {row.code}
                </pre>
              </div>
            </li>
          )
        })}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-cyan-800"
          onClick={check}
        >
          Kod sırasını doğrula
        </button>
        <button
          type="button"
          className="rounded-lg border border-cyan-500/70 px-4 py-2 text-sm font-semibold text-cyan-950 dark:text-cyan-100"
          onClick={() =>
            setOrder(shuffleIds(pieces).filter((id) => byId.has(id)))
          }
        >
          Karıştır
        </button>
      </div>
      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-cyan-900 dark:text-cyan-400/95">
        {isCorrect ? 'Doğru parça sırası ✓' : 'Parçaları üst üste doğru sıraya getir.'}
      </p>
    </div>
  )
}
