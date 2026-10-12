interface ArrowDownIconProps {
  readonly className?: string
}

export function ArrowDownIcon({ className = 'size-5' }: ArrowDownIconProps) {
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
      <path d="M10 4v12" />
      <path d="M5 11l5 5 5-5" />
    </svg>
  )
}
