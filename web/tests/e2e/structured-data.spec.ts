import { test, expect } from '@playwright/test';
import { load } from 'cheerio';
import fs from 'node:fs';
import pages from '../../../content/pages.json';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
test('discovery files expose exactly the intended publication scope', async ({ request }) => {
  if (process.env.BUILD_MODE) expect(manifest.mode).toBe(process.env.BUILD_MODE);
  const site = manifest.origin + manifest.basePath;
  const sitemapResponse = await request.get(`${manifest.basePath}/sitemap.xml`);
  expect(sitemapResponse.status()).toBe(200);
  const xml = load(await sitemapResponse.text(), { xmlMode: true });
  const expectedPaths =
    manifest.mode === 'production' ? pages.filter((page) => page.indexable).map((p) => p.path) : [];
  const urls = xml('url > loc')
    .map((_, el) => xml(el).text())
    .get();
  expect(urls.sort()).toEqual(expectedPaths.map((path) => site + path).sort());
  expect(new Set(urls).size).toBe(urls.length);
  const robotsResponse = await request.get(`${manifest.basePath}/robots.txt`);
  expect(robotsResponse.status()).toBe(200);
  expect(await robotsResponse.text()).toBe(
    `User-agent: *\nAllow: /\n` +
      (manifest.mode === 'production' ? `Sitemap: ${site}/sitemap.xml\n` : ''),
  );
});
test('every FAQ answer and collection URL in JSON-LD is available in patient HTML', async ({
  request,
}) => {
  const navigation = new Map<string, string[]>();
  for (const route of manifest.routes.filter((r: { id: string }) => r.id !== 'not-found')) {
    const response = await request.get(`http://127.0.0.1:3000${manifest.basePath}${route.path}`);
    const $ = load(await response.text());
    const contents = $('.article-toc');
    expect(contents.length, route.path).toBeLessThanOrEqual(1);
    if (contents.length) {
      const anchors = contents.find('nav a');
      expect(anchors.length, route.path).toBeGreaterThan(0);
      expect(anchors.length, route.path).toBeLessThanOrEqual(8);
      for (const anchor of anchors.toArray()) {
        const target = $(anchor).attr('href')!;
        expect($(target).length, `${route.path}: ${target}`).toBe(1);
        expect([
          '#questions',
          '#sources',
          '#related-diseases',
          '#article-guidance-title',
          '#visit',
        ]).not.toContain(target);
      }
    }
    const graph = JSON.parse($('script[type="application/ld+json"]').first().text())['@graph'];
    for (const faq of graph.filter((n: { '@type': string }) => n['@type'] === 'FAQPage')) {
      for (const q of faq.mainEntity) {
        const id = new URL(q.url).hash.slice(1);
        const answer = $(`[id="${id}"]`);
        expect(answer.length, `${route.path}#${id}`).toBe(1);
        expect(normalize(answer.find('summary').text())).toBe(normalize('Q.' + q.name));
        expect(normalize(answer.find('p').first().text())).toBe(normalize(q.acceptedAnswer.text));
      }
    }
    const links = new Set(
      $('main a[href]')
        .map(
          (_, el) =>
            new URL($(el).attr('href')!, manifest.origin + manifest.basePath + route.path).href,
        )
        .get(),
    );
    navigation.set(
      manifest.origin + manifest.basePath + route.path,
      [...links].map((href) => {
        const parsed = new URL(href);
        parsed.hash = '';
        parsed.search = '';
        return parsed.href;
      }),
    );
    for (const list of graph.filter((n: { '@type': string }) => n['@type'] === 'ItemList'))
      for (const entry of list.itemListElement)
        expect(links.has(entry.item.url), `${route.path}: ${entry.item.url}`).toBe(true);
    const robots = $('meta[name="robots"]').attr('content') ?? '';
    if (route.indexable) expect(robots, route.path).not.toContain('noindex');
    expect(JSON.stringify(graph)).not.toMatch(
      /user-confirmed-publication|medicalReviewCompleted|publicationAuthorized/,
    );
  }
  // A patient guide must remain reachable through page links, even without search or a sitemap.
  const reached = new Set<string>();
  const queue = [manifest.origin + manifest.basePath + '/'];
  while (queue.length) {
    const current = queue.shift()!;
    if (reached.has(current) || /\/(search|sitemap)\/$/.test(current)) continue;
    reached.add(current);
    queue.push(...(navigation.get(current) ?? []));
  }
  for (const route of manifest.routes.filter(
    (r: { id: string }) => !['search', 'sitemap', 'not-found', 'privacy', 'cases'].includes(r.id),
  )) {
    expect(
      reached.has(manifest.origin + manifest.basePath + route.path),
      `Guide unreachable without search: ${route.path}`,
    ).toBe(true);
  }
});
test('SearchAction URL opens the requested search and remains editable', async ({ page }) => {
  await page.goto(
    `http://127.0.0.1:3000${manifest.basePath}/search/?q=${encodeURIComponent('심장초음파')}`,
  );
  await expect(page.locator('#site-query')).toHaveValue('심장초음파');
  await expect(page.locator('.result-card').first()).toContainText('심장초음파');
  await page.locator('#site-query').fill('기숙사');
  await expect(page.locator('.result-card').first()).toContainText('기숙사');
});
