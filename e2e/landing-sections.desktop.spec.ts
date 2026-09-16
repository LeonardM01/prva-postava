import { expect, test } from '@playwright/test'

test('the nav links land on the clubs and players sections', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Main' })

  await nav.getByRole('link', { name: 'For clubs' }).click()
  await expect(page).toHaveURL(/#for-clubs$/)
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'Clubs filter the whole pool, not the one match they could drive to.',
    }),
  ).toBeInViewport()

  await nav.getByRole('link', { name: 'For players' }).click()
  await expect(page).toHaveURL(/#for-players$/)
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: "Players publish their season, then pay to sit first on their position's list.",
    }),
  ).toBeInViewport()
})

test('the club search shows five filters, seven columns, Save and the actions', async ({
  page,
}) => {
  await page.goto('/')

  const demo = page.getByRole('figure', { name: 'Sample club search, not real listings' })
  await expect(demo.getByRole('list', { name: 'Filters' }).getByRole('listitem')).toHaveText([
    'Position: LW',
    'Age 18–24',
    'Min. 15 matches',
    '3. NL and below',
    '+ Add filter',
  ])
  await expect(demo.getByRole('columnheader')).toHaveText([
    'Pos',
    'Player',
    'Age',
    'Matches',
    'Goals',
    'Assists',
    'Min',
    'Actions',
  ])
  const promotedRow = demo.getByRole('row', { name: /Ivan Horvat/ })
  await expect(promotedRow.getByRole('cell')).toHaveText([
    'LW',
    '22',
    '24',
    '9',
    '6',
    '1980',
    'Save',
  ])
  await expect(promotedRow.getByRole('rowheader')).toHaveText(
    /^Ivan Horvat\s+Promoted\s+NK Kustošija · 3\. NL Zagreb$/i,
    { useInnerText: true },
  )
  await expect(demo.getByText('Contact player')).toBeVisible()
  await expect(demo.getByText('Save this search')).toBeVisible()
})

test('the fact sheet names the league and spells out minutes', async ({ page }) => {
  await page.goto('/')

  const demo = page.getByRole('figure', { name: 'Sample player profile, not a real listing' })
  // Text the layout hides for phones stays in the markup, so these read what is drawn.
  await expect(demo.getByText(/^Left wing · 22/)).toHaveText(
    'Left wing · 22 · NK Kustošija · 3. NL Zagreb',
    { useInnerText: true },
  )
  await expect(demo.getByRole('term')).toHaveText(
    ['Matches', 'Goals', 'Assists', 'Minutes', 'Seen by clubs this week'],
    { useInnerText: true },
  )
})
