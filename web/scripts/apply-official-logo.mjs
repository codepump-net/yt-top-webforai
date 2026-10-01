import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../../', import.meta.url));
const evidence = path.join(root, 'docs/logo-correction-2026-10-01');
const apply = process.argv.includes('--apply');
const digest = (b) => crypto.createHash('sha256').update(b).digest('hex');
const load = async (p) => JSON.parse(await fs.readFile(path.join(root, p), 'utf8'));
const audit = await load('docs/logo-audit-2026-10-01/findings.json');
const assets = await load('content/assets.json');
const reference = assets.find((a) => a.id === 'logo');
const logo = await fs.readFile(path.join(root, 'web/public' + reference.file));
if (digest(logo) !== audit.reference.sha256 || digest(logo) !== reference.sha256)
  throw new Error('Official reference logo differs from the audited clinic logo');
const lm = await sharp(logo).metadata();
if (lm.width !== 294 || lm.height !== 77 || !lm.hasAlpha)
  throw new Error('Unexpected official clinic logo dimensions or transparency');
await fs.mkdir(path.join(evidence, 'before/current'), { recursive: true });
await fs.mkdir(path.join(evidence, 'before/historical'), { recursive: true });
await fs.mkdir(path.join(evidence, 'after'), { recursive: true });
await fs.mkdir(path.join(evidence, 'regions'), { recursive: true });
const records = [];

async function correct({ id, sourceFile, originalHash, historical = false }) {
  const basename = path.basename(sourceFile);
  const beforeFile = `docs/logo-correction-2026-10-01/before/${historical ? 'historical' : 'current'}/${basename}`;
  const beforePath = path.join(root, beforeFile);
  let input;
  try {
    input = await fs.readFile(beforePath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    input = await fs.readFile(path.join(root, sourceFile));
    if (digest(input) !== originalHash) throw new Error(`Unexpected pre-correction image: ${id}`);
    await fs.writeFile(beforePath, input);
  }
  if (digest(input) !== originalHash) throw new Error(`Before-image integrity changed: ${id}`);
  const { data, info } = await sharp(input)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const banner = id.startsWith('banner-');
  const search = banner
    ? { left: 20, right: 550, bottom: 245 }
    : { left: 350, right: 750, bottom: id === 'diagram-endoscopy-preparation' ? 95 : 115 };
  let left = Infinity,
    top = Infinity,
    right = -1,
    bottom = -1;
  for (let y = 0; y < search.bottom; y++)
    for (let x = search.left; x < search.right; x++) {
      const i = (y * info.width + x) * info.channels;
      if (Math.min(data[i], data[i + 1], data[i + 2]) < 175) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  if (!Number.isFinite(left) || bottom < top) throw new Error(`Cannot locate audited logo: ${id}`);
  const placement = {
    left: banner ? left : Math.floor((info.width - lm.width) / 2),
    top: Math.max(8, Math.round((top + bottom - lm.height + 1) / 2)),
    width: lm.width,
    height: lm.height,
  };
  const x0 = Math.max(0, Math.min(left, placement.left) - 10);
  const x1 = Math.max(right, placement.left + lm.width - 1) + 10;
  const y0 = Math.max(0, Math.min(top, placement.top) - 8);
  const y1 = Math.max(bottom, placement.top + lm.height - 1) + 8;
  const cleanup = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
  const clean = Buffer.from(data);
  const pixel = (x, y, c) => data[(y * info.width + x) * info.channels + c];
  // Interpolate the surrounding pale background. The four boundary edges remain
  // unchanged, so the replaced header area has no solid white rectangular seam.
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const u = (x - x0) / (x1 - x0),
        v = (y - y0) / (y1 - y0);
      for (let c = 0; c < 3; c++) {
        const vertical = (1 - v) * pixel(x, y0, c) + v * pixel(x, y1, c);
        const horizontal = (1 - u) * pixel(x0, y, c) + u * pixel(x1, y, c);
        const corners =
          (1 - u) * (1 - v) * pixel(x0, y0, c) +
          u * (1 - v) * pixel(x1, y0, c) +
          (1 - u) * v * pixel(x0, y1, c) +
          u * v * pixel(x1, y1, c);
        clean[(y * info.width + x) * info.channels + c] = Math.max(
          0,
          Math.min(255, Math.round(vertical + horizontal - corners)),
        );
      }
    }
  const output = await sharp(clean, { raw: info })
    .composite([{ input: logo, left: placement.left, top: placement.top }])
    .removeAlpha()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  const afterPixels = await sharp(output).removeAlpha().raw().toBuffer();
  let changedPixels = 0,
    changedOutsideCleanup = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const changed =
        data[i] !== afterPixels[i] ||
        data[i + 1] !== afterPixels[i + 1] ||
        data[i + 2] !== afterPixels[i + 2];
      if (changed) {
        changedPixels++;
        if (x < x0 || x > x1 || y < y0 || y > y1) changedOutsideCleanup++;
      }
    }
  if (changedOutsideCleanup) throw new Error(`Pixels outside logo area changed: ${id}`);
  const region = await sharp(output).extract(placement).removeAlpha().raw().toBuffer();
  const background = await sharp(clean, { raw: info }).extract(placement).png().toBuffer();
  const expected = await sharp(background)
    .composite([{ input: logo, left: 0, top: 0 }])
    .removeAlpha()
    .raw()
    .toBuffer();
  if (!region.equals(expected)) throw new Error(`Official logo pixels differ: ${id}`);
  const outputFile = historical
    ? `assets/corrected-logo-2026-10-01/historical/${basename}`
    : sourceFile;
  const previewFile = `docs/logo-correction-2026-10-01/after/${historical ? 'historical-' : ''}${basename}`;
  await fs.writeFile(path.join(root, previewFile), output);
  await sharp(output)
    .extract(cleanup)
    .png()
    .toFile(path.join(evidence, 'regions', `${historical ? 'historical-' : ''}${id}.png`));
  const composite = {
    correctedAt: '2026-10-01',
    method: 'exact-reference-pixel-composite',
    referenceFile: reference.file,
    referenceSha256: digest(logo),
    ...placement,
    cleanup,
    beforeSha256: digest(input),
    renderedPixelsSha256: digest(region),
  };
  if (apply) {
    await fs.mkdir(path.dirname(path.join(root, outputFile)), { recursive: true });
    await fs.writeFile(path.join(root, outputFile), output);
    if (!historical) {
      const asset = assets.find((a) => a.id === id);
      await fs.writeFile(path.join(root, 'web/public' + asset.file), output);
      Object.assign(asset, {
        bytes: output.length,
        sha256: digest(output),
        sourceSha256: digest(output),
        checkedAt: '2026-10-01',
        logoComposite: composite,
        provenance:
          'Artwork originally generated with image_gen on 2026-09-29. On 2026-10-01 the incorrect generated brand area was replaced deterministically with the existing clinic website logo.webp at its native 294x77 pixels, without resizing or redrawing the logo. Canvas dimensions and all decoded pixels outside the logo cleanup rectangle are preserved. The saved master and public PNG have identical bytes.',
      });
    }
  }
  records.push({
    id,
    historical,
    beforeFile,
    originalSourceFile: sourceFile,
    outputFile,
    previewFile,
    originalSha256: digest(input),
    sha256: digest(output),
    bytes: output.length,
    width: info.width,
    height: info.height,
    changedPixels,
    changedOutsideCleanup,
    originalLogoPixelsMatch: true,
    logoComposite: composite,
  });
}

