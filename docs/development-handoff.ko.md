# 영통탑내과 정적 홈페이지 개발·운영 인수 문서

작성일: 2026-09-11. 실제 구현의 기준 문서입니다. 사전 개발 계획과 다른 점은 이 문서와 코드가 우선합니다.

## 구현 결과

Next.js 16.3.4 App Router, React 19.3.0, TypeScript, Tailwind CSS 4.3.3을 사용했습니다. `output: export`로 모든 페이지의 HTML을 미리 생성합니다. Node.js 24는 개발·빌드에만 필요하며 배포된 사이트는 서버 API나 데이터베이스 없이 동작합니다. 버전의 정확한 설치 결과는 `web/package-lock.json`에 고정했습니다.

ESLint는 Next.js 구성에 포함된 React·접근성 플러그인의 호환 범위에 맞춰 9.39.5에 고정했습니다. ESLint 10은 해당 플러그인과 실제 실행 오류가 있어 사용하지 않습니다. 추후 플러그인 호환 업데이트 후 함께 올립니다. Prettier 3.9.6으로 소스 형식을 정리했습니다.

총 76개 계획 경로를 구현했습니다. 병원 소개, 의료진 2명, 심장·초음파·내시경·내과 진료, 검진 안내, 건강정보 4편, 사례 25편, 공지 5편, 방문·비용·작성원칙·개인정보·검색·전체 페이지·404를 포함합니다. Next.js가 별도로 만드는 내부 오류 페이지는 이 수에 포함하지 않습니다.

홈페이지는 실제 병원 전경과 로고, 의료진 소개 이미지를 사용합니다. 로고 1개, 병원 전경 2개 크기, 의료진 소개 2개를 WebP로 변환했으며 전체 합계 115,256바이트입니다. 박라영 원장 이미지는 기존 사이트의 실루엣이므로 실제 인물 사진으로 표시하지 않습니다. 출처 URL·원본과 결과물의 SHA-256·크기는 `content/assets.json`에서 확인합니다. 환자 검사 이미지와 원본 사례 본문은 배포하지 않습니다.

## 파일과 수정 지점

| 대상 | 파일 | 변경 시 확인 |
|---|---|---|
| 76개 페이지 원고·질문·출처·관련 링크 | `content/pages.json` | 제목·요약·본문·출처를 함께 수정, 검수 갱신 |
| 연락처·주소·진료시간·예약 안내 | `content/clinic.json` | 현재 운영 확인, 전체 페이지 재검수 |
| 의료진 이력 | `content/physicians.json` | 현재 소속·전문 분야와 실제 소개 이미지 확인 |
| 이미지 이력·해시 | `content/assets.json` | 실제 파일과 해시 일치 |
| 실제 검수 이력 | `content/reviews.json` | 현재 빈 배열, 승인 이력 창작 금지 |
| 관측용 질문 20개 | `content/measurement-queries.json` | 빈도 검증 자료가 없는 편집 질문 집합 |
| 화면·헤더·방문 안내 | `web/src/components/` | 모바일·키보드·정적 HTML 검사 |
| 메타·JSON-LD·URL | `web/src/lib/site.ts`, `urls.mjs` | 루트와 하위 경로를 함께 검사 |
| 빌드·검증·실측 | `web/scripts/` | `build`, `audit`, `performance`, `verify-live` |
| Actions 자동 배포 | `.github/workflows/pages.yml` | main push와 PR 검사, main만 배포 |

정적 페이지 경로는 `content/pages.json`을 단일 원장으로 사용합니다. `[...segments]`에서 `generateStaticParams`로 경로를 만들고, 동일 데이터로 제목·canonical·본문·관련 링크를 생성합니다. 전화 링크도 병원 연락처 데이터에서 만듭니다. 일반 페이지의 탐색과 모바일 메뉴, 질의응답 펼치기는 JavaScript 없이 동작합니다. 사이트 검색만 React 클라이언트 상태로 처리하며 검색어나 환자 정보를 외부에 보내지 않습니다.

## 실행

PowerShell에서 저장소 루트를 기준으로 실행합니다.

```powershell
Set-Location web
npm ci
npm run dev
```

개발 서버는 `http://localhost:3000`입니다. 실제 배포 결과를 확인하려면 아래 정적 빌드를 사용합니다.

