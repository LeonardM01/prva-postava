import { z } from 'zod'

import { findListing } from '#/features/sample-listings/sample-listings'

const STORAGE_KEY = 'prva-postava.demo.shortlist'

// A first visit starts with three players, newest first, so the page is never blank in a pitch.
const SEEDED_IDS: readonly string[] = ['marko-kovacevic', 'ivan-horvat', 'petar-filipovic']

const storedIdsSchema = z.array(z.string())

const listeners = new Set<() => void>()

interface ParsedShortlist {
  ids: readonly string[]
  raw: null | string | undefined
}

// The last stored value and its parse, so React sees the same array until the value changes.
const parsed: ParsedShortlist = { raw: undefined, ids: SEEDED_IDS }

// A stored value the demo cannot read starts the visitor over from the seed: there is nothing
// else to recover, and a broken shortlist must not break the page. It is still reported.
function parseStoredIds(raw: null | string): readonly string[] {
  if (raw === null) {
    return SEEDED_IDS
  }
  try {
    const result = storedIdsSchema.safeParse(JSON.parse(raw))
    if (result.success) {
      // Ids from an older data set are dropped rather than shown as blank rows.
      return result.data.filter((id) => findListing(id) !== undefined)
    }
    console.warn(
      'The saved shortlist is not a list of ids; starting from the sample one',
      result.error,
    )
  } catch (error) {
    console.warn('The saved shortlist is not JSON; starting from the sample one', error)
  }
  return SEEDED_IDS
}

/**
 * The saved listing ids, newest first.
 */
export function readShortlist(): readonly string[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw !== parsed.raw) {
    parsed.raw = raw
    parsed.ids = parseStoredIds(raw)
  }
  return parsed.ids
}

function writeShortlist(ids: readonly string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  for (const listener of listeners) {
    listener()
  }
}

export function saveToShortlist(id: string) {
  const ids = readShortlist()
  if (!ids.includes(id)) {
    writeShortlist([id, ...ids])
  }
}

export function removeFromShortlist(id: string) {
  writeShortlist(readShortlist().filter((savedId) => savedId !== id))
}

/**
 * Notifies on changes from this tab and, through the `storage` event, from other tabs.
 */
export function subscribeToShortlist(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}
