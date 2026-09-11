import { z } from 'zod';
import crypto from 'node:crypto';
import { validatePatientScope } from './public-content-policy.mjs';
export const sha256 = (value) =>
  crypto
    .createHash('sha256')
    .update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value))
    .digest('hex');
const source = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  title: z.string().min(3),
  url: z.url().refine((s) => s.startsWith('https://'), 'HTTPS source required'),
  kind: z.enum(['clinic', 'medical']).optional(),
  checkedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});
const anchor = z.string().regex(/^[a-z][a-z0-9-]*$/);
const refs = z.array(z.string()).optional();
const links = z
  .array(
    z.object({ pageId: z.string(), anchor: anchor.optional(), label: z.string().min(3) }).strict(),
  )
  .optional();
const table = z
  .object({
    caption: z.string().min(3),
    columns: z.array(z.string().min(1)).min(2),
    rows: z.array(z.array(z.string().min(1))).min(1),
  })
  .strict()
  .refine((t) => t.rows.every((r) => r.length === t.columns.length), 'Table column mismatch');
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v);
export const pageSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    path: z.string().regex(/^\/(?:[a-z0-9-]+\/)*$|^\/404\.html$/),
    title: z.string().min(3),
    metaTitle: z.string().min(8),
    description: z.string().min(20).max(260),
    template: z.string().min(3),
    category: z.string().min(2),
    intro: z.string().min(20),
    blocks: z.array(
      z
        .object({
          id: anchor.optional(),
          heading: z.string().min(2),
          text: z.string().min(20),
          sourceIds: refs,
          links,
          table: table.optional(),
        })
        .strict(),
    ),
    questions: z
      .array(
        z
          .object({
            id: anchor.optional(),
            question: z.string().min(8),
            answer: z.string().min(20),
            sourceIds: refs,
            links,
          })
          .strict(),
      )
      .max(8),
    related: z.array(z.string()),
    sources: z.array(source),
    image: z.string().nullable(),
    risk: z.enum(['operational', 'medical', 'urgent_context_review']),
    publishedAt: z.string().datetime({ offset: true }).nullable(),
    updatedAt: date,
    indexable: z.boolean(),
    reviewStatus: z.enum(['pending', 'approved']),
    contentKind: z.enum(['sanitized-case-summary', 'original-editorial-summary']),
  })
  .strict();
