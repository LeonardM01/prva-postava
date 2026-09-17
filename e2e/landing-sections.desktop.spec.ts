import { expect, test } from '@playwright/test'

test('the nav links land on the clubs and players sections', async ({ page }) => {
  await page.goto('/en')
  const nav = page.getByRole('navigation', { name: 'Main' })

  await nav.getByRole('link', { name: 'For clubs' }).click()
  await expect(page).toHaveURL(/#for-clubs$/)
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: "A left winger under 25 with at least 15 matches this season? That's one search.",
    }),
  ).toBeInViewport()

  await nav.getByRole('link', { name: 'For players' }).click()
  await expect(page).toHaveURL(/#for-players$/)
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'See how many clubs looked at your profile this week.',
    }),
  ).toBeInViewport()
})

test('the club search shows five filters, seven columns, Save and the actions', async ({
  page,
}) => {
  await page.goto('/en')

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
  await page.goto('/en')

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
