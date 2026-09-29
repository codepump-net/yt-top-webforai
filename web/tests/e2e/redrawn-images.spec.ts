import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import pages from '../../../content/pages.json';
import assets from '../../../content/assets.json';
import visuals from '../../../content/visuals.json';

const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const targets = [
  ...visuals.banners,
  ...visuals.diagrams,
  { pageId: 'vaccinations', assetId: 'vaccination-schedule-2026' },
];
const url = (path: string) => `http://127.0.0.1:3000${manifest.basePath}${path}`;

test('all 17 registered PNG masters are real, complete image responses at the export path', async ({
  request,
}) => {
  expect(targets).toHaveLength(17);
  for (const target of targets) {
    const asset = assets.find((a) => a.id === target.assetId)!;
    expect(asset.file).toMatch(/\/clinic-visuals-hq\/.+-hq-original\.png$/);
    const response = await request.get(url(asset.file));
    expect(response.status(), asset.id).toBe(200);
    expect(response.headers()['content-type'], asset.id).toBe('image/png');
    const bytes = await response.body();
    expect(bytes.length, asset.id).toBe(asset.bytes);
    expect(createHash('sha256').update(bytes).digest('hex'), asset.id).toBe(asset.sha256);
  }
});

for (const width of [390, 1440]) {
  test(`all 17 figures load, preserve their proportions and open the same PNG at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/assets/clinic-visuals-hq/**', (route) => route.continue());
    const results = [];
    for (const target of targets) {
      const asset = assets.find((a) => a.id === target.assetId)!;
      const content = pages.find((p) => p.id === target.pageId)!;
      await page.goto(url(content.path));
      const image = page.locator(`main img[src="${manifest.basePath}${asset.file}"]`).first();
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('naturalWidth', asset.width);
      await expect(image).toHaveJSProperty('naturalHeight', asset.height);
      const dimensions = await image.evaluate((node) => {
        const img = node as HTMLImageElement;
        const box = img.getBoundingClientRect();
        return {
          width: box.width,
          height: box.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          alt: img.alt,
          fit: getComputedStyle(img).objectFit,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      expect(dimensions.width, asset.id).toBeLessThanOrEqual(asset.width + 1);
      expect(dimensions.width / dimensions.height, asset.id).toBeCloseTo(
        asset.width / asset.height,
        2,
      );
      expect(dimensions.fit, asset.id).not.toBe('cover');
      expect(dimensions.alt.length, asset.id).toBeGreaterThan(2);
      expect(dimensions.overflow, asset.id).toBe(false);
      const link = image.locator('..');
      await expect(link).toHaveAttribute('href', manifest.basePath + asset.file);
      if (target.assetId.startsWith('banner-')) {
        const popupPromise = page.waitForEvent('popup');
        await link.click();
        const popup = await popupPromise;
        await popup.waitForLoadState();
        expect(popup.url()).toBe(url(asset.file));
        await expect(popup.locator('img')).toHaveJSProperty('naturalWidth', asset.width);
        await popup.close();
      } else {
        await link.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('img')).toHaveJSProperty('naturalWidth', asset.width);
        await expect(dialog.locator('a')).toHaveAttribute('href', manifest.basePath + asset.file);
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(link).toBeFocused();
      }
      results.push({ id: asset.id, path: content.path, file: asset.file, ...dimensions });
      if (
        ['banner-kidney', 'banner-cancer-support', 'diagram-after-endoscopy'].includes(asset.id)
      ) {
        fs.mkdirSync('reports/redrawn-images', { recursive: true });
        await image.screenshot({ path: `reports/redrawn-images/${asset.id}-${width}.png` });
      }
    }
    fs.mkdirSync('reports/redrawn-images', { recursive: true });
    fs.writeFileSync(
      `reports/redrawn-images/figures-${width}.json`,
      JSON.stringify(results, null, 2),
    );
  });
}
