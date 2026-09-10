# 영통탑내과 전체 홈페이지 상세 실행 계획

작성일 **2026-09-11** · 계획 v1.1 · 기술 기반: [개발 스펙 v1.0](../website-spec.ko.md). **검토 후 전체 개발을 연속 수행하기 위한 실행 문서**다. 이번 작업에서는 사이트나 GitHub 설정을 변경하지 않았다.

## 1. 이번 계획에서 확정한 범위

전체 정보 구조를 **구체적인 주소 76개**로 펼쳤다. 병원·의료진·진료·검진·내시경·건강정보·정책·탐색 페이지와 기존 공지 5개·증례 25개를 포함한다. 기존 19개 서비스는 모두 대응 경로가 있으며, 크롤링한 145개 URL 전체에 이관 또는 폐기 결정을 배정했다.

| 문서·데이터 | 개발자가 사용하는 목적 |
|---|---|
| [페이지별 상세 계획](page-details.ko.md) | 76개 각각의 목적·메타 초안·본문 순서·질문·원문·이미지·내부 링크·개별 검수 |
| [사이트맵](sitemap.ko.md) | 전체 계층과 공개 범위 확인 |
| [페이지 계획 JSON](page-plans.json) / [행렬 CSV](page-matrix.csv) | ID·주소·템플릿·입력 파일·관련 페이지를 구현 데이터와 대조 |
| [전체 기존 URL 대응표](legacy-url-map.csv) | 145개 URL의 쿼리·별칭·페이지네이션 정리 |
| [이미지 계획](assets.ko.md) / [페이지별 이미지 후보](page-asset-candidates.csv) | 실제 원본 파일·출처·처리·공개 조건 확인 |
| [배포 workflow 설계 파일](deploy-pages.yml.example) | main 변경 → 검사 → 정적 빌드 → Pages 자동 배포 구현 |
| [검토 결정표](decisions.csv) | 기존 자료의 충돌·최초 배포 설정을 개발 중 잃지 않도록 관리 |
| [기존 완료 기준](../acceptance-criteria.csv) | 34개 검사와 본 계획의 페이지별 조건 결합 |

**76개는 구현·검토할 전체 페이지 수이지 무조건 공개할 수량이 아니다.** 의료·운영 검수와 사례 재사용 조건을 충족한 페이지를 공개 manifest에 넣는다. ‘일괄 개발 완료’는 76개 페이지의 코드·원고·이미지·판정이 모두 정리된 상태이고, ‘공개 완료’는 승인된 페이지의 자동 배포와 실제 URL 확인까지 끝난 상태다. 제외된 페이지는 이유와 후속 조건을 결과 보고서에 남기며 전체 공개 완료라고 과장하지 않는다.

P0 21개·P1 28개·P2 27개는 **한 번의 개발 프로젝트 안에서 구현할 순서**다. 이전 스펙의 후속 범위를 이번 계획에서 함께 구현 대상으로 구체화했다. P2 증례도 마지막 단계에서 전부 검토하되 공개 적합성을 통과한 항목만 게시한다.

## 2. 실제 저장소와 배포 목표

2026-09-11 읽기 전용 확인 결과:

| 항목 | 확인값 |
|---|---|
| 저장소 | `codepump-net/yt-top-webforai` |
| 원격 | `https://github.com/codepump-net/yt-top-webforai.git` |
| 기본 브랜치 | `main` |
| 공개 범위 | PUBLIC |
| 현재 CLI 계정 권한 표시 | WRITE — Pages 최초 생성 권한까지 보장하는 값은 아님 |
| Pages 조회 | HTTP 404. 미설정 또는 해당 조회 권한 문제를 구분하여 확인해야 함 |
| 프로젝트 배포 목표 URL | `https://codepump-net.github.io/yt-top-webforai/` — 배포 예정 주소 |
| 빌드 설정 | `SITE_ORIGIN=https://codepump-net.github.io`, `SITE_BASE_PATH=/yt-top-webforai` |
| 운영 대표 도메인 | 기존 `yttop.co.kr` 유지/교체 여부 미확정. DNS 변경은 이번 계획 작업에서 수행하지 않음 |

