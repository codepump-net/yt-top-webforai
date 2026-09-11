import { describe, it, expect } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import { validateContent, pageDigest, sha256 } from '../../scripts/content-contract.mjs';
import { assetPath, absoluteUrl, normalizeBase, jsonSafe } from '../../src/lib/urls.mjs';
const data = await loadContent();
describe('Content and release contract', () => {
  it('validates all 45 patient-purpose pages', () => {
    expect(data.pages).toHaveLength(45);
    expect(validateContent(data.pages, data)).toEqual([]);
  });
  it('blocks production without real reviews', () => {
    expect(
      validateContent(data.pages, { ...data, mode: 'production' }).some((e) =>
        e.includes('real review'),
      ),
    ).toBe(true);
  });
  it('rejects duplicate canonical paths', () => {
    const pages = structuredClone(data.pages);
    pages[1].path = pages[0].path;
    expect(validateContent(pages, data)).toContain('Duplicate path');
  });
  it('rejects dangling relationships', () => {
    const pages = structuredClone(data.pages);
    pages[0].related.push('absent');
    expect(validateContent(pages, data).some((e) => e.includes('invalid related'))).toBe(true);
  });
  it('rejects future publication dates', () => {
    const pages = structuredClone(data.pages);
    pages[0].publishedAt = '2099-01-01T00:00:00+09:00';
    expect(validateContent(pages, data).some((e) => e.includes('future publication'))).toBe(true);
  });
  it('compares calendar dates in Korean time at the UTC day boundary', () => {
    expect(validateContent(data.pages, { ...data, now: new Date('2026-09-10T16:00:00Z') })).toEqual(
      [],
    );
  });
  it('rejects missing image references', () => {
    const pages = structuredClone(data.pages);
    pages[0].image = 'unknown';
    expect(validateContent(pages, data).some((e) => e.includes('missing image'))).toBe(true);
  });
  it('review digest changes for a clinical edit and shared clinic changes', () => {
    const p = data.pages.find((p) => p.id === 'echocardiography');
    expect(pageDigest(p, data.clinic)).not.toBe(
      pageDigest({ ...p, intro: 'changed' }, data.clinic),
    );
    expect(pageDigest(p, data.clinic)).not.toBe(
      pageDigest(p, { ...data.clinic, phone: 'changed' }),
    );
  });
  it('never approves a stale, expired medical record', () => {
    const pages = structuredClone(data.pages);
    pages.forEach((p) => {
      p.reviewStatus = 'approved';
    });
    const reviews = pages.map((p) => ({
      pageId: p.id,
      status: 'approved',
      reviewer: 'Fixture reviewer',
      role: 'operations',
      reviewedAt: '2025-01-01T00:00:00Z',
      expiresAt: '2025-02-01T00:00:00Z',
      evidence: 'Unit test only, never deployed',
      digest: '0'.repeat(64),
    }));
    const errors = validateContent(pages, { ...data, mode: 'production', reviews });
    expect(errors.some((e) => e.includes('stale review'))).toBe(true);
    expect(errors.some((e) => e.includes('expired'))).toBe(true);
    expect(errors.some((e) => e.includes('medical reviewer'))).toBe(true);
  });
  it('can release a correctly bound review fixture, and rejects a later operations edit', () => {
    // Entirely in memory; never written to content/reviews.json.
    const p = {
      ...structuredClone(data.pages.find((p) => p.id === 'echocardiography')),
      related: [],
      reviewStatus: 'approved',
    };
    for (const item of [...p.blocks, ...p.questions]) item.links = [];
    const { operationsReview: ignored, ...facts } = data.clinic;
    void ignored;
    const clinic = {
      ...facts,
      operationsReview: {
        reviewer: 'Unit operations',
        evidence: 'In-memory unit fixture only',
        reviewedAt: '2026-09-11T00:00:00+09:00',
        expiresAt: '2026-10-11T00:00:00+09:00',
        factsDigest: sha256(facts),
      },
    };
    const context = {
      clinic,
      physicians: data.physicians,
      assets: data.assets,
      rendererDigest: data.rendererDigest,
    };
    const reviews = [
      {
        pageId: p.id,
        status: 'approved',
        reviewer: data.physicians[0].name,
        reviewerId: data.physicians[0].id,
        role: 'medical',
        reviewedAt: '2026-09-11T00:00:00+09:00',
        expiresAt: '2026-10-11T00:00:00+09:00',
        evidence: 'In-memory unit fixture only',
        digest: pageDigest(p, context),
      },
    ];
    const options = {
      ...data,
      ...context,
      reviews,
      mode: 'production',
      now: new Date('2026-09-11T01:00:00+09:00'),
    };
    expect(validateContent([p], options)).toEqual([]);
    clinic.phone = 'changed';
    expect(validateContent([p], options)).toContain('Clinic operations facts digest changed');
  });
});
describe('Root and GitHub project URL safety', () => {
  it.each(['', '/hospital'])('resolves nested routes under %s', (base) => {
    expect(assetPath('/services/heart/', base)).toBe(base + '/services/heart/');
    expect(absoluteUrl('/services/', 'https://example.org', base)).toBe(
      `https://example.org${base}/services/`,
    );
  });
  it('normalizes only trailing base slashes', () => {
    expect(normalizeBase('/hospital/')).toBe('/hospital');
    expect(normalizeBase('/')).toBe('');
  });
  it.each(['//evil.example', '/../secret', '/x\\y'])('rejects unsafe path %s', (p) =>
    expect(() => assetPath(p, '/repo')).toThrow(),
  );
  it('rejects an origin with a path or credentials', () => {
    expect(() => absoluteUrl('/', 'https://example.org/project')).toThrow();
    expect(() => absoluteUrl('/', 'https://user:password@example.org')).toThrow();
  });
  it('escapes JSON-LD script breakout sequences', () => {
    const serialized = jsonSafe({ text: '</script><script>alert(1)</script>' });
    expect(serialized).not.toContain('<');
    expect(JSON.parse(serialized).text).toContain('</script>');
  });
});
