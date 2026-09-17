import { absoluteUrl, type IndexablePage, pageAlternates, pageUrl } from '#/lib/indexable-pages'
import { type Language, otherLanguage } from '#/lib/language'

/**
 * The image a link preview shows. Every preview is a static 1200 by 630 PNG exported from
 * Figma, so only its path and description vary.
 */
interface SocialImage {
  readonly path: string
  readonly alt: string
}

interface IndexablePageHeadOptions {
  readonly page: IndexablePage
  readonly language: Language
  readonly title: string
  readonly description: string
  readonly image: SocialImage
}

const OPEN_GRAPH_LOCALES: Readonly<Record<Language, string>> = { hr: 'hr_HR', en: 'en_US' }

/**
 * Route head tags for one language of an indexable page. The canonical address is built from
 * the page's path, never the request URL, so campaign query strings never become canonical.
 * Link previews reuse the search title, description and canonical so the copy lives in one
 * place; X falls back to the Open Graph fields, so only its card type is set.
 */
export function indexablePageHead({
  page,
  language,
  title,
  description,
  image,
}: IndexablePageHeadOptions) {
  const canonical = pageUrl(page, language)
  return {
    meta: [
      { title },
      { content: description, name: 'description' },
      { content: 'website', property: 'og:type' },
      { content: 'Prva postava', property: 'og:site_name' },
      { content: title, property: 'og:title' },
      { content: description, property: 'og:description' },
      { content: canonical, property: 'og:url' },
      { content: absoluteUrl(image.path), property: 'og:image' },
      { content: '1200', property: 'og:image:width' },
      { content: '630', property: 'og:image:height' },
      { content: 'image/png', property: 'og:image:type' },
      { content: image.alt, property: 'og:image:alt' },
      { content: OPEN_GRAPH_LOCALES[language], property: 'og:locale' },
      { content: OPEN_GRAPH_LOCALES[otherLanguage(language)], property: 'og:locale:alternate' },
      { content: 'summary_large_image', name: 'twitter:card' },
    ],
    links: [
      { href: canonical, rel: 'canonical' },
      ...pageAlternates(page).map(({ hreflang, href }) => ({
        href,
        hrefLang: hreflang,
        rel: 'alternate',
      })),
    ],
  }
}
