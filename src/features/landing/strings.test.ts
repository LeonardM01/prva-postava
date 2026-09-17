import { describe, expect, it } from 'vitest'

import { LANGUAGES } from '#/lib/language'

import { LANDING_STRINGS } from './strings'

function collectKeyPaths(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix]
  }
  return Object.entries(value).flatMap(([key, child]) =>
    collectKeyPaths(child, prefix === '' ? key : `${prefix}.${key}`),
  )
}

function collectValues(value: unknown): unknown[] {
  if (typeof value !== 'object' || value === null) {
    return [value]
  }
  return Object.values(value).flatMap(collectValues)
}

describe('landing string table', () => {
  it('has a table for every supported language', () => {
    expect(new Set(Object.keys(LANDING_STRINGS))).toEqual(new Set(LANGUAGES))
  })

  it('gives Croatian exactly the keys English has', () => {
    expect(new Set(collectKeyPaths(LANDING_STRINGS.hr))).toEqual(
      new Set(collectKeyPaths(LANDING_STRINGS.en)),
    )
  })

  it.each(LANGUAGES)('has no empty strings in %s', (language) => {
    const values = collectValues(LANDING_STRINGS[language])
    for (const value of values) {
      expect(typeof value).toBe('string')
      expect(value).not.toBe('')
    }
  })

  it.each(LANGUAGES)(
    'keeps the %s search title and description within snippet length',
    (language) => {
      const { title, description } = LANDING_STRINGS[language].meta
      expect(title.length).toBeLessThanOrEqual(70)
      expect(description.length).toBeLessThanOrEqual(155)
    },
  )

  it('carries the designed Croatian nav copy', () => {
    expect(LANDING_STRINGS.hr.nav.forClubs).toBe('Za klubove')
    expect(LANDING_STRINGS.hr.nav.searchPlayers).toBe('Pretraži igrače')
  })
})
