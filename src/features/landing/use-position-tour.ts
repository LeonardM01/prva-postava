import { type RefObject, useEffect, useState, useSyncExternalStore } from 'react'

import { type PlayerLine } from './sample-players'

export type TourStop = 'all' | PlayerLine

export const TOUR_LOOP = ['GK', 'DEF', 'MID', 'FWD', 'all'] as const satisfies readonly TourStop[]

// The board opens on every position, then runs the loop twice and rests on the last stop.
const TOUR_STOPS: readonly TourStop[] = ['all', ...TOUR_LOOP, ...TOUR_LOOP]
const LAST_STOP_INDEX = TOUR_STOPS.length - 1
// Going again skips the opening stop: the board already shows every position.
const REPLAY_STOP_INDEX = 1

// The load cascade ends when the promoted tag lands (600 ms delay plus 320 ms, see styles.css).
const LOAD_CASCADE_MS = 920
const OPENING_DWELL_MS = LOAD_CASCADE_MS + 1800
const STOP_DWELL_MS = 1400

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// Clicks on these count as interacting with the page; focus counts only for form fields.
const INTERACTIVE_SELECTOR = 'a[href], button, input, label, select, textarea'
const FORM_FIELD_SELECTOR = 'input, select, textarea'

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener('change', onChange)
  return () => {
    query.removeEventListener('change', onChange)
  }
}

function useCanTour(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => !window.matchMedia(REDUCED_MOTION_QUERY).matches,
    // The server cannot know the preference, so the tour and its control wait for the client.
    () => false,
  )
}

function isPageInteraction(event: Event): boolean {
  if (!(event.target instanceof Element)) {
    return false
  }
  const selector = event.type === 'focusin' ? FORM_FIELD_SELECTOR : INTERACTIVE_SELECTOR
  return event.target.closest(selector) !== null
}

interface TourOff {
  readonly highlight: 'all'
  readonly status: 'off'
}

interface TourPlaying {
  readonly highlight: TourStop
  readonly pause: () => void
  readonly status: 'playing'
}

// Paused mid-tour, or finished and resting on every position. Resuming a finished tour replays it.
interface TourStopped {
  readonly highlight: TourStop
  readonly resume: () => void
  readonly status: 'finished' | 'paused'
}

export type PositionTour = TourOff | TourPlaying | TourStopped

function stopAt(index: number): TourStop {
  const stop = TOUR_STOPS[index]
  if (stop === undefined) {
    throw new Error(`The position tour has no stop ${String(index)}`)
  }
  return stop
}

/**
 * The board's position tour. It waits for the load cascade, highlights one line after another
 * for two loops and rests on every position. Pausing is sticky: pointer-over the board, the
 * control, or any click or form focus elsewhere on the page stops it until it is resumed.
 * Resuming once it has finished plays it again. With reduced motion it is `off` and stays on
 * every position. `controlRef` is the tour
 * control, whose own clicks do not count as interacting with the page.
 */
export function usePositionTour(controlRef: RefObject<HTMLElement | null>): PositionTour {
  const canTour = useCanTour()
  const [stopIndex, setStopIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const status = resolveStatus({ canTour, isPaused, stopIndex })
  const highlight = stopAt(stopIndex)

  useEffect(() => {
    if (status !== 'playing') {
      return
    }
    const timeout = window.setTimeout(
      () => {
        setStopIndex((index) => index + 1)
      },
      stopIndex === 0 ? OPENING_DWELL_MS : STOP_DWELL_MS,
    )
    return () => {
      window.clearTimeout(timeout)
    }
  }, [status, stopIndex])

  useEffect(() => {
    if (status !== 'playing') {
      return
    }
    const pauseOnInteraction = (event: Event) => {
      const isOnControl =
        event.target instanceof Node && controlRef.current?.contains(event.target) === true
      if (!isOnControl && isPageInteraction(event)) {
        setIsPaused(true)
      }
    }
    // Capture, so an element that stops propagation still counts as an interaction.
    const options = { capture: true }
    document.addEventListener('click', pauseOnInteraction, options)
    document.addEventListener('focusin', pauseOnInteraction, options)
    return () => {
      document.removeEventListener('click', pauseOnInteraction, options)
      document.removeEventListener('focusin', pauseOnInteraction, options)
    }
  }, [controlRef, status])

  switch (status) {
    case 'off': {
      return { status, highlight: 'all' }
    }
    case 'playing': {
      return {
        status,
        highlight,
        pause: () => {
          setIsPaused(true)
        },
      }
    }
    case 'finished':
    case 'paused': {
      return {
        status,
        highlight,
        resume: () => {
          setIsPaused(false)
          if (status === 'finished') {
            setStopIndex(REPLAY_STOP_INDEX)
          }
        },
      }
    }
  }
}

interface TourState {
  readonly canTour: boolean
  readonly isPaused: boolean
  readonly stopIndex: number
}

function resolveStatus({ canTour, isPaused, stopIndex }: TourState): PositionTour['status'] {
  if (!canTour) {
    return 'off'
  }
  if (stopIndex === LAST_STOP_INDEX) {
    return 'finished'
  }
  return isPaused ? 'paused' : 'playing'
}
