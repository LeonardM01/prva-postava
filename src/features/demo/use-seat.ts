import { useLocation } from '@tanstack/react-router'

/**
 * Which side of the marketplace the visitor is looking from. The player seat is its own
 * address, so a link to it works in a pitch.
 */
export type Seat = 'club' | 'player'

export type DemoSection = 'me' | 'players' | 'shortlist'

export function useDemoSection(): DemoSection {
  return useLocation({
    select: (location) => {
      if (location.pathname.startsWith('/app/me')) {
        return 'me'
      }
      return location.pathname.startsWith('/app/shortlist') ? 'shortlist' : 'players'
    },
  })
}

export function useSeat(): Seat {
  return useDemoSection() === 'me' ? 'player' : 'club'
}
