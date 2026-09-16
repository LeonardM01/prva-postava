import { useId } from 'react'

import { PlayerFactSheet } from './player-fact-sheet'
import { SectionCopy } from './section-copy'
import { SECTION_IDS } from './section-ids'
import { useLandingLanguage } from './use-landing-language'

export function PlayersSection() {
  const { strings } = useLandingLanguage()
  const headingId = useId()

  return (
    <section id={SECTION_IDS.players} aria-labelledby={headingId} className="bg-card">
      {/* The copy leads in reading order; wide screens put the fact sheet on the left. */}
      <div className="mx-auto flex max-w-page flex-col gap-7 px-5 py-12 md:gap-10 md:px-10 md:py-22 xl:flex-row-reverse xl:items-center xl:gap-18 xl:px-16">
        <SectionCopy
          headingId={headingId}
          headline={strings.players.headline}
          body={strings.players.body}
          linkLabel={strings.players.demoLink}
          linkTarget={SECTION_IDS.playerProfile}
        />
        <PlayerFactSheet />
      </div>
    </section>
  )
}
