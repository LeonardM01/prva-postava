import { expect, test } from '@playwright/test'

import { collectErrors, findViolations, measureSidewaysOverflow } from './demo-helpers'

const DEMO_ROUTES = [
  { name: 'entry', path: '/app?lang=en', heading: 'Players' },
  { name: 'searched', path: '/app?lang=en&position=LW', heading: 'Left wings' },
  { name: 'profile', path: '/app/players/ivan-horvat?lang=en&position=LW', heading: 'Ivan Horvat' },
  { name: 'shortlist', path: '/app/shortlist?lang=en', heading: 'Shortlist' },
  { name: 'player seat', path: '/app/me?lang=en', heading: 'Your listing' },
] as const

test.describe('every demo route', () => {
  // The cross-fades would otherwise catch axe mid-fade.
  test.use({ reducedMotion: 'reduce' })

  for (const { name, path, heading } of DEMO_ROUTES) {
    test(`the ${name} page fits the screen, logs no errors and has no WCAG A or AA violations`, async ({
      page,
    }) => {
      const errors = collectErrors(page)
      await page.goto(path)
      // Phones show a profile on its own, without the list and its title.
      await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible()

      await expect.poll(() => measureSidewaysOverflow(page)).toBe(0)
      expect(await findViolations(page)).toEqual([])
      expect(errors).toEqual([])
    })
  }
})

test.describe('in the served HTML', () => {
  test.use({ javaScriptEnabled: false })

  test('a shared position opens straight on its ranked list', async ({ page }) => {
    await page.goto('/app?lang=en&position=LW')

    const list = page.getByRole('list', { name: 'Left wings on the list' })
    await expect(list.getByRole('listitem')).toHaveCount(14)
    await expect(list.getByRole('listitem').first()).toContainText('Ivan Horvat')
    await expect(list.getByRole('listitem').first()).toContainText('Promoted')
  })

  test('the shortlist count is left for the browser to fill in', async ({ page }) => {
    await page.goto('/app?lang=en')

    // On phones the link sits in the closed menu, so hidden links count too.
    await expect(
      page.getByRole('link', { name: 'Shortlist', exact: true, includeHidden: true }).first(),
    ).toHaveText('Shortlist')
  })
})

test('the shortlist survives a reload', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/app/players/david-vukovic?lang=en&position=LW')
  const dossier = page.getByRole('region', { name: 'David Vuković' })

  await dossier.getByRole('button', { name: 'Save to shortlist' }).click()
  await expect(dossier.getByRole('button', { name: 'Remove from shortlist' })).toBeVisible()
  await page.reload()

  await expect(
    page.getByRole('region', { name: 'David Vuković' }).getByRole('button', {
      name: 'Remove from shortlist',
    }),
  ).toBeVisible()
  await page.goto('/app/shortlist')
  const saved = page.getByRole('list', { name: 'Saved players' }).getByRole('listitem')
  await expect(saved).toHaveCount(4)
  await expect(saved.first()).toContainText('David Vuković')
  expect(errors).toEqual([])
})

test('the seat switch goes to the player seat and back', async ({ page }) => {
  await page.goto('/app/me?lang=en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your listing')

  await page.goto('/app')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Players')
})
