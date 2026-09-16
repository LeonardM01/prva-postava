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
    {
      name: 'chromium',
      testIgnore: /\.mobile\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      testIgnore: /\.desktop\.spec\.ts$/,
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: `bun run preview --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
