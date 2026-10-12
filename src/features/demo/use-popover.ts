import { type CSSProperties, useEffect, useId, useRef, useState } from 'react'

// CSS anchor positioning is newer than React's style types.
interface AnchorStyle extends CSSProperties {
  readonly anchorName?: string
  readonly positionAnchor?: string
}

interface PopoverHandlers {
  // Runs when the panel opens, before the visitor sees it: reset drafts here.
  readonly onOpen?: () => void
}

/**
 * Wiring for a trigger and a panel on the platform popover: the browser handles opening from
 * the trigger, light dismiss, Escape and the top layer, so the panel escapes clipped columns.
 * The panel sits under its trigger through CSS anchor positioning. Browsers without popover
 * support keep the panel in the flow, open.
 */
export function usePopover({ onOpen }: PopoverHandlers = {}) {
  const id = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const anchorName = `--${id.replaceAll(':', '')}`

  useEffect(() => {
    const panel = panelRef.current
    if (panel === null) {
      return
    }
    function syncOpenState(event: Event) {
      const isNowOpen = event instanceof ToggleEvent && event.newState === 'open'
      if (isNowOpen) {
        onOpen?.()
      }
      setIsOpen(isNowOpen)
    }
    panel.addEventListener('beforetoggle', syncOpenState)
    return () => {
      panel.removeEventListener('beforetoggle', syncOpenState)
    }
  }, [onOpen])

  function close() {
    const panel = panelRef.current
    if (panel !== null && 'hidePopover' in panel && panel.matches(':popover-open')) {
      panel.hidePopover()
      triggerRef.current?.focus()
    }
  }

  const triggerStyle: AnchorStyle = { anchorName }
  const panelStyle: AnchorStyle = { positionAnchor: anchorName }

  return {
    close,
    isOpen,
    panelProps: { id, ref: panelRef, popover: 'auto' as const, style: panelStyle },
    triggerProps: { popoverTarget: id, ref: triggerRef, style: triggerStyle },
  }
}
