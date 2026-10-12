interface ChevronLeftIconProps {
  readonly className?: string
}

export function ChevronLeftIcon({ className = 'size-5' }: ChevronLeftIconProps) {
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
      <path d="M12.5 5 7.5 10 12.5 15" />
    </svg>
  )
}
