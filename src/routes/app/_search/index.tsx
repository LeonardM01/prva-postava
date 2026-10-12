import { createFileRoute } from '@tanstack/react-router'

import { DossierPrompt } from '#/features/demo/dossier-prompt'

export const Route = createFileRoute('/app/_search/')({
  component: DossierPrompt,
})
