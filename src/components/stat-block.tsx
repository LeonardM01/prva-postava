import { cva } from 'class-variance-authority'
import { type ReactNode } from 'react'

import { cn } from '#/lib/utils'

const valueVariants = cva('font-display font-extrabold tracking-[-0.02em]', {
  variants: {
    size: {
      // The landing's fact sheet.
      factSheet: 'text-2xl text-ink board:text-[32px]',
      // This season on the dossier.
      large: 'text-2xl leading-[1.2] text-ink lg:text-[32px]',
      // Last season on the dossier, a step back.
      small: 'text-xl leading-[1.2] text-muted',
    },
  },
})

const labelVariants = cva('text-muted', {
  variants: {
    size: {
      factSheet: 'text-xs board:text-[13px]',
      large: 'text-xs leading-[1.3] lg:text-[13px]',
      small: 'text-xs leading-[1.3] lg:text-[13px]',
    },
  },
})

interface StatBlockProps {
  // Layout from the caller: dividers and padding depend on where the block sits.
  readonly className?: string
  readonly label: ReactNode
  readonly size: 'factSheet' | 'large' | 'small'
  readonly value: number
}

/**
 * A number over its label, as a term and description pair inside the caller's `<dl>`. The label
 * comes first in the markup so it is read first; it is drawn under the number.
 */
export function StatBlock({ className, label, size, value }: StatBlockProps) {
  return (
    <div className={cn('flex flex-col-reverse whitespace-nowrap', className)}>
      <dt className={labelVariants({ size })}>{label}</dt>
      <dd className={valueVariants({ size })}>{value}</dd>
    </div>
  )
}
