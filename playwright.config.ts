import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const baseURL = `http://localhost:${PORT}`
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    // `*.desktop.spec.ts` and `*.mobile.spec.ts` cover layouts that only exist at one width.
    // The tablet frame is 1024 wide and keeps the desktop nav, chips and demos, stacked.
    {
      name: 'chromium',
      testIgnore: /\.mobile\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'tablet',
      testIgnore: /\.mobile\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'mobile-chrome',
      testIgnore: /\.desktop\.spec\.ts$/,
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    // The built Nitro server, not `vite preview`: preview serves `public/` through its own static
    // layer, which gets some content types wrong (`.webmanifest` comes back as octet-stream).
    command: 'node .output/server/index.mjs',
    // Stand-ins for the Loops credentials: the server validates them at boot, and the specs
    // answer the signup request in the browser, so nothing here is ever sent to Loops.
    env: {
      LOOPS_API_KEY: 'test-key-not-a-real-one',
      LOOPS_CLUBS_LIST_ID: 'list-for-clubs',
      LOOPS_PLAYERS_LIST_ID: 'list-for-players',
      PORT: String(PORT),
    },
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
