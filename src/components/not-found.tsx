import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
      {/* React hoists this into the head. The not-found boundary can be any route, so no single
          route's head option knows the page is missing. */}
      <meta name="robots" content="noindex" />
      <h1>Page not found</h1>
      <Link
        to="/{-$lang}"
        params={{ lang: undefined }}
        className="text-signal underline underline-offset-4"
      >
        Go home
      </Link>
    </main>
  )
}
