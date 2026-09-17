import { useParams } from '@tanstack/react-router'

import { type Language, parseLanguage } from '#/lib/language'

import { LANDING_STRINGS, type LandingStrings } from './strings'

interface LandingLanguage {
  readonly language: Language
  readonly strings: LandingStrings
}

export function useLandingLanguage(): LandingLanguage {
  const language = useParams({ from: '/{-$lang}/', select: (params) => parseLanguage(params.lang) })
  return { language, strings: LANDING_STRINGS[language] }
}
