import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const retired = JSON.parse(
  fs.readFileSync('../docs/content-audit-2026-09-11/retired-pages.json', 'utf8'),
);
const url = (route: string) => `http://127.0.0.1:3000${manifest.basePath}${route}`;

test('retired pages and internal build artifacts are not served', async ({ request }) => {
  for (const route of [
    ...retired.map((p: { path: string }) => p.path),
    '/build-manifest.json',
    '/planned-sitemap.xml',
    '/content/reviews.json',
    '/content/publication-approval.json',
    '/publication-approval.json',
    '/docs/patient-content-policy.ko.md',
  ])
    expect((await request.get(url(route))).status(), route).toBe(404);
});

test('case links remain readable without JavaScript and lead to hospital originals', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(url('/cases/'));
  await expect(page.locator('.result-card')).toHaveCount(25);
  for (const card of await page.locator('.result-card').all()) {
    expect(await card.getAttribute('href')).toMatch(
      /^https:\/\/yttop\.co\.kr\/21\/\?bmode=view&idx=\d+&t=board$/,
    );
    await expect(card).toContainText('병원 홈페이지에서 보기');
    await expect(card).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await context.close();
});

test('patient search and sitemap exclude the retired policy and local article copies', async ({
  page,
}) => {
  for (const route of ['/search/', '/sitemap/']) {
    await page.goto(url(route));
    await expect(page.locator('a[href*="content-policy"]')).toHaveCount(0);
    await expect(
      page.locator('a[href*="/cases/"]').filter({ hasNotText: '진단 사례' }),
    ).toHaveCount(0);
    await expect(page.locator('.review-bar')).toHaveCount(0);
    await expect(page.locator('footer')).toContainText(
      '영통탑내과의 진료·검사와 방문을 안내합니다.',
    );
  }
});