export function pageDigest(page, context) {
  return sha256({ page, context });
}
// A publisher's confirmation of completed reviews is release evidence, not a
// named clinician's byline. Keep it internal and bind it to the entire release.
export function publicationDigest(
  pages,
  { clinic, physicians, assets, rendererDigest, caseLinks, pageIntents },
) {
  const { operationsReview, ...facts } = clinic;
  void operationsReview;
  return sha256({
    pages,
    clinic: facts,
    physicians,
    assets,
    rendererDigest,
    caseLinks,
    pageIntents,
  });
}
function validatePublicationApproval(approval, pages, context, now) {
  const schema = z
    .object({
      version: z.literal(1),
      kind: z.literal('user-confirmed-publication'),
      status: z.literal('approved'),
      recordedAt: z.iso.datetime({ offset: true }),
      expiresAt: z.iso.datetime({ offset: true }),
      pageIds: z.array(z.string()).min(1),
      attestation: z
        .object({
          medicalReviewCompleted: z.literal(true),
          operationsReviewCompleted: z.literal(true),
          publicationAuthorized: z.literal(true),
        })
        .strict(),
      evidence: z
        .object({
          kind: z.literal('user-message'),
          statement: z.string().min(30),
        })
        .strict(),
      digest: z.string().regex(/^[a-f0-9]{64}$/),
    })
    .strict();
  if (!schema.safeParse(approval).success) return ['Invalid publication confirmation evidence'];
  const errors = [];
  const expected = pages
    .filter((p) => p.indexable)
    .map((p) => p.id)
    .sort();
  if (JSON.stringify([...approval.pageIds].sort()) !== JSON.stringify(expected))
    errors.push('Publication confirmation scope differs from indexable pages');
  if (pages.some((p) => p.indexable && p.reviewStatus !== 'approved'))
    errors.push('Publication confirmation requires approved content status');
  if (approval.digest !== publicationDigest(pages, context))
    errors.push('Stale publication confirmation: content, facts, or renderer changed');
  const recorded = new Date(approval.recordedAt),
    expires = new Date(approval.expiresAt);
  if (
    recorded > now ||
    expires <= now ||
    expires <= recorded ||
    expires - recorded > 366 * 86400000
  )
    errors.push('Publication confirmation period invalid or expired');
  return errors;
}
export function validateContent(
  pages,
  {
    mode = 'review',
    reviews = [],
    clinic,
    physicians,
    assets,
    rendererDigest,
    caseLinks,
    pageIntents,
    publicationApproval,
    now = new Date(),
  },
) {
  const errors = [];
  const parsed = z.array(pageSchema).safeParse(pages);
  if (!parsed.success) return parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
  errors.push(...validatePatientScope(pages, { caseLinks, pageIntents, clinic, physicians }));
  if (!['review', 'production'].includes(mode)) errors.push('Unknown build mode');
  for (const field of ['id', 'path', 'metaTitle', 'description']) {
    const all = pages.map((p) => p[field]);
    if (new Set(all).size !== all.length) errors.push(`Duplicate ${field}`);
  }
  const ids = new Set(pages.map((p) => p.id));
  for (const page of pages) {
    const sourceIds = page.sources.map((s) => s.id).filter(Boolean);
    if (new Set(sourceIds).size !== sourceIds.length)
      errors.push(`${page.id}: duplicate source ID`);
    const anchors = [...page.blocks, ...page.questions].map((b) => b.id).filter(Boolean);
    if (
      new Set(anchors).size !== anchors.length ||
      anchors.some((a) => ['questions', 'related'].includes(a))
    )
      errors.push(`${page.id}: duplicate or reserved anchor`);
    for (const item of [...page.blocks, ...page.questions]) {
      for (const ref of item.sourceIds ?? [])
        if (!sourceIds.includes(ref)) errors.push(`${page.id}: unknown source ${ref}`);
      for (const link of item.links ?? []) {
        const target = pages.find((p) => p.id === link.pageId);
        if (
          !target ||
          (link.anchor &&
            ![...target.blocks, ...target.questions].some((b) => b.id === link.anchor))
        )
          errors.push(`${page.id}: invalid contextual link ${link.pageId}#${link.anchor ?? ''}`);
      }
    }
    for (const s of page.sources)
      if (
        s.kind === 'medical' &&
        /(?:hidoc\.co\.kr|doctornow\.co\.kr|kin\.naver\.com)/.test(new URL(s.url).hostname)
      )
        errors.push(`${page.id}: question-discovery source is not clinical evidence`);
    if (page.id !== 'not-found' && page.sources.length === 0)
      errors.push(`${page.id}: source required`);
    for (const id of page.related)
      if (!ids.has(id) || id === page.id) errors.push(`${page.id}: invalid related ${id}`);
    if (
      /detail/.test(page.template) &&
      !page.template.startsWith('physician') &&
      page.blocks.length < 2
    )
      errors.push(`${page.id}: incomplete article`);
    if (new Set(page.questions.map((q) => q.question)).size !== page.questions.length)
      errors.push(`${page.id}: duplicate question`);
    if (page.image && !assets.some((a) => a.id === page.image))
      errors.push(`${page.id}: missing image`);
    if (new Date(page.updatedAt + 'T00:00:00+09:00') > now)
      errors.push(`${page.id}: future modified date`);
    if (page.publishedAt && new Date(page.publishedAt) > now)
      errors.push(`${page.id}: future publication`);
    if (page.contentKind === 'sanitized-case-summary' && page.image)
      errors.push(`${page.id}: case images need a separate consent workflow`);
    const copy = JSON.stringify([page.intro, page.blocks, page.questions]);
    if (/TODO|Lorem ipsum|관련 안내를 확인하세요|확인하나요\?\?/.test(copy))
      errors.push(`${page.id}: placeholder content`);
    if (/100%|완치 보장|무조건 안전|부작용 없/.test(copy))
      errors.push(`${page.id}: unsupported guarantee`);
  }
  if (!clinic?.phone || !clinic?.address || physicians.length !== 2)
    errors.push('Missing clinic identity or physician records');
  if (mode === 'production' && publicationApproval != null) {
    errors.push(
      ...validatePublicationApproval(
        publicationApproval,
        pages,
        { clinic, physicians, assets, rendererDigest, caseLinks, pageIntents },
        now,
      ),
    );
  } else if (mode === 'production') {
    const context = { clinic, physicians, assets, rendererDigest };
    const approvalSchema = z
      .object({
        pageId: z.string(),
        status: z.literal('approved'),
        reviewer: z.string().min(2),
        reviewerId: z.string().optional(),
        role: z.enum(['medical', 'operations']),
        reviewedAt: z.iso.datetime({ offset: true }),
        expiresAt: z.iso.datetime({ offset: true }),
        evidence: z.string().min(10),
        digest: z.string().regex(/^[a-f0-9]{64}$/),
      })
      .strict();
    for (const page of pages.filter((p) => p.indexable)) {
      const review = reviews.find((r) => r.pageId === page.id);
      const approval = approvalSchema.safeParse(review);
      if (!approval.success || page.reviewStatus !== 'approved') {
        errors.push(`${page.id}: approved content and a real review record required`);
        continue;
      }
      if (review.digest !== pageDigest(page, context))
        errors.push(`${page.id}: stale review digest`);
      if (
        new Date(review.reviewedAt) > now ||
        new Date(review.expiresAt) <= now ||
        new Date(review.reviewedAt) >= new Date(review.expiresAt)
      )
        errors.push(`${page.id}: expired or invalid review period`);
      if (page.risk !== 'operational' && review.role !== 'medical')
        errors.push(`${page.id}: medical reviewer required`);
      if (
        review.role === 'medical' &&
        !physicians.some((p) => p.id === review.reviewerId && p.name === review.reviewer)
      )
        errors.push(`${page.id}: medical reviewer profile and name must match`);
      if (/example|placeholder|테스트|예시|미정/i.test(review.reviewer + review.evidence))
        errors.push(`${page.id}: example review is not approval`);
    }
    const operationsSchema = z
      .object({
        reviewer: z.string().min(2),
        evidence: z.string().min(10),
        reviewedAt: z.iso.datetime({ offset: true }),
        expiresAt: z.iso.datetime({ offset: true }),
        factsDigest: z.string().regex(/^[a-f0-9]{64}$/),
      })
      .strict();
    const operation = operationsSchema.safeParse(clinic.operationsReview);
    if (!operation.success) errors.push('Clinic operations review required');
    else {
      const { operationsReview, ...facts } = clinic;
      if (operationsReview.factsDigest !== sha256(facts))
        errors.push('Clinic operations facts digest changed');
      if (
        new Date(operationsReview.expiresAt) <= now ||
        new Date(operationsReview.reviewedAt) > now ||
        new Date(operationsReview.reviewedAt) >= new Date(operationsReview.expiresAt)
      )
        errors.push('Clinic operations review period invalid');
    }
  }
  return errors;
}
