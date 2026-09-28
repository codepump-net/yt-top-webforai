import { expect, it } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import { validatePatientAdditions } from '../../scripts/patient-additions-contract.mjs';
import { noticeState, recentNotices, koreaDate } from '../../src/lib/notice-model.mjs';
import { hubIds, siteMapGroups } from '../../src/lib/information-architecture.mjs';
import { searchItems } from '../../src/lib/search-model.mjs';
import { childPages } from '../../src/lib/structured-data.mjs';
import { articleGuidance } from '../../src/lib/article-guidance.mjs';
const data = await loadContent();
const newSymptoms = data.pages.filter((p) => p.path.startsWith('/symptoms/cardio/'));
it('exposes all 20 symptom guides consistently without replacing disease or follow-up articles', () => {
  expect(newSymptoms).toHaveLength(20);
  expect(data.pages.filter((p) => p.path.startsWith('/diseases/cardio/'))).toHaveLength(20);
  const hub = data.pages.find((p) => p.id === 'symptoms');
  for (const p of newSymptoms) {
    expect(hubIds('symptoms')).toContain(p.id);
    expect(childPages(hub, data.pages).map((p) => p.id)).toContain(p.id);
    expect(
      siteMapGroups(data.pages)
        .flatMap((g) => g.pages)
        .map((p) => p.id),
    ).toContain(p.id);
    expect(searchItems([p])[0].category).toBe('증상');
    expect(searchItems([p])[0].aliases.length).toBeGreaterThan(0);
    expect(articleGuidance(p)).toMatchObject({ medical: true, heart: true });
    expect(p.publishedAt).toBeNull();
    expect(p.reviewStatus).toBe('pending');
    expect(p.sources.every((s) => s.checkedAt)).toBe(true);
    expect(p.related.some((id) => data.pages.find((t) => t.id === id).related.includes(p.id))).toBe(
      true,
    );
  }
  expect(data.pages.find((p) => p.id === 'palpitations-followup').related).toContain(
    'symptom-cardio-recurrent-palpitations-normal-ecg',
  );
  expect(data.pages.find((p) => p.id === 'heart-valve-regurgitation').related).toContain(
    'symptom-cardio-valve-regurgitation-follow-up',
  );
});
it('validates visuals and notices and catches stale diagram text, unknown pages and false dates', () => {
  expect(validatePatientAdditions(data)).toEqual([]);
  expect(data.visuals.banners).toHaveLength(12);
  expect(data.visuals.diagrams).toHaveLength(4);
  const copy = structuredClone(data);
  copy.visuals.diagrams[0].steps[0].text += ' changed';
  copy.visuals.banners[0].pageId = 'missing-page';
  copy.notices[0].checkedAt = '2099-01-01';
  expect(validatePatientAdditions(copy).join('\n')).toMatch(/stale/);
  expect(validatePatientAdditions(copy).join('\n')).toMatch(/target missing/);
  expect(validatePatientAdditions(copy).join('\n')).toMatch(/date in future/);
});
it('keeps date-specific programs separate from historical data and archives by Korean date', () => {
  expect(data.pages.find((p) => p.id === 'notices')).toMatchObject({
    risk: 'medical',
    reviewStatus: 'pending',
  });
  const flu = data.notices.find((n) => n.id === 'notice-2026-2027-national-influenza');
  expect(noticeState(flu, '2026-09-20')).toBe('upcoming');
  expect(noticeState(flu, '2026-09-21')).toBe('period');
  expect(noticeState(flu, '2027-04-30')).toBe('period');
  expect(noticeState(flu, '2027-05-01')).toBe('ended');
  expect(koreaDate(new Date('2027-04-30T15:00:00Z'))).toBe('2027-05-01');
  expect(recentNotices(data.notices, '2027-05-01')).not.toContain(flu);
  const historical = data.notices.find((n) => n.kind === 'reference');
  expect(noticeState(historical, '2027-05-01')).toBe('reference');
  expect(historical.attachment.publishedAt).toBe('2026-09-17');
  expect(historical.attachment.url).toMatch(/^https:\/\/www.phwr.org\//);
  for (const id of [
    'notice-2026-suwon-shingles-support',
    'notice-2026-gyeonggi-student-influenza',
  ]) {
    const availability = data.notices.find((n) => n.id === id).availability;
    expect(availability).toContain('참여 여부');
    expect(availability).toContain(data.clinic.phone);
    expect(availability).not.toMatch(/본원에서.*(?:가능합니다|받을 수 있습니다)/);
  }
});
