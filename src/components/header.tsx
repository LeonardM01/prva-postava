import { Link } from '@tanstack/react-router'

import { ThemeToggle } from '#/components/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav
        aria-label="Main"
        className="page-wrap flex items-center justify-between gap-3 py-3 sm:py-4"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] no-underline sm:px-4 sm:py-2"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]"
          />
          Prva postava
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  )
}
