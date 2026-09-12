import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  client: {
    VITE_POSTHOG_HOST: z.url().optional(),
    VITE_POSTHOG_KEY: z.string().startsWith('phc_').optional(),
  },
  clientPrefix: 'VITE_',
  emptyStringAsUndefined: true,
  runtimeEnv: import.meta.env,
  // Server-only variables cannot come from import.meta.env (Vite only exposes VITE_*). When the first one is needed, switch runtimeEnv to merge process.env.
  server: {},
})
