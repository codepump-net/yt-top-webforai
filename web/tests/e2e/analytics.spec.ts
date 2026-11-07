import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));

test('operator analytics has no visitor UI or actions, denies storage and excludes search data', async ({
  browser,
}) => {
  test.skip(manifest.mode !== 'production', 'Review builds never install analytics.');
  const context = await browser.newContext();
  const tagRequests: string[] = [];
  await context.route('https://yttop.kr/**', async (route) => {
    const url = new URL(route.request().url());
    const response = await context.request.get('http://127.0.0.1:3000' + url.pathname + url.search);
    await route.fulfill({ response });
  });
  await context.route(
    /https:\/\/(?:www\.)?(?:googletagmanager|google-analytics)\.com\/.*/,
    async (route) => {
      tagRequests.push(route.request().url());
      await route.fulfill({
        contentType: 'application/javascript',
        body: '/* Local validation: do not send analytics. */',
      });
    },
  );
  const page = await context.newPage();
  await page.goto('https://yttop.kr' + manifest.basePath + '/?name=PRIVATE#q=PRIVATE');
  await expect.poll(() => tagRequests.length).toBe(1);
  expect(tagRequests[0]).toBe('https://www.googletagmanager.com/gtm.js?id=GTM-PMTZZ9VT');
  await expect(
    page.locator('.analytics-consent,.analytics-settings,[aria-label="방문 통계 설정"]'),
  ).toHaveCount(0);
  await expect(page.getByRole('button', { name: '통계 수집에 동의', exact: true })).toHaveCount(0);
  const commands = await page.evaluate(() => {
    const target = window as Window & { dataLayer?: ArrayLike<unknown>[] };
    return (target.dataLayer ?? []).map((command) => Array.from(command));
  });
  expect(JSON.stringify(commands)).not.toContain('PRIVATE');
  expect(
    commands.find((command) => command[0] === 'consent' && command[1] === 'default')?.[2],
  ).toEqual({
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  const config = commands.find((command) => command[0] === 'config');
  expect(config?.[1]).toBe('G-FLPH2Y4NPY');
  expect(config?.[2]).toMatchObject({ send_page_view: true });
  expect(
    commands.filter((command) => command[0] === 'event' && command[1] === 'page_view'),
  ).toHaveLength(0);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  const contact = await page.evaluate(() => {
    const link = document.querySelector('a[href^="tel:"]')!;
    link.addEventListener('click', (event) => event.preventDefault(), { once: true });
    link.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const target = window as Window & { dataLayer?: ArrayLike<unknown>[] };
    return Array.from(target.dataLayer!.at(-1)!);
  });
  expect(contact).toEqual(['event', 'contact_click', { contact_method: 'phone' }]);
  await page.goto('https://yttop.kr' + manifest.basePath + '/search/#q=PRIVATE');
  await expect(page.locator('#site-query')).toHaveValue('PRIVATE');
  expect(tagRequests).toHaveLength(1);
  await page.goto('https://yttop.kr' + manifest.basePath + '/visit/?q=PRIVATE');
  expect(tagRequests).toHaveLength(1);
  await context.close();
});
