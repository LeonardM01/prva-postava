import { type Role } from '#/features/landing/role-context'

import { ClubSearchIcon } from './club-search-icon'
import { BANNER_QR_STRINGS } from './strings'

interface SideMarkProps {
  readonly role: Role
}

/**
 * The square at the start of a door: the player gets the banner card's "TI" on signal green,
 * the club a drawn search glass on tint, so the doors differ by more than their words.
 */
export function SideMark({ role }: SideMarkProps) {
  switch (role) {
    case 'player': {
      return (
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-signal font-display text-[15px] font-extrabold tracking-[0.02em] text-card"
        >
          {BANNER_QR_STRINGS.doors.player.mark}
        </span>
      )
    }
    case 'club': {
      return (
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-tint text-signal"
        >
          <ClubSearchIcon />
        </span>
      )
    }
  }
}
