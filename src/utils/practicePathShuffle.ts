import type { PracticePathStep } from '../data/practicePath'

export type PracticePathTier = 1 | 2 | 3

/** Orijinal sıra indeksine göre kabaca kolay → orta → zor böler. */
export function tierFromIndex(index: number, total: number): PracticePathTier {
  if (total <= 0) return 2
  const t = index / total
  if (t < 1 / 3) return 1
  if (t < 2 / 3) return 2
  return 3
}

/** Basit yayılma ile id → sayı — tarayıcılar arasında stabildir */
function spillHash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
    h >>>= 0
  }
  return h >>> 0
}

function shuffleInPlaceIds(ids: string[]): void {
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j]!, ids[i]!]
  }
}

/** Aynı çokluğa sahip permutation mı? */
export function isValidPathOrder(
  order: readonly string[] | null | undefined,
  canonical: readonly string[],
): boolean {
  if (!order || order.length !== canonical.length) return false
  const set = new Set(canonical)
  if (order.some((id) => !set.has(id))) return false
  return new Set(order).size === canonical.length
}

/**
 * Her zorluk seviyesi içinde karıştırıp round-robin ile harmanlar;
 * kolay/orta/zor yol boyunca karışık ama dengeli dağılır.
 */
function tierBuckets(steps: readonly PracticePathStep[]): Record<
  PracticePathTier,
  string[]
> {
  const total = steps.length
  const byTier: Record<PracticePathTier, string[]> = { 1: [], 2: [], 3: [] }
  steps.forEach((s, i) => {
    byTier[tierFromIndex(i, total)].push(s.id)
  })
  return byTier
}

function interleaveTiersRoundRobin(
  byTier: Record<PracticePathTier, string[]>,
  total: number,
): string[] {
  const out: string[] = []
  let guard = 0
  while (
    byTier[1].length > 0 ||
    byTier[2].length > 0 ||
    byTier[3].length > 0
  ) {
    guard += 1
    if (guard > total + 50) break
    for (const tier of [1, 2, 3] as const) {
      const next = byTier[tier].shift()
      if (next) out.push(next)
    }
  }
  return out
}

/** Her oturumda aynı — kalıcı sıra yokken ilk çerçevede tutarlı tur. */
export function buildStableMixedPracticePathOrder(
  steps: readonly PracticePathStep[],
): string[] {
  const byTier = tierBuckets(steps)
  for (const tier of [1, 2, 3] as const) {
    byTier[tier].sort((a, b) => spillHash(a) - spillHash(b))
  }
  return interleaveTiersRoundRobin(byTier, steps.length)
}

/** Rastgele tur (kullanıcı “yeniden karıştır” ile). */
export function buildRandomMixedPracticePathOrder(
  steps: readonly PracticePathStep[],
): string[] {
  const byTier = tierBuckets(steps)
  shuffleInPlaceIds(byTier[1])
  shuffleInPlaceIds(byTier[2])
  shuffleInPlaceIds(byTier[3])
  return interleaveTiersRoundRobin(byTier, steps.length)
}

export function buildMixedPracticePathOrder(
  steps: readonly PracticePathStep[],
): string[] {
  return buildRandomMixedPracticePathOrder(steps)
}

export function resolvePracticePathOrder(
  stored: readonly string[] | null | undefined,
  canonical: readonly string[],
  steps: readonly PracticePathStep[],
): string[] {
  if (isValidPathOrder(stored, canonical) && stored) return [...stored]
  return buildStableMixedPracticePathOrder(steps)
}
