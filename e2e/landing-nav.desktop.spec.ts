import { expect, test } from '@playwright/test'

test('the desktop nav shows the brand, section links, language control and actions', async ({
  page,
}) => {
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: 'Main' })
  await expect(nav.getByRole('link', { name: 'Prva postava' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'For clubs' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'For players' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Log in' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Search players' })).toBeVisible()

  const language = nav.getByRole('group', { name: 'Language' })
  await expect(language.getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'page')
  await expect(language.getByRole('link', { name: 'HR' })).not.toHaveAttribute('aria-current')
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden()
})

test('the desktop nav is translated in Croatian', async ({ page }) => {
  await page.goto('/?lang=hr')

  const nav = page.getByRole('navigation', { name: 'Glavna navigacija' })
  await expect(nav.getByRole('link', { name: 'Za klubove' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Za igrače' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Prijava' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Pretraži igrače' })).toBeVisible()
  await expect(
    nav.getByRole('group', { name: 'Jezik' }).getByRole('link', { name: 'HR' }),
  ).toHaveAttribute('aria-current', 'page')
})

test('the HR | EN control switches language and keeps the rest of the URL', async ({ page }) => {
  await page.goto('/?utm_source=newsletter#for-clubs')

  const language = page.getByRole('group', { name: 'Language' })
  await language.getByRole('link', { name: 'HR' }).click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
  await expect(page.getByRole('link', { name: 'Za klubove' })).toBeVisible()
  const croatianUrl = new URL(page.url())
  expect(croatianUrl.pathname).toBe('/')
  expect(croatianUrl.searchParams.get('lang')).toBe('hr')
  expect(croatianUrl.searchParams.get('utm_source')).toBe('newsletter')
  expect(croatianUrl.hash).toBe('#for-clubs')

  await page.getByRole('group', { name: 'Jezik' }).getByRole('link', { name: 'EN' }).click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('link', { name: 'For clubs' })).toBeVisible()
  const englishUrl = new URL(page.url())
  expect(englishUrl.searchParams.get('lang')).toBe('en')
  expect(englishUrl.searchParams.get('utm_source')).toBe('newsletter')
  expect(englishUrl.hash).toBe('#for-clubs')
})
