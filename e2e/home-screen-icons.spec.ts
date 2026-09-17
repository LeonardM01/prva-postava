import { expect, test } from '@playwright/test'

test.describe('in the served HTML', () => {
  // Without JavaScript the page is exactly what the server sent, which is what a phone saves.
  test.use({ javaScriptEnabled: false })

  test('the home page head links the home-screen icon, the manifest and the browser bar colour', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.locator('head link[rel="apple-touch-icon"]')).toHaveAttribute(
      'href',
      '/apple-touch-icon.png',
    )
    await expect(page.locator('head link[rel="manifest"]')).toHaveAttribute(
      'href',
      '/manifest.webmanifest',
    )
    await expect(page.locator('head meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#F7F6F1',
    )
  })
})

const APP_ICONS = [
  { path: '/apple-touch-icon.png', size: 180 },
  { path: '/icon-192.png', size: 192 },
  { path: '/icon-512.png', size: 512 },
  { path: '/icon-maskable-512.png', size: 512 },
] as const

for (const { path, size } of APP_ICONS) {
  test(`${path} is served as a ${size} by ${size} PNG`, async ({ request }) => {
    const response = await request.get(path)

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('image/png')
    // The IHDR chunk always comes first: width and height are big-endian at bytes 16 and 20.
    const png = await response.body()
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([size, size])
  })
}

test('the web app manifest names the site and lists its home-screen icons', async ({ request }) => {
  const response = await request.get('/manifest.webmanifest')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^application\/manifest\+json/)
  expect(await response.json()).toEqual({
    name: 'Prva postava',
    short_name: 'Prva postava',
    id: '/',
    start_url: '/',
    scope: '/',
    lang: 'hr',
    display: 'browser',
    theme_color: '#F7F6F1',
    background_color: '#F7F6F1',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  })
})
