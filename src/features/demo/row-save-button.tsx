import { type Listing } from '#/features/sample-listings/sample-listings'
import { cn } from '#/lib/utils'

import { fillTemplate } from './format'
import { BookmarkIcon } from './icons/bookmark-icon'
import { fullName } from './listing-text'
import { useDemoLanguage } from './use-demo-language'
import { useShortlist } from './use-shortlist'

interface RowSaveButtonProps {
  readonly listing: Listing
  readonly onRemoved: ((listing: Listing) => void) | undefined
}

/**
 * Save on a row. The shortlist lives on this device, so the server renders the empty mark
 * and the saved state appears after hydration.
 */
export function RowSaveButton({ listing, onRemoved }: RowSaveButtonProps) {
  const { strings } = useDemoLanguage()
  const shortlist = useShortlist()
  const isSaved = shortlist.ids?.includes(listing.id) ?? false
  const name = fullName(listing)

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={fillTemplate(isSaved ? strings.list.removeLabel : strings.list.saveLabel, {
        name,
      })}
      className={cn(
        'relative z-10 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-md transition-colors duration-150 lg:size-9',
        isSaved ? 'text-signal' : 'text-muted hover:text-ink',
      )}
      onClick={() => {
        if (isSaved) {
          shortlist.remove(listing.id)
          onRemoved?.(listing)
        } else {
          shortlist.save(listing.id)
        }
      }}
    >
      <BookmarkIcon isFilled={isSaved} className="size-4.5" />
    </button>
  )
}