for (const f of audit.findings)
  await correct({ id: f.id, sourceFile: f.masterFile, originalHash: f.hashes.master });
for (const f of audit.previous)
  await correct({
    id: path.basename(f.path).replace('-hq-original.png', ''),
    sourceFile: f.path,
    originalHash: f.sha256,
    historical: true,
  });
const symbolRect = { left: 0, top: 0, width: 73, height: 77 };
const symbol = await sharp(logo).extract(symbolRect).png().toBuffer();
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 77 77"><image x="2" y="0" width="73" height="77" href="data:image/png;base64,${symbol.toString('base64')}"/></svg>\n`;
await fs.writeFile(path.join(evidence, 'favicon-corrected.svg'), favicon);
await sharp(Buffer.from(favicon))
  .resize({ width: 231 })
  .png()
  .toFile(path.join(evidence, 'favicon-preview.png'));
if (apply) {
  const old = await fs.readFile(path.join(root, 'web/public/favicon.svg'));
  const backup = path.join(evidence, 'before/favicon.svg');
  try {
    await fs.access(backup);
  } catch {
    await fs.writeFile(backup, old);
  }
  await fs.writeFile(path.join(root, 'web/public/favicon.svg'), favicon);
  await fs.writeFile(
    path.join(root, 'content/assets.json'),
    JSON.stringify(assets, null, 2) + '\n',
  );
}
await fs.writeFile(
  path.join(evidence, 'corrections.json'),
  JSON.stringify(
    {
      date: '2026-10-01',
      applied: apply,
      reference: {
        file: 'web/public' + reference.file,
        sha256: digest(logo),
        width: lm.width,
        height: lm.height,
        unchangedNativePixels: true,
      },
      currentCorrected: records.filter((r) => !r.historical).length,
      historicalCorrectedVariants: records.filter((r) => r.historical).length,
      historicalEvidenceOriginalsPreserved: true,
      records,
      favicon: {
        file: 'web/public/favicon.svg',
        sha256: digest(Buffer.from(favicon)),
        method:
          'Original clinic symbol cropped from the reference logo and embedded as PNG bytes in SVG; no redraw.',
        symbolRect,
        symbolPngSha256: digest(symbol),
      },
    },
    null,
    2,
  ) + '\n',
);
console.log(
  JSON.stringify({
    applied: apply,
    current: 17,
    historicalCorrectedVariants: 4,
    favicon: 1,
    unchangedOutsideLogoAreas: records.every((r) => r.changedOutsideCleanup === 0),
    originalLogoPixelsMatch: records.every((r) => r.originalLogoPixelsMatch),
  }),
);
