import { AgeRangeControl } from './age-range-control'
import { ComposerField } from './composer-field'
import { ContractChips } from './contract-chips'
import { summariseFilters } from './filter-summary'
import { type FilterValues } from './filter-values'
import { LeagueChecklist } from './league-checklist'
import { ScoreControl } from './score-control'
import { useDemoLanguage } from './use-demo-language'

interface ComposerFilterFieldsProps {
  readonly filters: FilterValues
  readonly onChange: (change: Partial<FilterValues>) => void
}

/**
 * Age, League, Minimum score and Contract on the composer bar, each opening its control.
 */
export function ComposerFilterFields({ filters, onChange }: ComposerFilterFieldsProps) {
  const { language, strings } = useDemoLanguage()
  const copy = strings.entry
  const summary = summariseFilters(language, strings, filters)

  return (
    <>
      <ComposerField
        label={copy.ageLabel}
        value={summary.age}
        closeLabel={strings.filters.close}
        panelWidth="regular"
      >
        {() => (
          <AgeRangeControl
            min={filters.ageMin}
            max={filters.ageMax}
            onChange={(ageMin, ageMax) => {
              onChange({ ageMin, ageMax })
            }}
          />
        )}
      </ComposerField>
      <ComposerField
        label={copy.leagueLabel}
        value={summary.league}
        closeLabel={strings.filters.close}
        panelWidth="regular"
      >
        {() => (
          <LeagueChecklist
            value={filters.league}
            onChange={(league) => {
              onChange({ league })
            }}
          />
        )}
      </ComposerField>
      <ComposerField
        label={copy.scoreLabel}
        value={summary.score}
        closeLabel={strings.filters.close}
        panelWidth="regular"
      >
        {() => (
          <ScoreControl
            value={filters.scoreMin}
            onChange={(scoreMin) => {
              onChange({ scoreMin })
            }}
          />
        )}
      </ComposerField>
      <ComposerField
        label={copy.contractLabel}
        value={summary.contract}
        closeLabel={strings.filters.close}
        panelWidth="regular"
      >
        {() => (
          <ContractChips
            value={filters.contract}
            onChange={(contract) => {
              onChange({ contract })
            }}
          />
        )}
      </ComposerField>
    </>
  )
}
