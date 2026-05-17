import { useCallback, useEffect, useId, useMemo, useState } from 'react'

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
  const [showRowFeedback, setShowRowFeedback] = useState(false)

  const isCorrect =
    correctOrderIds.length === order.length &&
    correctOrderIds.every((id, i) => order[i] === id)

  const correctlyPlaced =
    correctOrderIds.length === order.length
      ? order.filter((id, i) => correctOrderIds[i] === id).length
      : 0

  useEffect(() => {
    onSolvedChange?.(isCorrect)
  }, [isCorrect, onSolvedChange])

  const reorder = useCallback((from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev]
      const [row] = next.splice(from, 1)
      if (row == null) return prev
      next.splice(to, 0, row)
      return next
    })
    setShowRowFeedback(false)
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
      if (Number.isNaN(from) || from === toIndex) return
      reorder(from, toIndex)
    }

  const verifyOrder = () => {
    const ok =
      correctOrderIds.length === order.length &&
      correctOrderIds.every((id, i) => order[i] === id)
    setShowRowFeedback(true)
    onSolvedChange?.(ok)
  }

  const shuffleOrder = () => {
    setOrder(shuffleIds(pieces).filter((id) => byId.has(id)))
    setShowRowFeedback(false)
  }

  let statusHint: string
  if (!showRowFeedback && isCorrect) {
    statusHint = 'Parça sırası doğru ✓ Kodu değiştirirsen tekrar doğrulayın.'
  } else if (!showRowFeedback) {
    statusHint =
      'Parçaları doğru yürüme sırasına getirin; “Kod sırasını doğrula” ile satır geri bildirimi alın.'
  } else if (isCorrect) {
    statusHint = `Tam isabet: ${correctlyPlaced}/${order.length} satır doğru yerde ✓`
  } else {
    statusHint = `Şu an ${correctlyPlaced}/${order.length} satır doğru konumda — turuncu çerçeveli satırlar kaydırılmalı.`
  }

  return (
    <div className="rounded-lg border border-cyan-200 bg-cyan-50/80 p-4 dark:border-cyan-900/65 dark:bg-cyan-950/30">
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
          const expectId = correctOrderIds[index]
          const rowAligned = showRowFeedback && expectId != null && id === expectId
          const rowOff = showRowFeedback && expectId != null && id !== expectId
          return (
            <li
              key={id}
              draggable
              tabIndex={0}
              aria-describedby={reorderHelpId}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                  if (index === 0) return
                  reorder(index, index - 1)
                  e.preventDefault()
                  return
                }
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                  if (index >= order.length - 1) return
                  reorder(index, index + 1)
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
              <div
                className={[
                  'flex gap-2 rounded-md border py-2 pl-2 pr-2 font-mono text-xs leading-relaxed shadow-inner dark:border-cyan-800/80',
                  rowAligned
                    ? 'border-emerald-500 bg-neutral-950 ring-2 ring-emerald-500/40 text-cyan-100'
                    : 'border-cyan-200/90 bg-neutral-950 text-cyan-100',
                  rowOff ? 'border-amber-600 ring-2 ring-amber-500/35' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="flex flex-col gap-1 sm:hidden">
                  <button
                    type="button"
                    aria-label="Yukarı"
                    disabled={index === 0}
                    onClick={() => reorder(index, index - 1)}
                    className="rounded border border-cyan-700 px-2 py-0.5 font-sans text-xs font-bold disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="Aşağı"
                    disabled={index >= order.length - 1}
                    onClick={() => reorder(index, index + 1)}
                    className="rounded border border-cyan-700 px-2 py-0.5 font-sans text-xs font-bold disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-all">
                  {row.code}
                </pre>
                {showRowFeedback && expectId != null ? (
                  <span className="shrink-0 self-center px-1 font-sans text-[10px] font-bold uppercase text-cyan-200/95">
                    {rowAligned ? '✓ yer' : 'taşı'}
                  </span>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-cyan-800"
          onClick={verifyOrder}
        >
          Kod sırasını doğrula
        </button>
        <button
          type="button"
          className="rounded-lg border border-cyan-500/70 px-4 py-2 text-sm font-semibold text-cyan-950 dark:text-cyan-100"
          onClick={shuffleOrder}
        >
          Karıştır
        </button>
      </div>
      <div
        role="status"
        className="mt-3 rounded-md border border-cyan-200/80 bg-white/80 px-3 py-2 text-xs font-medium text-cyan-950 dark:border-cyan-800/55 dark:bg-cyan-950/40 dark:text-cyan-100"
      >
        <p>{statusHint}</p>
        {!isCorrect ? (
          <p className="mt-1 text-[11px] font-normal opacity-95 dark:text-cyan-200/90">
            Yeşil: bu satır numarasında doğru parça duruyor. Turuncu: bu sıraya uygun başka bir parça
            gelmiş.
          </p>
        ) : null}
      </div>
    </div>
  )
}
