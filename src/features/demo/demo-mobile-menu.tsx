import { useEffect, useId, useRef, useState } from 'react'

import { MenuIcon } from '#/components/menu-icon'

import { DemoLanguageSwitch } from './demo-language-switch'
import { DemoNavLinks } from './demo-nav-links'
import { SeatSwitch } from './seat-switch'
import { useDemoLanguage } from './use-demo-language'

/**
 * The phone's menu button and the panel it opens under the top bar: the nav, the seat switch
 * and HR | EN, every control 44 px tall.
 */
export function DemoMobileMenu() {
  const { strings } = useDemoLanguage()
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

  function close() {
    setIsOpen(false)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? strings.shell.closeMenu : strings.shell.openMenu}
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
        className="absolute inset-x-0 top-full z-20 flex flex-col gap-3 border-y border-line bg-mist px-5 pt-2 pb-5 lg:hidden"
      >
        <nav aria-label={strings.shell.menuLabel}>
          <DemoNavLinks size="touch" onNavigate={close} />
        </nav>
        <SeatSwitch size="touch" onNavigate={close} />
        <DemoLanguageSwitch size="touch" />
      </div>
    </>
  )
}
