import { z } from 'zod'

export const LANGUAGES = ['hr', 'en'] as const

export const DEFAULT_LANGUAGE = 'hr'

const languageSchema = z.enum(LANGUAGES)

export type Language = z.infer<typeof languageSchema>

const languageOrDefaultSchema = languageSchema.default(DEFAULT_LANGUAGE).catch(DEFAULT_LANGUAGE)

/**
 * Reads a language from untrusted input, falling back to Croatian when absent or unsupported.
 */
export function parseLanguage(value: unknown): Language {
  return languageOrDefaultSchema.parse(value)
}

export function isLanguage(value: unknown): value is Language {
  return languageSchema.safeParse(value).success
}

/**
 * The path segment that selects `language`. The default language lives at the root, so it has
 * none.
 */
export function languagePathSegment(language: Language): Language | undefined {
  return language === DEFAULT_LANGUAGE ? undefined : language
}

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
