# F05. 병원·의료진·공식 채널

상태: 구현. 주 경로: `/about/`, `/doctors/`, `/doctors/park-jongseol/`, `/doctors/park-rayoung/`. 관련: F08·F11·F12·F13·F14.

## 목적과 현재 흐름

실제 운영 병원과 의료진을 확인하고 이력·진료 분야·공식 채널을 살펴본 뒤 필요한 안내·방문 정보로 이동한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 사실 원장 | `clinic.json`, `physicians.json`, `official-channels.json` |
| 원고·이미지 | `pages.json`, `assets.json` |
| 화면 | `content.tsx`: `DoctorCards`, `DoctorDetail`, `doctorSections`; `official-channels.tsx` |
| 엔터티 | `structured-data.mjs`: `MedicalClinic`, `Person`, `ProfilePage` |

## 완료 조건

- AC01: 사이트 브랜드와 병원 실명을 구분하고 프로필과 소속·이력의 근거를 확인한다.
- AC02: 프로필 2개의 화면 정보와 Person·ProfilePage가 일치한다.
- AC03: 실루엣은 실제 인물 사진으로 표시하지 않는다.
- AC04: 원장 정보가 원고 복사본과 어긋나지 않으며 공식 채널은 유효한 외부 링크다.
- AC05: 개인 의료 검토 이력과 의료진 소개를 혼동하지 않는다.

## 상태·작업 예시·검증

자료에 없는 직함·자격·경력을 보완 추측하지 않는다. 출처 URL이 존재한다는 사실만으로 현재 사실이 확인되었다고 하지 않는다.

작업 예시: 확인된 프로필 갱신은 원장 → 상세 원고 → 이미지 → JSON-LD → 실제 운영 확인 → 공개 검증 순으로 진행한다.

검증 접점: `content:validate`, `tests/unit/structured-data.test.mjs`, `tests/e2e/site.spec.ts`, `director-revamp.spec.ts`. 공통 사실 변경은 F14와 전역 영향 확인.
