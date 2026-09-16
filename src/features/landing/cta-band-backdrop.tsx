/**
 * The halfway line, centre circle and glow drawn faintly behind the CTA band. They sit right
 * of the form from the width where the form fits on one row, and are left out on narrower
 * screens, where the stacked form would run under them.
 */
export function CtaBandBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="absolute top-1/2 right-63.5 xl:right-73.5">
        <div className="absolute h-175 w-225 -translate-1/2 bg-[radial-gradient(closest-side,var(--board-glow),transparent)] opacity-90" />
        <div className="absolute size-115 -translate-1/2 rounded-full border-[1.5px] border-card/22" />
        <div className="absolute size-2.5 -translate-1/2 rounded-full bg-card/35" />
      </div>
      <div className="absolute top-1/2 right-0 left-[calc(100%-26.25rem)] h-[1.5px] -translate-y-1/2 bg-card/22 xl:left-[calc(100%-37.5rem)]" />
    </div>
  )
}
