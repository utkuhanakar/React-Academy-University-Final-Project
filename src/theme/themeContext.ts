import { createContext } from 'react'

export type StoredThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

/** Yerel olarak saklanan tema seçimi için anahtar. */
export const THEME_STORAGE_KEY = 'react-akademi:theme'

export type ThemeContextValue = {
  /** Kullanıcının seçtiği mod: sistem / açık / koyu. */
  storedPreference: StoredThemePreference
  /** `storedPreference === 'system'` iken işletim sistemi tercihiyle çözülür. */
  resolvedTheme: ResolvedTheme
  setStoredPreference: (pref: StoredThemePreference) => void
  /** Sistem → açık → koyu → sistem … döngüsü */
  toggleTheme: () => void
  /**
   * Eski bileşenler için (`resolvedTheme` ile aynı).
   */
  theme: ResolvedTheme
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Geriye uyumluluk için. */
export const STORAGE_KEY = THEME_STORAGE_KEY
