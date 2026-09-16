import { useEffect, useState, useSyncExternalStore } from 'react'

import { type PlayerLine } from './sample-players'

export type TourStop = 'all' | PlayerLine

export const TOUR_LOOP = ['GK', 'DEF', 'MID', 'FWD', 'all'] as const satisfies readonly TourStop[]

// The board opens on every position, then runs the loop twice and rests on the last stop.
const TOUR_STOPS: readonly TourStop[] = ['all', ...TOUR_LOOP, ...TOUR_LOOP]
const LAST_STOP_INDEX = TOUR_STOPS.length - 1

// Every stop shows for the same time, the opening one included, so the first line lights up
// shortly after the load cascade (about 0.9 s) has landed the chips.
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
    // The server cannot know the preference, so the tour waits for the client.
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

function stopAt(index: number): TourStop {
  const stop = TOUR_STOPS[index]
  if (stop === undefined) {
    throw new Error(`The position tour has no stop ${String(index)}`)
  }
  return stop
}

interface PositionTour {
  readonly highlight: TourStop
  readonly pause: () => void
}

/**
 * The board's position tour. It highlights one line after another for two loops and rests on
 * every position. Pointer-over the board, or any click or form focus on the page, stops it for
 * good. With reduced motion it never runs and the board stays on every position.
 */
export function usePositionTour(): PositionTour {
  const canTour = useCanTour()
  const [stopIndex, setStopIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const isPlaying = canTour && !isPaused && stopIndex < LAST_STOP_INDEX

  useEffect(() => {
    if (!isPlaying) {
      return
    }
    const timeout = window.setTimeout(() => {
      setStopIndex((index) => index + 1)
    }, STOP_DWELL_MS)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [isPlaying, stopIndex])

  useEffect(() => {
    if (!isPlaying) {
      return
    }
    const pauseOnInteraction = (event: Event) => {
      if (isPageInteraction(event)) {
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
  }, [isPlaying])

  return {
    highlight: canTour ? stopAt(stopIndex) : 'all',
    pause: () => {
      setIsPaused(true)
    },
  }
}
