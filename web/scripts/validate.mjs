import fs from 'node:fs/promises';
import sharp from 'sharp';
import { loadContent } from './data.mjs';
import { sha256, pageDigest, validateContent } from './content-contract.mjs';
import { validateRedrawnImage } from './redrawn-image-contract.mjs';
const data = await loadContent();
const mode = process.argv[2] ?? 'review';
const errors = validateContent(data.pages, { ...data, mode });
const suppliedSources = new Map();
for (const notice of data.notices.filter((item) => item.document)) {
  try {
    const bytes = await fs.readFile(`public${notice.document.pdf}`);
    if (
      bytes.subarray(0, 5).toString() !== '%PDF-' ||
      sha256(bytes) !== notice.document.sha256 ||
      bytes.length !== notice.document.bytes
    )
      errors.push(`Notice PDF integrity: ${notice.document.pdf}`);
  } catch (error) {
    errors.push(`Notice PDF verification failed: ${notice.document.pdf}: ${error.message}`);
  }
}
for (const asset of data.assets) {
  try {
    const bytes = await fs.readFile(`public${asset.file}`);
    if (sha256(bytes) !== asset.sha256 || bytes.length !== asset.bytes)
      errors.push(`Asset integrity: ${asset.file}`);
    if (asset.generatedOriginal) {
      const source = await fs.readFile('../' + asset.sourceFile);
      errors.push(...(await validateRedrawnImage(asset, bytes, source)));
    } else if (asset.imageKind === 'document-page') {
      const document = data.notices.find((n) =>
        n.document?.pages.some((p) => p.assetId === asset.id),
      )?.document;
      const metadata = await sharp(bytes).metadata();
      if (
        !document ||
        metadata.format !== 'png' ||
        metadata.width !== asset.width ||
        metadata.height !== asset.height ||
        asset.bytes > 5_000_000
      )
        errors.push(`Invalid full-page document image: ${asset.file}`);
    } else if (asset.bytes > 200_000) errors.push(`Image exceeds 200 kB: ${asset.file}`);
    if (asset.sourceCrop) {
      if (!suppliedSources.has(asset.sourceFile))
        suppliedSources.set(asset.sourceFile, await fs.readFile('../' + asset.sourceFile));
      const source = suppliedSources.get(asset.sourceFile);
      if (sha256(source) !== asset.sourceSha256)
        errors.push(`Supplied image source changed: ${asset.file}`);
      const cropPixels = await sharp(source)
        .extract(asset.sourceCrop)
        .removeAlpha()
        .raw()
        .toBuffer();
      const imagePixels = await sharp(bytes).removeAlpha().raw().toBuffer();
      const dimensions = await sharp(bytes).metadata();
      if (
        dimensions.width !== asset.sourceCrop.width ||
        dimensions.height !== asset.sourceCrop.height ||
        dimensions.width !== asset.width ||
        dimensions.height !== asset.height ||
        !cropPixels.equals(imagePixels)
      )
        errors.push(`Supplied image crop differs from source pixels: ${asset.file}`);
    }
  } catch (error) {
    errors.push(`Asset verification failed: ${asset.file}: ${error.message}`);
  }
}
const { clinic, physicians, assets, rendererDigest } = data;
await fs.mkdir('reports', { recursive: true });
await fs.writeFile(
  'reports/review-inventory.json',
  JSON.stringify(
    data.pages
      .filter((p) => p.indexable)
      .map((p) => ({
        pageId: p.id,
        path: p.path,
        requiredRole: p.risk === 'operational' ? 'operations' : 'medical',
        reviewStatus: p.reviewStatus,
        digest: pageDigest(p, { clinic, physicians, assets, rendererDigest }),
      })),
    null,
    2,
  ),
);
await fs.writeFile(
  'reports/content-validation.json',
  JSON.stringify({ mode, pages: data.pages.length, assets: data.assets.length, errors }, null, 2),
);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Content contract passed: ${data.pages.length} pages, ${data.assets.length} assets (${mode}).`,
);
