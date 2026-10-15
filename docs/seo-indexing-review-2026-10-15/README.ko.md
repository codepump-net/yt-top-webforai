# yttop.kr 검색 미노출 원인과 독립 노출 개선안

2026년 10월 15일 실측. 대상은 `https://yttop.kr/`의 현재 135개 경로, GitHub Pages 설정, 저장소 콘텐츠와 배포 코드다. 기존 `yttop.co.kr`과 병행 운영하는 환자용 사이트라는 [콘텐츠 기준](../patient-content-policy.ko.md)을 적용했다.

**현재 검색 노출을 막는 직접적인 원인은 검토 모드 배포에 따른 사이트 전체의 `noindex`다.** 검색 대상으로 설계된 132개 페이지까지 검색 제외 지시를 반환한다. 별도 도메인으로 검색될 수 있는 구조는 이미 갖추고 있으므로, 현행 콘텐츠의 공개 조건을 충족한 production 배포가 최우선이다. 두 사이트의 같은 검색어 동시 노출이나 특정 순위는 보장할 수 없다.

이번 작업은 진단과 개선안 작성이다. 공개 콘텐츠·GitHub 변수·승인 기록·배포 상태는 변경하지 않았다. 조사 결과와 수집기는 이 내부 문서 폴더에만 저장했다.

**확인한 결과**

| 항목 | 실제 확인 결과 | 판단 |
|---|---|---|
| 배포 모드 | GitHub 변수 `PUBLICATION_MODE=review` | 전역 검색 제외의 설정 원인 |
| 페이지 색인 지시 | 135개 경로 전부 `noindex`; 홈은 `noindex, follow` | 검색 대상으로 설계된 132개 페이지도 노출 차단 |
| XML 사이트맵 | `/sitemap.xml` HTTP 200, URL 0개 | 신규 URL 발견을 돕지 못함. 사이트맵 부재 자체가 색인 금지는 아님 |
| robots.txt | `User-agent: *`, `Allow: /`; Sitemap 행 없음 | 크롤링은 허용하지만 HTML의 noindex를 해제하지 않음 |
| 도메인 설정 | `SITE_ORIGIN=https://yttop.kr`, `SITE_BASE_PATH=/`; Pages cname `yttop.kr`, HTTPS 강제 | 현재 도메인 설정은 정상 |
| 대표 URL | 135개 모두 자기 주소 canonical | 기존 홈페이지로 canonical을 넘겨서 생긴 문제는 확인되지 않음 |
| 응답과 본문 | 등록된 135개 모두 HTTP 200; 검색 대상 132개 모두 초기 HTML에 main 본문 | 빈 클라이언트 화면 때문에 본문을 못 읽는 구조는 아님 |
| 제목과 설명 | 검색 대상 132개의 title·description 완전 중복 및 description 누락 0건; H1 각 1개 | 기본 메타데이터는 마련됨. 의미·검색 의도 적합성은 별도 편집 대상 |
| 내부 연결 | 홈의 HTML 링크를 따라 132개 검색 대상 모두 도달, 최단 경로 최대 2회 클릭 | 고립 페이지는 확인되지 않음 |
| 구조화 데이터 | 검사한 JSON-LD의 JSON 구문 오류 0건 | 파싱 가능함을 뜻하며 리치 결과 자격이나 품질 승인은 아님 |
| 호스트 통합 | HTTP, www, 기존 GitHub Pages 홈 → `https://yttop.kr/` 301 | 새 사이트 내부의 주소 통합은 정상 |
| 오류 URL | 임의의 없는 주소는 HTTP 404 | `/404.html` 파일 자체의 200과 구분; 모든 오타 URL이 200인 문제는 없음 |
| 기존 사이트의 연결 | 기존 홈·국가검진·내시경·심장초음파·진료·위치 6개 URL의 HTML에서 새 도메인 링크 0개 | 확인한 주요 페이지에 환자 안내로 이어지는 연결 기회가 있음 |

