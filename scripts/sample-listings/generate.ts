import { writeFile } from 'node:fs/promises'

import { type League } from '#/features/sample-listings/leagues'
import {
  type ContractStatus,
  type GeneratedListing,
  generatedListingsSchema,
  type LastSeason,
  type Nationality,
  type PreferredFoot,
  type Season,
} from '#/features/sample-listings/listing-schema'
import { LINE_BY_POSITION, type Position } from '#/features/sample-listings/positions'

// Writes the demo's sample listings: invented players at invented clubs in real league names.
// Seeded, so two runs write the same file. Run with `bun run generate-sample-listings` and commit
// the JSON it writes.
//
// Every club name here is invented. Check each against the Semafor competition pages for its
// league before the demo is shown; replace any name that exists.

const OUTPUT = new URL('../../src/features/sample-listings/sample-listings.json', import.meta.url)

const SEED = 20_260_925
const GENERATED_COUNT = 80

// Positions weighted the way a squad is: more centre backs, midfielders and strikers.
const POSITION_POOL: readonly Position[] = [
  ...repeat('GK', 6),
  ...repeat('RB', 6),
  ...repeat('CB', 10),
  ...repeat('LB', 6),
  ...repeat('DM', 6),
  ...repeat('CM', 9),
  ...repeat('AM', 6),
  ...repeat('RM', 4),
  ...repeat('LM', 4),
  ...repeat('RW', 6),
  ...repeat('LW', 7),
  ...repeat('ST', 9),
]

// Weighted towards Treća NL, where the product is aimed.
const LEAGUE_POOL: readonly League[] = [
  ...repeat('Prva NL', 3),
  ...repeat('Druga NL', 8),
  ...repeat('Treća NL Centar', 12),
  ...repeat('Treća NL Zapad', 8),
  ...repeat('Treća NL Sjever', 7),
  ...repeat('Treća NL Istok', 7),
  ...repeat('Treća NL Jug', 8),
  ...repeat('Četvrta NL Središte Zagreb', 5),
  ...repeat('Četvrta NL Rijeka', 3),
  ...repeat('MŽNL Osijek–Vinkovci', 3),
  ...repeat('MŽNL Brod–Požega', 2),
  ...repeat('1. ŽNL Zagrebačka', 3),
  ...repeat('1. ŽNL Splitsko-dalmatinska', 2),
  ...repeat('1. ŽNL Istarska', 2),
]

// Invented clubs, each in one league so a club never plays in two.
const CLUBS: Readonly<Record<League, readonly string[]>> = {
  'Prva NL': ['NK Zelengrad', 'HNK Kameni Vrh'],
  'Druga NL': ['NK Modra Luka', 'NK Sunčev Dol', 'NŠK Ravnica', 'NK Zlatni Klas'],
  'Treća NL Centar': [
    'NK Borova Glava',
    'NK Stari Mlin',
    'NK Tri Lipe',
    'NK Jasenov Gaj',
    'NK Plavi Brijeg',
  ],
  'Treća NL Zapad': ['HNK Vjetrenik', 'NK Srebrna Draga', 'NK Hrastova Kosa'],
  'Treća NL Sjever': ['NK Vinski Vrh', 'NK Medvjeđi Dol', 'NK Sokolov Kamen'],
  'Treća NL Istok': ['NK Trnov Gaj', 'NK Bijela Ravan', 'HNK Žitno Polje'],
  'Treća NL Jug': ['NK Kamena Uvala', 'HNK Južni Greben', 'NK Maslinov Rt'],
  'Četvrta NL Središte Zagreb': ['NK Lisičji Jarak', 'NK Gornji Prelaz'],
  'Četvrta NL Rijeka': ['NK Kvarnerski Zaljev', 'NK Vrh Učke'],
  'MŽNL Osijek–Vinkovci': ['NK Dravska Obala', 'NK Zlatna Dolina'],
  'MŽNL Brod–Požega': ['NK Posavski Gaj'],
  '1. ŽNL Zagrebačka': ['NK Kestenov Breg', 'NK Zelena Livada'],
  '1. ŽNL Splitsko-dalmatinska': ['NK Sinjski Vrh'],
  '1. ŽNL Istarska': ['NK Crvena Zemlja'],
}

