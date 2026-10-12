import { Link, useCanGoBack, useRouter } from '@tanstack/react-router'

import { type Position } from '#/features/sample-listings/positions'
import { SAMPLE_LISTINGS } from '#/features/sample-listings/sample-listings'

import { fillTemplate } from './format'
import { ChevronLeftIcon } from './icons/chevron-left-icon'
import { searchListings } from './search-listings'
import { useDemoLanguage } from './use-demo-language'
import { usePlayersSearch } from './use-players-search'

interface ProfileBackLinkProps {
  readonly position: Position
}

/**
 * Phones only: "14 left wings", back to the searched list. Going back through the history,
 * when there is one, also brings back where the list was scrolled to.
 */
export function ProfileBackLink({ position }: ProfileBackLinkProps) {
  const { strings } = useDemoLanguage()
  const search = usePlayersSearch()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const listSearch = { ...search, position }
  const { total } = searchListings(SAMPLE_LISTINGS, listSearch)

  return (
    <Link
      to="/app"
      search={listSearch}
      className="-ml-1 flex min-h-11 w-fit items-center gap-1 text-[15px] font-semibold text-signal lg:hidden"
      onClick={(event) => {
        if (!canGoBack) {
          return
        }

        event.preventDefault()
        router.history.back()
      }}
    >
      <ChevronLeftIcon className="size-4.5" />
      {fillTemplate(strings.dossier.back, {
        count: total,
        listNoun: strings.positions[position].listNoun,
        plural: strings.positions[position].plural,
      })}
    </Link>
  )
}
