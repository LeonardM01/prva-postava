import { useEffect, useRef } from 'react'

import { CheckBadgeIcon } from './check-badge-icon'
import { type LineupSignup } from './lineup-signup-schema'
import { useLandingLanguage } from './use-landing-language'

interface CtaSuccessProps {
  readonly signup: LineupSignup
}

/**
 * Replaces the form once a signup is in. Focus moves to the confirmation, because the button
 * that held it is gone and a screen reader should hear that it worked.
 */
export function CtaSuccess({ signup }: CtaSuccessProps) {
  const { strings } = useLandingLanguage()
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  // A replacer function, so `$` sequences in an address are not read as replacement patterns.
  const body = strings.cta.successBody[signup.role].replace('{email}', () => signup.email)

  return (
    <div className="flex items-center gap-3.5 text-card">
      <CheckBadgeIcon />
      <div className="flex min-w-0 flex-col gap-1">
        <h3
          ref={titleRef}
          tabIndex={-1}
          className="font-display text-[22px] leading-[normal] font-bold tracking-[-0.01em] focus-visible:outline-card"
        >
          {strings.cta.successTitle}
        </h3>
        <p className="text-[15px] leading-normal wrap-anywhere">{body}</p>
      </div>
    </div>
  )
}
