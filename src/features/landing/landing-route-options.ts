import { notFound, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { DEFAULT_LANGUAGE, isLanguage } from '#/lib/language'

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

/**
 * Shared by the file route and the unit-test router so tests exercise the real search
 * validation and language guard.
 */
export const LANDING_ROUTE_OPTIONS = {
  validateSearch: landingSearchSchema,
  beforeLoad: guardLandingLanguage,
}
