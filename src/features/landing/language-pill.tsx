import { otherLanguage } from '#/lib/language'

import { LanguageLink } from './language-link'
import { useLandingLanguage } from './use-landing-language'

/**
 * The mobile nav shows only the current language; tapping it switches to the other one.
 */
export function LanguagePill() {
  const { language, strings } = useLandingLanguage()
  const code = language.toUpperCase()

  return (
    <LanguageLink
      language={otherLanguage(language)}
      aria-label={`${code}: ${strings.nav.switchLanguage}`}
      className="flex size-11 items-center justify-center rounded-md bg-tint text-xs font-semibold text-signal"
    >
      {code}
    </LanguageLink>
  )
}
