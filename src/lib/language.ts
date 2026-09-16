import { z } from 'zod'

export const LANGUAGES = ['en', 'hr'] as const

const DEFAULT_LANGUAGE = 'en'

const languageSchema = z.enum(LANGUAGES)

export type Language = z.infer<typeof languageSchema>

const languageOrDefaultSchema = languageSchema.default(DEFAULT_LANGUAGE).catch(DEFAULT_LANGUAGE)

/**
 * Reads a language from untrusted input, falling back to English when absent or unsupported.
 */
export function parseLanguage(value: unknown): Language {
  return languageOrDefaultSchema.parse(value)
}

/**
 * Search params for pages that come in both languages. Unknown params (for example
 * `utm_*`) pass through so switching language does not drop them from the URL, and an
 * unsupported `lang` falls back to English instead of failing the route.
 */
export const languageSearchSchema = z.looseObject({
  lang: languageOrDefaultSchema,
})

export function otherLanguage(language: Language): Language {
  switch (language) {
    case 'en': {
      return 'hr'
    }
    case 'hr': {
      return 'en'
    }
  }
}
