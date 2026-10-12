import { redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { type Language, LANGUAGES } from '#/lib/language'

import { readDemoLanguage, rememberDemoLanguage } from './demo-language.functions'
import { DEMO_STRINGS } from './strings'

const languageParameterSchema = z.enum(LANGUAGES).optional().catch(undefined)

export interface DemoSearch {
  // A link into the demo may name its language once; the layout stores it and drops the param.
  readonly lang?: Language
}

function validateDemoSearch(search: Readonly<Record<string, unknown>>): DemoSearch {
  // Every key, even when undefined: the router lays this over the raw params.
  return { lang: languageParameterSchema.parse(search.lang) }
}

interface DemoLocation {
  readonly pathname: string
  readonly searchStr: string
}

interface DemoGuardOptions {
  readonly location: DemoLocation
  readonly search: DemoSearch
}

export interface DemoContext {
  readonly language: Language
}

/**
 * The demo's language comes from a cookie, so the first response is already in the right one.
 * `?lang=` stores a language and redirects to the same address without it.
 */
function resolveDemoLanguage({ location, search }: DemoGuardOptions): DemoContext {
  if (search.lang !== undefined) {
    rememberDemoLanguage(search.lang)
    const params = new URLSearchParams(location.searchStr)
    params.delete('lang')
    const query = params.toString()
    throw redirect({ href: query === '' ? location.pathname : `${location.pathname}?${query}` })
  }
  return { language: readDemoLanguage() }
}

interface DemoHeadOptions {
  readonly match: { readonly context: DemoContext }
}

// A page of invented players must never rank, so every demo address asks not to be indexed.
function demoHead({ match }: DemoHeadOptions) {
  return {
    meta: [
      { title: DEMO_STRINGS[match.context.language].meta.title },
      { content: 'noindex, nofollow', name: 'robots' },
    ],
  }
}

/**
 * Shared by the file route and the unit-test router. Tests replace `beforeLoad`, because the
 * cookie can only be read inside a request.
 */
export const DEMO_LAYOUT_OPTIONS = {
  validateSearch: validateDemoSearch,
  beforeLoad: resolveDemoLanguage,
  head: demoHead,
}
