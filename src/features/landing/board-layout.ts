/**
 * `full` is the desktop and tablet board with full chips, `compact` the mobile board with
 * badge, surname and number. The `board` breakpoint picks one; both are in the markup.
 */
export type BoardLayout = 'compact' | 'full'

interface BoardSize {
  readonly height: number
  readonly width: number
}

export const BOARD_SIZE = {
  full: { width: 736, height: 540 },
  compact: { width: 350, height: 470 },
} as const satisfies Record<BoardLayout, BoardSize>

export const BOARD_LAYOUT_VISIBILITY = {
  full: 'hidden board:block',
  compact: 'board:hidden',
} as const satisfies Record<BoardLayout, string>
