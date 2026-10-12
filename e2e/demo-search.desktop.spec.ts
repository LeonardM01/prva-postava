import { expect, test } from '@playwright/test'

import { collectErrors } from './demo-helpers'

test('arrow keys walk the list and the address follows', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/app/players/ivan-horvat?lang=en&position=LW')
  const list = page.getByRole('list', { name: 'Left wings on the list' })

  await list.getByRole('link', { name: 'Ivan Horvat' }).focus()
  await page.keyboard.press('ArrowDown')

  await expect(page).toHaveURL(/\/app\/players\/david-vukovic\?position=LW$/)
  await expect(page.getByRole('region', { name: 'David Vuković' })).toBeVisible()
  await expect(list.getByRole('link', { name: 'David Vuković' })).toBeFocused()

  await page.keyboard.press('ArrowDown')
  await expect(page).toHaveURL(/\/app\/players\/leon-pavlovic\?position=LW$/)
  expect(errors).toEqual([])
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('opening a profile changes state without a cross-fade', async ({ page }) => {
    await page.goto('/app?lang=en&position=LW')

    await page.getByRole('link', { name: 'David Vuković' }).click()

    await expect(page.getByRole('region', { name: 'David Vuković' })).toBeVisible()
    // Colour transitions stay; only keyframe animations, the cross-fade and the settle, go.
    const keyframes = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((animation) => animation instanceof CSSAnimation)
        .map((animation) => animation.animationName),
    )
    expect(keyframes).toEqual([])
  })
})

test('opening a profile cross-fades it in', async ({ page }) => {
  await page.goto('/app?lang=en&position=LW')

  await page.getByRole('link', { name: 'David Vuković' }).click()

  await expect(page.getByRole('region', { name: 'David Vuković' })).toBeVisible()
  const durations = await page.evaluate(() =>
    document.getAnimations().map((animation) => animation.effect?.getComputedTiming().duration),
  )
  expect(durations).toContain(200)
})

test('the composer searches a position with the chosen filters', async ({ page }) => {
  await page.goto('/app?lang=en')
  const composer = page.getByRole('form', { name: 'Search players' })

  await composer.getByRole('button', { name: /Position · required/ }).click()
  await page
    .getByRole('dialog', { name: 'Position · required' })
    .getByRole('button', { name: 'Left wing · 14' })
    .click()
  await composer.getByRole('button', { name: /^Contract/ }).click()
  await page
    .getByRole('dialog', { name: 'Contract' })
    .getByRole('button', { name: 'Free agent' })
    .click()
  await page.keyboard.press('Escape')
  await composer.getByRole('button', { name: 'Search' }).click()

  await expect(page).toHaveURL(/position=LW/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Left wings')
  await expect(page.getByRole('button', { name: 'Filters · 1' })).toBeVisible()
})

test('the filter panel and the sort menu round-trip through the address', async ({ page }) => {
  await page.goto('/app?lang=en&position=LW')

  await page.getByRole('button', { name: 'Filters' }).click()
  const panel = page.getByRole('dialog', { name: 'Filters' })
  await panel.getByText('Treća NL Centar').click()
  await panel.getByRole('button', { name: 'Show 4 players' }).click()

  await expect(
    page.getByRole('list', { name: 'Left wings on the list' }).getByRole('listitem'),
  ).toHaveCount(4)
  await page.getByRole('button', { name: /^Sort · Score/ }).click()
  await page
    .getByRole('dialog', { name: 'Sort order' })
    .getByRole('button', { name: 'Age, young to old' })
    .click()
  await expect(page.getByText('1–4 of 4 · Promoted first, then by age')).toBeVisible()

  await page.reload()
  await expect(page.getByRole('button', { name: 'Filters · 1' })).toBeVisible()
  await expect(page.getByText('1–4 of 4 · Promoted first, then by age')).toBeVisible()
  await page.goBack()
  await expect(page.getByText('1–4 of 4 · Promoted first, then by score')).toBeVisible()
})
