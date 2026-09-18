import { expect, type Page, test } from '@playwright/test'

const CLUB_HEADLINE = 'Find your next signing in one evening.'
const PLAYER_HEADLINE = 'Stop waiting for a scout to come to your match.'

// The CTA band has a role switch of its own; these tests drive the one beside the headline.
function getHero(page: Page) {
  return page.getByRole('region').filter({ has: page.getByRole('heading', { level: 1 }) })
}

function getRoleSwitch(page: Page, label = 'Pick a side') {
  return getHero(page).getByRole('group', { name: label })
}

test('the role switch changes the headline, button and pressed state', async ({ page }) => {
  await page.goto('/en')
  const clubButton = getRoleSwitch(page).getByRole('button', { name: 'I scout for a club' })
  const playerButton = getRoleSwitch(page).getByRole('button', { name: "I'm a player" })

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(PLAYER_HEADLINE)
  await expect(playerButton).toHaveAttribute('aria-pressed', 'true')

  await clubButton.click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(CLUB_HEADLINE)
  await expect(clubButton).toHaveAttribute('aria-pressed', 'true')
  await expect(playerButton).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByRole('link', { name: 'Search players by position' })).toBeVisible()

  await playerButton.click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(PLAYER_HEADLINE)
  await expect(page.getByRole('link', { name: 'List yourself, free' })).toBeVisible()
})

test('the role switch works from the keyboard', async ({ page }) => {
  await page.goto('/en')
  const clubButton = getRoleSwitch(page).getByRole('button', { name: 'I scout for a club' })
  const playerButton = getRoleSwitch(page).getByRole('button', { name: "I'm a player" })

  await clubButton.focus()
  await page.keyboard.press('Space')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(CLUB_HEADLINE)

  await page.keyboard.press('Tab')
  await expect(playerButton).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(PLAYER_HEADLINE)

  await page.keyboard.press('Shift+Tab')
  await expect(clubButton).toBeFocused()
})

test('Tab from the top of the page reaches the role switch before the hero button', async ({
  page,
}) => {
  await page.goto('/en')
  const clubButton = getRoleSwitch(page).getByRole('button', { name: 'I scout for a club' })
  const heroButton = page.getByRole('link', { name: 'List yourself, free' })

  // The nav has more tab stops on desktop than on mobile, so keep pressing Tab until focus lands.
  await expect
    .poll(
      async () => {
        await page.keyboard.press('Tab')
        return clubButton.evaluate((element) => element === document.activeElement)
      },
      { intervals: [0] },
    )
    .toBe(true)

  await expect(clubButton).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(getRoleSwitch(page).getByRole('button', { name: "I'm a player" })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(heroButton).toBeFocused()
})

test('the role switch still swaps the copy with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const clubButton = getRoleSwitch(page, 'Odaberi stranu').getByRole('button', {
    name: 'Tražim igrače za klub',
  })
  await clubButton.click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Nađi sljedeće pojačanje u jednoj večeri.',
  )
  await expect(clubButton).toHaveAttribute('aria-pressed', 'true')
})

test('the hero button points at the CTA band', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('link', { name: 'Oglasi se besplatno' })).toHaveAttribute(
    'href',
    /#get-in-the-lineup$/,
  )
  await getRoleSwitch(page, 'Odaberi stranu')
    .getByRole('button', { name: 'Tražim igrače za klub' })
    .click()
  await expect(page.getByRole('link', { name: 'Pretraži igrače po poziciji' })).toHaveAttribute(
    'href',
    /#get-in-the-lineup$/,
  )
})
