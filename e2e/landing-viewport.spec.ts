import { expect, type Page, test } from '@playwright/test'

// Collects console errors and uncaught exceptions from the moment it is called.
function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    errors.push(error.message)
  })
  return errors
}

async function measureSidewaysOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
}

const ROLE_SWITCH_LABELS = [
  { lang: 'en', path: '/en', playerButton: "I'm a player", playerCta: 'List yourself, free' },
  { lang: 'hr', path: '/', playerButton: 'Ja sam igrač', playerCta: 'Oglasi se besplatno' },
] as const

for (const { lang, path, playerButton, playerCta } of ROLE_SWITCH_LABELS) {
  test(`the page never scrolls sideways or logs an error in ${lang}, on either side of the role switch`, async ({
    page,
  }) => {
    const errors = collectErrors(page)
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect.poll(() => measureSidewaysOverflow(page)).toBe(0)

    const hero = page.getByRole('region').filter({ has: page.getByRole('heading', { level: 1 }) })
    await hero.getByRole('button', { name: playerButton }).click()
    await expect(hero.getByRole('link', { name: playerCta })).toBeVisible()
    await expect.poll(() => measureSidewaysOverflow(page)).toBe(0)
    expect(errors).toEqual([])
  })
}
