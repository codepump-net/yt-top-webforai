import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const url = (route: string) => `http://127.0.0.1:3000${manifest.basePath}${route}`;

for (const javaScriptEnabled of [true, false]) {
  test(`every menu link remains reachable in short viewports (JavaScript ${javaScriptEnabled})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const [width, height] of [
      [320, 225],
      [600, 280],
      [600, 320],
      [844, 256],
      [390, 844],
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto(url('/'));
      await page.locator('.mobile-nav summary').click();
      for (const link of await page.locator('.mobile-nav nav a').all()) {
        await link.focus();
        await expect
          .poll(
            () =>
              link.evaluate((el) => {
                const r = el.getBoundingClientRect();
                const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
                return !!hit && el.contains(hit);
              }),
            { message: `${width}×${height}: ${await link.textContent()}` },
          )
          .toBe(true);
      }
      if (javaScriptEnabled) {
        await expect(page.locator('.mobile-nav summary')).toHaveAttribute(
          'aria-label',
          '전체 메뉴 닫기',
        );
        await page.keyboard.press('Escape');
        await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open');
        await expect(page.locator('.mobile-nav summary')).toBeFocused();
      }
    }
    if (javaScriptEnabled) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(url('/services/heart/echocardiography/'));
      await page.locator('.mobile-nav summary').click();
      await page.locator('.mobile-nav nav a').last().focus();
      await page.keyboard.press('Tab');
      await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open');
      await expect(page.locator('.breadcrumbs a').first()).toBeFocused();
      expect(
        await page
          .locator('.breadcrumbs a')
          .first()
          .evaluate((el) => {
            const r = el.getBoundingClientRect();
            return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
          }),
      ).toBe(true);
    }
    await context.close();
  });
}

test('Tab keeps focused content and footer links above the contact bar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/services/heart/echocardiography/', '/search/']) {
    await page.goto(url(route));
    const steps = await page.locator('a,button,input,summary').count();
    for (let i = 0; i < steps; i++) {
      await page.keyboard.press('Tab');
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const el = document.activeElement;
              if (
                !(el instanceof HTMLElement) ||
                el === document.body ||
                el.closest('header,.review-bar,.mobile-contact,.skip-link')
              )
                return true;
              const r = el.getBoundingClientRect();
              const top = document.querySelector('header')!.getBoundingClientRect().bottom;
              const bottom = document.querySelector('.mobile-contact')!.getBoundingClientRect().top;
              // A card taller than the available area must expose its beginning; smaller controls fit fully.
              return r.height > bottom - top
                ? r.top >= top && r.top < bottom - 40
                : r.top >= top && r.bottom <= bottom;
            }),
          { message: `${route}, Tab ${i}` },
        )
        .toBe(true);
    }
  }
});

test('search ranks direct examination pages first and restores input focus after reset', async ({
  page,
}) => {
  await page.goto(url('/search/'));
  for (const [query, path] of [
    ['심장초음파', '/services/heart/echocardiography/'],
    ['대장내시경', '/services/endoscopy/colonoscopy/'],
    ['진료시간', '/visit/'],
  ]) {
    await page.locator('input').fill(query);
    await expect(page.locator('.result-card').first()).toHaveAttribute(
      'href',
      manifest.basePath + path,
    );
  }
  for (const route of ['/search/', '/cases/']) {
    await page.goto(url(route));
    await page.locator('input').fill('없는검색어xxxx');
    const reset = page.getByRole('button', { name: '전체 목록 보기' });
    await reset.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('input')).toBeFocused();
    await page.keyboard.type('심장');
    await expect(page.locator('input')).toHaveValue('심장');
    await expect(page.locator('.result-card').first()).toBeVisible();
  }
});

test('printing includes closed answers and restores the original disclosure states', async ({
  page,
  browser,
}) => {
  await page.goto(url('/health/colonoscopy-preparation-questions/'));
  const details = page.locator('.qa-list details');
  const original = await details.evaluateAll((els) =>
    els.map((el) => (el as HTMLDetailsElement).open),
  );
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  expect(
    await details.evaluateAll((els) => els.every((el) => (el as HTMLDetailsElement).open)),
  ).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  expect(
    await details.evaluateAll((els) => els.map((el) => (el as HTMLDetailsElement).open)),
  ).toEqual(original);
  fs.mkdirSync('reports/ui-fixes', { recursive: true });
  await page.pdf({ path: 'reports/ui-fixes/preparation.pdf', format: 'A4', printBackground: true });
  expect(
    await details.evaluateAll((els) => els.map((el) => (el as HTMLDetailsElement).open)),
  ).toEqual(original);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJs = await context.newPage();
  await noJs.goto(url('/health/colonoscopy-preparation-questions/'));
  await noJs.emulateMedia({ media: 'print' });
  expect(
    await noJs
      .locator('.qa-list details > p')
      .evaluateAll((els) => els.every((el) => el.checkVisibility())),
  ).toBe(true);
  await context.close();
});

test('tablet contact action and current section are available at breakpoint edges', async ({
  page,
}) => {
  for (const width of [600, 601, 850, 851, 1100, 1101]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url('/services/heart/echocardiography/'));
    await expect(
      page.locator(width <= 600 ? '.mobile-contact a' : '.header-phone').first(),
    ).toBeVisible();
    if (width > 1100)
      await expect(page.locator('.desktop-nav a[aria-current="location"]')).toHaveText('검사·시술');
    else {
      await page.locator('.mobile-nav summary').click();
      await expect(page.locator('.mobile-nav a[aria-current="location"]')).toHaveText('검사·시술');
    }
  }
});

test('short desktop sidebar links can be brought into view', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 450 });
  await page.goto(url('/services/heart/echocardiography/'));
  await page.evaluate(() => window.scrollTo(0, 650));
  for (const link of await page.locator('.sidebar-box a').all()) {
    await link.focus();
    await expect
      .poll(() =>
        link.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        }),
      )
      .toBe(true);
  }
});

test('notices lead patients to the original hospital announcement channel', async ({ page }) => {
  await page.goto(url('/notices/'));
  await expect(page.getByRole('link', { name: '병원 공지사항 확인' })).toHaveAttribute(
    'href',
    'https://yttop.co.kr/44',
  );
  await expect(page.locator('main')).not.toContainText('2025년 6월 24일');
  await expect(page.locator('.sidebar-box .article-connections a[href$="/visit/"]')).toHaveCount(1);
});
