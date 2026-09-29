// Legacy HTML renderer. Preserve supplied crops and the user-requested new PNG masters.
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { sha256 } from './content-contract.mjs';
const visuals = JSON.parse(await fs.readFile('../content/visuals.json', 'utf8'));
let assets = JSON.parse(await fs.readFile('../content/assets.json', 'utf8'));
const escape = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1056, height: 1200 },
    deviceScaleFactor: 1,
  });
  for (const diagram of visuals.diagrams) {
    const existing = assets.find((asset) => asset.id === diagram.assetId);
    if (existing?.sourceCrop || existing?.generatedOriginal) {
      console.log(`Preserving registered artwork: ${diagram.assetId}`);
      continue;
    }
    await page.setContent(`<html lang="ko"><meta charset="utf-8"><style>
      *{box-sizing:border-box}body{margin:0;color:#173d4c;background:white;font-family:"Apple SD Gothic Neo","Malgun Gothic",sans-serif}
      main{width:1056px;padding:52px;background:linear-gradient(150deg,#f0f8f7,#fff)}
      header{font-size:19px;letter-spacing:2px;color:#286a68}h1{font-size:42px;line-height:1.35;margin:18px 0 34px;word-break:keep-all}
      ol{list-style:none;padding:0;margin:0;display:grid;gap:18px}li{background:#fff;border:1px solid #cddfdf;border-radius:16px;padding:26px;display:grid;grid-template-columns:56px 1fr;gap:20px}
      .number{background:#145f65;color:white;border-radius:50%;width:50px;height:50px;text-align:center;line-height:50px;font-size:24px}
      h2{font-size:28px;margin:0 0 9px}p{font-size:23px;line-height:1.6;margin:0;word-break:keep-all}aside{margin-top:26px;border-left:5px solid #145f65;padding:12px 18px;font-size:22px;line-height:1.5}footer{font-size:17px;margin-top:28px;color:#496574}
      </style><main><header>영통탑내과 · 진료와 검사 안내</header><h1>${escape(diagram.title)}</h1><ol>${diagram.steps.map((s, i) => `<li><span class="number">${i + 1}</span><div><h2>${escape(s.title)}</h2><p>${escape(s.text)}</p></div></li>`).join('')}</ol><aside>${escape(diagram.note)}</aside><footer>개인별 검사·치료와 준비는 의료진의 안내를 확인해 주세요.</footer></main></html>`);
    await page.evaluate(() => document.fonts.ready);
    const png = await page.locator('main').screenshot();
    const file = `/assets/${diagram.assetId}.webp`;
    const bytes = await sharp(png).webp({ quality: 86 }).toBuffer();
    const { width, height } = await sharp(bytes).metadata();
    await fs.writeFile(`public${file}`, bytes);
    await fs.mkdir('../assets/generated/diagrams', { recursive: true });
    await fs.writeFile(`../assets/generated/diagrams/${diagram.id}.png`, png);
    assets = assets.filter((a) => a.id !== diagram.assetId);
    assets.push({
      id: diagram.assetId,
      file,
      width,
      height,
      bytes: bytes.length,
      sha256: sha256(bytes),
      sourceFile: 'content/visuals.json#' + diagram.id,
      sourceSha256: sha256(diagram),
      provenance:
        'Rendered from the same structured instructions used in visible HTML; based on the linked clinic patient guidance.',
      imageKind: 'patient-information',
      checkedAt: '2026-09-28',
    });
    console.log(`${file}: ${width}x${height}, ${bytes.length} bytes`);
  }
  await fs.writeFile('../content/assets.json', JSON.stringify(assets, null, 2) + '\n');
} finally {
  await browser.close();
}
