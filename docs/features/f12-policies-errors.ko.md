# F12. 이용정책·사례 연결·오류 복구

상태: 구현. 주 경로: `/privacy/`, `/copyright/`, `/cases/`, `/404.html`. 관련: F02·F09·F10·F13·F14·F15.

## 목적과 현재 흐름

사이트 이용·자료 재사용·외부 서비스·개인정보 처리 범위를 이해하고, 원 사례는 원문으로 확인하며 없는 페이지에서는 탐색을 복구한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 정책·원문 | `pages.json`, `case-links.json`, `official-channels.json` |
| 화면 | `content.tsx`의 사례 목록·공통 정책 렌더링, `article-footer.tsx` |
| 오류 | `global-not-found.tsx`, `(ko)/not-found.tsx`, `build.mjs`, `serve.mjs` |
| 제외 규칙 | `discoverable`, `searchablePages`, `site.ts`의 robots, 정적·live 감사 |

## 완료 조건

- AC01: 개인정보 안내가 실제 검색·연락·외부 분석 동작과 맞는다.
- AC02: 저작권·이용 조건을 자료별로 확인하며 모든 파일의 자유 재사용을 주장하지 않는다.
- AC03: 사례 링크 25개 접근을 유지하되 사례 본문·환자 검사자료를 복제하지 않는다.
- AC04: 사례는 내부 검색·관련 링크·HTML/XML 사이트맵·사례 목록 JSON-LD에서 제외한다.
- AC05: 사례 robots의 4개 제외 지시를 유지하고 없는 경로는 실제 HTTP 404와 복구 링크를 제공한다.

## 상태·작업 예시·검증

외부 원문 오류는 이 프로젝트에서 원 사이트를 수정하거나 본문 복제로 해결하지 않는다. noindex는 접근 통제가 아니므로 식별 가능한 환자 자료를 올린 후 noindex로 보호하려 하지 않는다.

작업 예시: 외부 분석 처리 변경 시 실제 전송·계정 설정 확인 → 개인정보 안내와 태그 동작 대조 → 검색·사례 제외·404 회귀 검증.

검증 접점: `tests/unit/public-content.test.mjs`, `live-publication.test.mjs`; `tests/e2e/patient-content.spec.ts`, `integrated-update.spec.ts`, `site.spec.ts`; `audit:static`, `verify:live`.
