import { expect, type Page, test } from '@playwright/test'

const ERROR = 'Enter an email address like name@club.hr'

function getBand(page: Page) {
  return page.getByRole('region', { name: 'Get in the lineup.' })
}

// Counts the signups the page sends and holds each one until the returned release is called.
async function holdSignups(page: Page) {
  const sent: string[] = []
  const release = Promise.withResolvers<undefined>()
  await page.route('**/_serverFn/**', async (route) => {
    sent.push(route.request().url())
    await release.promise
    await route.continue()
  })
  return {
    sent,
    release: () => {
      release.resolve(undefined)
    },
  }
}

test('an invalid address shows the designed error under the field', async ({ page }) => {
  const signups = await holdSignups(page)
  await page.goto('/en')
  const band = getBand(page)
  const email = band.getByRole('textbox', { name: 'Email' })

  await email.fill('ivan.horvat')
  await expect(band.getByText(ERROR)).toBeHidden()
  await band.getByRole('button', { name: 'Search players by position' }).click()

  const error = band.getByRole('alert')
  await expect(error).toHaveText(ERROR)
  await expect(email).toHaveAttribute('aria-invalid', 'true')
  await expect(email).toBeFocused()
  expect(signups.sent).toHaveLength(0)
})

test('a valid address is sent once and confirmed', async ({ page }) => {
  const signups = await holdSignups(page)
  await page.goto('/en')
  const band = getBand(page)
  const email = band.getByRole('textbox', { name: 'Email' })
  const submit = band.getByRole('button', { name: 'Search players by position' })
  const idleBox = await submit.boundingBox()

  await email.fill('ivan@nk-kustosija.hr')
  await submit.click()

  const sending = band.getByRole('button', { name: 'Sending…' })
  await expect(sending).toBeDisabled()
  const sendingBox = await sending.boundingBox()
  expect(sendingBox?.width).toBe(idleBox?.width)
  // Pressing Enter again while the first signup is on its way sends nothing.
  await email.press('Enter')

  signups.release()

  await expect(band.getByRole('heading', { name: "You're on the list." })).toBeFocused()
  await expect(
    band.getByText("We'll write to ivan@nk-kustosija.hr to finish your club account."),
  ).toBeVisible()
  await expect(band.getByRole('textbox')).toHaveCount(0)
  await expect(band.getByRole('button')).toHaveCount(0)
  expect(signups.sent).toHaveLength(1)
})

test('the band and the hero switch sides together', async ({ page }) => {
  await page.goto('/en')
  const band = getBand(page)
  const hero = page.getByRole('region').filter({ has: page.getByRole('heading', { level: 1 }) })

  await band.getByRole('button', { name: "I'm a player" }).click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Stop waiting for a scout to come to your match.',
  )
  await expect(band.getByRole('button', { name: 'List yourself, free' })).toBeVisible()

  await hero.getByRole('button', { name: 'I scout for a club' }).click()

  await expect(band.getByRole('button', { name: 'I scout for a club' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(band.getByRole('button', { name: 'Search players by position' })).toBeVisible()
})

test('the hero button lands on the band', async ({ page }) => {
  await page.goto('/en')

  await page.getByRole('link', { name: 'Search players by position' }).click()

  await expect(page).toHaveURL(/#get-in-the-lineup$/)
  await expect(getBand(page).getByRole('textbox', { name: 'Email' })).toBeInViewport()
})
