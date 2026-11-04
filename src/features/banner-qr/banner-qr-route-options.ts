import { z } from 'zod'

import { BANNER_QR_STRINGS } from './strings'

/**
 * The page reads no search params. Unknown ones pass through untouched.
 */
const bannerQrSearchSchema = z.looseObject({})

// Paints the browser's top bar the green of the page under it.
const BOARD_THEME_COLOR = '#174A32'

// The page only exists for people who scanned a banner, so it stays out of search results.
function bannerQrHead() {
  return {
    meta: [
      { title: BANNER_QR_STRINGS.meta.title },
      { content: 'noindex', name: 'robots' },
      { content: BOARD_THEME_COLOR, name: 'theme-color' },
    ],
  }
}

/**
 * Shared by the file route and the unit-test router.
 */
export const BANNER_QR_ROUTE_OPTIONS = {
  validateSearch: bannerQrSearchSchema,
  head: bannerQrHead,
}
