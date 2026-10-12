import { fillTemplate } from './format'
import { AGE_RANGE } from './players-search'
import { RangeSlider } from './range-slider'
import { useDemoLanguage } from './use-demo-language'

interface AgeRangeControlProps {
  readonly max: number | undefined
  readonly min: number | undefined
  readonly onChange: (min: number, max: number) => void
}

/**
 * Two handles in whole years, 18 to 34.
 */
export function AgeRangeControl({ max, min, onChange }: AgeRangeControlProps) {
  const { strings } = useDemoLanguage()
  const copy = strings.filters
  const low = min ?? AGE_RANGE.min
  const high = max ?? AGE_RANGE.max

  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="flex w-full items-baseline justify-between text-sm leading-[1.3] font-semibold">
        {copy.age}
        <span className="text-[13px] font-medium">
          {fillTemplate(copy.ageRange, { min: low, max: high })}
        </span>
      </legend>
      <RangeSlider
        min={AGE_RANGE.min}
        max={AGE_RANGE.max}
        step={1}
        values={[low, high]}
        labels={[copy.ageFrom, copy.ageTo]}
        onChange={([nextLow = low, nextHigh = high]) => {
          onChange(nextLow, nextHigh)
        }}
      />
    </fieldset>
  )
}
