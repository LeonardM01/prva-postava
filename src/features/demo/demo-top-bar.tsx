import { DemoBrandLink } from './demo-brand-link'
import { DemoLanguageSwitch } from './demo-language-switch'
import { DemoMobileMenu } from './demo-mobile-menu'
import { DemoNavLinks } from './demo-nav-links'
import { SeatPill } from './seat-pill'
import { SeatSwitch } from './seat-switch'
import { useDemoLanguage } from './use-demo-language'

/**
 * Brand, the seat's nav, the seat switch and HR | EN. Phones keep the brand, a seat pill and a
 * menu button; the rest moves into the menu.
 */
export function DemoTopBar() {
  const { strings } = useDemoLanguage()

  return (
    <header className="relative border-b border-line bg-card">
      <div className="mx-auto flex h-15 max-w-page items-center gap-12 px-5 lg:h-16 lg:px-8 xl:px-16">
        <DemoBrandLink />
        <nav aria-label={strings.shell.navLabel} className="max-lg:hidden">
          <DemoNavLinks size="compact" />
        </nav>
        <div className="ml-auto flex items-center gap-5 max-lg:hidden">
          <SeatSwitch size="compact" />
          <DemoLanguageSwitch size="compact" />
        </div>
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <SeatPill />
          <DemoMobileMenu />
        </div>
      </div>
    </header>
  )
}
