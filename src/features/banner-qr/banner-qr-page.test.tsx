import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { LandingPage } from '#/features/landing/landing-page'
import { LANDING_ROUTE_OPTIONS } from '#/features/landing/landing-route-options'

import { BannerQrPage } from './banner-qr-page'
import { BANNER_QR_ROUTE_OPTIONS } from './banner-qr-route-options'

/**
 * The chooser and the home page behind one memory router, so a test can take a door and read
 * the page it opens.
 */
async function renderBannerQr() {
  const rootRoute = createRootRoute()
  const bannerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/banner-qr',
    ...BANNER_QR_ROUTE_OPTIONS,
    component: BannerQrPage,
  })
  const landingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/{-$lang}/',
    ...LANDING_ROUTE_OPTIONS,
    component: LandingPage,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([bannerRoute, landingRoute]),
    history: createMemoryHistory({ initialEntries: ['/banner-qr'] }),
  })

  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: 'Igraš ili tražiš igrače?' })
  return router
}

function getDoors() {
  return screen.getByRole('navigation', { name: 'Odaberi stranu' })
}

function getHeroSwitch() {
  const hero = screen.getByRole('region', {
    name: screen.getByRole('heading', { level: 1 }).textContent,
  })
  return within(hero).getByRole('group', { name: 'Odaberi stranu' })
}

describe('banner QR chooser', () => {
  it('asks which side the visitor is on, player first', async () => {
    await renderBannerQr()

    const doors = within(getDoors()).getAllByRole('link')
    expect(doors.map((door) => door.textContent)).toEqual([
      expect.stringContaining('Ja sam igrač'),
      expect.stringContaining('Tražim igrače za klub'),
    ])
    expect(
      within(getDoors()).getByRole('link', { name: 'Ja sam igrač' }),
    ).toHaveAccessibleDescription('Oglasi se besplatno. Klubovi te traže po poziciji.')
  })

  it('opens the home page on the club side for a club', async () => {
    const user = userEvent.setup()
    const router = await renderBannerQr()

    await user.click(within(getDoors()).getByRole('link', { name: 'Tražim igrače za klub' }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Nađi sljedeće pojačanje u jednoj večeri.',
      }),
    ).toBeVisible()
    expect(
      within(getHeroSwitch()).getByRole('button', { name: 'Tražim igrače za klub' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(router.state.location.pathname).toBe('/')
  })

  it('opens the home page on the player side for a player', async () => {
    const user = userEvent.setup()
    await renderBannerQr()

    await user.click(within(getDoors()).getByRole('link', { name: 'Ja sam igrač' }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Ne čekaj da skaut dođe na tvoju utakmicu.',
      }),
    ).toBeVisible()
    expect(within(getHeroSwitch()).getByRole('button', { name: 'Ja sam igrač' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('tags both doors as visits from the match-day banners', async () => {
    await renderBannerQr()

    for (const door of within(getDoors()).getAllByRole('link')) {
      const url = new URL(door.getAttribute('href') ?? '', 'https://prvapostava.co')
      expect(url.searchParams.get('utm_source')).toBe('banner')
      expect(url.searchParams.get('utm_medium')).toBe('qr')
    }
  })
})
