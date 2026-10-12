import { fillTemplate } from './format'
import { ShellLink } from './shell-link'
import { useDemoLanguage } from './use-demo-language'
import { useSeat } from './use-seat'

/**
 * The phone's seat control: shows the current seat and switches to the other one.
 */
export function SeatPill() {
  const { strings } = useDemoLanguage()
  const seat = useSeat()
  const copy = strings.shell.seat
  const current = copy[seat]
  const other = seat === 'club' ? copy.player : copy.club

  return (
    <ShellLink
      to={seat === 'club' ? '/app/me' : '/app'}
      current={undefined}
      aria-label={fillTemplate(copy.switchTo, { current, other })}
      className="flex min-h-11 items-center rounded-full bg-tint px-4 text-[13px] font-semibold text-ink"
    >
      {current}
    </ShellLink>
  )
}
