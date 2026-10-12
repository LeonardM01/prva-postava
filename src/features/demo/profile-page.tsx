import { getRouteApi } from '@tanstack/react-router'

import { Dossier } from './dossier'
import { DossierActions } from './dossier-actions'
import { ProfileBackLink } from './profile-back-link'
import { useDemoLanguage } from './use-demo-language'

const profileRoute = getRouteApi('/app/_search/players/$listingId')

/**
 * A listing's Profile beside the list; on phones its own screen with a link back to the list.
 */
export function ProfilePage() {
  const { strings } = useDemoLanguage()
  const { listing } = profileRoute.useLoaderData()

  return (
    <div className="flex flex-col gap-4">
      <ProfileBackLink position={listing.position} />
      {/* A new key per listing replays the cross-fade when another row opens. */}
      <Dossier
        key={listing.id}
        listing={listing}
        scoreNote={strings.dossier.scoreNote}
        scoreNoteShort={strings.dossier.scoreNoteShort}
        actions={<DossierActions listing={listing} />}
      />
    </div>
  )
}
