import { useId, useState } from 'react'

import { CtaBandBackdrop } from './cta-band-backdrop'
import { CtaForm } from './cta-form'
import { CtaSuccess } from './cta-success'
import { type LineupSignup } from './lineup-signup-schema'
import { SECTION_IDS } from './section-ids'
import { useLandingLanguage } from './use-landing-language'

/**
 * The full-bleed "Get in the lineup." band. Once a signup is in, the confirmation replaces
 * the form, so the page cannot send it twice.
 */
export function CtaBand() {
  const { strings } = useLandingLanguage()
  const headingId = useId()
  const [signup, setSignup] = useState<LineupSignup | null>(null)

  return (
    <section
      id={SECTION_IDS.cta}
      aria-labelledby={headingId}
      className="relative overflow-hidden bg-signal-deep"
    >
      <CtaBandBackdrop />
      <div className="relative mx-auto flex max-w-page flex-col gap-5 px-5 py-11 md:gap-7 md:px-10 md:py-16 lg:min-h-90 lg:justify-center xl:px-16">
        <div className="flex flex-col gap-2 text-card md:gap-2.5">
          <h2
            id={headingId}
            className="font-display text-[32px] leading-[1.05] font-extrabold tracking-[-0.025em] md:text-[44px]"
          >
            {strings.cta.headline}
          </h2>
          <p className="text-[15px] leading-normal md:max-w-140 md:text-[17px]">
            {strings.cta.body}
          </p>
        </div>
        {signup === null ? <CtaForm onJoined={setSignup} /> : <CtaSuccess signup={signup} />}
      </div>
    </section>
  )
}
