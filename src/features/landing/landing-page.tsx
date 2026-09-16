import { LandingFooter } from './landing-footer'
import { LandingHero } from './landing-hero'
import { LandingNav } from './landing-nav'
import { RoleProvider } from './role-provider'

export function LandingPage() {
  return (
    <RoleProvider>
      <LandingNav />
      <main>
        <LandingHero />
      </main>
      <LandingFooter />
    </RoleProvider>
  )
}
