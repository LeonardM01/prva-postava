import { createContext, use } from 'react'

export const ROLES = ['club', 'player'] as const

export type Role = (typeof ROLES)[number]

interface RoleState {
  readonly role: Role
  readonly selectRole: (role: Role) => void
}

export const RoleContext = createContext<null | RoleState>(null)

/**
 * The visitor's side of the page. Both role switches (hero and CTA band) read and set the
 * same value, so they always agree.
 */
export function useRole(): RoleState {
  const state = use(RoleContext)
  if (state === null) {
    throw new Error('useRole must be used inside a RoleProvider')
  }
  return state
}
