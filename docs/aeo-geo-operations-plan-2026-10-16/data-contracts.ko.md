# AEO GEO 데이터와 지표 계약

2026-10-16. [개발계획](README.ko.md)의 데이터 설계다. 필드·API·한도는 구현할 계약이며 현재 동작하는 서비스 설명이 아니다.

## 수집원과 지원 범위

| 연결 식별자 | 1차 방식 | 수집 단위와 제한 |
|---|---|---|
| `technical` | Actions에서 공개 응답 점검과 기존 검사 결과 정규화 | 배포 SHA·URL·점검 시각. HTTP·robots·canonical·sitemap 상태이며 실제 색인이 아님 |
| `gsc_search` | 인증된 Search Analytics API | 날짜별 속성 합계와 페이지별 통계를 별도로 조회. 클릭·노출·CTR·평균 위치 |
| `gsc_inspection` | 권한 확보 후 URL Inspection API 표본 | 대표 URL의 보고된 색인 상태·검사 시각. Live Test나 색인 요청 기능으로 취급하지 않음 |
| `google_ai_export` | 공식 보고서 내보내기 파일 | Google AI 노출. 속성 총계·페이지표·국가표·기기표를 별도 집계 단위로 저장 |
| `bing_ai_export` | 실제 계정에서 확보한 공식 내보내기 파일 | 인용·인용 URL 등 확인된 열만 지원. 파일 형식을 확보하기 전에는 `unsupported` |
| `ai_observation` | 실제 답변 JSON 등록 | 질문·서비스·모델·모드·지역·언어·반복 회차별 답변과 출처 |
| `ga4` | 2차 Data API 연결 | 식별 가능한 유입과 정의된 이벤트의 집계. 검색엔진 AI 노출을 대신하지 않음 |

