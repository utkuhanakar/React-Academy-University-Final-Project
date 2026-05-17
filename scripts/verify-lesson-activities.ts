/**
 * clozeActivity / dragOrderActivity / dragCodeActivity verisi tutarlı mı Kontrolü.
 */

import process from 'node:process'

import { lessons } from '../src/data/lessons.ts'
import { countClozeBlanks } from '../src/utils/clozeHelpers.ts'

let failed = false

function err(msg: string) {
  failed = true
  console.error(msg)
}

function checkDragOrder(where: string, act: NonNullable<(typeof lessons)[0]['dragOrderActivity']>) {
  const ids = new Set(act.items.map((x) => x.id))
  for (const id of act.correctOrderIds) {
    if (!ids.has(id))
      err(`\n[Eksik sıra kimliği] ${where}: correctOrderIds içinde '${id}' items'ta yok.`)
  }
  if (act.correctOrderIds.length !== act.items.length) {
    err(
      `\n[Sıra uzunluğu] ${where}: correctOrderIds (${act.correctOrderIds.length}) ile items (${act.items.length}) eşit olmalı.`,
    )
  }
  const corrSet = new Set(act.correctOrderIds)
  if (corrSet.size !== act.correctOrderIds.length) {
    err(`\n[Tekrarlayan sıra kimliği] ${where}`)
  }
  if (corrSet.size !== ids.size) {
    err(`\n[Sıra kapsayıcılığı] ${where}: items ile correctOrderIds aynı kimlik kümesinde olmalı.`)
    return
  }
  for (const id of ids) {
    if (!corrSet.has(id))
      err(`\n[Eksik doğru sıra] ${where}: items içindeki '${id}' correctOrderIds'te yok.`)
  }
}

function checkDragCode(where: string, act: NonNullable<(typeof lessons)[0]['dragCodeActivity']>) {
  const ids = new Set(act.pieces.map((p) => p.id))
  for (const id of act.correctOrderIds) {
    if (!ids.has(id))
      err(`\n[Eksik parça kimliği] ${where}: '${id}'`)
  }
  if (act.correctOrderIds.length !== act.pieces.length) {
    err(
      `\n[Parça sayısı] ${where}: correctOrderIds (${act.correctOrderIds.length}) !== pieces (${act.pieces.length})`,
    )
  }
  const pieceSet = new Set(act.pieces.map((p) => p.id))
  const corr = new Set(act.correctOrderIds)
  if (corr.size !== act.correctOrderIds.length)
    err(`\n[Tekrarlayan parça sırası] ${where}`)
  if (corr.size !== pieceSet.size) {
    err(`\n[Parça kümesi] ${where}`)
    return
  }
  for (const id of pieceSet) {
    if (!corr.has(id))
      err(`\n[Eksik parça sırası] ${where}: '${id}'`)
  }
}

for (const lesson of lessons) {
  const where = `"${lesson.title}" (${lesson.id})`
  const c = lesson.clozeActivity
  if (c) {
    const n = countClozeBlanks(c.text)
    if (n !== c.blanks.length) {
      err(
        `\n[HATA] cloze boşluğu uyumsuz — ${where}: ___=${n}, blanks[].length=${c.blanks.length}`,
      )
    }
    if (c.wordBank.length < n) {
      err(`\n[HATA] cloze kelime havuzu kısa — ${where}: wordBank=${c.wordBank.length}, boşluk=${n}`)
    }
  }
  if (lesson.dragOrderActivity) checkDragOrder(where, lesson.dragOrderActivity)
  if (lesson.dragCodeActivity) checkDragCode(where, lesson.dragCodeActivity)
}

if (failed) {
  console.error('\nEtkinlik doğrulaması başarısız.\n')
  process.exitCode = 1
} else {
  const nActive = lessons.filter(
    (l) => Boolean(l.clozeActivity || l.dragOrderActivity || l.dragCodeActivity),
  ).length
  console.log(
    `Etkinlik doğrulaması tamam: ${lessons.length} ders (${nActive} aktivite kartı kullanan).`,
  )
}
