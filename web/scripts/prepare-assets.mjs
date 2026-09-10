// One-time local import. CI uses the checked-in, optimized assets and verifies hashes.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const sourceRoot = path.resolve('../research/2026-09-11-yttop/evidence/assets');
const out = path.resolve('public/assets');
await fs.mkdir(out, { recursive: true });
const specs = [
  { id: 'logo', file: 'dc7a3f2f50f2231c.png', widths: [294], page: 'https://yttop.co.kr/' },
  {
    id: 'clinic',
    file: '988305921ed3aadb.png',
    widths: [800, 1600],
    page: 'https://yttop.co.kr/16',
  },
  { id: 'jongseol', file: '2d2fd518e1de33ef.jpg', widths: [640], page: 'https://yttop.co.kr/48' },
  { id: 'rayoung', file: '42d82d647291539a.jpg', widths: [640], page: 'https://yttop.co.kr/48' },
];
const assets = [];
const originals = {
  logo: 'https://cdn.imweb.me/thumbnail/20260813/cbc31ebf9d5f9.png',
  clinic: 'https://cdn.imweb.me/thumbnail/20250527/c50af20f75b98.png',
  jongseol: 'https://cdn.imweb.me/thumbnail/20250926/3f5fe415970bc.jpg',
  rayoung: 'https://cdn.imweb.me/thumbnail/20260623/c679680d9181c.jpg',
};
for (const spec of specs) {
  const input = await fs.readFile(path.join(sourceRoot, spec.file));
  for (const width of spec.widths) {
    const filename = spec.id === 'logo' ? 'logo.webp' : `${spec.id}-${width}.webp`;
    const result = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: spec.id === 'logo' ? 95 : 83 })
      .toBuffer({ resolveWithObject: true });
    await fs.writeFile(path.join(out, filename), result.data);
    assets.push({
      id: spec.id,
      file: `/assets/${filename}`,
      width: result.info.width,
      height: result.info.height,
      bytes: result.data.length,
      sha256: crypto.createHash('sha256').update(result.data).digest('hex'),
      sourcePage: spec.page,
      sourceFile: spec.file,
      sourceSha256: crypto.createHash('sha256').update(input).digest('hex'),
      sourceUrl: originals[spec.id],
      provenance: 'Existing clinic website; user-directed reuse for the clinic redevelopment.',
      imageKind:
        spec.id === 'rayoung'
          ? 'silhouette'
          : spec.id === 'jongseol'
            ? 'portrait'
            : spec.id === 'logo'
              ? 'logo'
              : 'interior',
      checkedAt: '2026-09-11',
    });
  }
}
await fs.writeFile('../content/assets.json', JSON.stringify(assets, null, 2) + '\n');
console.log(
  `Prepared ${assets.length} assets: ${assets.reduce((n, a) => n + a.bytes, 0)} bytes total.`,
);
