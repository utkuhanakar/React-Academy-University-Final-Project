import type { FormEvent } from 'react'
import { useCallback, useState } from 'react'

export interface CloudSyncPanelProps {
  /** Supabase ortam anahtarları tanımlandıysa true. */
  cloudConfigured: boolean
  hydrated: boolean
  cloudSessionActive: boolean
  userEmail: string | null
  syncError: string | null
  requestEmailOtp: (email: string) => Promise<{ ok: boolean; message: string }>
  verifyEmailOtp: (
    email: string,
    token: string,
  ) => Promise<{ ok: boolean; message: string }>
  signOutCloud: () => Promise<void>
}

export default function CloudSyncPanel({
  cloudConfigured,
  hydrated,
  cloudSessionActive,
  userEmail,
  syncError,
  requestEmailOtp,
  verifyEmailOtp,
  signOutCloud,
}: CloudSyncPanelProps) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [formMessage, setFormMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleSend = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      setBusy(true)
      setFormMessage(null)
      const res = await requestEmailOtp(email)
      setFormMessage(res.message)
      setBusy(false)
    },
    [email, requestEmailOtp],
  )

  const handleVerify = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      setBusy(true)
      setFormMessage(null)
      const res = await verifyEmailOtp(email, code)
      setFormMessage(res.message)
      setBusy(false)
    },
    [code, email, verifyEmailOtp],
  )

  const handleLogout = useCallback(async () => {
    setBusy(true)
    await signOutCloud()
    setFormMessage('Çıkış yapıldı; kayıtlarınız tarayıcıda duruyor.')
    setBusy(false)
  }, [signOutCloud])

  return (
    <section
      className="mx-auto w-full max-w-6xl border-t border-neutral-200 bg-neutral-50/95 px-5 py-6 print:hidden dark:border-[#3c3c3c] dark:bg-[#181818]"
      aria-labelledby="cloud-sync-heading"
    >
      <h2
        id="cloud-sync-heading"
        className="mb-4 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-[#bdbdbd]"
      >
        Hesap ile ilerleme kaydı
      </h2>
      {!cloudConfigured ? (
        <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-[#cfcfcf]">
          Hesap oluşturmazsanız ilerlemeniz yalnızca bu tarayıcıda saklanır. Projede Supabase
          yapılandırıldığında aynı e‑posta adresi ile giriş yapan her cihaz, tamamladığınız dersleri ve
          son açtığınız dersi güvenli biçimde birleştirebilir. Yöneticiler ortam dosyasına şu değişkenleri{' '}
          <code className="rounded bg-neutral-200 px-1 py-0.5 font-mono text-[0.8125rem] dark:bg-[#2d2d2d]">
            VITE_SUPABASE_URL
          </code>{' '}
          ve{' '}
          <code className="rounded bg-neutral-200 px-1 py-0.5 font-mono text-[0.8125rem] dark:bg-[#2d2d2d]">
            VITE_SUPABASE_ANON_KEY
          </code>{' '}
          tanımlaması ve repodaki{' '}
          <code className="rounded bg-neutral-200 px-1 py-0.5 font-mono text-[0.8125rem] dark:bg-[#2d2d2d]">
            supabase/learning-progress.sql
          </code>{' '}
          betiğinin uygulanması gerekir.
        </p>
      ) : !hydrated ? (
        <p className="text-sm text-neutral-500 dark:text-[#a3a3a3]">
          Hesap bağlantısı doğrulanıyor…
        </p>
      ) : cloudSessionActive ? (
        <div className="flex flex-col gap-3 text-sm text-neutral-700 dark:text-[#d4d4d4] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-neutral-900 dark:text-[#f3f3f3]">
              Bulutta senkron: açık
            </p>
            <p className="mt-1 text-neutral-600 dark:text-[#bdbdbd]">
              Hesap{' '}
              <span className="font-semibold text-emerald-800 dark:text-[#89d185]">{userEmail}</span>
              — farklı cihazdan girişte aynı ilerlemeyi birleştirmeye çalışırız (yereldeki kayıtlar dahil).
            </p>
            {syncError ? (
              <p className="mt-2 text-red-700 dark:text-red-300" role="alert">
                Kayıt hatası: {syncError}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={handleLogout}
            className="self-start rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:opacity-60 dark:border-[#474747] dark:bg-[#2d2d2d] dark:text-[#ececec] dark:hover:bg-[#383838]"
          >
            Oturumu kapat
          </button>
        </div>
      ) : (
        <div className="flex max-w-xl flex-col gap-4">
          <p className="text-sm text-neutral-600 dark:text-[#c8c8c8]">
            E‑posta doğrulamalı bağlantı: tarayıcı depolaması silinse veya başka makineden gelse
            bile ilerlemeniz hesabınızla güvenli olarak birleştirilir. Yereldeki kayıtlar oturumu
            açtığında yükleme sırasına göre tek listeye dahil edilir.
          </p>
          <form className="flex flex-col gap-3" onSubmit={handleSend}>
            <label
              className="text-xs font-medium text-neutral-500 dark:text-[#bdbdbd]"
              htmlFor="sync-email"
            >
              E‑posta adresi
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="sync-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="min-w-[200px] flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-inner dark:border-[#474747] dark:bg-[#252526] dark:text-[#ececec]"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 dark:bg-[#3b82f6]"
              >
                Kodu gönder
              </button>
            </div>
          </form>
          <form className="flex flex-col gap-3" onSubmit={handleVerify}>
            <label
              className="text-xs font-medium text-neutral-500 dark:text-[#bdbdbd]"
              htmlFor="sync-code"
            >
              E‑postadaki onay kodu
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="sync-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-w-[120px] flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 font-mono text-sm text-neutral-900 shadow-inner dark:border-[#474747] dark:bg-[#252526] dark:text-[#ececec]"
                placeholder="Ör. 123456"
              />
              <button
                type="submit"
                disabled={busy || !email.trim()}
                className="rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60 dark:border-[#538d4a] dark:bg-[#3d7344]"
              >
                Onayla
              </button>
            </div>
          </form>
          {syncError ? (
            <p className="text-sm text-red-700 dark:text-red-300" role="alert">
              {syncError}
            </p>
          ) : null}
          {formMessage ? (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-950 dark:bg-emerald-950/35 dark:text-[#cce8d4]">
              {formMessage}
            </p>
          ) : null}
        </div>
      )}
    </section>
  )
}
