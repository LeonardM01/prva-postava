import { cva } from 'class-variance-authority'

const markVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full bg-tint font-display text-signal',
  {
    variants: {
      size: {
        // The landing's player fact sheet.
        factSheet: 'size-13 text-lg font-bold board:size-16 board:text-[22px]',
        // The demo's dossier.
        dossier:
          'size-14 text-xl leading-none font-extrabold tracking-[-0.02em] lg:size-18 lg:text-2xl',
      },
    },
  },
)

interface InitialsMarkProps {
  readonly firstName: string
  readonly lastName: string
  readonly size: 'dossier' | 'factSheet'
}

/**
 * Stands in for a photo, which sample players never have. The name beside it is the accessible
 * text, so the mark is hidden from assistive technology.
 */
export function InitialsMark({ firstName, lastName, size }: InitialsMarkProps) {
  return (
    <span aria-hidden="true" className={markVariants({ size })}>
      {firstName.charAt(0)}
      {lastName.charAt(0)}
    </span>
  )
}
