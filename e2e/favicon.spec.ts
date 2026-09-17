import { expect, test } from '@playwright/test'

test.describe('in the served HTML', () => {
  // Without JavaScript the page is exactly what the server sent, which is what crawlers read.
  test.use({ javaScriptEnabled: false })

  test('the home page head links every favicon', async ({ page }) => {
    await page.goto('/')

    const icon = (href: string) => page.locator(`head link[rel="icon"][href="${href}"]`)
    await expect(icon('/favicon.ico')).toHaveAttribute('sizes', '16x16 32x32 48x48')
    await expect(icon('/favicon.svg')).toHaveAttribute('type', 'image/svg+xml')
    await expect(icon('/favicon-96.png')).toHaveAttribute('sizes', '96x96')
  })
})

test('the SVG favicon is served with a square viewBox', async ({ page, request }) => {
  const response = await request.get('/favicon.svg')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^image\/svg\+xml/)
  const markup = await response.text()
  const viewBox = await page.evaluate((source) => {
    const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement
    return svg.tagName === 'svg' ? svg.getAttribute('viewBox') : null
  }, markup)
  const [width, height] = (viewBox ?? '').split(/\s+/).slice(2).map(Number)
  expect(width).toBeGreaterThan(0)
  expect(width).toBe(height)
})

test('the 96 px PNG favicon is served at 96 by 96', async ({ request }) => {
  const response = await request.get('/favicon-96.png')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toBe('image/png')
  // The IHDR chunk always comes first: width and height are big-endian at bytes 16 and 20.
  const png = await response.body()
  expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([96, 96])
})

test('the ICO favicon holds exactly the 16, 32 and 48 px frames', async ({ request }) => {
  const response = await request.get('/favicon.ico')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^image\/(x-icon|vnd\.microsoft\.icon)$/)
  // ICONDIR is 6 bytes (reserved, type 1 for icons, frame count), then one 16-byte entry per
  // frame whose first two bytes are its width and height.
  const ico = await response.body()
  expect([ico.readUInt16LE(0), ico.readUInt16LE(2)]).toEqual([0, 1])
  const frames = Array.from({ length: ico.readUInt16LE(4) }, (_, index) => {
    const entry = 6 + index * 16
    return [ico.readUInt8(entry), ico.readUInt8(entry + 1)]
  })
  expect(frames).toEqual([
    [16, 16],
    [32, 32],
    [48, 48],
  ])
})
