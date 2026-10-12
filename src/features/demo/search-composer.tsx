import { useForm, useSelector } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

import { actionButtonVariants } from '#/components/action-button-variants'
import { POSITIONS } from '#/features/sample-listings/positions'
import { cn } from '#/lib/utils'

import { AgeRangeControl } from './age-range-control'
import { ComposerField } from './composer-field'
import { ContractChips } from './contract-chips'
import { summariseFilters } from './filter-summary'
import { DEFAULT_FILTERS, type FilterValues, withoutDefaults } from './filter-values'
import { LeagueChecklist } from './league-checklist'
import { PositionChooser } from './position-chooser'
import { ScoreControl } from './score-control'
import { useDemoLanguage } from './use-demo-language'

const positionSchema = z.enum(POSITIONS)

/**
 * One ruled bar in the product's own axis: Position (required), then the four filters, then
 * Search. Phones get the same fields as a ruled form with Search at the bottom.
 */
export function SearchComposer() {
  const { language, strings } = useDemoLanguage()
  const navigate = useNavigate()
  const copy = strings.entry

  const form = useForm({
    defaultValues: {
      position: undefined as undefined | z.infer<typeof positionSchema>,
      filters: DEFAULT_FILTERS,
    },
    onSubmit: async ({ value }) => {
      await navigate({
        to: '/app',
        search: { position: value.position, ...withoutDefaults(value.filters) },
      })
    },
  })
  const filters = useSelector(form.store, (state) => state.values.filters)
  const summary = summariseFilters(language, strings, filters)

  function setFilters(change: Partial<FilterValues>) {
    form.setFieldValue('filters', (previous) => ({ ...previous, ...change }))
  }

  return (
    <form
      noValidate
      aria-label={copy.composerLabel}
      className="relative flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field name="position" validators={{ onSubmit: positionSchema }}>
        {(field) => {
          const isInvalid = field.state.meta.errors.length > 0
          return (
            <div className="flex flex-col gap-2 lg:gap-3">
              <div
                className={cn(
                  'flex rounded-xl border bg-card max-lg:flex-col max-lg:divide-y max-lg:divide-line lg:items-center lg:py-3 lg:pr-32 lg:pl-2 lg:[&>div+div]:before:my-auto lg:[&>div+div]:before:h-9 lg:[&>div+div]:before:w-px lg:[&>div+div]:before:shrink-0 lg:[&>div+div]:before:bg-line',
                  isInvalid ? 'border-red' : 'border-line',
                )}
              >
                <ComposerField
                  label={copy.positionLabel}
                  value={
                    field.state.value === undefined
                      ? copy.positionPlaceholder
                      : strings.positions[field.state.value].name
                  }
                  isPlaceholder={field.state.value === undefined}
                  note={strings.chooser.note}
                  closeLabel={strings.chooser.close}
                  panelWidth="wide"
                >
                  {(close) => (
                    <PositionChooser
                      layout="stacked"
                      current={field.state.value}
                      onChoose={(position) => {
                        field.handleChange(position)
                        close()
                      }}
                    />
                  )}
                </ComposerField>
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
                        setFilters({ ageMin, ageMax })
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
                        setFilters({ league })
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
                        setFilters({ scoreMin })
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
                        setFilters({ contract })
                      }}
                    />
                  )}
                </ComposerField>
              </div>
              {isInvalid && (
                <p role="alert" className="text-[13px] leading-[1.4] text-red lg:pl-6">
                  {copy.positionRequired}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>
      {/* One button for both layouts: under the form on phones, at the end of the bar on wide
          screens, where the bar leaves room for it. */}
      <button
        type="submit"
        className={cn(
          actionButtonVariants({ tone: 'primary', size: 'regular' }),
          'h-12 lg:absolute lg:top-5.25 lg:right-3 lg:h-auto lg:min-h-11.5 lg:w-26 lg:min-w-0 lg:px-0',
        )}
      >
        {copy.search}
      </button>
    </form>
  )
}
