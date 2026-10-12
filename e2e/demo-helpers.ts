import { AxeBuilder } from '@axe-core/playwright'
import { type Page } from '@playwright/test'

// Collects console errors and uncaught exceptions from the moment it is called.
export function collectErrors(page: Page) {
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

export async function languageCookie(page: Page) {
  const cookies = await page.context().cookies()
  return cookies.find((cookie) => cookie.name === 'lang')?.value
}

export async function measureSidewaysOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
}

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

export async function findViolations(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.allSettled(document.getAnimations().map((animation) => animation.finished))
  })
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  // Rule and element are enough to find the problem; the full axe report is noise in a diff.
  return results.violations.map((violation) => ({
    rule: violation.id,
    elements: violation.nodes.map((node) => node.target.join(' ')),
  }))
}
