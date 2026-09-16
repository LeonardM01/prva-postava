import { type ErrorComponentProps } from '@tanstack/react-router'

export function RouteError({ error }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : 'Unknown error'

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
      <h1>Something went wrong</h1>
      <p>{message}</p>
    </main>
  )
}
