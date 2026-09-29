import sharp from 'sharp';
import { createHash } from 'node:crypto';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

// The larger budget is limited to native, unmodified PNG masters in this collection.
export async function validateRedrawnImage(asset, bytes, source) {
  const errors = [];
  const label = asset.id;
  if (
    asset.generatedOriginal !== true ||
    asset.file !== `/assets/clinic-visuals-hq/${label}-hq-original.png` ||
    asset.sourceFile !== `assets/generated/redrawn-2026-09-29/${label}-hq-original.png` ||
    asset.sourceCrop
  )
    errors.push(`Redrawn image provenance invalid: ${label}`);
  if (!bytes.equals(source) || sha256(source) !== asset.sourceSha256)
    errors.push(`Native PNG differs from saved master: ${label}`);
  if (bytes.length > 8_000_000) errors.push(`Native PNG exceeds 8 MB: ${label}`);
  const dimensions = await sharp(bytes).metadata();
  if (
    dimensions.format !== 'png' ||
    dimensions.width !== asset.width ||
    dimensions.height !== asset.height ||
    Math.min(dimensions.width, dimensions.height) < 900 ||
    Math.max(dimensions.width, dimensions.height) < 1400
  )
    errors.push(`Native PNG format or dimensions invalid: ${label}`);
  return errors;
}
