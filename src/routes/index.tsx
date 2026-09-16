import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-14 pb-8 sm:px-8">
      <h1 className="mb-5 max-w-3xl font-display text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl sm:leading-none">
        Project foundation is ready.
      </h1>
      <p className="max-w-2xl text-lg text-muted">Replace this page with the first real screen.</p>
    </main>
  )
}
