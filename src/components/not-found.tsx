import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
      <h1>Page not found</h1>
      <Link to="/" className="text-signal underline underline-offset-4">
        Go home
      </Link>
    </main>
  )
}
