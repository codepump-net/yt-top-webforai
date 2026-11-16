# F14. 콘텐츠 검증·출판·배포

상태: 구현. 운영 기능이며 공개 경로 없음. 관련: 모든 기능.

## 목적과 현재 흐름

환자용 범위·원고·자산·실제 공개 근거를 확인한 결과물만 배포하고 실제 사이트가 그 결과물과 일치하는지 확인한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 데이터·공개 계약 | `scripts/data.mjs`, `content-contract.mjs`, `public-content-policy.mjs` |
| 근거 | `reviews.json`, `publication-approval.json`, 원고·병원·자산·목적 원장 |
| 빌드·감사 | `build.mjs`, `validate.mjs`, `audit.mjs`, `discovery-audit.mjs` |
| 배포·실제 대조 | `.github/workflows/pages.yml`, `verify-live.mjs` |

## 완료 조건

- AC01: 일반 로컬 빌드·PR은 review, main 공개 배포는 production이며 현재 근거를 검사한다.
- AC02: 승인 범위·내용·공통 사실·renderer digest·유효기간이 어긋나면 production을 거절한다.
- AC03: `out/`에는 환자용 파일만, 매니페스트·계획 XML·검사 증거는 `reports/`에 둔다.
- AC04: root/project 두 검사와 최신 main SHA 확인이 배포 전에 수행된다.
- AC05: 같은 실행 artifact의 매니페스트로 실제 HTML 해시·URL·색인 지시·XML·robots·404를 대조한다.

## 상태·작업 예시·검증

검사 실패·공개 근거 만료·렌더러 변경·오래된 배포·실제 HTML 불일치를 각각 기록한다. 빌드 실패를 review 운영 배포나 자동 digest 갱신으로 우회하지 않는다. `PUBLICATION_MODE` 레거시 변수는 현재 main 모드를 선택하지 않는다.

작업 예시: CI 수정은 검증 실패 재현 → 원인별 수정 → 두 경로 검사 → 배포와 실제 대조 → 실행 ID·SHA 증거 기록으로 완료한다.

검증 접점: `tests/unit/publication.test.mjs`, `live-publication.test.mjs`; 전체 CI. 상세 절차는 [운영 런북](../operations/runbook.ko.md), 개발자 명령은 [검사 기준](../development/testing.ko.md).
