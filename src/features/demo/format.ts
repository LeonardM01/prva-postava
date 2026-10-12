import { type Language } from '#/lib/language'

type TemplateValues = Readonly<Record<string, number | string>>

/**
 * Replaces each `{name}` in a string-table template with its value. A name with no value is a
 * bug in the caller, so it throws rather than render the braces.
 */
export function fillTemplate(template: string, values: TemplateValues): string {
  return template.replaceAll(/\{(\w+)\}/g, (_, name: string) => {
    const value = values[name]
    if (value === undefined) {
      throw new Error(`No value for {${name}} in "${template}"`)
    }
    return String(value)
  })
}

/**
 * Plural forms as the string table holds them: English uses `one` and `other`, Croatian adds
 * `few` (2 to 4, 22 to 24, and so on).
 */
export interface PluralForms {
  readonly few: string
  readonly one: string
  readonly other: string
}

export function formatCount(language: Language, forms: PluralForms, count: number): string {
  const category = new Intl.PluralRules(language).select(count)
  const template = category === 'one' || category === 'few' ? forms[category] : forms.other
  return fillTemplate(template, { count })
}

export interface OrdinalForms extends PluralForms {
  readonly two: string
}

type OrdinalCategory = 'few' | 'one' | 'two'

const ORDINAL_CATEGORIES: ReadonlySet<string> = new Set<OrdinalCategory>(['few', 'one', 'two'])

function isOrdinalCategory(category: string): category is OrdinalCategory {
  return ORDINAL_CATEGORIES.has(category)
}

export function formatOrdinal(language: Language, forms: OrdinalForms, rank: number): string {
  const category = new Intl.PluralRules(language, { type: 'ordinal' }).select(rank)
  const template = isOrdinalCategory(category) ? forms[category] : forms.other
  return fillTemplate(template, { rank })
}
