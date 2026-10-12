interface ChevronRightIconProps {
  readonly className?: string
}

export function ChevronRightIcon({ className = 'size-5' }: ChevronRightIconProps) {
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
      <path d="M7.5 5 12.5 10 7.5 15" />
    </svg>
  )
}
