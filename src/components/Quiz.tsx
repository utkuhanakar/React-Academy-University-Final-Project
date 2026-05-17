import { useCallback, useEffect, useRef, useState } from 'react'

export interface QuizProps {
  question: string
  options: readonly string[]
  correctAnswerIndex: number
  /** Peş peşe alıştırma yolunda: soru bazlı saniye süresi; süre dolunca yanlış sayılır. */
  timedSecondsBudget?: number
  /**
   * Doğru veya yanlış gönderimden sonra ve “Tekrar dene” ile sıfırlandığında çağrılır.
   */
  onQuizPassedChange?: (passed: boolean) => void
  /**
   * Ders kartı / stüdyo: “Tekrar dene” sırasında üst bileşene bildirir ki şık sırasını yeniden
   * karıştıran bir zaman damgası / sayaç artırılsın (deterministik kapsam yenilensin).
   */
  onQuizRetryShuffle?: () => void
  /**
   * Alıştırma yolu: yanlış gönderimi ve doğruyu ayrı bildirir (“Tekrar dene” sıfırında tekrar etmez).
   */
  strictPracticeCallbacks?: {
    onCorrect: () => void
    /** Yanlış cevap “Cevabı gönder” ile onaylanınca bir kez (sayıcı; pozisyon sıfırlamaz). */
    onWrongSubmit: () => void
    /** Peş peşe yolda “Tekrar dene — başa dön”: cursor’ı ilk soruya sıfırlayıp çıkmazı yeniden render eder. */
    onRestartPathFromBeginning: () => void
  }
}