const FIRST_NAMES = [
  'Ivan',
  'Marko',
  'Luka',
  'Josip',
  'Ante',
  'Filip',
  'Petar',
  'Tomislav',
  'Karlo',
  'Niko',
  'Dario',
  'Matej',
  'Mateo',
  'Fran',
  'Bruno',
  'Lovro',
  'Toni',
  'Domagoj',
  'Dominik',
  'Leon',
  'Jakov',
  'Roko',
  'Šimun',
  'Vito',
  'Borna',
  'Noa',
  'David',
  'Mihael',
  'Antonio',
  'Stjepan',
  'Zvonimir',
  'Andrija',
  'Nikola',
  'Marin',
  'Damir',
] as const

const LAST_NAMES = [
  'Horvat',
  'Kovačević',
  'Babić',
  'Marić',
  'Jurić',
  'Novak',
  'Kovačić',
  'Vuković',
  'Knežević',
  'Vidović',
  'Petrović',
  'Matić',
  'Tomić',
  'Pavlović',
  'Kovač',
  'Božić',
  'Blažević',
  'Grgić',
  'Pavić',
  'Radić',
  'Perić',
  'Filipović',
  'Šarić',
  'Lovrić',
  'Vlahović',
  'Bašić',
  'Barišić',
  'Jukić',
  'Katić',
  'Cindrić',
  'Galić',
  'Brkić',
  'Mandić',
  'Šimić',
  'Rukavina',
] as const

interface ForeignName {
  readonly firstName: string
  readonly lastName: string
  readonly nationality: Nationality
}

// Many players in these leagues are not Croatian.
const FOREIGN_NAMES: readonly ForeignName[] = [
  { firstName: 'Amar', lastName: 'Hadžić', nationality: 'BA' },
  { firstName: 'Edin', lastName: 'Begović', nationality: 'BA' },
  { firstName: 'Nemanja', lastName: 'Stanković', nationality: 'RS' },
  { firstName: 'Žan', lastName: 'Zupančič', nationality: 'SI' },
  { firstName: 'Arbër', lastName: 'Krasniqi', nationality: 'XK' },
  { firstName: 'Chidi', lastName: 'Okafor', nationality: 'NG' },
  { firstName: 'Rafael', lastName: 'Nascimento', nationality: 'BR' },
  { firstName: 'Dejan', lastName: 'Trajkovski', nationality: 'MK' },
  { firstName: 'Blendi', lastName: 'Hoxha', nationality: 'AL' },
  { firstName: 'Mirza', lastName: 'Delić', nationality: 'BA' },
]

interface PinnedListing {
  readonly age: number
  readonly club: string
  readonly contractStatus: ContractStatus
  readonly firstName: string
  readonly heightCm: number
  readonly isPromoted: boolean
  readonly lastName: string
  readonly league: League
  readonly position: Position
  readonly preferredFoot: PreferredFoot
  readonly seenByClubs: GeneratedListing['seenByClubs']
  readonly thisSeason: Season
}

// The landing page's three left wings, first in the pool so they keep their landing numbers.
// Marko Kovačević is the player seat's sample player, so his seen-by-clubs numbers are fixed.
const LANDING_LEFT_WINGS: readonly PinnedListing[] = [
  {
    firstName: 'Ivan',
    lastName: 'Horvat',
    position: 'LW',
    age: 22,
    club: 'NK Borova Glava',
    league: 'Treća NL Centar',
    isPromoted: true,
    thisSeason: { matches: 24, minutes: 1980, goals: 9, assists: 6 },
    preferredFoot: 'left',
    heightCm: 176,
    contractStatus: 'expiringThisSeason',
    seenByClubs: { thisWeek: 7, lastWeek: 5 },
  },
  {
    firstName: 'Marko',
    lastName: 'Kovačević',
    position: 'LW',
    age: 20,
    club: 'NK Stari Mlin',
    league: 'Treća NL Centar',
    isPromoted: false,
    thisSeason: { matches: 19, minutes: 1540, goals: 5, assists: 8 },
    preferredFoot: 'left',
    heightCm: 174,
    contractStatus: 'underContract',
    seenByClubs: { thisWeek: 7, lastWeek: 4 },
  },
  {
    firstName: 'Luka',
    lastName: 'Babić',
    position: 'LW',
    age: 24,
    club: 'NK Modra Luka',
    league: 'Druga NL',
    isPromoted: false,
    thisSeason: { matches: 26, minutes: 2210, goals: 11, assists: 4 },
    preferredFoot: 'right',
    heightCm: 181,
    contractStatus: 'expiringThisSeason',
    seenByClubs: { thisWeek: 5, lastWeek: 3 },
  },
]

