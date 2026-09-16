import { expect, test } from '@playwright/test'

test('the tactics board is a captioned figure listing the eleven sample players', async ({
  page,
}) => {
  await page.goto('/')

  const board = page.getByRole('figure', { name: 'Every position on one board' })
  await expect(board).toBeVisible()
  await expect(board.getByText('Sample players, not real listings')).toBeVisible()
  await expect(board.getByRole('listitem')).toHaveCount(11)
  await expect(board.getByRole('listitem').filter({ hasText: /^Ivan Horvat, / })).toHaveText(
    'Ivan Horvat, Left wing, NK Kustošija, age 22, 9 goals, promoted',
  )
})

test('the tactics board caption follows the language', async ({ page }) => {
  await page.goto('/?lang=hr')

  const board = page.getByRole('figure', { name: 'Svaka pozicija na jednoj ploči' })
  await expect(board).toBeVisible()
  await expect(board.getByText('Primjeri igrača, nisu pravi oglasi')).toBeVisible()
})
