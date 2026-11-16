# F03. 증상·질환·준비 허브

상태: 구현. 주 경로: `/symptoms/`, `/diseases/`, `/preparation/`, `/health/`. 관련: F02·F04·F06·F09·F11·F13.

## 목적과 현재 흐름

병명을 몰라도 증상이나 목적에서 시작해 안내를 찾게 한다. 증상·질환백과는 현재 등록한 안내를 분류·가나다순·검색으로 제공하며 준비 허브는 검사 전·예약 검사별·검사 후 관리로 연결한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 원장 | `pages.json`, `encyclopedia-categories.json`, `search-aliases.json` |
| 분류 | `information-architecture.mjs`의 `hubGroups`, `directoryTerms`, `guideRole` |
| 화면 | `content.tsx`의 `HubDirectory`, `Cards`; `search.tsx` |
| 목록 의미 | `structured-data.mjs`의 `childPages` |

## 완료 조건

- AC01: 허브에 표시한 항목과 실제 원고·목록 구조화 데이터가 일치한다.
- AC02: 증상 안내·질환 설명·관련 해설의 역할을 환자가 구분할 수 있다.
- AC03: 검색 전 정적 목록으로도 제공된 안내를 찾을 수 있다.
- AC04: 빈 분류와 결과 없음은 미등록 상태로 표현하고 문서를 자동 생성하지 않는다.
- AC05: 준비 허브에서 해당 검사와 약제·검사 후 안내로 이동할 수 있다.

## 상태·작업 예시·검증

심장·혈관 증상 20편과 질환 20편이 있으나 모든 분류의 원고가 완비된 것은 아니다. 과거 원고 공급 계획의 수치를 현재 콘텐츠 수로 사용하지 않는다.

작업 예시: 기존 원고 한 편을 관련 분야에 추가 연결 → 잘못된 중복·사례 포함 여부 확인 → 검색 별칭·역할 라벨·JSON-LD 확인. 새 의료 원고가 필요하면 F04의 근거·공개 조건을 적용한다.

검증 접점: `tests/e2e/patient-navigation.spec.ts`, `integrated-update.spec.ts`, `cardio-update.spec.ts`; `tests/unit/integrated-update.test.mjs`, `audit:discovery`.
