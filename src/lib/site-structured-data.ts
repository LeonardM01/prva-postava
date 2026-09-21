import { absoluteUrl, SITE_ORIGIN } from '#/lib/indexable-pages'
import { type Language, LANGUAGES } from '#/lib/language'
import { GENERAL_EMAIL, SUPPORT_EMAIL } from '#/lib/site-contacts'

const SITE_NAME = 'Prva postava'

const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`

const WEBSITE_ID = `${SITE_ORIGIN}/#website`

const LOGO_SIZE = 512

/**
 * Deliberately without `legalName` or `sameAs`: no registered company or social profile is
 * confirmed yet. Add each field here once the fact is real. `email` is the address the footer
 * opens, so the page and the graph always name the same inbox; the support mailbox is a separate
 * contact point rather than a second `email`, which schema.org allows only one of. The logo is
 * the 512 px icon that `bun run generate-icons` writes to `public/`; keep its path and size in
 * step.
 */
const ORGANIZATION = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_ORIGIN,
  email: GENERAL_EMAIL,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'technical support',
    email: SUPPORT_EMAIL,
    availableLanguage: LANGUAGES,
  },
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/icon-512.png'),
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
} as const

/**
 * Deliberately without a `SearchAction`: Google retired the sitelinks search box it fed.
 */
function website(language: Language) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    inLanguage: language,
    publisher: { '@id': ORGANIZATION_ID },
  } as const
}

/**
 * The home page head script that tells search engines the organisation and the website are called
 * "Prva postava", with the formation logo, so the brand name shows above results. The nodes sit
 * in one `@graph` and reference each other by `@id`, so new nodes or fields slot in unchanged.
 * Every value is code-owned, so the JSON needs no escaping inside the script tag.
 */
export function siteStructuredDataScript(language: Language) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [ORGANIZATION, website(language)],
    }),
  }
}
