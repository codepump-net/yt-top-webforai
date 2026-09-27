import { expect, it } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import { validateContent } from '../../scripts/content-contract.mjs';
import { hubIds, siteMapGroups } from '../../src/lib/information-architecture.mjs';
import { childPages, createStructuredData } from '../../src/lib/structured-data.mjs';
import { searchItems, searchablePages, searchCategories } from '../../src/lib/search-model.mjs';
import { articleGuidance } from '../../src/lib/article-guidance.mjs';

const data = await loadContent();
const page = (id) => data.pages.find((p) => p.id === id);
const graph = (id) =>
  createStructuredData({
    ...data,
    page: page(id),
    breadcrumbs: [page(id)],
    absolute: (p) => 'https://example.org' + p,
  })['@graph'];

it('offers eight clinical destinations and 5/3/3 useful subguides with matching structured links', () => {
  expect(hubIds('conditions')).toHaveLength(8);
  expect(page('conditions').blocks).toEqual([]);
  for (const [id, count] of [
    ['digestive-disease', 5],
    ['neck-disease', 3],
    ['kidney-disease', 3],
  ]) {
    const children = childPages(page(id), data.pages);
    expect(children).toHaveLength(count);
    const list = graph(id).find((n) => n['@type'] === 'ItemList');
    expect(list.itemListElement.map((n) => n.item.url)).toEqual(
      children.map((p) => 'https://example.org' + p.path),
    );
    for (const child of children) {
      expect(data.pageIntents.some((p) => p.id === child.id && p.path === child.path)).toBe(true);
      expect(child.sources.length).toBeGreaterThan(0);
    }
  }
  expect(hubIds('digestive-disease')).toContain('liver-disease');
});

it('keeps every cardiovascular article in search and the sitemap while excluding the case directory', () => {
  const items = searchItems(searchablePages(data.pages));
  const sitemap = siteMapGroups(data.pages).flatMap((g) => g.pages);
  expect(searchCategories).toEqual([
    '증상',
    '질환',
    '진료분야',
    '검사·시술',
    '암환자 지지진료',
    '검진·서류',
    '병원안내',
  ]);
  expect(items.every((item) => searchCategories.includes(item.category))).toBe(true);
  for (const p of data.pages.filter((p) => p.path.startsWith('/diseases/cardio/'))) {
    expect(items.find((item) => item.url === p.path)?.category).toBe('질환');
    expect(sitemap.some((item) => item.id === p.id)).toBe(true);
  }
  expect(items.some((item) => item.url === '/cases/')).toBe(false);
  expect(sitemap.some((p) => p.id === 'cases')).toBe(false);
  expect(page('cases').indexable).toBe(false);
  expect(data.caseLinks).toHaveLength(25);
  const changed = structuredClone(data.pages);
  changed.find((p) => p.id === 'cases').indexable = true;
  expect(validateContent(changed, data)).toContain(
    'cases: original-link directory must stay excluded from indexing',
  );
});

it('provides patient aliases without turning blood pressure monitoring into Holter monitoring', () => {
  const items = searchItems(searchablePages(data.pages));
  for (const [id, term] of [
    ['bowel-ultrasound', '맹장염'],
    ['cardio-dyslipidemia', '고지혈증'],
    ['holter', '홀터'],
    ['cancer-support', '케모포트'],
    ['visa-checkup', 'E2'],
    ['ambulatory-blood-pressure', 'CARTBP'],
  ]) {
    expect(items.find((item) => item.url === page(id).path).aliases).toContain(term);
  }
  const bp = page('ambulatory-blood-pressure');
  expect(bp.blocks.find((b) => b.id === 'holter-difference').text).toContain('심전도');
  expect(bp.blocks.find((b) => b.id === 'results').text).toContain('약 1시간');
});

it('binds the vaccination figure to nine readable schedules and preserves pending review', () => {
  const vaccine = page('vaccinations');
  expect(vaccine.blocks[0].id).toBe('vaccination-schedule');
  expect(vaccine.blocks[0].table.rows).toHaveLength(9);
  expect(data.assets.find((a) => a.id === vaccine.image).bytes).toBeLessThanOrEqual(200000);
  expect(vaccine.reviewStatus).toBe('pending');
  expect(data.reviews).toEqual([]);
  expect(articleGuidance(page('fees'))).toMatchObject({
    medical: true,
    documents: true,
    heart: false,
  });
  for (const id of ['kidney-function', 'pancreatic-disease', 'neck-lump', 'vaccinations'])
    expect(articleGuidance(page(id))).toMatchObject({ medical: true, heart: false });
});
