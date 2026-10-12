import { type Listing } from '#/features/sample-listings/sample-listings'

import { fillTemplate } from './format'
import { useDemoLanguage } from './use-demo-language'

interface FactsRowProps {
  readonly listing: Listing
}

/**
 * Nationality, foot, height and contract: ruled, four across on wide screens, two on phones.
 */
export function FactsRow({ listing }: FactsRowProps) {
  const { strings } = useDemoLanguage()
  const copy = strings.dossier
  const facts = [
    { label: copy.nationality, value: strings.nationalities[listing.nationality] },
    { label: copy.foot, value: strings.feet[listing.preferredFoot] },
    { label: copy.height, value: fillTemplate(copy.heightValue, { height: listing.heightCm }) },
    { label: copy.contract, value: strings.contract[listing.contractStatus] },
  ]

  return (
    <dl
      aria-label={copy.factsLabel}
      className="grid grid-cols-2 gap-x-6 gap-y-4 py-5 lg:grid-cols-4 lg:gap-0"
    >
      {facts.map(({ label, value }) => (
        <div
          key={label}
          className="flex min-w-0 flex-col-reverse gap-1 leading-[1.3] lg:not-first:border-l lg:not-first:border-line lg:not-first:pl-6 lg:not-last:pr-6"
        >
          <dt className="text-[13px] text-muted">{label}</dt>
          <dd className="text-[15px] font-medium text-ink lg:text-[17px]">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
