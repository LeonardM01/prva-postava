import { describe, expect, it } from 'vitest'

import { LANGUAGES } from '#/lib/language'

import { DEMO_STRINGS } from './strings'

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

describe('demo string table', () => {
  it('has a table for every supported language', () => {
    expect(new Set(Object.keys(DEMO_STRINGS))).toEqual(new Set(LANGUAGES))
  })

  it('gives Croatian exactly the keys English has', () => {
    expect(new Set(collectKeyPaths(DEMO_STRINGS.hr))).toEqual(
      new Set(collectKeyPaths(DEMO_STRINGS.en)),
    )
  })

  it.each(LANGUAGES)('has no empty strings in %s', (language) => {
    const values = collectValues(DEMO_STRINGS[language])
    for (const value of values) {
      expect(typeof value).toBe('string')
      expect(value).not.toBe('')
    }
  })
})
