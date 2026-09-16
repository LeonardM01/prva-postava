/**
 * In-page anchors the nav, footer and section links point at; the sections and demos
 * themselves adopt these ids.
 */
export const SECTION_IDS = {
  clubs: 'for-clubs',
  clubSearch: 'club-search',
  players: 'for-players',
  playerProfile: 'player-profile',
  cta: 'get-in-the-lineup',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]
