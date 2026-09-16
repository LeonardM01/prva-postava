import { expect, type Page, test } from '@playwright/test'

const CLUB_HEADLINE = 'Find your next signing in one evening.'
const PLAYER_HEADLINE = "Get in front of every club that's searching."

// The CTA band has a role switch of its own; these tests drive the one beside the headline.
function getHero(page: Page) {
  return page.getByRole('region').filter({ has: page.getByRole('heading', { level: 1 }) })
}

function getRoleSwitch(page: Page, label = 'Pick a side') {
  return getHero(page).getByRole('group', { name: label })
}

test('the role switch changes the headline, button and pressed state', async ({ page }) => {
  await page.goto('/')
  const clubButton = getRoleSwitch(page).getByRole('button', { name: 'I scout for a club' })
  const playerButton = getRoleSwitch(page).getByRole('button', { name: "I'm a player" })

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(CLUB_HEADLINE)
  await expect(clubButton).toHaveAttribute('aria-pressed', 'true')

  await playerButton.click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(PLAYER_HEADLINE)
  await expect(playerButton).toHaveAttribute('aria-pressed', 'true')
  await expect(clubButton).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByRole('link', { name: 'List yourself, free' })).toBeVisible()

  await clubButton.click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(CLUB_HEADLINE)
  await expect(page.getByRole('link', { name: 'Search players by position' })).toBeVisible()
})

test('the role switch works from the keyboard with a visible focus ring', async ({ page }) => {
  await page.goto('/')
  const clubButton = getRoleSwitch(page).getByRole('button', { name: 'I scout for a club' })
  const playerButton = getRoleSwitch(page).getByRole('button', { name: "I'm a player" })

  await clubButton.focus()
  await page.keyboard.press('Tab')
  await expect(playerButton).toBeFocused()
  await expect(playerButton).toHaveCSS('outline-style', 'solid')

  await page.keyboard.press('Space')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(PLAYER_HEADLINE)

  await page.keyboard.press('Shift+Tab')
  await expect(clubButton).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(CLUB_HEADLINE)
})

test('Tab from the top of the page reaches the role switch before the hero button', async ({
  page,
}) => {
  await page.goto('/')
  const clubButton = getRoleSwitch(page).getByRole('button', { name: 'I scout for a club' })
  const heroButton = page.getByRole('link', { name: 'Search players by position' })

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
  await page.goto('/?lang=hr')

  const playerButton = getRoleSwitch(page, 'Odaberi stranu').getByRole('button', {
    name: 'Ja sam igrač',
  })
  await playerButton.click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Pokaži se svakom klubu koji traži.',
  )
  await expect(playerButton).toHaveAttribute('aria-pressed', 'true')
})

test('the hero button points at the CTA band and the page does not scroll sideways', async ({
  page,
}) => {
  await page.goto('/?lang=hr')

  await expect(page.getByRole('link', { name: 'Pretraži igrače po poziciji' })).toHaveAttribute(
    'href',
    /#get-in-the-lineup$/,
  )
  await getRoleSwitch(page, 'Odaberi stranu').getByRole('button', { name: 'Ja sam igrač' }).click()
  await expect(page.getByRole('link', { name: 'Oglasi se besplatno' })).toBeVisible()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBe(0)
})
