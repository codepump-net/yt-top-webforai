import fs from 'node:fs/promises';
import { load } from 'cheerio';
import { sha256 } from './content-contract.mjs';
const base = process.env.DEPLOY_URL ?? 'https://codepump-net.github.io/yt-top-webforai/';
const site = base.endsWith('/') ? base : base + '/';
const expectedSha = process.env.EXPECTED_SHA ?? process.env.GITHUB_SHA;
// The expected manifest comes from this run's CI evidence artifact, outside the deployed web root.
const manifest = JSON.parse(await fs.readFile('reports/build-manifest.json', 'utf8'));
if (expectedSha && manifest.commit !== expectedSha)
  throw new Error(`Deployed commit mismatch: wanted ${expectedSha}, got ${manifest.commit}`);
const failures = [];
if (new URL(site).href !== new URL(manifest.basePath + '/', manifest.origin).href)
  throw new Error('Deployment URL differs from the verified build origin/base path');
const results = [];
for (let start = 0; start < manifest.routes.length; start += 4) {
  const batch = manifest.routes.slice(start, start + 4);
  const checked = await Promise.allSettled(
    batch.map(async (route) => {
      const url = site + route.path.slice(1);
      const result = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!result.ok) throw new Error(`${route.path}: HTTP ${result.status}`);
      const html = await result.text();
      const $ = load(html);
      if ($('main h1').length !== 1) throw new Error(`${route.path}: missing page heading`);
      if (
        $('link[rel=canonical]').attr('href') !==
        manifest.origin + manifest.basePath + route.path
      )
        throw new Error(`${route.path}: canonical mismatch`);
      if (sha256(html) !== route.sha256)
        throw new Error(`${route.path}: deployed HTML differs from manifest`);
      if (!route.indexable && !$('meta[name=robots]').attr('content')?.includes('noindex'))
        throw new Error(`${route.path}: noindex missing`);
      return { path: route.path, status: result.status };
    }),
  );
  for (const r of checked)
    r.status === 'fulfilled' ? results.push(r.value) : failures.push(String(r.reason));
}
const missing = await fetch(site + 'verification-nonexistent-path/', {
  signal: AbortSignal.timeout(30_000),
});
if (missing.status !== 404)
  failures.push(`Unknown route must return HTTP 404, got ${missing.status}`);
await fs.mkdir('reports', { recursive: true });
await fs.writeFile(
  'reports/live-verification.json',
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      site,
      commit: manifest.commit,
      mode: manifest.mode,
      results,
      failures,
    },
    null,
    2,
  ),
);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  `Live verification passed: ${results.length} pages, real 404, commit ${manifest.commit}.`,
);
