import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'

import { type SectionId } from './section-ids'

interface SectionLinkProps {
  readonly children: ReactNode
  readonly className?: string
  readonly onClick?: () => void
  readonly section: SectionId
}

/**
 * Scrolls to a section of the landing page, keeping the current path (language) and search
 * params.
 */
export function SectionLink({ children, className, onClick, section }: SectionLinkProps) {
  return (
    <Link
      to="/{-$lang}"
      params={true}
      search={true}
      hash={section}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
