import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'

import { type Listing, SAMPLE_LISTINGS } from '#/features/sample-listings/sample-listings'
import { cn } from '#/lib/utils'

import { Dossier } from './dossier'
import { DossierActions } from './dossier-actions'
import { ChevronLeftIcon } from './icons/chevron-left-icon'
import { ShortlistColumn } from './shortlist-column'
import { useDemoLanguage } from './use-demo-language'
import { useShortlist } from './use-shortlist'

const shortlistRoute = getRouteApi('/app/shortlist')

function savedListings(ids: readonly string[]): Listing[] {
  return ids.flatMap((id) => SAMPLE_LISTINGS.filter((listing) => listing.id === id))
}

/**
 * The recruiter's own list, newest first, with the opened dossier beside it. It lives on this
 * device, so the server sends only the heading and the rest appears after hydration.
 */
export function ShortlistPage() {
  const { strings } = useDemoLanguage()
  const shortlist = useShortlist()
  const search = shortlistRoute.useSearch()
  const navigate = useNavigate()
  const saved = savedListings(shortlist.ids ?? [])
  const chosen = saved.find((listing) => listing.id === search.listing)
  const opened = chosen ?? saved[0]
  const isProfileChosen = chosen !== undefined

  // Removing the opened player opens the one after it, or before it at the end of the list.
  function openNextAfter(removed: Listing) {
    if (removed.id !== opened?.id) {
      return
    }
    const index = saved.indexOf(removed)
    const next = saved[index + 1] ?? saved[index - 1]
    void navigate({ to: '/app/shortlist', search: { listing: next?.id } })
  }

  return (
    <div className="lg:grid lg:grid-cols-[24.5rem_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div className={cn(isProfileChosen && 'max-lg:hidden')}>
        <ShortlistColumn
          saved={shortlist.ids === undefined ? undefined : saved}
          openedId={opened?.id}
          onRemoved={openNextAfter}
        />
      </div>
      {opened !== undefined && (
        <div className={cn('flex min-w-0 flex-col gap-4', !isProfileChosen && 'max-lg:hidden')}>
          <Link
            to="/app/shortlist"
            className="-ml-1 flex min-h-11 w-fit items-center gap-1 text-[15px] font-semibold text-signal lg:hidden"
          >
            <ChevronLeftIcon className="size-4.5" />
            {strings.shortlist.title}
          </Link>
          <Dossier
            key={opened.id}
            listing={opened}
            scoreNote={strings.dossier.scoreNote}
            actions={<DossierActions listing={opened} onRemoved={openNextAfter} />}
          />
        </div>
      )}
    </div>
  )
}
