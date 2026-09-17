import { expect, type Locator, test } from '@playwright/test'

const MIN_TAP_TARGET = 44

async function shortestSide(locator: Locator) {
  const box = await locator.boundingBox()
  return box ? Math.min(box.width, box.height) : 0
}

test('the mobile nav collapses to brand, language pill and a menu button', async ({ page }) => {
  await page.goto('/en')

  const nav = page.getByRole('navigation', { name: 'Main' })
  await expect(nav.getByRole('link', { name: 'Prva postava' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'EN: Switch to Croatian' })).toBeVisible()
  const menuButton = nav.getByRole('button', { name: 'Open menu' })
  await expect(menuButton).toBeVisible()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect(nav.getByRole('link', { name: 'For clubs' })).toBeHidden()
  await expect(nav.getByRole('link', { name: 'Search players' })).toBeHidden()
})

test('the menu button opens and closes the panel', async ({ page }) => {
  await page.goto('/en')

  const nav = page.getByRole('navigation', { name: 'Main' })
  const menuButton = nav.getByRole('button', { name: 'Open menu' })
  await menuButton.click()

  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(nav.getByRole('link', { name: 'For clubs' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'For players' })).toBeVisible()
  await expect(nav.getByRole('group', { name: 'Language' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Log in' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Search players' })).toBeVisible()

  await menuButton.click()

  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect(nav.getByRole('link', { name: 'For clubs' })).toBeHidden()
})

test('Escape closes the panel and returns focus to the menu button', async ({ page }) => {
  await page.goto('/en')

  const nav = page.getByRole('navigation', { name: 'Main' })
  const menuButton = nav.getByRole('button', { name: 'Open menu' })
  await menuButton.click()
  await nav.getByRole('link', { name: 'For clubs' }).focus()

  await page.keyboard.press('Escape')

  await expect(nav.getByRole('link', { name: 'For clubs' })).toBeHidden()
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect(menuButton).toBeFocused()
})

test('the language pill switches to Croatian', async ({ page }) => {
  await page.goto('/en')

  await page.getByRole('link', { name: 'EN: Switch to Croatian' }).click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
  await expect(page.getByRole('link', { name: 'HR: Prebaci na engleski' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Otvori izbornik' })).toBeVisible()
  expect(new URL(page.url()).pathname).toBe('/')
})

test('the language pill keeps the query and hash', async ({ page }) => {
  await page.goto('/?utm_source=x#for-clubs')

  await page.getByRole('link', { name: 'HR: Prebaci na engleski' }).click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const url = new URL(page.url())
  expect(url.pathname).toBe('/en')
  expect(url.search).toBe('?utm_source=x')
  expect(url.hash).toBe('#for-clubs')
})

test('nav and footer links meet the 44 px tap target', async ({ page }) => {
  await page.goto('/en')

  const nav = page.getByRole('navigation', { name: 'Main' })
  const menuButton = nav.getByRole('button', { name: 'Open menu' })
  const footer = page.getByRole('contentinfo')
  const panelLinkNames = ['For clubs', 'For players', 'HR', 'EN', 'Log in', 'Search players']
  const targets = [
    nav.getByRole('link', { name: 'Prva postava' }),
    nav.getByRole('link', { name: 'EN: Switch to Croatian' }),
    menuButton,
    ...panelLinkNames.map((name) => nav.getByRole('link', { exact: true, name })),
    footer.getByRole('link', { name: 'Privacy' }),
    footer.getByRole('link', { name: 'Contact' }),
  ]

  await menuButton.click()
  await expect(nav.getByRole('link', { name: 'For clubs' })).toBeVisible()

  for (const target of targets) {
    await expect.poll(() => shortestSide(target)).toBeGreaterThanOrEqual(MIN_TAP_TARGET)
  }
})
