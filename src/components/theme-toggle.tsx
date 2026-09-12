import { useSyncExternalStore } from 'react'

const THEME_MODES = ['auto', 'light', 'dark'] as const
type ThemeMode = (typeof THEME_MODES)[number]

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

const NEXT_MODE: Record<ThemeMode, ThemeMode> = { auto: 'light', dark: 'auto', light: 'dark' }
const MODE_LABEL: Record<ThemeMode, string> = { auto: 'Auto', dark: 'Dark', light: 'Light' }

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (THEME_MODES as readonly string[]).includes(value)
}

function readStoredMode(): ThemeMode {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isThemeMode(stored) ? stored : 'auto'
}

function getServerMode(): ThemeMode {
  return 'auto'
}

function resolveMode(mode: ThemeMode): 'dark' | 'light' {
  if (mode !== 'auto') {
    return mode
  }
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function applyThemeMode(mode: ThemeMode) {
  const resolved = resolveMode(mode)
  const root = document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  if (mode === 'auto') {
    delete root.dataset.theme
  } else {
    root.dataset.theme = mode
  }
  root.style.colorScheme = resolved
}

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)

  const media = window.matchMedia(DARK_QUERY)
  const onMediaChange = () => {
    if (readStoredMode() === 'auto') {
      applyThemeMode('auto')
    }
  }
  media.addEventListener('change', onMediaChange)
  window.addEventListener('storage', listener)

  return () => {
    listeners.delete(listener)
    media.removeEventListener('change', onMediaChange)
    window.removeEventListener('storage', listener)
  }
}

function setStoredMode(mode: ThemeMode) {
  window.localStorage.setItem(STORAGE_KEY, mode)
  applyThemeMode(mode)
  for (const listener of listeners) {
    listener()
  }
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, readStoredMode, getServerMode)
  const label =
    mode === 'auto'
      ? 'Theme: auto (system). Switch to light.'
      : `Theme: ${mode}. Switch to ${NEXT_MODE[mode]}.`

  return (
    <button
      type="button"
      onClick={() => {
        setStoredMode(NEXT_MODE[mode])
      }}
      aria-label={label}
      title={label}
      className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      {MODE_LABEL[mode]}
    </button>
  )
}
