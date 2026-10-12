import { fillTemplate } from './format'
import { ChevronLeftIcon } from './icons/chevron-left-icon'
import { ChevronRightIcon } from './icons/chevron-right-icon'
import { PlayersSearchLink } from './players-search-link'
import { PAGE_SIZE, type SearchResult } from './search-listings'
import { useDemoLanguage } from './use-demo-language'
import { usePlayersSearch } from './use-players-search'

const PAGE_LINK_CLASS =
  'flex size-11 items-center justify-center rounded-md border border-line bg-card text-ink transition-colors duration-150 hover:border-signal lg:size-9'

interface ListFootProps {
  readonly result: SearchResult
}

/**
 * "1–20 of 47 · Promoted first, then by score", with the previous and next pages.
 */
export function ListFoot({ result }: ListFootProps) {
  const { strings } = useDemoLanguage()
  const search = usePlayersSearch()
  const copy = strings.list
  const from = (result.page - 1) * PAGE_SIZE + 1
  const previousPage = result.page - 1
  const nextPage = result.page + 1

  return (
    <div className="flex items-center gap-3 py-3 pl-3">
      <p className="flex-1 text-[13px] leading-[1.3] text-muted">
        {fillTemplate(copy.foot, {
          from,
          to: from + result.rows.length - 1,
          total: result.total,
          order: strings.sort.footOrder[search.sort ?? 'score'],
        })}
      </p>
      {result.pageCount > 1 && (
        <nav aria-label={copy.pagesLabel} className="flex gap-2">
          {previousPage >= 1 && (
            <PlayersSearchLink
              rel="prev"
              aria-label={copy.previous}
              className={PAGE_LINK_CLASS}
              search={{ ...search, page: previousPage === 1 ? undefined : previousPage }}
            >
              <ChevronLeftIcon className="size-4.5" />
            </PlayersSearchLink>
          )}
          {nextPage <= result.pageCount && (
            <PlayersSearchLink
              rel="next"
              aria-label={copy.next}
              className={PAGE_LINK_CLASS}
              search={{ ...search, page: nextPage }}
            >
              <ChevronRightIcon className="size-4.5" />
            </PlayersSearchLink>
          )}
        </nav>
      )}
    </div>
  )
}
