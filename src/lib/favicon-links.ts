/**
 * Head links for the favicon files that `bun run generate-icons` writes to `public/`.
 * The ICO serves older browsers and the 16 px tab, the SVG every modern one, and the
 * 96 px PNG is the size Google asks for (a multiple of 48).
 */
export const FAVICON_LINKS = [
  { href: '/favicon.ico', rel: 'icon', sizes: '16x16 32x32 48x48' },
  { href: '/favicon.svg', rel: 'icon', type: 'image/svg+xml' },
  { href: '/favicon-96.png', rel: 'icon', sizes: '96x96', type: 'image/png' },
] as const
