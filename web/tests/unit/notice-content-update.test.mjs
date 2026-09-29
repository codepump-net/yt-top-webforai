import { expect, it } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import { validateContent } from '../../scripts/content-contract.mjs';
import { noticeListing, noticeViews } from '../../src/lib/notice-model.mjs';
import { searchItems, searchablePages } from '../../src/lib/search-model.mjs';
import { createStructuredData } from '../../src/lib/structured-data.mjs';
import channels from '../../../content/official-channels.json' with { type: 'json' };
const data = await loadContent();

it('searches notice titles and tags with AND matching, filters and clamps pages after filtering', () => {
  expect(
    noticeListing(data.notices, { query: '독감', category: '지역 지원사업', page: 2 }).items.map(
      (n) => n.id,
    ),
  ).toEqual(['notice-2026-gyeonggi-student-influenza']);
  expect(noticeListing(data.notices, { query: '독감 어르신' }).items.map((n) => n.id)).toEqual([
    'notice-2026-2027-national-influenza',
  ]);
  const empty = noticeListing(data.notices, { query: '존재하지않는공지', page: 900 });
  expect(empty).toMatchObject({ items: [], total: 0, currentPage: 1, pageCount: 1 });
});
it('pins the selected seasonal notice and paginates every real notice without loss or duplicates', () => {
  const first = noticeListing(data.notices);
  const second = noticeListing(data.notices, { page: 2 });
  expect(first.items[0].id).toBe('notice-2026-2027-national-influenza');
  expect(first.pageCount).toBe(2);
  const ids = [...first.items, ...second.items].map((n) => n.id);
  expect(new Set(ids).size).toBe(data.notices.length);
  expect(ids.sort()).toEqual(data.notices.map((n) => n.id).sort());
});
it('distinguishes unavailable counts from a recorded zero', () => {
  expect(noticeViews(null)).toBe('—');
  expect(noticeViews(0)).toBe('0');
  expect(noticeViews(1200)).toBe('1,200');
  const invalid = structuredClone(data);
  invalid.notices[0].views = -1;
  expect(validateContent(invalid.pages, invalid).join(' ')).toMatch(/views/);
});
it('keeps source review dates distinct from publication and rejects future review dates', () => {
  const hpv = data.notices.find((n) => n.id === 'notice-2026-hpv-national');
  expect(hpv.sourcePublishedAt).toBeNull();
  expect(hpv.sourceReviewedAt).toBe('2026-04-14');
  const invalid = structuredClone(data);
  invalid.notices.find((n) => n.id === hpv.id).sourceReviewedAt = '2099-01-01';
  expect(validateContent(invalid.pages, invalid)).toContain(`Notice date in future: ${hpv.id}`);
});
it('requires each notice article to agree with its catalog and documented patient route', () => {
  const invalid = structuredClone(data);
  invalid.pages.find((p) => p.id === invalid.notices[0].id).blocks[0].text =
    '이 원고에는 자료와 다른 설명을 넣었습니다. 내용 불일치를 차단해야 합니다.';
  expect(validateContent(invalid.pages, invalid)).toContain(
    `Notice article differs from catalog: ${invalid.notices[0].id}`,
  );
  const unknown = structuredClone(data);
  unknown.pages.find((p) => p.id === 'abdominal-pain').template = 'notice-guide';
  expect(validateContent(unknown.pages, unknown)).toContain(
    'Unregistered notice guide: abdominal-pain',
  );
});
it('keeps six independent notice articles searchable and preserves their official sources', () => {
  const index = searchItems(searchablePages(data.pages));
  for (const notice of data.notices) {
    const page = data.pages.find((p) => p.id === notice.id);
    expect(index.find((p) => p.url === notice.path)).toMatchObject({
      title: notice.title,
      category: '공지사항',
    });
    expect(page.sources.map((s) => s.url)).toEqual(notice.sources.map((s) => s.url));
  }
});
it('merges official channels into the existing clinic identity without duplicate values', () => {
  const absolute = (p) => `https://example.org/preview${p}`;
  const graph = createStructuredData({
    ...data,
    page: data.pages[0],
    absolute,
    breadcrumbs: [data.pages[0]],
  })['@graph'];
  const clinic = graph.find((n) => n['@type'] === 'MedicalClinic');
  expect(clinic['@id']).toBe('https://yttop.co.kr/#clinic');
  expect(clinic.sameAs).toEqual([absolute('/'), ...channels.map((c) => c.url)]);
  expect(new Set(clinic.sameAs).size).toBe(4);
});
it('rejects missing pages even when the claimed page count is reduced to match', () => {
  const invalid = structuredClone(data);
  const document = invalid.notices.find(
    (n) => n.id === 'notice-2026-09-17-infection-guide',
  ).document;
  document.pages.pop();
  expect(validateContent(invalid.pages, invalid).join(' ')).toMatch(/document.pages count/);
  document.pageCount = 15;
  expect(validateContent(invalid.pages, invalid).join(' ')).toMatch(
    /accepted 16-page source: pageCount/,
  );
});
it('rejects reordered, duplicated and mismatched document page sources', () => {
  const invalid = structuredClone(data);
  const document = invalid.notices.find(
    (n) => n.id === 'notice-2026-09-17-infection-guide',
  ).document;
  document.pages.reverse();
  expect(validateContent(invalid.pages, invalid).join(' ')).toMatch(/unordered/);
  document.pages.reverse();
  document.pages[1].assetId = document.pages[0].assetId;
  expect(validateContent(invalid.pages, invalid).join(' ')).toMatch(/duplicate assetId/);
  expect(validateContent(invalid.pages, invalid).join(' ')).toMatch(/page source differs from PDF/);
});
it('rejects replacing the accepted source PDF or removing the original document', () => {
  const invalid = structuredClone(data);
  const notice = invalid.notices.find((n) => n.id === 'notice-2026-09-17-infection-guide');
  notice.document.sha256 = 'a'.repeat(64);
  expect(validateContent(invalid.pages, invalid).join(' ')).toMatch(
    /accepted 16-page source: sha256/,
  );
  delete notice.document;
  expect(validateContent(invalid.pages, invalid).join(' ')).toMatch(/accepted 16-page source/);
});
