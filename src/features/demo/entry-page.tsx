import { useNavigate } from '@tanstack/react-router'
import { useId } from 'react'

import { PositionChooser } from './position-chooser'
import { SearchComposer } from './search-composer'
import { useDemoLanguage } from './use-demo-language'

/**
 * `/app` before a search: the composer, then the twelve positions as the quick way in. No list
 * shows until the recruiter has chosen what they are missing.
 */
export function EntryPage() {
  const { strings } = useDemoLanguage()
  const navigate = useNavigate()
  const quickTitleId = useId()
  const copy = strings.entry

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2 pb-6 lg:pb-7">
        <h1 className="font-display text-[28px] leading-[1.1] font-extrabold tracking-[-0.02em] text-ink">
          {copy.title}
        </h1>
        <p className="max-w-160 text-[15px] leading-normal text-muted">{copy.intro}</p>
      </div>
      <SearchComposer />
      <p className="pt-3 text-[13px] leading-[1.4] text-muted lg:pl-6">
        <span className="lg:hidden">{copy.hintShort}</span>
        <span className="max-lg:hidden">{copy.hint}</span>
      </p>
      <section aria-labelledby={quickTitleId} className="flex flex-col gap-3 pt-10 lg:pt-11">
        <h2 id={quickTitleId} className="text-[15px] leading-[1.3] font-semibold text-ink">
          {copy.quickTitle}
        </h2>
        <PositionChooser
          layout="columns"
          current={undefined}
          onChoose={(position) => {
            void navigate({ to: '/app', search: { position } })
          }}
        />
      </section>
    </div>
  )
}
