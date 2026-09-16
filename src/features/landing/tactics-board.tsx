import { useId, useRef } from 'react'

import { BoardCaption } from './board-caption'
import { ChalkPitch } from './chalk-pitch'
import { PlayerSlot } from './player-slot'
import { SAMPLE_PLAYERS, type SamplePlayer } from './sample-players'
import { type LandingStrings } from './strings'
import { TourControl } from './tour-control'
import { useLandingLanguage } from './use-landing-language'
import { usePositionTour } from './use-position-tour'

function describePlayer(player: SamplePlayer, strings: LandingStrings): string {
  const details = [
    `${player.firstName} ${player.lastName}`,
    strings.positions[player.position].name,
    player.club,
    `${strings.board.age} ${player.age}`,
    `${player.stat.value} ${strings.board.units[player.stat.unit]}`,
  ]
  return (player.isPromoted ? [...details, strings.board.promoted] : details).join(', ')
}

/**
 * The hero's board of eleven sample players. Assistive technology reads the caption and a
 * list of the players; the pitch and the chips are drawn for sighted visitors only. The
 * position tour marks the line on show in `data-highlight`, and CSS lifts and dims the chips.
 */
export function TacticsBoard() {
  const { strings } = useLandingLanguage()
  const captionId = useId()
  const tourControlRef = useRef<HTMLButtonElement>(null)
  const tour = usePositionTour(tourControlRef)

  return (
    <figure
      aria-labelledby={captionId}
      data-highlight={tour.highlight}
      className="grid w-full max-w-110 grid-cols-1 gap-y-3 md:self-center board:w-184 board:max-w-none board:grid-cols-[1fr_auto] board:gap-y-3.5 xl:shrink-0 xl:self-start"
    >
      <figcaption className="flex min-h-11.25 animate-copy-rise items-center gap-3 text-[15px] leading-[normal] font-semibold text-ink board:min-h-6.75">
        <BoardCaption id={captionId} highlight={tour.highlight} />
        {tour.status === 'off' ? null : (
          <TourControl
            ref={tourControlRef}
            isPaused={tour.status !== 'playing'}
            onPress={tour.status === 'playing' ? tour.pause : tour.resume}
          />
        )}
      </figcaption>
      <p className="row-start-3 text-xs leading-[normal] text-muted board:col-start-2 board:row-start-1 board:self-center board:text-[13px]">
        {strings.board.sampleNote}
      </p>
      <div
        className="@container relative row-start-2 aspect-350/470 overflow-clip rounded-[16px] bg-signal-deep board:col-span-2 board:aspect-736/540 board:rounded-[20px]"
        onPointerEnter={(event) => {
          // A finger landing on the board is usually the start of a scroll, not a look.
          if (tour.status === 'playing' && event.pointerType !== 'touch') {
            tour.pause()
          }
        }}
      >
        {/* The glow is a circle centred on the pitch: 420 px on the 350 px board, 620 px on the 736 px one. */}
        <div className="absolute top-1/2 left-1/2 aspect-square w-[120%] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,var(--board-glow),transparent)] opacity-90 board:w-155" />
        <ChalkPitch layout="compact" />
        <ChalkPitch layout="full" />
        <ul className="sr-only">
          {SAMPLE_PLAYERS.map((player) => (
            <li key={player.id}>{describePlayer(player, strings)}</li>
          ))}
        </ul>
        <div aria-hidden="true">
          {SAMPLE_PLAYERS.map((player, cascadeIndex) => (
            <PlayerSlot key={player.id} player={player} cascadeIndex={cascadeIndex} />
          ))}
        </div>
      </div>
    </figure>
  )
}
