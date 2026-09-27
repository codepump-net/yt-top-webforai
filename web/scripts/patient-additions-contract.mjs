import { z } from 'zod';
import crypto from 'node:crypto';
import { publicTextErrors } from './public-content-policy.mjs';
const date = z.iso.date();
const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
const https = z.url().refine((value) => value.startsWith('https://'));
const text = z.string().min(5);
const visual = z.object({ pageId: id, assetId: id, alt: text });
const diagram = visual
  .extend({
    id,
    title: text,
    caption: text,
    steps: z.array(z.object({ title: text, text }).strict()).min(2),
    note: text,
  })
  .strict();
const visualsSchema = z
  .object({ banners: z.array(visual.strict()), diagrams: z.array(diagram) })
  .strict();
const noticeSchema = z
  .object({
    id,
    title: text,
    sourcePublishedAt: date.nullable(),
    checkedAt: date,
    startDate: date.nullable(),
    endDate: date.nullable(),
    kind: z.enum(['program', 'reference']),
    summary: text,
    paragraphs: z.array(text).min(1),
    availability: text,
    sources: z.array(z.object({ label: text, url: https }).strict()).min(1),
    attachment: z
      .object({
        url: https,
        label: text,
        publishedAt: date,
        bytes: z.number().int().positive(),
        sha256: z.string().regex(/^[a-f0-9]{64}$/),
      })
      .strict()
      .optional(),
  })
  .strict();
export function validatePatientAdditions({ pages, assets, visuals, notices }, now = new Date()) {
  const errors = [];
  if (!visuals || !notices) return ['Patient visuals and notice catalog required'];
  for (const [label, schema, value] of [
    ['visuals', visualsSchema, visuals],
    ['notices', z.array(noticeSchema), notices],
  ]) {
    const result = schema.safeParse(value);
    if (!result.success)
      errors.push(...result.error.issues.map((i) => `${label}.${i.path.join('.')}: ${i.message}`));
  }
  if (errors.length) return errors;
  errors.push(...publicTextErrors(JSON.stringify(notices), 'notice catalog'));
  errors.push(...publicTextErrors(JSON.stringify(visuals), 'patient visuals'));
  const unique = (items, field, label) => {
    if (new Set(items.map((x) => x[field])).size !== items.length)
      errors.push(`${label}: duplicate ${field}`);
  };
  unique(visuals.banners, 'pageId', 'banners');
  unique(visuals.diagrams, 'pageId', 'diagrams');
  unique(notices, 'id', 'notices');
  for (const v of [...visuals.banners, ...visuals.diagrams]) {
    if (!pages.some((p) => p.id === v.pageId)) errors.push(`Visual target missing: ${v.pageId}`);
    const asset = assets.find((a) => a.id === v.assetId);
    if (!asset) errors.push(`Visual asset missing: ${v.assetId}`);
    if (
      'steps' in v &&
      asset?.sourceSha256 !== crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex')
    )
      errors.push(`Diagram image is stale: ${v.id}`);
  }
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const noticePage = pages.find((p) => p.id === 'notices');
  for (const n of notices) {
    if (n.checkedAt > today || (n.sourcePublishedAt && n.sourcePublishedAt > today))
      errors.push(`Notice date in future: ${n.id}`);
    if (n.endDate && (!n.startDate || n.endDate < n.startDate))
      errors.push(`Notice period invalid: ${n.id}`);
    if (noticePage?.blocks.some((b) => b.id === n.id))
      errors.push(`Notice anchor collision: ${n.id}`);
    if (n.kind === 'reference' && (n.startDate || n.endDate))
      errors.push(`Reference must not imply an active program: ${n.id}`);
    if (/TODO|Lorem ipsum|완치 보장|무조건 안전|검수 대기|배포 완료/.test(JSON.stringify(n)))
      errors.push(`Unsupported public notice copy: ${n.id}`);
  }
  return errors;
}
