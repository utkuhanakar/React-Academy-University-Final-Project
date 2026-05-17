/**
 * Ders Markdown’undan H2 çıkış planı ve tahmini okuma süresi (içindekiler + anchor’lar için).
 */

export interface LessonH2Anchor {
  /** HTML id (`#slug`) */
  id: string
  /** Arama/tıklama için kısaltılmış başlık metni */
  label: string
}

/** Markdown gövdesindeki `##` satırlarının işlenmemiş içeriği (satır kodları dahil). */
export function listRawLessonH2Bodies(md: string): string[] {
  const out: string[] = []
  for (const raw of md.split(/\r?\n/)) {
    const t = raw.trimStart()
    if (t.startsWith('## ') && !t.startsWith('###')) {
      out.push(t.slice(3).trimEnd())
    }
  }
  return out
}

/** Liste / içindekiler satırında göstermek: satır içi kod ve güçlü vurguyu düz metne çevir. */
export function normalizeLessonHeadingLabel(rawBody: string): string {
  let s = rawBody.trim()
  s = s.replace(/`([^`]+)`/g, '$1')
  s = s.replace(/\*\*([\s\S]+?)\*\*/g, '$1')
  s = s.replace(/\*([^*\n]+)\*/g, '$1')
  return s.replace(/\s+/g, ' ').trim()
}

export function slugifyLessonFragment(label: string): string {
  const base = normalizeLessonHeadingLabel(label)
    .toLocaleLowerCase('tr-TR')
    .replace(/\s+/g, ' ')
    .trim()

  let s = base
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')

  s = s
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return s.length > 0 ? s : 'bolum'
}

export function precomputeLessonH2Anchors(md: string): LessonH2Anchor[] {
  const bodies = listRawLessonH2Bodies(md)
  const slugCounts = new Map<string, number>()
  const out: LessonH2Anchor[] = []

  for (const body of bodies) {
    const label = normalizeLessonHeadingLabel(body)
    const frag = slugifyLessonFragment(label)
    const next = (slugCounts.get(frag) ?? 0) + 1
    slugCounts.set(frag, next)
    const id = next === 1 ? frag : `${frag}-${next}`
    out.push({ id, label })
  }

  return out
}

/**
 * Yaklaşık okuma süresi (dk). Gövdedeki kod bloklarını daha hafif sayar (göz süresi daha kısa).
 */
export function estimateLessonReadMinutes(
  markdown: string,
  codeBodies: readonly string[],
): number {
  const noFences = markdown.replace(/```[\s\S]*?```/gm, ' ')
  const bodyWords = noFences.split(/\s+/).filter(Boolean).length
  const codeWords = codeBodies.join('\n').split(/\s+/).filter(Boolean).length
  /** Kod satırı okuması daha yavaş; katsayı konservatif. */
  const effective = bodyWords + Math.round(codeWords * 0.35)
  /** Türkçe teknik metin için biraz düşük WPM varsayımı. */
  const wpm = 175
  return Math.max(1, Math.ceil(effective / wpm))
}
