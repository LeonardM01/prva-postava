import { cva } from 'class-variance-authority'

import { ShellLink } from './shell-link'
import { ShortlistNavLabel } from './shortlist-nav-label'
import { useDemoLanguage } from './use-demo-language'
import { type DemoSection, useDemoSection } from './use-demo-section'
import { useSeat } from './use-seat'

const linkVariants = cva(
  'flex items-center text-sm leading-[1.43] transition-colors duration-150',
  {
    variants: {
      isCurrent: {
        true: 'font-semibold text-ink',
        false: 'font-medium text-muted hover:text-ink',
      },
      size: {
        compact: 'min-h-8',
        touch: 'min-h-11 text-[15px]',
      },
    },
  },
)

interface DemoNavLinksProps {
  readonly onNavigate?: () => void
  readonly size: 'compact' | 'touch'
}

/**
 * The club seat has Players and Shortlist; the player seat has only its own profile.
 */
export function DemoNavLinks({ onNavigate, size }: DemoNavLinksProps) {
  const { strings } = useDemoLanguage()
  const seat = useSeat()
  const section = useDemoSection()

  function linkProps(target: DemoSection) {
    const isCurrent = section === target
    return {
      current: isCurrent ? ('page' as const) : undefined,
      className: linkVariants({ isCurrent, size }),
      onClick: onNavigate,
    }
  }

  if (seat === 'player') {
    return (
      <ul className="flex gap-7 max-lg:flex-col max-lg:gap-0">
        <li>
          <ShellLink to="/app/me" {...linkProps('me')}>
            {strings.shell.myProfile}
          </ShellLink>
        </li>
      </ul>
    )
  }
  return (
    <ul className="flex gap-7 max-lg:flex-col max-lg:gap-0">
      <li>
        <ShellLink to="/app" {...linkProps('players')}>
          {strings.shell.players}
        </ShellLink>
      </li>
      <li>
        <ShellLink to="/app/shortlist" {...linkProps('shortlist')}>
          <ShortlistNavLabel />
        </ShellLink>
      </li>
    </ul>
  )
}
