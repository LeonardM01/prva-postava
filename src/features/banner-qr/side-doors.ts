import { type Role } from '#/features/landing/role-context'

/**
 * Players first: the banners are written to players, clubs are the second door.
 */
export const SIDE_DOOR_ORDER = ['player', 'club'] as const satisfies readonly Role[]

/**
 * Every scan is tagged as the match-day banner campaign, so PostHog can tell banner visits
 * apart from search and shared links.
 */
const BANNER_CAMPAIGN = {
  utm_source: 'banner',
  utm_medium: 'qr',
  utm_campaign: 'match-day',
} as const

/**
 * The home page's search for a door: it opens on `role`'s side.
 */
export function sideDoorSearch(role: Role) {
  return { role, ...BANNER_CAMPAIGN }
}
