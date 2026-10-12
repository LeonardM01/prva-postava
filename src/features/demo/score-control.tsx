import { fillTemplate } from './format'
import { SCORE_STEP } from './players-search'
import { RangeSlider } from './range-slider'
import { useDemoLanguage } from './use-demo-language'

interface ScoreControlProps {
  readonly onChange: (scoreMin: number) => void
  readonly value: number | undefined
}

/**
 * One handle in steps of five; zero means any score.
 */
export function ScoreControl({ onChange, value }: ScoreControlProps) {
  const { strings } = useDemoLanguage()
  const copy = strings.filters
  const score = value ?? 0

  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="flex w-full items-baseline justify-between text-sm leading-[1.3] font-semibold">
        {copy.score}
        <span className="text-[13px] font-medium">
          {score === 0 ? copy.scoreAny : fillTemplate(copy.scoreValue, { score })}
        </span>
      </legend>
      <RangeSlider
        min={0}
        max={100}
        step={SCORE_STEP}
        values={[score]}
        labels={[copy.score]}
        onChange={([next = score]) => {
          onChange(next)
        }}
      />
    </fieldset>
  )
}
