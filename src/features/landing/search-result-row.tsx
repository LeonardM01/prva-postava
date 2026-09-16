import { cn } from '#/lib/utils'

import { type SampleListing } from './sample-listings'
import { useLandingLanguage } from './use-landing-language'

const CELL_CLASS = 'py-3'

const NUMBER_CELL_CLASS = cn(
  CELL_CLASS,
  'hidden px-1 text-right text-sm leading-[normal] text-ink board:table-cell',
)

interface SearchResultRowProps {
  readonly listing: SampleListing
}

/**
 * One result of the club search demo. Phones see position, player and a combined goals and
 * assists figure; wider screens see every column and the Save control.
 */
export function SearchResultRow({ listing }: SearchResultRowProps) {
  const { strings } = useLandingLanguage()
  const table = strings.clubs.table

  return (
    // Rules sit on top of each row after the first, so the promoted wash, whose outer cells
    // round their corners, always meets a straight rule.
    <tr
      className={cn(
        'not-first:*:border-t last:*:border-b last:*:border-b-ink',
        listing.isPromoted && '*:bg-amber-wash',
      )}
    >
      <td
        className={cn(
          CELL_CLASS,
          'w-10.25 pr-1.25 pl-2 board:w-18 board:pr-1 board:pl-3',
          listing.isPromoted && 'rounded-l-lg',
        )}
      >
        <span className="flex h-6 w-7 items-center justify-center rounded-[6px] bg-signal text-[11px] leading-[normal] font-semibold text-card board:h-6.5 board:w-7.5">
          {strings.positions[listing.position].short}
        </span>
      </td>
      <th scope="row" className={cn(CELL_CLASS, 'px-1.25 text-left font-normal board:px-1')}>
        <span className="flex flex-col gap-px leading-[normal] whitespace-nowrap board:gap-0.5">
          <span className="flex items-center gap-1.5 board:gap-2">
            <span className="text-sm font-semibold text-ink">
              {listing.firstName} {listing.lastName}
            </span>{' '}
            {listing.isPromoted && (
              <span className="rounded-[4px] bg-amber px-1.25 py-0.5 text-[10px] font-semibold tracking-[0.06em] text-ink uppercase board:px-1.5">
                {table.promoted}
              </span>
            )}
          </span>{' '}
          <span className="text-xs text-muted">
            {listing.club} · <span className="board:hidden">{listing.age}</span>
            <span className="max-board:hidden">{listing.league}</span>
          </span>
        </span>
      </th>
      <td className={cn(NUMBER_CELL_CLASS, 'w-17')}>{listing.age}</td>
      <td className={cn(NUMBER_CELL_CLASS, 'w-23')}>{listing.matches}</td>
      <td className={cn(NUMBER_CELL_CLASS, 'w-18')}>{listing.goals}</td>
      <td className={cn(NUMBER_CELL_CLASS, 'w-20')}>{listing.assists}</td>
      <td className={cn(NUMBER_CELL_CLASS, 'w-18')}>{listing.minutes}</td>
      <td
        className={cn(
          CELL_CLASS,
          'pr-2 pl-1.25 text-right text-[13px] leading-[normal] whitespace-nowrap text-ink board:hidden',
          listing.isPromoted && 'rounded-r-lg',
        )}
      >
        <span aria-hidden="true">
          {listing.goals} {table.goalsShort} · {listing.assists} {table.assistsShort}
        </span>
        <span className="sr-only">
          {listing.goals} {strings.board.units.goals}, {listing.assists}{' '}
          {strings.board.units.assists}
        </span>
      </td>
      <td
        className={cn(
          CELL_CLASS,
          'hidden w-28 pr-3 pl-1 board:table-cell',
          listing.isPromoted && 'rounded-r-lg',
        )}
      >
        <span className="flex w-24 justify-center rounded-lg border border-signal py-1.75 text-[13px] leading-[normal] font-semibold text-signal">
          {table.save}
        </span>
      </td>
    </tr>
  )
}
