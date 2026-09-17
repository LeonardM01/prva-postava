import { createFileRoute } from '@tanstack/react-router'

import { absoluteUrl } from '#/lib/indexable-pages'

const ROBOTS = [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
  '',
].join('\n')

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => new Response(ROBOTS, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }),
    },
  },
})
