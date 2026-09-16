import { expect, test } from '@playwright/test'

test('"See how a club searches" lands on the club search demo', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'See how a club searches' }).click()

  await expect(page).toHaveURL(/#club-search$/)
  await expect(
    page.getByRole('figure', { name: 'Sample club search, not real listings' }),
  ).toBeInViewport()
})

test('"See a player profile" lands on the player fact sheet', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'See a player profile' }).click()

  await expect(page).toHaveURL(/#player-profile$/)
  await expect(
    page.getByRole('figure', { name: 'Sample player profile, not a real listing' }),
  ).toBeInViewport()
})

test('the promoted row is announced with its tag', async ({ page }) => {
  await page.goto('/')

  const table = page.getByRole('figure', { name: 'Sample club search, not real listings' })
  await expect(table.getByRole('rowheader', { name: /^Ivan Horvat Promoted\b/ })).toBeVisible()
})
