import { useId, useRef, useState } from 'react'

import { actionButtonVariants } from '#/components/action-button-variants'
import { type Listing } from '#/features/sample-listings/sample-listings'
import { cn } from '#/lib/utils'

import { useDemoLanguage } from './use-demo-language'
import { useShortlist } from './use-shortlist'

interface DossierActionsProps {
  readonly listing: Listing
}

/**
 * Save to shortlist and Contact player. Contact opens a note under the buttons, not a modal:
 * the promise is visible without inventing the method. Phones put Contact first, full width.
 */
export function DossierActions({ listing }: DossierActionsProps) {
  const { strings } = useDemoLanguage()
  const shortlist = useShortlist()
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const contactRef = useRef<HTMLButtonElement>(null)
  const noteId = useId()
  const copy = strings.dossier
  const isSaved = shortlist.ids?.includes(listing.id) ?? false

  return (
    <div className="flex shrink-0 flex-col gap-3 lg:w-auto lg:items-end">
      <div className="flex flex-col-reverse gap-2.5 lg:flex-row">
        <button
          type="button"
          className={cn(
            actionButtonVariants({ tone: 'secondary', size: 'regular' }),
            'max-lg:h-12',
          )}
          onClick={() => {
            if (isSaved) {
              shortlist.remove(listing.id)
            } else {
              shortlist.save(listing.id)
            }
          }}
        >
          {isSaved ? copy.remove : copy.save}
        </button>
        <button
          ref={contactRef}
          type="button"
          aria-expanded={isNoteOpen}
          aria-controls={noteId}
          className={cn(actionButtonVariants({ tone: 'primary', size: 'regular' }), 'max-lg:h-12')}
          onClick={() => {
            setIsNoteOpen((wasOpen) => !wasOpen)
          }}
        >
          {copy.contact}
        </button>
      </div>
      <div
        id={noteId}
        hidden={!isNoteOpen}
        className="flex max-w-90 flex-col gap-2 rounded-xl border border-line bg-card p-4 text-left"
      >
        <p className="text-[15px] leading-[1.3] font-semibold text-ink">{copy.contactTitle}</p>
        <p className="text-sm leading-normal text-muted">{copy.contactBody}</p>
        <button
          type="button"
          className={cn(actionButtonVariants({ tone: 'secondary', size: 'small' }), 'w-fit')}
          onClick={() => {
            setIsNoteOpen(false)
            contactRef.current?.focus()
          }}
        >
          {copy.contactDismiss}
        </button>
      </div>
    </div>
  )
}
