import fs from 'node:fs/promises';
import { loadContent } from './data.mjs';
import { sha256, pageDigest, validateContent } from './content-contract.mjs';
const data = await loadContent();
const mode = process.argv[2] ?? 'review';
const errors = validateContent(data.pages, { ...data, mode });
for (const asset of data.assets) {
  try {
    const bytes = await fs.readFile(`public${asset.file}`);
    if (sha256(bytes) !== asset.sha256 || bytes.length !== asset.bytes)
      errors.push(`Asset integrity: ${asset.file}`);
    if (asset.bytes > 200_000) errors.push(`Image exceeds 200 kB: ${asset.file}`);
  } catch {
    errors.push(`Missing asset: ${asset.file}`);
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
