import { expect, test } from '@playwright/test'

test('the landing page is English by default', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: 'Privacy' })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Contact' })).toBeVisible()
  await expect(footer.getByText(/© \d{4} Prva postava/)).toBeVisible()
})

test('lang=hr renders the page in Croatian', async ({ page }) => {
  await page.goto('/?lang=hr')

  await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Nađi sljedeće pojačanje u jednoj večeri.' }),
  ).toBeVisible()
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: 'Privatnost' })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Kontakt' })).toBeVisible()
})

test('an unknown lang value falls back to English', async ({ page }) => {
  await page.goto('/?lang=de')

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' })).toBeVisible()
})

test('the scaffold header and footer are gone', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('banner')).toHaveCount(1)
  await expect(page.getByRole('contentinfo')).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'Prva postava' })).toHaveCount(1)
})
