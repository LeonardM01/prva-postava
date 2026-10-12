import { type Listing } from '#/features/sample-listings/sample-listings'
import { cn } from '#/lib/utils'

import { fillTemplate } from './format'
import { BookmarkIcon } from './icons/bookmark-icon'
import { fullName } from './listing-text'
import { useDemoLanguage } from './use-demo-language'
import { useSavedToggle } from './use-saved-toggle'

interface RowSaveButtonProps {
  readonly listing: Listing
}

/**
 * Save on a row. The shortlist lives on this device, so the server renders the empty mark
 * and the saved state appears after hydration.
 */
export function RowSaveButton({ listing }: RowSaveButtonProps) {
  const { strings } = useDemoLanguage()
  const { isSaved, toggle } = useSavedToggle(listing)
  const name = fullName(listing)

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={fillTemplate(isSaved ? strings.list.removeLabel : strings.list.saveLabel, {
        name,
      })}
      className={cn(
        'relative z-10 -mr-1.5 flex h-11 w-8 shrink-0 items-center justify-center rounded-md transition-colors duration-150 lg:h-9',
        isSaved ? 'text-signal' : 'text-muted hover:text-ink',
      )}
      onClick={toggle}
    >
      <BookmarkIcon isFilled={isSaved} className="size-4.5" />
    </button>
  )
}
