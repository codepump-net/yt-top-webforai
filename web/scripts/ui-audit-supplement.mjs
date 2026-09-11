import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { serve } from './serve.mjs';

const output = path.resolve(process.env.UI_AUDIT_OUTPUT ?? '../artifacts/ui-audit-2026-09-11');
const { server, url } = await serve({ port: 0 });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const results = { search: [], typography: [], contact: [], print: [], scale: [], menu: [], headers: [], noticeCards: [], anchors: [] };
const shot = (name, fullPage = false) => page.screenshot({ path: path.join(output, 'screenshots', name + '.png'), fullPage });
try {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url + 'search/');
  for (const [query, expected] of [['심장초음파', '/services/heart/echocardiography/'], ['대장내시경', '/services/endoscopy/colonoscopy/'], ['진료시간', '/visit/']]) {
    await page.locator('input').fill(query);
    const links = await page.locator('.result-card').evaluateAll((els) => els.map((el) => ({ title: el.querySelector('h2').textContent, href: el.getAttribute('href') })));
    results.search.push({ query, expected, count: links.length, rank: links.findIndex((l) => l.href.endsWith(expected)) + 1, firstTen: links.slice(0, 10) });
    await page.locator('.result-count').scrollIntoViewIfNeeded();
    await shot(`search-ranked-${results.search.length}`);
  }
  for (const width of [320, 390, 600, 601, 768, 850, 851, 1100, 1101, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url + 'services/heart/echocardiography/');
    results.contact.push({ width, items: await page.locator('a[href^="tel:"]').evaluateAll((els) => els.map((el) => ({ text: el.textContent.trim(), visible: el.checkVisibility(), y: el.getBoundingClientRect().y, height: el.getBoundingClientRect().height, location: el.closest('header') ? 'header' : el.closest('footer') ? 'footer' : el.closest('.mobile-contact') ? 'mobile-contact' : 'sidebar' }))) });
    if (width === 768) await shot('tablet-detail-768');
    if ([390, 1440].includes(width)) results.typography.push({ route: 'echocardiography', width, fonts: await page.locator('.article-section > p,.breadcrumbs,.provenance p,.sidebar-box nav a,.footer-links a').evaluateAll((els) => els.map((el) => ({ tag: el.tagName, class: el.className, text: el.textContent.slice(0, 45), size: getComputedStyle(el).fontSize, width: el.getBoundingClientRect().width }))) });
    if ([851, 1440].includes(width)) {
      for (const link of await page.locator('.sidebar-box nav a').all()) {
        await link.click();
        const hash = await link.getAttribute('href');
        results.anchors.push({ width, hash, bounds: await page.locator(hash).boundingBox(), header: await page.locator('header').boundingBox() });
      }
    }
  }
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await page.evaluate(() => {
      const sizes = [...document.querySelectorAll('body,body *')].map((el) => [el, parseFloat(getComputedStyle(el).fontSize)]);
      for (const [el, size] of sizes) el.style.setProperty('font-size', size * 2 + 'px', 'important');
    });
    await shot(`header-text200-${width}`);
    results.headers.push({ width, elements: await page.locator('.site-header,.header-inner,.brand,.desktop-nav,.desktop-nav a,.header-actions,.review-bar').evaluateAll((els) => els.map((el) => ({ class: el.className, text: el.textContent.trim().slice(0, 60), visible: el.checkVisibility(), x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y, height: el.getBoundingClientRect().height, width: el.getBoundingClientRect().width }))) });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url + 'notices/');
  results.noticeCards = await page.locator('.main-article .topic-card').evaluateAll((els) => els.map((el) => ({ title: el.querySelector('h3').textContent, description: el.querySelector('p').textContent, timeCount: el.querySelectorAll('time').length, text: el.textContent })));
  await page.locator('.main-article .topic-card').last().scrollIntoViewIfNeeded();
  await shot('notice-closure-card');
  await page.goto(url + 'health/colonoscopy-preparation-questions/');
  await page.emulateMedia({ media: 'print' });
  results.print = await page.locator('.qa-list details').evaluateAll((els) => els.map((el) => ({ question: el.querySelector('summary').textContent, open: el.open, answerHeight: el.querySelector('p').getBoundingClientRect().height, visible: el.querySelector('p').checkVisibility({ contentVisibilityAuto: true }) })));
  await page.pdf({ path: path.join(output, 'preparation-print.pdf'), format: 'A4', printBackground: true });
  await page.emulateMedia({ media: 'screen' });
  for (const [width, height] of [[320, 225], [640, 450], [600, 280], [844, 256]]) {
    await page.setViewportSize({ width, height });
    await page.goto(url);
    await page.locator('.mobile-nav summary').click();
    await page.evaluate(() => window.scrollTo(0, 500));
    const links = await page.locator('.mobile-nav nav a').evaluateAll((els) => els.map((el) => {
      const r = el.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2;
      return { text: el.textContent, y: r.y, bottom: r.bottom, reachable: el.contains(document.elementFromPoint(x, y)) };
    }));
    await shot(`menu-zoom-equivalent-${width}x${height}`);
    const afterFocus = [];
    for (const link of await page.locator('.mobile-nav nav a').all()) {
      await link.focus();
      afterFocus.push(await link.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { text: el.textContent, reachable: el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)) };
      }));
    }
    results.menu.push({ width, height, links, afterFocus });
    await shot(`menu-scrolled-${width}x${height}`);
  }
  for (const width of [390, 1440]) for (const dpr of [1, 1.25, 1.5, 2, 3]) {
    const ctx = await browser.newContext({ deviceScaleFactor: dpr, viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    for (const route of ['/', '/visit/', '/doctors/', '/search/', '/services/heart/echocardiography/']) {
      await p.goto(url + route.slice(1));
      results.scale.push({ width, dpr, route, documentWidth: await p.evaluate(() => document.documentElement.scrollWidth) });
    }
    await ctx.close();
  }
  await fs.writeFile(path.join(output, 'supplement.json'), JSON.stringify(results, null, 2));
  // Contact sheets make the captured page families easy to review. Originals remain available.
  const files = (await fs.readdir(path.join(output, 'screenshots'))).filter((f) => /-(320|768|1440)-default\.png$/.test(f));
  for (const width of [320, 768, 1440]) {
    const subset = files.filter((f) => f.endsWith(`-${width}-default.png`));
    const tileW = 360, tileH = 600;
    for (let start = 0; start < subset.length; start += 8) {
      const chunk = subset.slice(start, start + 8), tiles = [];
      for (let i = 0; i < chunk.length; i++) {
        const file = chunk[i], src = path.join(output, 'screenshots', file);
        const meta = await sharp(src).metadata();
        const img = await sharp(src).extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, Math.round((tileH - 32) * meta.width / tileW)) }).resize({ width: tileW }).toBuffer();
        tiles.push({ input: img, left: (i % 4) * tileW, top: Math.floor(i / 4) * tileH + 32 });
        tiles.push({ input: Buffer.from(`<svg width="360" height="32"><rect width="360" height="32" fill="#183b37"/><text x="10" y="21" fill="white" font-size="13">${file}</text></svg>`), left: (i % 4) * tileW, top: Math.floor(i / 4) * tileH });
      }
      await sharp({ create: { width: tileW * 4, height: tileH * Math.ceil(chunk.length / 4), channels: 3, background: '#eeeeee' } }).composite(tiles).png().toFile(path.join(output, `sheet-${width}-${Math.floor(start / 8) + 1}.png`));
    }
  }
  console.log(JSON.stringify({ search: results.search, print: results.print, scaleChecks: results.scale.length, densityOverflow: results.scale.filter((r) => r.documentWidth > r.width).length, menuProblemsAfterFocus: results.menu.map((r) => ({ width: r.width, height: r.height, hidden: r.afterFocus.filter((l) => !l.reachable).map((l) => l.text) })) }, null, 2));
} finally { await browser.close(); server.close(); }
