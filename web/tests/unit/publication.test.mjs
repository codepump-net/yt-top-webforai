import { expect, it } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import { publicationDigest, validateContent } from '../../scripts/content-contract.mjs';
const data = await loadContent();
function approvedFixture() {
  const context = structuredClone(data);
  context.mode = 'production';
  context.pages.forEach((p) => {
    if (p.indexable) p.reviewStatus = 'approved';
  });
  context.publicationApproval = {
    version: 1,
    kind: 'user-confirmed-publication',
    status: 'approved',
    recordedAt: new Date(Date.now() - 60000).toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    pageIds: context.pages.filter((p) => p.indexable).map((p) => p.id),
    attestation: {
      medicalReviewCompleted: true,
      operationsReviewCompleted: true,
      publicationAuthorized: true,
    },
    evidence: {
      kind: 'user-message',
      statement:
        'In-memory fixture for an explicit user confirmation of completed reviews and publication.',
    },
    digest: publicationDigest(context.pages, context),
  };
  return context;
}
it('accepts the recorded scope while leaving named clinical review records separate', () => {
  const context = approvedFixture();
  expect(context.reviews).toEqual([]);
  expect(validateContent(context.pages, context)).toEqual([]);
});
it.each(['content', 'clinic', 'physician', 'renderer', 'case', 'scope'])(
  'rejects changes to confirmed %s without new evidence',
  (field) => {
    const context = approvedFixture();
    if (field === 'content')
      context.pages.find((p) => p.id === 'echocardiography').intro += ' Changed.';
    if (field === 'clinic') context.clinic.phone = '031-000-0000';
    if (field === 'physician') context.physicians[0].role = 'Changed';
    if (field === 'renderer') context.rendererDigest = '0'.repeat(64);
    if (field === 'case') context.caseLinks[0].description += ' Changed.';
    if (field === 'scope') context.publicationApproval.pageIds.pop();
    expect(
      validateContent(context.pages, context).some((e) =>
        /Stale publication|scope differs/.test(e),
      ),
    ).toBe(true);
  },
);
it.each(['medicalReviewCompleted', 'operationsReviewCompleted', 'publicationAuthorized'])(
  'requires the user confirmation of %s',
  (key) => {
    const context = approvedFixture();
    context.publicationApproval.attestation[key] = false;
    expect(validateContent(context.pages, context)).toContain(
      'Invalid publication confirmation evidence',
    );
  },
);
it('rejects expired, future, and excessive confirmation periods', () => {
  for (const kind of ['expired', 'future', 'excessive']) {
    const context = approvedFixture();
    if (kind === 'expired') context.publicationApproval.expiresAt = '2025-01-01T00:00:00Z';
    if (kind === 'future') context.publicationApproval.recordedAt = '2099-01-01T00:00:00Z';
    if (kind === 'excessive') context.publicationApproval.expiresAt = '2099-01-01T00:00:00Z';
    expect(validateContent(context.pages, context)).toContain(
      'Publication confirmation period invalid or expired',
    );
  }
});
it('does not let malformed evidence fall back to another approval path', () => {
  const context = approvedFixture();
  context.publicationApproval = {};
  expect(validateContent(context.pages, context)).toContain(
    'Invalid publication confirmation evidence',
  );
});
