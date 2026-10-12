import { useDemoLanguage } from './use-demo-language'

/**
 * The label on every demo screen. Plain text, never colour alone.
 */
export function SampleStrip() {
  const { strings } = useDemoLanguage()

  return (
    <p className="bg-tint px-5 py-2 text-[13px] leading-[1.3] text-muted lg:text-center">
      <span className="lg:hidden">{strings.shell.sampleStripShort}</span>
      <span className="max-lg:hidden">{strings.shell.sampleStrip}</span>
    </p>
  )
}
