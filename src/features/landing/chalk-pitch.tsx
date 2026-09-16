import { cn } from '#/lib/utils'

import { BOARD_LAYOUT_VISIBILITY, BOARD_SIZE, type BoardLayout } from './board-layout'

// A penalty box or goal area, centred horizontally on the pitch.
interface PitchBox {
  readonly height: number
  readonly width: number
  readonly y: number
}

interface PitchGeometry {
  readonly boxes: readonly PitchBox[]
  readonly centreRadius: number
  readonly cornerRadius: number
  readonly inset: number
}

// The chalk drawings from Figma. Mobile is its own drawing, not a scaled desktop pitch:
// it has a tighter inset, a smaller centre circle and no goal areas.
const PITCHES = {
  full: {
    inset: 24,
    cornerRadius: 6,
    centreRadius: 60,
    boxes: [
      { y: 24, width: 300, height: 100 },
      { y: 24, width: 140, height: 40 },
      { y: 416, width: 300, height: 100 },
      { y: 476, width: 140, height: 40 },
    ],
  },
  compact: {
    inset: 16,
    cornerRadius: 4,
    centreRadius: 45,
    boxes: [
      { y: 16, width: 180, height: 64 },
      { y: 390, width: 180, height: 64 },
    ],
  },
} as const satisfies Record<BoardLayout, PitchGeometry>

// Strokes sit on the inside of each shape, as Figma draws them.
const STROKE = 1.5
const HALF_STROKE = STROKE / 2

interface ChalkPitchProps {
  readonly layout: BoardLayout
}

export function ChalkPitch({ layout }: ChalkPitchProps) {
  const pitch = PITCHES[layout]
  const { width, height } = BOARD_SIZE[layout]
  const centreX = width / 2
  const centreY = height / 2

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className={cn('absolute inset-0 size-full', BOARD_LAYOUT_VISIBILITY[layout])}
    >
      <g className="animate-chalk-draw fill-none stroke-white/30" strokeWidth={STROKE}>
        <rect
          pathLength={1}
          x={pitch.inset + HALF_STROKE}
          y={pitch.inset + HALF_STROKE}
          width={width - 2 * pitch.inset - STROKE}
          height={height - 2 * pitch.inset - STROKE}
          rx={pitch.cornerRadius - HALF_STROKE}
        />
        <line
          pathLength={1}
          x1={pitch.inset}
          y1={centreY - HALF_STROKE}
          x2={width - pitch.inset}
          y2={centreY - HALF_STROKE}
        />
        <circle pathLength={1} cx={centreX} cy={centreY} r={pitch.centreRadius - HALF_STROKE} />
        {pitch.boxes.map((box) => (
          <rect
            key={`${box.y}-${box.width}`}
            pathLength={1}
            x={centreX - box.width / 2 + HALF_STROKE}
            y={box.y + HALF_STROKE}
            width={box.width - STROKE}
            height={box.height - STROKE}
          />
        ))}
      </g>
      <circle cx={centreX} cy={centreY} r={3} className="fill-white/30" />
    </svg>
  )
}
