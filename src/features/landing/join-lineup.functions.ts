import { createServerFn } from '@tanstack/react-start'

import { lineupSignupSchema } from './lineup-signup-schema'

/**
 * Takes a signup from the CTA band. Where signups go (Loops, a database) is undecided, so it
 * only validates and echoes the normalised signup back. Attach the destination here.
 */
export const joinLineup = createServerFn({ method: 'POST' })
  .validator(lineupSignupSchema)
  .handler(({ data }) => data)
