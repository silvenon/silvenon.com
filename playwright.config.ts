import { defineConfig, devices } from '@playwright/test'
import { PORT } from './consts'

export default defineConfig({
  testDir: './integration',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    ...(process.env.CI
      ? [
          {
            name: 'webkit',
            use: {
              ...devices['Desktop Safari'],
            },
          },
        ]
      : []),
  ],
  webServer: {
    command: 'npm start',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    env: {
      SESSION_SECRET: 'test123',
      E2E_TESTING: 'true',
    },
  },
})
