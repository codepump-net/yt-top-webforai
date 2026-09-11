// Read-only browser audit of the existing static export. Run from web/.
// The measurements identify candidates; screenshots and hit testing determine findings.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
import { serve } from './serve.mjs';

const manifest = JSON.parse(await fs.readFile('reports/build-manifest.json', 'utf8'));
const content = JSON.parse(await fs.readFile('../content/pages.json', 'utf8'));
const mode = process.argv[2] ?? 'matrix';
const output = path.resolve(process.env.UI_AUDIT_OUTPUT ?? '../artifacts/ui-audit-2026-09-11');
await fs.mkdir(path.join(output, 'screenshots'), { recursive: true });
const { server, url } = await serve({ port: 0 });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const widths = [320, 360, 390, 414, 600, 601, 768, 850, 851, 1024, 1100, 1101, 1280, 1440, 1920, 2560];
const representativeIds = new Set([
  'home', 'about', 'visit', 'doctors', 'doctor-park-jongseol', 'doctor-park-rayoung',
  'services', 'heart-index', 'echocardiography', 'checkups', 'health',
  'colonoscopy-preparation', 'palpitations-followup', 'cases', 'case-165407798',
  'notices', 'notice-closure-20250624', 'fees', 'privacy', 'content-policy', 'sitemap', 'search', 'not-found',
]);

function measure() {
  const round = (v) => Math.round(v * 10) / 10;
  const rect = (el) => {
    const r = el.getBoundingClientRect();
    return { x: round(r.x), y: round(r.y), width: round(r.width), height: round(r.height), right: round(r.right), bottom: round(r.bottom) };
  };
  const name = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '');
  const visible = (el) => {
    if (el.closest('.sr-only,.skip-link,script,style')) return false;
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0 && el.checkVisibility({ checkVisibilityCSS: true });
  };
  const nodes = [...document.querySelectorAll('body *')].filter(visible);
  const overflow = nodes.filter((el) => !el.closest('svg,.hero-visual')).filter((el) => {
    const r = el.getBoundingClientRect();
    return r.left < -1 || r.right > innerWidth + 1;
  }).map((el) => ({ node: name(el), text: el.textContent.trim().slice(0, 100), ...rect(el) }));
  const clippedText = [];
  for (const el of nodes) {
    if (el.closest('svg') || ['INPUT', 'TEXTAREA'].includes(el.tagName)) continue;
    for (const child of el.childNodes) {
      if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(child);
      const boxes = [...range.getClientRects()].filter((r) => r.width && r.height);
      for (let parent = el; parent && parent !== document.body; parent = parent.parentElement) {
        const s = getComputedStyle(parent), r = parent.getBoundingClientRect();
        const clipsX = ['hidden', 'clip'].includes(s.overflowX), clipsY = ['hidden', 'clip'].includes(s.overflowY);
        if (boxes.some((b) => (clipsX && (b.left < r.left - 2 || b.right > r.right + 2)) || (clipsY && (b.top < r.top - 2 || b.bottom > r.bottom + 2)))) {
          clippedText.push({ node: name(el), text: child.textContent.trim().slice(0, 120), clipper: name(parent), element: rect(el), bounds: rect(parent) });
          break;
        }
      }
    }
  }
  const overlaps = [];
  for (const el of nodes) {
    const s = getComputedStyle(el);
    if (!['flex', 'inline-flex', 'grid', 'inline-grid'].includes(s.display)) continue;
    if (el.matches('.hero-visual,.doctor-image,.hero-layout')) continue;
    const children = [...el.children].filter(visible).filter((c) => !['absolute', 'fixed'].includes(getComputedStyle(c).position));
    for (let i = 0; i < children.length; i++) for (let j = i + 1; j < children.length; j++) {
      const a = children[i].getBoundingClientRect(), b = children[j].getBoundingClientRect();
      const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (w > 2 && h > 2) overlaps.push({ parent: name(el), a: name(children[i]), b: name(children[j]), width: round(w), height: round(h) });
    }
  }
  const smallTargets = nodes.filter((el) => el.matches('a,button,input,summary')).map((el) => ({ node: name(el), text: (el.getAttribute('aria-label') || el.textContent).trim().slice(0, 70), ...rect(el) })).filter((r) => r.width < 44 || r.height < 44);
  const sidebar = document.querySelector('.sidebar-box');
  const captions = [...document.querySelectorAll('.doctor-caption')].map((el) => ({ bounds: rect(el), card: rect(el.closest('.doctor-card')), heading: rect(el.querySelector('h3')), text: el.querySelector('h3').textContent }));
  return {
    viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
    documentWidth: document.documentElement.scrollWidth, documentHeight: document.documentElement.scrollHeight,
    overflow, clippedText, overlaps, smallTargets, captions,
    sidebar: sidebar && visible(sidebar) ? { ...rect(sidebar), stickyTop: getComputedStyle(sidebar).top } : null,
    missingAnchors: [...document.querySelectorAll('a[href^="#"]')].filter((a) => !document.getElementById(a.hash.slice(1))).map((a) => a.hash),
    brokenImages: [...document.images].filter((img) => img.complete && !img.naturalWidth).map((img) => img.src),
    headings: [...document.querySelectorAll('h1,h2,h3')].filter(visible).map((el) => ({ tag: el.tagName, text: el.textContent, font: getComputedStyle(el).fontSize, ...rect(el) })),
  };
}

