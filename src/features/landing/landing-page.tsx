import { LandingFooter } from './landing-footer'
import { LandingNav } from './landing-nav'
import { useLandingLanguage } from './use-landing-language'

export function LandingPage() {
  const { strings } = useLandingLanguage()

  return (
    <>
      <LandingNav />
      <main className="px-5 pt-6 pb-16 md:px-10 md:pt-14 xl:px-16">
        <h1 className="max-w-130 font-display text-[38px] leading-[1.02] font-extrabold tracking-[-0.025em] md:text-6xl md:leading-none">
          {strings.hero.clubHeadline}
        </h1>
      </main>
      <LandingFooter />
    </>
  )
}
