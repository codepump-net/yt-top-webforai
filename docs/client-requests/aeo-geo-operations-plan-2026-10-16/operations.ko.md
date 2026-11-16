# AEO GEO 관리 앱 배포와 운영 절차

2026-10-16. [개발계획](README.ko.md)의 실행·운영 지침이다. 무료 환경으로 시작하며 공급자 한도·요금은 계정 생성과 배포 직전에 다시 확인한다. 정기 수집은 이 문서만으로 등록되지 않는다.

## 계정과 환경 준비

| 준비 항목 | 담당 역할 | 확인할 결과 |
|---|---|---|
| Cloudflare 계정과 Free 플랜 | 계정 소유자 | Workers·D1·Access 사용 가능, 별도 유료 상품 활성화 여부 확인 |
| GitHub 저장소 설정 | 저장소 관리자 | Actions·environment·Secrets 권한, 현재 공개 여부·공유 사용량 확인 |
| 로그인 계정과 역할 | 운영 책임자 | viewer/operator/reviewer/owner에 해당하는 실제 계정 목록 |
| Google 검색 속성 | 해당 서비스 관리자 | 정확한 URL-prefix 또는 domain 속성과 승인된 읽기 인증 |
| Bing 보고서 | 해당 서비스 관리자 | 사이트 확인, AI 보고서·내보내기 지원과 실제 파일 형식 |
| GA4 | 선택 연결 관리자 | 2차에서 속성·시간대·이벤트 정의 확인 |
| 오프사이트 백업 보관 | 운영 책임자 | 로컬 암호화 보관 위치와 복호화 담당자 |

원 사이트와 새 사이트의 외부 서비스 속성은 각각 확인한다. 원 사이트 소유권을 추정하거나 새 도메인 등록으로 원 사이트의 통계를 읽을 수 있다고 가정하지 않는다. 비밀값·실제 계정 목록은 이 공개 가능 문서에 적지 않는다.

staging과 production은 별도 Worker·D1 DB·Access 설정·서비스 토큰을 사용한다. staging에는 합성 자료 또는 명시적으로 비식별 처리한 fixture만 넣는다. 실제 운영 원본을 개발자의 공유 미리보기로 복사하지 않는다.

## 인증과 자격 분리

운영자는 Access에서 허용된 이메일로 로그인한다. 이메일 OTP를 사용할 때 `One-time PIN` 로그인 방식만 허용 규칙으로 두지 않고 실제 이메일 allowlist를 함께 지정한다. [OTP 안내](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/), [Access 정책 예시](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/common-policies/).

화면·일반 API에는 사람용 정책, `/api/ingest/*`에는 지정 서비스 자격만 허용하는 정책을 적용한다. Worker에서도 Access JWT의 서명·issuer·audience·만료와 역할을 검증한다. 이메일 헤더만 신뢰하지 않는다. 정책 경로의 우선순위와 실제 토큰 식별 방식은 staging에서 확인한다. [서비스 토큰](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/), [JWT 검증](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/).

브라우저의 변경 요청은 같은 origin과 CSRF 방어를 검증한다. 인증된 데이터 응답은 `Cache-Control: private, no-store`로 제공하고 공용 CDN 캐시에 저장하지 않는다. 모든 preview·대체 hostname의 보호를 검증하며 보호되지 않은 경로는 비활성화한다. `noindex`는 추가 검색 지시이고 인증을 대신하지 않는다.

