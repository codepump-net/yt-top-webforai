import { z } from 'zod';
import crypto from 'node:crypto';
export const sha256 = (value) =>
  crypto
    .createHash('sha256')
    .update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value))
    .digest('hex');
const source = z.object({
  title: z.string().min(3),
  url: z.url().refine((s) => s.startsWith('https://'), 'HTTPS source required'),
});
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
    blocks: z.array(z.object({ heading: z.string().min(2), text: z.string().min(20) })),
    questions: z
      .array(z.object({ question: z.string().min(8), answer: z.string().min(20) }))
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
export function validateContent(
  pages,
  { mode = 'review', reviews = [], clinic, physicians, assets, rendererDigest, now = new Date() },
) {
  const errors = [];
  const parsed = z.array(pageSchema).safeParse(pages);
  if (!parsed.success) return parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
  if (!['review', 'production'].includes(mode)) errors.push('Unknown build mode');
  for (const field of ['id', 'path', 'metaTitle', 'description']) {
    const all = pages.map((p) => p[field]);
    if (new Set(all).size !== all.length) errors.push(`Duplicate ${field}`);
  }
  const ids = new Set(pages.map((p) => p.id));
  for (const page of pages) {
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
  if (mode === 'production') {
    const context = { clinic, physicians, assets, rendererDigest };
    const approvalSchema = z
      .object({
        pageId: z.string(),
        status: z.literal('approved'),
        reviewer: z.string().min(2),
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
