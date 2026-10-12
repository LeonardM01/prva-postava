interface CloseIconProps {
  readonly className?: string
}

export function CloseIcon({ className = 'size-5' }: CloseIconProps) {
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
      <path d="M5 5l10 10" />
      <path d="M15 5 5 15" />
    </svg>
  )
}