const results = [];
const jobs = [];
if (mode === 'matrix') {
  for (const route of manifest.routes) for (const width of widths) jobs.push({ route, width, height: 900, state: 'default' });
} else if (mode === 'stress') {
  for (const route of manifest.routes) {
    for (const width of [320, 390, 768, 1280]) jobs.push({ route, width, height: 900, state: 'text-spacing' });
    for (const width of [390, 1280]) jobs.push({ route, width, height: 900, state: 'text-200' });
  }
} else throw new Error('Use matrix or stress');

let completed = 0;
try {
  await Promise.all(Array.from({ length: 3 }, async () => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    let job;
    while ((job = jobs.shift())) {
      const { route, width, height, state } = job;
      await page.setViewportSize({ width, height });
      const errors = [];
      const recordError = (error) => errors.push(error.message);
      page.on('pageerror', recordError);
      const response = await page.goto(url + route.path.slice(1), { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        document.querySelectorAll('img').forEach((img) => img.loading = 'eager');
        await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
        await document.fonts.ready;
      });
      if (state === 'text-spacing') await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' });
      if (state === 'text-200') await page.evaluate(() => {
        const sizes = [...document.querySelectorAll('body,body *')].map((el) => [el, parseFloat(getComputedStyle(el).fontSize)]);
        for (const [el, size] of sizes) el.style.setProperty('font-size', size * 2 + 'px', 'important');
      });
      const row = { id: route.id, route: route.path, template: content.find((p) => p.id === route.id)?.template, state, status: response.status(), errors, ...await page.evaluate(measure) };
      if (representativeIds.has(route.id) && ((state === 'default' && [320, 768, 1440].includes(width)) || (state !== 'default' && ['home', 'visit', 'doctors', 'search'].includes(route.id) && width === 390))) {
        row.screenshot = `screenshots/${route.id}-${width}-${state}.png`;
        await page.screenshot({ path: path.join(output, row.screenshot), fullPage: true });
      }
      results.push(row);
      page.off('pageerror', recordError);
      completed++;
      if (completed % 76 === 0) {
        await fs.writeFile(path.join(output, `${mode}-partial.json`), JSON.stringify(results));
        console.log(`${mode}: ${completed} completed`);
      }
    }
    await context.close();
  }));
  results.sort((a, b) => a.route.localeCompare(b.route) || a.viewport.width - b.viewport.width || a.state.localeCompare(b.state));
  const sourceHashes = {};
  for (const file of ['src/app/globals.css', 'src/components/chrome.tsx', 'src/components/content.tsx', 'src/components/search.tsx']) sourceHashes[file] = createHash('sha256').update(await fs.readFile(file)).digest('hex');
  const summary = {
    generatedAt: new Date().toISOString(), browser: browser.version(), build: { commit: manifest.commit, builtAt: manifest.builtAt, mode: manifest.mode, basePath: manifest.basePath }, sourceHashes,
    checks: results.length, routes: new Set(results.map((r) => r.route)).size,
    documentOverflowChecks: results.filter((r) => r.documentWidth > r.viewport.width + 1).length,
    textClipChecks: results.filter((r) => r.clippedText.length).length,
    overlapChecks: results.filter((r) => r.overlaps.length).length,
    errors: results.filter((r) => r.errors.length || r.brokenImages.length).length,
  };
  await fs.writeFile(path.join(output, `${mode}.json`), JSON.stringify({ summary, results }, null, 2));
  await fs.writeFile(path.join(output, `${mode}.csv`), '\uFEFFid,route,template,state,width,height,documentWidth,clipCandidates,overlapCandidates,smallTargetCount\n' + results.map((r) => [r.id, r.route, r.template, r.state, r.viewport.width, r.viewport.height, r.documentWidth, r.clippedText.length, r.overlaps.length, r.smallTargets.length].join(',')).join('\n'));
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
  server.close();
}
