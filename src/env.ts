import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

/**
 * Vite only exposes `VITE_*` through `import.meta.env`, so server-only values have to come from
 * `process.env`. The browser bundle imports this file for the PostHog keys and has no `process`,
 * so the merge is guarded; server variables are validated only where they exist, on the server.
 */
const processEnv: Record<string, string | undefined> =
  typeof process === 'undefined' ? {} : process.env

export const env = createEnv({
  client: {
    VITE_POSTHOG_HOST: z.url().optional(),
    VITE_POSTHOG_KEY: z.string().startsWith('phc_').optional(),
  },
  clientPrefix: 'VITE_',
  emptyStringAsUndefined: true,
  runtimeEnv: { ...import.meta.env, ...processEnv },
  server: {
    // Loops holds every signup: there is no database behind the CTA band. A missing key or list
    // must break the build rather than let a signup look successful and go nowhere.
    LOOPS_API_KEY: z.string().min(1),
    LOOPS_CLUBS_LIST_ID: z.string().min(1),
    LOOPS_PLAYERS_LIST_ID: z.string().min(1),
  },
})
