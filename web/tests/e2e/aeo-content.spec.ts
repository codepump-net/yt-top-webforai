import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const coverage = JSON.parse(
  fs.readFileSync('../docs/aeo-geo-improvement-results-2026-09-11/question-coverage.json', 'utf8'),
);
const url = (p: string) => `http://127.0.0.1:3000${manifest.basePath}${p}`;
test('research-derived questions, evidence and contextual links are usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const record of coverage) {
    await page.goto(url(record.path));
    const answer = page.locator(`#${record.anchor}`);
    await expect(answer.locator('summary')).toHaveText('Q.' + record.question);
    if ((await answer.getAttribute('open')) === null) await answer.locator('summary').click();
    await expect(answer.locator('p').first()).toBeVisible();
  }
  await page.goto(url('/services/heart/echocardiography/'));
  await expect(page.locator('#purpose .answer-sources a').first()).toHaveAttribute(
    'href',
    /^https:\/\//,
  );
  await page.locator('#scope .context-links a').click();
  await expect(page).toHaveURL(/health\/heart-test-differences\//);
  await expect(page.locator('table caption')).toBeVisible();
  await context.close();
});
test('new comparison and preparation tables fit a small viewport and have readable headers', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of [
    '/health/heart-test-differences/',
    '/health/colonoscopy-preparation-questions/',
    '/services/heart/holter/',
    '/fees/',
  ]) {
    await page.goto(url(path));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await expect(page.locator('table caption')).toBeVisible();
    expect(await page.locator('table th[scope="col"]').count()).toBeGreaterThan(1);
    expect(await page.locator('table th[scope="row"]').count()).toBeGreaterThan(1);
  }
});
