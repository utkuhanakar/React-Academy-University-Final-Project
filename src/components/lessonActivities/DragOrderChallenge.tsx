import { useCallback, useEffect, useId, useMemo, useState } from 'react'

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
  /** Öğeler tam doğru sıradaysa bildirir */
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
  /** Kullanıcı “Sıramı doğrula”ya bastıysa yanlış sıra için ayrıntılı geribildirim */
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
      if (Number.isNaN(from)) return
      if (from === toIndex) return
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
    setOrder(shuffleIds(items).filter((id) => byId.has(id)))
    setShowRowFeedback(false)
  }

  let statusHint: string
  if (!showRowFeedback && isCorrect) {
    statusHint = 'Tam doğru sıra ✓ Liste değişirse doğruluğu yeniden denetleyebilirsiniz.'
  } else if (!showRowFeedback) {
    statusHint =
      'Öğeleri sürükleyin veya oklarla sırayı değiştirin; sonra “Sıramı doğrula” ile satır geri bildirimi alın.'
  } else if (isCorrect) {
    statusHint = `Hepsi doğru: ${correctlyPlaced}/${order.length} öğe yerinde ✓`
  } else {
    statusHint = `Şu sırayla ${correctlyPlaced}/${order.length} öğe doğru yerde — kırmızı çizgiler taşınması gereken satırlar. `
  }

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-800/70 dark:bg-indigo-950/35">
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
                  'flex gap-2 rounded-md border bg-white py-2 pl-3 pr-2 shadow-sm dark:bg-[#1e1e28]',
                  rowAligned
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40 dark:border-emerald-500'
                    : '',
                  rowOff ? 'border-amber-600 ring-2 ring-amber-500/35 dark:border-amber-500' : '',
                  !showRowFeedback || rowAligned || rowOff
                    ? ''
                    : 'border-indigo-200/90 dark:border-indigo-800/70',
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
                    className="rounded border border-neutral-300 px-2 py-0.5 text-xs font-bold disabled:opacity-30 dark:border-[#555]"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="Aşağı"
                    disabled={index === order.length - 1}
                    onClick={() => reorder(index, index + 1)}
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
                {showRowFeedback && expectId != null ? (
                  <span className="shrink-0 self-center font-mono text-[10px] font-bold uppercase text-neutral-400 dark:text-neutral-500">
                    {rowAligned ? '✓ yer' : `#${index + 1}→olmaz`}
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
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:bg-indigo-700"
          onClick={verifyOrder}
        >
          Sıramı doğrula
        </button>
        <button
          type="button"
          className="rounded-lg border border-indigo-400/70 px-4 py-2 text-sm font-semibold text-indigo-900 dark:text-indigo-100"
          onClick={shuffleOrder}
        >
          Karıştır
        </button>
      </div>
      <div
        role="status"
        className="mt-3 space-y-1 rounded-md border border-indigo-200/80 bg-white/70 px-3 py-2 text-xs font-medium text-indigo-950 dark:border-indigo-800/55 dark:bg-indigo-950/50 dark:text-indigo-100"
      >
        <p>{statusHint}</p>
        {!isCorrect ? (
          <p className="text-[11px] font-normal opacity-95 dark:text-indigo-200/90">
            İpucu: yeşil çerçeve bu satırda doğru blok durduğunu, turuncu çerçeve bu konum için yanlış
            seçildiğini gösterir; alt etikette sıra numarası yazar.
          </p>
        ) : null}
      </div>
    </div>
  )
}
