import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import {
  getSupabaseClient,
  isCloudSyncConfigured,
  type LearningProgressRow,
} from '../supabase/client'
import type { SkillsStudioTabId } from '../utils/extendedProgress'
import {
  coerceExtendedUserProgress,
  extendedProgressToDbJson,
  extendedWithEngagementTouch,
  type ExtendedUserProgressV1,
} from '../utils/extendedProgress'
import type { AppUserProgress } from '../utils/userProgressStorage'
import {
  mergeAppProgressRemote,
  normalizeLastLessonId,
  readLocalUserProgress,
  remapStoredLastLessonId,
  remapStoredLessonIds,
  sortLessonIdsByCurriculum,
  writeLocalUserProgress,
} from '../utils/userProgressStorage'

const REMOTE_DEBOUNCE_MS = 700

function uniqMergeLessonIds(
  a: readonly string[],
  b: readonly string[],
  curriculumOrder: readonly string[],
): string[] {
  return sortLessonIdsByCurriculum([...new Set([...a, ...b])], curriculumOrder)
}

function pickMergedLastLessonId(
  remote: string | null,
  local: string | null,
  curriculumOrder: readonly string[],
): string | null {
  const ir =
    remote && curriculumOrder.includes(remote)
      ? curriculumOrder.indexOf(remote)
      : -1
  const il =
    local && curriculumOrder.includes(local)
      ? curriculumOrder.indexOf(local)
      : -1
  if (ir > il) return remote
  if (il > ir) return local
  return remote ?? local ?? null
}

async function fetchProgressRow(userId: string) {
  const client = getSupabaseClient()
  if (!client) return { data: null, error: null }
  return client
    .from('learning_progress')
    .select('user_id, completed_lesson_ids, last_lesson_id, extended_progress')
    .eq('user_id', userId)
    .maybeSingle()
}

async function upsertProgressRow(progress: LearningProgressRow) {
  const client = getSupabaseClient()
  if (!client)
    return { error: new Error('Supabase istemcisi oluşturulamadı.') }
  const row = {
    user_id: progress.user_id,
    completed_lesson_ids: [...progress.completed_lesson_ids],
    last_lesson_id: progress.last_lesson_id,
    extended_progress: progress.extended_progress ?? {},
    updated_at: new Date().toISOString(),
  }
  const { error } = await client.from('learning_progress').upsert(row, {
    onConflict: 'user_id',
  })
  return { error }
}

