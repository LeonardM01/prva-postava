import { chipVariants } from '#/components/chip-variants'
import { LINES, type Position } from '#/features/sample-listings/positions'
import { POSITION_SUMMARIES } from '#/features/sample-listings/sample-listings'
import { cn } from '#/lib/utils'

import { fillTemplate } from './format'
import { useDemoLanguage } from './use-demo-language'

interface PositionChooserProps {
  readonly current: Position | undefined
  readonly layout: 'columns' | 'stacked'
  readonly onChoose: (position: Position) => void
}

/**
 * The twelve positions grouped by line, each with how many listings it holds: the chooser in
 * its popover and the quick way in under the composer.
 */
export function PositionChooser({ current, layout, onChoose }: PositionChooserProps) {
  const { strings } = useDemoLanguage()

  return (
    <div
      className={cn(
        'flex',
        layout === 'columns'
          ? 'flex-col gap-5 md:flex-row md:gap-0 md:divide-x md:divide-line'
          : 'flex-col divide-y divide-line',
      )}
    >
      {LINES.map((line) => (
        <fieldset
          key={line}
          className={cn(
            'flex min-w-0 flex-col gap-2',
            layout === 'columns' ? 'md:flex-1 md:px-6 md:first:pl-0 md:last:pr-0' : 'py-3.5',
          )}
        >
          <legend className="float-left pb-2 text-xs leading-[1.3] text-muted">
            {strings.lines[line]}
          </legend>
          <div className="clear-left flex flex-wrap gap-2">
            {POSITION_SUMMARIES.filter((summary) => summary.line === line).map((summary) => {
              const isCurrent = summary.position === current
              return (
                <button
                  key={summary.position}
                  type="button"
                  aria-pressed={isCurrent}
                  className={cn(
                    chipVariants({ isApplied: false, size: 'large' }),
                    isCurrent && 'border-signal bg-signal text-card hover:border-signal',
                  )}
                  onClick={() => {
                    onChoose(summary.position)
                  }}
                >
                  {fillTemplate(strings.entry.positionCount, {
                    position: strings.positions[summary.position].name,
                    count: summary.count,
                  })}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
