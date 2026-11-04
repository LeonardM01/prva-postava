/**
 * The pitch outline drawn faintly around the green page, inset like the banner's chalk border.
 */
export function BoardBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-3 rounded-[6px] border-[1.5px] border-card/18 md:inset-6"
    />
  )
}
