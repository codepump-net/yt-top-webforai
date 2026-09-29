import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';
import notices from '../../../content/notices.json';
import assets from '../../../content/assets.json';

const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const notice = notices.find((n) => n.id === 'notice-2026-09-17-infection-guide')!;
const document = notice.document!;
const url = (path: string) => `http://127.0.0.1:3000${manifest.basePath}${path}`;
const digest = (bytes: Buffer) => crypto.createHash('sha256').update(bytes).digest('hex');

test('serves the matching original PDF and every full page without missing or substituted files', async ({
  request,
}) => {
  const pdf = await request.get(url(document.pdf));
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
  const bytes = await pdf.body();
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  expect(digest(bytes)).toBe(document.sha256);
  expect(bytes.length).toBe(document.bytes);
  expect(document.pages).toHaveLength(16);
  for (const figure of document.pages) {
    const asset = assets.find((a) => a.id === figure.assetId)!;
    const response = await request.get(url(asset.file));
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    expect(digest(await response.body())).toBe(asset.sha256);
  }
});

for (const width of [390, 1440]) {
  test(`all 16 pages retain their order, dimensions and keyboard enlargement at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(url(notice.path));
    fs.mkdirSync('reports/infection-guide', { recursive: true });
    const section = page.locator('#notice-original');
    await expect(section).toContainText('원문 16쪽');
    await expect(section).toContainText('2026년 9월 20일 12:00');
    await expect(page.locator('#notice-information')).toContainText(
      '집계 기준일은 2026년 9월 12일',
    );
    await expect(page.locator('.notice-attachment')).toContainText('통계 원문 38쪽');
    await expect(
      section.getByRole('link', { name: '원본 PDF 보기 (새 창)', exact: true }),
    ).toHaveAttribute('href', manifest.basePath + document.pdf);
    const figures = section.locator('.notice-page-image');
    await expect(figures).toHaveCount(16);
    for (const [i, item] of document.pages.entries()) {
      const figure = figures.nth(i);
      const asset = assets.find((a) => a.id === item.assetId)!;
      const trigger = figure.locator('.image-enlarge');
      const img = trigger.locator('img');
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty('naturalWidth', asset.width);
      await expect(img).toHaveJSProperty('naturalHeight', asset.height);
      await expect(img).toHaveAttribute('alt', item.alt);
      await expect(figure.locator('figcaption')).toHaveText(`${i + 1} / 16쪽`);
      const size = await img.boundingBox();
      expect(size!.width).toBeLessThanOrEqual(asset.width);
      expect(Math.abs(size!.width / size!.height - asset.width / asset.height)).toBeLessThan(0.001);
      await figure.screenshot({
        path: `reports/infection-guide/${width}-page-${String(i + 1).padStart(2, '0')}.png`,
      });
      await trigger.focus();
      if (i % 2 === 0) await page.keyboard.press('Enter');
      else await trigger.click();
      const dialog = figure.locator('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('img')).toHaveJSProperty('naturalWidth', asset.width);
      expect((await dialog.locator('img').boundingBox())!.width).toBe(asset.width);
      const original = dialog.getByRole('link', { name: '원본 크기로 보기 (새 창)', exact: true });
      await expect(original).toHaveAttribute('href', manifest.basePath + asset.file);
      if (i === 0 || i === 15) {
        const opened = page.waitForEvent('popup');
        await original.click();
        const popup = await opened;
        await popup.waitForLoadState();
        await expect(popup.locator('img')).toHaveJSProperty('naturalWidth', asset.width);
        await popup.close();
      }
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      expect(
        await page.evaluate(() => window.document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
    }
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}

test('the original PDF and all 16 full images remain accessible without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(url(notice.path));
  await expect(page.locator('#notice-original .image-enlarge')).toHaveCount(16);
  const first = page.locator('#notice-original .image-enlarge').first();
  const target = await first.getAttribute('href');
  await first.click();
  await expect(page).toHaveURL(`http://127.0.0.1:3000${target}`);
  await expect(page.locator('img')).toHaveJSProperty('naturalWidth', 1653);
  await context.close();
});
