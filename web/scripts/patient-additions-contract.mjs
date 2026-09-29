import { z } from 'zod';
import crypto from 'node:crypto';
import { publicTextErrors } from './public-content-policy.mjs';
import { resolvePages } from '../src/lib/content-model.mjs';
import { noticePage } from '../src/lib/notice-page.mjs';
import { infectionGuideSource } from './infection-guide-source.mjs';
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
    path: z.string().regex(/^\/notices\/[a-z0-9-]+\/$/),
    number: z.number().int().positive(),
    postedAt: date,
    updatedAt: date,
    category: z.enum(['예방접종', '지역 지원사업', '감염병 예방']),
    tags: z.array(z.string().min(1)).min(1),
    pinned: z.boolean(),
    views: z.number().int().nonnegative().nullable(),
    sourcePublishedAt: date.nullable(),
    sourceReviewedAt: date.optional(),
    checkedAt: date,
    startDate: date.nullable(),
    endDate: date.nullable(),
    kind: z.enum(['program', 'reference']),
    summary: text,
    paragraphs: z.array(text).min(1),
    availability: text,
    sources: z.array(z.object({ label: text, url: https }).strict()).min(1),
    schedule: z
      .object({
        caption: text,
        columns: z.array(z.string().min(1)).length(4),
        rows: z.array(z.array(z.string().min(1)).length(4)).min(1),
      })
      .strict()
      .optional(),
    document: z
      .object({
        title: text,
        pdf: z.string().regex(/^\/assets\/notice-documents\/[a-z0-9-]+\.pdf$/),
        sha256: z.string().regex(/^[a-f0-9]{64}$/),
        bytes: z.number().int().positive(),
        pageCount: z.number().int().positive(),
        sourceUrl: https,
        sourcePdfUrl: https,
        publicationNote: text,
        license: z.object({ label: text, url: https }).strict(),
        pages: z
          .array(z.object({ assetId: id, page: z.number().int().positive(), alt: text }).strict())
          .min(1),
      })
      .strict()
      .optional(),
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
export function validatePatientAdditions(
  { pages, assets, visuals, notices, clinic },
  now = new Date(),
) {
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
  unique(notices, 'path', 'notices');
  unique(notices, 'number', 'notices');
  for (const page of pages.filter((p) => p.template === 'notice-guide')) {
    if (!notices.some((n) => n.id === page.id && n.path === page.path))
      errors.push(`Unregistered notice guide: ${page.id}`);
  }
  for (const v of [...visuals.banners, ...visuals.diagrams]) {
    if (!pages.some((p) => p.id === v.pageId)) errors.push(`Visual target missing: ${v.pageId}`);
    const asset = assets.find((a) => a.id === v.assetId);
    if (!asset) errors.push(`Visual asset missing: ${v.assetId}`);
    if (
      'steps' in v &&
      (asset?.guidanceSha256 ?? asset?.sourceSha256) !==
        crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex')
    )
      errors.push(`Diagram guidance is stale: ${v.id}`);
  }
  const redrawnIds = [
    ...visuals.banners.map((v) => v.assetId),
    ...visuals.diagrams.map((v) => v.assetId),
    'vaccination-schedule-2026',
  ];
  if (redrawnIds.length !== 17 || new Set(redrawnIds).size !== 17)
    errors.push('Exactly 17 distinct redrawn patient visuals are required');
  for (const id of redrawnIds) {
    const asset = assets.find((a) => a.id === id);
    if (
      !asset?.generatedOriginal ||
      asset.file !== `/assets/clinic-visuals-hq/${id}-hq-original.png`
    )
      errors.push(`Native redrawn PNG required: ${id}`);
  }
  const schedule = pages
    .find((p) => p.id === 'vaccinations')
    ?.blocks.find((b) => b.id === 'vaccination-schedule');
  const scheduleAsset = assets.find((a) => a.id === 'vaccination-schedule-2026');
  if (
    !schedule?.table ||
    scheduleAsset?.guidanceSha256 !==
      crypto.createHash('sha256').update(JSON.stringify(schedule.table)).digest('hex')
  )
    errors.push('Vaccination schedule image guidance is stale');
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const noticeIndex = pages.find((p) => p.id === 'notices');
  for (const n of notices) {
    const page = pages.find((p) => p.id === n.id);
    const expected = clinic ? resolvePages([noticePage(n)], clinic)[0] : noticePage(n);
    if (
      !page ||
      [
        'id',
        'path',
        'title',
        'metaTitle',
        'description',
        'intro',
        'blocks',
        'sources',
        'template',
      ].some((key) => JSON.stringify(page[key]) !== JSON.stringify(expected[key]))
    )
      errors.push(`Notice article differs from catalog: ${n.id}`);
    if (n.postedAt > today || n.updatedAt > today)
      errors.push(`Notice publication date in future: ${n.id}`);
    if (n.document) {
      if (n.document.pages.length !== n.document.pageCount)
        errors.push(`Notice document.pages count differs from source: ${n.id}`);
      for (const [i, figure] of n.document.pages.entries()) {
        const asset = assets.find((a) => a.id === figure.assetId);
        if (figure.page !== i + 1 || !asset)
          errors.push(`Notice original page missing or unordered: ${n.id}:${i + 1}`);
        if (
          asset?.imageKind !== 'document-page' ||
          asset?.sourceDocument?.pdf !== n.document.pdf ||
          asset?.sourceDocument?.page !== figure.page ||
          asset?.sourceSha256 !== n.document.sha256
        )
          errors.push(`Notice page source differs from PDF: ${n.id}:${i + 1}`);
      }
      unique(n.document.pages, 'assetId', 'notice document pages');
    }
    if (n.id === infectionGuideSource.noticeId) {
      for (const key of ['pageCount', 'pdf', 'sha256', 'bytes', 'sourceUrl', 'sourcePdfUrl'])
        if (n.document?.[key] !== infectionGuideSource[key])
          errors.push(`Infection guide must use the accepted 16-page source: ${key}`);
      for (const figure of n.document?.pages ?? []) {
        const asset = assets.find((a) => a.id === figure.assetId);
        if (
          asset?.width !== infectionGuideSource.width ||
          asset?.height !== infectionGuideSource.height ||
          asset?.sourceDocument?.dpi !== infectionGuideSource.renderDpi
        )
          errors.push(`Infection guide requires a complete 200 dpi page: ${figure.page}`);
      }
    }
    if (
      n.checkedAt > today ||
      (n.sourcePublishedAt && n.sourcePublishedAt > today) ||
      (n.sourceReviewedAt && n.sourceReviewedAt > today)
    )
      errors.push(`Notice date in future: ${n.id}`);
    if (n.endDate && (!n.startDate || n.endDate < n.startDate))
      errors.push(`Notice period invalid: ${n.id}`);
    if (noticeIndex?.blocks.some((b) => b.id === n.id))
      errors.push(`Notice anchor collision: ${n.id}`);
    if (n.kind === 'reference' && (n.startDate || n.endDate))
      errors.push(`Reference must not imply an active program: ${n.id}`);
    if (/TODO|Lorem ipsum|완치 보장|무조건 안전|검수 대기|배포 완료/.test(JSON.stringify(n)))
      errors.push(`Unsupported public notice copy: ${n.id}`);
  }
  return errors;
}
