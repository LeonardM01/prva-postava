import { LineupMark } from './lineup-mark'
import { SECTION_IDS } from './section-ids'
import { SectionLink } from './section-link'
import { useLandingLanguage } from './use-landing-language'

const CURRENT_YEAR = new Date().getFullYear()

const FOOTER_LINK_CLASS =
  'inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 hover:text-ink hover:underline md:min-h-0'

export function LandingFooter() {
  const { strings } = useLandingLanguage()

  return (
    <footer className="flex flex-col gap-1 px-5 pt-5 pb-8 md:flex-row md:items-center md:justify-between md:px-10 md:pt-7 xl:px-16">
      <p className="flex items-center gap-2 font-display text-base font-extrabold tracking-[-0.02em] text-ink md:gap-2.5">
        <LineupMark placement="footer" />
        {strings.brand}
      </p>
      <nav aria-label={strings.footer.label}>
        <ul className="flex gap-6">
          <li>
            <SectionLink section={SECTION_IDS.cta} className={FOOTER_LINK_CLASS}>
              {strings.footer.privacy}
            </SectionLink>
          </li>
          <li>
            <SectionLink section={SECTION_IDS.cta} className={FOOTER_LINK_CLASS}>
              {strings.footer.contact}
            </SectionLink>
          </li>
        </ul>
      </nav>
      <p className="text-[13px] text-muted">
        © {CURRENT_YEAR} {strings.brand}
      </p>
    </footer>
  )
}
