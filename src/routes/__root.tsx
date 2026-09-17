import { TanStackDevtools } from '@tanstack/react-devtools'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Scripts, useParams } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { type ReactNode } from 'react'

import { NotFound } from '#/components/not-found'
import { RouteError } from '#/components/route-error'
import { PostHogProvider } from '#/integrations/posthog/provider'
import { tanstackQueryDevtoolsPlugin } from '#/integrations/tanstack-query/devtools'
import { FONT_PRELOAD_LINKS } from '#/lib/font-preloads'
import { ICON_LINKS, THEME_COLOR_META } from '#/lib/icon-links'
import { parseLanguage } from '#/lib/language'
import appCss from '#/styles.css?url'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: RouteError,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      THEME_COLOR_META,
      { title: 'Prva postava' },
    ],
    links: [...FONT_PRELOAD_LINKS, ...ICON_LINKS, { href: appCss, rel: 'stylesheet' }],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

interface RootDocumentProps {
  readonly children: ReactNode
}

function RootDocument({ children }: RootDocumentProps) {
  // Not every route has the language segment (not-found does not), so read it loosely and parse it.
  const language = useParams({ strict: false, select: (params) => parseLanguage(params.lang) })

  return (
    <html lang={language}>
      <head>
        <HeadContent />
      </head>
      <body className="[overflow-wrap:anywhere] selection:bg-tint selection:text-ink">
        <PostHogProvider>
          {children}
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
              tanstackQueryDevtoolsPlugin,
            ]}
          />
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  )
}
