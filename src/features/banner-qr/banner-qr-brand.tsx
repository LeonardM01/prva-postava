import { Link } from '@tanstack/react-router'

import { LineupMark } from '#/components/lineup-mark'

import { BANNER_QR_STRINGS } from './strings'

/**
 * The brand on the green page. The mark sits on a white tile, as on the banners, because its
 * green dots vanish on Turf green.
 */
export function BannerQrBrand() {
  return (
    <Link
      to="/{-$lang}"
      params={{ lang: undefined }}
      className="flex min-h-11 w-fit items-center gap-2.5 font-display text-xl font-extrabold tracking-[-0.02em] text-mist focus-visible:outline-card"
    >
      <span className="flex size-9 items-center justify-center rounded-[9px] bg-card">
        <LineupMark placement="footer" />
      </span>
      {BANNER_QR_STRINGS.brand}
    </Link>
  )
}
