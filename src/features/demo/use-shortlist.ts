import { useSyncExternalStore } from 'react'

import {
  readShortlist,
  removeFromShortlist,
  saveToShortlist,
  subscribeToShortlist,
} from './shortlist-store'

interface Shortlist {
  // Undefined on the server and during hydration: the shortlist lives on this device only.
  readonly ids: readonly string[] | undefined
  readonly remove: (id: string) => void
  readonly save: (id: string) => void
}

function readNothingOnTheServer() {
  return undefined
}

export function useShortlist(): Shortlist {
  const ids = useSyncExternalStore(subscribeToShortlist, readShortlist, readNothingOnTheServer)
  return { ids, save: saveToShortlist, remove: removeFromShortlist }
}
