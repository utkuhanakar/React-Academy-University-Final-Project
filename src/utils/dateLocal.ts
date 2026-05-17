/** Tarayıcı yerel takviminde `YYYY-MM-DD` (sıra için güvenli dizge). */
export function localCalendarYmd(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function yesterdayYmd(fromYmd: string): string | null {
  const [y, m, d] = fromYmd.split('-').map(Number)
  if (!y || !m || !d) return null
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() - 1)
  return localCalendarYmd(dt)
}
