import { screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderDemo } from './render-demo'

function rows(listName: string) {
  return within(screen.getByRole('list', { name: listName })).getAllByRole('listitem')
}

function rowName(row: HTMLElement) {
  return within(row).getAllByRole('link')[0]?.textContent
}

// The value at the right of each row, which follows the chosen sort.
function sortedValues(listName: string, label: string) {
  const pattern = new RegExp(String.raw`^${label} (\d+)$`)
  return rows(listName).map((row) => {
    const value = within(row).getByText(
      (_, element) => element?.tagName === 'P' && pattern.test(element.textContent),
    )
    return Number(pattern.exec(value.textContent)?.[1])
  })
}

describe('filters', () => {
  it('counts only the filters that differ from their defaults', async () => {
    await renderDemo('/app?position=LW', { language: 'en' })

    expect(screen.getByRole('button', { name: 'Filters' })).toBeVisible()
    expect(screen.queryByRole('list', { name: 'Applied filters' })).not.toBeInTheDocument()
  })

  it('shows each applied filter as its own chip', async () => {
    await renderDemo('/app?position=LW&ageMax=21&scoreMin=90', { language: 'en' })

    expect(screen.getByRole('button', { name: 'Filters · 2' })).toBeVisible()
    const applied = screen.getByRole('list', { name: 'Applied filters' })
    expect(within(applied).getByRole('button', { name: 'Remove filter: 18 to 21' })).toBeVisible()
    expect(within(applied).getByRole('button', { name: 'Remove filter: Score 90+' })).toBeVisible()
  })

  it('removes only the filter whose chip is dismissed', async () => {
    const { router } = await renderDemo('/app?position=LW&ageMax=21&scoreMin=90', {
      language: 'en',
    })
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Remove filter: Score 90+' }))

    expect(await screen.findByRole('button', { name: 'Filters · 1' })).toBeVisible()
    expect(router.state.location.search).toEqual({ position: 'LW', ageMax: 21 })
  })

  it('ticks a live count within the position and shows exactly that many rows', async () => {
    const { router } = await renderDemo('/app?position=LW', { language: 'en' })
    const user = userEvent.setup()

    const panel = screen.getByRole('dialog', { name: 'Filters' })
    expect(within(panel).getByText('of 14 left wings')).toBeVisible()
    expect(within(panel).getByRole('button', { name: 'Show 14 players' })).toBeVisible()

    await user.click(within(panel).getByRole('button', { name: 'Expiring this season' }))
    const show = within(panel).getByRole('button', { name: /^Show \d+ players?$/ })
    const count = Number(show.textContent.split(' ', 2)[1])
    expect(count).toBeLessThan(14)

    await user.click(show)

    expect(await screen.findByRole('button', { name: 'Filters · 1' })).toBeVisible()
    expect(rows('Left wings on the list')).toHaveLength(count)
    expect(router.state.location.search).toEqual({
      position: 'LW',
      contract: ['expiringThisSeason'],
    })
  })

  it('narrows by league, age and score from the panel', async () => {
    await renderDemo('/app?position=LW', { language: 'en' })
    const user = userEvent.setup()

    const panel = screen.getByRole('dialog', { name: 'Filters' })
    await user.click(within(panel).getByRole('checkbox', { name: 'Treća NL Centar' }))
    expect(within(panel).getByRole('button', { name: 'Show 4 players' })).toBeVisible()

    within(panel).getByRole('slider', { name: 'Oldest age' }).focus()
    await user.keyboard('{ArrowLeft>13/}')
    expect(within(panel).getByText('18 to 21')).toBeVisible()
    expect(within(panel).getByRole('button', { name: 'Show 2 players' })).toBeVisible()

    await user.click(within(panel).getByRole('button', { name: 'Reset' }))
    expect(within(panel).getByRole('button', { name: 'Show 14 players' })).toBeVisible()

    within(panel).getByRole('slider', { name: 'Minimum score' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(within(panel).getByText('5 and up')).toBeVisible()
  })

  it('offers only the leagues the sample data uses', async () => {
    await renderDemo('/app?position=LW', { language: 'en' })
    const user = userEvent.setup()

    const panel = screen.getByRole('dialog', { name: 'Filters' })
    expect(within(panel).getAllByRole('checkbox')).toHaveLength(7)
    await user.click(within(panel).getByRole('button', { name: '7 more leagues' }))
    expect(within(panel).getAllByRole('checkbox')).toHaveLength(14)
    expect(within(panel).queryByRole('checkbox', { name: 'HNL' })).not.toBeInTheDocument()
  })
})

describe('sort', () => {
  it('reorders by age with the promoted row still first', async () => {
    const { router } = await renderDemo('/app?position=LW', { language: 'en' })
    const user = userEvent.setup()

    const menu = screen.getByRole('dialog', { name: 'Sort order' })
    await user.click(within(menu).getByRole('button', { name: 'Age, young to old' }))

    expect(await screen.findByRole('button', { name: /^Sort · Age/ })).toBeVisible()
    const list = 'Left wings on the list'
    const [promoted, ...organic] = rows(list)
    expect(promoted && rowName(promoted)).toBe('Ivan Horvat')
    const ages = sortedValues(list, 'Age').slice(1)
    expect(ages).toEqual(ages.toSorted((first, second) => first - second))
    expect(organic).toHaveLength(13)
    expect(screen.getByText('1–14 of 14 · Promoted first, then by age')).toBeVisible()
    expect(router.state.location.search).toEqual({ position: 'LW', sort: 'age' })
  })

  it('reorders by matches with the promoted row still first', async () => {
    await renderDemo('/app?position=LW&sort=matches', { language: 'en' })

    const list = 'Left wings on the list'
    const [promoted] = rows(list)
    expect(promoted && rowName(promoted)).toBe('Ivan Horvat')
    const matches = sortedValues(list, 'Matches').slice(1)
    expect(matches).toEqual(matches.toSorted((first, second) => second - first))
  })

  it('reads in Croatian', async () => {
    await renderDemo('/app?position=LW&sort=age&ageMax=21', { language: 'hr' })

    expect(screen.getByRole('button', { name: /^Poredak · Dob/ })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Filteri · 1' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Ukloni filter: 18 do 21' })).toBeVisible()
  })
})

