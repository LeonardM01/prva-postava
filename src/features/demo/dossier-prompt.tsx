import { useDemoLanguage } from './use-demo-language'

/**
 * The dossier column before a row is opened: nobody chooses a player for the recruiter.
 */
export function DossierPrompt() {
  const { strings } = useDemoLanguage()

  return (
    <div className="flex max-w-120 flex-col gap-3 lg:pt-1">
      <p className="text-base leading-[1.3] font-semibold text-ink">{strings.list.promptTitle}</p>
      <p className="text-[15px] leading-normal text-muted">{strings.list.promptBody}</p>
    </div>
  )
}
