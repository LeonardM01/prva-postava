import { DEFAULT_LANGUAGE, isLanguage, type Language } from '#/lib/language'

/**
 * The demo sits outside the `/en` segment, so its language lives in this cookie. Not HttpOnly:
 * the browser reads it to render client-side navigations in the same language.
 */
export const LANGUAGE_COOKIE = 'lang'

export const LANGUAGE_COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax',
} as const

/**
 * The first supported language in an `Accept-Language` header or a list of browser languages,
 * by preference weight, or Croatian when none matches.
 */
export function languageFromPreferences(preferences: readonly string[] | string): Language {
  const ranges = typeof preferences === 'string' ? parseAcceptLanguage(preferences) : preferences
  for (const range of ranges) {
    const primary = range.split('-', 1)[0]?.toLowerCase()
    if (isLanguage(primary)) {
      return primary
    }
  }
  return DEFAULT_LANGUAGE
}

interface WeightedRange {
  readonly range: string
  readonly weight: number
}

function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((part): WeightedRange => {
      const [range = '', ...parameters] = part.trim().split(';')
      const weightParameter = parameters.find((parameter) => parameter.trimStart().startsWith('q='))
      const weight = weightParameter === undefined ? 1 : Number(weightParameter.trim().slice(2))
      return { range: range.trim(), weight: Number.isNaN(weight) ? 0 : weight }
    })
    .filter(({ range, weight }) => range !== '' && weight > 0)
    .toSorted((first, second) => second.weight - first.weight)
    .map(({ range }) => range)
}

/**
 * The language a `Cookie` header (or `document.cookie`) names, if it names a supported one.
 */
export function languageFromCookieHeader(header: string): Language | undefined {
  for (const pair of header.split(';')) {
    const [name, value] = pair.trim().split('=', 2)
    if (name === LANGUAGE_COOKIE && isLanguage(value)) {
      return value
    }
  }
  return undefined
}
