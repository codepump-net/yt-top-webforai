import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('out/build-manifest.json', 'utf8'));
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'reports/e2e.json' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://127.0.0.1:3000${manifest.basePath}/`,
    channel: process.platform === 'win32' ? 'msedge' : undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: `http://127.0.0.1:3000${manifest.basePath}/`,
    reuseExistingServer: !process.env.CI,
  },
});
