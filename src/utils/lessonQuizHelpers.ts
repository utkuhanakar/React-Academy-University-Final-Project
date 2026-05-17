import type { LessonQuiz } from '../types'

/** Doğru şık dizinini bulur (birebir dize eşitliği). */
export function quizCorrectAnswerIndex(
  choices: readonly string[],
  correctAnswerText: string,
): number {
  return choices.findIndex((choice) => choice === correctAnswerText)
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
