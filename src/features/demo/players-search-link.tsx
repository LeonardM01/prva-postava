import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'

import { type PlayersSearch } from './players-search'
import { useOpenedListingId } from './use-players-search'

interface PlayersSearchLinkProps {
  readonly 'aria-label'?: string
  readonly children: ReactNode
  readonly className?: string
  readonly rel?: string
  readonly search: PlayersSearch
}

/**
 * A link to another page or order of the same search, keeping the opened profile open.
 */
export function PlayersSearchLink({ search, ...props }: PlayersSearchLinkProps) {
  const openedId = useOpenedListingId()

  return openedId === undefined ? (
    <Link to="/app" search={search} {...props} />
  ) : (
    <Link
      to="/app/players/$listingId"
      params={{ listingId: openedId }}
      search={search}
      {...props}
    />
  )
}
