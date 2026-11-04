import { Link } from '@tanstack/react-router'
import { useId } from 'react'

import { ArrowRightIcon } from '#/components/arrow-right-icon'
import { type Role } from '#/features/landing/role-context'

import { doorStyle } from './door-style'
import { sideDoorSearch } from './side-doors'
import { SideMark } from './side-mark'
import { BANNER_QR_STRINGS } from './strings'

interface SideDoorCardProps {
  // The door's place in the load cascade, 0 for the first.
  readonly index: number
  readonly role: Role
}

/**
 * A white card on the green page, shaped and lifted like the banner's chips. The whole card
 * is the link; its name is the side, the line under it the description.
 */
export function SideDoorCard({ index, role }: SideDoorCardProps) {
  const titleId = useId()
  const detailId = useId()
  const door = BANNER_QR_STRINGS.doors[role]

  return (
    <Link
      to="/{-$lang}"
      params={{ lang: undefined }}
      search={sideDoorSearch(role)}
      aria-labelledby={titleId}
      aria-describedby={detailId}
      style={doorStyle(index)}
      className="group flex min-h-24 animate-door-rise items-center gap-4 rounded-2xl bg-card py-4 pr-5 pl-4 text-ink shadow-chip transition-[translate,box-shadow] duration-200 ease-(--ease-settle) hover:-translate-y-0.5 hover:shadow-chip-lifted focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-card active:translate-y-0 active:shadow-chip md:min-h-30 md:flex-col md:items-start md:gap-5 md:p-6"
    >
      <SideMark role={role} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          id={titleId}
          className="font-display text-[22px] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance md:text-[26px]"
        >
          {door.title}
        </span>
        <span id={detailId} className="text-sm leading-[1.35] text-muted md:text-[15px]">
          {door.detail}
        </span>
      </span>
      <span className="shrink-0 text-signal transition-transform duration-150 group-hover:translate-x-0.5 md:self-end">
        <ArrowRightIcon />
      </span>
    </Link>
  )
}
