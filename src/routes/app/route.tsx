import { createFileRoute } from '@tanstack/react-router'

import { DEMO_LAYOUT_OPTIONS } from '#/features/demo/demo-route-options'
import { DemoShell } from '#/features/demo/demo-shell'

export const Route = createFileRoute('/app')({
  ...DEMO_LAYOUT_OPTIONS,
  component: DemoShell,
})
