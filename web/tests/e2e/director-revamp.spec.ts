import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const url = (p: string) => `http://127.0.0.1:3000${manifest.basePath}${p}`;
test('six visa versions have reciprocal links, static language and usable mobile navigation', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 360, height: 800 },
  });
  const page = await context.newPage();
  for (const [locale, route] of [
    ['ko', '/checkups/visa/'],
    ['en', '/en/checkups/visa/'],
    ['zh-Hans', '/zh-hans/checkups/visa/'],
    ['th', '/th/checkups/visa/'],
    ['ru', '/ru/checkups/visa/'],
    ['ne', '/ne/checkups/visa/'],
  ]) {
    await page.goto(url(route));
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('.language-switcher a')).toHaveCount(6);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(7);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      manifest.origin + manifest.basePath + route,
    );
    await expect(page.locator('#timing')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      route,
    ).toBe(true);
    await page.locator('.language-switcher a[hreflang="en"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  }
  await context.close();
});
test('long new articles, lists and emergency instructions remain accessible', async ({ page }) => {
  for (const route of [
    '/health/cancer-treatment-symptoms/',
    '/health/fever-during-cancer-treatment/',
    '/services/vaccinations/',
    '/health/plenvu-preparation/',
    '/en/checkups/visa/',
    '/ne/checkups/visa/',
  ]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url(route));
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      route,
    ).toBe(true);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      route,
    ).toEqual([]);
  }
  await page.goto(url('/health/fever-during-cancer-treatment/'));
  await expect(page.locator('.urgent-note')).toContainText('38.0℃');
  await expect(page.locator('.article-sidebar .sidebar-cta')).toHaveCount(0);
});
test('new preparations are discoverable from the examination and local search', async ({
  page,
}) => {
  await page.goto(url('/services/endoscopy/colonoscopy/'));
  await page.locator('main a').filter({ hasText: '플렌뷰 복용과 대장내시경 준비' }).first().click();
  await expect(page.locator('h1')).toContainText('플렌뷰');
  await expect(page.locator('.content-steps').first()).toContainText('500mL');
  await page.goto(url('/search/?q=' + encodeURIComponent('후버바늘')));
  await expect(page.locator('.result-card').first()).toContainText(/암|지지/);
});
