import { useId } from 'react'

import { StatBlock } from '#/components/stat-block'
import { type Season } from '#/features/sample-listings/listing-schema'
import { type Listing } from '#/features/sample-listings/sample-listings'

import { fillTemplate } from './format'
import { useDemoLanguage } from './use-demo-language'

const CELL_CLASS =
  'min-w-0 gap-0.5 not-first:pl-3 lg:not-first:border-l lg:not-first:border-line lg:not-first:pl-6'

type StatKey = 'assists' | 'cleanSheets' | 'goals' | 'matches' | 'minutes'

// Goalkeepers are judged on clean sheets, not goals and assists.
function statKeys(listing: Listing): readonly StatKey[] {
  return listing.position === 'GK'
    ? ['matches', 'minutes', 'cleanSheets']
    : ['matches', 'minutes', 'goals', 'assists']
}

interface SeasonStatsProps {
  readonly keys: readonly StatKey[]
  readonly labelledBy: string
  readonly season: Season
  readonly size: 'large' | 'small'
}

function SeasonStats({ keys, labelledBy, season, size }: SeasonStatsProps) {
  const { strings } = useDemoLanguage()

  return (
    <dl aria-labelledby={labelledBy} className="grid grid-cols-4">
      {keys.map((key) => (
        <StatBlock
          key={key}
          size={size}
          label={strings.dossier.stats[key]}
          value={season[key] ?? 0}
          className={CELL_CLASS}
        />
      ))}
    </dl>
  )
}

interface SeasonStripsProps {
  readonly listing: Listing
}

/**
 * This season as a stat strip, last season a step back under it with its league, so form and
 * trajectory read together.
 */
export function SeasonStrips({ listing }: SeasonStripsProps) {
  const { strings } = useDemoLanguage()
  const copy = strings.dossier
  const thisSeasonId = useId()
  const lastSeasonId = useId()
  const keys = statKeys(listing)

  return (
    <div className="flex flex-col gap-4 py-6 lg:gap-5">
      <h3
        id={thisSeasonId}
        className="flex flex-col gap-x-2 leading-[1.3] lg:flex-row lg:items-baseline"
      >
        <span className="text-[15px] font-semibold text-ink">{copy.thisSeason}</span>{' '}
        <span className="text-[13px] font-normal text-muted">
          {fillTemplate(copy.seasonHead, {
            season: copy.thisSeasonYears,
            league: listing.league,
            club: listing.club,
          })}
        </span>
      </h3>
      <SeasonStats keys={keys} season={listing.thisSeason} size="large" labelledBy={thisSeasonId} />
      <h3
        id={lastSeasonId}
        className="flex flex-col gap-x-2 pt-1 leading-[1.3] text-muted lg:flex-row lg:items-baseline"
      >
        <span className="text-[15px] font-semibold">{copy.lastSeason}</span>{' '}
        <span className="text-[13px] font-normal">
          {fillTemplate(copy.lastSeasonHead, {
            season: copy.lastSeasonYears,
            league: listing.lastSeason.league,
          })}
        </span>
      </h3>
      <SeasonStats keys={keys} season={listing.lastSeason} size="small" labelledBy={lastSeasonId} />
    </div>
  )
}
