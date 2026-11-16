# F09. 사이트 검색·검색 개인정보

상태: 구현. 주 경로: `/search/`. 정적 자원: `/search-index.json`. 관련: F01·F02·F03·F10·F12·F15.

## 목적과 현재 흐름

환자가 쓰는 증상·질환·검사 용어로 안내를 찾는다. 홈은 `/search/#q=...`로 별도 문서 이동하고, 검색 화면은 같은 사이트의 정적 JSON을 읽어 브라우저에서 검색한다. 기존 `?q=` 입력도 호환한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 자료 구성 | `search-model.mjs`, `search-aliases.json`, 백과 분류 |
| 생성 | `app/search-index.json/route.ts`의 `force-static` GET |
| 상호작용 | `home-search.tsx`, `site-search.tsx`, `search.tsx` |
| 보호 | `analytics.mjs`, `analytics.tsx`, 개인정보 안내 |

## 현재 매칭·상태

NFKC·소문자·공백으로 정규화하고 입력 단어 모두가 포함되는 항목을 찾는다. 제목 일치·시작·포함, 제목 단어·본문 제목·설명을 점수화해 정렬한다. 별칭과 분류 용어도 사용한다. 임베딩·외부 검색 API·진단 모델을 사용하지 않는다.

입력 전 안내, 색인 로딩·실패·재시도, 결과 수·분야 필터, 결과 없음·전체 목록 복구 상태를 다룬다. 입력은 최대 120자다.

## 완료 조건

- AC01: 대표 환자 용어로 의도한 기존 안내가 검색되며 관련성 있는 제목이 우선한다.
- AC02: 사례·404·검색 자체·사이트맵은 사이트 검색 색인에서 제외한다.
- AC03: 새 검색어는 fragment로 전달하고 외부 분석에 검색어·쿼리·fragment를 포함하지 않는다.
- AC04: `?q=` 호환과 검색 URL 제외 동작을 보존한다. 기존 query URL을 쓰는 경우 호스팅 요청 자체에는 query가 전달될 수 있음을 구분한다.
- AC05: 색인 실패·결과 없음·JavaScript 없음에도 재시도 또는 전체 페이지 탐색 경로가 있다.

## 작업 예시·검증

작업 예시: 기존 검색어와 해당 원고를 확인 → 별칭 1개 추가 → 다른 결과와 순위 확인 → 사례 제외·검색어 전송 방지 회귀 확인. 별칭을 의학적 근거나 검색량 증거로 사용하지 않는다.

검증 접점: `tests/unit/integrated-update.test.mjs`, `analytics.test.mjs`; `tests/e2e/discovery.spec.ts`, `ui-regressions.spec.ts`, `analytics.spec.ts`.
