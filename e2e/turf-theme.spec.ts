import { expect, test } from '@playwright/test'

// Values from the Figma "Prva postava / Colour" collection, Turf mode, as of 2026-09-16.
const TURF_TOKENS = {
  amber: '#e0a22e',
  'amber-wash': '#fff1cf',
  card: '#ffffff',
  ink: '#141a16',
  line: '#e3e1d8',
  mist: '#f7f6f1',
  muted: '#5e655f',
  red: '#b9432a',
  signal: '#1f5c3f',
  'signal-deep': '#174a32',
  tint: '#e6efe9',
} as const

test('exposes every Turf colour token on the document', async ({ page }) => {
  await page.goto('/')

  // The browser resolves both sides, so `#fff` and `#ffffff` compare equal.
  const resolved = await page.evaluate((expected) => {
    const probe = document.createElement('span')
    document.body.append(probe)
    const resolve = (value: string) => {
      probe.style.color = value
      return getComputedStyle(probe).color
    }
    const result = Object.entries(expected).map(([name, hex]) => ({
      actual: resolve(`var(--${name}, transparent)`),
      expected: resolve(hex),
      name,
    }))
    probe.remove()
    return result
  }, TURF_TOKENS)

  for (const token of resolved) {
    expect(token.actual, `--${token.name}`).toBe(token.expected)
  }
})

test('body text is IBM Plex Sans with tabular numerals and the heading is Manrope', async ({
  page,
}) => {
  await page.goto('/')

  const body = page.locator('body')
  const heading = page.getByRole('heading', { level: 1 })
  await expect(body).toHaveCSS('font-family', /^"IBM Plex Sans Variable"/)
  await expect(body).toHaveCSS('font-variant-numeric', 'tabular-nums')
  await expect(heading).toHaveCSS('font-family', /^"Manrope Variable"/)

  const loadedFamilies = await page.evaluate(async () => {
    await document.fonts.ready
    return [...document.fonts].filter((font) => font.status === 'loaded').map((font) => font.family)
  })
  expect(loadedFamilies).toEqual(
    expect.arrayContaining(['IBM Plex Sans Variable', 'Manrope Variable']),
  )
})

test('home page sits on the mist ground with ink text', async ({ page }) => {
  await page.goto('/')

  const body = page.locator('body')
  await expect(body).toHaveCSS('background-color', 'rgb(247, 246, 241)')
  await expect(body).toHaveCSS('color', 'rgb(20, 26, 22)')
})

test('the page is light-only with no theme switching', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')

  await expect(page.locator('html')).not.toHaveClass(/\b(light|dark)\b/)
  await expect(page.getByRole('button', { name: /theme/i })).toHaveCount(0)
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(247, 246, 241)')
})
