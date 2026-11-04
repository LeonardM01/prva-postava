/**
 * The halfway line, centre circle and glow, centred on the doors, so the cards sit across the
 * line the way the banner's position chips do. The line runs to the pitch outline's inset.
 * It sits under the page's stacking context, or the glow would wash over the headline.
 */
export function HalfwayChalk() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute top-1/2 left-1/2">
        <div className="absolute h-160 w-200 -translate-1/2 bg-[radial-gradient(closest-side,var(--board-glow),transparent)] opacity-80" />
        <div className="absolute size-60 -translate-1/2 rounded-full border-[1.5px] border-card/18 md:size-90" />
        <div className="absolute size-2 -translate-1/2 rounded-full bg-card/30" />
      </div>
      <div className="absolute top-1/2 left-1/2 h-[1.5px] w-[calc(100vw-1.5rem)] -translate-1/2 bg-card/18 md:w-[calc(100vw-3rem)]" />
    </div>
  )
}
