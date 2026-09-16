import { expect, test } from '@playwright/test'

// The chip layout is chosen by CSS alone, so it must hold before any JavaScript runs.
test.use({ javaScriptEnabled: false })

test('the board shows compact chips with surname and number', async ({ page }) => {
  await page.goto('/')

  const board = page.getByRole('figure', { name: 'Every position on one board' })
  await expect(board.getByText('Horvat', { exact: true })).toBeVisible()
  await expect(board.getByText('Kovačević', { exact: true })).toBeVisible()
  await expect(board.getByText('Ivan Horvat', { exact: true })).toBeHidden()
  await expect(board.getByText('clean sheets', { exact: true })).toBeHidden()
})
