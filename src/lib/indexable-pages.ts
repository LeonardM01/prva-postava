import { DEFAULT_LANGUAGE, type Language, LANGUAGES } from '#/lib/language'

/**
 * The production origin. Deliberately not an environment variable: previews and local builds
 * must still point canonical links at production so they never become the indexed address.
 */
export const SITE_ORIGIN = 'https://prvapostava.co'

/**
 * A page search engines should index, as its path in each language.
 */
export type IndexablePage = Readonly<Record<Language, string>>

export const HOME_PAGE: IndexablePage = { hr: '/', en: '/en' }

/**
 * Every indexable page. The sitemap lists each one in every language.
 */
export const INDEXABLE_PAGES: readonly IndexablePage[] = [HOME_PAGE]

interface PageAlternate {
  readonly hreflang: 'x-default' | Language
  readonly href: string
}

export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path}`
}

export function pageUrl(page: IndexablePage, language: Language): string {
  return absoluteUrl(page[language])
}

/**
 * The absolute address of `page` in every language, plus `x-default` for searchers whose
 * language the site does not speak. Head tags and the sitemap both list exactly these.
 */
export function pageAlternates(page: IndexablePage): readonly PageAlternate[] {
  return [
    ...LANGUAGES.map((language) => ({ hreflang: language, href: pageUrl(page, language) })),
    { hreflang: 'x-default', href: pageUrl(page, DEFAULT_LANGUAGE) },
  ]
}
