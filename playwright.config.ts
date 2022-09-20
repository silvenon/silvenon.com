import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const config: PlaywrightTestConfig = {
  testDir: './integration',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
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
    reuseExistingServer: true,
    env: {
      E2E_TESTING: 'true',
    },
  },
}

export default config
