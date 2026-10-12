import { SAMPLE_LISTINGS } from '#/features/sample-listings/sample-listings'

import { searchListings } from './search-listings'
import { useDemoLanguage } from './use-demo-language'
import { usePlayersSearch } from './use-players-search'

/**
 * The dossier column before a row is opened: nobody chooses a player for the recruiter. With
 * no rows there is nothing to open, so it stays empty and the list's own empty state speaks.
 */
export function DossierPrompt() {
  const { strings } = useDemoLanguage()
  const search = usePlayersSearch()

  if (searchListings(SAMPLE_LISTINGS, search).total === 0) {
    return null
  }
  return (
    <div className="flex max-w-120 flex-col gap-3 lg:pt-1">
      <p className="text-base leading-[1.3] font-semibold text-ink">{strings.list.promptTitle}</p>
      <p className="text-[15px] leading-normal text-muted">{strings.list.promptBody}</p>
    </div>
  )
}
