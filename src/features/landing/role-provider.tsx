import { useSearch } from '@tanstack/react-router'
import { type ReactNode, startTransition, useState } from 'react'

import { type Role, RoleContext } from './role-context'

interface RoleProviderProps {
  readonly children: ReactNode
}

export function RoleProvider({ children }: RoleProviderProps) {
  // A link may open the page on one side (`?role=club`). Without one, players first: the page's
  // search and shared-link audience is footballers, so the server renders the player deck and
  // the H1 a crawler reads is the player's promise.
  const linkedRole = useSearch({ from: '/{-$lang}/', select: (search) => search.role })
  const [role, setRole] = useState<Role>(linkedRole ?? 'player')

  // A transition lets the <ViewTransition> boundaries slide the pill and cross-fade the copy.
  const selectRole = (nextRole: Role) => {
    startTransition(() => {
      setRole(nextRole)
    })
  }

  return <RoleContext value={{ role, selectRole }}>{children}</RoleContext>
}
