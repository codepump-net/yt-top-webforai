// Optional visual smoke check. Set PLAYWRIGHT_MODULE to an installed Playwright module.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(process.argv[2] || 'harness/runs/preview-v1');
const output = path.resolve(process.argv[3] || 'harness/runs');
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const target = path.resolve(root, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
  if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(target, (err, bytes) => {
    if (err) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', target.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8');
    res.end(bytes);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    fs.mkdirSync(output, { recursive: true });
    const base = `http://127.0.0.1:${server.address().port}`;
    const checks = [];
    for (const width of [1280, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      for (const route of ['/', '/visit/', '/doctors/sample-doctor/', '/health/visit-guide/', '/health/evidence-example/']) {
        const response = await page.goto(base + route);
        assert.equal(response.status(), 200);
        const details = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          h1: [...document.querySelectorAll('h1')].filter(e => e.getBoundingClientRect().height > 0).length,
          robots: document.querySelector('meta[name=robots]').content,
          graph: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'],
          text: document.body.innerText
        }));
        assert.equal(details.overflow, false);
        assert.equal(details.h1, 1);
        assert.match(details.robots, /noindex/);
        assert.equal(details.text.includes('{{hospital.'), false);
        const clinic = details.graph.find(n => n['@type'] === 'MedicalClinic');
        assert(details.text.includes(clinic.address.streetAddress));
        assert.equal(clinic['@id'], 'https://hospital.example.invalid/#clinic');
        checks.push({ width, route, status: 200, overflow: false, visible_h1: 1, preview_noindex: true, shared_clinic: true });
        if (route === '/') await page.screenshot({ path: path.join(output, `preview-${width === 390 ? 'mobile' : 'desktop'}.png`), fullPage: true });
      }
      assert.deepEqual(errors, []);
      await page.goto(base);
      await page.locator('a[href="/doctors/sample-doctor/"]').click();
      assert.equal(new URL(page.url()).pathname, '/doctors/sample-doctor/');
      await page.close();
    }
    fs.writeFileSync(path.join(output, 'browser-check.json'), JSON.stringify({ scope: 'synthetic-local-preview', checks, navigation: 'passed', page_errors: [] }, null, 2));
    console.log(JSON.stringify({ checks: checks.length, navigation: 'passed', directory: output }));
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(err => { console.error(err); process.exitCode = 1; });
