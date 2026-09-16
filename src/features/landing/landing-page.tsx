import { ClubsSection } from './clubs-section'
import { LandingFooter } from './landing-footer'
import { LandingHero } from './landing-hero'
import { LandingNav } from './landing-nav'
import { PlayersSection } from './players-section'
import { RoleProvider } from './role-provider'

export function LandingPage() {
  return (
    <RoleProvider>
      <LandingNav />
      <main>
        <LandingHero />
        <ClubsSection />
        <PlayersSection />
      </main>
      <LandingFooter />
    </RoleProvider>
  )
}
