import { INDEXABLE_PAGES, pageAlternates, pageUrl } from '#/lib/indexable-pages'
import { LANGUAGES } from '#/lib/language'

/**
 * The sitemap XML: every indexable page in every language, each naming all its translations.
 * It has no `lastmod`, `changefreq` or `priority`, because Google ignores the last two and the
 * site has no reliable modification date. Every value is a code-owned URL, so none is escaped.
 */
export function renderSitemap(): string {
  const urls = INDEXABLE_PAGES.flatMap((page) => {
    const alternates = pageAlternates(page)
      .map(
        ({ hreflang, href }) =>
          `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`,
      )
      .join('\n')
    return LANGUAGES.map(
      (language) => `  <url>\n    <loc>${pageUrl(page, language)}</loc>\n${alternates}\n  </url>`,
    )
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}
