import fs from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
const manifest = JSON.parse(await fs.readFile('reports/build-manifest.json', 'utf8'));
if (manifest.mode !== 'production')
  throw new Error('Live SEO verification requires a production manifest');
const site = `${manifest.origin}${manifest.basePath}/`;
const profile = path.resolve('.local/live-seo-profile');
await fs.mkdir(profile, { recursive: true });
const chrome = await launch({
  chromePath:
    process.env.CHROME_PATH ??
    (process.platform === 'win32'
      ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
      : chromium.executablePath()),
  userDataDir: profile,
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
});
const reports = [],
  errors = [];
try {
  for (const route of manifest.routes.filter((r) => r.indexable)) {
    const url = site + route.path.slice(1);
    try {
      const { lhr } = await lighthouse(url, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['seo'],
      });
      const score =
        lhr.categories.seo.score == null ? null : Math.round(lhr.categories.seo.score * 100);
      const failed = lhr.categories.seo.auditRefs
        .filter(
          (a) => a.weight > 0 && lhr.audits[a.id].score !== null && lhr.audits[a.id].score < 1,
        )
        .map((a) => ({ id: a.id, title: lhr.audits[a.id].title }));
      const result = {
        path: route.path,
        url,
        score,
        failed,
        fetchedAt: lhr.fetchTime,
        version: lhr.lighthouseVersion,
        finalUrl: lhr.finalDisplayedUrl,
        runtimeError: lhr.runtimeError,
        warnings: lhr.runWarnings,
      };
      reports.push(result);
      if (score !== 100 || lhr.runtimeError || lhr.finalDisplayedUrl !== url)
        errors.push(
          `${route.path}: SEO=${score}, ${JSON.stringify(failed)}, ${lhr.runtimeError?.message ?? ''}`,
        );
      console.log(
        `${reports.length}/${manifest.routes.filter((r) => r.indexable).length} ${route.path}: SEO ${score}`,
      );
    } catch (error) {
      errors.push(`${route.path}: ${error}`);
    }
    await fs.writeFile(
      'reports/live-seo.json',
      JSON.stringify(
        {
          site,
          commit: manifest.commit,
          checkedAt: new Date().toISOString(),
          note: 'One live mobile Lighthouse SEO run for every indexable route. Search rankings, actual indexing and AI citation are not measured.',
          reports,
          errors,
        },
        null,
        2,
      ),
    );
  }
} finally {
  await chrome.kill();
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
