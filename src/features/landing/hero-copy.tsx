import { ViewTransition } from 'react'

import { ArrowRightIcon } from './arrow-right-icon'
import { useRole } from './role-context'
import { RoleSwitch } from './role-switch'
import { SECTION_IDS } from './section-ids'
import { SectionLink } from './section-link'
import { useLandingLanguage } from './use-landing-language'

interface HeroCopyProps {
  readonly headingId: string
}

export function HeroCopy({ headingId }: HeroCopyProps) {
  const { role } = useRole()
  const { strings } = useLandingLanguage()
  const copy = strings.hero[role]

  return (
    <div className="flex w-full animate-copy-rise flex-col gap-4 md:max-w-160 md:gap-6 xl:max-w-130 xl:min-w-0 xl:flex-1 xl:pt-7">
      <RoleSwitch tone="paper" />
      <ViewTransition default="role-copy">
        <h1
          id={headingId}
          className="font-display text-[38px] leading-[1.02] font-extrabold tracking-[-0.025em] text-ink md:text-6xl md:leading-none"
        >
          {copy.headline}
        </h1>
      </ViewTransition>
      <ViewTransition default="role-copy">
        <p className="text-[17px] leading-normal text-muted md:max-w-150 md:text-[19px] xl:max-w-120">
          {copy.subheading}
        </p>
      </ViewTransition>
      <div className="flex flex-col items-stretch gap-3 md:mt-7 md:items-start md:gap-3.5">
        <ViewTransition default="role-shape">
          <SectionLink
            section={SECTION_IDS.cta}
            className="group flex h-13 items-center justify-center rounded-[12px] bg-signal px-6 text-[17px] font-semibold text-card transition-colors duration-150 hover:bg-signal-deep active:bg-signal-deep active:inset-shadow-pressed"
          >
            <ViewTransition default="role-copy">
              <span className="flex items-center gap-2.5">
                {copy.cta}
                <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                  <ArrowRightIcon />
                </span>
              </span>
            </ViewTransition>
          </SectionLink>
        </ViewTransition>
        <ViewTransition default="role-copy">
          <p className="text-[13px] leading-[1.3] text-muted md:text-sm">{copy.note}</p>
        </ViewTransition>
      </div>
    </div>
  )
}