Google 일반 검색 API의 `web` 값을 AI 전용 성과로 이름만 바꿔 제공하지 않는다. 확인한 공식 API 문서만으로 생성형 AI 전용 보고서 조회 지원을 전제하지 않는다. Google AI 보고서는 공식 내보내기를 사용한다. Bing의 비공개 화면 API를 역공학하거나 사용자의 로그인 쿠키를 수집기로 넘기는 방식은 초기 설계에 포함하지 않는다. [Google Search Analytics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), [Google AI 보고서](https://support.google.com/webmasters/answer/16984139?hl=en), [Bing AI 보고서 범위](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/).

### 기술 점검

현재 배포의 사이트 URL·SHA·매니페스트를 기록한다. 기존 [실배포 검사](../../web/scripts/verify-live.mjs)를 사용한 결과와 단순 HTTP 점검을 구분한다. 같은 실행의 매니페스트가 없으면 HTML 해시 일치 여부는 `unavailable`로 남기고 통과로 표시하지 않는다. 검사 대상 수는 매니페스트에서 읽고 사례·검색·오류 경로의 의도된 noindex를 결함으로 세지 않는다.

점검은 원장에 있는 자사 URL만 대상으로 하며 동시 요청 4개 이하, 요청당 30초 이내로 제한한다. 화면에서 입력한 임의 URL이나 AI 인용 URL을 서버가 자동 방문하지 않는다. 외부 인용 링크는 안전한 HTTPS 링크로 표시하며 응답·내용 검토는 별도 작업으로 남긴다.

### 공식 API 수집

초기 일반 검색 수집은 최근 28일을 한 번 채운 뒤 매일 최근 7일을 다시 조회한다. 월 1회 최근 28일을 재대조한다. API 데이터의 확정·잠정 상태를 저장하고 이미 가져온 날짜도 공급자가 수정하면 새 revision을 만든다. 실제 호출 한도는 [공식 사용 한도](https://developers.google.com/webmaster-tools/limits)와 계정 상태를 확인한다.

Search Analytics는 모든 상세 행 반환을 보장하지 않는다. 페이지표 합계를 속성 총계 대신 사용하지 않고 `coverage=top_rows_or_limited`를 보존한다. URL Inspection은 첫 단계에서 대표 페이지 20개 이하를 주별 점검하며 나머지를 미검사로 남긴다. [API 제한 설명](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect).

Google Search Console 일별 날짜는 공급자의 PT 날짜로 보존한다. 화면의 수집 시각은 KST로 보여줄 수 있지만 이미 일별 집계된 값을 KST 일별 수치로 재분배하지 않는다. GA4의 속성 시간대도 따로 저장한다. 다른 시간대·집계 단위의 값을 합산하지 않는다.

### 파일 가져오기

CSV·JSON과 출처 메타데이터를 받는다. ZIP·XLSX·이미지 OCR은 초기 지원에서 제외한다. Google 내보내기가 여러 파일이면 같은 `reportBundleId`로 묶고 각 파일의 역할과 필터를 확인한다. Bing은 실제 파일과 동의된 비식별 fixture가 확보된 뒤 별도 parser를 구현한다.

Google AI 보고서는 다운로드할 때 화면의 `~` 또는 `-`가 0으로 바뀔 수 있다. 출처의 결측 여부를 확인할 수 없는 내보내기 0은 `ambiguous_zero`로 표시하고 확정된 관측 0으로 단정하지 않는다. 원래 화면·함께 저장한 메타데이터로 확인된 경우에만 판정을 갱신하며 이유를 기록한다. 파일을 등록했다는 사실이 출처의 정확성을 인증하지는 않는다. [공식 내보내기 제한](https://support.google.com/webmasters/answer/16984139?hl=en#exporting_report_data).

## 공통 데이터 봉투

각 수집·가져오기 결과에는 다음 메타데이터를 함께 둔다.

| 필드 | 내용 |
|---|---|
| `schemaVersion`, `metricVersion` | 입력 계약과 계산 규칙 버전 |
| `source`, `surface`, `collectionMethod` | 출처, 검색·AI 제품 범위, `api / official_export / manual_observation / technical_probe` |
| `propertyId`, `siteConfigVersion` | 실제 서비스 속성과 대상 도메인 규칙 |
| `periodStart`, `periodEnd`, `sourceTimezone` | 원본의 집계 기간과 시간대 |
| `observedAt`, `fetchedAt` | 관측 시각과 시스템으로 가져온 시각; 모르면 null |
| `aggregationScope`, `dimensions`, `filters` | property/page/date 등의 집계 단위와 공급자 필터 |
| `sourceStatus`, `coverage`, `qualityFlags` | 잠정·확정, 포함 범위, 데이터 해석 제한 |
| `runId`, `importId`, `revision` | 수집 실행, 가져오기, 정정 이력 |
| `evidenceId`, `payloadHash` | 실제 증거와 파일·정규화 레코드 해시 |
| `collectorVersion`, `gitCommit` | 수집기 버전과 실행 코드 SHA |

단순 해시는 파일 변경·중복 확인 수단이며 공급자가 발행한 전자서명이 아니다. 공식 파일의 소유 속성·기간·표본 합계를 운영자가 대조하는 절차를 유지한다. 모든 응답에 `asOf`, `source`, `status`, `qualityFlags`를 포함한다.

## 상태와 결측값

연결 상태, 실행 상태, 지표 값 상태를 별도 필드로 저장한다. 인증 만료와 정상적인 0을 같은 상태로 표현하지 않는다.

| 분류 | 상태 |
|---|---|
| 연결 | `unconfigured / ready / auth_error / unsupported / disabled` |
| 실행 | `queued / running / succeeded / partial / failed / cancelled` |
| 값 | `measured / not_measured / unavailable / ambiguous_zero` |
| 부가 표시 | `preliminary / stale / limited_coverage / manual_source / needs_review` |

지표가 없으면 `value=null`이다. 성공한 수집이 실제 0을 확인한 경우에만 `value=0, valueStatus=measured`를 사용한다. 실패하면 마지막 성공 자료를 보존하되 그 시각과 갱신 실패를 함께 표시한다. 공식 보고서가 노출 부족 때문에 나타나지 않는 경우도 `unavailable`이며 인용률 0%로 표시하지 않는다.

일별 자동 연결은 마지막 성공 후 48시간, 주별 수동 가져오기는 10일을 넘으면 `stale`로 표시하는 운영 기본값을 둔다. 이 값은 데이터의 사실 여부를 판정하는 기준이 아니라 갱신 필요 안내다.

## AI 관측 계약

기존 73개 질문과 13개 대화 시나리오는 원문·대상 페이지·버전·해시를 보존한다. 신규 20개 핵심 질문은 임의 삭제로 기존 버전을 바꾸지 않고 별도 ID와 목록을 만든다. 브랜드 질문, 지역 질문, 일반 정보 질문, 후속 상담을 구분한다. 사이트 이름과 병원 이름의 별칭도 다른 목록으로 관리한다.

성공 관측은 기존 집계 필드 외에 `queryText`, `queryHash`, `querySetVersion`, `siteConfigVersion`, `observedAt`, `collectionMethod`, `engine`, `model`, `searchMode`, `language`, `region`, `runId`, `answer`, `citations`를 가진다. 모델·지역을 알 수 없으면 `unknown`으로 기록하고 알려진 조건과 합치지 않는다. 입력 검증은 지정된 질문 원문·해시와 실제 발화를 대조한다.

`brandPrompted`, `urlProvided`, `freshConversation`을 기록한다. 자연 발견의 기본 비교에서는 병원명을 유도하거나 URL을 제공한 표본을 제외하고 별도로 보여준다. 다중 대화는 실제 같은 대화의 선행 발화와 턴을 저장하며 첫 질문만 새 대화로 분류한다.

서비스가 정상적으로 반환한 비어 있지 않은 답변은 `status=ok`다. 인용 없는 답변과 거절 답변도 정상 응답의 분모에 남기고 `answerOutcome=answered / refusal / other`로 구분한다. 요청 오류·타임아웃·빈 응답은 `error`로 남긴다. 답변이 불리하다는 이유로 표본을 버리지 않는다.

정확성 판정은 검토 작업으로 입력한다. 로그인한 검토자의 실제 식별자·시각·근거·판정 범위를 저장하고 업로드 파일의 임의 `reviewer` 문자열을 인증된 검토로 승격하지 않는다. 과거 검토 필드는 증거로 보존하되 검증 전에는 `needs_review`다. 의료 주장과 운영 사실을 나누고 실제 자격·검토 없이 의료 검토 완료를 표시하지 않는다.

### 도메인과 URL 귀속

- 신규 사이트는 `https://yttop.kr/`, 원 사이트는 기존 `yttop.co.kr`의 확인된 변형 목록으로 판정한다.
- `codepump-net.github.io/yt-top-webforai/`는 별도 `legacyDeployment`다. 과거 인용을 현행 도메인 인용으로 자동 변경하지 않는다.
- 호스트를 문자열 부분 일치로 검사하지 않는다. 스킴·정규화 호스트·경로 경계를 검사해 유사 도메인과 같은 호스트의 다른 프로젝트를 제외한다.
- `rawUrl`과 집계용 URL을 함께 보관한다. 해시 조각·추적 파라미터 제거 규칙을 버전 관리하고 의미 있는 쿼리는 보존한다. 외부 리다이렉트를 자동으로 따라가 귀속시키지 않는다.
- 신규·원 사이트 합집합은 같은 답변을 한 번만 센다. 병원 전체 언급과 두 사이트 인용은 다른 지표다.

## 지표 정의

| 지표 | 계산 | 표시 조건 |
|---|---|---|
| 신규 사이트 인용률 | 신규 사이트를 한 번 이상 인용한 유효 답변 / 유효 답변 | 유효 답변 0개면 null; 분자·분모 병기 |
| 원 사이트 인용률 | 원 사이트를 인용한 유효 답변 / 유효 답변 | 신규 사이트와 별도 |
| 병원 사이트 합집합 인용률 | 두 사이트 중 하나라도 인용한 유효 답변 / 유효 답변 | 한 답변의 다중 링크를 중복 계산하지 않음 |
| 병원명 언급률 | 병원 별칭이 있는 유효 답변 / 유효 답변 | 브랜드를 지정한 질문과 미지정 질문 분리 |
| 사이트명 언급률 | TOP 건강백과 별칭이 있는 유효 답변 / 유효 답변 | 병원명 지표와 분리 |
| 검토 답변 정확도 | 정확하다고 검토된 답변 / 검토 완료 답변 | 검토 범위·검토 수와 미검토 수 표시 |
| 질문 커버리지 | 유효 관측이 있는 질문 / 해당 평가 집합의 대상 질문 | 언어·하위 집합에 맞는 분모 사용 |
| 요청 실패율 | 실패 요청 / 전체 시도 | 인용률과 별도 |
| 첫 턴·후속 턴 인용률 | 해당 턴 그룹의 인용 답변 / 그 그룹 유효 답변 | 대화 간 조건 동일성 확인 |
| 연속 인용률 | 직전 턴에서 인용하고 다음 유효 턴에서도 인용한 전이 / 직전 인용 뒤 다음 턴이 유효한 전이 | 대화 누락·오류 전이는 제외하고 수 별도 표시 |
| Google AI 노출 | 공식 보고서가 집계한 해당 범위 값 | 임의의 전체 검색 분모로 인용률을 만들지 않음 |
| Bing AI 인용 | 공식 보고서의 지원 범위 값 | 자체 관측 인용 횟수와 합산하지 않음 |
| 일반 검색 CTR | 같은 집계 단위의 클릭 합계 / 노출 합계 | 노출 0이면 null; 행별 CTR 단순 평균 금지 |
| 기술 점검 통과율 | 통과한 점검 대상 / 실제 점검 대상 | 미점검·요청 오류를 숨기지 않음; 실제 색인율 명칭 금지 |

평균 검색 위치는 공급자가 반환한 동일 집계 단위의 값을 사용한다. 임의의 페이지 평균을 다시 단순 평균하지 않는다. 원본에서 집계가 겹치는 property·page·country·device 통계를 합산하지 않는다. 같은 기간의 기존/신규 사이트 데이터를 더한 Google 노출은 사용자 중복이 제거된 병원 전체 도달 수로 취급하지 않는다.

추세는 같은 질문 집합·출처·언어·모델·지역·검색 모드·수집 방식·집계 규칙 사이에서만 비교한다. 조건이 바뀌면 그래프를 나누거나 변경 표식을 둔다. 초기에는 모집단 전체를 대표하는 신뢰구간이나 인과적 개선율을 표시하지 않는다. 질문당 반복 3회는 운영 표본 설계이며 통계적 충분성의 증명이 아니다.

## 저장 모델

D1 SQL migration으로 스키마를 관리한다. 아래는 논리 모델이며 실제 열 타입·인덱스는 계약 검사와 부하 검증을 거쳐 확정한다.

| 테이블 | 주요 내용 | 중복·무결성 규칙 |
|---|---|---|
| `site_configs` | 도메인·별칭·정책 버전 | 버전별 불변; 과거 기록의 FK 유지 |
| `question_sets`, `questions` | 질문·언어·대상·원문 해시·유도 여부 | `(set_version, question_id)` unique |
| `connections` | 출처·속성·연결 상태·마지막 성공 | 비밀 토큰 저장 금지 |
| `collection_runs` | source·scope·코드 SHA·시작·종료·오류·체크포인트 | 실행 키 unique; 재시도는 같은 논리 실행에 연결 |
| `imports` | 파일 역할·기간·원본 해시·검증·확정 상태 | `(source, property, content_hash, parser_version)`로 중복 감지 |
| `evidence_chunks` | 작은 원본 파일·답변 텍스트와 청크 해시 | `(evidence_id, chunk_index)` unique; 공개 URL 없음 |
| `metric_records` | metric·기간·차원·필터·값·revision·증거 | 자연키와 revision unique; current revision만 기본 조회 |
| `observations`, `citations` | 실제 답변·조건·분류된 URL | 관측의 조건+질문+반복 ID unique |
| `accuracy_reviews` | 판정·범위·검토자·시각·이유 | append-only; 정정 시 이전 판정 연결 |
| `technical_checks` | 배포 SHA·경로·항목별 결과 | 실행+URL+검사항목 unique |
| `audit_events`, `job_requests` | 가져오기·검토·설정 이력, 재수집 요청 | 행위자·시각 기록; 대기 작업 중복 제한 |

조회 인덱스는 source/property/date, scope/date, question-set/engine/date, import/status에 둔다. 날짜 범위·limit 없는 API 조회를 허용하지 않는다. 변경 전후 데이터가 함께 보이는 단계적 migration을 사용하고 운영 중 테이블 DROP을 기본 절차로 삼지 않는다.

`metric_records`의 자연키는 source + property + metric + source date/period + timezone + aggregationScope + 정렬된 dimensions/filters의 해시다. 같은 자연키의 새로운 공급자 값은 정정 revision으로 연결하며 이전 revision과 중복 합산하지 않는다. 다른 parser로 같은 파일을 재처리할 때도 새 원본 수집으로 세지 않는다.

## API와 권한

`viewer`는 조회, `operator`는 가져오기·재수집 요청, `reviewer`는 실제 담당 범위의 정확성 검토, `owner`는 설정·백업을 수행한다. 한 사람이 여러 역할을 가질 수 있다. 서비스 자격은 수집 결과 등록에만 사용한다.

| 메서드와 경로 | 역할 | 동작 |
|---|---|---|
| `GET /api/v1/summary` | viewer 이상 | 기간별 카드와 품질 상태 |
| `GET /api/v1/pages`, `/observations`, `/runs` | viewer 이상 | cursor 기반 목록과 필터 |
| `GET /api/v1/observations/:id`, `/evidence/:id` | viewer 이상 | 답변·증거; 권한·범위 검사 |
| `POST /api/v1/imports` | operator | 출처·기간·파일 manifest 등록 |
| `POST /api/v1/imports/:id/chunks` | operator | 제한 크기 원본·정규화 청크 등록 |
| `POST /api/v1/imports/:id/commit` | operator | 모든 청크 검증 후 한 번 확정 |
| `POST /api/v1/observations/:id/reviews` | reviewer | 검토 이력 추가; 행위자는 인증 정보에서 결정 |
| `POST /api/v1/job-requests` | operator | 고정 작업 재수집 요청 등록 |
| `POST /api/v1/exports` | owner | 범위가 제한된 백업·내보내기 작업 생성 |
| `GET /api/ingest/v1/jobs` | 지정 서비스 | 허용된 수집 작업 ID·기간만 반환 |
| `POST /api/ingest/v1/runs`, `/batches`, `/commit` | 지정 서비스 | 수집 실행·작은 배치·확정; 운영자 UI 접근 불가 |

API 버전은 `/v1`로 시작한다. 기본 페이지 크기는 50건, 최대 100건, 일반 조회 기간은 최대 90일로 둔다. 데이터 내보내기는 cursor로 나눈다. 일반 쓰기 본문은 64KiB·최대 25레코드, 원본 파일은 총 1MiB로 제한하고 더 큰 파일은 출처의 기간·페이지별 내보내기로 나눈다. 이 한도는 무료 CPU 시험 결과에 따라 낮출 수 있다.

임의 외부 URL 실행, 임의 SQL, 임의 GitHub workflow 실행 API를 만들지 않는다. `job-requests`는 서버에 등록된 작업·출처·기간만 허용한다. 화면은 요청이 대기 중인지 실제 시작됐는지 구분한다. 당장 실행이 필요하면 권한 있는 운영자가 GitHub의 수동 실행을 이용한다. 앱에 GitHub 쓰기 토큰을 추가하는 즉시 실행 기능은 이후 검토한다.

오류는 `code`, `message`, `requestId`, `retryable`을 반환하며 원문 토큰·전체 답변을 오류 로그에 넣지 않는다. 앱 수준에서 미인증 401, 권한 부족 403, 잘못된 입력 422, 충돌 409, 크기 초과 413, 제한 429를 구분한다. Access가 먼저 로그인 페이지나 거절 응답을 반환하는 경우도 클라이언트가 감지한다.

## 멱등성과 부분 실패

1. 정규화와 원본 보존을 분리한다. 원본 청크의 해시·순서를 서버에서 확인하고 결합 manifest에 연결한다.
2. `Idempotency-Key`와 본문 해시를 저장한다. 같은 키·같은 본문 재요청은 기존 결과를 반환하고 다른 본문은 409로 거절한다.
3. 수집 배치는 staging 상태로 저장한다. 필수 청크·레코드 수·출처·계약 버전을 확인한 뒤 작은 트랜잭션으로 현재 revision 포인터를 변경한다. 미완료 import의 행은 기본 지표 조회에서 제외한다.
4. 일부 페이지 조회에 실패하면 `partial`로 종료하고 범위·실패 수를 남긴다. 전체 실패와 부분 결과를 같은 성공으로 처리하지 않는다.
5. 동시 수집은 source/property/scope 잠금 키로 직렬화한다. 재시도는 지수 지연·jitter와 `Retry-After`를 적용하며 인증 실패는 무한 재시도하지 않는다.
6. 브라우저·수집기가 제시한 합계를 그대로 신뢰하지 않는다. 서버는 레코드 계약·분류를 검사하고 저장된 현재 레코드에서 SQL 또는 검증된 집계 코드로 값을 산출한다.

## 입력과 증거 안전성

업로드 파일명·셀·답변·인용 제목을 실행 가능한 HTML로 렌더링하지 않는다. 링크는 허용된 `http/https`만 받고 새 창에는 적절한 `rel`을 적용한다. CSV 내보내기는 수식 실행 문자를 이스케이프한다. 가져오기는 schema·열 이름·타입·날짜·속성·최대 크기를 검사한다.

사용자가 입력한 계정 이메일은 인증·운영 목적의 최소 범위로 처리한다. 환자의 사연·식별정보나 건강상담 입력을 실험 데이터로 받지 않는다. 운영 원본을 테스트 fixture로 복사하지 않으며 `synthetic=true`인 합성 자료는 운영 DB 등록을 거절한다.

보관 기간과 백업은 [배포와 운영 절차](operations.ko.md)를 따른다. 기간이 지나 증거를 삭제한 집계에는 `evidence_expired`를 표시하고 더 이상 원문 검증이 가능한 것처럼 보이지 않게 한다.
