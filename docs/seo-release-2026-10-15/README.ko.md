# yttop.kr 검색 공개와 SEO 수정

2026년 10월 15일. 사용자가 검색 노출 차단 해소, SEO 최적화와 즉시 배포를 요청했고, 현행 132개 페이지의 의료·운영 검토를 모두 완료했다고 확인했다. 공개 기록을 갱신하고 production 배포와 실제 사이트 검증을 완료했다. 배포 커밋은 `cbf1e24c2702430162885488923934afee7ee0a9`이며, [GitHub Actions 실행](https://github.com/codepump-net/yt-top-webforai/actions/runs/38704617676)의 두 검증 작업과 Pages 배포가 모두 성공했다. [최종 배포 요약](deployment.json).

검색 허용 페이지와 XML 사이트맵 URL은 각각 0개에서 132개로 바뀌었다. 실제 홈페이지는 HTTP 200, 자기 주소 canonical, `index, follow, max-image-preview:large`를 반환하고, robots.txt는 전체 크롤링을 허용하며 사이트맵 주소를 제공한다. [실제 응답](live-summary.json).

사이트 전체 noindex의 원인은 [앞선 진단](../seo-indexing-review-2026-10-15/README.ko.md)에 기록했다. 이번 변경은 기존 환자용 페이지와 의료 안내를 유지하면서 검색 공개 경로와 검색 결과에 표시할 설명을 보완한다.

| 변경 | 목적 |
|---|---|
| 홈·방문·심장초음파·국가검진·채용검진·위내시경·대장내시경·검진 목록·준비 목록의 제목과 일부 설명 보완 | 망포역·영통의 방문 목적과 예약·검사 준비 정보를 검색 결과에서 명확히 전달 |
| 수정한 9개 페이지의 수정일 반영 | 실제 변경일을 원고와 사이트맵에 사용 |
| production 검색 대상에 큰 이미지 미리보기 허용 | `max-image-preview:large` 추가. 이미지 노출 여부나 순위를 보장하지 않음 |
| main 배포를 production으로 고정하고 PR 검토 모드 유지 | 과거 `PUBLICATION_MODE=review` 변수로 공개 도메인 전체가 검색 제외되는 재발 방지 |
| 배포 검사에서 기대 모드와 검색 대상 존재 확인 | 검토용 또는 검색 대상 0개 결과물을 공개 배포 검증 성공으로 처리하지 않음 |
| 정적·실제 배포 검사에서 robots.txt와 사이트맵 정책 대조 | 배포된 크롤링 허용과 사이트맵 주소까지 검증 |
| 공개 모드도 검사하도록 과거 브라우저 검사 수정 | 의료 안내가 항상 noindex여야 한다는 이전 검토 전용 기대값을 현재 모드에 맞게 수정 |

검사·예약에 관한 임상 본문, 환자별 준비 지침, 공지·사례의 기존 홈페이지 링크와 UI는 변경하지 않았다. 병원 MedicalClinic ID와 각 페이지의 자기 주소 canonical은 유지한다. 검색·사례·오류 3개 경로의 의도적인 noindex도 유지한다. [메타데이터 변경 전후](metadata-changes.json).

로컬 검사는 Node.js 24.22.0에서 수행했고, 아래 production 결과는 최종 배포 커밋의 CI artifact와 실제 배포 검사로 확인했다. [배포 전 시점의 검사 요약](predeployment-checks.json)은 당시 배포 전 상태를 기록한 역사 자료이며, 현재 상태는 [최종 배포 요약](deployment.json)을 따른다.

| 검사 | 결과 |
|---|---|
| 콘텐츠·정적 export | review 및 production 모드 각각 135개 경로 통과; production 색인 대상 132개 |
| 단위 검사 | 최종 96개 통과 |
| Python 콘텐츠 하네스 | 17개 통과 |
| 브라우저·접근성·기존 UI 회귀 검사 | review 전체 70개, production 전체 70개 통과 |
| lint·타입 검사 | 통과 |
| 의존성 검사 | 기존 개발 도구의 기한 있는 예외를 적용해 통과 |
| 원본 이미지·공지 자료 확인 | 통과 |
| production 모바일 모의 성능 표본 6개 | 성능 97~99, 접근성·권장사항 100; 검색 허용 표본 5개 SEO 100 |
| 실제 배포 응답·HTML 해시·canonical·검색 지시 | 135개 경로 통과; robots.txt·사이트맵 132개 URL·존재하지 않는 경로의 실제 HTTP 404 확인 |
| 실제 브라우저·이미지·스타일·스크립트 | 135개 경로, 이미지 출현 177회·고유 이미지 37개; 실패 0건; 홈 데스크톱·모바일 화면 확인 |

[최종 production 성능 표본](production-performance.json)의 검색 허용 페이지는 SEO 100점이다. 의도적으로 검색에서 제외한 `/search/`는 noindex 때문에 SEO 69점이다. [이전 review 성능 결과](review-performance.json)는 별도 검토 빌드의 역사 자료다. Lighthouse 점수는 Google의 실제 색인·검색 순위나 실사용자 성능을 나타내지 않는다.

사용자는 “우선 검색노출을 막는 모든 원인을 제거하고 SEO 최적화 한 후 즉시 배포 진행하겠습니다.”라고 지시했고, 현행 공개 대상 132개 페이지의 실제 의료·운영 검토 완료 여부를 묻는 질문에 “의료·운영 검토를 모두 완료했습니다”라고 답했다. 이를 [현행 공개 확인 기록](../../content/publication-approval.json)에 기록하고 현재 콘텐츠·병원 사실·렌더러 digest와 연결했다. 기록 시각은 확인을 파일로 옮긴 시각이며 특정 의료진의 검토 시각이나 작성자 표시로 사용하지 않는다. 개별 검토자 이름이나 검토 기록은 생성하지 않았다.

공개 범위는 132개 페이지이며 검색·사례·오류 경로 3개의 noindex는 유지한다. [배포 매니페스트](deployed-build-manifest.json), [실제 배포 검사](live-verification.json), [실제 브라우저 검사](live-assets-verification.json)는 모두 위 배포 커밋과 연결된다. 최종 검증 시점에 Search Console 제출과 계정 내 색인 현황 확인은 수행하지 않았으며, 이후 사용자가 제출 진행도 요청했다. 인증된 계정 연결이 없어 실제 소유권 확인 태그를 요청한 상태다. 네이버 서치어드바이저도 같은 사이트맵을 사용할 수 있다. 실제 Google·네이버 색인과 검색 순위는 아직 확인되지 않았다.

정식 공개 빌드 근거: [콘텐츠 검증](production-content-validation.json), [정적 export 검증](production-static-audit.json), [production 전체 브라우저 검사](production-e2e.json). 최종 단위 검사는 현행 공개 확인 이후에도 미승인 콘텐츠·변경된 원고·잘못된 공개 모드를 거절하는 조건을 포함한다.

production 빌드는 검토용 `reports/planned-sitemap.xml`을 제거하며, 사례 제외 검사는 현재 모드의 실제 사이트맵을 기준으로 수행한다. 첫 CI 실행에서 발견된 검토 전용 파일 의존성을 수정한 뒤 production 전체 브라우저 검사 70개가 로컬에서 통과했다.

## 검색엔진 관리 도구 제출

사이트맵 생성·배포는 완료됐지만, 계정에서 소유권을 확인하고 제출하는 단계는 별도다. 현재 대화의 도구와 관련 플러그인을 확인했으며, Google Search Console의 소유권 등록·사이트맵 제출 또는 네이버 서치어드바이저를 실행할 수 있는 인증된 연결은 확인되지 않았다. 사용자가 Google 등록 진행을 요청했고 네이버의 동등한 도구도 문의했으므로, 실제 소유권 확인 태그를 요청했다. 로그인 비밀번호는 필요하지 않다.

| 서비스 | 계정에서 발급할 항목 | 사이트 반영 후 작업 |
|---|---|---|
| [Google Search Console](https://search.google.com/search-console/) | URL 접두어 `https://yttop.kr/` → 소유권 확인의 HTML 태그 | 소유권 확인 후 Sitemaps에 `https://yttop.kr/sitemap.xml` 제출, 주요 페이지 URL 검사에서 색인 생성 요청 |
| [네이버 서치어드바이저](https://searchadvisor.naver.com/) | 웹마스터도구에 `https://yttop.kr` 등록 → HTML 태그 | 소유확인 후 요청 → 사이트맵 제출에서 같은 사이트맵 주소 제출 |

Google에서 도메인 속성 `yttop.kr`을 이미 선택했다면 DNS 인증이 필요하다. HTML 태그 방법을 사용할 때는 URL 접두어 속성을 선택한다. 기존 `yttop.co.kr`의 등록 상태를 바꾸거나 주소 변경을 신청하지 않는다. 발급된 태그를 받으면 실제 홈페이지 HTML의 head에 추가하고 재배포 후 해당 태그가 원본 응답에 있는지 검증한다. 이후 로그인 계정에서 확인·제출한 결과를 별도로 기록한다. 서비스에 등록하지 않아도 검색될 수 있고, 제출은 수집이나 순위의 보장이 아니다.

공식 근거: [Google 소유권 확인](https://support.google.com/webmasters/answer/9008080?hl=ko), [Google 사이트맵 제출](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Google 재수집 요청](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [네이버 사이트 등록·소유확인](https://searchadvisor.naver.com/guide/faq-start-register), [네이버 사이트맵 제출](https://searchadvisor.naver.com/guide/request-feed).

사용자가 이후 제공한 값은 HTML 메타 태그가 아니라 `google-site-verification: googledad4bdf9eb06009a.html`이라는 파일 인증 본문이다. 해당 문자열 그대로 `web/public/googledad4bdf9eb06009a.html`에 추가했다. 로컬 production 빌드에서 실제 export 파일 내용과 일치를 확인했고, 콘텐츠·정적 검사 135경로가 통과했다. 환자용 페이지나 사이트맵 URL로 추가하지 않았다. 변경 커밋은 `d2a71a4f206faa6e12f8dc30fb3130674edbe107`이며, [인증 파일 배포 실행](https://github.com/codepump-net/yt-top-webforai/actions/runs/38709434994)의 두 검증 작업·배포·실제 135경로 검증이 모두 성공했다. [실제 인증 파일](https://yttop.kr/googledad4bdf9eb06009a.html)은 리디렉션 없이 HTTP 200으로 제공되며 사용자 제공 본문과 정확히 일치한다. [파일 검증 기록](google-verification-file.json), [실행 결과](google-verification-actions.json). Google 계정 화면에서의 소유권 확인·사이트맵 제출 성공을 뜻하지 않는다. 사용자는 HTML 파일 인증 화면에서 확인을 누른 뒤 사이트맵을 제출할 수 있다.

네이버 등록도 사용자가 요청했고, 실제 발급된 `naver-site-verification` 태그를 제공했다. 한국어 루트 레이아웃의 metadata에 인증값을 추가하고 기존 공개 확인의 digest를 기술 변경에 맞게 갱신했다. 의료 본문·검토 완료 진술·확인 일시·공개 범위는 변경하지 않았다. 배포 커밋은 `29dabc8438ebe11e7684642e8a09aab13b2b0d56`이며, [네이버 인증 배포 실행](https://github.com/codepump-net/yt-top-webforai/actions/runs/38710976687)의 두 검증 작업·배포·실제 135경로 검증이 모두 성공했다. 실제 홈페이지 원본 HTML의 head에서 태그가 정확히 1개 존재하고 사용자 제공 값과 일치함을 확인했다. Google 인증 파일과 사이트맵 132개 URL도 정상이다. [실제 태그 검증](naver-verification-tag.json), [실행 결과](naver-verification-actions.json). 네이버 계정 화면의 소유확인과 사이트맵 제출은 사용자가 로그인하여 진행할 단계로 남아 있으며, 접수 성공을 기록하지 않았다.

## 질문·답변 중심의 홈페이지 제목

사용자는 신규 사이트의 AEO·GEO 목적이 제목에 반영되기를 요청했다. 공개 제목을 `영통탑내과 | 증상·검사·검진 질문과 답변`으로 바꾸고, 설명에도 실제 제공하는 증상·검사 선택·내시경·건강검진 준비 안내를 반영했다. 망포역 위치, 주소와 전화 정보는 기존 병원 사실에서 계속 가져온다. 홈페이지의 환자별 안내 진입부 문구도 `증상·검사·검진 질문의 답을 찾고, 방문 준비를 확인하세요.`로 맞췄다. 임상 안내 본문이나 병원 이름을 바꾸지 않았다. 같은 승인 범위에서 요청된 표현 변경을 공개 확인 digest에 연결했다.

운영 목적은 실제 질문에 답하는 환자용 콘텐츠로 표현했다. [Google의 AI 검색 안내](https://developers.google.com/search/docs/appearance/ai-features)는 일반 SEO 원칙과 유용한 본문·정확한 구조화 데이터를 적용하며 별도의 특수 최적화를 요구하지 않는다고 설명한다. 제목에 AEO·GEO를 명시하거나 질문 형식으로 바꾼 것 자체가 검색 순위나 AI 인용을 높인다는 주장은 하지 않는다.

배포 커밋은 `1b5528f406b44a12187dfcdba919c832faebc3e3`이다. [Actions 실행](https://github.com/codepump-net/yt-top-webforai/actions/runs/38714155747)의 두 검증 작업·배포·실제 135경로 검증이 성공했다. 로컬 production 빌드·정적 검사·96개 단위 검사·lint가 통과했고, 실제 사이트에서 title·description·Open Graph·Twitter 메타데이터의 일치, 본문의 안내 문구, 두 검색엔진 인증 설정, 자기 주소 canonical과 검색 허용 상태를 확인했다. 사이트맵은 132개 URL이다. [실제 응답 검증](question-title-live.json), [CI 결과](question-title-actions.json). 실제 검색 노출·AI 인용 변화는 측정하지 않았다.

## 독립적인 환자 안내 사이트 이름

사용자가 제안받은 이름을 “채택하겠습니다. 일관되게 맞춰주세요.”라고 확정하여 **탑 건강문답**을 적용한다. 홈 제목은 `탑 건강문답 | 영통탑내과의 증상·검사·검진 안내`, 운영 설명은 `영통탑내과가 운영하는 환자용 증상·검사·검진 안내`다. 각 페이지는 주제 뒤에 `| 탑 건강문답`을 붙인다. 병원안내·의료진·방문 안내 제목에는 실제 병원 이름도 남긴다. 번역 페이지 5개도 동일한 사이트 이름을 사용하고 각 언어의 검사 주제는 유지한다.

공통 이름은 `content/site.json`에 정의했다. 헤더·푸터·홈 소개·홈 경로명·검색 제목·Open Graph·Twitter·application-name·WebSite·선택적 llms.txt가 같은 이름을 사용한다. 기존 병원 로고는 푸터의 운영 병원 표시에 사용하며, 병원 명칭·주소·전화·의료진·공식 채널과 `https://yttop.co.kr/#clinic`의 MedicalClinic 정보는 유지한다. 홈의 소개 문구는 실제 제공하는 환자 안내를 설명하며 응급 안내와 임상 본문은 유지한다. 내부 검색·전체 페이지 설명도 새 사이트를 지칭하도록 수정했다.

이름 변경으로 의료 검토 이력을 새로 만들지 않는다. 기존 사용자 확인의 시각·진술·132페이지 공개 범위를 유지하고, 이번에 승인된 명칭·표시 변경을 현재 렌더러와 원고 digest에 연결한다. 페이지 수정일은 제목이 바뀐 2026-10-15로 기록하고, 원문 출처의 확인일·공지 게시일·의료 검토자 정보는 변경하지 않는다.

정적 export 검사는 전체 경로의 화면 이름·운영 주체 표시·제목을 대조하며, 정상 페이지의 공유 제목·application-name·WebSite 이름 및 병원 publisher 관계도 확인한다. 이는 명칭 불일치와 병원 정보의 잘못된 변경을 방지하기 위한 검사다. 검색엔진의 재수집·색인·사이트 이름 선택이나 두 도메인의 동시 노출을 보장하지 않는다. [Google 사이트 이름 안내](https://developers.google.com/search/docs/appearance/site-names), [제목 링크 안내](https://developers.google.com/search/docs/appearance/title-link).

배포 전 로컬에서는 production 콘텐츠·정적 검사 135경로, 단위 검사 96개, Python 하네스 17개, 타입·lint·원본 자료 검사가 통과했다. 브라우저 전체 검사에서 이전 날짜 고정값과 추가한 푸터 링크 중복이 발견되어 각각 실제 원고 날짜 대조와 중복 링크 제거로 수정했고, 해당 2개 검사가 통과했다. 데스크톱·모바일 홈, 푸터와 영어 페이지의 표시도 확인했다. [로컬 검사 범위](branding-local-checks.json). 최종 전체 브라우저 검사와 실제 배포 결과는 후속 CI 실행으로 확인한다.

이름 변경 커밋 `d2edf6b40721b1c44a80eec82f399f5780c18baf`의 [첫 배포 실행](https://github.com/codepump-net/yt-top-webforai/actions/runs/38726129412)은 두 경로 구성의 전체 검사와 실제 135경로 검증을 통과했다. 프로젝트 경로 브라우저 검사는 70개 성공·실패와 재시도 0개였다. 상세 Lighthouse 결과에서 점수 합격 여부와 별개로 상단 이름의 접근성 이름과 표시 문구 불일치가 확인되어, 운영 주체까지 포함한 접근성 이름과 명시적인 텍스트 사이 공백을 추가했다. 한국어 홈과 네팔어 페이지의 후속 검사에서 `label-content-name-mismatch`가 통과하고 실패 항목이 없어졌으며, 동일 조건을 전체 정적 HTML 검사에도 추가했다. [보완 후 로컬 검사](branding-accessibility-local.json). 이 보완의 배포 결과는 후속 실행에서 확인한다.

최종 보완 배포 커밋은 `cc4c50cec5b789badee72a73c1f4eb7572aef4bb`이다. [최종 Actions 실행](https://github.com/codepump-net/yt-top-webforai/actions/runs/38727078904)의 두 검증 작업·Pages 배포·실제 전체 135경로 검증이 모두 성공했다. 브라우저 검사 70개는 실패·건너뜀·불안정 재시도 없이 통과했고, 최종 성능 표본 전체에서 이름 불일치 문제가 사라졌다. 실제 홈·병원 안내·대장내시경 준비·영어 페이지의 HTML 해시가 이 실행의 매니페스트와 일치하며 제목·공유 이름·WebSite·운영 병원·접근성 이름을 확인했다. Google 인증 파일과 네이버 인증 태그, 자기 주소 canonical, 검색 허용, 사이트맵 132개 URL과 llms.txt 이름도 정상이다. [배포 요약](branding-deployment.json), [전체 실제 배포 검사](branding-live-verification.json), [이름·인증 실응답 검사](branding-live.json), [배포 매니페스트](branding-build-manifest.json), [최종 성능 표본](branding-performance.json), [CI 결과](branding-actions.json). 계정 내 소유권 확인·사이트맵 접수나 검색 노출·AI 인용 성과를 확인했다는 의미는 아니다.

## TOP 건강백과로 이름 확정

사용자가 `TOP 건강백과` 제안에 “이대로 진행해주세요.”라고 답하여 공식 사이트 이름을 변경했다. 홈 제목은 `TOP 건강백과 | 영통탑내과의 증상·질환·검사 안내`, 소개 문구는 `증상부터 검사 준비까지, 내 몸을 이해하는 건강정보`, 운영 표시는 `영통탑내과 운영`이다. 전체 135경로의 제목, 화면의 이름·소개, 공유 정보, application-name, WebSite와 llms.txt를 공통 이름에 맞췄다. 각 안내의 주제와 임상 본문, 실제 병원 MedicalClinic 및 기존 홈페이지 연결은 유지한다. 이전 이름이 담긴 위 기록들은 당시 배포에 대한 역사 자료다.

기존 작업 공간에 진행 중이던 화면 변경이 있어 별도 worktree에서 이름 변경만 검증했다. 원래 작업 공간에도 이름 변경을 병합했으며, 기존 수정 파일 7개와 미추적 파일 57개의 보존을 대조했다. 해당 화면 변경은 이번 배포에 포함하지 않았다. 공개 확인의 기존 진술·시각·범위를 유지하고 승인된 브랜드 변경에 한해 digest를 갱신했다. [로컬 검사](top-brand-local-checks.json).

배포 커밋은 `5dd8c90b7e77638611a75feef9c1e9faf0f7a5bf`다. [Actions 실행](https://github.com/codepump-net/yt-top-webforai/actions/runs/38743285265)의 두 검증 작업과 Pages 배포, 실제 135경로 검증이 모두 성공했다. 브라우저 검사 70개가 실패·건너뜀·불안정 재시도 없이 통과했다. 최종 성능 표본 6개는 성능 98~99, 접근성·권장사항 100이며 검색 허용 표본 5개의 SEO는 100이다. 내부 검색은 의도적인 noindex를 유지한다. [배포 요약](top-brand-deployment.json), [CI 결과](top-brand-actions.json), [최종 성능 표본](top-brand-performance.json).

실제 홈·병원 안내·대장내시경 준비·영어 페이지에서 새 이름과 운영 병원, 제목·공유 정보·구조화 데이터·자기 주소 canonical·접근성 이름이 일치하며 배포 매니페스트의 HTML 해시와 같음을 확인했다. Google 인증 파일, 네이버 인증 태그, 사이트맵 132개 URL, robots.txt 및 llms.txt도 정상이다. [이름·인증 실응답 검사](top-brand-live.json), [전체 실제 배포 검사](top-brand-live-verification.json), [매니페스트](top-brand-build-manifest.json). 검색엔진 계정의 소유권 확인·사이트맵 접수, 실제 검색 노출이나 AI 인용 성과를 확인했다는 의미는 아니다.
