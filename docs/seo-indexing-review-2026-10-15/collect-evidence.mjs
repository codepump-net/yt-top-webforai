// Read-only audit. Run from the repository root after installing web dependencies.
// Writes internal evidence beside this script; never changes website or deployment settings.
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../..');
const require = createRequire(path.join(root, 'web/package.json'));
const { load } = require('cheerio');
const pages = JSON.parse(await fs.readFile(path.join(root, 'content/pages.json'), 'utf8'));
const origin = 'https://yttop.kr';
const checkedAt = new Date().toISOString();
async function inspect(url) {
  const redirects = [];
  try {
    let current = url, response;
    for (let i = 0; i < 8; i++) {
      response = await fetch(current, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
      const location = response.headers.get('location');
      if (response.status >= 300 && response.status < 400 && location) {
        redirects.push({ url: current, status: response.status, location });
        await response.body?.cancel();
        current = new URL(location, current).href;
      } else break;
    }
    const html = await response.text(), $ = load(html);
    const schema = [], schemaErrors = [];
    $('script[type="application/ld+json"]').each((i, el) => {
      try { const item = JSON.parse($(el).text()); schema.push(...(item['@graph'] ?? [item])); }
      catch (error) { schemaErrors.push(error.message); }
    });
    const links = $('a[href]').map((i, el) => {
      try { return new URL($(el).attr('href'), current).href; } catch { return null; }
    }).get();
    const main = $('main').clone(); main.find('script,style').remove();
    return {
      requested: url, finalUrl: current, status: response.status, redirects,
      headers: Object.fromEntries(['content-type','x-robots-tag','last-modified','server','link'].map(key => [key, response.headers.get(key)])),
      title: $('title').text(), description: $('meta[name="description"]').attr('content') ?? null,
      canonical: $('link[rel="canonical"]').attr('href') ?? null,
      robots: $('meta[name="robots"],meta[name="googlebot"]').map((i, el) => ({name: $(el).attr('name'), content: $(el).attr('content')})).get(),
      h1: $('h1').map((i, el) => $(el).text()).get(), lang: $('html').attr('lang'),
      mainTextCharacters: main.text().replace(/\s+/g,' ').trim().length,
      schemaTypes: [...new Set(schema.flatMap(node => node['@type'] ?? []))], schemaErrors,
      identity: schema.filter(node => ['WebSite','MedicalClinic'].includes(node['@type'])).map(node => ({type: node['@type'], id: node['@id'], url: node.url, name: node.name, sameAs: node.sameAs})),
      links: [...new Set(links)],
      ...(url.endsWith('robots.txt') ? {body: html} : {}),
      ...(url.endsWith('sitemap.xml') ? {body: html, sitemapUrls: load(html, {xmlMode: true})('loc').map((i, el) => $(el).text()).get()} : {}),
    };
  } catch(error) { return {requested: url, error: error.message, cause: error.cause?.message, redirects}; }
}
const rows = new Array(pages.length); let next = 0;
await Promise.all(Array.from({length: 4}, async () => {
  while(next < pages.length) { const i = next++; rows[i] = {path: pages[i].path, intendedIndexable: pages[i].indexable, ...await inspect(origin + pages[i].path)}; }
}));
const endpoints = [];
for(const url of [origin+'/robots.txt', origin+'/sitemap.xml', 'http://yttop.kr/', 'https://www.yttop.kr/', 'http://www.yttop.kr/', 'https://codepump-net.github.io/yt-top-webforai/', origin+'/seo-audit-missing-20261015/', origin+'/services/heart/echocardiography']) endpoints.push(await inspect(url));
const originalUrls = [...new Set(['https://yttop.co.kr/', ...pages.filter(p => ['echocardiography','colonoscopy','national-checkup','visit'].includes(p.id)).flatMap(p=>p.sources.map(s=>s.url)).filter(url=>new URL(url).hostname.endsWith('yttop.co.kr'))])];
const original = [];
for(const url of originalUrls) original.push(await inspect(url));
const pathOf = url => {const u = new URL(url); return u.origin === origin ? u.pathname : null;};
const byPath = new Map(rows.map(row => [row.path, row]));
const distance = new Map([['/',0]]), queue = ['/'];
while(queue.length){const current=queue.shift(); for(const link of byPath.get(current)?.links??[]){const p=pathOf(link); if(byPath.has(p)&&!distance.has(p)){distance.set(p,distance.get(current)+1);queue.push(p);}}}
const duplicate = key => {const groups=new Map();for(const row of rows.filter(r=>r.intendedIndexable)){const value=row[key];if(value)groups.set(value,[...(groups.get(value)??[]),row.path]);}return [...groups].filter(([,paths])=>paths.length>1).map(([value,paths])=>({value,paths}));};
const summary = {
  checkedAt, pageCount: rows.length, intendedIndexable: rows.filter(r=>r.intendedIndexable).length,
  statuses: rows.reduce((acc,r)=>(acc[r.status??'error']=(acc[r.status??'error']??0)+1,acc),{}),
  noindexPages: rows.filter(r=>/noindex/i.test(r.robots?.map(m=>m.content).join(' ')+' '+r.headers?.['x-robots-tag'])).length,
  canonicalMismatches: rows.filter(r=>r.canonical!==origin+r.path).map(r=>r.path),
  titleDuplicates: duplicate('title'), descriptionDuplicates: duplicate('description'),
  missingDescriptions: rows.filter(r=>r.intendedIndexable&&!r.description).map(r=>r.path),
  h1Problems: rows.filter(r=>r.intendedIndexable&&r.h1?.length!==1).map(r=>({path:r.path,h1:r.h1})),
  missingMainText: rows.filter(r=>r.intendedIndexable&&!r.mainTextCharacters).map(r=>r.path),
  schemaParseErrors: rows.filter(r=>r.schemaErrors?.length).map(r=>r.path),
  unreachableIndexable: rows.filter(r=>r.intendedIndexable&&!distance.has(r.path)).map(r=>r.path),
  maxClickDepth: Math.max(...rows.filter(r=>r.intendedIndexable&&distance.has(r.path)).map(r=>distance.get(r.path))),
  originalPagesChecked: original.length,
  originalLinksToNew: original.map(r=>({url:r.requested,status:r.status,links:r.links?.filter(url=>new URL(url).hostname==='yttop.kr')})),
};
await fs.writeFile(path.join(dir,'live-evidence.json'),JSON.stringify({summary,pages:rows,endpoints,original},null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
console.log(JSON.stringify(endpoints.map(({requested,status,finalUrl,redirects,error,body})=>({requested,status,finalUrl,redirects,error,body})),null,2));
