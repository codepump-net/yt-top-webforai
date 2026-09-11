# 검색 공개 전환과 구조화 데이터 확장

2026-09-11. 내부 릴리스 기록이며 웹 출력에는 포함하지 않는다.

**배포 완료: 검색 공개 대상 43개 URL 전부 실제 모바일 Lighthouse SEO 100점을 확인했다.** 2026-09-11 16:51~16:55 KST에 배포 URL을 개별 측정했으며 실패·실행 오류·경고는 없었다. 이 100점은 Lighthouse SEO 자동 검사 점수다. 실제 색인 완료, 검색 순위, AI 인용 성과는 이 검사에 포함되지 않는다.

사용자는 이 대화에서 실제 의료·운영 확인과 검색 공개 조건 검토를 마쳤다고 명시하고 검색 공개와 구조화 데이터 확장을 지시했다. 그 확인을 `content/publication-approval.json`에 기록했다. 기록 시각은 확인을 파일에 옮긴 시각이며 의료진의 실제 검토 시각으로 표시하지 않는다. 특정 검토자의 이름은 제공되지 않았으므로 개별 의료진에게 검토나 집필을 임의로 귀속하지 않았다.

확인 기록은 전체 원고, 병원 운영 사실, 의료진, 자산, 사례 링크, 페이지 목적과 렌더러의 SHA-256에 연결된다. 공개 대상 목록과 approved 상태도 검사한다. 확인 내용이 빠지거나, 사실·본문·렌더링·범위가 달라지거나, 기록이 만료되면 production 검증이 실패한다. 기록의 최대 유효기간은 내부 관리 정책으로 1년이며 자동으로 갱신하지 않는다. 기존 실명 의료진/운영자 검토 기록 검증 경로도 유지한다.

병원 안내·진료·검사 등 43개 페이지를 색인 대상으로 공개한다. 사이트 내 검색과 오류 페이지는 기존 목적에 따라 noindex를 사용한다. main의 GitHub Pages 빌드는 production이 기본이고 PR·로컬 기본 빌드는 review다. 배포 후 공개 HTML의 해시·canonical·색인 지시어와 사이트맵 URL 전체를 같은 실행의 매니페스트와 비교한다.

구조화 데이터는 기존 병원 ID `https://yttop.co.kr/#clinic`을 유지하면서 아래 정보를 확장했다. 각 정보는 환자에게 제공되는 기존 데이터와 같은 원장을 사용한다.

| 영역 | 확장 내용 |
|---|---|
| 병원·연락처 | MedicalClinic, ContactPoint, logo ImageObject, 병원·신규 사이트 연결 |
| 탐색 | WebSite·SearchAction·EntryPoint, BreadcrumbList, CollectionPage·ItemList |
| 의료진 | ProfilePage·Person, 실제 전문의·인정의 자격의 EducationalOccupationalCredential, 학회 MedicalOrganization |
| 진료·검사 | Service·ServiceChannel, MedicalTest·ImagingTest·BloodTest·MedicalProcedure |
| 건강정보 | MedicalWebPage와 Article의 연결, 소개·분야·수정일·citation |
| 질문·답변 | 본문과 동일한 FAQPage·Question·Answer, 질문별 고유 앵커와 근거 |
| 검색 동작 | 구조화 데이터에 기재된 `/search/?q=...`가 실제 검색어로 열리도록 연결 |

환자에게 존재하지 않는 가격·후기·좌표·의사별 검토 사실·검사시간은 추가하지 않았다. 토요일의 확인되지 않은 점심 적용은 기존 원장대로 보류한다. 의료진 실루엣을 실제 얼굴 이미지로 구조화하지 않는다. 공지 게시판과 사례 원문 25개는 기존 병원 사이트로 연결한다.

