// The brand mark is a 4-3-3 lineup read top to bottom: forwards, midfield, defence, keeper.
// Its dot colours are part of the logo and stay fixed, so they are not palette tokens.
const LINE_COLOURS = {
  forward: '#D0342C',
  midfield: '#1F8A4C',
  defence: '#2E56D6',
  keeper: '#E0A22E',
} as const

type Line = keyof typeof LINE_COLOURS

interface Dot {
  readonly cx: number
  readonly cy: number
  readonly line: Line
}

interface MarkGeometry {
  readonly dots: readonly Dot[]
  readonly height: number
  readonly radius: number
  readonly width: number
}

// Two drawings from Figma rather than one scaled: the footer size re-spaces the back four.
const MARKS = {
  nav: {
    width: 26,
    height: 27,
    radius: 2.25,
    dots: [
      { cx: 5, cy: 3.25, line: 'forward' },
      { cx: 13, cy: 3.25, line: 'forward' },
      { cx: 21, cy: 3.25, line: 'forward' },
      { cx: 5, cy: 10.25, line: 'midfield' },
      { cx: 13, cy: 10.25, line: 'midfield' },
      { cx: 21, cy: 10.25, line: 'midfield' },
      { cx: 2, cy: 17.25, line: 'defence' },
      { cx: 9.5, cy: 17.25, line: 'defence' },
      { cx: 16.5, cy: 17.25, line: 'defence' },
      { cx: 24, cy: 17.25, line: 'defence' },
      { cx: 13, cy: 24.25, line: 'keeper' },
    ],
  },
  footer: {
    width: 22,
    height: 22,
    radius: 2,
    dots: [
      { cx: 4, cy: 2.5, line: 'forward' },
      { cx: 11, cy: 2.5, line: 'forward' },
      { cx: 18, cy: 2.5, line: 'forward' },
      { cx: 4, cy: 8.5, line: 'midfield' },
      { cx: 11, cy: 8.5, line: 'midfield' },
      { cx: 18, cy: 8.5, line: 'midfield' },
      { cx: 1.5, cy: 14.5, line: 'defence' },
      { cx: 7.8, cy: 14.5, line: 'defence' },
      { cx: 14.2, cy: 14.5, line: 'defence' },
      { cx: 20.5, cy: 14.5, line: 'defence' },
      { cx: 11, cy: 20.5, line: 'keeper' },
    ],
  },
} as const satisfies Record<string, MarkGeometry>

interface LineupMarkProps {
  readonly placement: keyof typeof MARKS
}

export function LineupMark({ placement }: LineupMarkProps) {
  const mark = MARKS[placement]

  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      width={mark.width}
      height={mark.height}
      viewBox={`0 0 ${mark.width} ${mark.height}`}
    >
      {mark.dots.map((dot) => (
        <circle
          key={`${dot.cx}-${dot.cy}`}
          cx={dot.cx}
          cy={dot.cy}
          r={mark.radius}
          fill={LINE_COLOURS[dot.line]}
        />
      ))}
    </svg>
  )
}