// The other eight players on the landing page's tactics board, with the statistic the board
// shows. Added after the generated pool, from their own random stream, so the pool stays as
// the Figma frames show it.
const LANDING_BOARD_PLAYERS: readonly PinnedListing[] = [
  {
    firstName: 'Karlo',
    lastName: 'Bašić',
    position: 'GK',
    age: 28,
    club: 'NK Tri Lipe',
    league: 'Treća NL Centar',
    isPromoted: false,
    thisSeason: { matches: 24, minutes: 2160, goals: 0, assists: 0, cleanSheets: 9 },
    preferredFoot: 'right',
    heightCm: 191,
    contractStatus: 'underContract',
    seenByClubs: { thisWeek: 3, lastWeek: 2 },
  },
  {
    firstName: 'Josip',
    lastName: 'Matić',
    position: 'LB',
    age: 25,
    club: 'NK Trnov Gaj',
    league: 'Treća NL Istok',
    isPromoted: false,
    thisSeason: { matches: 24, minutes: 2050, goals: 1, assists: 4 },
    preferredFoot: 'left',
    heightCm: 178,
    contractStatus: 'expiringThisSeason',
    seenByClubs: { thisWeek: 4, lastWeek: 4 },
  },
  {
    firstName: 'Tomislav',
    lastName: 'Vuković',
    position: 'CB',
    age: 27,
    club: 'NK Vinski Vrh',
    league: 'Treća NL Sjever',
    isPromoted: false,
    thisSeason: { matches: 26, minutes: 2310, goals: 2, assists: 1 },
    preferredFoot: 'right',
    heightCm: 188,
    contractStatus: 'underContract',
    seenByClubs: { thisWeek: 2, lastWeek: 3 },
  },
  {
    firstName: 'Dario',
    lastName: 'Knežević',
    position: 'CB',
    age: 24,
    club: 'NŠK Ravnica',
    league: 'Druga NL',
    isPromoted: false,
    thisSeason: { matches: 21, minutes: 1840, goals: 1, assists: 0 },
    preferredFoot: 'left',
    heightCm: 186,
    contractStatus: 'freeAgent',
    seenByClubs: { thisWeek: 6, lastWeek: 2 },
  },
  {
    firstName: 'Niko',
    lastName: 'Grgić',
    position: 'RB',
    age: 22,
    club: 'NK Zelengrad',
    league: 'Prva NL',
    isPromoted: false,
    thisSeason: { matches: 19, minutes: 1590, goals: 0, assists: 3 },
    preferredFoot: 'right',
    heightCm: 177,
    contractStatus: 'underContract',
    seenByClubs: { thisWeek: 1, lastWeek: 2 },
  },
  {
    firstName: 'Petar',
    lastName: 'Jurić',
    position: 'CM',
    age: 23,
    club: 'NK Tri Lipe',
    league: 'Treća NL Centar',
    isPromoted: false,
    thisSeason: { matches: 22, minutes: 1810, goals: 3, assists: 4 },
    preferredFoot: 'right',
    heightCm: 180,
    contractStatus: 'expiringThisSeason',
    seenByClubs: { thisWeek: 5, lastWeek: 6 },
  },
  {
    firstName: 'Ante',
    lastName: 'Perić',
    position: 'CM',
    age: 26,
    club: 'NK Sinjski Vrh',
    league: '1. ŽNL Splitsko-dalmatinska',
    isPromoted: false,
    thisSeason: { matches: 25, minutes: 2140, goals: 2, assists: 6 },
    preferredFoot: 'both',
    heightCm: 182,
    contractStatus: 'underContract',
    seenByClubs: { thisWeek: 2, lastWeek: 1 },
  },
  {
    firstName: 'Filip',
    lastName: 'Šarić',
    position: 'CM',
    age: 21,
    club: 'NK Trnov Gaj',
    league: 'Treća NL Istok',
    isPromoted: false,
    thisSeason: { matches: 18, minutes: 1290, goals: 1, assists: 3 },
    preferredFoot: 'right',
    heightCm: 175,
    contractStatus: 'freeAgent',
    seenByClubs: { thisWeek: 8, lastWeek: 5 },
  },
]

type Random = () => number

function repeat<T extends string>(value: T, times: number): T[] {
  return Array.from({ length: times }, () => value)
}

