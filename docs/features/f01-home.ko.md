# F01. 홈·환자 목적 진입

상태: 구현. 주 경로: `/`. 관련: F02·F03·F08·F09·F10·F13.

## 목적과 현재 흐름

환자가 증상·검사 준비·암 치료 중 불편·검진 서류 중 자신의 목적을 찾아 안내로 이동한다. 홈에서 제품·병원 운영자를 확인하고 검색, 주요 준비 안내, 목적별 링크, 분야·의료진·방문·공지를 이용한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 원장 | `content/site.json`, `pages.json`의 `home`, `clinic.json`, `notices.json` |
| 렌더러 | `web/src/components/content.tsx`의 `Home`, `HomeSearch`, `VisitInfo` |
| 구성 | `information-architecture.mjs`의 `patientEntrances`, `homeGuideGroups` |
| 스타일 | `library.css`의 `.home-library`, `.home-guide-groups` |

## 완료 조건

- AC01: TOP 건강백과와 영통탑내과 운영자가 구분되어 보인다.
- AC02: 환자 목적 4개와 주요 검사·검진·방문 안내 12개가 유효한 링크로 연결된다.
- AC03: 주요 12개는 JavaScript·검색·사이트맵 없이 홈 본문에서 한 번의 링크로 도달한다.
- AC04: 작은 화면에서도 검색·주요 안내·위험 신호·연락 정보가 겹치지 않는다.
- AC05: 홈 검색의 개인정보 보호 동작과 종료 공지 처리 조건을 유지한다.

## 상태·작업 예시·검증

검색어 전달은 F09, 공지 기간은 F10이 담당한다. 공지가 기간 종료되거나 이미지가 달라질 때도 목적별 안내는 계속 사용할 수 있어야 한다. 환자 목적을 ‘인기’·‘자주 찾는’으로 표현하려면 별도 측정 근거가 필요하다.

작업 예시: 안내 라벨을 환자 언어로 교정 → 연결 대상·분류 확인 → 모바일·키보드 확인 → 정적 발견 감사. 현재 라벨과 실제 링크를 유지한 구조 분리는 B02 백로그를 따른다.

검증 접점: `tests/e2e/discovery.spec.ts`, `patient-navigation.spec.ts`, `ui-regressions.spec.ts`; `npm run audit:discovery`. 공통 원고·스타일 수정 시 F14 공개 검증도 확인한다.
