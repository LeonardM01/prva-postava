import { z } from 'zod'

import { LEAGUES } from './leagues'
import { POSITIONS } from './positions'

export const CONTRACT_STATUSES = ['underContract', 'expiringThisSeason', 'freeAgent'] as const

export type ContractStatus = (typeof CONTRACT_STATUSES)[number]

export const PREFERRED_FEET = ['left', 'right', 'both'] as const

export type PreferredFoot = (typeof PREFERRED_FEET)[number]

export const NATIONALITIES = ['HR', 'BA', 'RS', 'SI', 'XK', 'NG', 'BR', 'MK', 'AL'] as const

export type Nationality = (typeof NATIONALITIES)[number]

const seasonSchema = z.object({
  matches: z.int().nonnegative(),
  minutes: z.int().nonnegative(),
  goals: z.int().nonnegative(),
  assists: z.int().nonnegative(),
  // Goalkeepers only.
  cleanSheets: z.int().nonnegative().optional(),
})

export type Season = z.infer<typeof seasonSchema>

const lastSeasonSchema = seasonSchema.extend({ league: z.enum(LEAGUES) })

export type LastSeason = z.infer<typeof lastSeasonSchema>

/**
 * One sample listing as the generator writes it. Everything derived (line, score, rank and the
 * position's range) is computed by the data module, so the file holds only what a player would
 * publish, plus the demo's fixed seen-by-clubs numbers.
 */
export const generatedListingSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  age: z.int().min(18).max(34),
  nationality: z.enum(NATIONALITIES),
  preferredFoot: z.enum(PREFERRED_FEET),
  heightCm: z.int().min(150).max(210),
  club: z.string().min(1),
  league: z.enum(LEAGUES),
  position: z.enum(POSITIONS),
  contractStatus: z.enum(CONTRACT_STATUSES),
  thisSeason: seasonSchema,
  lastSeason: lastSeasonSchema,
  isPromoted: z.boolean(),
  // Shown only to the player, in the player seat.
  seenByClubs: z.object({ thisWeek: z.int().nonnegative(), lastWeek: z.int().nonnegative() }),
  // A clip address once one exists; without one the profile shows the placeholder plate.
  highlightsUrl: z.string().min(1).optional(),
})

export type GeneratedListing = z.infer<typeof generatedListingSchema>

export const generatedListingsSchema = z.array(generatedListingSchema)
