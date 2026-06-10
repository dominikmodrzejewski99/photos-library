import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:4201',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { executablePath: '/usr/bin/google-chrome' },
      },
    },
  ],
  webServer: {
    command: 'npm start -- --port 4201',
    url: 'http://localhost:4201',
    reuseExistingServer: true,
  },
});
