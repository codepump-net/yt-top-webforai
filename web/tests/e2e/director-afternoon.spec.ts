import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import { load } from 'cheerio';
import pages from '../../../content/pages.json';
import assets from '../../../content/assets.json';
import { articleGuidance } from '../../src/lib/article-guidance.mjs';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const url = (path: string) => `http://127.0.0.1:3000${manifest.basePath}${path}`;

test('every medical article has one reuse notice and every page has the global copyright link', async () => {
  for (const route of manifest.routes) {
    const $ = load(fs.readFileSync(`out/${route.file}`, 'utf8'));
    expect($(`.site-footer a[href="${manifest.basePath}/copyright/"]`).length, route.path).toBe(1);
    const page = pages.find((p) => p.id === route.id)!;
    const expected = articleGuidance(page).medical || page.id === 'notices' ? 1 : 0;
    expect($('.article-copyright').length, route.path).toBe(expected);
  }
});

test('search recovers from a failed static index request and preserves patient privacy', async ({
  page,
  request,
}) => {
  const response = await request.get(url('/search-index.json'));
  expect(response.status()).toBe(200);
  const index = await response.json();
  expect(index.filter((p: { url: string }) => p.url.includes('/symptoms/cardio/'))).toHaveLength(
    20,
  );
  expect(index.some((p: { url: string }) => p.url.includes('/cases/'))).toBe(false);
  await page.route('**/search-index.json', (route) => route.abort());
  await page.goto(url('/search/#q=식은땀'));
  await expect(page.getByRole('button', { name: '다시 불러오기' })).toBeVisible();
  await expect(page.locator('main a[href$="/sitemap/"]').first()).toBeVisible();
  await page.unroute('**/search-index.json');
  await page.getByRole('button', { name: '다시 불러오기' }).click();
  await expect(page.locator('#site-query')).toHaveValue('식은땀');
  await expect(page.locator('.result-card').first()).toBeVisible();
});

test('new symptom guides are discoverable and carry useful safety and reuse information', async ({
  page,
}) => {
  await page.goto(url('/symptoms/'));
  await expect(page.locator('.result-card[href*="/symptoms/cardio/"]')).toHaveCount(20);
  await page.locator('#site-query').fill('눈앞 캄캄');
  await expect(page.locator('.result-card').first()).toHaveAttribute(
    'href',
    manifest.basePath + '/symptoms/cardio/presyncope-cardiac-evaluation/',
  );
  await page.locator('.result-card').first().click();
  await expect(page.locator('.urgent-note')).toContainText('119');
  await expect(page.locator('.content-updated')).toContainText('2026-09-28');
  await expect(page.locator('.article-copyright a')).toHaveAttribute(
    'href',
    manifest.basePath + '/copyright/',
  );
  await expect(page.locator('.heart-reservation')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await page.goto(url('/search/#q=학생 독감'));
  await expect(page.locator('.result-card[href$="/notices/"]')).toBeVisible();
});

test('home notices precede visit information and retain original announcement channel', async ({
  page,
}) => {
  await page.goto(url('/'));
  await expect(page.locator('.home-notices .notice-preview')).toHaveCount(3);
  expect(
    await page
      .locator('.home-notices')
      .evaluate((n) => n.nextElementSibling?.textContent?.includes('진료시간·오시는 길')),
  ).toBe(true);
  await page.locator('.notice-preview').first().click();
  await expect(page.locator('.notice-card')).toHaveCount(6);
  await expect(page.locator('a[href="https://yttop.co.kr/44"]').first()).toBeVisible();
  await expect(
    page.locator('#notice-2026-gyeonggi-student-influenza .notice-availability'),
  ).toContainText('전화로 확인');
  await expect(
    page.locator('#notice-2026-suwon-shingles-support .notice-availability'),
  ).toContainText('전화로 확인');
  await expect(
    page.locator('#notice-2026-09-17-infection-guide a[href*="down_supple_pdf"]'),
  ).toContainText('PDF');
});

test('notice archive changes after the program end date without advertising expired availability', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2027-05-01T00:00:00+09:00') });
  await page.goto(url('/notices/'));
  await expect(page.locator('.notice-archive #notice-2026-2027-national-influenza')).toBeVisible();
  await expect(page.locator('#notice-2026-2027-national-influenza .notice-status')).toHaveText(
    '안내 기간 종료',
  );
  await expect(page.locator('#notice-2026-09-17-infection-guide .notice-status')).toHaveText(
    '기준일 자료',
  );
});

test('figures work with keyboard, mobile layout and readable text equivalents', async ({
  page,
}) => {
  fs.mkdirSync('reports/director-afternoon', { recursive: true });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/conditions/kidney/',
      '/services/heart/',
      '/services/endoscopy/',
      '/health/after-endoscopy/',
      '/checkups/',
      '/notices/',
      '/copyright/',
    ]) {
      await page.goto(url(route));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} ${route}`,
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        route,
      ).toEqual([]);
      if (route === '/services/heart/') {
        const trigger = page.locator('.patient-diagram .image-enlarge');
        await trigger.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('img')).toHaveJSProperty(
          'naturalWidth',
          assets.find((asset) => asset.id === 'diagram-heart-flow')!.width,
        );
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(trigger).toBeFocused();
        await expect(page.locator('.diagram-text li')).toHaveCount(4);
        await page
          .locator('.patient-diagram')
          .screenshot({ path: `reports/director-afternoon/heart-diagram-${width}.png` });
      }
      if (route === '/conditions/kidney/')
        await page.screenshot({
          path: `reports/director-afternoon/kidney-${width}.png`,
          fullPage: true,
        });
      if (route === '/notices/')
        await page.screenshot({
          path: `reports/director-afternoon/notices-${width}.png`,
          fullPage: true,
        });
    }
  }
});

test('notice source links, figures and all new guides remain usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(url('/symptoms/'));
  await expect(page.locator('.result-card[href*="/symptoms/cardio/"]')).toHaveCount(20);
  await page.goto(url('/services/endoscopy/'));
  await expect(page.locator('.diagram-text')).toContainText('약은 임의로 중단하지 않습니다');
  const imageLink = page.locator('.patient-diagram .image-enlarge');
  expect((await page.request.get((await imageLink.getAttribute('href'))!)).status()).toBe(200);
  await page.goto(url('/notices/'));
  await expect(page.locator('.notice-card')).toHaveCount(6);
  await context.close();
});
