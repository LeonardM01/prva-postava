import { cva } from 'class-variance-authority'
import { type Ref } from 'react'

import { PauseIcon } from './pause-icon'
import { PlayIcon } from './play-icon'
import { useLandingLanguage } from './use-landing-language'

const tourControlVariants = cva(
  'flex h-11.25 items-center gap-1.5 rounded-full border px-2.5 text-[13px] leading-[normal] font-medium whitespace-nowrap transition-colors duration-150 board:h-6.75',
  {
    variants: {
      isPaused: {
        true: 'border-signal bg-tint text-signal',
        false: 'border-line bg-card text-ink hover:border-signal',
      },
    },
  },
)

interface TourControlProps {
  readonly isPaused: boolean
  readonly onPause: () => void
  readonly onResume: () => void
  readonly ref: Ref<HTMLButtonElement>
}

/**
 * Stops and restarts the position tour (WCAG 2.2.2). Its label says what pressing it does.
 */
export function TourControl({ isPaused, onPause, onResume, ref }: TourControlProps) {
  const { strings } = useLandingLanguage()

  return (
    <button
      ref={ref}
      type="button"
      className={tourControlVariants({ isPaused })}
      onClick={() => {
        if (isPaused) {
          onResume()
        } else {
          onPause()
        }
      }}
    >
      {isPaused ? <PlayIcon /> : <PauseIcon />}
      {isPaused ? strings.board.tour.resume : strings.board.tour.pause}
    </button>
  )
}
