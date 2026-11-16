# F13. 검색 발견·메타·구조화 데이터

상태: 구현. 주 담당 단독 환자 페이지 없음. 관련: F02·F04~F12·F14·F15.

## 목적과 현재 흐름

환자가 읽는 안내의 제목·병원·문서 관계·질문·이미지를 기계도 동일하게 해석하게 한다. 데이터 → 메타·JSON-LD → 정적 내보내기 → 감사 → 배포 후 대조 순으로 검증한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 제목·canonical·언어·OG | `site.ts`, `urls.mjs`, `page-image.mjs` |
| 엔터티·질문·목록 | `structured-data.mjs`, 공통 분류 |
| 탐색 파일 | `scripts/build.mjs`: sitemap·robots·선택적 llms |
| 검증 | `audit.mjs`, `discovery-audit.mjs`, `verify-live.mjs`, `verify-live-seo.mjs` |

## 완료 조건

- AC01: 제목·요약·이미지·언어·canonical이 실제 원고·배포 경로와 맞는다.
- AC02: JSON-LD의 질문·병원·의료진·검사·목록이 보이는 내용과 일치한다.
- AC03: 날짜는 근거 있는 timezone 시각을 사용하고 알 수 없는 시각은 생략한다.
- AC04: review·production·검색 제외·다국어 XML 규칙이 유지된다.
- AC05: 정적 발견 감사의 대상 안내에 미도달 페이지가 없고 주요 12개는 홈에서 직접 연결된다.

## 상태·작업 예시·검증

indexable 설정·Rich Results 문법 검사·Lighthouse 점수·사이트맵 제출을 실제 색인·순위·AI 인용 성과로 바꾸어 보고하지 않는다. 원 사이트와의 독립 문서 관계·공통 병원 ID를 보존한다.

작업 예시: 기존 원고 메타 개선 → 환자 표현·본문 일치 확인 → 대표 이미지·링크·XML 확인 → 기술 검사 → 실제 계정에서 기간을 둔 후속 관측.

검증 접점: `tests/unit/structured-data.test.mjs`, `page-image.test.mjs`; `tests/e2e/structured-data.spec.ts`, `discovery.spec.ts`; 빌드 내 정적·발견 감사. 정책·공식 출처는 [SEO 설계](../seo/seo-aeo-geo.ko.md)에 모은다.
