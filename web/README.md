# 영통탑내과 정적 웹 앱

Node.js 24, Next.js 16.3.8, React 19.3.0, TypeScript, Tailwind CSS 4.3.3. The lockfile pins the dependency tree.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run serve
```

For the public domain, set `SITE_ORIGIN=https://yttop.kr` and `SITE_BASE_PATH=/` **before building**. `npm run build` produces a local noindex review site. `npm run build:release` requires HTTPS and current publication evidence: either individual review records or a truthful user confirmation of completed medical/operational review and publication, bound to the current content and renderer.

The public deployment workflow builds `main` in production mode and PRs in review mode. The legacy `PUBLICATION_MODE` variable no longer selects the public deployment mode. Production validation remains mandatory; a pending or stale review cannot be fixed by changing the workflow. Review output must not replace the public domain. See the [2026-10-15 diagnosis](../docs/seo-indexing-review-2026-10-15/README.ko.md) for the previous site-wide noindex state.

Validation: `npm run lint`, `npm run typecheck` (after the first build), `npm test`, `npm run harness-check`, `npm run test:e2e`, `npm run test:performance`. Linux needs `npx playwright install --with-deps chromium`; Windows uses installed Edge. Reports are generated locally and uploaded by CI.

No API server or secret is needed. Images are already optimized and committed; raw research and the one-time import step are not required in CI.

The app is a patient-facing hospital website operated alongside `yttop.co.kr`. Follow [the patient-content policy](../docs/patient-content-policy.ko.md) before adding pages or public copy. Current development scope: 135 routes, of which 132 are intended for indexing when publication validation passes. Internal search, the case directory and the error page remain noindex. The 25 case links lead to the original hospital articles and are excluded from search and sitemaps. Announcements retain the existing board, alongside six original patient guides under `/notices/`.

Only `out/` is deployed. `reports/build-manifest.json` and `reports/planned-sitemap.xml` are internal build evidence. The preview server reads the manifest from `reports/`; `verify:live` also needs the matching CI build manifest there. Internal documentation, review records and planned output must never be copied into `out/`. `verify:live` defaults to the origin/base path in the matching build manifest; CI also requires `EXPECTED_MODE=production`. It verifies every deployed HTML hash, canonical, indexing instruction, the sitemap, robots.txt and a genuine HTTP 404.

[전체 개발·운영 인수 문서](../docs/development-handoff.ko.md)

[AEO·GEO 개선 반영과 전후 검증](../docs/aeo-geo-improvement-results-2026-09-11/README.md): stable answer anchors, section-level source links, six comparison/preparation tables, shared clinic fact resolution and separate original/new-site observation metrics. `npm run test:performance` measures the colonoscopy preparation guide in addition to the original three routes.

[검색 공개 및 구조화 데이터 릴리스](../docs/production-release-2026-09-11/README.ko.md): the user's medical and operational confirmation authorizes 43 indexable pages. The production evidence checks remain enforced. `npm run verify:live:seo` checks the Lighthouse SEO score of every indexable deployed URL using the matching CI manifest.

[2026-09-25 원장님 원고 기반 개편](../docs/director-content-review-2026-09-25/implementation.ko.md): 21 new Korean guides, five visa translations, six-language static metadata and reciprocal hreflang. The previous production approval does not cover this edited content. `measure:conversations` evaluates recorded multi-turn observations; no real exposure result is claimed. Performance checks include the long cancer guide and Nepali visa page; pass a route such as `/` to recheck only that route.

[2026-09-26 콘텐츠 업데이트](../docs/director-content-review-2026-09-26/implementation.ko.md): 20편·FAQ 60개 추가, 영문 URL 유지, 검사 정보·공통 안내·백과 분류 개선. 2026-09-27 기존 Pages에 review 모드로 배포하고 94개 경로를 검증했습니다.
