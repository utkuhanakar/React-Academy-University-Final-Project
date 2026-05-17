import type { LessonQuiz } from '../types'

/** Doğru şık dizinini bulur (birebir dize eşitliği). */
export function quizCorrectAnswerIndex(
  choices: readonly string[],
  correctAnswerText: string,
): number {
  return choices.findIndex((choice) => choice === correctAnswerText)
}

function hashDjb2(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h, 33) ^ str.charCodeAt(i)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Aynı kapsam anahtarı + şık sayısı için her zaman aynı sırayı döndürür (Fisher–Yates, önceden belirlenmiş rastlantı). */
export function deterministicChoicePermutation(
  scopeKey: string,
  length: number,
): number[] {
  if (length <= 0) return []
  const rand = mulberry32(hashDjb2(`${scopeKey}|n=${length}`))
  const perm = Array.from({ length }, (_, i) => i)
  for (let i = length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    const ti = perm[i]
    const tj = perm[j]
    if (ti === undefined || tj === undefined) continue
    perm[i] = tj
    perm[j] = ti
  }
  return perm
}

/**
 * Arayüzde şık sırasını veri sırasından farklılaştırır; doğru cevap hep metin olarak tutulduğu için
 * doğrulama betikleri değişmeden kalır — yalnızca gösterilen indeks uyumlanır.
 */
export function getShuffledQuizView(
  scopeKey: string,
  choices: readonly string[],
  correctAnswerText: string,
): { displayChoices: string[]; displayCorrectIndex: number } {
  const origIx = quizCorrectAnswerIndex(choices, correctAnswerText)
  const n = choices.length
  if (origIx < 0 || n === 0) {
    return { displayChoices: [...choices], displayCorrectIndex: origIx }
  }
  const perm = deterministicChoicePermutation(scopeKey, n)
  const displayChoices = perm.map((i) => choices[i] ?? '')
  const displayCorrectIndex = perm.indexOf(origIx)
  return { displayChoices, displayCorrectIndex }
}

/** Kart görünümü için uyarı konsolu (yalnızca Vite dev). */
export function resolveLessonQuizCorrectIndex(
  choices: readonly string[],
  correctAnswerText: string,
  lessonTitle: string | undefined,
): number {
  const index = quizCorrectAnswerIndex(choices, correctAnswerText)
  if (
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    Boolean(import.meta.env.DEV) &&
    index < 0
  ) {
    console.warn(
      `[quiz] doğru şık metni eşleşmedi — ders "${lessonTitle ?? '(başlıksız)'}"`,
      correctAnswerText,
      choices,
    )
  }
  return index
}

export function lessonAllQuickChecksResolvable(lesson: {
  quiz: LessonQuiz
  extraQuizChecks?: readonly LessonQuiz[]
}): boolean {
  const all = [lesson.quiz, ...(lesson.extraQuizChecks ?? [])]
  return all.every((q) => lessonHasResolvableQuiz(q))
}

export function lessonHasResolvableQuiz(quiz: {
  choices: readonly string[]
  correctAnswer: string
}): boolean {
  return quizCorrectAnswerIndex(quiz.choices, quiz.correctAnswer) >= 0
}
