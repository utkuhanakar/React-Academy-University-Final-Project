import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  ThemeContext,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type StoredThemePreference,
  type ThemeContextValue,
} from './themeContext'

function readStoredPreference(): StoredThemePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
    return 'system'
  } catch {
    return 'system'
  }
}

function subscribeMq(listener: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', listener)
  return () => mq.removeEventListener('change', listener)
}

function mqMatchesDarkSnapshot() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function mqServerSnapshot() {
  return false
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [storedPreference, setStoredPreferenceState] =
    useState<StoredThemePreference>(() => readStoredPreference())

  const systemPrefersDark = useSyncExternalStore(
    subscribeMq,
    mqMatchesDarkSnapshot,
    mqServerSnapshot,
  )

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (storedPreference === 'system') {
      return systemPrefersDark ? 'dark' : 'light'
    }
    return storedPreference === 'dark' ? 'dark' : 'light'
  }, [storedPreference, systemPrefersDark])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, storedPreference)
    } catch {
      /* gizli mod / kotası vb. */
    }
  }, [storedPreference])

  const setStoredPreference = useCallback((pref: StoredThemePreference) => {
    setStoredPreferenceState(pref)
  }, [])

  const toggleTheme = useCallback(() => {
    setStoredPreferenceState((prev) => {
      if (prev === 'system') return 'light'
      if (prev === 'light') return 'dark'
      return 'system'
    })
  }, [])

  const value = useMemo(
    (): ThemeContextValue => ({
      storedPreference,
      resolvedTheme,
      setStoredPreference,
      toggleTheme,
      theme: resolvedTheme,
    }),
    [
      resolvedTheme,
      setStoredPreference,
      storedPreference,
      toggleTheme,
    ],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
