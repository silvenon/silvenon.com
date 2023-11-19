import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const config: PlaywrightTestConfig = {
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
    port: 3000,
    env: {
      E2E_TESTING: 'true',
    },
  },
}

export default config
