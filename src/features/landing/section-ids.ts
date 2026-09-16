/**
 * In-page anchors the nav and footer point at; the sections themselves adopt these ids.
 */
export const SECTION_IDS = {
  clubs: 'for-clubs',
  players: 'for-players',
  cta: 'get-in-the-lineup',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]
