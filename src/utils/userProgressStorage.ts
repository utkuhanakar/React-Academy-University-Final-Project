import {
  coerceExtendedUserProgress,
  defaultExtendedProgress,
  mergeExtendedUserProgress,
  type ExtendedUserProgressV1,
} from './extendedProgress'

const STORAGE_KEY = 'react-akademi:user-progress-v1'
const LEGACY_COMPLETED_KEY = 'react-akademi:completed-lesson-ids'

/** Eski ders id’leri → güncellenmiş id’ler (içerik yeniden adlandırırsa ilerlemeyi taşımak için). */
const LESSON_IDS_REPLACED: Readonly<Record<string, string>> = {
  'expert-react-final-sinavi': 'expert-todo-buyuk-calismasi',
}

function remapLessonId(id: string): string {
  return LESSON_IDS_REPLACED[id] ?? id
}

export function remapStoredLessonIds(ids: readonly string[]): string[] {
  return [...new Set(ids.map(remapLessonId))]
}

export function remapStoredLastLessonId(
  lastId: string | null | undefined,
): string | null {
  if (!lastId) return null
  return remapLessonId(lastId)
}

/** Tam uygulama ilerlemesi: dersler + alıştırma yolu vb. */
export type AppUserProgress = {
  version: 2
  completedLessonIds: readonly string[]
  lastLessonId: string | null
  extended: ExtendedUserProgressV1
}

const emptyProgress = (): AppUserProgress => ({
  version: 2,
  completedLessonIds: [],
  lastLessonId: null,
  extended: defaultExtendedProgress(),
})

function parseStoredProgress(raw: string | null): AppUserProgress | null {
  if (!raw) return null
  try {
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return null
    const ver = (data as { version?: unknown }).version
    const obj = data as {
      completedLessonIds?: unknown
      lastLessonId?: unknown
      extended?: unknown
    }
    const ids = Array.isArray(obj.completedLessonIds)
      ? obj.completedLessonIds.filter((x): x is string => typeof x === 'string')
      : []
    const last = typeof obj.lastLessonId === 'string' ? obj.lastLessonId : null

    if (ver === 2) {
      return {
        version: 2,
        completedLessonIds: ids,
        lastLessonId: last,
        extended: coerceExtendedUserProgress(obj.extended),
      }
    }

    if (ver === 1) {
      return {
        version: 2,
        completedLessonIds: ids,
        lastLessonId: last,
        extended: defaultExtendedProgress(),
      }
    }

    return null
  } catch {
    return null
  }
}

/** Müfredatta tanımlı id’leri koruyarak sıralar ve tekillik uygular. */
export function sortLessonIdsByCurriculum(
  ids: readonly string[],
  curriculumOrder: readonly string[],
): string[] {
  const idx = new Map(curriculumOrder.map((id, i) => [id, i]))
  return [...new Set(ids)].sort((a, b) => {
    const ia = idx.get(a) ?? Infinity
    const ib = idx.get(b) ?? Infinity
    return ia - ib
  })
}

/** Geçersiz veya eksik seçim için müfredatın ilk üyesini döner. */
export function normalizeLastLessonId(
  lastId: string | null | undefined,
  curriculumOrder: readonly string[],
): string | null {
  if (!curriculumOrder.length) return null
  if (lastId && curriculumOrder.includes(lastId)) return lastId
  return curriculumOrder[0] ?? null
}

function readLegacyCompletedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const legacyRaw = window.localStorage.getItem(LEGACY_COMPLETED_KEY)
    if (!legacyRaw) return []
    const legacyParsed: unknown = JSON.parse(legacyRaw)
    if (!Array.isArray(legacyParsed)) return []
    const filtered = legacyParsed.filter(
      (item): item is string => typeof item === 'string',
    )
    window.localStorage.removeItem(LEGACY_COMPLETED_KEY)
    return filtered
  } catch {
    return []
  }
}

/** Yerel saklamayı okur; eski tek anahtar formatını gerektiğinde taşır. */
export function readLocalUserProgress(
  curriculumOrder: readonly string[],
): AppUserProgress {
  if (typeof window === 'undefined') return emptyProgress()
  try {
    const decoded = parseStoredProgress(window.localStorage.getItem(STORAGE_KEY))

    let completed: string[] = []
    let lastId: string | null = null
    let extended = defaultExtendedProgress()

    if (decoded) {
      completed = [...decoded.completedLessonIds]
      lastId = decoded.lastLessonId
      extended = coerceExtendedUserProgress(decoded.extended)
    } else {
      completed = readLegacyCompletedIds()
    }

    completed = remapStoredLessonIds(completed)
    lastId = remapStoredLastLessonId(lastId)

    const sorted = sortLessonIdsByCurriculum(completed, curriculumOrder)
    const normalizedLast = normalizeLastLessonId(lastId, curriculumOrder)

    const next: AppUserProgress = {
      version: 2,
      completedLessonIds: sorted,
      lastLessonId: normalizedLast,
      extended,
    }

    try {
      const storedJson = window.localStorage.getItem(STORAGE_KEY)
      const nextJson = JSON.stringify({
        version: 2,
        completedLessonIds: sorted,
        lastLessonId: normalizedLast,
        extended,
      })
      if (!decoded || storedJson !== nextJson) writeLocalUserProgress(next)
    } catch {
      writeLocalUserProgress(next)
    }
    return next
  } catch {
    return emptyProgress()
  }
}

export function writeLocalUserProgress(progress: AppUserProgress): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2 as const,
        completedLessonIds: [...progress.completedLessonIds],
        lastLessonId: progress.lastLessonId,
        extended: progress.extended,
      }),
    )
  } catch {
    /* kotası / gizli mod vb. */
  }
}

/** Uzaktan gelen uzantı ile birleştirilmiş ders kimlikleri güncellenirken extended kullanılır. */
export function mergeAppProgressRemote(
  local: AppUserProgress,
  extendedFromRemote: ExtendedUserProgressV1 | null,
): AppUserProgress {
  if (!extendedFromRemote)
    return {
      ...local,
      extended: coerceExtendedUserProgress(local.extended),
    }
  const mergedExtended = mergeExtendedUserProgress(
    coerceExtendedUserProgress(local.extended),
    coerceExtendedUserProgress(extendedFromRemote),
  )
  return { ...local, extended: mergedExtended }
}
