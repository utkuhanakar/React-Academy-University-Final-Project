import { localCalendarYmd, yesterdayYmd } from './dateLocal'

export type EngagementPersistedV1 = {
  dailyStreakCount: number
  lastStreakContributionDateLocal: string | null
}

export function defaultEngagement(): EngagementPersistedV1 {
  return { dailyStreakCount: 0, lastStreakContributionDateLocal: null }
}

/** İlk doğru aktivite ödülü için: az önce doğru yapılmışsa yeniden sıfırdan sıra artmaz — yalnızca yeni güne sıçrada artar veya sıfırlar. */
export function recordDailyEngagementIfNewDay(
  prev: EngagementPersistedV1 | undefined,
): EngagementPersistedV1 {
  const today = localCalendarYmd()
  const p = prev ?? defaultEngagement()
  if (p.lastStreakContributionDateLocal === today) {
    return p
  }

  let nextCount = 1
  const yest = yesterdayYmd(today)
  if (
    p.lastStreakContributionDateLocal &&
    yest &&
    p.lastStreakContributionDateLocal === yest
  ) {
    nextCount = p.dailyStreakCount + 1
  }

  return {
    dailyStreakCount: Math.max(nextCount, 1),
    lastStreakContributionDateLocal: today,
  }
}

export function mergeEngagement(
  local: EngagementPersistedV1 | undefined,
  remote: EngagementPersistedV1 | undefined,
): EngagementPersistedV1 | undefined {
  if (!local && !remote) return undefined
  if (!local) return remote
  if (!remote) return local
  if (local.dailyStreakCount >= remote.dailyStreakCount) return local
  return remote
}
