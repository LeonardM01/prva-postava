import { type ReactNode, startTransition, useState } from 'react'

import { type Role, RoleContext } from './role-context'

interface RoleProviderProps {
  readonly children: ReactNode
}

export function RoleProvider({ children }: RoleProviderProps) {
  const [role, setRole] = useState<Role>('club')

  // A transition lets the <ViewTransition> boundaries slide the pill and cross-fade the copy.
  const selectRole = (nextRole: Role) => {
    startTransition(() => {
      setRole(nextRole)
    })
  }

  return <RoleContext value={{ role, selectRole }}>{children}</RoleContext>
}
