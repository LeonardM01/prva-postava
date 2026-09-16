import plexSansLatinExt from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-ext-wght-normal.woff2?url'
import plexSansLatin from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2?url'
import manropeLatinExt from '@fontsource-variable/manrope/files/manrope-latin-ext-wght-normal.woff2?url'
import manropeLatin from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'

/**
 * Preload links for the font files declared in `src/fonts.css`. Both import the same package
 * files, so the build gives them one URL and the browser reuses the preloaded response.
 * Font preloads are always CORS requests, hence `crossOrigin`.
 */
export const FONT_PRELOAD_LINKS = [
  plexSansLatin,
  plexSansLatinExt,
  manropeLatin,
  manropeLatinExt,
].map(
  (href) =>
    ({
      as: 'font',
      crossOrigin: 'anonymous',
      href,
      rel: 'preload',
      type: 'font/woff2',
    }) as const,
)
