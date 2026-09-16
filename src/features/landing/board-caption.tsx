import { useLandingLanguage } from './use-landing-language'
import { TOUR_LOOP, type TourStop } from './use-position-tour'

interface BoardCaptionProps {
  readonly highlight: TourStop
  readonly id: string
}

/**
 * Every caption the tour can show, stacked in one cell so they cross-fade in place. Only the
 * current one is exposed, so the board is named after what it shows.
 */
export function BoardCaption({ highlight, id }: BoardCaptionProps) {
  const { strings } = useLandingLanguage()

  return (
    <span id={id} className="grid">
      {TOUR_LOOP.map((stop) => (
        <span
          key={stop}
          aria-hidden={stop !== highlight}
          className="col-start-1 row-start-1 transition-[opacity,visibility] duration-320 ease-settle aria-hidden:invisible aria-hidden:opacity-0"
        >
          {stop === 'all' ? strings.board.caption : strings.board.lines[stop]}
        </span>
      ))}
    </span>
  )
}
