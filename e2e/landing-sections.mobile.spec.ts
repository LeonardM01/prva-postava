import { expect, test } from '@playwright/test'

test('the menu links land on the clubs and players sections', async ({ page }) => {
  await page.goto('/en')
  const nav = page.getByRole('navigation', { name: 'Main' })
  const menuButton = nav.getByRole('button', { name: 'Open menu' })

  await menuButton.click()
  await nav.getByRole('link', { name: 'For clubs' }).click()
  await expect(page).toHaveURL(/#for-clubs$/)
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: "A left winger under 25 with at least 15 matches this season? That's one search.",
    }),
  ).toBeInViewport()

  await menuButton.click()
  await nav.getByRole('link', { name: 'For players' }).click()
  await expect(page).toHaveURL(/#for-players$/)
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'See how many clubs looked at your profile this week.',
    }),
  ).toBeInViewport()
})

test('the club search reduces to three filters and three columns', async ({ page }) => {
  await page.goto('/en')

  const demo = page.getByRole('figure', { name: 'Sample club search, not real listings' })
  await expect(demo.getByRole('list', { name: 'Filters' }).getByRole('listitem')).toHaveText([
    'Position: LW',
    'Age 18–24',
    '+ Filter',
  ])
  // Phones keep the header row for assistive technology but do not draw it.
  await expect(demo.getByRole('columnheader')).toHaveText(['Pos', 'Player', 'Goals and assists'])

  const promotedRow = demo.getByRole('row', { name: /Ivan Horvat/ })
  await expect(promotedRow.getByRole('cell')).toHaveCount(2)
  await expect(promotedRow.getByText('9 g · 6 a')).toBeVisible()
  // Text the layout hides for phones stays in the markup, so these read what is drawn.
  await expect(promotedRow.getByRole('rowheader')).toHaveText(
    /^Ivan Horvat\s+Promoted\s+NK Kustošija · 22$/i,
    { useInnerText: true },
  )
  const saveControls = demo.getByText('Save', { exact: true })
  await expect(saveControls).toHaveCount(3)
  const saves = await saveControls.all()
  for (const save of saves) {
    await expect(save).toBeHidden()
  }
  await expect(demo.getByText('Contact player')).toBeHidden()
  await expect(demo.getByText('Save this search')).toBeHidden()
})

test('the fact sheet drops the league and shortens minutes', async ({ page }) => {
  await page.goto('/en')

  const demo = page.getByRole('figure', { name: 'Sample player profile, not a real listing' })
  await expect(demo.getByText(/^Left wing · 22/)).toHaveText('Left wing · 22 · NK Kustošija', {
    useInnerText: true,
  })
  await expect(demo.getByRole('term')).toHaveText(
    ['Matches', 'Goals', 'Assists', 'Min', 'Seen by clubs this week'],
    { useInnerText: true },
  )
})
