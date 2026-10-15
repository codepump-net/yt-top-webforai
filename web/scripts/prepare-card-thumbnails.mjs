// Presentation-only derivatives. Registered images and content stay unchanged.
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import assets from '../../content/assets.json' with { type: 'json' };
import visuals from '../../content/visuals.json' with { type: 'json' };

const destination = new URL('../public/assets/card-thumbnails/', import.meta.url);
await fs.mkdir(destination, { recursive: true });
for (const visual of visuals.banners) {
  const asset = assets.find((item) => item.id === visual.assetId);
  if (!asset) throw new Error(`Missing registered illustration: ${visual.assetId}`);
  for (const width of [400, 720]) {
    const basename = width === 720 ? asset.id : `${asset.id}-${width}`;
    const thumbnail = sharp(
      fileURLToPath(new URL(`../public${asset.file}`, import.meta.url)),
    ).resize({ width, withoutEnlargement: true });
    await thumbnail
      .clone()
      .webp({ quality: 88 })
      .toFile(fileURLToPath(new URL(`${basename}.webp`, destination)));
    await thumbnail
      .clone()
      .avif({ quality: 50, effort: 4 })
      .toFile(fileURLToPath(new URL(`${basename}.avif`, destination)));
  }
}
console.log(`Prepared ${visuals.banners.length} card thumbnails without modifying originals.`);
