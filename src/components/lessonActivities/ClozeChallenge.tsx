import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { countClozeBlanks, normalizeClozeText } from '../../utils/clozeHelpers'

export interface ClozeChallengeProps {
  title: string
  description?: string
  text: string
  blanks: readonly { accepted: readonly string[] }[]
  wordBank: readonly string[]
  onSolvedChange?: (ok: boolean) => void
}

function normalizeAnswer(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[\u2019\u2018]/g, "'")
}

function guessMatchesBlank(guess: string, accepted: readonly string[]): boolean {
  const g = normalizeAnswer(guess)
  if (!g) return false
  return accepted.some((a) => normalizeAnswer(a) === g)
}

export default function ClozeChallenge({
  title,
  description,
  text,
  blanks,
  wordBank,
  onSolvedChange,
}: ClozeChallengeProps) {
  const normalizedText = useMemo(() => normalizeClozeText(text), [text])
  const n = countClozeBlanks(text)
  const valid = n === blanks.length && wordBank.length >= n

  const parts = useMemo(() => normalizedText.split('___'), [normalizedText])

  const [chosen, setChosen] = useState<(string | '')[]>(() =>
    Array.from({ length: n }, () => ''),
  )

  /** Son kontrol: slot bazlı doğru/yanlış (düzenleme ile sıfırlanır). */
  const [slotCorrect, setSlotCorrect] = useState<boolean[] | null>(null)
  const skippedFirstChosenEffect = useRef(false)

  /** Düzenleme yapılınca sonuç vurgusu ve üst kapı sıfırlansın */
  useEffect(() => {
    if (!skippedFirstChosenEffect.current) {
      skippedFirstChosenEffect.current = true
      return
    }
    setSlotCorrect(null)
    onSolvedChange?.(false)
  }, [chosen, onSolvedChange])

  const evaluate = useMemo(() => {
    return blanks.map((b, i) => {
      const g = chosen[i]?.trim()
      if (!g) return false
      return guessMatchesBlank(g, b.accepted)
    })
  }, [blanks, chosen])

  const allFilled = chosen.every((c) => String(c).trim().length > 0)

  const checkAnswer = useCallback(() => {
    if (!valid) return
    const nextSlotOk = evaluate.map(Boolean)
    const ok = nextSlotOk.every(Boolean)
    setSlotCorrect(nextSlotOk)
    onSolvedChange?.(ok)
  }, [evaluate, onSolvedChange, valid])

  if (!valid) {
    return (
      <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
        Boşluk doldurma verisi uyumsuz (yer tutucu sayısı / blanks).
      </p>
    )
  }

  const showResults = slotCorrect != null

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
      <h3 className="text-base font-semibold text-amber-950 dark:text-amber-100">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-amber-900/90 dark:text-amber-200/90">{description}</p>
      ) : null}

      <div
        className="mt-3 min-h-[1.25rem] text-sm font-medium"
        role="status"
        aria-live="polite"
      >
        {showResults ? (
          slotCorrect.every(Boolean) ? (
            <p className="rounded-lg border border-emerald-500/60 bg-emerald-50 px-3 py-2 text-emerald-950 dark:border-emerald-600/50 dark:bg-emerald-950/40 dark:text-emerald-100">
              Tüm boşluklar doğru.
            </p>
          ) : (
            <p className="rounded-lg border border-red-500/70 bg-red-50 px-3 py-2 text-red-950 dark:border-red-600/50 dark:bg-red-950/45 dark:text-red-100">
              Bazı cevaplar hatalı — kırmızı çerçeveli boşlukları düzeltin veya sıfırlayıp yeniden deneyin.
            </p>
          )
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 rounded-lg border border-amber-300/70 bg-white/90 p-3 dark:border-amber-800/60 dark:bg-[#252018]">
        <span className="w-full text-xs font-bold uppercase text-amber-800 dark:text-amber-400/95">
          Kelime havuzu
        </span>
        {wordBank.map((w, idx) => {
          const usedCount = chosen.filter((c) => c === w).length
          const bankCount = wordBank.filter((x) => x === w).length
          const used = usedCount >= bankCount
          return (
            <button
              key={`${w}-${idx}`}
              type="button"
              disabled={used}
              className={[
                'touch-manipulation rounded-full border px-3 py-1 text-sm font-semibold transition',
                used
                  ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800'
                  : 'border-amber-500 bg-amber-100 text-amber-950 hover:bg-amber-200 dark:border-amber-600 dark:bg-amber-900/50 dark:text-amber-50',
              ].join(' ')}
              onClick={() => {
                const slot = chosen.findIndex((c) => c === '')
                if (slot >= 0) {
                  setChosen((prev) => {
                    const next = [...prev]
                    next[slot] = w
                    return next
                  })
                }
              }}
            >
              {w}
            </button>
          )
        })}
        {!allFilled ? (
          <span className="text-xs text-amber-800/70 dark:text-amber-200/70">
            Boşlukları sırayla doldurmak için havuzdan seçin — yerleşeni × ile geri alın.
          </span>
        ) : (
          <span className="text-xs text-amber-800/70 dark:text-amber-200/70">
            Tüm kelimeler yerleştirildi — kontrol edin veya sıfırlayın.
          </span>
        )}
      </div>

      <div className="mt-6 text-base leading-relaxed text-neutral-900 dark:text-[#ececec]">
        {parts.map((segment, pi) => {
          if (pi === parts.length - 1) {
            return <span key={`s-${pi}`}>{segment}</span>
          }
          const bi = pi
          const val = chosen[bi]
          const filled = Boolean(val?.trim())

          let boxClass =
            'mx-1 inline-flex min-w-[6rem] items-center rounded border px-2 py-1 font-mono text-sm font-semibold shadow-sm dark:bg-[#1a150d]'
          if (showResults && slotCorrect) {
            if (filled && slotCorrect[bi]) {
              boxClass +=
                ' border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-50'
            } else if (!slotCorrect[bi]) {
              boxClass +=
                ' border-red-600 bg-red-50 text-red-950 dark:border-red-500 dark:bg-red-950/40 dark:text-red-50'
            } else {
              boxClass +=
                ' border-amber-500/70 bg-white text-amber-950 dark:text-amber-100'
            }
          } else {
            boxClass +=
              ' border-amber-500/70 bg-white text-amber-950 dark:text-amber-100'
          }

          return (
            <span key={`s-${pi}`}>
              {segment}
              <span className={boxClass}>
                {val || '____'}
              </span>
              {val ? (
                <button
                  type="button"
                  className="ml-1 rounded border border-neutral-400 px-1 text-[10px] font-bold uppercase text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"
                  onClick={() =>
                    setChosen((prev) => {
                      const next = [...prev]
                      next[bi] = ''
                      return next
                    })
                  }
                >
                  ×
                </button>
              ) : null}
            </span>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={checkAnswer}
          disabled={!allFilled}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cevapları kontrol et
        </button>
        <button
          type="button"
          className="rounded-lg border border-amber-500/70 px-4 py-2 text-sm font-semibold text-amber-950 dark:text-amber-100"
          onClick={() => {
            setChosen(Array.from({ length: n }, () => ''))
            setSlotCorrect(null)
            onSolvedChange?.(false)
          }}
        >
          Sıfırla
        </button>
      </div>
    </div>
  )
}
