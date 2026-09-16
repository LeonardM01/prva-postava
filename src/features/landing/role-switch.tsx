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

const optionVariants = cva(
  'relative row-start-1 rounded-md py-3.25 text-[15px] leading-5 transition-colors duration-150 md:px-4 md:py-2.25',
  {
    variants: {
      isActive: {
        true: 'font-semibold text-ink',
        false: 'font-medium text-muted hover:text-ink',
      },
    },
  },
)

/**
 * Two toggle buttons over a white pill. The pill sits in the active option's grid cell, so
 * it is in place before JavaScript runs; its <ViewTransition> slides it when the side changes.
 */
export function RoleSwitch() {
  const { role, selectRole } = useRole()
  const { strings } = useLandingLanguage()

  return (
    <div
      role="group"
      aria-label={strings.hero.roleSwitch.label}
      className="grid grid-cols-2 rounded-lg bg-tint p-0.75 md:w-fit md:grid-cols-[auto_auto]"
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
              className={cn(optionVariants({ isActive }), COLUMN_CLASS[option])}
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
