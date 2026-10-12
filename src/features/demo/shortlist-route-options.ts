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
  const listing = openedSchema.parse(search.listing)
  return listing === undefined ? {} : { listing }
}

export const SHORTLIST_ROUTE_OPTIONS = {
  validateSearch: validateShortlistSearch,
}
