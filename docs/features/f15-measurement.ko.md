# F15. 운영 측정·AI 관측

상태: 제한 구현. 조건부 태그와 수동 집계 도구가 있으며 일반 보고서의 데이터 확보·성과는 별도 확인이 필요하다. 공개 통계 페이지 없음. 관련: F08·F09·F12·F13·F14·F16.

## 목적과 현재 흐름

운영자가 기술 준비·검색 계정 자료·연락 클릭·AI 표본 관측을 구분해 개선 대상을 정한다. 환자에게 통계 팝업·배너·설정 버튼·추가 단계를 요구하지 않는다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 태그 | `analytics.json`, `analytics.tsx`, `analytics.mjs`, 양 언어 레이아웃 |
| 질문 | `measurement-queries.json`: 편집 평가 질문 73개 |
| 대화 | `measurement-conversations.json`: 13개 시나리오·39턴 |
| 집계 | `scripts/measurement.mjs`, `conversation-measurement.mjs`, `measure*.mjs` |
| 이력 | `docs/client-requests/seo-improvement-2026-11-07/action-plan.json` |

## 현재 제한과 완료 조건

- AC01: 태그는 production 레이아웃과 `yttop.kr`에서만 시작하며 검색·사례·검색 query가 있는 URL을 제외한다.
- AC02: storage·광고 관련 동의를 denied로 유지하고 location의 query·fragment, referrer 상세 경로를 제거한다.
- AC03: `contact_click`은 phone·map만 구분하며 입력한 증상·이름·연락처를 이벤트에 넣지 않는다.
- AC04: GTM 전송 응답과 GA4 보고서의 이벤트·사용자·세션 표시를 별개로 확인한다. cookieless 전송이 일반 보고서 집계를 보장하지 않는다.
- AC05: AI 집계는 시점·서비스·모델·언어·질문 버전별 분모·실패·미검토·원/새 사이트를 분리한다.

태그 네트워크 요청은 외부 연결이다. ‘쿠키 없음’을 ‘외부 전송 없음’이나 포괄적인 법적 적합성 확인으로 표현하지 않는다. 외부 컨테이너의 설정도 실제 운영 계정과 브라우저에서 확인해야 한다.

## 작업 예시·검증

작업 예시: 합성 관측 JSON으로 중복·실패·정확도 분모를 확인 → 비공개 위치의 실제 자료에 적용 → 출처·조건·범위를 운영 기록에 남긴다. 실제 환자 대화·기록·비밀키를 커밋하지 않는다.

질문 집합은 검색량·질문 빈도 순위가 아니다. 자동 AI 수집기·운영 대시보드가 이미 돌아간다고 보고하지 않는다. 현재 정책 안에서 측정할 수 없는 기능은 보류한다.

검증 접점: `tests/unit/analytics.test.mjs`, `measurement.test.mjs`, `conversation-measurement.test.mjs`; `tests/e2e/analytics.spec.ts`; `npm run measure -- /비공개/관측.json`, `measure:conversations`.
