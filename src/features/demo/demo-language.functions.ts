import { createIsomorphicFn, createServerFn } from '@tanstack/react-start'
import { getCookie, getRequestHeader, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

import { isLanguage, type Language, LANGUAGES } from '#/lib/language'

import {
  LANGUAGE_COOKIE,
  LANGUAGE_COOKIE_OPTIONS,
  languageFromCookieHeader,
  languageFromPreferences,
} from './demo-language'

function writeCookieInBrowser(language: Language) {
  const { maxAge, path, sameSite } = LANGUAGE_COOKIE_OPTIONS
  // eslint-disable-next-line unicorn/no-document-cookie -- the Cookie Store API is not in every browser the demo supports
  document.cookie = `${LANGUAGE_COOKIE}=${language}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`
}

/**
 * The demo's language for this render. On the server: the cookie, then `Accept-Language`, then
 * Croatian; a visitor without the cookie gets it set to that answer, so the browser renders
 * client-side navigations in the language the first response used. In the browser: the cookie.
 */
export const readDemoLanguage = createIsomorphicFn()
  .server((): Language => {
    const fromCookie = getCookie(LANGUAGE_COOKIE)
    if (isLanguage(fromCookie)) {
      return fromCookie
    }
    const language = languageFromPreferences(getRequestHeader('accept-language') ?? '')
    setCookie(LANGUAGE_COOKIE, language, LANGUAGE_COOKIE_OPTIONS)
    return language
  })
  .client(
    (): Language =>
      languageFromCookieHeader(document.cookie) ?? languageFromPreferences(navigator.languages),
  )

/**
 * Stores the language a `?lang=` link asked for, on whichever side handles the request.
 */
export const rememberDemoLanguage = createIsomorphicFn()
  .server((language: Language) => {
    setCookie(LANGUAGE_COOKIE, language, LANGUAGE_COOKIE_OPTIONS)
  })
  .client((language: Language) => {
    writeCookieInBrowser(language)
  })

/**
 * The HR | EN control: stores the visitor's choice. The caller invalidates the router so the
 * page re-renders in place.
 */
export const chooseDemoLanguage = createServerFn({ method: 'POST' })
  .validator(z.enum(LANGUAGES))
  .handler(({ data }) => {
    setCookie(LANGUAGE_COOKIE, data, LANGUAGE_COOKIE_OPTIONS)
  })
