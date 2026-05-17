import { PRACTICE_PATH_STEP_IDS } from '../data/practicePath'
import { isValidPathOrder } from './practicePathShuffle'
import {
  defaultEngagement,
  mergeEngagement,
  recordDailyEngagementIfNewDay,
  type EngagementPersistedV1,
} from './engagementStreak'

export type SkillsStudioTabId = 'drills' | 'reference' | 'path'

export type PathPreferencesPersistedV1 = {
  timedModeEnabled: boolean
  secondsPerQuestion: number
}

export type PracticePathPersistedV1 = {
  /** Aktif çalışmada sıradaki adım dizini; yanlış cevapta sıfırlanır */
  cursor: number
  /** Tek oturumda (yanlış yapmadan) ulaşılan en uzak adım */
  bestUnbrokenEver: number
  /** Yanlış cevap sonrası yolun başına dönme sayısı */
  lifetimeWrongResets: number
  /** Tüm rotayı yanlışsız tamamlama sayısı */
  fullPathClears: number
  /**
   * Mevcut PRACTICE_PATH_STEP_IDS için tam bir permütasyon kaydı.
   * Eksik / geçersizse bileşen belirleyici karışımı oluşturur ve senkronda yazar.
   */
  orderedStepIds?: readonly string[]
  /** Zamanlı mod açıkken kusursuz tamamlanan tam tur sayısı */
  timedFullPathClears?: number
}

export type ExtendedUserProgressV1 = {
  version: 1
  practicePath: PracticePathPersistedV1
  engagement?: EngagementPersistedV1
  pathPreferences?: PathPreferencesPersistedV1
  skillsLastTab?: SkillsStudioTabId
}

const DEFAULT_SECONDS = 40

export function defaultPathPreferences(): PathPreferencesPersistedV1 {
  return { timedModeEnabled: false, secondsPerQuestion: DEFAULT_SECONDS }
}

export function defaultExtendedProgress(): ExtendedUserProgressV1 {
  return {
    version: 1,
    practicePath: {
      cursor: 0,
      bestUnbrokenEver: 0,
      lifetimeWrongResets: 0,
      fullPathClears: 0,
    },
    engagement: defaultEngagement(),
    pathPreferences: defaultPathPreferences(),
  }
}

function pickPracticePathOrderedIdsMerge(
  local: PracticePathPersistedV1,
  remote: PracticePathPersistedV1,
): readonly string[] | undefined {
  const lo = local.orderedStepIds
  const ro = remote.orderedStepIds
  if (isValidPathOrder(lo, PRACTICE_PATH_STEP_IDS)) return lo
  if (isValidPathOrder(ro, PRACTICE_PATH_STEP_IDS)) return ro
  return undefined
}

function coerceEngagement(raw: unknown): EngagementPersistedV1 | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined
  const o = raw as Record<string, unknown>
  const sc = Number(o.dailyStreakCount)
  const last = o.lastStreakContributionDateLocal
  if (!Number.isFinite(sc) || sc < 0) return undefined
  if (typeof last !== 'string' && last !== null) return undefined
  const dateOk =
    last === null || /^\d{4}-\d{2}-\d{2}$/.test(last)
  if (!dateOk) return undefined
  return {
    dailyStreakCount: Math.floor(sc),
    lastStreakContributionDateLocal: last,
  }
}

function coercePathPrefs(raw: unknown): PathPreferencesPersistedV1 | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined
  const o = raw as Record<string, unknown>
  const te = o.timedModeEnabled
  const sp = Number(o.secondsPerQuestion)
  if (typeof te !== 'boolean') return undefined
  const secs =
    Number.isFinite(sp) && sp >= 15 && sp <= 180 ? Math.floor(sp) : DEFAULT_SECONDS
  return { timedModeEnabled: te, secondsPerQuestion: secs }
}

