import { Link } from '@tanstack/react-router'

import { LineupMark } from '#/components/lineup-mark'
import { languagePathSegment } from '#/lib/language'

import { useDemoLanguage } from './use-demo-language'

/**
 * Back to the landing page, in the language the demo is showing.
 */
export function DemoBrandLink() {
  const { language, strings } = useDemoLanguage()

  return (
    <Link
      to="/{-$lang}"
      params={{ lang: languagePathSegment(language) }}
      aria-label={strings.shell.brandLink}
      className="flex min-h-11 shrink-0 items-center gap-2.5 font-display text-xl font-extrabold tracking-[-0.02em] text-ink"
    >
      <LineupMark placement="nav" />
      {strings.shell.brand}
    </Link>
  )
}