검토 후 실행 범위에는 **Actions 설정·Pages 활성화·자동 배포·배포 후 확인**을 포함한다. 구현 중 이미 부여된 권한으로 가능한 설정은 계속 진행한다. 권한이 실제로 부족할 때만 실패한 작업과 필요한 권한을 구체적으로 보고한다. 단순히 모든 배포에 추가 대화상 확인을 넣는 절차는 만들지 않는다.

Pages 이용 제한과 병원 운영 사이트의 용도 적합성은 이전 스펙의 조건을 유지한다. 병원 홍보·예약 중심 운영이 허용되는지는 호스팅 정책에 따라 판단해야 한다. 별도 호스팅이 필요해도 React 정적 산출물을 그대로 이전할 수 있게 만들며, 그 경우 ‘Pages 운영 배포 완료’로 기록하지 않는다. [GitHub Pages 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## 3. 전체 화면 구성과 사용자 동선

전역 헤더: 기존 로고 → 병원 소개 → 의료진 → 진료·검사 → 건강검진 → 이용 안내. 보조 탐색: 건강정보·진단 사례·공지·전체 페이지·검색. 모바일 하단: 전화 / 오시는 길. 검사별 상세에서는 준비 안내와 관련 의료진을 문맥에 맞춰 연결한다.

세 가지 대표 방문 경로를 기준으로 화면을 검수한다.

1. **처음 방문:** 홈 → 진료 분야 → 의료진 → 방문 안내 → 전화/지도.
2. **검사 준비:** 검진 또는 내시경 → 해당 검사 → 준비 설명 → 미확인 조건을 병원에 문의.
3. **정보 탐색:** 검색 유입 → 검사 비교/증상 설명 → 조건·한계·근거 확인 → 관련 진료. 긴급 증상은 의료진이 확정한 긴급 행동을 우선 제공.

카드·목록·본문 링크는 동일한 공개 route manifest로 만든다. 공개하지 않은 페이지로 연결되는 메뉴·관련 글·검색 결과·breadcrumb은 빌드 때 제거하고, 필수 동선에 목적지가 없으면 빌드를 실패시킨다.

## 4. 콘텐츠 소유권과 중복 방지

| 정보 | 본문을 소유하는 페이지 | 다른 페이지에서의 표현 |
|---|---|---|
| 주소·전화·요일별 시간 | `/visit/`과 병원 원장 | 공통 원장을 참조한 짧은 요약 |
| 의료진 경력·자격 | 개인 프로필 2개 | 이름·전문과목·프로필 링크만 재사용 |
| 검사 제공 범위·예약·결과 | 해당 서비스 상세 | 허브는 비교 요약과 링크 |
| 검진 대상·준비물·서류 | 검진별 상세 | 홈·허브는 목적별 안내 |
| 심장검사 비교 | `/health/heart-test-differences/` | 검사 상세는 비교 핵심 1문단과 연결 |
| 검사 후 두근거림 질문 | `/health/palpitations-test-followup/` | 홀터 상세는 검사 포착 한계 요약 |
| 검진 준비 확인표 | `/health/checkup-preparation-checklist/` | 검진 상세는 해당 검사에만 필요한 조건 |
| 대장내시경 준비 질문 | `/health/colonoscopy-preparation-questions/` | 내시경 상세는 준비 문서 링크와 핵심 조건 |
| 가격·이벤트 | 가격 원장 및 `/fees/`·기간 공지 | 다른 페이지에 숫자 자유 입력 금지 |
| 과거 사례·장비 도입 | 개별 사례·공지 | 일반 효과나 현재 운영에 대한 근거로 자동 확대하지 않음 |

별도의 대형 `/faq/`에 모든 답변을 다시 모으지 않는다. 페이지별 질문은 해당 문맥에서 읽히게 하고 전체 검색은 공개 문서의 동일 본문을 색인한다. 외부 Q&A는 질문을 설계하는 참고이며 원문 답변과 ‘고빈도’ 주장을 옮기지 않는다.

Google 공식 안내가 강조하는 독자에게 유용한 고유 정보와 검색 접근성을 적용한다. 질문 변형·지역명별 유사 페이지 대량 생성, 봇 전용 의료 사실, 특수 AI 파일을 이용한 순위 보장은 요구사항에서 제외한다. [Google 생성형 검색 안내](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

## 5. 구현 파일·컴포넌트 계약

### 페이지 라우팅

`web/src/app/layout.tsx`에 언어·공통 스타일·헤더·푸터를 둔다. 홈 `app/page.tsx`, 404 `app/not-found.tsx`, 나머지 문서 경로 `app/[...segments]/page.tsx`를 기본으로 한다. 이 단일 catch-all은 페이지별 HTML을 만드는 **빌드 시 라우트 목록 처리기**이며 CSR fallback이 아니다.

`generateStaticParams()`는 공개 manifest의 `/`·`/404.html` 이외 경로를 segment 배열로 반환한다. `dynamicParams=false`를 사용하고 등록되지 않은 주소는 실제 404가 된다. `generateMetadata()`와 페이지 본문은 동일 ID 조회 함수를 쓴다. `notFound()`가 필요한 조회 실패와 공개 제외를 테스트한다. `/sitemap.xml`·`robots.txt`는 후처리 단계에서 생성해 메타 route와 이중 생성하지 않는다.

이 구조는 Next.js의 정적 export에 맞춘 프로젝트 선택이다. 기본 `output: export`, `trailingSlash: true`, root/subpath 검증을 유지한다. 서버 API·ISR·서버 이미지 최적화·redirect 설정으로 Pages 기능을 대신하지 않는다. [Next.js 정적 내보내기](https://nextjs.org/docs/app/guides/static-exports).

### 공통 UI

| 컴포넌트 | 입력 | 반드시 처리할 상태 |
|---|---|---|
| `SiteHeader`·`SiteFooter` | 병원 원장·navigation manifest | 긴 병원명·모바일 메뉴·현재 경로·정책 링크 |
| `PageHero` | H1·도입 설명·허용 이미지·CTA | 이미지 없는 화면·긴 한국어 제목·모바일 비율 |
| `AnswerSummary` | 질문·답변·조건·제한 | 단독 인용 시에도 대상과 한계가 남는 문장 |
| `SectionRenderer` | 타입이 있는 본문 블록 배열 | 허용하지 않은 블록·HTML 입력은 빌드 오류 |
| `ClinicFacts` | 병원 원장 참조 | 정규 시간·점심·접수·예외 구분; 미확인 값을 임의로 보충하지 않음 |
| `PhysicianCard`·`ReviewerLine` | 개인 ID·현재 상태·검수 기록 | 실루엣·사진 없음·검수 기록 없음 |
| `ServiceComparison` | 항목·평가 대상·한계·관련 경로 | 모바일 가로 넘침·자가진단으로 읽히는 표현 |
| `PreparationSteps` | 검사/프로토콜 ID·버전·조건 | 지침 미승인·약제 차이·적용 시각 차이 |
| `QuestionSection` | 질문별 답변·조건·근거 | 중요 안내 기본 펼침·전체 본문 HTML 존재 |
| `EvidenceList` | 주장 ID·출처 ID | 끊긴 참조·대상/시점 불일치 |
| `RelatedLinks`·`Breadcrumbs` | 공개 manifest ID | 비공개 대상 제거·홈 제외 breadcrumb |
| `NoticeStatus` | 게시일·적용 기간·기준 시각 | 종료·예정·현재 상태; 재빌드 날짜와 구분 |
| `CaseLimits` | 원문 범위·의료 검수·사용 조건 | 사례 결과를 일반 치료 효과로 표시하지 않음 |
| `SearchPanel` | 정적 색인 URL | 로딩·빈 결과·오류·키보드·쿼리 미전송 |
| `JsonLd` | 화면과 동일한 검증된 엔터티 | 안전한 직렬화·없는 가격/평점/검수자 미생성 |

본문 블록은 `prose`, `fact-list`, `comparison-table`, `steps`, `questions`, `image`, `callout`, `citations`, `related-links`로 제한한다. 단락별 제목은 페이지 계획의 `ordered_sections`를 사용하되, 집필자가 실제 내용을 만들고 출처를 연결한다. JSON만으로 의미 없는 문장을 자동 채우지 않는다.

### 데이터 처리 파이프라인

`content/clinic.json`, `physicians.json`, `services.json`, `sources.json`, `assets.json`, `reviews.json`, `pages/{id}.json`, `bodies/{id}.md`를 편집 입력으로 정한다. 이번 상세 계획의 이 파일명이 이전 v1 스펙의 예시 폴더명보다 우선한다.

1. Zod로 필드·ID·URL·날짜·명시적 null을 검증한다.
2. Markdown을 안전하게 파싱하고 주장을 `claimId → sourceIds`로 연결한다.
3. 병원 사실·프로필·권리·의료 검수의 유효성을 확인한다.
4. 승인된 페이지만 `src/generated/public-content.json`과 `route-manifest.json`에 넣는다.
5. Next.js는 이 두 생성 파일만 읽는다. `research/`를 glob으로 import하지 않는다.
6. HTML 생성 후 같은 manifest로 sitemap·사람용 사이트맵·정적 검색 색인을 만든다.
7. 실제 HTML과 manifest·검수 digest·asset 목록이 맞는지 감사한다.

기존 Python 하네스의 v1 검사로는 날짜 예외·서비스·권리 등 v2 전체를 검증하지 못한다. 호환 부분은 어댑터로 검사하고 추가 필드는 별도 검사하며, v1에 없는 필드를 버려 통과시키지 않는다. `npm run harness-check`의 실패는 release 실패다.

## 6. 전체 개발 작업 순서

다음 순서는 구현 의존 관계다. 각 작업을 완료하면 같은 실행 흐름에서 다음 작업으로 진행한다. 별도 에이전트 위임이나 매 단계 사용자 승인을 요구하는 계획이 아니다.

| 작업 ID | 구현할 내용 | 산출물·완료 검사 |
|---|---|---|
| T01 | 저장소·현재 변경 보존, Node 24·Next 16·React 19·Tailwind 4의 지원 패치 고정 | lockfile·도구 버전 기록·기존 하네스 회귀 검사 |
| T02 | 앱 디렉터리·정적 export·`basePath`·공통 URL 함수 | 루트와 `/yt-top-webforai`에서 샘플 정적 페이지 직접 접근 |
| T03 | 콘텐츠 v2·승인·만료·참조·페이지 manifest 검사 | 누락된 사실·잘못된 참조·이전 승인 해시의 실패 테스트 |
| T04 | 기존 원문 145개와 자산 원장에서 이관 초안 작성 | 19개 서비스·2명 의료진·30개 게시물·충돌 목록 대조 |
| T05 | 로고·병원 사진·인물·검사 이미지 선택 및 반응형 파생본 생성 | [이미지 계획](assets.ko.md)의 source manifest·해시·용량·alt |
| T06 | 토큰·헤더·푸터·메뉴·본문 블록·CTA·프로필·근거 컴포넌트 | 모바일·키보드·한국어 레이아웃 대표 화면 |
| T07 | P0 21개 계획의 원고와 화면 구현 | 홈·방문·의료진·대표 심장검사·국가검진·공지·정책·404 |
| T08 | P1 28개 구현 | 나머지 서비스·내시경 3개·건강 설명 4개·비용·전체 페이지 |
| T09 | P2 27개 구현·개별 판정 | 사례 허브·25개 사례·정적 검색; 사례별 비식별·근거·현재 공개 여부 기록 |
| T10 | 메타·엔터티·XML·HTML 사이트맵·정적 검색·URL 대응 검증 | 중복 canonical·prefix·미공개 내부 링크·고립 문서 없음 |
| T11 | 검사 자동화·의료/운영 대조·전체 화면 점검 | [34개 완료 기준](../acceptance-criteria.csv)과 페이지별 추가 조건 결과 |
| T12 | Pages 최초 설정 및 Actions 구현 | 빌드/배포 권한 분리·main 자동 배포·업로드 경로 `web/out` |
| T13 | 실제 자동 배포 실행·URL 검증·롤백 훈련 | Actions run URL·배포 URL·HTTP 검사·SHA·artifact manifest |
| T14 | 검색 도구 설정과 AEO/GEO 관측 기준선 | 확인 가능한 범위의 등록·sitemap 제출 기록; 미측정은 미측정 표시 |

화면·컴포넌트는 자료 검수가 진행 중이어도 preview 원고로 구현할 수 있다. 단, **검수 대기 페이지를 승인된 의료정보처럼 공개해 개발 완료를 맞추지 않는다.** 해결 불가능한 병원 운영 입력은 페이지별 상태로 남기고 배포 가능한 범위와 별도로 보고한다.

## 7. 정적 검색·사이트맵·엔터티의 구현 상세

정적 검색은 초기에 공개 페이지가 100개 미만인 점을 고려해 작은 JSON 색인과 브라우저 검색으로 구현한다. 색인 필드는 `id`, `path`, `title`, `headings`, `excerpt`, `normalizedText`, `category`다. NFKC·공백 정규화 후 제목→제목/질문→본문 순으로 가중한다. ‘홀터/24시간 심전도’ 같은 동의어는 의료진이 확인한 수동 목록만 추가한다. 검색어는 서버·분석 도구에 보내지 않는다. 모든 결과 링크에 basePath를 정확히 적용한다.

사이트맵 생성 규칙은 [사이트맵 문서](sitemap.ko.md)에 있다. 사이트맵 포함 여부와 사이트 내부 공개 여부는 다를 수 있다. 검색 페이지·404·종료 휴진 기록은 XML에서 제외한다. `planned-sitemap.xml`을 운영에 복사하지 않고 빌드가 승인 manifest로 새로 생성해야 한다.

병원 `@id`는 확정된 대표 사이트의 `#clinic`, 개인은 프로필 URL의 `#person`, 페이지는 canonical의 `#webpage`로 구성한다. 공통 graph에는 `WebSite`와 `MedicalClinic`을 두고, 의료진은 `Person`, 임상 설명은 `MedicalWebPage`, 공지·정책은 `WebPage`, 목록은 `CollectionPage`를 기본으로 한다. 프로필 `ProfilePage`는 실제 화면에 소개된 주체를 `mainEntity`로 연결한다. 구조화 데이터의 유효성이 검색 특수 표시나 인용을 보장하지 않는다.

날짜·기관·의료진 정합성은 모든 페이지에서 같은 원장으로 유지한다. FAQ를 추가했다는 이유로 리치 결과 성과를 주장하지 않는다. 기존 연구의 [FAQ 정책 확인](../../research/2026-09-11-korean-medical-qa/reference.ko.md)을 적용한다.

## 8. Actions 자동 배포의 구체적 동작

참고 파일 [deploy-pages.yml.example](deploy-pages.yml.example)은 실행 파일이 아니다. T12에서 구현한 명령·검증 로직에 맞춰 `.github/workflows/deploy-pages.yml`로 옮긴다. PR용 `ci.yml`은 같은 검사 명령을 실행하되 배포 권한·Pages 업로드·운영 배포 job을 갖지 않는다.

명령 모드를 명확히 구현한다. `content:validate`는 구조·참조의 항상 필요한 검사를 수행하고, `build:preview`는 미검수 원고를 표시한 로컬 검토본을 만든다. `build:release`는 콘텐츠·권리·검수·만료를 다시 검사한 뒤 이미지 준비 → 공개 데이터 생성 → Next.js export → 메타 파일·검색 색인 생성을 순서대로 수행한다. PR에는 아직 승인되지 않은 원고가 있을 수 있으므로 preview 검사와 release 게이트를 구분한다. `verify:live`는 문서 9절의 실제 배포 전체 경로 검사를 구현한다.

| 항목 | 동작 |
|---|---|
| 자동 트리거 | main push. `web/**`, `content/**`, `harness/**`, workflow 변경을 포함; 내용 삭제도 포함 |
| 정기 갱신 | 필요 시 매일 00:17 KST에 해당하는 `17 15 * * *` UTC schedule. 실행 지연 가능성을 운영에서 고려 |
| 수동 재실행 | `workflow_dispatch`; 검증을 건너뛰는 입력은 만들지 않음 |
| 빌드 job | 설치 → 콘텐츠/하네스/타입/lint → 테스트 → release build → HTML·경로·검색·이미지 감사 → E2E/성능 |
| 배포 job | 성공한 build artifact를 받아 deploy-pages 실행. `pages: write`·`id-token: write`는 이 job에만 |
| 공개 환경 설정 | 초기 `SITE_INDEXING_ENABLED=false`; 도메인과 콘텐츠 공개 검토 후 `true`. 매 push마다 수동 배포 승인 요구 없음 |
| 실패 | 배포 전 실패는 기존 사이트 유지. 배포 직전 원격 main SHA와 빌드 SHA를 대조해 오래된 작업의 배포를 차단. 배포 후 실패는 실패 상태·검사 로그를 남기고 검증한 이전 버전 복구 |
| 완료 증거 | Git SHA·콘텐츠 digest·artifact 파일 목록·Actions run·실제 URL 검사 |

최초 Pages 설정은 저장소 Settings 또는 공식 API에서 `build_type=workflow`로 설정한다. 404를 무조건 미설정이라고 판단하지 않고 저장소 권한과 기존 Pages 상태를 먼저 확인한다. 이 설정에는 일반 콘텐츠 write와 별도의 권한이 필요할 수 있다. 이후 배포는 workflow의 토큰·OIDC로 수행하며 정적 코드에 PAT를 넣지 않는다. [Pages 최초 생성 API](https://docs.github.com/en/rest/pages/pages#create-a-github-pages-site), [공식 Actions 배포](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

기본 브랜치 push의 artifact는 `web/out/`만 담는다. 현재 PUBLIC 저장소이므로 커밋할 파일도 명시적으로 선택한다. 기존 연구용 HTML·OCR·환자 사례 원문·검사 이미지 전부를 `git add .`로 공개하지 않는다. 사용하기로 정한 웹용 이미지 파생본과 공개 원고만 앱 입력에 포함한다. 이는 사용자 요청에 따른 기존 자료 이관과 공개 범위를 정확히 관리하기 위한 절차다.

## 9. 배포 후 실제 검증과 인수 조건

`postdeploy` 검사는 `https://codepump-net.github.io/yt-top-webforai/`를 기준으로 수행한다. 배포 반영 지연은 최대 횟수·대기 상한을 둔 재시도로 처리한다. HTML의 publish manifest 해시가 배포 SHA와 일치한 뒤 검사를 시작한다.

1. 공개 manifest의 **모든 페이지** HTTP 200·본문 제목·canonical·robots 메타 검사.
2. 존재하지 않는 임의 URL은 실제 404. 대표 심층 URL 새로고침 성공.
3. 링크·폰트·이미지·정적 검색 JSON이 올바른 프로젝트 경로에서 200인지 확인.
4. 모바일 홈·방문·의료진·심장검사·내시경·사례·검색을 브라우저로 확인.
5. 전화·지도 링크와 표시된 병원 사실을 대조. 환자에게 실제 전화나 예약을 발생시키는 검사는 자동화하지 않음.
6. 운영 색인 모드와 XML·HTML 사이트맵·canonical이 일치하는지 확인.
7. `release-report.md`에 구현 76개 중 공개·보류·제외 개수, 사유, 실제 배포 URL, 테스트 결과를 기록.

프로젝트 Pages 경로는 기존 `yttop.co.kr`의 HTTP 리디렉션을 제어하지 못한다. [145개 URL 대응표](legacy-url-map.csv)는 이전 서버 설정용 입력이며 아직 리디렉션을 실행한 결과가 아니다. `/49`는 푸터 중심 중복 페이지로 폐기 후보이고, 나머지는 새 경로가 정해져 있다. 대상이 미승인일 때는 기존 URL을 무조건 빈 신규 페이지로 보내지 않는다.

완료 판정은 **코드·원고·이미지·검수·자동 배포·실제 URL 검사**를 모두 포함한다. 배포 URL이 열리는 것만으로 SEO/AEO/GEO 최적화가 입증된다고 판단하지 않는다. 검색 색인과 AI 인용·사실 정확도는 배포 후 [측정 지침](../../harness/measurement.md)에 따라 관측하고 초기 데이터가 없으면 성과 수치를 만들어 쓰지 않는다.
