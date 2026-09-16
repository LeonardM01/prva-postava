import { Link } from '@tanstack/react-router'

import { LineupMark } from './lineup-mark'
import { useLandingLanguage } from './use-landing-language'

export function BrandLink() {
  const { language, strings } = useLandingLanguage()

  return (
    <Link
      to="/"
      search={{ lang: language }}
      className="flex min-h-11 items-center gap-2.5 font-display text-xl font-extrabold tracking-[-0.02em] text-ink"
    >
      <LineupMark placement="nav" />
      {strings.brand}
    </Link>
  )
}
