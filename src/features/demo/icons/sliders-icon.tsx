interface SlidersIconProps {
  readonly className?: string
}

export function SlidersIcon({ className = 'size-5' }: SlidersIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 5h14" />
      <path d="M3 10h14" />
      <path d="M3 15h14" />
      <circle cx="7" cy="5" r="2" fill="currentColor" />
      <circle cx="13" cy="10" r="2" fill="currentColor" />
      <circle cx="9" cy="15" r="2" fill="currentColor" />
    </svg>
  )
}
