import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../..');
const require=createRequire(path.join(root,'web/package.json'));
const { chromium }=require('@playwright/test');
const { default:lighthouse }=await import(pathToFileURL(require.resolve('lighthouse')).href);
const { launch }=await import(pathToFileURL(require.resolve('chrome-launcher')).href);
const chromePath='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const urls=[['yeongtong','https://codepump-net.github.io/yt-top-webforai/'],['gungang-public','https://blog.thegungang365.com/'],['olympic','https://blog.olympicpark365.com/']];
const browser=await chromium.launch({executablePath:chromePath,headless:true});
const observations=[];
try {
  for(const [id,url] of [...urls,['gungang-demo','https://thegungang365.demo.htracker.co.kr/']]) {
    const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    const page=await context.newPage();
    const response=await page.goto(url,{waitUntil:'networkidle',timeout:45000});
    const result=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(e=>e.innerText),robots:document.querySelector('meta[name=robots]')?.content,bodyChars:document.body.innerText.length,viewportWidth:innerWidth,documentWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>i.currentSrc && i.complete && i.naturalWidth===0).length,telLinks:[...document.querySelectorAll('a[href^="tel:"]')].map(e=>e.getAttribute('href'))}));
    await page.screenshot({path:path.join(root,'.local/seo-comparison-2026-09-11',id+'-mobile.png'),fullPage:false});
    observations.push({id,url,status:response.status(),...result});
    console.log(JSON.stringify({browser:id,...result}));
    await context.close();
  }
} finally {await browser.close();}
await fs.writeFile(path.join(dir,'browser-evidence.json'),JSON.stringify({capturedAt:new Date().toISOString(),method:'Headless Edge; 390×844 CSS px; networkidle. Read-only navigation; no forms or phone links activated.',observations},null,2));
const reports=[];
for(const [id,url] of urls) {
  const profile=path.join(root,'.local/seo-comparison-2026-09-11/lighthouse-'+id);
  await fs.mkdir(profile,{recursive:true});
  const chrome=await launch({chromePath,userDataDir:profile,chromeFlags:['--headless=new','--no-sandbox','--disable-dev-shm-usage']});
  try {
    const {lhr}=await lighthouse(url,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
    const report={id,url,version:lhr.lighthouseVersion,fetchTime:lhr.fetchTime,environment:lhr.environment,config:lhr.configSettings,finalUrl:lhr.finalDisplayedUrl,runtimeError:lhr.runtimeError,warnings:lhr.runWarnings,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time','first-contentful-paint','total-byte-weight'].map(k=>[k,lhr.audits[k]?.numericValue])),failed:Object.values(lhr.audits).filter(a=>a.score!==null && a.score<1 && a.scoreDisplayMode==='binary').map(a=>({id:a.id,title:a.title,description:a.description,affectedItemCount:a.details?.items?.length}))};
    reports.push(report);
    await fs.writeFile(path.join(root,'.local/seo-comparison-2026-09-11',id+'-lighthouse.json'),JSON.stringify(lhr));
    console.log(JSON.stringify({lighthouse:id,scores:report.scores,metrics:report.metrics}));
  }catch(e){reports.push({id,url,error:String(e)});console.log(String(e));}
  finally{await chrome.kill();}
}
await fs.writeFile(path.join(dir,'lighthouse-evidence.json'),JSON.stringify({capturedAt:new Date().toISOString(),method:'Single mobile simulated Lighthouse run per live homepage, sequential on same Windows Edge machine. Diagnostic laboratory evidence; not real-user CrUX, INP, ranking, or AI citation performance.',reports},null,2));
