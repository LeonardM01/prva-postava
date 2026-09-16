import { StarIcon } from './star-icon'

interface PromotedTagProps {
  readonly label: string
}

export function PromotedTag({ label }: PromotedTagProps) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-amber px-2 py-0.75 text-[11px] leading-[normal] font-semibold tracking-[0.02em] whitespace-nowrap text-ink">
      <StarIcon className="size-2.25" />
      {label}
    </span>
  )
}
