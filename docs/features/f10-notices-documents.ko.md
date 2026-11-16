# F10. 공지·기간·공식 문서

상태: 구현. 주 경로: `/notices/`와 자체 환자 안내 6개. 관련: F01·F04·F09·F11·F12·F13·F14.

## 목적과 현재 흐름

지원 대상·일정·기준일을 확인하고 공식 근거·PDF·원본 페이지를 열람한다. 기존 병원 공지는 원 게시판으로 연결하고 자체 안내 6편은 복제 공지와 구분한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 원장 | `notices.json`, 대응 `pages.json`, `assets.json` |
| 로직 | `notice-model.mjs`, `notice-page.mjs`, `notice-types.ts` |
| 화면 | `notices.tsx`, `notice-document.tsx`, `zoom-image.tsx` |
| 검사 | `patient-additions-contract.mjs`, `validate.mjs` |

## 완료 조건

- AC01: 고정·게시일 정렬, 제목·태그 검색, 분야 선택·쪽 나누기가 현재 6개 안내에서 작동한다.
- AC02: 한국 날짜 기준의 시작 예정·기간 안내·종료·기준일 자료를 구분한다.
- AC03: 종료 안내를 홈의 최근 공지에서 제외하고 참고 상세는 실제 기준일과 함께 유지한다.
- AC04: 출처 게시일·확인일·지원 기간을 구분하며 조회수가 없으면 `—`로 표시한다.
- AC05: 제공 문서의 PDF·페이지 이미지·해시·치수가 일치하고 전체 원본 열람이 가능하다.

## 상태·작업 예시·검증

정적 HTML의 초기 날짜는 빌드 시 정해지고 브라우저가 날짜 상태를 보강한다. 프로그램 조건 자체가 바뀌면 재검토·재빌드해야 한다. 종료 상태를 접종 재고·병원의 참여 확정·예약 가능 여부로 해석하지 않는다.

작업 예시: 새 절기 공식 안내 확보 → 기존 안내 수정 또는 독립 안내 필요 판단 → 대상·기간·출처 대조 → 두 원장과 문서 연결 → 경계일·검색·확대·출판 검사.

검증 접점: `tests/unit/notice-content-update.test.mjs`, `tests/e2e/notice-content-update.spec.ts`, `infection-guide.spec.ts`; `content:validate`, `verify:plan`은 해당 역사적 요청 범위를 변경한 경우 사용.
