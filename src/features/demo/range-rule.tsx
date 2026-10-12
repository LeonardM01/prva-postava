import { fillTemplate } from './format'
import { useDemoLanguage } from './use-demo-language'

interface RangeRuleProps {
  readonly caption: string
  readonly highest: number
  readonly lowest: number
  readonly score: number
}

/**
 * The position's scores from lowest to highest on a rule, with a dot at this player's. The
 * drawing is hidden from assistive technology, which hears the same thing as a sentence.
 */
export function RangeRule({ caption, highest, lowest, score }: RangeRuleProps) {
  const { strings } = useDemoLanguage()
  const span = highest - lowest
  const offset = span === 0 ? 50 : ((score - lowest) / span) * 100

  return (
    <div className="flex flex-col gap-3 pt-1.5">
      <p className="sr-only">
        {fillTemplate(strings.dossier.rangeSpoken, { lowest, highest, score })}
      </p>
      <div
        aria-hidden="true"
        className="flex items-center gap-3 text-[13px] leading-[1.3] font-medium text-muted"
      >
        <span>{lowest}</span>
        <span className="relative h-3 w-full max-w-100 flex-1">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
          <span
            className="absolute top-1/2 size-3 -translate-1/2 rounded-full bg-signal"
            style={{ left: `${offset}%` }}
          />
        </span>
        <span>{highest}</span>
      </div>
      <p className="text-[13px] leading-[1.3] text-muted">{caption}</p>
    </div>
  )
}
