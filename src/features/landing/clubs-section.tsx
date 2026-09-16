import { useId } from 'react'

import { ClubSearchDemo } from './club-search-demo'
import { SectionCopy } from './section-copy'
import { SECTION_IDS } from './section-ids'
import { useLandingLanguage } from './use-landing-language'

export function ClubsSection() {
  const { strings } = useLandingLanguage()
  const headingId = useId()

  return (
    <section
      id={SECTION_IDS.clubs}
      aria-labelledby={headingId}
      className="mx-auto max-w-page px-5 pb-12 md:px-10 md:pb-22 xl:px-16"
    >
      <div className="flex flex-col gap-7 border-t border-line pt-7 md:gap-10 md:pt-16 xl:flex-row xl:items-center xl:gap-18">
        <SectionCopy
          headingId={headingId}
          headline={strings.clubs.headline}
          body={strings.clubs.body}
          linkLabel={strings.clubs.demoLink}
          linkTarget={SECTION_IDS.clubSearch}
        />
        <ClubSearchDemo />
      </div>
    </section>
  )
}
