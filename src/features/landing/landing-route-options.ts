import { notFound, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { indexablePageHead } from '#/lib/indexable-page-head'
import { HOME_PAGE } from '#/lib/indexable-pages'
import { DEFAULT_LANGUAGE, isLanguage, parseLanguage } from '#/lib/language'
import { siteStructuredDataScript } from '#/lib/site-structured-data'

import { LANDING_STRINGS } from './strings'

/**
 * The landing page reads no search params of its own. Unknown ones (for example `utm_*`)
 * pass through so moving between languages and sections does not drop them from the URL.
 */
const landingSearchSchema = z.looseObject({})

type LandingSearch = z.infer<typeof landingSearchSchema>

interface LandingPathParams {
  readonly lang?: string
}

interface LandingGuardOptions {
  readonly params: LandingPathParams
  readonly search: LandingSearch
}

/**
 * The language comes from the optional path segment. The default language has no prefix, so
 * `/hr` permanently redirects to `/`, and a segment that is not a language is not found.
 */
function guardLandingLanguage({ params, search }: LandingGuardOptions) {
  if (params.lang === undefined) {
    return
  }
  if (params.lang === DEFAULT_LANGUAGE) {
    throw redirect({ to: '/{-$lang}', params: { lang: undefined }, search, statusCode: 301 })
  }
  if (!isLanguage(params.lang)) {
    throw notFound()
  }
}

interface LandingHeadOptions {
  readonly params: LandingPathParams
}

function landingHead({ params }: LandingHeadOptions) {
  const language = parseLanguage(params.lang)
  const head = indexablePageHead({ page: HOME_PAGE, language, ...LANDING_STRINGS[language].meta })
  return { ...head, scripts: [siteStructuredDataScript(language)] }
}

/**
 * Shared by the file route and the unit-test router so tests exercise the real search
 * validation, language guard and head tags.
 */
export const LANDING_ROUTE_OPTIONS = {
  validateSearch: landingSearchSchema,
  beforeLoad: guardLandingLanguage,
  head: landingHead,
}
