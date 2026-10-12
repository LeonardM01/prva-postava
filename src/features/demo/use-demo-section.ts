import { useLocation } from '@tanstack/react-router'

/**
 * Which part of the demo the address is in, for the nav's current link.
 */
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
