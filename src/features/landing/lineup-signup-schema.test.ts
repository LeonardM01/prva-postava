import { describe, expect, it } from 'vitest'

import { lineupSignupSchema } from './lineup-signup-schema'

describe('lineup signup schema', () => {
  it.each([
    { role: 'club', email: 'ivan@nk-kustosija.hr' },
    { role: 'player', email: 'name@club.hr' },
  ])('accepts a $role with a valid email', (payload) => {
    expect(lineupSignupSchema.safeParse(payload)).toEqual({ success: true, data: payload })
  })

  it('trims the email before checking it', () => {
    expect(lineupSignupSchema.parse({ role: 'club', email: '  name@club.hr ' })).toEqual({
      role: 'club',
      email: 'name@club.hr',
    })
  })

  it.each([
    ['an email without a domain', { role: 'club', email: 'ivan.horvat' }],
    ['an empty email', { role: 'player', email: '' }],
    ['a missing email', { role: 'club' }],
    ['an unknown role', { role: 'coach', email: 'name@club.hr' }],
    ['a missing role', { email: 'name@club.hr' }],
    ['something that is not an object', 'name@club.hr'],
  ])('rejects %s', (_label, payload) => {
    expect(lineupSignupSchema.safeParse(payload).success).toBe(false)
  })
})
