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
  const table = strings.clubs.table

  return (
    // Separate borders let the promoted row round its corners.
    <table className="w-full border-separate border-spacing-0 max-board:border-t max-board:border-ink">
      <thead>
        <tr className="board:*:border-b board:*:border-ink">
          <th scope="col" className={cn(HEADER_CLASS, 'board:pl-3')}>
            <span className="max-board:sr-only">{table.position}</span>
          </th>
          <th scope="col" className={HEADER_CLASS}>
            <span className="max-board:sr-only">{table.player}</span>
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            {table.age}
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            {table.matches}
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            {table.goals}
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            {table.assists}
          </th>
          <th scope="col" className={NUMBER_HEADER_CLASS}>
            {table.minutes}
          </th>
          <th scope="col" className={cn(HEADER_CLASS, 'board:hidden')}>
            <span className="sr-only">{table.season}</span>
          </th>
          <th scope="col" className={cn(HEADER_CLASS, 'hidden board:table-cell')}>
            <span className="sr-only">{table.actions}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {SAMPLE_SEARCH_RESULTS.map((listing) => (
          <SearchResultRow key={listing.id} listing={listing} />
        ))}
      </tbody>
    </table>
  )
}
