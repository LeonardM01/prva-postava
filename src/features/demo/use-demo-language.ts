import { useRouteContext } from '@tanstack/react-router'

import { type Language } from '#/lib/language'

import { DEMO_STRINGS, type DemoStrings } from './strings'

interface DemoLanguage {
  readonly language: Language
  readonly strings: DemoStrings
}

export function useDemoLanguage(): DemoLanguage {
  const language = useRouteContext({ from: '/app', select: (context) => context.language })
  return { language, strings: DEMO_STRINGS[language] }
}
