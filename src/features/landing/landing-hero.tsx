import { HeroCopy } from './hero-copy'

export function LandingHero() {
  return (
    <section className="flex flex-col gap-6 px-5 pt-6 pb-10 md:gap-10 md:px-10 md:pt-14 md:pb-14 xl:flex-row xl:items-start xl:gap-14 xl:px-16 xl:pb-18">
      <HeroCopy />
      {/* TODO(MER-34): the tactics board replaces this slot, sized to the board bar plus board. */}
      <div
        aria-hidden="true"
        className="h-138.75 w-full md:h-145.25 md:max-w-184 md:self-center xl:min-w-0 xl:flex-1"
      />
    </section>
  )
}