FAQPage는 본문 질문과 답변을 표현하는 schema.org 데이터다. Google FAQ 리치결과 노출을 주장하지 않는다. 스키마 개수나 Lighthouse 점수는 실제 검색 순위나 AI 인용률이 아니다. 구조와 검사 항목은 [schema.org MedicalTest](https://schema.org/MedicalTest), [ServiceChannel](https://schema.org/ServiceChannel), [FAQPage](https://schema.org/FAQPage)를 참고했다.

로컬 production 빌드에서 45개 경로의 정적 검증, 52개 단위 검사, 17개 Python 하네스 검사, 31개 브라우저 검사가 통과했다. lint·타입 검사와 의존성 보안 감사도 통과했다. Lighthouse 모바일 검사에서 홈·심장초음파·대장내시경 준비 페이지 SEO는 100, 접근성 100, 성능 99였고 CLS는 0이었다. 내부 검색 페이지의 noindex에 따른 SEO 66은 의도한 색인 정책으로 구분한다.

전체 그래프에 29종의 schema.org 타입을 사용한다. 27개 페이지의 질문·답변 82개, 21개 진료 서비스, 11개 목록, 4개 건강정보 Article, 의료진 프로필 2개를 포함한다. 이는 중첩된 타입을 포함한 구현 범위이며 공식 최적화 점수가 아니다. [구조화 데이터 집계](schema-summary.json).

비교 사이트에서 관찰한 Article·FAQPage·Person·자격·학회·목록·검색 동작을 현재 원고에 맞춰 구현했다. 영통탑은 기존 11종에서 29종으로 확장됐으며, 두 공개 블로그의 표본에서는 각각 20종을 관찰했다. 영통탑은 정상 페이지 44개 전수, 비교 사이트는 13개·15개 표본이므로 종류 수를 품질 순위로 해석하지 않는다. 검사 안내가 중심인 영통탑에는 Service·ServiceChannel과 구체적인 MedicalTest 계열을 추가했다. 저자·검토자 이름과 좌표는 실제 확인된 값이 없으므로 채우지 않았다.

schema.org 공식 어휘의 타입 이름과 속성 적용 대상을 대조한 추가 검사에서 44개 페이지, 타입이 있는 객체 1,112개, 속성 4,113개에 오류가 없었다. 이는 속성값 전체 검증이나 Google 리치결과 적격성 검사와 구분한다. [어휘 검사 결과](schema-vocabulary-check.json).

실제 배포 커밋은 `8d3471e8baf6d11cd8105ad9feaa1321f0d0a6b1`이다. [GitHub Actions 실행 34575963391](https://github.com/codepump-net/yt-top-webforai/actions/runs/34575963391)의 루트·프로젝트 경로 검증과 Pages 배포가 모두 성공했다. 배포 후 2026-09-11 16:49 KST에 같은 실행의 매니페스트로 45개 경로의 HTML 해시·canonical·색인 지시어와 사이트맵 43개 URL을 검사했고 실패가 없었다. 임의의 존재하지 않는 경로도 실제 HTTP 404로 확인했다. `/404.html` 파일 자체의 200 응답과 구분한다. [배포 검증](live-verification.json), [CI 실행 기록](ci-run.json).

CI 프로젝트 경로의 모바일 실험에서는 공개 표본 3개가 SEO·접근성·권장사항 각각 100점, 성능 98~99점이었다. 로컬 측정과 CI 측정은 환경이 다른 별도 기록이다. [CI 프로젝트 성능](ci-project-performance.json), [CI 루트 성능](ci-root-performance.json), [로컬 성능](local-performance.json).

배포 후 `npm run verify:live:seo`로 색인 대상 43개 URL을 Lighthouse 13.4.1의 기본 모바일 SEO 검사로 각각 1회 측정했다. 매니페스트의 대상 목록과 측정 목록을 대조해 누락·중복 없이 43/43개가 100점이고, 실행 오류·실패 항목·경고가 없으며 최종 URL도 일치함을 확인했다. 내부 검색·오류 페이지는 의도한 noindex 대상이므로 이 43개 전수 측정 범위에서 제외한다. [URL별 실제 SEO 결과](live-seo.json).

| 확인 항목 | 변경 전 | 배포 후 |
|---|---|---|
| 정상 페이지 색인 지시 | 44개 모두 noindex | 공개 43개 index, 내부 검색 1개 noindex |
| 사이트맵 | 0 URL | 공개 대상과 동일한 43 URL |
| 실제 모바일 Lighthouse SEO | 홈 66점 | 공개 대상 43/43 URL 모두 100점 |
| 구조화 데이터 종류 | 11종 | 29종, 중첩 타입 포함 |
| 구조화된 질문·답변 | FAQPage 없음 | 27개 페이지의 82개 문답 |
| 구조화된 진료·검사 서비스 | Service 없음 | Service 21개 및 해당 검사별 의료 타입 |
| 실제 검색·AI 성과 | 미측정 | 미측정 |

변경 전 증거는 [비교 보고서](../seo-aeo-geo-comparison-2026-09-11/README.ko.md)에 보존했다. 두 공개 참고 블로그의 홈 SEO도 당시 100점이었으므로 영통탑의 색인 허용에 따른 자동 검사 점수 차이는 해소됐다. AEO·GEO의 성과 우위나 모든 SEO 항목에서의 우위를 의미하지 않는다. GitHub Pages 호스트 루트 robots 제어 범위와 검색도구의 실제 색인·노출 관찰은 기존 비교 보고서의 설명을 따른다.
