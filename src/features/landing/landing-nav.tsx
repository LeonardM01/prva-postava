import { BrandLink } from './brand-link'
import { LanguagePill } from './language-pill'
import { LanguageSwitch } from './language-switch'
import { MobileMenu } from './mobile-menu'
import { SECTION_IDS } from './section-ids'
import { SectionLink } from './section-link'
import { useLandingLanguage } from './use-landing-language'

const NAV_LINK_CLASS =
  'text-[15px] leading-5 font-medium text-ink underline-offset-4 hover:underline'

export function LandingNav() {
  const { strings } = useLandingLanguage()

  return (
    <header className="relative">
      <nav
        aria-label={strings.nav.label}
        className="mx-auto flex h-15 max-w-page items-center justify-between px-5 md:h-18 md:px-10 xl:px-16"
      >
        <BrandLink />
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <SectionLink section={SECTION_IDS.clubs} className={NAV_LINK_CLASS}>
              {strings.nav.forClubs}
            </SectionLink>
          </li>
          <li>
            <SectionLink section={SECTION_IDS.players} className={NAV_LINK_CLASS}>
              {strings.nav.forPlayers}
            </SectionLink>
          </li>
        </ul>
        <div className="hidden items-center gap-5 md:flex">
          <LanguageSwitch size="compact" />
          <SectionLink section={SECTION_IDS.cta} className={NAV_LINK_CLASS}>
            {strings.nav.logIn}
          </SectionLink>
          <SectionLink
            section={SECTION_IDS.cta}
            className="rounded-lg bg-signal px-4.5 py-2.75 text-[15px] leading-5 font-semibold text-card transition-colors duration-150 hover:bg-signal-deep active:brightness-90"
          >
            {strings.nav.searchPlayers}
          </SectionLink>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <LanguagePill />
          <MobileMenu />
        </div>
      </nav>
    </header>
  )
}
