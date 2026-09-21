import { describe, expect, it } from 'vitest'

import { lineupSignupSchema } from './lineup-signup-schema'

describe('lineup signup schema', () => {
  it.each([
    { role: 'club', email: 'ivan@nk-kustosija.hr', language: 'hr' },
    { role: 'player', email: 'name@club.hr', language: 'en' },
  ])('accepts a $role with a valid email', (payload) => {
    expect(lineupSignupSchema.safeParse(payload)).toEqual({ success: true, data: payload })
  })

  it('trims the email before checking it', () => {
    expect(
      lineupSignupSchema.parse({ role: 'club', email: '  name@club.hr ', language: 'hr' }),
    ).toEqual({
      role: 'club',
      email: 'name@club.hr',
      language: 'hr',
    })
  })

  it.each([
    ['an email without a domain', { role: 'club', email: 'ivan.horvat', language: 'hr' }],
    ['an empty email', { role: 'player', email: '', language: 'hr' }],
    ['a missing email', { role: 'club', language: 'hr' }],
    ['an unknown role', { role: 'coach', email: 'name@club.hr', language: 'hr' }],
    ['a missing role', { email: 'name@club.hr', language: 'hr' }],
    ['a language the site does not speak', { role: 'club', email: 'name@club.hr', language: 'de' }],
    ['a missing language', { role: 'club', email: 'name@club.hr' }],
    ['something that is not an object', 'name@club.hr'],
  ])('rejects %s', (_label, payload) => {
    expect(lineupSignupSchema.safeParse(payload).success).toBe(false)
  })
})
