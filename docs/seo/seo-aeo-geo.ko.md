# SEO·AEO·GEO 설계와 관측

기준일: 2026-11-16. 저장소 구현과 이 날짜에 확인한 공식 문서를 구분해 설명한다. 사이트의 실시간 색인·순위·AI 인용 성과를 이번에 측정한 것은 아니다.

## 1. 목적과 용어

SEO는 환자 안내를 발견·해석할 수 있게 하고, 이 프로젝트에서 AEO는 질문에 답하는 내용 구조, GEO는 생성형 응답에서의 정확한 이해·인용을 관측하는 작업을 가리킨다. 세 용어를 각각 별도 환자 페이지나 비공개 AI 전용 주장으로 구현하지 않는다.

Google은 AI 검색에도 일반 SEO 원칙을 적용하며 별도 특수 최적화를 요구하지 않는다고 설명한다. 해당 링크 자격에는 색인과 스니펫 제공 가능성이 필요하지만 노출은 보장되지 않는다. 이 설명을 다른 모든 AI 서비스의 동작으로 일반화하지 않는다. [Google AI 기능 공식 안내](https://developers.google.com/search/docs/appearance/ai-features).

## 2. 현재 기술 계약

| 항목 | 구현 | 확인 위치 |
|---|---|---|
| HTML 본문 | 원고와 실제 링크를 정적 생성 | App Router·`content.tsx` |
| 제목·설명 | 페이지별 `metaTitle`·`description` | `site.ts`의 `pageMetadata()` |
| canonical | 빌드 origin/basePath + 자기 경로 | `urls.mjs`, `site.ts` |
| OG·Twitter | 절대 URL·실제 대표 이미지·alt | `page-image.mjs`, `pageMetadata()` |
| 탐색 | 8개 메뉴·허브·관련 안내·홈 주요 안내 12개 | `information-architecture.mjs` |
| hreflang | 비자 안내 6개 언어의 상호 연결·x-default | `languageVersions()`, `build.mjs` |
| JSON-LD | 병원·사이트·페이지·의료진·검사·FAQ·목록 | `structured-data.mjs` |
| sitemap·robots | production 후보만 XML, review 빈 XML | `build.mjs` |
| 날짜 | 확인된 시각만 `dateModified`·`datePublished` | 콘텐츠 계약·구조화 데이터·audit |
| 선택적 `llms.txt` | production 안내 링크 모음 | 빌드 스크립트. 검색 효과를 전제하지 않음 |

canonical은 중복·매우 유사한 문서의 대표 URL 신호다. 동일 병원이라는 이유로 두 도메인을 일괄 통합하지 않는다. 독립 안내는 자기 주소를 사용한다. [Google canonical 안내](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## 3. 환자에게 유용한 답변 구조

한 페이지에서 주된 질문을 명확히 하고, 요약 답변 → 필요한 설명·준비 → 한계·위험 신호 → 관련 안내·출처로 이어지게 한다. 질문 제목·앵커·표는 필요한 경우 사용한다. 문장 수나 키워드 반복을 목표로 두지 않는다.

FAQ 구조화 데이터는 화면의 질문·답변과 일치해야 한다. 공개되지 않은 주장·가짜 검토자·추측한 가격·조회수·별점은 추가하지 않는다. 구조화 데이터 문법 통과는 검색의 특별 표시를 보장하지 않는다. [Google 구조화 데이터 정책](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## 4. 병원·문서 식별과 날짜

`MedicalClinic` ID는 `https://yttop.co.kr/#clinic`, 새 `WebSite`와 페이지 ID는 새 사이트 origin을 사용한다. 병원 실체와 사이트 제품 이름을 구분하며 `content/clinic.json`의 사실을 사용한다. 사용자 공개 확인은 의사의 개인 검토자 표기가 아니다.

의료진·검사·FAQ·Article 등의 그래프는 실제 화면 역할과 비교한다. Article의 날짜는 `modifiedAt`·`publishedAt`을 확인하고, 없는 게시 시각을 만들지 않는다. [Google Article 속성 안내](https://developers.google.com/search/docs/appearance/structured-data/article).

## 5. 언어·사이트맵·검색 제외

현재 전면 다국어 사이트가 아니라 **비자검진 안내 한 주제의 한국어+번역 5개**다. 서로 대응하는 안내만 hreflang으로 연결한다. `/zh-hans/` URL과 `zh-Hans` 언어 태그의 표기를 구분한다. [Google 다국어 안내](https://developers.google.com/search/docs/specialty/international/localized-versions).

XML은 production에서 132개 색인 후보를 제공한다. `/search/`, `/cases/`, `/404.html`은 제외한다. XML 제출은 수집·색인 완료 증거가 아니며, 내부 링크도 함께 유지한다. [Google 사이트맵 안내](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

review/noindex는 인증 수단이 아니다. robots로 검토 문서를 전부 막아 noindex 읽기를 방해하지 않는다. 하위 경로의 robots 파일은 호스트 루트 파일과 역할이 같다고 가정하지 않는다.

## 6. 검증과 성과 확인

| 층위 | 사용할 증거 | 알 수 없는 것 |
|---|---|---|
| 콘텐츠 | 원고·근거·환자 목적 검토 | 검토만으로 실제 검색 노출 |
| 정적 품질 | `audit:static`, `audit:discovery`, 구조화 데이터 검사 | Google의 실제 크롤링·색인 |
| 배포 품질 | 같은 실행 매니페스트로 실제 HTML·robots·XML 대조 | 개별 환자의 이용 만족도 |
| 검색 계정 | Search Console 등의 확인 가능한 기간·속성 보고서 | 데이터에 없는 AI 서비스별 성과 |
| AI 관측 | 질문 버전·서비스·모델·언어·시점·인용·사람의 판정 | 전체 이용자 환경의 대표성 |

발견 감사는 검색·사이트맵·브레드크럼을 제외한 **정적 본문 링크 그래프**를 분석한다. 이를 실제 크롤러 데이터로 보고하지 않는다. AI 관측은 새 사이트·원 사이트·둘 중 하나의 인용, 브랜드 언급, 오류·미검토를 분리한다. 미측정은 0이 아니다.

계정 소유 확인 파일·태그가 존재해도 계정 연결·권한·색인이 확인된 것은 아니다. 이번 문서 작업에서는 루트의 미추적 Google·Naver 확인 파일을 변경·배포하지 않는다.

## 7. 변경 시 절차

1. 환자의 필요와 본문·제목·요약·근거를 먼저 확인한다.
2. 관련 안내·분류·검색 용어와 대표 이미지를 연결한다.
3. review 빌드의 HTML·JSON-LD·언어·URL·공개 경계를 검사한다.
4. 현재 내용에 필요한 실제 공개 근거를 확인해 production 검사·배포를 수행한다.
5. 계정 권한이 있는 운영자가 수집·색인·클릭을 추적한다. 관측 기간과 자료 출처를 내부 기록에 남긴다.

환자의 추가 행동을 요구하는 측정 기능은 [제품 기준](../patient-content-policy.ko.md)에 따라 보류한다. 원 사이트 수정은 이 절차의 필수 조건이 아니다.