```powershell
$env:SITE_ORIGIN = 'https://codepump-net.github.io'
$env:SITE_BASE_PATH = '/yt-top-webforai'
npm run build
npm run serve
```

로컬 정적 검토 주소는 `http://127.0.0.1:3000/yt-top-webforai/`입니다. 이 빌드의 canonical은 배포 예정 주소를 가리킵니다. 루트 배포 검증은 `SITE_BASE_PATH=''`로 다시 빌드합니다. 환경 변수는 빌드 시 결정되므로 경로나 도메인을 바꿀 때 반드시 재빌드합니다. 브라우저 URL의 수동 변경이나 Pages 설정만으로 기존 HTML의 canonical이 바뀌지 않습니다.

```powershell
npm run content:validate
npm run lint
npm run typecheck
npm test
npm run harness-check
npm run test:e2e
npm run test:performance
```

Windows 브라우저 검사는 설치된 Microsoft Edge를 사용합니다. Linux CI는 Playwright Chromium을 설치합니다. 성능 검사는 압축 전송을 지원하는 로컬 정적 서버에서 모바일 Lighthouse를 실행합니다. 결과는 `web/reports/`, 실패 추적은 `web/test-results/`, 브라우저 보고서는 `web/playwright-report/`에 기록합니다. 이 폴더들은 git에 넣지 않고 Actions artifact로 보관합니다.

## SEO·AEO·GEO 구현 범위

| 목적 | 구현 |
|---|---|
| 정적 문서 발견·해석 | 페이지별 HTML, 한국어 lang, h1 한 개, 제목·설명·canonical, 절대 OG URL |
| 답변에 필요한 정보 구조 | 핵심 답변, 검사 목적·준비·한계, HTML 질의응답, 문서 내 목차 |
| 병원·의료진 식별 | 공통 MedicalClinic·WebSite ID, 의료진 Person·ProfilePage, BreadcrumbList |
| 출처·신뢰의 검토 가능성 | 원본 병원·기관 자료 링크, 원문 게시일과 자료 확인일 구분, 실제 승인 후에만 검토자 표시 |
| 탐색 연결 | 서비스 허브·상세·의료진·건강정보·방문 안내 사이의 관련 링크 |
| 이미지·접근성 | 로컬 WebP, 폭·높이·alt, 아래쪽 이미지 지연 로드, 키보드·감소된 모션·모바일 화면 대응 |
| 노출 준비 | production의 실제 indexable URL만 sitemap.xml, review의 HTML noindex, 정적 404 |
| 관측 | 질문 집합과 인용 URL·브랜드 언급·오류·인간 검토 정확도를 분리 집계 |

