import { type IndexablePage, pageAlternates, pageUrl } from '#/lib/indexable-pages'
import { type Language } from '#/lib/language'

interface IndexablePageHeadOptions {
  readonly page: IndexablePage
  readonly language: Language
  readonly title: string
  readonly description: string
}

/**
 * Route head tags for one language of an indexable page. The canonical address is built from
 * the page's path, never the request URL, so campaign query strings never become canonical.
 */
export function indexablePageHead({
  page,
  language,
  title,
  description,
}: IndexablePageHeadOptions) {
  return {
    meta: [{ title }, { content: description, name: 'description' }],
    links: [
      { href: pageUrl(page, language), rel: 'canonical' },
      ...pageAlternates(page).map(({ hreflang, href }) => ({
        href,
        hrefLang: hreflang,
        rel: 'alternate',
      })),
    ],
  }
}
