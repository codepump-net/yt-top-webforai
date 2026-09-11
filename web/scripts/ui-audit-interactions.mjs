import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { serve } from './serve.mjs';

const output = path.resolve(process.env.UI_AUDIT_OUTPUT ?? '../artifacts/ui-audit-2026-09-11');
await fs.mkdir(path.join(output, 'screenshots'), { recursive: true });
const manifest = JSON.parse(await fs.readFile('reports/build-manifest.json', 'utf8'));
const { server, url } = await serve({ port: 0 });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
const results = { menu: [], keyboard: [], sidebar: [], search: [], qa: [], accessibility: [], captures: [], anchors: [], footer: [] };
const capture = async (name, locator) => {
  const file = `screenshots/${name}.png`;
  if (locator) await locator.screenshot({ path: path.join(output, file) });
  else await page.screenshot({ path: path.join(output, file) });
  results.captures.push(file);
};
const hit = (el) => {
  const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const target = document.elementFromPoint(x, y);
  return { text: el.textContent.trim(), x, y, width: r.width, height: r.height, hit: !!target && (el === target || el.contains(target)), covering: target?.outerHTML.slice(0, 220) };
};
try {
  for (const [width, height] of [[320, 568], [390, 844], [600, 320], [667, 375], [844, 320], [850, 300], [768, 600]]) {
    await page.setViewportSize({ width, height });
    await page.goto(url);
    await page.locator('.mobile-nav summary').click();
    const before = await page.locator('.mobile-nav nav a').evaluateAll((els, source) => els.map((el) => (0, eval)(`(${source})`)(el)), hit.toString());
    await capture(`menu-${width}x${height}`);
    await page.keyboard.press('Escape');
    const openAfterEscape = await page.locator('.mobile-nav').getAttribute('open') !== null;
    if (!openAfterEscape) await page.locator('.mobile-nav summary').click();
    await page.evaluate(() => window.scrollTo(0, 600));
    const afterScroll = await page.locator('.mobile-nav nav a').evaluateAll((els, source) => els.map((el) => (0, eval)(`(${source})`)(el)), hit.toString());
    await page.locator('.mobile-nav nav a').last().focus();
    const lastAfterFocus = await page.locator('.mobile-nav nav a').last().evaluate(hit);
    results.menu.push({ width, height, before, afterScroll, openAfterEscape, lastAfterFocus });
  }
  for (const [route, width, height] of [['/', 390, 844], ['/services/heart/echocardiography/', 390, 844], ['/search/', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto(url + route.slice(1));
    const obscured = [];
    const count = await page.locator('a,button,input,summary').count();
    for (let i = 0; i < Math.min(count + 3, 180); i++) {
      await page.keyboard.press('Tab');
      const item = await page.evaluate((source) => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return (0, eval)(`(${source})`)(el);
      }, hit.toString());
      if (item && !item.hit) {
        obscured.push(item);
        if (obscured.length <= 2) await capture(`keyboard-${route.split('/').filter(Boolean).at(-1) || 'home'}-${obscured.length}`);
      }
    }
    results.keyboard.push({ route, width, height, obscured });
  }
  for (const [width, height] of [[1024, 600], [1280, 720], [1280, 450], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto(url + 'services/heart/echocardiography/');
    await page.evaluate(() => window.scrollTo(0, 650));
    const bounds = await page.locator('.sidebar-box').boundingBox();
    const links = await page.locator('.sidebar-box a').evaluateAll((els, source) => els.map((el) => (0, eval)(`(${source})`)(el)), hit.toString());
    results.sidebar.push({ width, height, bounds, links });
    await capture(`sidebar-${width}x${height}`);
  }
  for (const route of ['/search/', '/cases/']) {
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(url + route.slice(1));
      const input = page.locator('input[type=search]');
      await input.fill('없는검색어'.repeat(24));
      await page.locator('.empty-state').waitFor();
      await page.locator('.empty-state').scrollIntoViewIfNeeded();
      const empty = await page.locator('.empty-state').boundingBox();
      const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      await capture(`search-empty-${route.includes('cases') ? 'cases' : 'site'}-${width}`);
      await page.getByRole('button', { name: '전체 목록 보기' }).click();
      const restored = await input.inputValue() === '' && await page.locator('.result-card').count() > 0;
      const focus = await page.evaluate(() => ({ tag: document.activeElement?.tagName, id: document.activeElement?.id }));
      const total = await page.locator('.result-card').count();
      let filters = [];
      for (const button of await page.locator('.filter-row button').all()) {
        await button.click();
        filters.push({ text: await button.textContent(), pressed: await button.getAttribute('aria-pressed'), count: await page.locator('.result-card').count() });
      }
      results.search.push({ route, width, documentWidth, empty, restored, focusAfterReset: focus, total, filters });
    }
  }
  for (const route of manifest.routes) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url + route.path.slice(1));
    await page.locator('.qa-list details').evaluateAll((els) => els.forEach((el) => el.open = true));
    const qa = await page.locator('.qa-list').evaluateAll((els) => els.map((el) => ({ width: el.getBoundingClientRect().width, answers: [...el.querySelectorAll('details > p')].map((p) => ({ text: p.textContent.slice(0, 70), height: p.getBoundingClientRect().height })), symbols: [...el.querySelectorAll('summary')].map((s) => getComputedStyle(s, '::after').content) })));
    results.qa.push({ route: route.path, documentWidth: await page.evaluate(() => document.documentElement.scrollWidth), qa });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const footer = await page.locator('.footer-bottom > a').evaluate(hit);
    results.footer.push({ route: route.path, footer });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    results.accessibility.push({ route: route.path, violations: axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })) });
    if (results.qa.length % 19 === 0) console.log(`Interactions: ${results.qa.length}/76 expanded Q&A, footer and mobile axe checks`);
  }
  await fs.writeFile(path.join(output, 'interactions.json'), JSON.stringify(results, null, 2));
  for (const [route, selector, name, width] of [
    ['/', '.quick-strip', 'home-contact-320', 320],
    ['/', '.doctor-grid', 'home-doctors-320', 320],
    ['/doctors/', '.doctor-grid', 'doctors-320', 320],
    ['/doctors/', '.doctor-grid', 'doctors-851', 851],
    ['/visit/', '.location-panel', 'location-320', 320],
    ['/notices/', '.main-article > .card-grid', 'notices-list-390', 390],
    ['/services/heart/echocardiography/', '.qa-list', 'qa-expanded-390', 390],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url + route.slice(1));
    await page.locator('img').evaluateAll((els) => els.forEach((el) => el.loading = 'eager'));
    await page.evaluate(async () => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))));
    if (name.startsWith('qa')) await page.locator('.qa-list details').evaluateAll((els) => els.forEach((el) => el.open = true));
    await capture(name, page.locator(selector));
  }
  await fs.writeFile(path.join(output, 'interactions.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ menus: results.menu.length, keyboardPages: results.keyboard.length, sidebarSizes: results.sidebar.length, searchStates: results.search.length, qaPages: results.qa.length, mobileAxePages: results.accessibility.length, axeViolations: results.accessibility.filter((r) => r.violations.length), footerObscured: results.footer.filter((r) => !r.footer.hit).length }, null, 2));
} finally { await browser.close(); server.close(); }
