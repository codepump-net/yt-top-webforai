import { expect, it } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import { validateContent } from '../../scripts/content-contract.mjs';
import { createStructuredData } from '../../src/lib/structured-data.mjs';
const data = await loadContent();
const page = (id) => data.pages.find((p) => p.id === id);
it('keeps the previous release evidence stale after a medical content change', () => {
  const errors = validateContent(data.pages, { ...data, mode: 'production' });
  expect(errors).toContain('Stale publication confirmation: content, facts, or renderer changed');
  expect(data.reviews).toEqual([]);
});
it('gives each visa translation the same section scope, real language and clinic identity', () => {
  const original = page('visa-checkup');
  const translations = data.pages.filter((p) => p.translationOf === original.id);
  expect(translations.map((p) => p.language).sort()).toEqual(['en', 'ne', 'ru', 'th', 'zh-Hans']);
  for (const p of translations) {
    expect(p.blocks.map((b) => b.id)).toEqual(original.blocks.map((b) => b.id));
    const graph = createStructuredData({
      ...data,
      page: p,
      absolute: (s) => 'https://example.org' + s,
      breadcrumbs: [p],
    })['@graph'];
    expect(graph.find((n) => n['@id'].endsWith('#webpage')).inLanguage).toBe(p.language);
    expect(graph.find((n) => n['@type'] === 'ContactPoint').availableLanguage).toBe('ko');
  }
});
it('rejects a translation pointed at itself or with mismatched URL language', () => {
  const pages = structuredClone(data.pages);
  const p = pages.find((p) => p.id === 'visa-en');
  p.translationOf = p.id;
  p.language = 'ru';
  const errors = validateContent(pages, data);
  expect(errors.some((e) => e.includes('invalid translation source'))).toBe(true);
  expect(errors.some((e) => e.includes('language and route differ'))).toBe(true);
});
it('retains explicit emergency actions and independently sourced preparation instructions', () => {
  expect(page('fever-during-cancer-treatment').urgentNotice).toMatch(/38.0℃.*기존 치료팀/);
  expect(page('abdominal-pain').urgentNotice).toContain('119');
  const orafang = JSON.stringify(page('orafang-preparation').blocks);
  const plenvu = JSON.stringify(page('plenvu-preparation').blocks);
  expect(orafang).toContain('425mL');
  expect(plenvu).toContain('500mL');
  expect(plenvu).not.toContain('480');
  expect(JSON.stringify(data.pages)).not.toMatch(/약 3개월.{0,15}(소요|걸릴)/);
});
