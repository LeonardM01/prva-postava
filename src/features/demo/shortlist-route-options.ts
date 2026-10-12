import { z } from 'zod'

const openedSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/)
  .optional()
  .catch(undefined)

export interface ShortlistSearch {
  // The saved listing whose dossier is open; absent opens the newest.
  readonly listing?: string
}

function validateShortlistSearch(search: Readonly<Record<string, unknown>>): ShortlistSearch {
  // Every key, even when undefined: the router lays this over the raw params.
  return { listing: openedSchema.parse(search.listing) }
}

export const SHORTLIST_ROUTE_OPTIONS = {
  validateSearch: validateShortlistSearch,
}
