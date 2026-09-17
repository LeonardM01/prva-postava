import { useEffect, useId, useRef, useState } from 'react'

import { LanguageSwitch } from './language-switch'
import { MenuIcon } from './menu-icon'
import { SECTION_IDS } from './section-ids'
import { SectionLink } from './section-link'
import { useLandingLanguage } from './use-landing-language'

const PANEL_LINK_CLASS =
  'flex min-h-11 items-center text-[15px] font-medium text-ink underline-offset-4 hover:underline'

/**
 * The menu button and the panel it opens. The panel is positioned against the nearest
 * positioned ancestor, which is the page header.
 */
export function MobileMenu() {
  const { strings } = useLandingLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!isOpen) {
      return
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return
      }
      setIsOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={strings.nav.openMenu}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex size-11 items-center justify-center rounded-md text-ink"
        onClick={() => {
          setIsOpen((wasOpen) => !wasOpen)
        }}
      >
        <MenuIcon />
      </button>
      <div
        id={panelId}
        hidden={!isOpen}
        className="absolute inset-x-0 top-full z-10 border-y border-line bg-mist px-5 pt-2 pb-5 md:hidden"
      >
        <ul className="flex flex-col">
          <li>
            <SectionLink
              section={SECTION_IDS.clubs}
              className={PANEL_LINK_CLASS}
              onClick={() => {
                setIsOpen(false)
              }}
            >
              {strings.nav.forClubs}
            </SectionLink>
          </li>
          <li>
            <SectionLink
              section={SECTION_IDS.players}
              className={PANEL_LINK_CLASS}
              onClick={() => {
                setIsOpen(false)
              }}
            >
              {strings.nav.forPlayers}
            </SectionLink>
          </li>
          <li className="py-2">
            <LanguageSwitch
              size="touch"
              onNavigate={() => {
                setIsOpen(false)
              }}
            />
          </li>
          <li>
            <SectionLink
              section={SECTION_IDS.cta}
              className={PANEL_LINK_CLASS}
              onClick={() => {
                setIsOpen(false)
              }}
            >
              {strings.nav.logIn}
            </SectionLink>
          </li>
          <li className="pt-2">
            <SectionLink
              section={SECTION_IDS.cta}
              className="flex h-12 items-center justify-center rounded-lg bg-signal text-[15px] font-semibold text-card transition-colors duration-150 hover:bg-signal-deep active:bg-signal-deep active:inset-shadow-pressed"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              {strings.nav.searchPlayers}
            </SectionLink>
          </li>
        </ul>
      </div>
    </>
  )
}
