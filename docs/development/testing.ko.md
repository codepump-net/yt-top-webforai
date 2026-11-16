# 검사 전략과 완료 기준

기준일: 2026-11-16. `web/package.json`과 `.github/workflows/pages.yml`이 실행 명령의 기준이다. 검사 결과는 실행 환경·내용·배포 여부와 함께 기록한다.

## 1. 검사 계층

| 계층 | 명령(`web/`에서) | 확인할 것 |
|---|---|---|
| 의존성 | `npm run audit:dependencies` | 실제 npm audit·예외 범위·기한·조회 실패 |
| 코드 | `npm run lint`, `npm run typecheck` | 문법·타입. 타입 검사는 최초 빌드 후 실행 |
| 데이터 | `npm run content:validate` | review 원고·목적·출처·자산 계약 |
| 공개 조건 | `node scripts/validate.mjs production` | 현재 내용에 맞는 실제 출판 근거 |
| 단위 회귀 | `npm test` | 계약·검색 모델·공개·메타·측정 로직 등 |
| 재사용 하네스 | `PYTHON=python3 npm run harness-check` | Python 검증. CI는 설치된 Python 사용 |
| 전체 정적 출력 | `npm run build` | review 빌드·정적 감사·발견 감사까지 포함 |
| 기존 출력 재검사 | `npm run audit:static`, `npm run audit:discovery` | 현재 `out`과 같은 빌드 매니페스트 필요 |
| 브라우저 | `npm run test:e2e` | 화면·동작·접근성·인쇄·네트워크 회귀 |
| 성능 | `npm run test:performance` | 대표 6개 경로의 모바일 모의 Lighthouse |
| 배포 후 | `npm run verify:live` | 같은 CI 매니페스트의 모든 실제 HTML·탐색 파일·404 |
| 추가 배포 SEO | `npm run verify:live:seo` | 색인 후보 실제 URL별 Lighthouse. 기본 CI 자동 단계는 아님 |

`verify:plan`은 특정 과거 원문 요구사항을 점검하는 도구다. 역사적 수치·요구를 모든 신규 기능의 범위로 적용하지 않는다. 단위·E2E 검사 파일은 각각 17개·15개이며 실행 케이스 수는 실제 실행 결과로 기록한다.

## 2. 변경별 최소 확인

| 변경 | 필요한 확인 |
|---|---|
| 내부 문서만 | 상대 링크·원장 수치·인벤토리 재생성·`--check`; 사이트 출력 분리 확인 |
| 환자 원고·목적·출처 | 데이터 계약 + review 빌드·감사 + 관련 기존 회귀 + 편집 검토 |
| 메뉴·카드·레이아웃 | 해당 모바일·키보드·인쇄·접근성 E2E + 관련 정적 검사 |
| 검색·분류 | 매칭·결과 없음·실패·사례 제외·검색어 보호 + 발견·목록 검사 |
| SEO·언어·URL | 메타·JSON-LD·날짜·hreflang·root/project 결과 대조 |
| 자산·문서 | 무결성·크기·치수·출처·원본·확대 + 필요한 대표 성능 검사 |
| 출판·빌드·배포 | 공개 거절·성공 조건 회귀 + 두 경로 전체 CI + 실제 대조 |
| 측정 | 전송 필드·제외·저장 상태·방문자 UI 없음·집계 분모·오류 |

관련 기존 검사를 먼저 사용한다. 새 테스트는 동작 위험이나 재발 방지 가치가 있을 때 추가한다. 정적 문장·CSS 선언을 그대로 복사한 테스트를 늘리지 않는다.

## 3. 로컬 정적 검토

```sh
cd web
SITE_ORIGIN=https://yttop.kr SITE_BASE_PATH='' npm run build
npm run typecheck
npm test
PYTHON=python3 npm run harness-check
npx playwright install chromium
npm run test:e2e
```

`build`는 origin이 운영 도메인이어도 review다. CI Linux는 `npx playwright install --with-deps chromium`, Windows는 설치된 Edge를 사용한다. E2E는 Playwright 설정이 정적 서버를 시작한다. 수동 화면 확인은 `npm run serve`로 한다.

root와 project 출력은 동시에 같은 `out/`에 만들 수 없다. 순서대로 빌드·검사를 마치고 다음 경로를 빌드한다. 생성된 HTML을 기준으로 검사하므로 `npm run dev`의 화면만 보고 정적 배포 검증을 대신하지 않는다.

## 4. 성능 예산과 한계

현재 스크립트 기준: performance ≥90, accessibility ≥95, best-practices ≥95, LCP ≤2500ms, CLS ≤0.1. SEO의 가중 검사 실패를 확인하되 review·비색인 페이지의 의도된 `is-crawlable` 실패는 구분한다.

대표 경로는 홈·심장초음파·검색·대장내시경 준비·긴 암 치료 안내·네팔어 비자 안내다. 특정 경로 확인은 `npm run test:performance -- /services/heart/echocardiography/`처럼 전달한다. 이는 실험실 모의 측정이며 실제 이용자 INP·방문 성과 자료가 아니다.

## 5. 증거 관리

검증 결과·모드·SHA·환경·실행 명령·실패·제약을 기록한다. 공개 출력은 `out/`, 검사는 `reports/`, 브라우저 상세는 `playwright-report/`·`test-results/`로 구분한다. 개인 자료·비밀값이 로그나 artifact에 포함되지 않도록 한다.

이번 문서 정리의 실행 결과는 [문서화 검증 기록](documentation-validation.ko.md)에 남긴다. 기록된 과거 성공이 현재 코드·현재 의존성의 성공을 대신하지 않는다.
