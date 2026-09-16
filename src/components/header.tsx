import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="border-b border-line bg-card">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-7xl items-center px-4 py-4 sm:px-8"
      >
        <Link to="/" className="font-display text-lg font-extrabold tracking-tight text-ink">
          Prva postava
        </Link>
      </nav>
    </header>
  )
}