// Mulberry32: small, fast and good enough for sample data.
function seededRandom(seed: number): Random {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d_2b_79_f5) >>> 0
    let mixed = state
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296
  }
}

function pick<T>(random: Random, values: readonly T[]): T {
  const value = values[Math.floor(random() * values.length)]
  if (value === undefined) {
    throw new Error('Cannot pick from an empty list')
  }
  return value
}

function between(random: Random, lowest: number, highest: number): number {
  return lowest + Math.floor(random() * (highest - lowest + 1))
}

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[̀-ͯ]/g, '')
    .replaceAll('đ', 'd')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '')
}

interface Contributions {
  readonly assists: number
  readonly goals: number
}

// Goals and assists per season by line, from the player's quality between 0 and 1.
function contributions(
  random: Random,
  position: Position,
  nineties: number,
  quality: number,
): Contributions {
  switch (LINE_BY_POSITION[position]) {
    case 'GK': {
      return { goals: 0, assists: 0 }
    }
    case 'DEF': {
      const goals = Math.round(nineties * (0.02 + quality * 0.1) * random() * 2)
      const assists = Math.round(nineties * (0.03 + quality * 0.15) * random() * 2)
      return { goals, assists }
    }
    case 'MID': {
      const goals = Math.round(nineties * (0.05 + quality * 0.3) * (0.5 + random()))
      const assists = Math.round(nineties * (0.08 + quality * 0.35) * (0.5 + random()))
      return { goals, assists }
    }
    case 'ATT': {
      const goals = Math.round(nineties * (0.1 + quality * 0.6) * (0.5 + random()))
      const assists = Math.round(nineties * (0.05 + quality * 0.35) * (0.5 + random()))
      return { goals, assists }
    }
  }
}

function generateSeason(random: Random, position: Position, quality: number): Season {
  const spread = (random() - 0.5) * 8
  const matches = Math.max(4, Math.min(30, Math.round(12 + quality * 16 + spread)))
  const minutes = Math.round(matches * (55 + quality * 33 + random() * 6))
  if (position === 'GK') {
    const cleanSheets = Math.round(matches * (0.15 + quality * 0.4 + (random() - 0.5) * 0.1))
    return { matches, minutes, goals: 0, assists: 0, cleanSheets }
  }
  return { matches, minutes, ...contributions(random, position, minutes / 90, quality) }
}

function generateLastSeason(
  random: Random,
  position: Position,
  league: League,
  quality: number,
): LastSeason {
  // A quarter of the players moved league over the summer.
  const lastLeague = random() < 0.25 ? pick(random, LEAGUE_POOL) : league
  const lastQuality = clampUnit(quality + (random() - 0.5) * 0.3)
  return { ...generateSeason(random, position, lastQuality), league: lastLeague }
}

function rollContractStatus(roll: number): ContractStatus {
  if (roll < 0.45) {
    return 'underContract'
  }
  return roll < 0.8 ? 'expiringThisSeason' : 'freeAgent'
}

const LEFT_SIDED_POSITIONS: ReadonlySet<Position> = new Set(['LB', 'LM', 'LW'])

function rollPreferredFoot(random: Random, position: Position): PreferredFoot {
  if (LEFT_SIDED_POSITIONS.has(position)) {
    return random() < 0.7 ? 'left' : 'right'
  }
  if (random() < 0.75) {
    return 'right'
  }
  return random() < 0.5 ? 'left' : 'both'
}

function rollHeight(random: Random, position: Position): number {
  if (position === 'GK') {
    return between(random, 184, 198)
  }
  if (position === 'CB') {
    return between(random, 180, 194)
  }
  return between(random, 168, 188)
}

interface Identity {
  readonly club: string
  readonly firstName: string
  readonly lastName: string
  readonly league: League
  readonly nationality: Nationality
  readonly position: Position
}

class PoolGenerator {
  readonly #foreignNames = [...FOREIGN_NAMES]
  readonly #promotedPositions = new Set<Position>()
  readonly #random: Random
  readonly #usedNames = new Set<string>()

  constructor(random: Random) {
    this.#random = random
  }

