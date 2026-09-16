import { useSearch } from '@tanstack/react-router'

import { type Language } from '#/lib/language'

import { LANDING_STRINGS, type LandingStrings } from './strings'

interface LandingLanguage {
  readonly language: Language
  readonly strings: LandingStrings
}

export function useLandingLanguage(): LandingLanguage {
  const language = useSearch({ from: '/', select: (search) => search.lang })
  return { language, strings: LANDING_STRINGS[language] }
}
