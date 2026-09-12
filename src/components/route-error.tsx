import { type ErrorComponentProps } from '@tanstack/react-router'

export function RouteError({ error }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : 'Unknown error'

  return (
    <main className="page-wrap px-4 py-12">
      <h1>Something went wrong</h1>
      <p>{message}</p>
    </main>
  )
}
