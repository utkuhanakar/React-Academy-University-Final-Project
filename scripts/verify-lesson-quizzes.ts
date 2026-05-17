/**
 * Quiz verisinde doğru şık metni choices[] ile birebir eşleşmiyorsa çıkış kodu ≠ 0.
 */

import process from 'node:process'

import { lessons } from '../src/data/lessons.ts'
import { PRACTICE_PATH_STEPS } from '../src/data/practicePath.ts'
import { SKILLS_STUDIO_DRILLS } from '../src/data/skillsStudioDrills.ts'
import { quizCorrectAnswerIndex } from '../src/utils/lessonQuizHelpers.ts'

let failed = false

function dumpChoices(quiz: { choices: readonly string[]; correctAnswer: string }) {
  console.error(`  Beklenen birebir: ${JSON.stringify(quiz.correctAnswer)}`)
  console.error('  Şıklar:')
  quiz.choices.forEach((c, i) => {
    console.error(`    ${i}. ${JSON.stringify(c)}`)
  })
}

for (const lesson of lessons) {
  const checks = [lesson.quiz, ...(lesson.extraQuizChecks ?? [])]
  checks.forEach((quiz, i) => {
    const idx = quizCorrectAnswerIndex(quiz.choices, quiz.correctAnswer)
    if (idx < 0) {
      failed = true
      console.error(
        `\n[HATA] Quiz eşleşmesi bulunamadı — ders "${lesson.title}" (${lesson.id}) · kontrol ${i + 1}`,
      )
      dumpChoices(quiz)
    }
  })
}

for (const step of PRACTICE_PATH_STEPS) {
  const idx = quizCorrectAnswerIndex(step.quiz.choices, step.quiz.correctAnswer)
  if (idx < 0) {
    failed = true
    console.error(`\n[HATA] Alıştırma yolu — ${step.id}`)
    dumpChoices(step.quiz)
  }
}

for (const d of SKILLS_STUDIO_DRILLS) {
  const idx = quizCorrectAnswerIndex(d.quiz.choices, d.quiz.correctAnswer)
  if (idx < 0) {
    failed = true
    console.error(`\n[HATA] Skills Studio drill — ${d.id}`)
    dumpChoices(d.quiz)
  }
}

if (failed) {
  console.error('\nQuiz doğrulaması başarısız.\n')
  process.exitCode = 1
} else {
  console.log(
    `Quiz doğrulaması tamam: ${lessons.length} ders, ${PRACTICE_PATH_STEPS.length} alıştırma yolu, ${SKILLS_STUDIO_DRILLS.length} koç kartı.`,
  )
}