  #generateNew(index: number): GeneratedListing {
    const random = this.#random
    const identity = this.#newIdentity(index)
    const quality = clampUnit(0.15 + random() * 0.8)
    const thisSeason = generateSeason(random, identity.position, quality)
    const lastSeason = generateLastSeason(random, identity.position, identity.league, quality)
    const contractStatus = rollContractStatus(random())
    const preferredFoot = rollPreferredFoot(random, identity.position)
    const heightCm = rollHeight(random, identity.position)
    const isPromoted = this.#rollPromoted(identity.position, false)
    return {
      id: toSlug(`${identity.firstName} ${identity.lastName}`),
      ...identity,
      preferredFoot,
      heightCm,
      contractStatus,
      thisSeason,
      lastSeason,
      isPromoted,
      seenByClubs: { thisWeek: between(random, 0, 14), lastWeek: 0 },
    }
  }

  #generatePinned(pinned: PinnedListing): GeneratedListing {
    const random = this.#random
    this.#usedNames.add(`${pinned.firstName} ${pinned.lastName}`)
    const quality = 0.66 + random() * 0.1
    const lastSeason = generateLastSeason(random, pinned.position, pinned.league, quality)
    // Rolled and dropped so the generated players after the pinned ones stay the same.
    random()
    return {
      ...pinned,
      id: toSlug(`${pinned.firstName} ${pinned.lastName}`),
      nationality: 'HR',
      lastSeason,
      isPromoted: this.#rollPromoted(pinned.position, pinned.isPromoted),
    }
  }

  #newIdentity(index: number): Identity & { readonly age: number } {
    const random = this.#random
    const position = pick(random, POSITION_POOL)
    const league = pick(random, LEAGUE_POOL)
    const club = pick(random, CLUBS[league])
    const age = between(random, 18, 34)
    const foreign = index % 8 === 5 ? this.#foreignNames.shift() : undefined
    const name = foreign ?? { ...this.#newCroatianName(), nationality: 'HR' as const }
    this.#usedNames.add(`${name.firstName} ${name.lastName}`)
    return { ...name, position, league, club, age }
  }

  #newCroatianName() {
    for (;;) {
      const firstName = pick(this.#random, FIRST_NAMES)
      const lastName = pick(this.#random, LAST_NAMES)
      if (!this.#usedNames.has(`${firstName} ${lastName}`)) {
        return { firstName, lastName }
      }
    }
  }

  #rollPromoted(position: Position, isPinnedPromoted: boolean): boolean {
    const isPromoted =
      isPinnedPromoted || (!this.#promotedPositions.has(position) && this.#random() < 0.35)
    if (isPromoted) {
      this.#promotedPositions.add(position)
    }
    return isPromoted
  }

  generate(index: number): GeneratedListing {
    const pinned = LANDING_LEFT_WINGS[index]
    return pinned === undefined ? this.#generateNew(index) : this.#generatePinned(pinned)
  }
}

function boardListing(random: Random, pinned: PinnedListing): GeneratedListing {
  return {
    ...pinned,
    id: toSlug(`${pinned.firstName} ${pinned.lastName}`),
    nationality: 'HR',
    lastSeason: generateLastSeason(random, pinned.position, pinned.league, 0.6),
  }
}

// Last week's count sits near this week's, so the player seat's comparison reads plausibly.
function withLastWeek(random: Random, listing: GeneratedListing): GeneratedListing {
  const isPinned = [...LANDING_LEFT_WINGS, ...LANDING_BOARD_PLAYERS].some(
    (pinned) => pinned.firstName === listing.firstName && pinned.lastName === listing.lastName,
  )
  if (isPinned) {
    return listing
  }
  const { thisWeek } = listing.seenByClubs
  return {
    ...listing,
    seenByClubs: { thisWeek, lastWeek: Math.max(0, thisWeek + between(random, -3, 3)) },
  }
}

function assertUniqueIds(listings: readonly GeneratedListing[]) {
  const ids = new Set(listings.map((listing) => listing.id))
  if (ids.size !== listings.length) {
    throw new Error('Two sample listings share an id')
  }
}

async function main() {
  const pool = new PoolGenerator(seededRandom(SEED))
  const generated = Array.from({ length: GENERATED_COUNT }, (_, index) => pool.generate(index))
  // A second stream, so adding these never reshuffles the pool above.
  const extraRandom = seededRandom(SEED + 1)
  const board = LANDING_BOARD_PLAYERS.map((pinned) => boardListing(extraRandom, pinned))
  const listings = generatedListingsSchema.parse(
    [...generated, ...board].map((listing) => withLastWeek(extraRandom, listing)),
  )
  assertUniqueIds(listings)
  await writeFile(OUTPUT, `${JSON.stringify(listings, undefined, 2)}\n`)
}

await main()
