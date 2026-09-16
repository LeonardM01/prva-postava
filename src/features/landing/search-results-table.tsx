import { cn } from '#/lib/utils'

import { SAMPLE_SEARCH_RESULTS } from './sample-listings'
import { SearchResultRow } from './search-result-row'
import { useLandingLanguage } from './use-landing-language'

// Phones hide the header row from sight, not from assistive technology.
const HEADER_CLASS =
  'px-1 text-left text-[11px] leading-[normal] font-medium tracking-[0.06em] whitespace-nowrap text-muted uppercase max-board:p-0 board:pb-2.5'

const NUMBER_HEADER_CLASS = cn(HEADER_CLASS, 'hidden text-right board:table-cell')

export function SearchResultsTable() {
  const { strings } = useLandingLanguage()
  const tableCopy = strings.clubs.table

  return (
    // Separate borders let the promoted row round its corners.
    <table className="w-full border-separate border-spacing-0 max-board:border-t max-board:border-ink">
      <thead>
        <tr className="board:*:border-b board:*:border-ink">
          <th scope="col" className={cn(HEADER_CLASS, 'board:pl-3')}>
            <abbr title={tableCopy.positionName} className="no-underline max-board:sr-only">
              {tableCopy.position}
            </abbr>
          </th>
          <th scope="col" className={HEADER_CLASS}>
            <span className="max-board:sr-only">{tableCopy.player}</span>
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            {tableCopy.age}
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            {tableCopy.matches}
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            {tableCopy.goals}
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            {tableCopy.assists}
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            <abbr title={tableCopy.minutesName} className="no-underline">
              {tableCopy.minutes}
            </abbr>
          </th>
          <th scope="col" className={cn(HEADER_CLASS, 'board:hidden')}>
            <span className="sr-only">{tableCopy.goalsAndAssists}</span>
          </th>
          <th scope="col" className={cn(HEADER_CLASS, 'hidden board:table-cell')}>
            <span className="sr-only">{tableCopy.actions}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {SAMPLE_SEARCH_RESULTS.map((listing) => (
          <SearchResultRow key={listing.player.id} listing={listing} />
        ))}
      </tbody>
    </table>
  )
}
