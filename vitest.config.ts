import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    css: false,
    // Stand-ins for the Loops credentials, so `src/env.ts` validates without a real account.
    // Nothing reaches Loops in tests: `loops-audience.test.ts` replaces `fetch`.
    env: {
      LOOPS_API_KEY: 'test-key-not-a-real-one',
      LOOPS_CLUBS_LIST_ID: 'list-for-clubs',
      LOOPS_PLAYERS_LIST_ID: 'list-for-players',
    },
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
