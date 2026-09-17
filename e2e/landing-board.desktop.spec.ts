import { expect, test } from '@playwright/test'

// The chip layout is chosen by CSS alone, so it must hold before any JavaScript runs.
test.use({ javaScriptEnabled: false })

test('the board shows full chips and the promoted tag', async ({ page }) => {
  await page.goto('/en')

  const board = page.getByRole('figure', { name: 'Every position on one board' })
  await expect(board.getByText('Ivan Horvat', { exact: true })).toBeVisible()
  await expect(board.getByText('NK Kustošija · 22', { exact: true })).toBeVisible()
  await expect(board.getByText('clean sheets', { exact: true })).toBeVisible()
  await expect(board.getByText('Promoted in LW', { exact: true })).toBeVisible()
  await expect(board.getByText('Horvat', { exact: true })).toBeHidden()
})
