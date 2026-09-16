import { useId } from 'react'

import { SearchFilters } from './search-filters'
import { SearchResultsTable } from './search-results-table'
import { SECTION_IDS } from './section-ids'
import { useLandingLanguage } from './use-landing-language'

/**
 * A picture of the club search. Its controls have nowhere to go yet, so they are drawn as
 * static text rather than buttons that do nothing.
 */
export function ClubSearchDemo() {
  const { strings } = useLandingLanguage()
  const captionId = useId()

  return (
    <figure
      id={SECTION_IDS.clubSearch}
      aria-labelledby={captionId}
      className="flex min-w-0 flex-col gap-3 board:gap-4 xl:min-w-190 xl:flex-1"
    >
      <SearchFilters />
      <SearchResultsTable />
      <p className="hidden gap-2.5 pt-1 text-sm leading-[normal] font-semibold board:flex">
        <span className="rounded-[10px] bg-signal px-4 py-2.5 text-card">
          {strings.clubs.contactPlayer}
        </span>{' '}
        <span className="rounded-[10px] border border-line px-4 py-2.5 text-ink">
          {strings.clubs.saveSearch}
        </span>
      </p>
      <figcaption id={captionId} className="text-xs text-muted board:text-[13px]">
        {strings.clubs.demoCaption}
      </figcaption>
    </figure>
  )
}