describe('pages and fallbacks', () => {
  it('shows twenty rows a page and the way to the next', async () => {
    await renderDemo('/app?position=CM', { language: 'en' })

    expect(rows('Central midfielders on the list')).toHaveLength(20)
    expect(screen.getByText('1–20 of 24 · Promoted first, then by score')).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Previous page' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute(
      'href',
      '/app?position=CM&page=2',
    )
  })

  it('shows the rest on the second page with the promoted row still first', async () => {
    const { router } = await renderDemo('/app?position=CM&page=2', { language: 'en' })
    const user = userEvent.setup()

    expect(rows('Central midfielders on the list')).toHaveLength(4)
    expect(screen.getByText('21–24 of 24 · Promoted first, then by score')).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Next page' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Previous page' }))

    expect(router.state.location.search).toEqual({ position: 'CM' })
    const [first] = rows('Central midfielders on the list')
    expect(first && within(first).getByText('Promoted')).toBeVisible()
  })

  it('shows the last page for a page beyond the range, with no other pages to go to', async () => {
    await renderDemo('/app?position=LW&page=3', { language: 'en' })

    expect(rows('Left wings on the list')).toHaveLength(14)
    expect(screen.getByText('1–14 of 14 · Promoted first, then by score')).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Previous page' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Next page' })).not.toBeInTheDocument()
  })

  it('falls back to the defaults for malformed values', async () => {
    await renderDemo(
      '/app?position=LW&ageMin=abc&scoreMin=7&sort=weird&page=-2&league=%5B%22Nowhere%22%5D',
      { language: 'en' },
    )

    expect(screen.getByRole('button', { name: 'Filters' })).toBeVisible()
    expect(rows('Left wings on the list')).toHaveLength(14)
    expect(screen.getByText('1–14 of 14 · Promoted first, then by score')).toBeVisible()
  })
})

describe('no results', () => {
  it('names what the position holds and offers a way back', async () => {
    const { router } = await renderDemo('/app?position=GK&ageMax=20&scoreMin=60', {
      language: 'en',
    })
    const user = userEvent.setup()

    const empty = screen.getByRole('region', { name: 'No players match these filters' })
    expect(empty).toHaveTextContent(/The GK list holds 7 players, scored \d+ to \d+\./)

    await user.click(within(empty).getByRole('button', { name: 'Drop the score filter' }))

    expect(router.state.location.search).toEqual({ position: 'GK', ageMax: 20 })
    expect(rows('Goalkeepers on the list').map((row) => rowName(row))).toEqual(['Leon Knežević'])
  })

  it('resets every filter', async () => {
    const { router } = await renderDemo('/app?position=GK&ageMax=20&scoreMin=60', {
      language: 'en',
    })
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Reset filters' }))

    expect(router.state.location.search).toEqual({ position: 'GK' })
    expect(rows('Goalkeepers on the list')).toHaveLength(7)
  })
})
