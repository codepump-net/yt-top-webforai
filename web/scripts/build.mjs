import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { loadContent } from './data.mjs';
import { sha256 } from './content-contract.mjs';
import { absoluteUrl, normalizeBase } from '../src/lib/urls.mjs';
const mode = process.argv[2] ?? 'review';
if (!['review', 'production'].includes(mode)) throw new Error('Unknown build mode');
const origin = process.env.SITE_ORIGIN ?? 'http://localhost:3000';
const basePath = normalizeBase(process.env.SITE_BASE_PATH ?? '');
absoluteUrl('/', origin, basePath);
if (mode === 'production' && !origin.startsWith('https://'))
  throw new Error('Production requires HTTPS');
const env = {
  ...process.env,
  SITE_MODE: mode,
  SITE_ORIGIN: origin,
  SITE_BASE_PATH: basePath,
  NEXT_TELEMETRY_DISABLED: '1',
};
function run(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], { stdio: 'inherit', env });
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
run('scripts/validate.mjs', [mode]);
// Only clear this project's generated export. Retired routes must not survive a rebuild.
const exportDir = fileURLToPath(new URL('../out', import.meta.url));
if (path.resolve('out') !== exportDir) throw new Error('Build must run from the web directory');
await fs.rm(exportDir, { recursive: true, force: true });
await fs.mkdir('reports', { recursive: true });
run('node_modules/next/dist/bin/next', ['build']);
const data = await loadContent();
const absolute = (path) => absoluteUrl(path, origin, basePath);
const xml = (list) =>
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  list
    .map((p) => `  <url><loc>${absolute(p.path)}</loc><lastmod>${p.updatedAt}</lastmod></url>`)
    .join('\n') +
  '\n</urlset>\n';
await fs.writeFile(
  'out/sitemap.xml',
  xml(mode === 'production' ? data.pages.filter((p) => p.indexable) : []),
);
if (mode === 'review')
  await fs.writeFile('reports/planned-sitemap.xml', xml(data.pages.filter((p) => p.indexable)));
await fs.writeFile(
  'out/robots.txt',
  `User-agent: *\nAllow: /\n${mode === 'production' ? `Sitemap: ${absolute('/sitemap.xml')}\n` : ''}`,
);
await fs.writeFile('out/.nojekyll', '');
// Optional discovery aid, not a search or AI ranking signal. Never advertise review content.
if (mode === 'production')
  await fs.writeFile(
    'out/llms.txt',
    `# ${data.clinic.name}\n\n> ${data.pages[0].description}\n\n` +
      data.pages
        .filter((p) => p.indexable && p.template !== 'case-detail')
        .map((p) => `- [${p.title}](${absolute(p.path)}): ${p.description}`)
        .join('\n') +
      '\n',
  );
let notFound = await fs.readFile('out/404.html', 'utf8');
notFound = notFound
  .replace(/<title>.*?<\/title>/s, '')
  .replace(/<meta name="description"[^>]*>/g, '')
  .replace(/<link rel="canonical"[^>]*>/g, '')
  .replace(/<meta name="robots"[^>]*>/g, '');
const errorPage = data.pages.find((p) => p.id === 'not-found');
notFound = notFound.replace(
  '</head>',
  `<title>${errorPage.metaTitle}</title><meta name="description" content="${errorPage.description}"/><meta name="robots" content="noindex, follow"/><link rel="canonical" href="${absolute('/404.html')}"/></head>`,
);
await fs.writeFile('out/404.html', notFound);
const sha =
  process.env.GITHUB_SHA ??
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
const routes = [];
for (const page of data.pages) {
  const file =
    page.id === 'not-found'
      ? '404.html'
      : page.path === '/'
        ? 'index.html'
        : page.path.slice(1) + 'index.html';
  const html = await fs.readFile('out/' + file);
  routes.push({
    id: page.id,
    path: page.path,
    file,
    sha256: sha256(html),
    bytes: html.length,
    indexable: mode === 'production' && page.indexable,
  });
}
await fs.writeFile(
  'reports/build-manifest.json',
  JSON.stringify(
    {
      version: 1,
      commit: sha,
      mode,
      origin,
      basePath,
      builtAt: new Date().toISOString(),
      contentDigest: sha256(data),
      routes,
    },
    null,
    2,
  ),
);
run('scripts/audit.mjs');
console.log(`Export complete: ${routes.length} routes, ${mode}, ${absolute('/')}`);
