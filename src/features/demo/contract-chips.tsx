import { chipVariants } from '#/components/chip-variants'
import { CONTRACT_STATUSES, type ContractStatus } from '#/features/sample-listings/listing-schema'

import { toggleEntry } from './filter-values'
import { useDemoLanguage } from './use-demo-language'

interface ContractChipsProps {
  readonly onChange: (contract: ContractStatus[] | undefined) => void
  readonly value: readonly ContractStatus[] | undefined
}

/**
 * "Any" plus the three statuses as toggle chips; "Any" clears the others.
 */
export function ContractChips({ onChange, value }: ContractChipsProps) {
  const { strings } = useDemoLanguage()
  const isAny = value === undefined

  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="pb-2.5 text-sm leading-[1.3] font-semibold">
        {strings.filters.contract}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          aria-pressed={isAny}
          className={chipVariants({ isApplied: isAny, size: 'regular' })}
          onClick={() => {
            onChange(undefined)
          }}
        >
          {strings.filters.contractAny}
        </button>
        {CONTRACT_STATUSES.map((status) => {
          const isApplied = value?.includes(status) ?? false
          return (
            <button
              key={status}
              type="button"
              aria-pressed={isApplied}
              className={chipVariants({ isApplied, size: 'regular' })}
              onClick={() => {
                onChange(toggleEntry(value, status))
              }}
            >
              {strings.contract[status]}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
