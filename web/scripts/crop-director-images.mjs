import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { sha256 } from './content-contract.mjs';

// The user requested the supplied artwork unchanged, split from the contact sheet.
const manifest = JSON.parse(
  await fs.readFile('../assets/director-supplied/2026-09-27/crops.json', 'utf8'),
);
const source = await fs.readFile('../' + manifest.sourceFile);
assert.equal(sha256(source), manifest.sourceSha256, 'Supplied contact sheet changed');
const dimensions = await sharp(source).metadata();
assert.equal(dimensions.width, manifest.width);
assert.equal(dimensions.height, manifest.height);
const assets = JSON.parse(await fs.readFile('../content/assets.json', 'utf8'));
const visuals = JSON.parse(await fs.readFile('../content/visuals.json', 'utf8'));
const results = [];
for (const crop of manifest.crops) {
  const asset = assets.find((a) => a.id === crop.assetId);
  assert(asset, `Unknown asset: ${crop.assetId}`);
  const originalPixels = await sharp(source).extract(crop.rectangle).removeAlpha().raw().toBuffer();
  const bytes = await sharp(source).extract(crop.rectangle).webp({ lossless: true }).toBuffer();
  const savedPixels = await sharp(bytes).removeAlpha().raw().toBuffer();
  assert(originalPixels.equals(savedPixels), `Crop pixels changed: ${crop.assetId}`);
  assert(bytes.length <= 200_000, `Crop exceeds the existing asset budget: ${crop.assetId}`);
  await fs.writeFile('public' + asset.file, bytes);
  Object.assign(asset, {
    width: crop.rectangle.width,
    height: crop.rectangle.height,
    bytes: bytes.length,
    sha256: sha256(bytes),
    sourceFile: manifest.sourceFile,
    sourceSha256: manifest.sourceSha256,
    sourceCrop: crop.rectangle,
    provenance:
      'Unaltered crop of the director-supplied contact sheet, at the user’s explicit request. Lossless WebP preserves the decoded source pixels; no text or artwork was regenerated.',
    imageKind: 'patient-information',
    checkedAt: '2026-09-28',
  });
  const diagram = visuals.diagrams.find((v) => v.assetId === asset.id);
  if (diagram) asset.guidanceSha256 = sha256(diagram);
  results.push({
    assetId: asset.id,
    file: asset.file,
    sourceCrop: crop.rectangle,
    bytes: bytes.length,
    pixelsMatch: true,
  });
}
await fs.writeFile('../content/assets.json', JSON.stringify(assets, null, 2) + '\n');
await fs.mkdir('reports', { recursive: true });
await fs.writeFile(
  'reports/director-image-crops.json',
  JSON.stringify({ sourceSha256: manifest.sourceSha256, results }, null, 2) + '\n',
);
console.log(`Preserved source pixels in ${results.length} supplied image crops.`);
