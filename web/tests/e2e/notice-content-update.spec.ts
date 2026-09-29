import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import notices from '../../../content/notices.json';
import channels from '../../../content/official-channels.json';
import assets from '../../../content/assets.json';
import visuals from '../../../content/visuals.json';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const url = (path: string) => `http://127.0.0.1:3000${manifest.basePath}${path}`;
const labels = [
  '증상백과',
  '질환백과',
  '진료분야',
  '검사·시술',
  '암환자 지지치료',
  '검진·서류',
  '병원안내',
  '공지사항',
];

test('eight menus remain ordered, unique and usable at desktop and mobile widths', async ({
  page,
}) => {
  for (const width of [320, 390, 850, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url('/'));
    if (await page.locator('.desktop-nav').isVisible()) {
      await expect(page.locator('.desktop-nav a')).toHaveText(labels);
    } else {
      await page.locator('.mobile-nav summary').click();
      const links = page.locator('.mobile-nav nav a');
      expect((await links.allTextContents()).slice(0, 8)).toEqual(labels);
      await expect(page.locator('.mobile-nav nav a', { hasText: '공지사항' })).toHaveCount(1);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `${width}px`,
    ).toBe(true);
  }
});

test('notice search, categories, reset and pagination operate on the six real articles', async ({
  page,
}) => {
  await page.goto(url('/notices/'));
  await expect(page.locator('.notice-table tbody tr')).toHaveCount(5);
  await expect(page.locator('.notice-table tbody tr').first()).toContainText(
    '인플루엔자 국가예방접종',
  );
  await page.getByRole('button', { name: '다음', exact: true }).click();
  await expect(page.locator('.notice-table tbody tr')).toHaveCount(1);
  await expect(page.locator('.notice-table')).toContainText('HPV');
  await page.getByLabel('제목·태그 검색', { exact: true }).fill('독감');
  await expect(page.locator('.notice-table tbody tr')).toHaveCount(2);
  await expect(page.locator('.notice-result-count')).toContainText('1 / 1페이지');
  await page.getByLabel('공지 분류', { exact: true }).selectOption('지역 지원사업');
  await expect(page.locator('.notice-table tbody tr')).toHaveCount(1);
  await expect(page.locator('.notice-table')).toContainText('경기도');
  await page.getByLabel('제목·태그 검색', { exact: true }).fill('찾을수없는글');
  await expect(page.locator('.notice-empty')).toBeVisible();
  await page.getByRole('button', { name: '전체 공지 보기', exact: true }).click();
  await expect(page.locator('.notice-table tbody tr')).toHaveCount(5);
});

test('all six individual articles retain their sources, original anchor access and review metadata', async ({
  page,
  request,
}) => {
  await page.goto(url('/notices/'));
  for (const item of notices) {
    await expect(page.locator(`.notice-topics #${item.id}`)).toHaveAttribute(
      'href',
      manifest.basePath + item.path,
    );
    expect((await request.get(url(item.path))).status()).toBe(200);
  }
  for (const item of notices) {
    await page.goto(url(item.path));
    await expect(page.locator('h1')).toHaveText(item.title);
    await expect(page.locator('.notice-metadata')).toContainText('최초 게시2026-09-28');
    if (item.id === 'notice-2026-hpv-national') {
      await expect(page.locator('.notice-metadata')).toContainText('출처 페이지 검토일2026-04-14');
      await expect(page.locator('.notice-metadata')).not.toContainText('공식 자료 발표');
    }
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);
    await expect(page.locator('.notice-metadata [aria-label="집계된 조회수 없음"]')).toHaveText(
      '—',
    );
    for (const source of item.sources)
      await expect(page.locator(`main a[href="${source.url}"]`).first()).toBeAttached();
  }
});

test('flu schedule is an accessible six-row HTML table with the correct target dates', async ({
  page,
}) => {
  await page.goto(url('/notices/2026-2027-influenza/'));
  const table = page.locator('#notice-schedule table');
  await expect(table.locator('thead th')).toHaveText(['지원 대상', '시작일', '종료일', '확인사항']);
  await expect(table.locator('tbody tr')).toHaveCount(6);
  await expect(table.locator('tbody tr').nth(3)).toContainText('2026-10-06');
  await expect(table.locator('tbody tr').last()).toContainText('2027-04-30');
  await expect(page.locator('.notice-metadata')).toContainText('내용 확인2026-09-29');
});

test('three official channels appear at each required location and merge with the clinic identity', async ({
  page,
}) => {
  for (const route of ['/', '/about/', notices[0].path, '/en/checkups/visa/']) {
    await page.goto(url(route));
    const groups = page.locator('.official-channels');
    await expect(groups).toHaveCount(route === '/' || route === '/about/' ? 2 : 1);
    for (const group of await groups.all()) {
      await expect(group.locator('a')).toHaveCount(3);
      for (const channel of channels) {
        const link = group.locator(`a[href="${channel.url}"]`);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer external');
      }
    }
    await expect(page.locator('.site-footer a[href="https://yttop.co.kr/"]')).toHaveCount(1);
    const graph = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').first().textContent())!,
    )['@graph'];
    const clinic = graph.find((entry: { '@type': string }) => entry['@type'] === 'MedicalClinic');
    expect(clinic['@id']).toBe('https://yttop.co.kr/#clinic');
    for (const channel of channels) expect(clinic.sameAs).toContain(channel.url);
    expect(clinic.sameAs).toHaveLength(4);
  }
});

test('all existing patient images can open their source without upscaling the page image', async ({
  page,
}) => {
  const pages = JSON.parse(fs.readFileSync('../content/pages.json', 'utf8'));
  const targets = [
    ...visuals.banners,
    ...visuals.diagrams,
    { pageId: 'vaccinations', assetId: 'vaccination-schedule-2026' },
  ];
  for (const visual of targets) {
    const asset = assets.find((a) => a.id === visual.assetId)!;
    await page.goto(url(pages.find((p: { id: string }) => p.id === visual.pageId).path));
    const img = page.locator(`img[src="${manifest.basePath}${asset.file}"]`).first();
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveJSProperty('naturalWidth', asset.width);
    const dimensions = await img.evaluate((el: HTMLImageElement) => ({
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
    }));
    expect(dimensions.width).toBeLessThanOrEqual(dimensions.naturalWidth + 1);
    expect(
      Math.abs(
        dimensions.width / dimensions.height - dimensions.naturalWidth / dimensions.naturalHeight,
      ),
    ).toBeLessThan(0.01);
    await expect(img.locator('..')).toHaveAttribute('href', manifest.basePath + asset.file);
  }
});

test('notice and channel screens pass mobile and desktop accessibility and overflow checks', async ({
  page,
}) => {
  fs.mkdirSync('reports/content-update', { recursive: true });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [name, route] of [
      ['notices', '/notices/'],
      ['flu', '/notices/2026-2027-influenza/'],
      ['infection', '/notices/2026-09-17-infection-guide/'],
      ['channels', '/about/'],
    ]) {
      await page.goto(url(route));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${route} ${width}px`,
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        audit.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
      await page.screenshot({
        path: `reports/content-update/${name}-${width}.png`,
        fullPage: true,
      });
    }
  }
});
