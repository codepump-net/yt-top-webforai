import fs from 'node:fs/promises';
import { loadContent } from './data.mjs';
import { sha256, validateContent } from './content-contract.mjs';
import { validateRedrawnImage } from './redrawn-image-contract.mjs';
import { infectionGuideSource } from './infection-guide-source.mjs';

// This request-completion check is separate from the usable review build.
const data = await loadContent();
const errors = validateContent(data.pages, { ...data, mode: 'review' });
const ids = [
  ...data.visuals.banners.map((v) => v.assetId),
  ...data.visuals.diagrams.map((v) => v.assetId),
  'vaccination-schedule-2026',
];
for (const id of ids) {
  const asset = data.assets.find((a) => a.id === id);
  if (!asset) continue; // Content validation records the missing item.
  try {
    const bytes = await fs.readFile(`public${asset.file}`);
    const source = await fs.readFile(`../${asset.sourceFile}`);
    errors.push(...(await validateRedrawnImage(asset, bytes, source)));
    if (sha256(bytes) !== asset.sha256 || bytes.length !== asset.bytes)
      errors.push(`Asset integrity: ${id}`);
  } catch (error) {
    errors.push(`PNG unavailable: ${id}: ${error.message}`);
  }
}
const document = data.notices.find((n) => n.id === 'notice-2026-09-17-infection-guide')?.document;
if (!document || document.pages.length !== infectionGuideSource.pageCount) {
  errors.push(
    'INF-02~06: Accepted 16-page KDCA prevention guide and matching PDF are not registered',
  );
} else {
  try {
    const pdf = await fs.readFile(`public${document.pdf}`);
    if (
      pdf.subarray(0, 5).toString() !== '%PDF-' ||
      sha256(pdf) !== infectionGuideSource.sha256 ||
      pdf.length !== infectionGuideSource.bytes
    )
      errors.push('Infection guide PDF integrity failed');
    for (const figure of document.pages) {
      const asset = data.assets.find((a) => a.id === figure.assetId);
      const bytes = await fs.readFile(`public${asset?.file}`);
      if (sha256(bytes) !== asset?.sha256)
        errors.push(`Infection guide page integrity: ${figure.page}`);
    }
  } catch (error) {
    errors.push(`Infection guide file unavailable: ${error.message}`);
  }
}
const report = {
  checkedAt: new Date().toISOString(),
  redrawnPngCount: ids.filter((id) => data.assets.some((a) => a.id === id && a.generatedOriginal))
    .length,
  infectionGuidePages: document?.pages.length ?? 0,
  infectionGuideSource: document
    ? { pdf: document.pdf, sha256: document.sha256, pageCount: document.pageCount }
    : null,
  acceptanceRecord: 'docs/plan-content-checklist-2026-09-29/infection-resolution.ko.md',
  errors,
};
await fs.mkdir('reports', { recursive: true });
await fs.writeFile('reports/plan-content-completion.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exitCode = errors.length ? 1 : 0;
