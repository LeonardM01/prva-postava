import { chipVariants } from '#/components/chip-variants'
import { cn } from '#/lib/utils'

import { useLandingLanguage } from './use-landing-language'

// Phones get only the first two filters, with a shorter add chip.
const SHOWN_ON = {
  all: '',
  wide: 'hidden board:block',
  narrow: 'board:hidden',
} as const

interface FilterChipOptions {
  readonly isApplied: boolean
  readonly shownOn: keyof typeof SHOWN_ON
}

function filterChipClass({ isApplied, shownOn }: FilterChipOptions) {
  return cn(chipVariants({ isApplied, size: 'landing' }), SHOWN_ON[shownOn])
}

/**
 * The club search demo's filter row. The chips only show what a search looks like, so they
 * are text in a list, not controls.
 */
export function SearchFilters() {
  const { strings } = useLandingLanguage()
  const filters = strings.clubs.filters

  return (
    <ul aria-label={filters.label} className="flex gap-1.5 board:gap-2">
      <li className={filterChipClass({ isApplied: true, shownOn: 'all' })}>{filters.position}</li>
      <li className={filterChipClass({ isApplied: true, shownOn: 'all' })}>{filters.age}</li>
      <li className={filterChipClass({ isApplied: false, shownOn: 'wide' })}>{filters.matches}</li>
      <li className={filterChipClass({ isApplied: false, shownOn: 'wide' })}>{filters.league}</li>
      <li className={filterChipClass({ isApplied: false, shownOn: 'wide' })}>{filters.add}</li>
      <li className={filterChipClass({ isApplied: false, shownOn: 'narrow' })}>
        {filters.addShort}
      </li>
    </ul>
  )
}
