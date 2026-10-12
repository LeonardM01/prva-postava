import { Outlet } from '@tanstack/react-router'

import { DemoTopBar } from './demo-top-bar'
import { SampleStrip } from './sample-strip'

export function DemoShell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <DemoTopBar />
      <SampleStrip />
      <main className="mx-auto w-full max-w-page flex-1 px-5 pt-6 pb-16 lg:px-8 lg:pt-8 xl:px-16">
        <Outlet />
      </main>
    </div>
  )
}
