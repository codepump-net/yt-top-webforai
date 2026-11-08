import { expect, it } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import { createStructuredData } from '../../src/lib/structured-data.mjs';
const data = await loadContent();
const graphFor = (id, base = '/hospital', overrides = {}) => {
  const page = { ...data.pages.find((p) => p.id === id), ...overrides };
  return createStructuredData({
    ...data,
    page,
    absolute: (p) => 'https://example.org' + base + p,
    breadcrumbs: page.id === 'home' ? [page] : [data.pages[0], page],
    review: undefined,
  })['@graph'];
};
it('emits recorded modification datetimes with timezones on every page and article', () => {
  for (const page of data.pages.filter((p) => p.id !== 'not-found')) {
    expect(page.modifiedAt, page.id).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
    );
    const nodes = graphFor(page.id).filter(
      (node) => node['@id'].endsWith('#webpage') || node['@type'] === 'Article',
    );
    expect(nodes.length, page.id).toBeGreaterThan(0);
    for (const node of nodes) {
      expect(node.dateModified, page.id).toBe(page.modifiedAt);
      expect(node.datePublished, page.id).toBeUndefined();
    }
  }
});
it('preserves known publication and modification timestamps and their offsets', () => {
  const dates = {
    modifiedAt: '2026-09-11T09:30:00+09:00',
    publishedAt: '2026-09-10T17:15:00Z',
  };
  const graph = graphFor('colonoscopy-preparation', '/hospital', dates);
  for (const node of graph.filter((n) => n.dateModified)) {
    expect(node.dateModified).toBe(dates.modifiedAt);
    expect(node.datePublished).toBe(dates.publishedAt);
  }
});
it('omits unknown modification times instead of converting a date into a made-up time', () => {
  const graph = graphFor('colonoscopy-preparation', '/hospital', { modifiedAt: undefined });
  expect(graph.some((node) => 'dateModified' in node)).toBe(false);
});
it('keeps one hospital identity across article, service and staff graphs', () => {
  for (const p of data.pages.filter((p) => p.id !== 'not-found')) {
    const graph = graphFor(p.id);
    const clinic = graph.find((n) => n['@type'] === 'MedicalClinic');
    expect(clinic['@id']).toBe('https://yttop.co.kr/#clinic');
    expect(clinic.url).toBe('https://yttop.co.kr/');
    expect(new Set(graph.map((n) => n['@id'])).size).toBe(graph.length);
    expect(graph.some((n) => n.reviewedBy || n.author || n.lastReviewed)).toBe(false);
  }
});
it('describes real tests as medical services and keeps general guidance as articles', () => {
  const echo = graphFor('echocardiography');
  expect(echo.find((n) => n['@type'] === 'MedicalClinic').availableService).toEqual({
    '@id': 'https://example.org/hospital/services/heart/echocardiography/#medical-service',
  });
  expect(echo.some((n) => n['@type'] === 'ImagingTest')).toBe(true);
  expect(echo.some((n) => n['@type'] === 'Service')).toBe(true);
  const guide = graphFor('colonoscopy-preparation');
  expect(guide.some((n) => n['@type'] === 'Article')).toBe(true);
  expect(guide.some((n) => n['@type'] === 'MedicalProcedure')).toBe(false);
});
it('never turns a silhouette into a physician portrait or invents credentials', () => {
  const doctor = graphFor('doctor-park-rayoung').find((n) => n['@type'] === 'Person');
  expect(doctor.image).toBeUndefined();
  const p = data.physicians.find((p) => p.id === 'park-rayoung');
  expect(doctor.hasCredential.map((c) => c.name)).toEqual([p.specialty, ...p.credentials]);
  expect(doctor.worksFor['@id']).toBe('https://yttop.co.kr/#clinic');
});
it.each(['', '/hospital'])(
  'excludes external case originals from the graph and preserves functional search URLs under %s',
  (base) => {
    const graph = graphFor('cases', base);
    const list = graph.find((n) => n['@type'] === 'ItemList');
    expect(list).toBeUndefined();
    for (const item of data.caseLinks) expect(JSON.stringify(graph)).not.toContain(item.url);
    expect(graph.find((n) => n['@type'] === 'WebSite').potentialAction.target.urlTemplate).toBe(
      `https://example.org${base}/search/?q={search_term_string}`,
    );
  },
);