| 설정 이름 예시 | 저장 위치 | 용도 |
|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID`, `D1_DATABASE_ID` | GitHub environment variables / Wrangler 환경 설정 | 배포 대상 식별; 비밀 토큰과 분리 |
| `CLOUDFLARE_API_TOKEN` | 배포 전용 GitHub environment secret | 지원되는 최소 Worker·D1 배포 권한 |
| `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD_HUMAN`, `ACCESS_AUD_SERVICE` | Worker 환경 설정 | JWT 검증 기준; 임의 요청에서 변경 불가 |
| `ADMIN_ROLE_MAP` | Worker secret | 실제 계정과 역할 매핑 |
| `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET` | 수집 전용 GitHub environment secrets | 수집 API 서비스 인증 |
| `GOOGLE_READ_CREDENTIALS` | 수집 전용 GitHub environment secret | 승인된 Google 읽기 인증 자료; 실제 방식에 맞게 분리 가능 |
| `GSC_PROPERTY`, `GA4_PROPERTY_ID` | 수집 환경 variables | 연결한 속성, GA4는 후속 연결 |
| `AI_EXPERIMENT_ENABLED` | 수집 환경 variable | 기본 `false` |
| `AI_MONTHLY_BUDGET_USD` | 수집 환경 variable | 기본 `0`; 실행 전 검사 |

위 이름은 구현 설정의 예시이며 모든 값을 지금 발급해야 하는 목록은 아니다. 실제 인증 방식에서 필요 없는 설정은 만들지 않는다. 외부 서비스의 읽기 자격은 수집기에만 두고 브라우저나 정적 번들에 넣지 않는다. `NEXT_PUBLIC_*`, `VITE_*`에 비밀값을 넣지 않는다.

GitHub 공개 저장소의 실행 로그와 artifact는 비공개 저장소로 간주하지 않는다. 수집 workflow는 원문·토큰 출력과 원본 artifact 업로드를 금지한다. 마스킹에만 의존하지 않고 stdout에는 비식별 건수·실행 ID·상태만 출력한다. fork PR에는 운영 secret을 전달하지 않는다.

## 빌드와 배포

1. 로컬에서 `admin/` 독립 설치·계약·DB·화면 검사를 수행한다. `.dev.vars*`, `.wrangler/`, `.local/`, SQL 백업·보고서·빌드 산출물을 추적 제외한다.
2. PR의 `admin-check.yml`은 합성 자료로 lint·typecheck·unit·integration·browser·build를 실행한다. 원격 수집과 production secret 사용은 하지 않는다.
3. staging 호스트의 Access 보호와 앱의 기본 거절 조건을 준비한 뒤 배포한다. 처음 잠깐 공개하고 나중에 보호하는 절차를 사용하지 않는다.
4. staging에서 실제 JWT, DB binding, 입력·응답 크기, CPU, 우회 경로를 확인한다. 운영 secret 없이도 빈 화면·미연결 상태가 동작해야 한다.
5. production 적용 전에 DB를 백업하고 migration을 검증한다. 이전 앱 버전과 함께 동작하는 추가 중심 migration부터 적용한다.
6. `admin-deploy.yml`은 해당 앱과 DB만 대상으로 배포한다. 동시 배포를 직렬화하고 배포 대상 SHA·migration 목록을 기록한다.
7. production에서 무인증·허용 사용자·비허용 사용자·서비스 자격을 각각 시험한다. 실제 상태와 마지막 성공 자료를 확인한다.
8. 소유자가 준비한 연결만 활성화하고 수집 workflow를 등록한다. 마지막 성공 시각·비용·복구 기록을 확인한 뒤 운영을 시작한다.

현재 `pages.yml`의 환자용 배포 검사를 삭제하거나 느슨하게 만들지 않는다. 관리 코드만 바뀌는 커밋에서 환자용 workflow를 생략하는 최적화는 공유 측정·원장·CI 변경 감지를 검증한 뒤 별도 작업으로 한다. 최초에는 기존 동작을 유지한다.

소스·문서만 저장한 상태, staging 배포 완료, production 배포 완료, 실제 데이터 연결 완료를 각각 기록한다. 하나를 다른 단계의 완료로 보고하지 않는다.

## 수집 일정과 실패 처리

초기 운영 일정은 매일 06:17 KST, 즉 전날 21:17 UTC의 한 번 수집이다. GitHub cron 예시는 `17 21 * * *`이며 정확한 시작 시각을 보장하지 않는다. 공개 저장소의 예약 작업은 활동이 없는 기간에 비활성화될 수 있으므로 설정 상태도 월별 점검한다. [GitHub 일정 실행](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

한 workflow에서 기술 점검 → 준비된 공식 API → 수집 요청 처리 순으로 수행하되 출처별 성공·실패를 독립 기록한다. 작업 timeout은 10분이며 다음 실행에서 실패한 범위만 재개할 수 있게 체크포인트를 저장한다. 각 출처의 재시도는 기본 최대 3회로 제한하고 요청 한도 응답의 `Retry-After`를 우선한다.

화면의 재수집 버튼은 허용된 요청을 대기열에 넣는다. 즉시 실행했다고 표시하지 않는다. 권한 있는 운영자는 GitHub `workflow_dispatch`로 바로 실행할 수 있다. 대기열에는 작업 종류·대상 속성·기간만 저장하며 실행할 코드·명령·임의 URL을 넣지 않는다.

| 주기 | 업무 |
|---|---|
| 매일 | 연결별 성공·실패와 최근 7일 수정 데이터, 기술 점검, 무료 사용량 확인 |
| 매주 | 공식 AI 보고서 가져오기, 준비된 질문 표본 관측, 오류 답변 검토, 암호화 백업 |
| 매월 | 최근 28일 재대조, 데이터 보관 정리, 토큰 만료·Actions 활성화·요금 변경 확인 |
| 질문·모델·사이트 변경 시 | 새 버전 생성과 그래프 변경 표식, 동일 조건 비교 가능 여부 확인 |

공식 AI 보고서 수동 가져오기는 담당자가 파일을 등록한 시점에 갱신된다. 일별 자동 수집이 성공했어도 이 보고서가 매일 갱신됐다고 표시하지 않는다. 알림은 초기에는 대시보드 상태와 GitHub 실행 상태로 제공하며, 외부 이메일·메신저 알림은 수신자와 채널이 정해진 후 추가한다.

## 비용 한도와 사용량 관리

무료 CPU 제한은 HTTP·Cron 모두 10ms이고 네트워크 대기 시간은 CPU에 포함되지 않는다. 수집·파싱·대량 집계를 Actions에 두되 API 인증·검증·JSON 직렬화 비용도 staging에서 측정한다. [Workers 제한](https://developers.cloudflare.com/workers/platform/limits/).

| 자원 | 자체 경고 기준 | 대응 |
|---|---|---|
| Worker CPU | p95 8ms 초과 또는 제한 오류 발생 | batch·응답 크기 축소, 집계 위치 조정; 보안 검사 유지 |
| Workers 요청 | 계정 하루 무료 한도의 70% | 불필요한 polling·재시도 줄임, 원인별 요청 수 확인 |
| D1 읽기·쓰기 | 해당 계정 하루 한도의 70% | `rows_read/rows_written` 확인, 인덱스·기간 제한 조정 |
| DB 크기 | 300MB 경고, 400MB 신규 대용량 증거 중지 | 보관 정책 적용·백업; 지표 이력 조용히 삭제 금지 |
| Actions 비공개 실행 | 해당 계정 무료 월 한도의 70% | 기존 작업 포함해 확인, 빈도·timeout 조정 |
| 유료 AI | 예산 0 또는 비활성화 | API 요청 자체를 거절 |

사용량을 API로 읽을 권한이 없으면 관리 콘솔 확인 시각과 결과를 수동 기록한다. 권한 없이 사용량 0이나 무료 잔여 100%를 표시하지 않는다. GitHub는 무료 분량 외 artifact·cache에도 별도 한도가 있으므로 원본 데이터 업로드를 하지 않고 필요한 검증 로그도 짧게 보관한다. [GitHub 과금](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

Cloudflare 무료 D1의 일별 한도를 넘으면 쿼리가 오류로 실패한다. 유료 플랜과 R2·AI 상품은 별도 사용량 과금이 있을 수 있으므로 초기에는 활성화하지 않는다. 예산 알림만으로 과금이 차단된다고 가정하지 않고 각 서비스의 실제 차단 설정을 확인한다. 무료 서비스의 한도 변경·사용량 초과에 따른 중단 가능성은 운영 화면에 상태로 드러낸다. [D1 초과 처리](https://developers.cloudflare.com/d1/platform/pricing/).

무료 운영 규모 추정 예시는 운영자 5명, 일별 수집 5분, 30일 기준 Actions 150분이다. 실측 비용이 아니며 기존 계정 작업·실패 재시도·배포·artifact 사용량은 별도로 합산한다. 저장량은 실제 레코드 평균 크기와 인덱스 용량을 측정해 월 증가량을 계산한다.

## 보관과 백업

| 데이터 | 초기 보관 기준 | 만료 후 처리 |
|---|---|---|
| 지표·실행 요약·도메인·질문 버전 | 24개월 | 삭제 전 내보내기; 장기 비교 필요 재검토 |
| 원본 공식 파일·답변·인용 증거 | 180일 | 암호화 백업 후 삭제 가능; 집계에 `evidence_expired` 표시 |
| 정확성 검토·정정·감사 이력 | 24개월 | 원문 만료 시 참조 상태를 함께 남김 |
| 미완료 가져오기 | 7일 | 확정된 자료와 분리해 정리 |
| 상세 실행 오류 로그 | 30일 | 비밀값·원문 없이 원인 코드만 유지 |
| 암호화 외부 백업 | 최근 주간 4개와 월간 3개 | 담당자가 복호화 가능 여부 점검 |

D1 Free의 Time Travel은 7일이며 외부 백업을 대신하지 않는다. 매주 owner가 DB를 내보내 로컬에서 암호화하고 지정한 비공개 보관 위치에 저장한다. migration 전에도 백업한다. Actions의 공개 artifact나 소스 저장소를 백업 저장소로 사용하지 않는다. [D1 복원 한도](https://developers.cloudflare.com/d1/platform/limits/), [D1 내보내기](https://developers.cloudflare.com/d1/best-practices/import-export-data/).

전체 DB 내보내기는 실행 중 다른 DB 요청을 막을 수 있으므로 수집과 겹치지 않는 운영 점검 시간에 수행한다. 초기 스키마에는 내보내기를 제약하는 FTS 가상 테이블을 추가하지 않는다. 화면의 제한된 자료 내보내기와 전체 SQL 백업은 다른 기능으로 구현한다. [공식 내보내기 제약](https://developers.cloudflare.com/d1/best-practices/import-export-data/#known-limitations).

백업에는 스키마 버전·생성 시각·행 수·암호화 파일 해시를 기록한다. 복원은 별도 staging DB에서 먼저 시험하고 날짜별 대표 합계와 current revision을 비교한다. 목표 RPO는 마지막 성공 백업 이후 최대 7일, 목표 RTO는 운영자가 대응하기 시작한 뒤 1영업일이다. 이는 초기 수동 운영 목표이며 공급자 SLA가 아니다. 실제 백업 누락 시 달성하지 못한 기간을 기록한다.

## 장애와 복구

| 상황 | 처리 순서 |
|---|---|
| Google·Bing 인증 만료 | 해당 연결 중지 표시 → 자격 갱신 → 작은 기간 검증 → 누락 기간 재수집 |
| 일별 수집 누락 | 마지막 성공·Actions 활성화 확인 → 수동 재실행 → 멱등성·누락 범위 확인 |
| 잘못된 공식 파일 | 확정 전 거절 또는 기존 import를 취소 revision으로 기록 → 올바른 파일 재등록 |
| AI 집계 오류 | 잘못된 metricVersion의 카드 표시 중지 → 원본으로 수정 버전 재집계 → 전후 대조 |
| DB quota·크기 초과 | 원본 보존 상태 확인 → 신규 큰 쓰기 중지 → 인덱스·보관 정책 조정 |
| 앱 배포 오류 | 이전 검증 앱 버전으로 롤백 → 호환 DB schema 확인 → 인증·대표 조회 재검증 |
| DB migration 오류 | 쓰기 중지 → 백업·Time Travel의 적합한 시점 검토 → staging 복원 대조 → 운영 복구 |
| 자격 유출 의심 | 관련 자격 폐기·수집 중지 → 새 자격 최소 권한 발급 → 로그·접근 범위 확인 |

앱 롤백이 DB migration을 자동으로 되돌린다고 가정하지 않는다. 환자용 사이트와 관리 앱의 복구를 분리하며 관리 앱 문제 때문에 기존 공개 사이트를 재배포하지 않는다.

## 출시 체크리스트

- [ ] Cloudflare·GitHub 무료 플랜과 계정 공유 사용량·초과 차단 설정을 확인했다.
- [ ] 운영자·서비스 권한과 production/staging 자격이 분리돼 있다.
- [ ] 모든 배포 호스트·API·증거 경로에 무인증·오권한 접근 시험을 수행했다.
- [ ] Google·Bing·GA4의 실제 연결 상태와 미구현·미연결 범위를 정확히 표시한다.
- [ ] 실제 기술 수집 3회 이상과 중복·부분 실패·재실행 검증을 완료했다.
- [ ] 가져온 공식 자료가 있다면 동일 기간·속성·집계 단위의 합계를 원본과 대조했다.
- [ ] 지표에 출처·표본·분모·마지막 성공·잠정·범위 제한을 표시한다.
- [ ] 모호한 0·미측정·실패를 구분하고 질문·모델·도메인 버전이 다른 결과를 섞지 않는다.
- [ ] staging 실측으로 Worker CPU·최대 요청·D1 읽기·쓰기·저장량을 확인했다.
- [ ] 백업을 staging에 복원했고 대표 지표가 일치한다.
- [ ] 로그·artifact·정적 번들에 비밀값·원본 운영 데이터가 없다.
- [ ] 관리 경로가 환자용 원장·검색·sitemap·`web/out/`에 포함되지 않는다.
- [ ] 공유 코드·workflow 변경에 필요한 기존 콘텐츠·export·UI·production gate 검사가 통과했다.
- [ ] 배포 SHA·migration 버전·계정 연결 범위·운영 담당 역할·복구 절차를 기록했다.

## 운영 기록에 남길 항목

실제 실행일, 앱 SHA, 수집기 SHA, DB migration 버전, 대상 URL, 활성 연결, 마지막 성공 시각, 질문 집합·계산 규칙 버전, 실측 무료 자원 사용량, 검증 결과, 미완료 항목을 기록한다. 성과 비교는 관측 기간과 표본에 한정하며 운영 앱 출시를 AI 인용 향상으로 보고하지 않는다.
