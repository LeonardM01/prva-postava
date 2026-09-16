interface StarIconProps {
  readonly className?: string
}

export function StarIcon({ className }: StarIconProps) {
  return (
    <svg aria-hidden="true" viewBox="-0.22 0 9 9" className={className}>
      <path
        fill="currentColor"
        d="M4.28 0 5.29 3.11h3.27L5.91 5.03l1.01 3.11-2.64-1.92-2.65 1.92 1.01-3.11L0 3.11h3.27L4.28 0Z"
      />
    </svg>
  )
}