export function coerceExtendedUserProgress(raw: unknown): ExtendedUserProgressV1 {
  const base = defaultExtendedProgress()
  if (typeof raw !== 'object' || raw === null) return base
  const o = raw as Record<string, unknown>
  const pp = o.practicePath
  if (typeof pp !== 'object' || pp === null) return base
  const p = pp as Record<string, unknown>
  const ri = Number(p.cursor)
  const rb = Number(p.bestUnbrokenEver)
  const rl = Number(p.lifetimeWrongResets)
  const rf = Number(p.fullPathClears)

  let orderedRaw: readonly string[] | undefined
  if (Array.isArray(p.orderedStepIds)) {
    const ids = p.orderedStepIds.filter(
      (x): x is string => typeof x === 'string',
    )
    orderedRaw = isValidPathOrder(ids, PRACTICE_PATH_STEP_IDS) ? ids : undefined
  }

  let timedClears = Number(p.timedFullPathClears)
  timedClears =
    Number.isFinite(timedClears) && timedClears >= 0 ? Math.floor(timedClears) : 0

  const rawTab = o.skillsLastTab
  let tab: SkillsStudioTabId | undefined
  if (
    rawTab === 'drills' ||
    rawTab === 'reference' ||
    rawTab === 'path'
  ) {
    tab = rawTab
  }

  const engagement = coerceEngagement(o.engagement) ?? base.engagement
  const pathPreferences = coercePathPrefs(o.pathPreferences) ?? base.pathPreferences

  const pathLen = PRACTICE_PATH_STEP_IDS.length
  const maxCursor = pathLen === 0 ? 0 : Math.max(0, pathLen - 1)
  const clampCursor = (x: number) =>
    pathLen === 0 ? 0 : Math.min(Math.max(0, Math.floor(x)), maxCursor)
  const clampBestUnbroken = (x: number) =>
    Math.min(Math.max(0, Math.floor(x)), pathLen)

  const cursor =
    Number.isFinite(ri) && ri >= 0 ? clampCursor(ri) : base.practicePath.cursor
  let bestUnbrokenEver =
    Number.isFinite(rb) && rb >= 0
      ? clampBestUnbroken(rb)
      : base.practicePath.bestUnbrokenEver
  bestUnbrokenEver = Math.min(bestUnbrokenEver, pathLen)

  return {
    version: 1,
    practicePath: {
      cursor,
      bestUnbrokenEver,
      lifetimeWrongResets:
        Number.isFinite(rl) && rl >= 0 ? Math.floor(rl) : base.practicePath.lifetimeWrongResets,
      fullPathClears:
        Number.isFinite(rf) && rf >= 0 ? Math.floor(rf) : base.practicePath.fullPathClears,
      ...(orderedRaw && orderedRaw.length === pathLen
        ? { orderedStepIds: orderedRaw }
        : {}),
      ...(timedClears > 0 ? { timedFullPathClears: timedClears } : {}),
    },
    engagement,
    pathPreferences,
    skillsLastTab: tab,
  }
}

export function mergeExtendedUserProgress(
  local: ExtendedUserProgressV1,
  remote: ExtendedUserProgressV1,
): ExtendedUserProgressV1 {
  const l = local.practicePath
  const r = remote.practicePath
  const rawTab = local.skillsLastTab ?? remote.skillsLastTab
  let tab: SkillsStudioTabId | undefined
  if (rawTab === 'drills' || rawTab === 'reference' || rawTab === 'path') {
    tab = rawTab
  }
  const ordered = pickPracticePathOrderedIdsMerge(l, r)

  const pathLen = PRACTICE_PATH_STEP_IDS.length
  const maxCursor = pathLen === 0 ? 0 : Math.max(0, pathLen - 1)
  const clampCursor = (x: number) =>
    pathLen === 0 ? 0 : Math.min(Math.max(0, Math.floor(x)), maxCursor)

  const mergedTimed = Math.max(
    Number(l.timedFullPathClears ?? 0),
    Number(r.timedFullPathClears ?? 0),
  )

  /** Aynı cihazdaki seçimleri korumak için uzaktaki varsayılanlar + yerel üstünde yazma. */
  const lp = local.pathPreferences
  const rp = remote.pathPreferences
  const prefs =
    lp && rp ? { ...rp, ...lp } : lp ?? rp ?? defaultPathPreferences()

  return {
    version: 1,
    practicePath: {
      cursor: clampCursor(l.cursor),
      bestUnbrokenEver: Math.min(
        Math.max(l.bestUnbrokenEver, r.bestUnbrokenEver),
        pathLen,
      ),
      lifetimeWrongResets: Math.max(l.lifetimeWrongResets, r.lifetimeWrongResets),
      fullPathClears: Math.max(l.fullPathClears, r.fullPathClears),
      ...(ordered?.length === pathLen ? { orderedStepIds: ordered } : {}),
      ...(mergedTimed > 0 ? { timedFullPathClears: mergedTimed } : {}),
    },
    engagement: mergeEngagement(local.engagement, remote.engagement),
    pathPreferences: prefs,
    skillsLastTab: tab,
  }
}

/** Ders tamamlandı veya peş peşe yolda doğru → günlük seri (aynı gün tekrarsız artış). */
export function extendedWithEngagementTouch(
  ext: ExtendedUserProgressV1,
): ExtendedUserProgressV1 {
  return {
    ...ext,
    engagement: recordDailyEngagementIfNewDay(ext.engagement),
  }
}

export function extendedProgressToDbJson(ext: ExtendedUserProgressV1): Record<string, unknown> {
  const pp = ext.practicePath
  return {
    practicePath: {
      cursor: pp.cursor,
      bestUnbrokenEver: pp.bestUnbrokenEver,
      lifetimeWrongResets: pp.lifetimeWrongResets,
      fullPathClears: pp.fullPathClears,
      ...(pp.orderedStepIds ? { orderedStepIds: [...pp.orderedStepIds] } : {}),
      ...(pp.timedFullPathClears != null && pp.timedFullPathClears > 0
        ? { timedFullPathClears: pp.timedFullPathClears }
        : {}),
    },
    ...(ext.engagement ? { engagement: { ...ext.engagement } } : {}),
    ...(ext.pathPreferences ? { pathPreferences: { ...ext.pathPreferences } } : {}),
    skillsLastTab: ext.skillsLastTab,
  }
}
