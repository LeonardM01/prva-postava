import { useDemoLanguage } from './use-demo-language'

export function DossierPrompt() {
  const { strings } = useDemoLanguage()

  return <p>{strings.list.promptTitle}</p>
}
