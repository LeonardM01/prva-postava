import { expect, test } from '@playwright/test'

import { collectErrors, languageCookie } from './demo-helpers'

test('HR | EN in the menu switches the language in place and remembers it', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/app?lang=en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Players')

  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('group', { name: 'Language' }).getByRole('button', { name: 'HR' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Igrači')
  await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
  expect(await languageCookie(page)).toBe('hr')
  expect(errors).toEqual([])
})