실측 자료: [페이지별 HTML 메타데이터와 HTTP 결과](live-evidence.json), [GitHub 변수](github-variables.json), [Pages 설정](github-pages.json), [최근 워크플로 실행](recent-deployments.json). 최신 성공 실행은 [2026년 10월 10일 KST 배포](https://github.com/codepump-net/yt-top-webforai/actions/runs/37953730741)이며, 현재 로컬 HEAD와 같은 `15d6b8878d5c4bf98f1ebce3cdb11be7ec8aa9be`다.

홈의 실제 HTML은 다음 지시를 포함한다.

```html
<meta name="robots" content="noindex, follow"/>
<link rel="canonical" href="https://yttop.kr/"/>
```

Google은 페이지에서 `noindex`를 읽으면 검색 결과에서 제외한다. 다른 사이트의 링크, 구조화 데이터, `robots.txt`의 Allow 설정으로 이 지시를 상쇄할 수 없다. 현재 현상은 이 설정으로 설명할 수 있다. [Google noindex 설명](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

**설정이 만들어지는 위치와 공개 전환 조건**

| 파일 | 관련 동작 |
|---|---|
| [`site.ts`](../../web/src/lib/site.ts) 67·108행 부근 | `SITE_MODE`가 production이 아니면 검색 대상도 noindex 생성 |
| [`build.mjs`](../../web/scripts/build.mjs) 9·43·53행 부근 | 기본 review 빌드; review 사이트맵은 빈 목록이고 robots에 Sitemap을 넣지 않음 |
| [`pages.yml`](../../.github/workflows/pages.yml) 38행 부근 | PR은 review, main은 `PUBLICATION_MODE` 변수에 따라 배포 모드 결정 |
| [`package.json`](../../web/package.json) | `npm run build`는 review; 공개 빌드는 `npm run build:release` |
| [`content-contract.mjs`](../../web/scripts/content-contract.mjs) 119행 이후 | 공개 확인 범위·상태·콘텐츠와 렌더러의 digest를 검증 |

따라서 개별 페이지의 robots 태그를 손으로 지우기보다, 공개 조건을 충족한 뒤 정식 production 경로로 다시 빌드·배포해야 한다. review 배포도 현재 검사에 맞으면 CI가 성공한다. **CI 성공과 검색 허용은 다른 결과다.** 배포 후 매니페스트의 모드와 실제 색인 지시를 함께 확인해야 한다.

현재 데이터에 대해 콘텐츠 계약 검증을 실행한 결과 review는 통과했고 production은 다음 세 사유로 실패했다.

1. 기존 공개 확인의 페이지 범위가 현재 검색 대상과 다름.
2. 현재 페이지의 승인 상태가 공개 조건을 충족하지 않음.
3. 기존 확인 이후 콘텐츠·병원 사실 또는 렌더러가 변경되어 digest가 일치하지 않음.

기존 확인 기록은 2026년 9월 11일의 43개 페이지에 관한 것이다. 현재 검색 대상은 132개이며 전체 135개 원장의 상태는 pending 133개, approved 2개이고 개별 review 기록은 0개다. 이는 **저장된 공개 증거가 현행 버전에 맞지 않는다는 판단**이며 실제 의료 검토를 수행했는지에 대한 추정은 아니다. 기록의 유효기간 만료 오류는 발생하지 않았다. [검증 결과](release-validation.json).

현행 콘텐츠의 의료·운영 확인 사실을 반영한 증거로 갱신해야 한다. 상태나 digest만 일괄 변경해 완료 사실을 만들어서는 안 된다. 이 절차는 저장소가 요구하는 공개 조건이며 Google이 이 내부 파일 형식을 요구하는 것은 아니다.

**별도 도메인에서 노출될 수 있는 운영 방향**

`yttop.co.kr`은 기존 대표 홈페이지와 공지·사례의 원 게시 채널로 유지하고, `yttop.kr`은 검사 선택·예약·준비·결과 이해·방문에 필요한 상세 안내를 제공하는 역할을 강화한다. 현재 원고에는 심장초음파 예약과 준비, 내시경 정결제별 안내, 채용검진 제출 서류 등 이 역할에 맞는 콘텐츠가 이미 있다.

독립 안내 페이지는 현재처럼 자기 주소 canonical을 유지한다. 두 도메인의 문서가 사실상 동일하면 Google은 사용자가 정한 canonical과 다르게 대표 문서를 선택할 수 있으므로, 단어만 바꾸는 것보다 환자가 얻는 정보와 행동 목적을 구분해야 한다. 기존 홈페이지에서 실제로 제공하지 않는 상세 준비 안내, 문의할 사항, 검사별 비교와 관련 안내 연결이 유용하다. 실제 중복 문서는 페이지별로 판단한다. [Google canonical 안내](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [대표 URL 문제 해결](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting).

병원명·주소·전화가 같은 것은 동일 병원이라는 사실을 정확히 전달한다. 현재 `MedicalClinic`의 ID와 대표 URL이 기존 도메인을 가리키는 것은 프로젝트의 동일 병원 식별 설계다. 새 `WebSite`와 `WebPage` URL은 yttop.kr이며, JSON-LD의 병원 URL은 HTML canonical과 다른 항목이다. 이를 검색 미노출의 원인으로 볼 근거는 없다.

기존 홈페이지의 메뉴나 관련 검사 페이지에 실제 `<a href>` 링크로 “검사 준비 안내”, “심장초음파 예약·준비”, “채용검진 준비물”을 연결하는 것을 권한다. 기존 사이트 6개 URL에서 해당 링크가 없음을 확인했지만, 전체 웹의 외부 링크가 없다는 뜻은 아니다. 연결은 환자에게 필요한 맥락에서 제공하고, 기존 공지·사례 링크는 유지한다. 신규 사이트의 외부 연결과 사이트맵은 URL 발견에 도움이 된다. [Google 사이트맵 설명](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

**기존 페이지를 활용할 검색 의도와 제목 개선 예시**

아래 검색어는 현재 진료·콘텐츠를 기준으로 한 편집 제안이다. 검색량·순위·전환율을 측정한 키워드 목록은 아니다. 지역명은 방문형 서비스 페이지에서 자연스럽게 사용하고, 일반 건강 설명마다 반복하지 않는다.

| 검색 의도 예시 | 기존 페이지 | 보완할 내용 또는 제목 예시 |
|---|---|---|
| 망포역 내과 진료시간·주차 | `/visit/` | “망포역 영통탑내과 진료시간·오시는 길”; 실제 주차·접수 안내가 바로 보이도록 구성 |
| 영통 심장초음파 예약·금식 | `/services/heart/echocardiography/` | “영통 심장초음파 검사·예약·준비 안내 \| 영통탑내과”; 병원에서 가능한 검사와 예약 방법을 명확히 연결 |
| 망포 국가건강검진 예약·준비 | `/checkups/national/` | “망포역 국가건강검진·준비 안내 \| 영통탑내과”; 일반검진과 내시경의 예약 차이를 앞에서 설명 |
| 영통 채용검진 준비물·발급기간 | `/checkups/employment/` | “영통 채용검진 준비물·발급 안내 \| 영통탑내과”; 제출처별 확인 항목과 발급 조건을 유지 |
| 대장내시경 전 음식·물·커피 | `/health/colonoscopy-preparation-questions/` | 현재 구체적인 제목을 유지하고 정결제별 안내와 검사 예약 페이지를 연결 |
| 오라팡·플렌뷰 복용 준비 | `/health/orafang-preparation/`, `/health/plenvu-preparation/` | 병원에서 받은 개인별 지침을 우선하도록 유지하고 서로 다른 안내의 적용 범위를 명확히 구분 |

현재 제목은 누락·완전 중복 문제는 없지만 일부 서비스 페이지는 검사명과 병원명만 표시한다. 제목과 도입부에서 방문 지역, 준비·예약이라는 목적을 선별적으로 더 명확히 할 여지가 있다. 지역 키워드만 다른 페이지를 대량 생성하는 방식은 필요하지 않다. [Google 제목 작성 지침](https://developers.google.com/search/docs/appearance/title-link).

의료정보는 근거와 설명의 한계, 실제 작성·검토자의 책임을 확인할 수 있도록 관리한다. 이름·검토일은 실제 기록이 있을 때 표시하고 검색을 위해 임의로 만들지 않는다. 일반 질환 설명은 병원의 진료 범위와 환자의 준비에 연결되는 실질적인 정보부터 보완한다. [Google 유용하고 신뢰할 수 있는 콘텐츠 지침](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

FAQ 마크업이나 llms.txt 추가를 현재 문제의 해법으로 삼을 이유는 없다. Google은 2026년 5월 7일부터 FAQ 리치 결과가 표시되지 않는다고 공지했고, llms.txt가 Google 검색의 노출·순위에 영향을 주지 않는다고 명시했다. 환자에게 유용한 질문·답변 본문은 유지하되 리치 결과나 AI 노출을 보장하는 기능으로 설명하지 않는다. [Google 공식 변경 기록](https://developers.google.com/search/updates).

**권장 실행 순서와 완료 기준**

| 우선순위 | 실행할 일 | 완료 기준 |
|---|---|---|
| P0 | 현행 콘텐츠의 의료·운영 확인 사실과 공개 범위를 기록하고 production 검증 통과 | 현재 원고·렌더러와 일치하는 공개 증거, production 오류 0건 |
| P0 | `SITE_ORIGIN=https://yttop.kr`, `SITE_BASE_PATH=/`를 유지하고 production 빌드·배포 | 공개 대상의 실제 HTML에 noindex 없음; 대상별 HTTP 200, 자기 주소 canonical |
| P0 | 공개 XML 사이트맵과 robots 재검증 | 현재 전체 범위를 공개하면 사이트맵 132개 URL, robots에 `Sitemap: https://yttop.kr/sitemap.xml`; 검색·사례·404는 제외 |
| P1 | Search Console에서 yttop.kr 소유권 확인 및 사이트맵 제출 | 해당 도메인 속성에서 사이트맵을 정상 읽음; 기존 co.kr 속성과 구분 |
| P1 | 홈·방문·심장초음파·국가검진·채용검진·내시경 준비의 URL 검사와 색인 요청 | 실시간 테스트 색인 허용; 이후 색인된 버전의 마지막 크롤링·Google 선택 canonical 확인 |
| P1 | 기존 홈페이지의 관련 위치에서 새 안내 페이지 연결 | 환자가 클릭할 수 있고 크롤러가 읽는 링크가 실제 HTML에 존재 |
| P2 | 기존 서비스 페이지의 검색 의도·지역 표현·준비 정보 보완 | 제목·도입부·본문·병원 운영 사실의 일치, 관련 페이지와 목적 구분 |
| P2 | 공개 후 Search Console 실적을 주 단위로 비교 | 브랜드/비브랜드 검색어와 방문형/정보형 페이지별 노출·클릭·CTR·평균 게재순위 변화 기록 |

production 전환 후에도 `/search/`, `/cases/`, `/404.html`의 의도한 검색 제외는 유지한다. 기존 co.kr 전체를 kr로 리디렉션하거나 대표 URL을 일괄 이전하는 것은 병행 운영 목적에 맞지 않는다. 이미 정상 동작하는 www·HTTP·GitHub Pages 주소 통합은 유지한다.

Search Console의 “페이지 색인 생성”에서는 noindex 제외, 발견됨·현재 색인 생성 안 됨, 크롤링됨·현재 색인 생성 안 됨, Google이 다른 표준 페이지 선택을 구분한다. 실시간 테스트가 성공해도 실제 색인이나 대표 URL 선택을 확정하는 것은 아니므로 색인된 버전 결과도 확인해야 한다. [Google URL 검사 도구](https://support.google.com/webmasters/answer/9012289?hl=ko).

**해석 범위와 검증 기록**

외부 검색 도구에서 `site:yttop.kr -site:yttop.co.kr`와 `"yttop.kr"` 검색 결과는 발견하지 못했고 기존 co.kr의 검색 결과는 확인했다. 이는 Google Search Console의 색인 수 확인이나 위치·기기별 Google 순위 측정을 대체하지 않는다. Google도 `site:` 결과가 전체 색인 목록이 아니라고 설명한다. [site 검색의 한계](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site).

Search Console 계정의 실제 색인·실적·수동 조치·보안 문제 보고서는 이번 검토에 제공되지 않았다. 따라서 현재 Google이 선택한 canonical, 실제 색인 수, 키워드 순위, 패널티 존재 여부는 단정하지 않는다. 외부 검색 열람 도구의 yttop.kr 열기 오류는 별도 HTTP 요청으로 200 응답을 확인했으므로 사이트 장애나 Googlebot 차단의 증거로 사용하지 않았다.

전체 경로 실측은 HTML 응답과 링크·메타데이터 검사이며 JavaScript 렌더링 화면·Core Web Vitals·의학적 타당성·전체 외부 링크 검증을 의미하지 않는다. 내부 계약 검증은 review 통과/production 3개 실패를 확인했고 빌드·배포는 실행하지 않았다. 공개 코드나 콘텐츠 변경이 없어 사이트의 전체 회귀 테스트와 재빌드는 수행하지 않았다.

공개 전환 후 Google 재크롤링에는 며칠에서 몇 주가 걸릴 수 있고 색인 요청이 결과 노출을 보장하지 않는다. 검색 허용 확인, 실제 색인, 검색어 노출과 순위는 순서대로 따로 측정해야 한다. [Google 재크롤링 요청 안내](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

수집 재현: 저장소 루트에서 `node docs/seo-indexing-review-2026-10-15/collect-evidence.mjs`. 실행 시 같은 폴더의 실측 JSON을 새 결과로 덮어쓴다. GitHub 설정 JSON과 계약 검증 JSON은 별도로 수집한 시점의 기록이다.
