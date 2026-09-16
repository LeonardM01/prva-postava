import { cva } from 'class-variance-authority'

import { useLandingLanguage } from './use-landing-language'

// Phones get taller chips and only the first two filters, with a shorter add chip.
const filterVariants = cva(
  'rounded-full border p-3.5 text-[13px] leading-[normal] font-medium whitespace-nowrap board:px-3 board:py-1.75',
  {
    variants: {
      isApplied: {
        true: 'border-signal bg-tint text-signal',
        false: 'border-line bg-card text-ink',
      },
      screens: {
        all: '',
        wide: 'hidden board:block',
        narrow: 'board:hidden',
      },
    },
  },
)

/**
 * The club search demo's filter row. The chips only show what a search looks like, so they
 * are text in a list, not controls.
 */
export function SearchFilters() {
  const { strings } = useLandingLanguage()
  const filters = strings.clubs.filters

  return (
    <ul aria-label={filters.label} className="flex gap-1.5 board:gap-2">
      <li className={filterVariants({ isApplied: true, screens: 'all' })}>{filters.position}</li>
      <li className={filterVariants({ isApplied: true, screens: 'all' })}>{filters.age}</li>
      <li className={filterVariants({ isApplied: false, screens: 'wide' })}>{filters.matches}</li>
      <li className={filterVariants({ isApplied: false, screens: 'wide' })}>{filters.league}</li>
      <li className={filterVariants({ isApplied: false, screens: 'wide' })}>{filters.add}</li>
      <li className={filterVariants({ isApplied: false, screens: 'narrow' })}>
        {filters.addShort}
      </li>
    </ul>
  )
}
