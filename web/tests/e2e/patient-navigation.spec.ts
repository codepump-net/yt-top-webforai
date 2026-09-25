import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const url = (path: string) => `http://127.0.0.1:3000${manifest.basePath}${path}`;

test('seven sections and four patient journeys preserve crawlable navigation without scripts', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(url('/'));
  await expect(page.locator('.desktop-nav a')).toHaveText([
    '증상백과',
    '질환백과',
    '진료분야',
    '검사·시술',
    '암환자 지지진료',
    '검진·서류',
    '병원안내',
  ]);
  await expect(page.locator('.patient-entry')).toHaveCount(4);
  for (const path of ['/symptoms/', '/preparation/', '/services/cancer-support/', '/checkups/']) {
    await expect(page.locator(`.patient-entry[href="${manifest.basePath}${path}"]`)).toBeVisible();
    await page.goto(url(path));
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main a[href]')).not.toHaveCount(0);
    await page.goto(url('/'));
  }
  for (const path of ['/symptoms/', '/diseases/']) {
    await page.goto(url(path));
    const titles = await page.locator('.result-card h2').allTextContents();
    expect(titles.length).toBeGreaterThan(5);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'ko')));
    for (const link of await page.locator('.result-card').all()) {
      const response = await page.request.get((await link.getAttribute('href'))!);
      expect(response.status()).toBe(200);
    }
    await expect(page.locator('main')).not.toContainText(/100편|120편|220편/);
  }
  await context.close();
});

test('encyclopedias filter and search real articles, and reset remains usable', async ({
  page,
}) => {
  await page.goto(url('/diseases/'));
  await page.getByRole('button', { name: '심장·혈관', exact: true }).click();
  await expect(page.locator('.result-card')).toHaveCount(3);
  await page.locator('input').fill('판막');
  await expect(page.locator('.result-card').first()).toHaveAttribute(
    'href',
    manifest.basePath + '/health/heart-valve-regurgitation/',
  );
  await page.locator('.result-card').first().click();
  await expect(page.locator('h1')).toContainText('판막');
  await expect(page.locator('.page-category')).toHaveText('질환백과');
  await page.goto(url('/symptoms/'));
  await page.locator('input').fill('없는증상xxxx');
  await page.getByRole('button', { name: '전체 목록 보기' }).click();
  await expect(page.locator('input')).toBeFocused();
  await page.locator('input').fill('두근거림');
  await expect(page.locator('.result-card').first()).toContainText('두근거림');
});

test('left contents stays reachable and mobile offers contents and preparation without repeated cards', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url('/services/heart/echocardiography/'));
  const sidebar = page.locator('.article-sidebar');
  const body = page.locator('.main-article');
  expect((await sidebar.boundingBox())!.x).toBeLessThan((await body.boundingBox())!.x);
  await page.evaluate(() => window.scrollTo(0, 850));
  const top = (await page.locator('.sidebar-box').boundingBox())!.y;
  expect(top).toBeGreaterThanOrEqual((await page.locator('header').boundingBox())!.height);
  expect(top).toBeLessThan(180);
  const anchor = page.locator('.sidebar-box nav a[href^="#"]').first();
  await anchor.click();
  await expect(page).toHaveURL(/#.+/);
  await expect(page.locator('.related-section')).toHaveCount(0);
  await expect(page.locator('.article-connections a')).not.toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.mobile-toc')).not.toHaveAttribute('open');
  await page.locator('.mobile-toc > summary').click();
  await expect(page.locator('.mobile-toc nav a[href^="#"]').first()).toBeVisible();
  await page.locator('.mobile-contact a[href$="/preparation/"]').click();
  await expect(page.locator('h1')).toHaveText('검사 준비와 검사 후 관리');
});

test('contents includes directory and physician sections, and test comparisons use the examination category', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  for (const route of [
    '/about/',
    '/services/',
    '/health/',
    '/fees/',
    '/doctors/park-jongseol/',
    '/doctors/park-rayoung/',
  ]) {
    await page.goto(url(route));
    const toc = page.locator('.sidebar-box');
    await expect(toc).toBeVisible();
    for (const heading of await page
      .locator(
        '.hub-directory h2, .values h2, .doctor-profile h3, .article-section h2, .provenance h2',
      )
      .all()) {
      const title = (await heading.textContent())!.trim();
      const entry = toc.getByRole('link', { name: title, exact: true });
      await expect(entry, `${route}: ${title}`).toHaveCount(1);
      const anchor = (await entry.getAttribute('href'))!;
      await expect(page.locator(anchor), `${route}: ${anchor}`).toHaveCount(1);
      await expect(page.locator(anchor)).toContainText(title);
    }
  }
  await page.goto(url('/health/heart-test-differences/'));
  await expect(page.locator('.page-category')).toHaveText('검사·시술');
  await expect(page.locator('.desktop-nav [aria-current="location"]')).toHaveText('검사·시술');
  await context.close();
});

test('new home and hub layouts are accessible and fit desktop and mobile', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/symptoms/',
      '/diseases/',
      '/preparation/',
      '/services/',
      '/conditions/',
    ]) {
      await page.goto(url(route));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} ${route}`,
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        `${width} ${route}`,
      ).toEqual([]);
    }
  }
  fs.mkdirSync('reports/navigation', { recursive: true });
  await page.goto(url('/'));
  await page.screenshot({ path: 'reports/navigation/home-desktop.png', fullPage: true });
  await page.goto(url('/services/heart/echocardiography/'));
  await page.screenshot({ path: 'reports/navigation/article-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url('/'));
  await page.screenshot({ path: 'reports/navigation/home-mobile.png', fullPage: true });
  await page.goto(url('/diseases/'));
  await page.screenshot({ path: 'reports/navigation/diseases-mobile.png', fullPage: true });
});
