import { useCallback, useId, useMemo, useState } from 'react'

function shuffleIds<T extends { id: string }>(items: readonly T[]): string[] {
  const ids = items.map((i) => i.id)
  for (let k = ids.length - 1; k > 0; k -= 1) {
    const j = Math.floor(Math.random() * (k + 1))
    ;[ids[k], ids[j]] = [ids[j]!, ids[k]!]
  }
  return ids
}

export interface DragOrderChallengeProps {
  items: readonly { id: string; text: string }[]
  correctOrderIds: readonly string[]
  title: string
  description?: string
  /** Her doğru sıra veya sıfırlamada bildirir */
  onSolvedChange?: (ok: boolean) => void
}

export default function DragOrderChallenge({
  items,
  correctOrderIds,
  title,
  description,
  onSolvedChange,
}: DragOrderChallengeProps) {
  const reorderHelpId = useId()
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])

  const [order, setOrder] = useState<string[]>(() =>
    shuffleIds(items).filter((id) => byId.has(id)),
  )

  const isCorrect =
    correctOrderIds.length === order.length &&
    correctOrderIds.every((id, i) => order[i] === id)

  const move = useCallback((from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev]
      const [row] = next.splice(from, 1)
      if (row == null) return prev
      next.splice(to, 0, row)
      return next
    })
  }, [])

  const handleDragStart =
    (index: number) => (e: React.DragEvent<HTMLLIElement>) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(index))
    }

  const handleDrop =
    (toIndex: number) => (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault()
      const from = Number.parseInt(e.dataTransfer.getData('text/plain'), 10)
      if (Number.isNaN(from)) return
      if (from === toIndex) return
      move(from, toIndex)
    }

  const reorderAfterCheck = () => {
    const ok =
      correctOrderIds.length === order.length &&
      correctOrderIds.every((id, i) => order[i] === id)
    onSolvedChange?.(ok)
  }

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-800/70 dark:bg-indigo-950/35">
      <h3 className="text-base font-semibold text-indigo-950 dark:text-indigo-100">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 text-sm text-indigo-900/85 dark:text-indigo-200/90">
          {description}
        </p>
      ) : null}
      <p id={reorderHelpId} className="sr-only">
        Liste öğesine Tab ile gidin; yukarı ve aşağı ok tuşları veya küçük ekranda yüz okları ile
        sırayı değiştirin; sürüklemek de mümkündür.
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
              <div className="flex gap-2 rounded-lg border border-indigo-200/90 bg-white py-2 pl-3 pr-2 shadow-sm dark:border-indigo-800/70 dark:bg-[#1e1e28]">
                <div className="flex flex-col gap-1 sm:hidden">
                  <button
                    type="button"
                    aria-label="Yukarı"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    className="rounded border border-neutral-300 px-2 py-0.5 text-xs font-bold disabled:opacity-30 dark:border-[#555]"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="Aşağı"
                    disabled={index === order.length - 1}
                    onClick={() => move(index, index + 1)}
                    className="rounded border border-neutral-300 px-2 py-0.5 text-xs font-bold disabled:opacity-30 dark:border-[#555]"
                  >
                    ▼
                  </button>
                </div>
                <span className="font-mono text-xs text-indigo-500 dark:text-indigo-300">
                  ⋮⋮
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-neutral-900 dark:text-[#ececec]">
                  {row.text}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:bg-indigo-700"
          onClick={reorderAfterCheck}
        >
          Sıramı doğrula
        </button>
        <button
          type="button"
          className="rounded-lg border border-indigo-400/70 px-4 py-2 text-sm font-semibold text-indigo-900 dark:text-indigo-100"
          onClick={() =>
            setOrder(shuffleIds(items).filter((id) => byId.has(id)))
          }
        >
          Karıştır
        </button>
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-indigo-800 dark:text-indigo-300/90">
        {isCorrect
          ? 'Doğru sıra ✓ — mobilde sürükleyemezsen ▲▼ kullan.'
          : 'Masaüstünde öğeleri sürükleyip bırak; sonra “Sıramı doğrula”.'}
      </p>
    </div>
  )
}
