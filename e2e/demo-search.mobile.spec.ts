import { expect, type Page, test } from '@playwright/test'

import { collectErrors, measureSidewaysOverflow } from './demo-helpers'

// Every visible control in the shell and the page must be at least 44 px tall on a phone. A
// row's name link stretches over the whole row and a checkbox sits in its label, so those are
// what a thumb hits.
async function findShortControls(page: Page) {
  return page.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLElement>(
        'header a, header button, main a, main button, main input',
      ),
    ]
      .filter((element) => {
        const target = element.closest('ol li, label') ?? element
        const box = target.getBoundingClientRect()
        return box.width > 0 && box.height > 0 && box.height < 44
      })
      .map((element) => element.textContent.trim() || element.getAttribute('aria-label')),
  )
}

test('the composer is a form with Search at the bottom', async ({ page }) => {
  await page.goto('/app?lang=en')
  const composer = page.getByRole('form', { name: 'Search players' })

  await composer.getByRole('button', { name: /Position · required/ }).click()
  await page
    .getByRole('dialog', { name: 'Position · required' })
    .getByRole('button', { name: 'Left wing · 14' })
    .click()
  await composer.getByRole('button', { name: 'Search' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Left wings')
  expect(await findShortControls(page)).toEqual([])
})

test('the filters open as a sheet on the phone', async ({ page }) => {
  await page.goto('/app?lang=en&position=LW')

  await page.getByRole('button', { name: 'Filters' }).click()
  const sheet = page.getByRole('dialog', { name: 'Filters' })
  await expect(sheet).toBeVisible()
  const box = await sheet.boundingBox()
  expect(box?.width).toBe(page.viewportSize()?.width)
  expect(await findShortControls(page)).toEqual([])

  await sheet.getByRole('button', { name: 'Free agent' }).click()
  await sheet.getByRole('button', { name: /^Show \d+ players?$/ }).click()

  await expect(sheet).toBeHidden()
  await expect(page.getByRole('button', { name: 'Filters · 1' })).toBeVisible()
  await expect(page).toHaveURL(/contract=/)
})

test('a profile is its own screen with a way back to the list', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/app?lang=en&position=LW')
  const list = page.getByRole('list', { name: 'Left wings on the list' })
  await list.getByRole('link', { name: 'Toni Brkić' }).scrollIntoViewIfNeeded()
  const scrolledTo = await page.evaluate(() => window.scrollY)

  await list.getByRole('link', { name: 'Toni Brkić' }).click()
  await expect(page.getByRole('region', { name: 'Toni Brkić' })).toBeVisible()
  await expect(list).toBeHidden()
  expect(await findShortControls(page)).toEqual([])
  await expect.poll(() => measureSidewaysOverflow(page)).toBe(0)

  await page.getByRole('link', { name: '14 left wings' }).click()

  await expect(list).toBeVisible()
  await expect(page).toHaveURL(/\/app\?position=LW$/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrolledTo)
  expect(errors).toEqual([])
})

test('the seat pill switches to the player seat', async ({ page }) => {
  await page.goto('/app?lang=en')

  await page.getByRole('link', { name: 'Viewing as Club. Switch to Player' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your listing')
  await expect.poll(() => measureSidewaysOverflow(page)).toBe(0)
  expect(await findShortControls(page)).toEqual([])
})
