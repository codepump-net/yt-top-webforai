# F06. 진료분야·검사·지지치료

상태: 구현. 주 담당: `condition-*`, `service-*` 템플릿 경로. 관련: F02·F03·F04·F07·F08·F11·F13·F14.

## 목적과 현재 흐름

어떤 진료·검사가 어떤 목적에 쓰이는지 이해하고 검사 전 준비·결과 확인·문의로 연결한다. 암환자 지지치료는 기존 치료병원과의 관계와 위험 신호를 보존한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 경로 | `/conditions/.../`, `/services/heart/.../`, `/services/ultrasound/.../`, `/services/endoscopy/.../`, `/services/cancer-support/` 등 |
| 원고·분류 | `pages.json`, `hubGroups`, `sectionId`, 관련 ID |
| 화면 | `content.tsx`의 공통 본문·허브·표 |
| SEO | `structured-data.mjs`의 `testTypes`·Service 연결 |

## 완료 조건

- AC01: 진료·검사 목적, 적용 범위·한계, 준비·후속 관리의 연결을 확인한다.
- AC02: 검사 장비·가능 여부·결과 시간·가격은 확인된 사실만 사용한다.
- AC03: 분야별 허브·하위 안내·검사 준비로 정적 링크가 이어진다.
- AC04: 검사 유형과 JSON-LD를 실제 제공 내용에 맞추고 진단 결과를 보장하지 않는다.
- AC05: 응급 위험 신호와 기존 치료기관 연락 안내가 일반 예약 유도로 대체되지 않는다.

## 상태·작업 예시·검증

모든 검사에 같은 금식·약 중단 지침을 일괄 적용하지 않는다. 별도 환자 지침이 필요한 상태와 검사 한계를 본문에 유지한다.

작업 예시: 기존 초음파 안내의 준비 연결 보완 → 해당 검사 원고·출처 확인 → 준비 허브·관련 안내·검색·JSON-LD 검사. 새 검사 추가는 현재 운영 가능 여부 확인을 전제로 한다.

검증 접점: `tests/unit/integrated-update.test.mjs`, `cardio-update.test.mjs`; `tests/e2e/integrated-update.spec.ts`, `director-afternoon.spec.ts`, `structured-data.spec.ts`; `audit:discovery`.
