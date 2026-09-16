import { ArrowRightIcon } from './arrow-right-icon'
import { type SectionId } from './section-ids'
import { SectionLink } from './section-link'

interface SectionCopyProps {
  readonly body: string
  readonly headingId: string
  readonly headline: string
  readonly linkLabel: string
  readonly linkTarget: SectionId
}

/**
 * The heading, body and in-page link that introduce a demo section.
 */
export function SectionCopy({
  body,
  headingId,
  headline,
  linkLabel,
  linkTarget,
}: SectionCopyProps) {
  return (
    <div className="flex flex-col gap-3 md:max-w-160 md:gap-4.5 xl:w-105 xl:min-w-0 xl:shrink">
      <h2
        id={headingId}
        className="font-display text-[27px] leading-[1.1] font-extrabold tracking-[-0.02em] text-ink md:max-w-150 md:text-4xl md:leading-[1.08]"
      >
        {headline}
      </h2>
      <p className="text-base leading-[1.55] text-muted md:max-w-150 md:text-[17px] xl:max-w-100">
        {body}
      </p>
      <SectionLink
        section={linkTarget}
        className="flex w-fit items-center gap-1.5 py-3 text-[15px] leading-5 font-semibold text-signal underline-offset-4 hover:underline md:py-2"
      >
        {linkLabel}
        <ArrowRightIcon />
      </SectionLink>
    </div>
  )
}
