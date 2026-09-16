import { useId } from 'react'

import { ProfileStats } from './profile-stats'
import { SAMPLE_PROFILE } from './sample-listings'
import { SECTION_IDS } from './section-ids'
import { StarIcon } from './star-icon'
import { useLandingLanguage } from './use-landing-language'

/**
 * A picture of a player's listing. The promote control has nowhere to go yet, so it is drawn
 * as static text rather than a button that does nothing.
 */
export function PlayerFactSheet() {
  const { strings } = useLandingLanguage()
  const captionId = useId()
  const { listing, seenByClubsThisWeek } = SAMPLE_PROFILE
  const copy = strings.players

  return (
    <figure
      id={SECTION_IDS.playerProfile}
      aria-labelledby={captionId}
      className="flex w-full flex-col gap-4 md:max-w-160 board:gap-5 xl:max-w-none xl:min-w-0 xl:flex-1"
    >
      <div className="flex items-center gap-3 leading-[normal] board:gap-4">
        <span
          aria-hidden="true"
          className="flex size-13 shrink-0 items-center justify-center rounded-full bg-tint font-display text-lg font-bold text-signal board:size-16 board:text-[22px]"
        >
          {listing.firstName.charAt(0)}
          {listing.lastName.charAt(0)}
        </span>
        <div className="flex min-w-0 flex-col gap-0.5 board:gap-0.75">
          <p className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink board:text-[28px]">
            {listing.firstName} {listing.lastName}
          </p>
          <p className="text-[13px] text-muted board:text-[15px]">
            {strings.positions[listing.position].name} · {listing.age} · {listing.club}
            <span className="max-board:hidden"> · {listing.league}</span>
          </p>
        </div>
      </div>
      <p className="flex items-center gap-1.5 rounded-lg bg-amber-wash px-3 py-2 text-[13px] leading-[normal] font-semibold text-ink board:gap-2 board:px-3.5 board:py-2.5 board:text-sm">
        <StarIcon className="size-2.75 shrink-0 text-amber board:size-3" />
        {copy.promotedUntil}
      </p>
      <ProfileStats listing={listing} />
      <dl className="flex items-center justify-between border-t border-line pt-4 leading-[normal] board:pt-5">
        <dt className="text-sm text-muted board:text-[15px]">{copy.seenByClubs}</dt>
        <dd className="font-display text-2xl font-extrabold tracking-[-0.02em] text-signal board:text-[28px]">
          {seenByClubsThisWeek}
        </dd>
      </dl>
      <p className="rounded-[10px] bg-signal py-3.75 text-center text-sm leading-[normal] font-semibold text-card board:w-fit board:px-4.5 board:py-2.75">
        {copy.promote}
      </p>
      <figcaption id={captionId} className="text-xs text-muted board:text-[13px]">
        {copy.demoCaption}
      </figcaption>
    </figure>
  )
}
