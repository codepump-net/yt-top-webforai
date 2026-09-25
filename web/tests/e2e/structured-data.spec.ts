import { test, expect } from '@playwright/test';
import { load } from 'cheerio';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
test('every FAQ answer and collection URL in JSON-LD is available in patient HTML', async ({
  request,
}) => {
  const navigation = new Map<string, string[]>();
  for (const route of manifest.routes.filter((r: { id: string }) => r.id !== 'not-found')) {
    const response = await request.get(`http://127.0.0.1:3000${manifest.basePath}${route.path}`);
    const $ = load(await response.text());
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
    (r: { id: string }) => !['search', 'sitemap', 'not-found', 'privacy'].includes(r.id),
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
