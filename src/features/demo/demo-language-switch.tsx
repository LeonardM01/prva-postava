import { useRouter } from '@tanstack/react-router'

import { type Language } from '#/lib/language'

import { chooseDemoLanguage } from './demo-language.functions'
import { switchOptionVariants, switchTrackClass } from './switch-option-variants'
import { useDemoLanguage } from './use-demo-language'

// The design reads "HR | EN", Croatian first.
const SWITCH_ORDER: readonly Language[] = ['hr', 'en']

interface DemoLanguageSwitchProps {
  readonly size: 'compact' | 'touch'
}

/**
 * HR | EN. Stores the choice in the cookie and re-renders the page in place, so the address
 * and everything on it stay as they are.
 */
export function DemoLanguageSwitch({ size }: DemoLanguageSwitchProps) {
  const { language: currentLanguage, strings } = useDemoLanguage()
  const router = useRouter()

  async function switchTo(language: Language) {
    await chooseDemoLanguage({ data: language })
    await router.invalidate()
  }

  return (
    <div role="group" aria-label={strings.shell.language.label} className={switchTrackClass}>
      {SWITCH_ORDER.map((language) => {
        const isCurrent = language === currentLanguage
        return (
          <button
            key={language}
            type="button"
            lang={language}
            aria-pressed={isCurrent}
            className={switchOptionVariants({ isCurrent, size })}
            onClick={() => {
              if (!isCurrent) {
                void switchTo(language)
              }
            }}
          >
            {language.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
