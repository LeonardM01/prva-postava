import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className="page-wrap px-4 py-12">
      <h1>Page not found</h1>
      <Link to="/">Go home</Link>
    </main>
  )
}