export default function Quiz({
  question,
  options,
  correctAnswerIndex,
  timedSecondsBudget,
  onQuizPassedChange,
  onQuizRetryShuffle,
  strictPracticeCallbacks,
}: QuizProps) {
  const pathLiveRef = useRef<HTMLParagraphElement>(null)
  const timeoutFiredRef = useRef(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [playShake, setPlayShake] = useState(false)
  const [pathWrongPulse, setPathWrongPulse] = useState(false)
  const isPathMode = Boolean(strictPracticeCallbacks)

  useEffect(() => {
    if (!playShake) return
    const id = window.setTimeout(() => setPlayShake(false), isPathMode ? 580 : 450)
    return () => window.clearTimeout(id)
  }, [playShake, isPathMode])

  useEffect(() => {
    if (!pathWrongPulse) return
    const id = window.setTimeout(() => setPathWrongPulse(false), 900)
    return () => window.clearTimeout(id)
  }, [pathWrongPulse])

  const [remainSec, setRemainSec] = useState<number | null>(() =>
    timedSecondsBudget ?? null,
  )

  useEffect(() => {
    if (!strictPracticeCallbacks || !timedSecondsBudget || isSubmitted) return
    if (timedSecondsBudget <= 0) return

    timeoutFiredRef.current = false
    let left = timedSecondsBudget
    const id = window.setInterval(() => {
      left -= 1
      setRemainSec(left)
      if (left <= 0 && !timeoutFiredRef.current) {
        timeoutFiredRef.current = true
        window.clearInterval(id)
        const fallbackWrong =
          options.findIndex((_o, i) => i !== correctAnswerIndex) ?? 0
        setSelectedOption(fallbackWrong)
        setPlayShake(true)
        setPathWrongPulse(true)
        setIsSubmitted(true)
        strictPracticeCallbacks.onWrongSubmit()
        onQuizPassedChange?.(false)
        try {
          const correctText = options[correctAnswerIndex] ?? ''
          const clipped =
            correctText.length > 140 ? `${correctText.slice(0, 138)}…` : correctText
          const msg = `Süre doldu. Doğru şıkkın özeti: ${clipped} — “Tekrar dene — başa dön”.`
          const live = pathLiveRef.current
          if (live) {
            live.textContent = ''
            window.requestAnimationFrame(() => {
              live.textContent = msg
            })
          }
        } catch {
          /* yok say */
        }
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [
    timedSecondsBudget,
    strictPracticeCallbacks,
    isSubmitted,
    question,
    correctAnswerIndex,
    options,
    onQuizPassedChange,
  ])

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null) return
    const passed = selectedOption === correctAnswerIndex
    setIsSubmitted(true)
    if (!passed) {
      setPlayShake(true)
      if (strictPracticeCallbacks) {
        setPathWrongPulse(true)
        try {
          const correctText = options[correctAnswerIndex] ?? ''
          const clipped =
            correctText.length > 140 ? `${correctText.slice(0, 138)}…` : correctText
          const msg = `Yanlış. Doğru şıkkın özeti: ${clipped} — devam etmek için “Tekrar dene — başa dön” seç.`
          const live = pathLiveRef.current
          if (live) {
            live.textContent = ''
            window.requestAnimationFrame(() => {
              live.textContent = msg
            })
          }
        } catch {
          /* yok say */
        }
      }
      strictPracticeCallbacks?.onWrongSubmit()
    } else {
      strictPracticeCallbacks?.onCorrect()
    }
    onQuizPassedChange?.(passed)
  }, [
    selectedOption,
    correctAnswerIndex,
    options,
    onQuizPassedChange,
    strictPracticeCallbacks,
  ])

  const isChoiceCorrect =
    isSubmitted && selectedOption === correctAnswerIndex
  const isChoiceWrong =
    isSubmitted && selectedOption !== correctAnswerIndex

  const handleTryAgain = useCallback(() => {
    if (
      strictPracticeCallbacks?.onRestartPathFromBeginning &&
      isSubmitted &&
      selectedOption !== null &&
      selectedOption !== correctAnswerIndex
    ) {
      strictPracticeCallbacks.onRestartPathFromBeginning()
      return
    }
    // Peş peşe yolu dışındaki tekrarda şıklar yeniden sıralansın diye bildirim
    if (!strictPracticeCallbacks) {
      onQuizRetryShuffle?.()
    }
    setIsSubmitted(false)
    setSelectedOption(null)
    onQuizPassedChange?.(false)
  }, [
    correctAnswerIndex,
    isSubmitted,
    onQuizPassedChange,
    onQuizRetryShuffle,
    selectedOption,
    strictPracticeCallbacks,
  ])

  return (
    <div className="relative">
      {strictPracticeCallbacks ? (
        <p ref={pathLiveRef} className="sr-only" aria-live="assertive" />
      ) : null}

      <div
        className={[
          'rounded-lg border bg-white p-1 shadow-sm',
          strictPracticeCallbacks
            ? [
                pathWrongPulse ? 'animate-quiz-path-wrong-flash' : '',
                isChoiceWrong ? 'border-red-500 bg-red-50/95 ring-4 ring-red-500/55 dark:bg-red-950/50 dark:border-red-400 dark:ring-red-500/35' : 'border-neutral-200 dark:border-[#474747] dark:bg-[#252526]',
              ].join(' ')
            : 'border-neutral-200 dark:border-[#474747] dark:bg-[#252526]',
          playShake
            ? strictPracticeCallbacks
              ? 'animate-quiz-shake-hard'
              : 'animate-quiz-shake'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
      <div className="flex flex-wrap items-start justify-between gap-2 px-4 pt-4">
        <p className="min-w-0 flex-1 text-lg font-bold leading-snug text-neutral-900 dark:text-[#ececec]">
          {question}
        </p>
        {timedSecondsBudget && strictPracticeCallbacks && !isSubmitted ? (
          <span
            className={[
              'shrink-0 rounded-full border-2 px-3 py-1 font-mono text-sm font-black tabular-nums',
              (remainSec ?? 0) <= 5
                ? 'border-red-600 bg-red-500 text-white'
                : 'border-amber-500 bg-amber-100 text-amber-950 dark:border-amber-400 dark:bg-amber-950/50 dark:text-amber-50',
            ].join(' ')}
            aria-label={`Kalan süre ${remainSec ?? timedSecondsBudget} saniye`}
          >
            {remainSec ?? timedSecondsBudget}s
          </span>
        ) : null}
      </div>

      <div
        className="flex flex-col gap-3 px-3 pb-3"
        role="radiogroup"
        aria-label="Çoktan seçmeli soru"
      >
        {options.map((optionLabel, optionIndex) => {
          const isSelected = selectedOption === optionIndex
          const isCorrectOption = optionIndex === correctAnswerIndex
          const showCorrectStyle =
            isSubmitted && isCorrectOption && isSelected && isChoiceCorrect
          const showWrongStyle =
            isSubmitted && isSelected && isChoiceWrong
          const showRevealCorrect =
            isSubmitted && isCorrectOption && isChoiceWrong

          return (
            <button
              key={optionIndex}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isSubmitted}
              onClick={() => {
                if (!isSubmitted) setSelectedOption(optionIndex)
              }}
              className={[
                'rounded-lg border px-4 py-3.5 text-left text-base font-medium leading-snug shadow-sm transition-colors',
                !isSubmitted
                  ? 'hover:border-neutral-400 hover:bg-neutral-50 dark:hover:border-neutral-500 dark:hover:bg-zinc-800/70'
                  : '',
                !isSubmitted &&
                  isSelected &&
                  'border-teal-600 bg-teal-50 ring-1 ring-teal-500/25 dark:border-teal-500 dark:bg-teal-950/40 dark:text-teal-50 dark:ring-teal-500/20',
                !isSubmitted &&
                  !isSelected &&
                  'border-neutral-200 bg-white text-neutral-800 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#d4d4d4]',
                showCorrectStyle &&
                  'border-teal-700 bg-teal-700 text-white ring-0 shadow-md hover:!border-teal-700 hover:!bg-teal-700 dark:border-teal-500 dark:bg-teal-700',
                showWrongStyle &&
                  [
                    strictPracticeCallbacks
                      ? 'border-[3px] border-red-600 bg-red-200 text-red-950 ring-[3px] ring-red-500/75 dark:bg-red-900/85 dark:border-red-300 dark:text-red-50 dark:ring-red-400/50'
                      : 'border-red-500 bg-red-50 text-red-950 hover:!border-red-500 hover:!bg-red-50 dark:border-red-400 dark:bg-red-950/35 dark:text-red-100',
                  ].join(' '),
                showRevealCorrect &&
                  'border-teal-600 bg-teal-50 text-teal-950 ring-1 ring-teal-500/25 dark:border-teal-500 dark:bg-teal-950/35 dark:text-teal-50',
                isSubmitted &&
                  !isSelected &&
                  !isCorrectOption &&
                  'opacity-50',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-current text-xs font-semibold opacity-90">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {optionLabel}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 pb-4">
        {!isSubmitted ? (
          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="rounded-lg bg-neutral-900 px-7 py-2.5 text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400"
          >
            Cevabı gönder
          </button>
        ) : null}
        {isChoiceWrong ? (
          <button
            type="button"
            onClick={handleTryAgain}
            className={
              strictPracticeCallbacks
                ? 'rounded-lg border border-red-600 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50 dark:border-red-400 dark:bg-red-950/40 dark:text-red-100 dark:hover:bg-red-950/70'
                : 'rounded-xl border-2 border-neutral-300 bg-white px-5 py-2.5 text-sm font-bold text-neutral-800 shadow-sm hover:bg-neutral-50 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#ececec] dark:hover:bg-[#383838]'
            }
          >
            {strictPracticeCallbacks ? 'Tekrar dene — başa dön' : 'Tekrar dene'}
          </button>
        ) : null}
      </div>

      {isChoiceCorrect ? (
        <div
          className="mx-3 mb-3 rounded-lg border border-teal-200 bg-teal-50/95 px-4 py-4 text-teal-950 shadow-sm dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-50"
          role="status"
        >
          <p className="text-lg font-semibold tracking-tight text-teal-900 dark:text-teal-100">
            {strictPracticeCallbacks ? 'Doğru — bir adım ileri.' : 'Harika! Doğru cevap.'}
          </p>
          {strictPracticeCallbacks ? null : (
            <p className="mt-2 text-sm font-normal leading-relaxed text-teal-900 dark:text-teal-100/90">
              Şimdi canlı kod görevini doğrula; her iki adım tamamsa “Dersi bitir” ile
              ilerlemeni kaydedebilirsin.
            </p>
          )}
        </div>
      ) : null}

      {isChoiceWrong ? (
        <div
          className={[
            'mx-3 mb-3 rounded-lg border px-4 py-4 shadow-inner',
            strictPracticeCallbacks
              ? 'border-red-600 bg-gradient-to-br from-red-100 to-red-200 text-red-950 dark:from-red-950/70 dark:to-red-900/55 dark:border-red-400 dark:text-red-50'
              : 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100',
          ].join(' ')}
          role="alert"
        >
          {strictPracticeCallbacks ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-red-800 dark:text-red-200">
                Yanlış cevap
              </p>
              <p className="text-base font-semibold leading-snug md:text-lg">
                Bu turda ilerleme durdu; baştan devam etmek için aşağıdaki düğmeyi kullan.
              </p>
              <div className="rounded-lg border border-red-600/55 bg-white/95 px-3 py-3 text-red-950 shadow-inner dark:border-red-500/55 dark:bg-red-950/40 dark:text-red-50">
                <p className="text-xs font-medium text-red-800 dark:text-red-200">
                  Doğru cevap metni (şık olarak)
                </p>
                <p className="mt-2 text-base font-semibold leading-snug">
                  {options[correctAnswerIndex]}
                </p>
              </div>
              <p className="text-sm font-semibold text-red-900/95 dark:text-red-100/90">
                Seçilen şık kırmızı; doğru şıkkın bulunduğu satır yeşille vurgulandı. “Tekrar dene —
                başa dön” ilk soruya döner — burada çıkmayı okuyabileceğin süre boyunca doğruyu
                görebilirsin.
              </p>
            </div>
          ) : (
            <p className="text-sm font-semibold">
              Yanlış — konu metnini bir kez daha tara veya yukarıdaki şıklarla tekrar dene.
            </p>
          )}
        </div>
      ) : null}
      </div>
    </div>
  )
}
