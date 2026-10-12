interface BookmarkIconProps {
  readonly className?: string
  readonly isFilled: boolean
}

export function BookmarkIcon({ className = 'size-5', isFilled }: BookmarkIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 20 20"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinejoin="round"
    >
      <path d="M5.5 3.5h9v13L10 13l-4.5 3.5v-13Z" />
    </svg>
  )
}
