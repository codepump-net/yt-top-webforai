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

For the GitHub project site, set `SITE_ORIGIN=https://codepump-net.github.io` and `SITE_BASE_PATH=/yt-top-webforai` **before building**. `build` always produces the noindex review site. `build:release` additionally requires real, current reviews and HTTPS.

Validation: `npm run lint`, `npm run typecheck` (after the first build), `npm test`, `npm run harness-check`, `npm run test:e2e`, `npm run test:performance`. Linux needs `npx playwright install --with-deps chromium`; Windows uses installed Edge. Reports are generated locally and uploaded by CI.

No API server or secret is needed. Images are already optimized and committed; raw research and the one-time import step are not required in CI.

[전체 개발·운영 인수 문서](../docs/development-handoff.ko.md)
