import { Slider } from 'radix-ui'

interface RangeSliderProps {
  // One label per handle, so each slider has its own name.
  readonly labels: readonly string[]
  readonly max: number
  readonly min: number
  readonly onChange: (values: number[]) => void
  readonly step: number
  readonly values: readonly number[]
}

/**
 * A ruled track with hollow signal handles in whole steps. One value is a single handle, two
 * are a range. Each handle has a 44 px hit area around its 16 px mark.
 */
export function RangeSlider({ labels, max, min, onChange, step, values }: RangeSliderProps) {
  return (
    <Slider.Root
      min={min}
      max={max}
      step={step}
      value={[...values]}
      minStepsBetweenThumbs={0}
      className="relative flex h-11 w-full touch-none items-center select-none"
      onValueChange={onChange}
    >
      <Slider.Track className="relative h-0.5 grow rounded-full bg-line">
        <Slider.Range className="absolute h-full rounded-full bg-signal" />
      </Slider.Track>
      {labels.map((label) => (
        <Slider.Thumb
          key={label}
          aria-label={label}
          className="relative block size-4 rounded-full border-2 border-signal bg-card transition-shadow duration-150 before:absolute before:-inset-3.5 before:content-[''] hover:shadow-[0_0_0_4px] hover:shadow-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        />
      ))}
    </Slider.Root>
  )
}
