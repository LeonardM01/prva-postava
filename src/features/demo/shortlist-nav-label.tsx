import { fillTemplate } from './format'
import { useDemoLanguage } from './use-demo-language'
import { useShortlist } from './use-shortlist'

/**
 * "Shortlist · 3". The count lives on this device only, so the server renders the bare label
 * and the count appears after hydration.
 */
export function ShortlistNavLabel() {
  const { strings } = useDemoLanguage()
  const shortlist = useShortlist()

  return shortlist.ids === undefined
    ? strings.shell.shortlist
    : fillTemplate(strings.shell.shortlistCount, { count: shortlist.ids.length })
}
