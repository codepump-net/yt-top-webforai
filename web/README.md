# 영통탑내과 정적 웹 앱

Node.js 24, Next.js 16.3.4, React 19.3.0, TypeScript, Tailwind CSS 4.3.3. The lockfile pins the dependency tree.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run serve
```

For the GitHub project site, set `SITE_ORIGIN=https://codepump-net.github.io` and `SITE_BASE_PATH=/yt-top-webforai` **before building**. `build` always produces the noindex review site. `build:release` requires HTTPS and valid publication evidence: either current individual review records or an explicit user confirmation bound to the current content and renderer. As of 2026-09-25, repository variable `PUBLICATION_MODE=review` deploys the revised site to the existing Pages URL for the director's subsequent review. All pages are noindex and the public sitemap is empty during this period. The production evidence checks remain enforced; PR builds also stay in review mode. See the [deployment record](../docs/director-content-review-2026-09-25/deployment.ko.md).

Validation: `npm run lint`, `npm run typecheck` (after the first build), `npm test`, `npm run harness-check`, `npm run test:e2e`, `npm run test:performance`. Linux needs `npx playwright install --with-deps chromium`; Windows uses installed Edge. Reports are generated locally and uploaded by CI.

No API server or secret is needed. Images are already optimized and committed; raw research and the one-time import step are not required in CI.

The app is a patient-facing hospital website operated alongside `yttop.co.kr`. Follow [the patient-content policy](../docs/patient-content-policy.ko.md) before adding pages or public copy. Current development scope: 71 routes (including five visa translations); 25 case links lead to the original hospital articles, and announcements use the existing board.

Only `out/` is deployed. `reports/build-manifest.json` and `reports/planned-sitemap.xml` are internal build evidence. The preview server reads the manifest from `reports/`; `verify:live` also needs the matching CI build manifest there. Internal documentation, review records and planned output must never be copied into `out/`.

[전체 개발·운영 인수 문서](../docs/development-handoff.ko.md)

[AEO·GEO 개선 반영과 전후 검증](../docs/aeo-geo-improvement-results-2026-09-11/README.md): stable answer anchors, section-level source links, six comparison/preparation tables, shared clinic fact resolution and separate original/new-site observation metrics. `npm run test:performance` measures the colonoscopy preparation guide in addition to the original three routes.

[검색 공개 및 구조화 데이터 릴리스](../docs/production-release-2026-09-11/README.ko.md): the user's medical and operational confirmation authorizes 43 indexable pages. The production evidence checks remain enforced. `npm run verify:live:seo` checks the Lighthouse SEO score of every indexable deployed URL using the matching CI manifest.

[2026-09-25 원장님 원고 기반 개편](../docs/director-content-review-2026-09-25/implementation.ko.md): 21 new Korean guides, five visa translations, six-language static metadata and reciprocal hreflang. The previous production approval does not cover this edited content. `measure:conversations` evaluates recorded multi-turn observations; no real exposure result is claimed. Performance checks include the long cancer guide and Nepali visa page; pass a route such as `/` to recheck only that route.
