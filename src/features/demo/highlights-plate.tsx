import { useId } from 'react'

import { type Listing } from '#/features/sample-listings/sample-listings'

import { PlayIcon } from './icons/play-icon'
import { useDemoLanguage } from './use-demo-language'

interface HighlightsPlateProps {
  readonly listing: Listing
}

/**
 * The listing's clip, or until one exists a placeholder plate: a pitch at night with a play
 * mark, captioned as a sample. It is one of the two framed objects on the dossier.
 */
export function HighlightsPlate({ listing }: HighlightsPlateProps) {
  const { language, strings } = useDemoLanguage()
  const headingId = useId()
  const copy = strings.dossier

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3 pt-6 pb-2">
      <h3 className="flex flex-col gap-x-2 leading-[1.3] lg:flex-row lg:items-baseline">
        <span id={headingId} className="text-[15px] font-semibold text-ink">
          {copy.highlights}
        </span>{' '}
        <span className="text-[13px] font-normal text-muted">{copy.highlightsNote}</span>
      </h3>
      {listing.highlights === undefined ? (
        <figure className="relative aspect-video overflow-hidden rounded-[20px] bg-signal-deep lg:aspect-[912/400]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_85%_20%,var(--board-glow),transparent_70%)]"
          />
          <div aria-hidden="true" className="absolute top-1/2 left-[64%] h-px w-full bg-card/22" />
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[77%] aspect-square h-[90%] -translate-y-1/2 rounded-full border border-card/22"
          />
          <PlayIcon className="absolute top-1/2 left-1/2 size-14 -translate-1/2 lg:size-18" />
          <figcaption className="absolute bottom-4 left-5 text-[13px] leading-[1.3] font-medium text-card lg:bottom-6 lg:left-6">
            {copy.sampleClip}
          </figcaption>
        </figure>
      ) : (
        <video
          controls
          preload="metadata"
          src={listing.highlights.videoUrl}
          aria-label={copy.highlights}
          className="aspect-video w-full rounded-[20px] bg-signal-deep"
        >
          <track
            kind="captions"
            src={listing.highlights.captionsUrl}
            srcLang={language}
            label={copy.highlights}
            default
          />
        </video>
      )}
    </section>
  )
}
