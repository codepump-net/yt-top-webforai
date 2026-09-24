import fs from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { serve } from './serve.mjs';
const { server, url } = await serve({ port: 0 });
const chromePath =
  process.env.CHROME_PATH ??
  (process.platform === 'win32'
    ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    : chromium.executablePath());
await fs.mkdir('.local/lighthouse-profile', { recursive: true });
const chrome = await launch({
  chromePath,
  userDataDir: path.resolve('.local/lighthouse-profile'),
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
});
const manifest = JSON.parse(await fs.readFile('reports/build-manifest.json', 'utf8'));
const reports = [];
const errors = [];
const requestedRoutes = process.argv.slice(2);
const routes = requestedRoutes.length
  ? requestedRoutes.map((route) => route.replace(/^\//, ''))
  : [
      '',
      'services/heart/echocardiography/',
      'search/',
      'health/colonoscopy-preparation-questions/',
      'health/cancer-treatment-symptoms/',
      'ne/checkups/visa/',
    ];
try {
  await fs.mkdir('reports/lighthouse', { recursive: true });
  for (const route of routes) {
    if (!manifest.routes.some((r) => r.path === '/' + route))
      throw new Error(`Unknown performance route: ${route}`);
    const result = await lighthouse(url + route, {
      port: chrome.port,
      output: ['json', 'html'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    const { lhr } = result;
    const id = route.split('/').filter(Boolean).at(-1) ?? 'home';
    await fs.writeFile(`reports/lighthouse/${id}.json`, result.report[0]);
    await fs.writeFile(`reports/lighthouse/${id}.html`, result.report[1]);
    const scores = Object.fromEntries(
      Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
    );
    const metrics = Object.fromEntries(
      [
        'largest-contentful-paint',
        'cumulative-layout-shift',
        'total-blocking-time',
        'first-contentful-paint',
      ].map((k) => [k, lhr.audits[k].numericValue]),
    );
    const failed = Object.values(lhr.audits)
      .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode === 'binary')
      .map((a) => a.id);
    reports.push({ route: '/' + route, scores, metrics, failedAudits: failed });
    if (scores.performance < 90 || scores.accessibility < 95 || scores['best-practices'] < 95)
      errors.push(`${route || '/'}: score budget ${JSON.stringify(scores)}`);
    const seoFailures = lhr.categories.seo.auditRefs.filter(
      (a) =>
        a.weight > 0 &&
        lhr.audits[a.id].score !== null &&
        lhr.audits[a.id].score < 1 &&
        !(
          !manifest.routes.find((r) => r.path === '/' + route)?.indexable && a.id === 'is-crawlable'
        ),
    );
    if (seoFailures.length)
      errors.push(`${route}: SEO audits: ${seoFailures.map((a) => a.id).join(',')}`);
    if (metrics['largest-contentful-paint'] > 2500 || metrics['cumulative-layout-shift'] > 0.1)
      errors.push(`${route}: LCP/CLS budget`);
    console.log(
      `${route || '/'} ${JSON.stringify(scores)} LCP=${Math.round(metrics['largest-contentful-paint'])}ms CLS=${metrics['cumulative-layout-shift']}`,
    );
  }
} finally {
  await chrome.kill();
  server.close();
}
await fs.writeFile(
  requestedRoutes.length ? 'reports/performance-selected.json' : 'reports/performance.json',
  JSON.stringify(
    {
      mode: manifest.mode,
      note: 'Mobile simulated lab metrics. INP requires real user measurement; review and non-indexable utility routes intentionally fail is-crawlable.',
      errors,
      reports,
    },
    null,
    2,
  ),
);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
