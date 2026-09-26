import { expect, it } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import {
  hubIds,
  hubGroups,
  sectionId,
  siteMapGroups,
  directoryTerms,
} from '../../src/lib/information-architecture.mjs';
import { articleGuidance, guidanceLabels } from '../../src/lib/article-guidance.mjs';
import { createStructuredData } from '../../src/lib/structured-data.mjs';
const data = await loadContent();
const page = (id) => data.pages.find((p) => p.id === id);
const diseases = data.pages.filter((p) => p.path.startsWith('/diseases/cardio/'));

it('publishes twenty distinct disease drafts with all sixty manuscript answers and existing URL syntax', () => {
  expect(diseases).toHaveLength(20);
  expect(diseases.reduce((n, p) => n + p.questions.length, 0)).toBe(60);
  for (const p of diseases) {
    expect(p.path).toMatch(/^\/diseases\/cardio\/[a-z-]+\/$/);
    expect(p.blocks.map((b) => b.id)).toContain('urgent-signs');
    expect(p.blocks.map((b) => b.id)).toContain('clinic-care');
    expect(p.sources.some((s) => s.kind === 'medical')).toBe(true);
    expect(JSON.stringify(p)).not.toMatch(/내부 인덱스|권장 URL|역류이란|박리이란|최종 검토/);
    expect(p.reviewStatus).toBe('pending');
  }
});
it('keeps clinical hubs out of encyclopedias and discovers every new article under diseases', () => {
  for (const id of ['heart-disease', 'chronic-disease', 'respiratory-infections']) {
    expect(hubIds('symptoms')).not.toContain(id);
    expect(hubIds('diseases')).not.toContain(id);
    expect(hubIds('conditions')).toContain(id);
  }
  expect(hubIds('diseases')).not.toContain('chronic-cough');
  expect(hubIds('diseases')).not.toContain('cancer-treatment-symptoms');
  expect(hubGroups.symptoms.map((g) => g.title)).toEqual([
    '심장·혈관',
    '속쓰림·소화불량·급·만성 복통',
    '간·췌장·담도·쓸개',
    '당뇨·갑상선·고지혈증',
    '호흡기·감염',
    '신장',
    '암 치료 중 증상',
  ]);
  for (const p of diseases) {
    expect(sectionId(p)).toBe('diseases');
    expect(hubIds('diseases')).toContain(p.id);
    expect(directoryTerms(p.id)).toContain('심장혈관');
  }
  const sitemap = siteMapGroups(data.pages).flatMap((g) => g.pages.map((p) => p.id));
  expect(sitemap).toHaveLength(93);
  expect(new Set(sitemap).size).toBe(93);
  for (const groups of Object.values(hubGroups))
    for (const g of groups) for (const id of g.ids) expect(page(id), id).toBeDefined();
});
it('keeps displayed and structured disease directories identical', () => {
  const graph = createStructuredData({
    ...data,
    page: page('diseases'),
    breadcrumbs: [page('diseases')],
    absolute: (s) => 'https://example.org' + s,
  })['@graph'];
  const serialized = JSON.stringify(graph);
  for (const p of diseases) expect(serialized).toContain(p.path);
});
it('applies safety, heart reservation and document notices by subject without putting medical warnings on utility pages', () => {
  for (const p of diseases)
    expect(articleGuidance(p)).toMatchObject({
      enabled: true,
      medical: true,
      heart: true,
      documents: false,
    });
  for (const id of ['doctor-park-jongseol', 'privacy', 'notices', 'search', 'visit'])
    expect(articleGuidance(page(id)).enabled).toBe(false);
  for (const id of [
    'national-checkup',
    'visa-checkup',
    'visa-en',
    'civil-service',
    'tuberculosis-screening',
  ])
    expect(articleGuidance(page(id))).toMatchObject({
      medical: true,
      heart: false,
      documents: true,
    });
  for (const p of data.pages.filter((p) => p.translationOf)) {
    expect(articleGuidance(p).clinic).toBe(false);
    expect(guidanceLabels[p.language].safety).toContain('119');
    expect(guidanceLabels[p.language].documents.length).toBeGreaterThan(30);
  }
});
it('distinguishes immediate troponin from next-day tests and keeps emergency escalation prominent', () => {
  const rows = page('cardiac-markers').blocks.find((b) => b.table).table.rows;
  expect(rows.map((r) => r[0])).toEqual([
    'Troponin I',
    'CK-MB',
    'Troponin T',
    'CPK',
    'D-dimer',
    'NT-proBNP',
  ]);
  expect(rows[0][2]).toContain('20분');
  for (const row of rows.slice(1)) expect(row[2]).toContain('다음 날');
  const exam = JSON.stringify(page('examinations').blocks);
  expect(exam).toMatch(/CART BP Pro/);
  expect(exam).toMatch(/24시간/);
  expect(exam).toMatch(/반납.*1시간/);
  expect(JSON.stringify(data.pages)).not.toMatch(/BNP 계열 검사는 외부검사/);
  for (const id of [
    'cardio-acute-myocardial-infarction',
    'cardio-deep-vein-thrombosis',
    'cardio-aortic-aneurysm-dissection',
  ])
    expect(page(id).urgentNotice).toContain('119');
});
