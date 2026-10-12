import { useLinkProps } from '@tanstack/react-router'
import { type ReactNode } from 'react'

interface ShellLinkProps {
  readonly 'aria-label'?: string
  readonly children: ReactNode
  readonly className?: string
  // `page` for the section the visitor is in, `true` for the seat they sit in.
  readonly current: 'page' | 'true' | undefined
  readonly onClick?: () => void
  readonly to: '/app' | '/app/me' | '/app/shortlist'
}

/**
 * A router link whose current state the shell decides. The router's own marks every `/app`
 * link current on every demo page, because each address starts with `/app`, so it is
 * overridden here.
 */
export function ShellLink({ children, current, onClick, to, ...props }: ShellLinkProps) {
  const linkProps = useLinkProps({ to, onClick })

  return (
    <a {...linkProps} {...props} aria-current={current}>
      {children}
    </a>
  )
}
