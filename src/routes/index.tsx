import { createFileRoute } from '@tanstack/react-router'

import { LandingPage } from '#/features/landing/landing-page'
import { languageSearchSchema } from '#/lib/language'

export const Route = createFileRoute('/')({
  validateSearch: languageSearchSchema,
  component: LandingPage,
})
