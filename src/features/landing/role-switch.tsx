import { cva } from 'class-variance-authority'
import { ViewTransition } from 'react'

import { cn } from '#/lib/utils'

import { type Role, ROLES, useRole } from './role-context'
import { useLandingLanguage } from './use-landing-language'

// Explicit columns keep each option in its slot while the pill moves between them.
const COLUMN_CLASS = {
  club: 'col-start-1',
  player: 'col-start-2',
} as const satisfies Record<Role, string>

// The band keeps its switch full width until its form fits on one row.
const groupVariants = cva('grid grid-cols-2 rounded-lg p-0.75', {
  variants: {
    tone: {
      paper: 'bg-tint md:w-fit md:grid-cols-[auto_auto]',
      band: 'bg-card/12 lg:w-fit lg:shrink-0 lg:grid-cols-[auto_auto]',
    },
  },
})

const optionVariants = cva(
  'relative row-start-1 rounded-md text-[15px] leading-5 transition-colors duration-150',
  {
    variants: {
      tone: {
        paper: 'py-3.25 md:px-4 md:py-2.25',
        // The band's signal-green focus ring would vanish on the dark ground.
        band: 'py-3 focus-visible:outline-card lg:px-4 lg:py-2.75',
      },
      isActive: {
        true: 'font-semibold text-ink',
        false: 'font-medium',
      },
    },
    compoundVariants: [
      { tone: 'paper', isActive: false, className: 'text-muted hover:text-ink' },
      { tone: 'band', isActive: false, className: 'text-card' },
    ],
  },
)

interface RoleSwitchProps {
  /**
   * `paper` sits on the light page, `band` on the dark CTA band.
   */
  readonly tone: 'band' | 'paper'
}

/**
 * Two toggle buttons over a white pill. The pill sits in the active option's grid cell, so
 * it is in place before JavaScript runs; its <ViewTransition> slides it when the side changes.
 */
export function RoleSwitch({ tone }: RoleSwitchProps) {
  const { role, selectRole } = useRole()
  const { strings } = useLandingLanguage()

  return (
    <div
      role="group"
      aria-label={strings.hero.roleSwitch.label}
      className={groupVariants({ tone })}
    >
      <ViewTransition default="role-shape">
        <span
          aria-hidden="true"
          className={cn(
            'row-start-1 rounded-md bg-card shadow-[0_1px_3px] shadow-ink/10',
            COLUMN_CLASS[role],
          )}
        />
      </ViewTransition>
      {ROLES.map((option) => {
        const isActive = option === role
        return (
          // Its own boundary keeps the label painted above the sliding pill.
          <ViewTransition key={option} default="role-copy">
            <button
              type="button"
              aria-pressed={isActive}
              className={cn(optionVariants({ tone, isActive }), COLUMN_CLASS[option])}
              onClick={() => {
                if (!isActive) {
                  selectRole(option)
                }
              }}
            >
              {strings.hero.roleSwitch[option]}
            </button>
          </ViewTransition>
        )
      })}
    </div>
  )
}
