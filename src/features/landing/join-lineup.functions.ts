import { createServerFn } from '@tanstack/react-start'

import { lineupSignupSchema } from './lineup-signup-schema'
import { addSignupToAudience } from './loops-audience'

/**
 * Takes a signup from the CTA band and puts it in the Loops audience, which is where signups
 * live: there is no database behind this. The normalised signup goes back to the band, which
 * names the address in its confirmation.
 */
export const joinLineup = createServerFn({ method: 'POST' })
  .validator(lineupSignupSchema)
  .handler(async ({ data }) => {
    await addSignupToAudience(data)
    return data
  })
