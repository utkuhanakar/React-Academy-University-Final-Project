/**
 * Çoklu `_` bloklarını (ör. ____ veya _____) tek boşluğa indirger;
 * sonra `split('___')` ile tutarlı parçalar elde edilir.
 */
export function normalizeClozeText(text: string): string {
  return text.replace(/_{3,}/g, '___')
}

/** `___` ayırıcılarıyla boşluk sayısı (____ biçimi dahil). */
export function countClozeBlanks(text: string): number {
  const normalized = normalizeClozeText(text)
  const parts = normalized.split('___')
  return Math.max(0, parts.length - 1)
}
