import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import rawPages from '../../../content/pages.json';
import { homeGuideGroups } from '../../src/lib/information-architecture.mjs';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));

test('patients can open core preparation and visiting guides from home without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:3000${manifest.basePath}/`);
  const shortcuts = page.getByRole('region', { name: '검사·검진·방문 안내 바로 찾기' });
  await expect(shortcuts).toBeVisible();
  for (const { id, label } of homeGuideGroups.flatMap((group) => group.links)) {
    const target = rawPages.find((entry) => entry.id === id)!;
    const link = shortcuts.getByRole('link', { name: label, exact: true });
    await expect(link).toHaveAttribute('href', manifest.basePath + target.path);
    await expect(link).toBeVisible();
    expect((await page.request.get(manifest.basePath + target.path)).status()).toBe(200);
  }
  await shortcuts.getByRole('link', { name: '심장초음파 예약·준비물', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('심장초음파 검사');
  await context.close();
});
