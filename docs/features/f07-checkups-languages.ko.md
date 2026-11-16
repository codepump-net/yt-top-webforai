# F07. 검진·서류·비자 번역

상태: 구현. 주 경로: `/checkups/`와 검진 상세·비자검진 번역 5개. 관련: F02·F04·F08·F09·F13·F14.

## 목적과 현재 흐름

방문 목적에 맞는 검사·서류·준비물·발급 확인 대상을 찾는다. 비자검진 원문과 실제 제공된 영어·중국어 간체·태국어·러시아어·네팔어 안내 사이를 이동한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 원고·사실 | `pages.json`, `clinic.json`의 번역 주소 labels |
| 경로 | `(ko)/[...segments]/page.tsx`, `[locale]/checkups/visa/page.tsx` |
| 공통 언어 | `languages.ts`, `[locale]/layout.tsx` |
| 메타·언어 연결 | `site.ts`의 `languageVersions`, `pageMetadata`; `build.mjs` |

## 완료 조건

- AC01: 제출처·목적별로 준비·검사 가능 여부·발급일 확인 안내가 구분된다.
- AC02: 한국어와 번역 5개가 실제 대응하는 안내로 상호 연결된다.
- AC03: HTML lang·URL·hreflang·x-default·XML의 언어 관계가 맞는다.
- AC04: 번역에서도 병원 주소·전화·의료적 한계·문의 내용이 원문과 일치한다.
- AC05: 확인되지 않은 법적 요구·검사항목·가격을 임의 확정하지 않는다.

## 상태·작업 예시·검증

전체 사이트 번역 기능이 아니다. 새 주제·새 언어는 현재 비자 전용 경로 생성·지원 언어 enum·레이아웃·번역 검토까지 확장해야 한다. 경로만 추가해 번역이 된 것으로 처리하지 않는다.

작업 예시: 원문 준비물 변경 → 실제 요구 확인 → 5개 대응 번역 검토 → 공통 사실·언어 메타·레이아웃 대조 → 공개 근거 확인.

검증 접점: `tests/unit/director-revamp.test.mjs`, `tests/e2e/director-revamp.spec.ts`, `structured-data.spec.ts`; 네팔어는 기본 성능 대표 경로에도 포함된다.
