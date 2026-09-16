import { cva } from 'class-variance-authority'

import { type Language } from '#/lib/language'

import { LanguageLink } from './language-link'
import { useLandingLanguage } from './use-landing-language'

// The design reads "HR | EN", Croatian first.
const SWITCH_ORDER: readonly Language[] = ['hr', 'en']

const optionVariants = cva(
  'flex items-center justify-center rounded-sm px-2.5 text-[13px] leading-[17px] transition-colors duration-150',
  {
    variants: {
      isCurrent: {
        true: 'bg-tint font-semibold text-signal',
        false: 'font-medium text-muted hover:text-ink',
      },
      size: {
        compact: 'py-1.5',
        touch: 'min-h-11 min-w-11',
      },
    },
  },
)

interface LanguageSwitchProps {
  readonly onNavigate?: () => void
  readonly size: 'compact' | 'touch'
}

export function LanguageSwitch({ onNavigate, size }: LanguageSwitchProps) {
  const { language: currentLanguage, strings } = useLandingLanguage()

  return (
    <div
      role="group"
      aria-label={strings.nav.language}
      className="flex w-fit rounded-md border border-line bg-card p-0.5"
    >
      {SWITCH_ORDER.map((language) => {
        const isCurrent = language === currentLanguage
        return (
          <LanguageLink
            key={language}
            language={language}
            className={optionVariants({ isCurrent, size })}
            onClick={onNavigate}
          >
            {language.toUpperCase()}
          </LanguageLink>
        )
      })}
    </div>
  )
}
