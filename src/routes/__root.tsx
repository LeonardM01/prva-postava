import { TanStackDevtools } from '@tanstack/react-devtools'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { type ReactNode } from 'react'

import { Footer } from '#/components/footer'
import { Header } from '#/components/header'
import { PostHogProvider } from '#/integrations/posthog/provider'
import { tanstackQueryDevtoolsPlugin } from '#/integrations/tanstack-query/devtools'
import appCss from '#/styles.css?url'

interface RouterContext {
  queryClient: QueryClient
}

// Runs before hydration so the first paint already has the right theme class.
const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      { title: 'Prva postava' },
    ],
    links: [{ href: appCss, rel: 'stylesheet' }],
  }),
  shellComponent: RootDocument,
})

interface RootDocumentProps {
  readonly children: ReactNode
}

function RootDocument({ children }: RootDocumentProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- static, trusted theme bootstrap */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans [overflow-wrap:anywhere] antialiased selection:bg-[rgba(79,184,178,0.24)]">
        <PostHogProvider>
          <Header />
          {children}
          <Footer />
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
