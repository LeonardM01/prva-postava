/**
 * Head links for the icon files that `bun run generate-icons` writes to `public/`.
 * The ICO serves older browsers and the 16 px tab, the SVG every modern one, and the
 * 96 px PNG is the size Google asks for (a multiple of 48). iOS reads the apple-touch-icon
 * when saving to the home screen; Android reads the manifest's icons.
 */
export const ICON_LINKS = [
  { href: '/favicon.ico', rel: 'icon', sizes: '16x16 32x32 48x48' },
  { href: '/favicon.svg', rel: 'icon', type: 'image/svg+xml' },
  { href: '/favicon-96.png', rel: 'icon', sizes: '96x96', type: 'image/png' },
  { href: '/apple-touch-icon.png', rel: 'apple-touch-icon' },
  { href: '/manifest.webmanifest', rel: 'manifest' },
] as const

/**
 * Android's browser bar colour: Turf `--mist`, the page background. Keep in step with
 * `public/manifest.webmanifest`.
 */
export const THEME_COLOR_META = { content: '#F7F6F1', name: 'theme-color' } as const
