# F08. 방문·전화·지도·비용 문의

상태: 구현. 주 경로: `/visit/`, `/fees/`; 연락·시간 정보는 공통 영역에서도 사용. 관련: F01·F05·F07·F13·F15.

## 목적과 현재 흐름

진료시간·주소·주차·서류 확인 방법을 살펴보고 전화 또는 외부 지도로 연결한다. 현재 사이트 안에서 예약을 저장·확정하거나 비용을 결제하지 않는다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 사실·원고 | `clinic.json`, `pages.json`의 `visit`, `fees` |
| 해석·연락 | `content-model.mjs`, `site.ts`의 `phoneHref` |
| 화면 | `chrome.tsx`의 `VisitInfo`, `content.tsx`의 `VisitPage` |
| 측정 | `analytics.mjs`의 `contactMethod`, `analytics.tsx` |

## 완료 조건

- AC01: 주소·전화·진료시간은 같은 원장으로 본문·푸터·번역·JSON-LD에 반영된다.
- AC02: 전화는 실제 `tel:` 링크, 지도는 확인된 원장의 외부 URL을 사용한다.
- AC03: 모바일 연락 영역이 본문·초점·페이지 끝을 가리지 않는다.
- AC04: 비용·서류 안내에 근거 없는 가격·발급 약속을 넣지 않는다.
- AC05: 연락 클릭을 예약·실제 방문 완료로 집계하지 않는다.

## 상태·작업 예시·검증

휴진·시간·발급 내용이 바뀌면 실제 운영 사실부터 확인한다. 원 사이트 변경은 이 프로젝트의 작업으로 요구하지 않는다. 외부 서비스의 이용·개인정보 안내는 유용한 이용정보로 유지한다.

작업 예시: 확인된 진료시간 수정 → 공통 원장·표시·구조화 시간 구간 대조 → 작은 화면·키보드·연락 링크 검사 → 운영 확인과 공개 검증.

검증 접점: `tests/unit/content.test.mjs`, `analytics.test.mjs`; `tests/e2e/site.spec.ts`, `ui-regressions.spec.ts`, `analytics.spec.ts`.
