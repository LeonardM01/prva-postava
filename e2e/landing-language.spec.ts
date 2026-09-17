import { expect, test } from '@playwright/test'

const CROATIAN_HEADLINE = 'Nađi sljedeće pojačanje u jednoj večeri.'

test('the landing page is Croatian at /', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
  await expect(page.getByRole('heading', { level: 1, name: CROATIAN_HEADLINE })).toBeVisible()
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: 'Privatnost' })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Kontakt' })).toBeVisible()
  await expect(footer.getByText(/© \d{4} Prva postava/)).toBeVisible()
})

test('the landing page is English at /en', async ({ page }) => {
  await page.goto('/en')

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Find your next signing in one evening.' }),
  ).toBeVisible()
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: 'Privacy' })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Contact' })).toBeVisible()
})

test('the brand link stays in English on /en', async ({ page }) => {
  await page.goto('/en')

  await expect(page.getByRole('link', { name: 'Prva postava' })).toHaveAttribute('href', '/en')
})

test('/hr permanently redirects to / and keeps the query string', async ({ page, request }) => {
  const response = await request.get('/hr?utm_source=x', { maxRedirects: 0 })

  expect(response.status()).toBe(301)
  expect(response.headers().location).toBe('/?utm_source=x')

  await page.goto('/hr?utm_source=x')

  const url = new URL(page.url())
  expect(url.pathname).toBe('/')
  expect(url.search).toBe('?utm_source=x')
  await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
})

test('an unknown language prefix shows the not-found page', async ({ page }) => {
  await page.goto('/de')

  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
})

test('a leftover lang search param has no effect', async ({ page }) => {
  await page.goto('/?lang=en')

  await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
  await expect(page.getByRole('heading', { level: 1, name: CROATIAN_HEADLINE })).toBeVisible()
})

test('the scaffold header and footer are gone', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('banner')).toHaveCount(1)
  await expect(page.getByRole('contentinfo')).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'Prva postava' })).toHaveCount(1)
})
