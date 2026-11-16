# F02. 공통 탐색·사이트맵

상태: 구현. 주 담당 경로: `/sitemap/`; 헤더·목차·브레드크럼은 사이트 공통. 관련: F01·F03·F09·F13·F14.

## 목적과 현재 흐름

메뉴 8개·현재 위치·본문 목차·전체 페이지를 통해 위치와 다음 이동을 파악한다. 모바일 메뉴는 `<details>`로 열고 Escape·외부 입력·초점 이동으로 닫는 동작을 보강한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 분류·경로 | `information-architecture.mjs`: `navigation`, `sectionId`, `siteMapGroups`, `hubGroups` |
| 화면 | `chrome.tsx`, `site-navigation.tsx`, `article-navigation.tsx`, `content.tsx`의 `SiteMap` |
| 메타 연결 | `site.ts`의 `breadcrumbs`, `structured-data.mjs` |
| 원장 | `pages.json`, `encyclopedia-categories.json` |

## 완료 조건

- AC01: 현재 항목과 소속이 `aria-current`로 구분되고 올바른 메뉴로 이어진다.
- AC02: 모바일 메뉴·키보드 초점·본문 앵커가 고정 헤더나 연락 영역에 가려지지 않는다.
- AC03: 본문 목차가 중복되지 않고 유효한 앵커로 연결된다. 현재 화면은 목차 항목을 최대 8개 표시한다.
- AC04: `/cases/`·404는 HTML 사이트맵·허브에서 발견 경로로 복원되지 않는다.
- AC05: 루트와 저장소 하위 basePath 모두 링크·현재 위치가 정상이다.

## 상태·작업 예시·검증

목차가 없는 검색·방문 등 특수 화면의 예외를 유지한다. URL 접두사와 메뉴 소속이 다를 수 있으므로 새 분류를 접두사 비교만으로 구현하지 않는다.

작업 예시: 신규 분야 연결은 분류 → 허브 목록 → 메뉴 현재 위치 → 브레드크럼 → HTML/JSON-LD 사이트맵 순으로 대조한다.

검증 접점: `tests/e2e/patient-navigation.spec.ts`, `ui-regressions.spec.ts`, `structured-data.spec.ts`; `audit:static`·문서 인벤토리 검사.
