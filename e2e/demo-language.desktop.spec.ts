import { expect, test } from '@playwright/test'

import { collectErrors, languageCookie } from './demo-helpers'

test('HR | EN switches the language in place and remembers it', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/app?lang=en&position=LW')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Left wings')

  await page.getByRole('group', { name: 'Language' }).getByRole('button', { name: 'HR' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Lijeva krila')
  await expect(page.locator('html')).toHaveAttribute('lang', 'hr')
  await expect(page).toHaveURL(/\/app\?position=LW$/)
  expect(await languageCookie(page)).toBe('hr')

  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Lijeva krila')
  expect(errors).toEqual([])
})
