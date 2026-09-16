import { ViewTransition } from 'react'

import { cn } from '#/lib/utils'

import { ArrowRightIcon } from './arrow-right-icon'
import { useRole } from './role-context'
import { SpinnerIcon } from './spinner-icon'
import { useLandingLanguage } from './use-landing-language'

// Both labels share one grid cell, so the button is always as wide as the wider of the two.
const LABEL_CLASS = 'col-start-1 row-start-1 flex items-center gap-2.5'

interface CtaSubmitButtonProps {
  readonly isSubmitting: boolean
}

export function CtaSubmitButton({ isSubmitting }: CtaSubmitButtonProps) {
  const { role } = useRole()
  const { strings } = useLandingLanguage()

  return (
    <ViewTransition default="role-shape">
      <button
        type="submit"
        disabled={isSubmitting}
        className="group grid h-12.5 place-items-center rounded-[10px] bg-card px-5.5 text-[15px] leading-5 font-semibold text-signal transition-colors duration-150 focus-visible:outline-card enabled:hover:bg-tint enabled:active:brightness-95 disabled:opacity-85 lg:h-11.5 lg:shrink-0"
      >
        <ViewTransition default="role-copy">
          <span aria-hidden={isSubmitting} className={cn(LABEL_CLASS, isSubmitting && 'invisible')}>
            {strings.hero[role].cta}
            <span className="transition-transform duration-150 group-enabled:group-hover:translate-x-0.5">
              <ArrowRightIcon />
            </span>
          </span>
        </ViewTransition>
        <span aria-hidden={!isSubmitting} className={cn(LABEL_CLASS, !isSubmitting && 'invisible')}>
          <SpinnerIcon isSpinning={isSubmitting} />
          {strings.cta.sending}
        </span>
      </button>
    </ViewTransition>
  )
}
