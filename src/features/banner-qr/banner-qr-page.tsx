import { useId } from 'react'

import { BannerQrBrand } from './banner-qr-brand'
import { BoardBackdrop } from './board-backdrop'
import { HalfwayChalk } from './halfway-chalk'
import { SideDoorCard } from './side-door-card'
import { SIDE_DOOR_ORDER } from './side-doors'
import { BANNER_QR_STRINGS } from './strings'

/**
 * Where the match-day banners' QR code lands: the visitor says whether they play or scout,
 * and the home page opens on that side. The banner carried onto the phone: the green board,
 * its chalk, and the two doors as white cards across the halfway line.
 */
export function BannerQrPage() {
  const headingId = useId()

  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-signal-deep text-mist selection:bg-mist selection:text-signal-deep">
      <BoardBackdrop />
      <div className="relative mx-auto flex min-h-dvh max-w-120 flex-col px-7 pt-6 pb-12 md:max-w-200 md:px-14 md:pt-12 md:pb-20">
        <header>
          <BannerQrBrand />
        </header>
        <main
          aria-labelledby={headingId}
          className="flex flex-1 flex-col justify-center gap-10 py-10 md:gap-14 md:py-16"
        >
          <div className="flex flex-col gap-3 md:gap-4">
            <h1
              id={headingId}
              className="font-display text-[40px] leading-[1.02] font-extrabold tracking-[-0.025em] text-balance md:text-[64px]"
            >
              {BANNER_QR_STRINGS.headline}
            </h1>
            <p className="max-w-136 text-[17px] leading-[1.4] text-pretty text-mist/85 md:text-[19px]">
              {BANNER_QR_STRINGS.lead}
            </p>
          </div>
          <nav aria-label={BANNER_QR_STRINGS.doorsLabel} className="relative">
            <HalfwayChalk />
            <ul className="relative grid gap-3 md:grid-cols-2 md:gap-5">
              {SIDE_DOOR_ORDER.map((role, index) => (
                <li key={role} className="grid">
                  <SideDoorCard role={role} index={index} />
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </div>
    </div>
  )
}
