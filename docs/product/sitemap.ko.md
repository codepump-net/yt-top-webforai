# 사이트맵과 정보구조

기준일: 2026-11-16. 실제 경로 원장은 `content/pages.json`, 목적 원장은 `content/page-intents.json`이다. 이 문서는 분류를 설명하며 새 공개 페이지를 추가하지 않는다.

## 1. 세 종류의 사이트맵

| 종류 | 독자·목적 | 구현·저장 위치 |
|---|---|---|
| 설계 사이트맵 | 개발자가 사용자 여정과 기능 책임을 이해 | 이 문서와 [136개 전체 경로표](route-catalog.csv) |
| HTML 사이트맵 | 방문자가 안내를 탐색 | `/sitemap/`, `siteMapGroups()` |
| XML 사이트맵 | 검색엔진에 색인 대상 후보를 알림 | production `web/out/sitemap.xml` |

현재 HTML 사이트맵에는 검색 등 사이트 이용 경로도 포함되므로 XML과 개수가 같아야 하는 것은 아니다. review XML은 비어 있고, 검토용 후보는 `web/reports/planned-sitemap.xml`에만 둔다.

## 2. 사용자 관점의 구조

메뉴는 **8개**다. URL 계층과 메뉴 분류는 다를 수 있다. 예를 들어 `/services/cancer-support/`는 독립 메뉴이며 `/health/` 원고 일부는 증상·질환·검사 분류에 연결된다.

```text
TOP 건강백과 /
├─ 증상백과 /symptoms/
│  ├─ 심장·혈관 증상 /symptoms/cardio/.../ (20편)
│  └─ 복통·기침·암 치료 증상 등 관련 기존 안내 연결
├─ 질환백과 /diseases/
│  ├─ 심장·혈관 질환 /diseases/cardio/.../ (20편)
│  └─ 소화기·감염·내분비 등 관련 안내 연결
├─ 진료분야 /conditions/
│  ├─ 심장·소화기·호흡기·만성질환
│  ├─ 갑상선·경동맥·경부 멍울, 신장질환과 하위 안내
│  └─ 성인 예방접종 /services/vaccinations/ 등 연결
├─ 검사·시술 /services/
│  ├─ 심장검사 /services/heart/.../
│  ├─ 초음파 /services/ultrasound/.../
│  ├─ 내시경 /services/endoscopy/.../
│  └─ 검사 준비 /preparation/ → /health/.../의 준비·후속 관리
├─ 암환자 지지치료 /services/cancer-support/
│  └─ 치료 중 증상·발열 안내 /health/.../
├─ 검진·서류 /checkups/
│  ├─ 국가·암·채용·공무원·마약·결핵·비자검진
│  └─ 비자검진 번역 /en|zh-hans|th|ru|ne/checkups/visa/
├─ 병원안내 /about/
│  ├─ 의료진 /doctors/ → /doctors/{id}/
│  ├─ 진료시간·오시는 길 /visit/
│  └─ 비용·서류 /fees/, 건강 안내 /health/
└─ 공지사항 /notices/
   ├─ 자체 환자 안내 /notices/{slug}/ (6편)
   └─ 기존 병원 공지 게시판으로 연결

사이트 이용: /search/, /sitemap/, /privacy/, /copyright/
특수 경로: /cases/ (원문 연결·발견 경로 제외), /404.html
```

`/symptoms/cardio/`, `/diseases/cardio/`는 URL 접두사이며 독립 허브가 원장에 등록되어 있지는 않다. 위 트리의 `...`·`{id}`·`{slug}`·언어 선택 표기는 설명용이다. 정확한 URL은 전체 경로표를 사용한다.

## 3. 발견·색인 정책

| 경로·자원 | 내부 검색 | HTML 사이트맵 | production XML | 색인 지시 |
|---|---|---|---|---|
| 일반 환자 안내 | 포함 | 포함 | `indexable: true`이면 포함 | production에서 허용 |
| `/search/` | 검색 항목 제외 | 포함 | 제외 | noindex, follow |
| `/sitemap/` | 검색 항목 제외 | 사이트 이용에 포함 | 포함 | production에서 허용 |
| `/cases/` | 제외 | 제외 | 제외 | noindex, nofollow, nosnippet, noimageindex |
| `/404.html` | 제외 | 제외 | 제외 | noindex, follow·정상 HTTP 404 |
| `/search-index.json` | 검색에 사용하는 정적 자원 | 페이지 아님 | 제외 | 페이지 원장의 경로 수에 미포함 |
| 내부 문서·검수·보고서 | 제외 | 제외 | 제외 | `out/`에 복사하지 않음 |

review는 일반 페이지도 noindex로 만든다. `indexable: true`는 원고 설정이고 실제 배포 모드·승인 검증·검색엔진 수집 결과는 별개다.

## 4. 경로표의 사용법

[route-catalog.csv](route-catalog.csv)는 `page_id, path, title, language, template, section_id, section_label, primary_feature, indexable, patient_need`를 연결한다. 모든 원장 경로에는 주 담당 기능 하나를 지정한다. UI·검색·SEO·배포처럼 여러 페이지에 영향을 주는 기능은 [기능 목록](../features/README.md)에서 별도로 연결한다.

이 표는 원고를 대체하지 않는 생성 문서다. 원장에서 수정한 뒤 저장소 루트에서 다음을 실행한다.

```sh
node docs/tools/update-inventory.mjs
node docs/tools/update-inventory.mjs --check
```

Node.js 24를 사용한다. 검사는 원장·목적·기능 연결 누락과 생성 문서의 차이를 확인한다.

## 5. 페이지 추가 절차

1. 기존 안내로 해결 가능한지 확인하고 환자의 필요를 정의한다.
2. 기능 명세와 `page-intents.json`에 범위를 정한다.
3. `pages.json`에 고유 ID·끝 슬래시 경로·근거 있는 원고를 등록한다.
4. `information-architecture.mjs`의 허브·`sectionId()`·메뉴·관련 링크를 확인한다. 접두사만으로 올바른 분류가 자동 결정된다고 가정하지 않는다.
5. 검색 별칭·번역·구조화 데이터·시각자료를 필요한 만큼 연결한다.
6. 생성 경로표를 갱신하고 콘텐츠·정적 출력·관련 동작을 검사한다.
7. 새 의료·운영 내용에 필요한 실제 확인을 갖춘 후 production으로 배포한다.

기존 76페이지 계획이나 `route-map.csv`로 폐기한 페이지를 복원하지 않는다. 삭제·URL 변경 시 원문 관계·링크·호스팅의 실제 응답을 검토하며 일괄 이전을 적용하지 않는다.
