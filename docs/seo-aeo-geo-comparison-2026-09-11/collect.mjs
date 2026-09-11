// Read-only HTTP evidence collection. Run from any directory with Node 24.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../..');
const require = createRequire(path.join(root, 'web/package.json'));
const { load } = require('cheerio');
const rawDir = path.join(root, '.local/seo-comparison-2026-09-11');
await fs.mkdir(rawDir, { recursive: true });
const sites = [
  { id: 'yeongtong', base: 'https://codepump-net.github.io/yt-top-webforai/' },
  { id: 'gungang-demo', base: 'https://thegungang365.demo.htracker.co.kr/', blocked: true },
  { id: 'gungang-public', base: 'https://blog.thegungang365.com/' },
  { id: 'olympic', base: 'https://blog.olympicpark365.com/' },
];
const clean = s => s.replace(/\s+/g, ' ').trim();
async function get(url) {
  const started = Date.now();
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
    const body = await r.text();
    return { url, finalUrl: r.url, status: r.status, headers: Object.fromEntries(['content-type','x-robots-tag','last-modified','content-encoding'].map(k => [k,r.headers.get(k)])), decodedBytes: Buffer.byteLength(body), elapsedMs: Date.now()-started, body };
  } catch(e) { return {url,error:String(e)}; }
}
function parse(r) {
  if (!r.body || !r.headers['content-type']?.includes('html')) return r;
  const $ = load(r.body);
  const meta = key => $(`meta[name="${key}"],meta[property="${key}"]`).map((_,el)=>$(el).attr('content')).get();
  const schemas = [], schemaErrors = [];
  $('script[type="application/ld+json"]').each((i,el)=>{try{schemas.push(JSON.parse($(el).text()));}catch(e){schemaErrors.push(`${i}: ${e}`);}});
  const nodes=[];
  function walk(v) { if(Array.isArray(v)) v.forEach(walk); else if(v && typeof v==='object') {if(v['@type'])nodes.push(v); Object.values(v).forEach(walk);} }
  schemas.forEach(walk);
  const links = $('a[href]').map((_,el)=>({text:clean($(el).text()).slice(0,180),href:$(el).attr('href')})).get();
  const imgs = $('img').map((_,el)=>({src:$(el).attr('src'),alt:$(el).attr('alt')??null,width:$(el).attr('width')??null,height:$(el).attr('height')??null,loading:$(el).attr('loading')??null})).get();
  $('script,style,template,noscript').remove();
  const bodyText=clean($('body').text());
  const main = $('main').length ? $('main').first() : $('body');
  const headings=main.find('h1,h2,h3').map((_,el)=>({level:el.tagName,text:clean($(el).text())})).get();
  const mainText=clean(main.text());
  const faq=nodes.filter(n=>n['@type']==='Question').map(n=>({question:n.name,answer:n.acceptedAnswer?.text}));
  const {body,...rest}=r;
  return {...rest,title:$('title').text(),description:meta('description'),robots:meta('robots'),googlebot:meta('googlebot'),canonical:$('link[rel="canonical"]').map((_,el)=>$(el).attr('href')).get(),lang:$('html').attr('lang'),viewport:meta('viewport'),ogTitle:meta('og:title'),ogUrl:meta('og:url'),ogImage:meta('og:image'),h1:headings.filter(h=>h.level==='h1').map(h=>h.text),headings,mainText,bodyText,links,imgs,schemas,schemaErrors,schemaTypes:[...new Set(nodes.flatMap(n=>n['@type']))],faq,faqTextMatches:faq.map(f=>({question:mainText.includes(clean(f.question||'')),answer:mainText.includes(clean(f.answer||''))})),timeElements:$('time').map((_,el)=>({date:$(el).attr('datetime'),text:clean($(el).text())})).get()};
}
const results=[];
for(const site of sites) {
  const endpoints=[];
  for(const suffix of ['robots.txt','sitemap.xml','llms.txt']) endpoints.push(await get(site.base+suffix));
  if(site.id==='yeongtong')endpoints.push(await get('https://codepump-net.github.io/robots.txt'));
  const sitemap=endpoints.find(e=>e.url.endsWith('sitemap.xml'));
  const xml=load(sitemap.body||'',{xmlMode:true});
  const sitemapEntries=xml('url').map((_,el)=>({loc:xml(el).children('loc').text(),lastmod:xml(el).children('lastmod').text()})).get();
  const homepage=await get(site.base);
  const home=load(homepage.body||'');
  let urls=[site.base];
  if(site.id==='yeongtong') {
    const pages=JSON.parse(await fs.readFile(path.join(root,'content/pages.json'),'utf8'));
    urls=pages.filter(p=>p.path!=='/404.html').map(p=>site.base+p.path.replace(/^\//,''));
  } else if(!site.blocked) {
    const entries=sitemapEntries.map(e=>e.loc).filter(u=>new URL(u).origin===new URL(site.base).origin);
    const writers=entries.filter(u=>/\/writers\//.test(u)).slice(0,2);
    const categories=[...new Set(home('a[href]').map((_,el)=>home(el).attr('href')).get().filter(u=>/^\/(category|series)\//.test(u)))].slice(0,2).map(u=>new URL(u,site.base).href);
    const articles=entries.filter(u=>{const p=new URL(u).pathname;return p!=='/' && !/^\/(writers|category|series|corner)(\/|$)/.test(p);});
    // Small purposive sample: newest 7 articles + category, author and index templates.
    urls=[site.base,site.base+'writers',...writers,...categories,...articles.slice(0,7)];
    if(site.id==='olympic')urls.push(site.base+'series/iv-recovery',site.base+'series/internal-infection');
  }
  urls=[...new Set(urls)];
  const pages=[];
  for(let i=0;i<urls.length;i+=2) {
    const batch=await Promise.all(urls.slice(i,i+2).map(u=>u===site.base?homepage:get(u)));
    for(const r of batch) {
      const name=site.id+'-'+Buffer.from(r.url).toString('base64url');
      if(r.body)await fs.writeFile(path.join(rawDir,name+'.html'),r.body);
      pages.push(parse(r));
    }
  }
  results.push({...site,endpoints,sitemapEntries,pages});
  console.log(JSON.stringify({site:site.id,pages:pages.length,statuses:pages.reduce((a,p)=>(a[p.status||'error']=(a[p.status||'error']||0)+1,a),{}),sitemap:sitemapEntries.length,noindex:pages.filter(p=>p.robots?.some(x=>x.includes('noindex'))).length,schemaErrors:pages.filter(p=>p.schemaErrors?.length).length}));
}
await fs.writeFile(path.join(rawDir,'http-evidence-full.json'),JSON.stringify({capturedAt:new Date().toISOString(),method:'Unauthenticated Node fetch; HTML parsing without JavaScript. Timings are diagnostic, not Core Web Vitals. Demo home returned 200/noindex via Node, while Python requests returned 403. Demo subpages not crawled. Text and JSON-LD matches are mechanical indicators, not medical verification.',sites:results},null,2));
// Do not commit full competitor articles or raw HTML to the repository.
const compact=results.map(s=>({...s,endpoints:s.endpoints.map(e=>{const {body,...rest}=e;return {...rest,...(e.url.endsWith('/robots.txt') && e.status===200?{body}:{})};}),pages:s.pages.map(p=>{const {mainText,bodyText,schemas,faq,links,imgs,body,...rest}=p;return {...rest,mainTextChars:mainText?.length,imageCount:imgs?.length,imagesMissingAlt:imgs?.filter(i=>i.alt===null).length,internalLinkCount:links?.filter(l=>{try{return new URL(l.href,p.url).origin===new URL(p.url).origin;}catch{return false;}}).length,faqCount:faq?.length};})}));
await fs.writeFile(path.join(dir,'http-evidence.json'),JSON.stringify({capturedAt:new Date().toISOString(),method:'See collect.mjs. Raw HTML and full extracted text retained only under ignored .local/. Technical metadata only in this file.',sites:compact},null,2));
