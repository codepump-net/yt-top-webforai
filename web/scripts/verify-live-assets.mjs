import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const manifest = JSON.parse(await fs.readFile('reports/build-manifest.json', 'utf8'));
const origin = new URL(manifest.origin).origin;
const base = origin + manifest.basePath;
const browser = await chromium.launch({ headless: true });
const results = [];
const failures = [];
const resources = new Map();
const routes = [...manifest.routes];
const output = 'reports/live-assets';
await fs.mkdir(output, { recursive: true });
try {
  await Promise.all(Array.from({ length: 4 }, async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('response', (response) => {
      const type = response.request().resourceType();
      if (['image', 'stylesheet', 'script', 'font'].includes(type))
        resources.set(response.url(), { url: response.url(), type, status: response.status() });
    });
    while (routes.length) {
      const route = routes.shift();
      const url = base + route.path;
      const requestFailures = [];
      const onFailure = (request) => requestFailures.push({
        url: request.url(), error: request.failure()?.errorText,
      });
      page.on('requestfailed', onFailure);
      try {
        const response = await page.goto(url, { waitUntil: 'load', timeout: 30_000 });
        const images = await page.locator('img').evaluateAll(async (elements) => {
          return await Promise.all(elements.map(async (img) => {
            img.loading = 'eager';
            let error = null;
            try { await img.decode(); } catch (e) { error = e.message; }
            return { src: img.currentSrc || img.src, width: img.naturalWidth,
              height: img.naturalHeight, error };
          }));
        });
        const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
        const stylesheets = await page.evaluate(() => document.styleSheets.length);
        const brokenImages = images.filter((img) => img.error || img.width === 0);
        const ok = response.status() === 200 && canonical === url && stylesheets > 0 &&
          brokenImages.length === 0 && requestFailures.length === 0;
        const result = { path: route.path, status: response.status(), canonical,
          stylesheets, imageCount: images.length, images, requestFailures, ok };
        results.push(result);
        if (!ok) failures.push(result);
        if (route.path === '/') {
          await page.screenshot({ path: `${output}/home-desktop.png`, fullPage: true });
          await page.setViewportSize({ width: 390, height: 844 });
          await page.screenshot({ path: `${output}/home-mobile.png`, fullPage: true });
          await page.setViewportSize({ width: 1440, height: 1000 });
        }
      } catch (error) {
        failures.push({ path: route.path, error: error.message });
      } finally {
        page.off('requestfailed', onFailure);
      }
      if ((results.length + failures.filter((f) => f.error).length) % 25 === 0)
        console.log(`Checked ${results.length} pages; failures: ${failures.length}`);
    }
    await page.close();
  }));
} finally {
  await browser.close();
}
const badResources = [...resources.values()].filter((r) => r.status >= 400 || r.url.startsWith('http://'));
const report = { checkedAt: new Date().toISOString(), origin, commit: manifest.commit,
  pageCount: results.length, imageOccurrences: results.reduce((sum, r) => sum + r.imageCount, 0),
  uniqueImages: [...new Set(results.flatMap((r) => r.images.map((img) => img.src)))].length,
  resources: [...resources.values()], results, failures, badResources };
await fs.writeFile(`${output}/verification.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ pages: report.pageCount, imageOccurrences: report.imageOccurrences,
  uniqueImages: report.uniqueImages, failures: failures.length, badResources: badResources.length }));
if (failures.length || badResources.length) process.exitCode = 1;
