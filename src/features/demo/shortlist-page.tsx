import { useDemoLanguage } from './use-demo-language'

export function ShortlistPage() {
  const { strings } = useDemoLanguage()

  return <h1>{strings.shortlist.title}</h1>
}
