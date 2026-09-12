import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="page-wrap px-4 pt-14 pb-8">
      <section className="island-shell rise-in rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <p className="island-kicker mb-3">Prva postava</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Project foundation is ready.
        </h1>
        <p className="m-0 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          Replace this page with the first real screen.
        </p>
      </section>
    </main>
  )
}
