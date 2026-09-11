import { describe, it, expect } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import { validateContent } from '../../scripts/content-contract.mjs';
import { publicTextErrors, nonPublicArtifact } from '../../scripts/public-content-policy.mjs';
const data = await loadContent();

describe('Patient-facing publication boundary', () => {
  it.each(['title', 'metaTitle', 'description', 'intro', 'blocks', 'questions', 'sources'])(
    'rejects internal reporting text in %s',
    (field) => {
      const pages = structuredClone(data.pages);
      const p = pages.find((p) => p.id === 'echocardiography');
      const copy =
        '기존 자료를 바탕으로 작성한 검토용 안내입니다. 홈페이지 제작 과정을 정리합니다.';
      if (field === 'blocks') p.blocks[0].text = copy;
      else if (field === 'questions') p.questions[0].answer = copy;
      else if (field === 'sources') p.sources[0].title = copy;
      else p[field] = copy;
      expect(validateContent(pages, data).some((e) => e.includes('internal-only copy'))).toBe(true);
    },
  );
  it('requires a documented patient need for a new page even with valid metadata', () => {
    const pages = structuredClone(data.pages);
    const p = structuredClone(pages[0]);
    Object.assign(p, {
      id: 'new-topic',
      path: '/new-topic/',
      title: '새로운 안내',
      metaTitle: '새로운 안내 | 영통탑내과',
      description: '새로운 내용을 충분히 설명하는 홈페이지 안내 문구입니다.',
    });
    pages.push(p);
    expect(validateContent(pages, data)).toContain('new-topic: documented patient need required');
  });
  it('rejects internal copy or unrelated destinations in the case link catalog', () => {
    const context = structuredClone(data);
    context.caseLinks[0].description = '원문에 없는 결과는 이 요약에서는 다루지 않습니다.';
    context.caseLinks[0].url = 'https://example.org/';
    const errors = validateContent(context.pages, context);
    expect(errors.some((e) => e.includes('internal-only copy'))).toBe(true);
    expect(errors).toContain('Case link must point to a hospital case article');
  });
  it('keeps clinical limitations and real review attribution eligible', () => {
    expect(
      publicTextErrors(
        '검사 결과는 의료진과 상담해 주세요. 의료 검토: 담당 의료진. 치료 계획에 따라 다른 검사를 검토합니다.',
      ),
    ).toEqual([]);
  });
  it('blocks internal files while permitting patient routes and crawler files', () => {
    for (const file of [
      'reports/audit.json',
      'docs/report.html',
      'content/reviews.json',
      'publication-approval.json',
      'content-policy/index.html',
      'build-manifest.json',
      'planned-sitemap.xml',
    ])
      expect(nonPublicArtifact(file), file).toBe(true);
    for (const file of [
      'services/heart/index.html',
      'sitemap.xml',
      'robots.txt',
      'llms.txt',
      'assets/clinic.webp',
    ])
      expect(nonPublicArtifact(file), file).toBe(false);
  });
});
