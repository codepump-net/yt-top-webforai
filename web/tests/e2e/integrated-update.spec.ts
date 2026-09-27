import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const url = (path: string) => `http://127.0.0.1:3000${manifest.basePath}${path}`;

test('home search stays below emergency guidance and opens local aliases without a query request', async ({
  page,
}) => {
  await page.goto(url('/'));
  await expect(page.locator('.header-search')).toContainText('검색');
  expect(
    await page
      .locator('.emergency-strip')
      .evaluate((el) => el.nextElementSibling?.classList.contains('home-search')),
  ).toBe(true);
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.locator('#home-query').fill('CARTBP');
  await page.locator('#home-query').press('Enter');
  await expect(page).toHaveURL(url('/search/') + '#q=CARTBP');
  await expect(page.locator('#site-query')).toHaveValue('CARTBP');
  await expect(page.locator('.result-card').first()).toHaveAttribute(
    'href',
    manifest.basePath + '/services/heart/ambulatory-blood-pressure/',
  );
  expect(requests.some((request) => new URL(request).searchParams.has('q'))).toBe(false);
  await page.goto(url('/search/'));
  await expect(page.locator('.result-card')).toHaveCount(0);
  await expect(page.locator('.filter-row button')).toHaveCount(8);
  await expect(page.locator('.search-privacy')).toContainText('개인정보는 입력하지 마세요');
  await page.getByRole('button', { name: /^질환 \d+개$/ }).click();
  await expect(page.locator('.result-card[href*="/diseases/cardio/"]')).toHaveCount(20);
  await expect(page.locator('.result-card[href*="/cases/"]')).toHaveCount(0);
});

test('care hubs expose eight destinations and organ guides without scripts', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(url('/conditions/'));
  await expect(page.locator('.care-directory > a')).toHaveCount(8);
  await expect(page.locator('.article-toc')).toHaveCount(0);
  for (const [route, count] of [
    ['/conditions/digestive/', 5],
    ['/conditions/thyroid-carotid-neck/', 3],
    ['/conditions/kidney/', 3],
  ] as const) {
    await page.goto(url(route));
    await expect(page.locator('.hub-directory a:not(.digestive-symptom-entry)')).toHaveCount(count);
    for (const link of await page.locator('.hub-directory a:not(.digestive-symptom-entry)').all()) {
      expect((await page.request.get((await link.getAttribute('href'))!)).status()).toBe(200);
    }
  }
  await page.goto(url('/conditions/digestive/'));
  await expect(
    page.locator('.main-article a[href$="/conditions/abdominal-pain/"]').first(),
  ).toBeVisible();
  await page.goto(url('/search/'));
  await expect(page.locator('noscript a[href$="/sitemap/"]')).toBeVisible();
  await context.close();
});

test('vaccination figure, table and unified contents remain readable on mobile and desktop', async ({
  page,
}) => {
  fs.mkdirSync('reports/integrated', { recursive: true });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/conditions/kidney/',
      '/conditions/thyroid-carotid-neck/neck-lump/',
      '/services/heart/ambulatory-blood-pressure/',
      '/services/vaccinations/',
    ]) {
      await page.goto(url(route));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width}: ${route}`,
      ).toBe(true);
      await expect(page.locator('.article-toc')).toHaveCount(1);
      expect(await page.locator('.article-toc nav a').count()).toBeLessThanOrEqual(8);
      await expect(
        page.locator(
          '.article-toc a[href="#sources"], .article-toc a[href="#faq"], .article-toc a[href="#article-guidance"]',
        ),
      ).toHaveCount(0);
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        `${width}: ${route}`,
      ).toEqual([]);
    }
    const figure = page.locator('.vaccination-figure');
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator('img')).toHaveJSProperty('naturalWidth', 1055);
    await expect(page.locator('#vaccination-schedule tbody tr')).toHaveCount(9);
    await expect(page.locator('#vaccination-schedule')).toContainText('수막구균');
    await figure.screenshot({ path: `reports/integrated/vaccination-figure-${width}.png` });
    if (width === 390) {
      await page.locator('.article-toc summary').click();
      await expect(page.locator('.article-toc nav a').first()).toBeVisible();
    } else {
      await expect(page.locator('.article-toc nav a').first()).toBeVisible();
    }
  }
});

test('case directory preserves originals while enforcing exclusions and privacy', async ({
  page,
  request,
}) => {
  await page.goto(url('/cases/'));
  const robots = (await page.locator('meta[name="robots"]').getAttribute('content'))!
    .split(',')
    .map((value) => value.trim());
  expect(robots).toEqual(
    expect.arrayContaining(['noindex', 'nofollow', 'nosnippet', 'noimageindex']),
  );
  await expect(page.locator('main input')).toHaveCount(0);
  await expect(page.locator('.result-card')).toHaveCount(25);
  const data = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(data.join('')).not.toContain('bmode=view');
  expect(data.join('')).not.toContain('ItemList');
  const sitemap = await request.get(url('/sitemap.xml'));
  expect(await sitemap.text()).not.toContain('/cases/');
  expect(fs.readFileSync('reports/planned-sitemap.xml', 'utf8')).not.toContain('/cases/');
  await page.goto(url('/sitemap/'));
  await expect(page.locator('main a[href$="/cases/"]')).toHaveCount(0);
  await expect(page.locator('footer a[href$="/cases/"]')).toHaveAttribute('rel', 'nofollow');
  await page.goto(url('/privacy/'));
  await expect(page.locator('main')).toContainText('정확한 진료일');
});
