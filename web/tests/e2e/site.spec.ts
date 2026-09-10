import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('out/build-manifest.json', 'utf8')) as {
  basePath: string;
  routes: { path: string; id: string; indexable: boolean }[];
};
const url = (path: string) => `http://127.0.0.1:3000${manifest.basePath}${path}`;
test('all 76 routes return HTML with one heading and correct indexing', async ({ request }) => {
  for (const route of manifest.routes) {
    const response = await request.get(url(route.path));
    expect(response.status(), route.path).toBe(200);
    const html = await response.text();
    expect((html.match(/<h1(?:\s|>)/g) ?? []).length, route.path).toBe(1);
    if (!route.indexable) expect(html, route.path).toContain('noindex');
  }
});
test('all content routes remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of manifest.routes) {
    await page.goto(url(route.path));
    await expect(page.locator('main h1'), route.path).toBeVisible();
    await expect(page.locator('footer')).toContainText('031-202-7555');
    const brokenImages = await page
      .locator('img')
      .evaluateAll((images) =>
        images.some(
          (img) =>
            (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth === 0,
        ),
      );
    expect(brokenImages, route.path).toBe(false);
  }
  await context.close();
});
for (const route of [
  '/',
  '/visit/',
  '/doctors/park-jongseol/',
  '/doctors/park-rayoung/',
  '/services/heart/echocardiography/',
  '/cases/',
  '/search/',
  '/privacy/',
]) {
  test(`WCAG 2.2 AA automated accessibility: ${route}`, async ({ page }) => {
    await page.goto(url(route));
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
}
test('responsive layout, images, and visual review captures', async ({ page }) => {
  fs.mkdirSync('reports/screenshots', { recursive: true });
  for (const width of [360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/visit/',
      '/services/heart/echocardiography/',
      '/doctors/park-jongseol/',
      '/search/',
    ]) {
      await page.goto(url(route));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${width} ${route}`,
      ).toBe(true);
    }
    if ([390, 1440].includes(width)) {
      await page.goto(url('/'));
      for (const img of await page.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty('complete', true);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `reports/screenshots/home-${width}.png`, fullPage: true });
    }
  }
});
test('local search, empty state, category and reset', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (r) => {
    if (!r.url().startsWith('http://127.0.0.1:3000/')) externalRequests.push(r.url());
  });
  await page.goto(url('/search/'));
  await page.getByLabel('궁금한 검사나 진료를 찾아보세요').fill('심장초음파');
  await expect(
    page.locator('.result-card').filter({ hasText: '심장초음파 검사' }).first(),
  ).toBeVisible();
  await page.getByLabel('궁금한 검사나 진료를 찾아보세요').fill('심장초음파   예약');
  await expect(
    page.locator('.result-card').filter({ hasText: '심장초음파 검사' }).first(),
  ).toBeVisible();
  await page.getByLabel('궁금한 검사나 진료를 찾아보세요').fill('없는검색어xxxxxxxx');
  await expect(page.getByRole('heading', { name: '검색 결과가 없습니다.' })).toBeVisible();
  await page.getByRole('button', { name: '전체 목록 보기' }).click();
  await page.getByRole('button', { name: '건강정보', exact: true }).click();
  await expect(page.locator('.result-card')).toHaveCount(5); // Four articles and their overview.
  expect(externalRequests).toEqual([]);
});
test('mobile navigation works without client scripting', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(url('/'));
  await page.getByLabel('전체 메뉴 열기').click();
  await page
    .getByRole('navigation', { name: '모바일 메뉴' })
    .getByRole('link', { name: '의료진', exact: true })
    .click();
  await expect(page.locator('h1')).toHaveText('의료진 소개');
  await expect(page.locator('.mobile-contact a').first()).toHaveAttribute('href', 'tel:0312027555');
  await context.close();
});
test('keyboard skip link, Q&A and deep refresh', async ({ page }) => {
  await page.goto(url('/services/heart/echocardiography/'));
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  const detail = page.locator('.qa-list details').nth(1);
  await detail.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(detail).toHaveAttribute('open', '');
  await page.reload();
  await expect(page.locator('h1')).toHaveText('심장초음파 검사');
});
test('unknown deep link returns a real 404 with recovery links', async ({ page }) => {
  const response = await page.goto(url('/this-page-does-not-exist/'));
  expect(response!.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('페이지를 찾을 수 없습니다.');
  await expect(page.locator('main').getByRole('link', { name: '홈으로 가기' })).toHaveAttribute(
    'href',
    manifest.basePath + '/',
  );
});
test('urgent symptom context shows emergency guidance without an article booking CTA', async ({
  page,
}) => {
  await page.goto(url('/health/palpitations-test-followup/'));
  await expect(page.locator('.urgent-note')).toContainText('119');
  await expect(page.locator('.article-sidebar .sidebar-cta')).toHaveCount(0);
});
