import sharp from 'sharp';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

// The larger budget is limited to this collection's saved high-resolution PNG masters.
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
  const composite = asset.logoComposite;
  if (!composite || composite.method !== 'exact-reference-pixel-composite') {
    errors.push(`Official clinic logo composite required: ${label}`);
    return errors;
  }
  try {
    const logo = await fs.readFile(new URL('../public/assets/logo.webp', import.meta.url));
    const reference = await sharp(logo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (
      composite.referenceFile !== '/assets/logo.webp' ||
      composite.referenceSha256 !== sha256(logo) ||
      composite.width !== reference.info.width ||
      composite.height !== reference.info.height
    )
      errors.push(`Official clinic logo reference differs: ${label}`);
    const region = await sharp(bytes)
      .extract({
        left: composite.left,
        top: composite.top,
        width: composite.width,
        height: composite.height,
      })
      .removeAlpha()
      .raw()
      .toBuffer();
    if (sha256(region) !== composite.renderedPixelsSha256)
      errors.push(`Official clinic logo composite pixels changed: ${label}`);
    for (let i = 0, j = 0; i < reference.data.length; i += 4, j += 3) {
      if (
        reference.data[i + 3] === 255 &&
        (reference.data[i] !== region[j] ||
          reference.data[i + 1] !== region[j + 1] ||
          reference.data[i + 2] !== region[j + 2])
      ) {
        errors.push(`Official clinic logo opaque pixels differ: ${label}`);
        break;
      }
    }
  } catch (error) {
    errors.push(`Official clinic logo verification failed: ${label}: ${error.message}`);
  }
  return errors;
}