FAQ 형식의 본문은 제공합니다. FAQ 리치 결과나 AI 인용을 보장하는 마크업은 넣지 않습니다. Google의 변경 기록에 따라 FAQ 리치 결과를 성공 기준에서 제외했습니다. `llms.txt`는 production에서만 만드는 선택적 탐색 파일이며 순위 상승 효과를 가정하지 않습니다. 구현 방식은 [Next.js 정적 내보내기](https://nextjs.org/docs/app/guides/static-exports), [Google AI 최적화 안내](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Google 검색 변경 기록](https://developers.google.com/search/updates)을 참고했습니다.

현재 GitHub Pages 검토본은 모든 페이지에 `noindex, follow`를 설정합니다. 자동 빌드에 성공해도 곧바로 검색 노출 승인을 의미하지 않습니다. `sitemap.xml`에는 URL을 넣지 않으며, `planned-sitemap.xml`은 향후 후보 73개를 보여주는 검토용 파일입니다. 검색엔진에 후보 사이트맵을 제출하지 않습니다. noindex는 공개 사이트의 검색 제외 요청일 뿐 접근 통제나 비밀 보관 기능이 아닙니다.

프로젝트 경로의 `/yt-top-webforai/robots.txt`는 호스트 루트 `/robots.txt`를 대신하지 못합니다. 검토본을 robots에서 차단하면 noindex를 읽지 못할 수 있어 HTML 지시어로 제외합니다. 실제 검색 노출은 병원 소유 도메인과 원본 사이트의 중복·이관 정책을 확정한 후 설정합니다.

## 자동 배포

워크플로는 루트 경로와 저장소 하위 경로에서 각각 설치 → 취약점 검사 → lint → 단위 검사 → 기존 Python 하네스 검사 → 76페이지 빌드/감사 → 타입 검사 → 브라우저/접근성/성능 검사 순으로 실행합니다. 둘 다 성공해야 Pages를 배포합니다. PR은 검토 모드로 검사하며 배포하지 않습니다.

main 배포 직전 원격 main의 SHA를 확인하므로 오래된 실행이 최신 사이트를 덮어쓰지 못합니다. `cancel-in-progress: false`로 배포 중단을 피합니다. Pages 배포 후 빌드 매니페스트의 커밋과 76페이지 실제 HTML 해시, canonical, noindex, 없는 경로의 HTTP 404를 다시 검사합니다.

다음 저장소 변수로 배포를 변경할 수 있습니다.

| 변수 | 기본값 | 의미 |
|---|---|---|
| `PUBLICATION_MODE` | `review` | `production`은 실제 검수가 모두 유효할 때만 빌드 가능 |
| `SITE_ORIGIN` | `https://codepump-net.github.io` | 경로 없는 HTTPS origin |
| `SITE_BASE_PATH` | `/yt-top-webforai` | 독립 도메인 루트는 `/`를 명시 |

최초 Pages 활성화는 저장소 관리 권한으로 Settings → Pages → Build and deployment → Source: **GitHub Actions**를 선택해야 합니다. 현재 연결 계정은 코드 push 권한이 있지만 Pages 생성 REST 호출이 HTTP 404로 거절되었습니다. 워크플로의 `GITHUB_TOKEN`만으로 최초 활성화를 대체할 수 없다는 [configure-pages 공식 입력 설명](https://github.com/actions/configure-pages/blob/main/action.yml)을 확인했습니다. 별도 토큰을 코드나 저장소에 넣지 않습니다. 배포가 막혀도 검사를 통과한 `site-project` 전체 결과물과 `checks-project` 보고서는 artifact로 남도록 구성했습니다. 실제 실행 결과는 별도 완료 보고서에 기록합니다.

도메인 연결·DNS 변경·원본 `yttop.co.kr`의 301 이관은 이번 GitHub Pages 검토본 자동 배포와 별개입니다. 원본 호스트의 제어 권한과 병원 도메인 결정이 필요합니다. [145개 URL 이관표](implementation-plan/legacy-url-map.csv)를 전달용 자료로 사용하며, 정적 사이트가 원본 서버의 HTTP 301을 수행했다고 표시하지 않습니다. 원본 URL의 쿼리 게시물도 기존 서버에서 매핑해야 합니다.

## 운영·의료 검토 후 검색 공개

화면 구현과 의료적 승인은 분리합니다. 현재 의료진·운영 담당자의 승인을 얻었다고 표시하지 않습니다. 특히 토요일 점심시간, 검사별 접수, 주차 지원, 비용, DOA 검사 세부 항목과 의료진 현재 직책을 확인해야 합니다. 기존 자료에서 내용이 충돌하는 항목은 확정값으로 만들지 않았습니다.

1. 원고와 모든 공통 화면 문구를 실제 의료진·운영 담당자가 검토하고 수정합니다. 자료의 이용 권한과 사례 요약의 게시 적절성도 함께 확인합니다.
2. `clinic.json`의 `operationsReview`에 실제 담당자, 확인 기록, 검토 시각·만료 시각, `operationsReview`를 뺀 병원 데이터의 `sha256`을 `factsDigest`로 기록합니다. 검수 기간은 담당자가 실제로 정합니다.
3. 해당 페이지의 `reviewStatus`를 `approved`로 변경한 다음 `npm run content:validate`를 실행합니다. `reports/review-inventory.json`에 이 상태의 검수 대상 digest가 생성됩니다.
4. 실제 검토 결과만 `content/reviews.json`에 입력합니다. 각 indexable 페이지에 `pageId`, `status: approved`, `reviewer`, `role: medical 또는 operations`, ISO 8601 `reviewedAt`·`expiresAt`, `evidence`, `digest`가 필요합니다. 의료 설명 페이지는 medical 역할이 필요합니다. 개인정보가 있는 원본 검토 기록은 비공개로 보관하고 evidence에는 내부 기록 식별자나 공개 가능한 확인 설명만 씁니다.
5. `npm run build:release`로 검사합니다. 누락·만료·미래 검토·본문이나 공통 병원 정보 변경으로 digest가 달라진 기록은 거절합니다. 공유 렌더링 템플릿이 바뀌어도 재검토가 필요합니다. digest는 변경 탐지 수단이며 전자서명이나 의사 자격 검증이 아닙니다.
6. 독립 도메인·원본 사이트 이관과 검색 공개 범위를 확정한 후 `PUBLICATION_MODE=production`으로 변경하고 Actions를 실행합니다. 실제 배포의 canonical·sitemap·noindex 여부를 확인한 다음 Google Search Console·네이버 서치어드바이저의 소유권 인증·사이트맵 제출을 진행합니다. 계정이나 인증 코드를 추정해서 넣지 않습니다.

공식 사이트 운영 호스팅은 [GitHub Pages 이용 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)을 포함해 별도로 확인합니다. 현재 결과물은 의료정보와 홈페이지 개발 검토용 정적 사이트이며, 결제·환자 정보 입력·온라인 진료 예약 처리 기능을 운영하지 않습니다.

## AI 인용 관측 하네스

`content/measurement-queries.json`에는 실제 진료 분야를 바탕으로 만든 고정 질문 20개가 있습니다. 검증된 검색 빈도 순위가 아니며 `frequencyEvidence`는 null입니다. 지식인 이용자의 원문이나 개인정보를 포함하지 않습니다.

관측 원본은 비공개 파일의 JSON 배열로 보관합니다. 각 기록에는 `queryId`, `engine`, `period`, `language`, `runId`, `status`를 넣고, 성공한 답변은 `answer`, `citations`도 넣습니다. 사람이 정확성을 검토했다면 `accurate`와 실제 `reviewer`를 기록합니다. 실패는 status `error`로 남기고 없는 답변을 만들지 않습니다.

```powershell
npm run measure -- .local/observations.json
```

인용 URL은 병원 배포 origin과 프로젝트 경로가 모두 일치해야 합니다. 같은 GitHub 호스트의 다른 프로젝트나 비슷한 공격자 도메인은 제외합니다. 유효 답변을 분모로 인용률과 언급률을 계산하고 오류 수·질문 커버리지·사람이 검토한 정확도는 별도로 제공합니다. 답변 수집 자체는 엔진의 정식 기능·허용된 API 범위에서 수행하며 이번 작업에서 실측하지 않은 AI 노출 효과를 만들지 않습니다.

기존 `harness/hospital_harness.py`는 조사 단계의 v1 계약과 관측 도구로 유지합니다. 실제 앱은 `web/scripts/content-contract.mjs`의 v2 계약을 사용하며, 두 스키마가 같거나 v1의 모든 검사를 자동으로 대체한다고 주장하지 않습니다. 기존 구조 회귀 검사는 본문·개인정보를 제거한 저장소 내부 fixture로 실행되므로 CI에 로컬 크롤링 자료가 필요하지 않습니다.

## 자료 관리와 복구

원본 크롤링과 OCR, 515개 수집 이미지가 있는 `research/`는 로컬 조사 자료로 유지하고 공개 저장소에 올리지 않습니다. 앱에는 선별된 이미지와 출처를 가진 편집 원고만 들어갑니다. `seed_content.py`, `polish_content.py`, `prepare-assets.mjs`는 최초 가져오기 도구이며 CI 필수 단계가 아닙니다. 이후 원고를 수정한 뒤 초기화 도구를 다시 실행하면 편집 내용을 덮어쓸 수 있으므로 일반 유지보수는 JSON 파일을 직접 수정합니다.

장애 복구는 정상 커밋으로 코드·콘텐츠 변경을 되돌리는 새 커밋을 만들어 main에 push하는 방식으로 진행합니다. 과거 실행의 배포만 재실행하면 최신 SHA 검사가 막도록 되어 있습니다. 정상 커밋의 원고도 검수 만료 여부를 다시 검사하므로, 오래된 의료정보를 검사 없이 재배포하지 않습니다. 도메인이나 basePath를 변경했다면 해당 값으로 다시 빌드합니다.
