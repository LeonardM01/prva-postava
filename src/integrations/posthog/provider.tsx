import { PostHogProvider as BasePostHogProvider } from '@posthog/react'
import posthog from 'posthog-js'
import { type ReactNode } from 'react'

import { env } from '#/env'

const isBrowser = typeof window !== 'undefined'

if (isBrowser && env.VITE_POSTHOG_KEY !== undefined) {
  posthog.init(env.VITE_POSTHOG_KEY, {
    api_host: env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com',
    capture_pageview: 'history_change',
    defaults: '2025-11-30',
    person_profiles: 'identified_only',
  })
}

interface PostHogProviderProps {
  readonly children: ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  return <BasePostHogProvider client={posthog}>{children}</BasePostHogProvider>
}
