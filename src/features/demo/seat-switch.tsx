import { useId } from 'react'

import { ShellLink } from './shell-link'
import { switchOptionVariants, switchTrackClass } from './switch-option-variants'
import { useDemoLanguage } from './use-demo-language'
import { useSeat } from './use-seat'

interface SeatSwitchProps {
  readonly onNavigate?: () => void
  readonly size: 'compact' | 'touch'
}

/**
 * "Viewing as Club | Player". The order never changes; only the selection moves.
 */
export function SeatSwitch({ onNavigate, size }: SeatSwitchProps) {
  const { strings } = useDemoLanguage()
  const seat = useSeat()
  const labelId = useId()
  const copy = strings.shell.seat

  return (
    <div className="flex items-center gap-2.5">
      <span id={labelId} className="text-[13px] leading-[1.3] text-muted">
        {copy.label}
      </span>
      <div role="group" aria-labelledby={labelId} className={switchTrackClass}>
        <ShellLink
          to="/app"
          current={seat === 'club' ? 'true' : undefined}
          className={switchOptionVariants({ isCurrent: seat === 'club', size })}
          onClick={onNavigate}
        >
          {copy.club}
        </ShellLink>
        <ShellLink
          to="/app/me"
          current={seat === 'player' ? 'true' : undefined}
          className={switchOptionVariants({ isCurrent: seat === 'player', size })}
          onClick={onNavigate}
        >
          {copy.player}
        </ShellLink>
      </div>
    </div>
  )
}
