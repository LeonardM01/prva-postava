interface PlayIconProps {
  readonly className?: string
}

// The highlights plate's play mark: a mist disc with a signal-deep triangle.
export function PlayIcon({ className }: PlayIconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="36" className="fill-mist" />
      <path d="M30 25.5v21l17-10.5-17-10.5Z" className="fill-signal-deep" />
    </svg>
  )
}
