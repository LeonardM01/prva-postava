interface CheckIconProps {
  readonly className?: string
}

export function CheckIcon({ className = 'size-5' }: CheckIconProps) {
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
      <path d="M4.5 10.5 8 14l7.5-8" />
    </svg>
  )
}
