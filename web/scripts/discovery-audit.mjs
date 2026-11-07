import fs from 'node:fs/promises';
import { load } from 'cheerio';
import pages from '../../content/pages.json' with { type: 'json' };
import { homeGuideGroups } from '../src/lib/information-architecture.mjs';

// Inspect the exported HTML. Search, sitemaps, menus and footer links do not
// substitute for links between patient guides in this report.
const manifest = JSON.parse(await fs.readFile('reports/build-manifest.json', 'utf8'));
const excluded = new Set(['search', 'sitemap', 'cases', 'not-found']);
const utility = new Set(['privacy', 'copyright-policy']);
const targets = pages.filter((page) => page.indexable && !excluded.has(page.id));
const byPath = new Map(targets.map((page) => [page.path, page]));
const graph = new Map();
for (const page of targets) {
  const route = manifest.routes.find((route) => route.id === page.id);
  const $ = load(await fs.readFile('out/' + route.file, 'utf8'));
  $('main .breadcrumbs').remove();
  const links = new Set();
  for (const element of $('main a[href]').toArray()) {
    const url = new URL($(element).attr('href'), manifest.origin + manifest.basePath + page.path);
    if (url.origin !== manifest.origin) continue;
    if (manifest.basePath && !url.pathname.startsWith(manifest.basePath + '/')) continue;
    const path = url.pathname.slice(manifest.basePath.length);
    if (path !== page.path && byPath.has(path)) links.add(path);
  }
  graph.set(page.path, links);
}
const depth = new Map([['/', 0]]);
const queue = ['/'];
while (queue.length) {
  const current = queue.shift();
  for (const target of graph.get(current) ?? []) {
    if (depth.has(target)) continue;
    depth.set(target, depth.get(current) + 1);
    queue.push(target);
  }
}
const patientPages = targets.filter((page) => !utility.has(page.id));
const unreachable = patientPages.filter((page) => !depth.has(page.path)).map((page) => page.path);
const coreGuides = homeGuideGroups
  .flatMap((group) => group.links)
  .map(({ id, label }) => {
    const page = pages.find((page) => page.id === id);
    return { id, path: page.path, label, depth: depth.get(page.path) ?? null };
  });
const errors = [
  ...unreachable.map((path) => `Patient guide unreachable without search or sitemap: ${path}`),
  ...coreGuides
    .filter((page) => page.depth !== 1)
    .map((page) => `Core guide needs a direct home link: ${page.path}`),
];
const report = {
  checkedAt: new Date().toISOString(),
  mode: manifest.mode,
  origin: manifest.origin,
  basePath: manifest.basePath,
  scope:
    'Static main-content links, excluding breadcrumbs, search and sitemaps; not Google crawl or indexing data.',
  patientPages: patientPages.length,
  unreachable,
  maxClickDepth: Math.max(...patientPages.map((page) => depth.get(page.path) ?? Infinity)),
  coreGuides,
  pages: targets.map((page) => ({
    id: page.id,
    path: page.path,
    depth: depth.get(page.path) ?? null,
    incomingContentLinks: [...graph.values()].filter((links) => links.has(page.path)).length,
  })),
  errors,
};
await fs.mkdir('reports', { recursive: true });
await fs.writeFile('reports/discovery-audit.json', JSON.stringify(report, null, 2) + '\n');
if (errors.length && !process.argv.includes('--report-only')) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  JSON.stringify({
    patientPages: report.patientPages,
    maxClickDepth: report.maxClickDepth,
    coreGuides,
    errors,
  }),
);
