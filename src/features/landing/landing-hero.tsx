import { useId } from 'react'

import { HeroCopy } from './hero-copy'
import { TacticsBoard } from './tactics-board'

export function LandingHero() {
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto flex max-w-page flex-col gap-6 px-5 pt-6 pb-10 md:gap-10 md:px-10 md:pt-14 md:pb-14 xl:flex-row xl:items-start xl:justify-between xl:gap-14 xl:px-16 xl:pb-18"
    >
      <HeroCopy headingId={headingId} />
      <TacticsBoard />
    </section>
  )
}
