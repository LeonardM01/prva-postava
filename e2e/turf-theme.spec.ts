import { expect, test } from '@playwright/test'

test('the page loads IBM Plex Sans and Manrope', async ({ page }) => {
  await page.goto('/')

  const loadedFamilies = await page.evaluate(async () => {
    await document.fonts.ready
    return [...document.fonts].filter((font) => font.status === 'loaded').map((font) => font.family)
  })
  expect(loadedFamilies).toEqual(
    expect.arrayContaining(['IBM Plex Sans Variable', 'Manrope Variable']),
  )
})

test('the page is light-only with no theme switching', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')

  await expect(page.locator('html')).not.toHaveClass(/\b(light|dark)\b/)
  await expect(page.getByRole('button', { name: /theme/i })).toHaveCount(0)
})
