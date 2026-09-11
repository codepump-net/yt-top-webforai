import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { load } from 'cheerio';
import { publicTextErrors, nonPublicArtifact } from './public-content-policy.mjs';
const manifest = JSON.parse(await fs.readFile('reports/build-manifest.json', 'utf8'));
const errors = [];
const titles = new Set();
const reports = [];
let publicFilesChecked = 0;
for (const file of await fs.readdir('out', { recursive: true })) {
  if (nonPublicArtifact(file)) errors.push(`${file}: internal artifact in public export`);
  if (!/\.(?:html|txt|xml|json)$/.test(file)) continue;
  publicFilesChecked++;
  const raw = await fs.readFile(path.join('out', file), 'utf8');
  // Includes inline JSON-LD, serialized React payloads and noscript, not only the visible article.
  errors.push(...publicTextErrors(raw, file));
  if (file.endsWith('.html')) {
    const html = load(raw);
    html('script,style').remove();
    errors.push(...publicTextErrors(html.text(), file + ' decoded HTML'));
  }
}
let maxJsGzip = 0;
let maxCssGzip = 0;
function localFile(url, currentPath) {
  const parsed = new URL(url, manifest.origin + manifest.basePath + currentPath);
  if (parsed.origin !== manifest.origin) return null;
  if (
    manifest.basePath &&
    parsed.pathname !== manifest.basePath &&
    !parsed.pathname.startsWith(manifest.basePath + '/')
  )
    throw new Error(`Link escapes project base: ${url}`);
  let relative = decodeURIComponent(parsed.pathname.slice(manifest.basePath.length));
  if (relative === '') relative = '/';
  if (relative.endsWith('/')) relative += 'index.html';
  return { file: path.join('out', relative), hash: parsed.hash.slice(1) };
}
for (const route of manifest.routes) {
  const html = await fs.readFile('out/' + route.file, 'utf8');
  const $ = load(html);
  const title = $('title').text();
  if (!title || titles.has(title)) errors.push(`${route.path}: missing/duplicate title`);
  titles.add(title);
  if ($('html').attr('lang') !== 'ko') errors.push(`${route.path}: lang`);
  if ($('main h1').length !== 1) errors.push(`${route.path}: expected one h1`);
  if (!$('meta[name=description]').attr('content')) errors.push(`${route.path}: description`);
  if ($('link[rel=canonical]').attr('href') !== manifest.origin + manifest.basePath + route.path)
    errors.push(`${route.path}: canonical`);
  const robots = $('meta[name=robots]')
    .map((_, el) => $(el).attr('content'))
    .get()
    .join(',');
  if (
    (!route.indexable && !robots.includes('noindex')) ||
    (route.indexable && robots.includes('noindex'))
  )
    errors.push(`${route.path}: indexing policy`);
  if (route.id !== 'not-found') {
    const json = $('script[type="application/ld+json"]').first().text();
    try {
      const graph = JSON.parse(json)['@graph'];
      if (
        !graph?.some((n) => n['@type'] === 'MedicalClinic') ||
        !graph.some((n) => n['@type'] === 'BreadcrumbList')
      )
        errors.push(`${route.path}: incomplete schema`);
      const clinic = graph?.find((n) => n['@type'] === 'MedicalClinic');
      if (
        clinic?.['@id'] !== 'https://yttop.co.kr/#clinic' ||
        clinic?.url !== 'https://yttop.co.kr/'
      )
        errors.push(`${route.path}: shared hospital identity must retain original site URL`);
    } catch {
      errors.push(`${route.path}: invalid JSON-LD`);
    }
    if (
      $('meta[property="og:url"]').attr('content') !==
      manifest.origin + manifest.basePath + route.path
    )
      errors.push(`${route.path}: OG URL`);
  }
  if (route.id !== 'not-found' && $('main').text().trim().length < 150)
    errors.push(`${route.path}: insufficient static text`);
  for (const el of $('a[href],img[src],script[src],link[rel=stylesheet][href]').toArray()) {
    const url = $(el).attr('href') ?? $(el).attr('src');
    if (!url || /^(tel:|mailto:)/.test(url)) continue;
    try {
      const target = localFile(url, route.path);
      if (!target) continue;
      await fs.access(target.file);
      if (target.hash) {
        const targetHtml =
          target.file === path.join('out', route.file)
            ? $
            : load(await fs.readFile(target.file, 'utf8'));
        if (
          !targetHtml('[id]')
            .toArray()
            .some((e) => targetHtml(e).attr('id') === decodeURIComponent(target.hash))
        )
          errors.push(`${route.path}: missing fragment ${url}`);
      }
    } catch (e) {
      errors.push(`${route.path}: broken local resource ${url}: ${e.message}`);
    }
  }
  for (const el of $('img').toArray())
    if ($(el).attr('alt') === undefined || !$(el).attr('width') || !$(el).attr('height'))
      errors.push(`${route.path}: image accessibility/dimensions`);
  const gzipBytes = async (selector) => {
    let bytes = 0;
    const urls = [
      ...new Set(
        $(selector)
          .map((_, el) => $(el).attr('src') ?? $(el).attr('href'))
          .get(),
      ),
    ];
    for (const url of urls) {
      const target = localFile(url, route.path);
      if (target) bytes += gzipSync(await fs.readFile(target.file)).length;
    }
    return bytes;
  };
  const jsGzip = await gzipBytes('script[src]');
  const cssGzip = await gzipBytes('link[rel=stylesheet]');
  maxJsGzip = Math.max(maxJsGzip, jsGzip);
  maxCssGzip = Math.max(maxCssGzip, cssGzip);
  if (jsGzip > 250_000 || cssGzip > 80_000)
    errors.push(`${route.path}: payload budget JS=${jsGzip} CSS=${cssGzip}`);
  reports.push({
    path: route.path,
    htmlBytes: Buffer.byteLength(html),
    jsGzip,
    cssGzip,
    staticTextLength: $('main').text().length,
  });
}
const sitemap = await fs.readFile('out/sitemap.xml', 'utf8');
if (manifest.mode === 'review' && sitemap.includes('<loc>'))
  errors.push('Review sitemap must not advertise indexable URLs');
if (
  manifest.mode === 'production' &&
  (sitemap.match(/<loc>/g) ?? []).length !== manifest.routes.filter((r) => r.indexable).length
)
  errors.push('Sitemap count mismatch');
await fs.mkdir('reports', { recursive: true });
await fs.writeFile(
  'reports/static-audit.json',
  JSON.stringify(
    {
      mode: manifest.mode,
      routeCount: reports.length,
      publicFilesChecked,
      maxJsGzip,
      maxCssGzip,
      errors,
      routes: reports,
    },
    null,
    2,
  ),
);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Static audit passed: ${reports.length} routes; links, HTML, metadata, schema, indexing, assets. Max JS ${maxJsGzip} B gzip; CSS ${maxCssGzip} B gzip.`,
);
