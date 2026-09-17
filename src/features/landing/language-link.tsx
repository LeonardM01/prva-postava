import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'

import { type Language, languagePathSegment } from '#/lib/language'

interface LanguageLinkProps {
  readonly 'aria-label'?: string
  readonly children: ReactNode
  readonly className?: string
  readonly language: Language
  readonly onClick?: () => void
}

/**
 * Links to the landing page in `language`, keeping every search param and the hash.
 */
export function LanguageLink({ children, language, ...props }: LanguageLinkProps) {
  return (
    <Link
      to="/{-$lang}"
      params={{ lang: languagePathSegment(language) }}
      search={true}
      hash={true}
      hrefLang={language}
      {...props}
    >
      {children}
    </Link>
  )
}