/** Uygulama genel müfredatı ile bulut / yerel ilerlemenin bağlanması. */
export function useSyncedLearningProgress(
  curriculumLessonIds: readonly string[],
) {
  const orderRef = useRef(curriculumLessonIds)
  const remoteTimerRef = useRef<number | undefined>(undefined)
  const sessionRef = useRef<Session | null>(null)

  useEffect(() => {
    orderRef.current = curriculumLessonIds
  }, [curriculumLessonIds])

  const [progress, setProgress] = useState<AppUserProgress>(() =>
    typeof window !== 'undefined'
      ? readLocalUserProgress(curriculumLessonIds)
      : {
          version: 2,
          completedLessonIds: [],
          lastLessonId: curriculumLessonIds[0] ?? null,
          extended: coerceExtendedUserProgress(undefined),
        },
  )
  const [hydrated, setHydrated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [cloudSessionActive, setCloudSessionActive] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const flushRemoteDebounced = useCallback((snapshot: AppUserProgress) => {
    window.clearTimeout(remoteTimerRef.current)
    remoteTimerRef.current = window.setTimeout(async () => {
      const client = getSupabaseClient()
      const session = sessionRef.current
      if (!client || !session?.user.id) return
      const { error } = await upsertProgressRow({
        user_id: session.user.id,
        completed_lesson_ids: [...snapshot.completedLessonIds],
        last_lesson_id: snapshot.lastLessonId,
        extended_progress: extendedProgressToDbJson(
          coerceExtendedUserProgress(snapshot.extended),
        ),
      })
      if (error) setSyncError(String(error.message))
      else setSyncError(null)
    }, REMOTE_DEBOUNCE_MS)
  }, [])

  /** Oturuma göre yükle/kaydet; sık aksiyonda debounced. */
  const pushRemoteImmediate = useCallback(async (snapshot: AppUserProgress) => {
    const client = getSupabaseClient()
    const session = sessionRef.current
    if (!client || !session?.user.id) return
    window.clearTimeout(remoteTimerRef.current)
    const { error } = await upsertProgressRow({
      user_id: session.user.id,
      completed_lesson_ids: [...snapshot.completedLessonIds],
      last_lesson_id: snapshot.lastLessonId,
      extended_progress: extendedProgressToDbJson(
        coerceExtendedUserProgress(snapshot.extended),
      ),
    })
    if (error) setSyncError(String(error.message))
    else setSyncError(null)
  }, [])

  /** Oturuma göre yerel ile bulutu birleştirir ve state’i günceller. */
  const applySession = useCallback(
    async (session: Session | null) => {
      sessionRef.current = session
      setUserEmail(session?.user.email ?? null)
      setCloudSessionActive(Boolean(session?.user?.id))

      const curriculum = orderRef.current
      const localSnap = readLocalUserProgress(curriculum)

      if (!session?.user.id) {
        setProgress(localSnap)
        writeLocalUserProgress(localSnap)
        setSyncError(null)
        return
      }

      let mergedCompleted = [...localSnap.completedLessonIds]
      let mergedLastRaw: string | null = localSnap.lastLessonId

      const { data: remoteRow, error: remoteReadError } = await fetchProgressRow(
        session.user.id,
      )
      if (remoteReadError) {
        const msg = remoteReadError.message
        setSyncError(msg ?? 'Uzaktaki ilerleme okunamadı.')
      } else setSyncError(null)

      const remoteCompleted = remoteRow?.completed_lesson_ids
      let remoteExtended: ExtendedUserProgressV1 | null = null
      if (
        remoteRow &&
        'extended_progress' in remoteRow &&
        remoteRow.extended_progress != null &&
        typeof remoteRow.extended_progress === 'object'
      ) {
        remoteExtended = coerceExtendedUserProgress(remoteRow.extended_progress)
      }

      if (
        remoteRow &&
        remoteCompleted &&
        Array.isArray(remoteCompleted) &&
        remoteCompleted.every((x) => typeof x === 'string')
      ) {
        mergedCompleted = uniqMergeLessonIds(
          remoteCompleted,
          localSnap.completedLessonIds,
          curriculum,
        )
        mergedLastRaw = pickMergedLastLessonId(
          remoteRow.last_lesson_id ?? null,
          localSnap.lastLessonId ?? null,
          curriculum,
        )
      }

      mergedCompleted = remapStoredLessonIds(mergedCompleted)
      mergedLastRaw = remapStoredLastLessonId(mergedLastRaw)

      const mergedLast = normalizeLastLessonId(mergedLastRaw, curriculum)
      let next: AppUserProgress = {
        version: 2,
        completedLessonIds: mergedCompleted,
        lastLessonId: mergedLast,
        extended: coerceExtendedUserProgress(localSnap.extended),
      }
      next = mergeAppProgressRemote(next, remoteExtended)
      writeLocalUserProgress(next)
      setProgress(next)
      await pushRemoteImmediate(next)
    },
    [pushRemoteImmediate],
  )

  useEffect(() => {
    const client = getSupabaseClient()

    if (!client) {
      queueMicrotask(() => {
        setHydrated(true)
      })
      return () => {
        window.clearTimeout(remoteTimerRef.current)
      }
    }

    let cancelled = false
    const supabaseClient = client

    async function bootstrap() {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession()
        if (!cancelled) await applySession(session)
      } finally {
        if (!cancelled) setHydrated(true)
      }
    }

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      void applySession(session)
    })

    void bootstrap()

    return () => {
      cancelled = true
      subscription.unsubscribe()
      window.clearTimeout(remoteTimerRef.current)
    }
  }, [applySession, curriculumLessonIds])

  const updateProgressAndPersist = useCallback(
    (updater: (prev: AppUserProgress) => AppUserProgress) => {
      setProgress((prev) => {
        const next = updater(prev)
        const normalized: AppUserProgress = {
          ...next,
          extended: coerceExtendedUserProgress(next.extended),
        }
        writeLocalUserProgress(normalized)
        if (sessionRef.current?.user?.id) flushRemoteDebounced(normalized)
        return normalized
      })
      setSyncError(null)
    },
    [flushRemoteDebounced],
  )

  const setLastLessonId = useCallback(
    (lessonId: string) => {
      const curriculum = orderRef.current
      if (!curriculum.includes(lessonId)) return
      updateProgressAndPersist((prev) => ({
        ...prev,
        lastLessonId: lessonId,
      }))
    },
    [updateProgressAndPersist],
  )

  const markLessonCompleted = useCallback(
    (lessonId: string) => {
      const curriculum = orderRef.current
      updateProgressAndPersist((prev) => {
        if (prev.completedLessonIds.includes(lessonId)) return prev
        const nc = sortLessonIdsByCurriculum(
          [...prev.completedLessonIds, lessonId],
          curriculum,
        )
        return {
          ...prev,
          completedLessonIds: nc,
          extended: extendedWithEngagementTouch(prev.extended),
        }
      })
    },
    [updateProgressAndPersist],
  )

  const updateExtended = useCallback(
    (updater: (e: ExtendedUserProgressV1) => ExtendedUserProgressV1) => {
      updateProgressAndPersist((prev) => ({
        ...prev,
        extended: coerceExtendedUserProgress(updater(prev.extended)),
      }))
    },
    [updateProgressAndPersist],
  )

  const setSkillsStudioTab = useCallback(
    (tab: SkillsStudioTabId) => {
      updateExtended((ext) => ({ ...ext, skillsLastTab: tab }))
    },
    [updateExtended],
  )

  const requestEmailOtp = useCallback(async (email: string) => {
    const client = getSupabaseClient()
    if (!client) return { ok: false as const, message: 'Supabase yapılandırılmamış.' }

    const normalized = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalized))
      return { ok: false as const, message: 'Geçerli bir e-posta girin.' }

    const { error } = await client.auth.signInWithOtp({
      email: normalized,
      options: { shouldCreateUser: true },
    })
    if (error) return { ok: false as const, message: error.message }

    return { ok: true as const, message: 'Kodu e-postandan alıp aşağıya yapıştırın.' }
  }, [])

  const verifyEmailOtp = useCallback(async (email: string, token: string) => {
    const client = getSupabaseClient()
    if (!client) return { ok: false as const, message: 'Supabase yapılandırılmamış.' }

    const clean = token.replace(/\s/g, '').replace(/,/g, '')
    if (!clean) return { ok: false as const, message: 'Onay kodu gerekli.' }

    const { error } = await client.auth.verifyOtp({
      type: 'email',
      token: clean,
      email: email.trim().toLowerCase(),
    })
    if (error) return { ok: false as const, message: error.message }
    setSyncError(null)
    return { ok: true as const, message: 'Giriş başarılı; ilerleme kaydedildi.' }
  }, [])

  const signOutCloud = useCallback(async () => {
    const client = getSupabaseClient()
    sessionRef.current = null
    if (client) await client.auth.signOut()
    const localSnap = readLocalUserProgress(orderRef.current)
    setProgress(localSnap)
    setCloudSessionActive(false)
    setUserEmail(null)
    setHydrated(true)
    setSyncError(null)
  }, [])

  return {
    hydrated,
    cloudConfigured: isCloudSyncConfigured(),
    cloudSessionActive,
    syncError,
    completedLessonIds: [...progress.completedLessonIds],
    lastLessonId:
      normalizeLastLessonId(progress.lastLessonId, curriculumLessonIds) ??
      curriculumLessonIds[0] ??
      '',
    extended: progress.extended,
    setLastLessonId,
    markLessonCompleted,
    updateExtended,
    setSkillsStudioTab,
    requestEmailOtp,
    verifyEmailOtp,
    signOutCloud,
    userEmail,
  }
}
