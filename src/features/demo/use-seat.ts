import { useDemoSection } from './use-demo-section'

/**
 * Which side of the marketplace the visitor is looking from. The player seat is its own
 * address, so a link to it works in a pitch.
 */
export type Seat = 'club' | 'player'

export function useSeat(): Seat {
  return useDemoSection() === 'me' ? 'player' : 'club'
}
