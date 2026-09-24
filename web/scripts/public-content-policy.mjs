// Internal publication checks. This module and the intent register are never exported as site content.
const internalCopy = [
  /의료정보\s*작성\s*[·ㆍ/]?\s*검수\s*원칙/u,
  /의료정보\s*작성\s*원칙/u,
  /홈페이지\s*검토본|검토용\s*(사이트|안내)|개발\s*(보고|문서)|조사\s*보고/u,
  /최종\s*(검수|확인)\s*전|운영\s*정보\s*확인\s*전|검수\s*이력|검수\s*절차/u,
  /크롤링|검색\s*빈도|질문\s*빈도|데이터\s*원장|구현\s*계획/u,
  /(?:SEO|AEO|GEO)\s*최적화/iu,
  /원문에\s*없는|이\s*요약에서는|요약에\s*추가하지|이미지는\s*(포함하지|싣지)|목록을\s*싣지/u,
  /content-policy|planned-sitemap|build-manifest|retired-pages/iu,
  /\{\{clinic\.[^}]+\}\}/u,
];

export function publicTextErrors(value, label = 'public content') {
  const text = String(value).normalize('NFKC').replace(/\s+/g, ' ');
  return internalCopy.flatMap((rule) => {
    const match = text.match(rule);
    return match ? [`${label}: internal-only copy (${match[0]})`] : [];
  });
}

export function validatePatientScope(pages, { pageIntents, caseLinks, clinic, physicians }) {
  const errors = [];
  const intents = Array.isArray(pageIntents) ? pageIntents : [];
  if (new Set(intents.map((p) => p.id)).size !== intents.length)
    errors.push('Duplicate patient page intent');
  for (const page of pages) {
    const intent = intents.find((p) => p.id === page.id && p.path === page.path);
    if (!intent || typeof intent.patientNeed !== 'string' || intent.patientNeed.trim().length < 20)
      errors.push(`${page.id}: documented patient need required`);
    if (['case-detail', 'notice-detail'].includes(page.template) || page.id === 'content-policy')
      errors.push(`${page.id}: retired public page; use the original hospital channel`);
    const {
      title,
      metaTitle,
      description,
      intro,
      urgentNotice,
      blocks,
      questions,
      sources,
      path,
      category,
    } = page;
    errors.push(
      ...publicTextErrors(
        JSON.stringify({
          title,
          metaTitle,
          description,
          intro,
          urgentNotice,
          blocks,
          questions,
          sources,
          path,
          category,
        }),
        page.id,
      ),
    );
  }
  if (!Array.isArray(caseLinks)) errors.push('Case link catalog required');
  else {
    const urls = new Set();
    for (const item of caseLinks) {
      errors.push(...publicTextErrors(JSON.stringify(item), 'case link'));
      let url;
      try {
        url = new URL(item.url);
      } catch {
        /* invalid URL reported below */
      }
      if (
        !url ||
        url.origin !== 'https://yttop.co.kr' ||
        url.pathname !== '/21/' ||
        url.searchParams.get('bmode') !== 'view' ||
        !/^\d+$/.test(url.searchParams.get('idx') ?? '')
      )
        errors.push('Case link must point to a hospital case article');
      if (
        !item.title?.trim() ||
        !item.description?.trim() ||
        !item.category?.trim() ||
        urls.has(item.url)
      )
        errors.push('Case link requires unique URL and patient-facing labels');
      urls.add(item.url);
    }
  }
  // Scan only displayed facts; approval evidence belongs exclusively to the internal release gate.
  const { operationsReview, ...facts } = clinic ?? {};
  void operationsReview;
  errors.push(
    ...publicTextErrors(JSON.stringify([facts, physicians]), 'shared clinic information'),
  );
  return errors;
}

export function nonPublicArtifact(file) {
  const name = file.replaceAll('\\', '/');
  return (
    /(?:^|\/)(?:docs|research|reports|harness|content|\.local)(?:\/|$)/.test(name) ||
    /(?:^|\/)(?:build-manifest\.json|planned-sitemap\.xml|retired-pages\.json|page-intents\.json|reviews\.json|publication-approval\.json)$/.test(
      name,
    ) ||
    /(?:^|\/)content-policy(?:\/|$)/.test(name)
  );
}
