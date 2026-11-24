# 콘텐츠 모델과 변경 계약

기준일: 2026-11-16. 실행 가능한 상세 계약은 `web/scripts/content-contract.mjs`, 공개 범위는 `public-content-policy.mjs`, 추가 환자 자료는 `patient-additions-contract.mjs`가 기준이다.

## 1. 원장의 소유 정보

| 파일(`content/` 기준) | 소유 정보 | 주요 사용처 |
|---|---|---|
| `site.json` | TOP 건강백과 이름·운영자 표시 | 브랜드·메타·JSON-LD |
| `clinic.json` | 병원 사실·주소 부품·시간 구간·원 사이트 | 전화·방문·병원 엔터티 |
| `physicians.json` | 의료진 2명의 실제 프로필·이미지 종류 | 목록·상세·Person |
| `pages.json` | 136개 경로·원고·질문·출처·색인 설정 | 화면·SEO·검색·빌드 |
| `page-intents.json` | 경로별 환자 필요 | 내부 콘텐츠 범위 검사 |
| `encyclopedia-categories.json`, `search-aliases.json` | 환자용 분류·검색 용어 | 허브·검색 |
| `assets.json`, `visuals.json` | 자산 출처·해시·크기, 배너·도해 연결 | 자산 검사·본문·대표 이미지 |
| `notices.json` | 자체 환자 안내 6편의 목록·기간·문서 정보 | 공지 UI·공지 상세 |
| `official-channels.json`, `case-links.json` | 공식 채널 3개·원 사례 25개 연결 | 외부 링크 |
| `reviews.json`, `publication-approval.json` | 실제 검토 이력·사용자 공개 확인 | production 검증, 공개 검토자 표시 조건 |
| `analytics.json` | 태그 ID와 설정 모드 | production 분석 컴포넌트 |
| `measurement-queries.json`, `measurement-conversations.json` | 평가 질문 73개·대화 13개(39턴) | 내부 수동 관측 집계 |

내부 원장 전체를 `public/`에 복사하지 않는다. 검색 JSON은 검색에 필요한 환자용 내용을 변환한 별도 공개 자원이다.

## 2. Page 계약

| 묶음 | 주요 필드 | 변경 규칙 |
|---|---|---|
| 식별·경로 | `id`, `path`, `template`, `category` | ID·경로 고유, 일반 경로 끝 `/`, 템플릿과 화면 분기 확인 |
| 설명 | `title`, `metaTitle`, `description`, `intro` | 환자 목적과 본문 일치, 메타 제목·설명 중복 검사 |
| 본문 | `blocks`, `questions`, `related` | 의미 있는 섹션·실제 질문 답변·존재하는 관련 ID |
| 근거 | `sources`, `risk`, `contentKind` | 병원 사실·의학 근거 구분, 참조와 주장의 일치 |
| 시각자료 | `image` | 자산·시각자료 원장과 선택 로직 확인 |
| 언어 | `language`, `translationOf` | 지원 언어·원문 ID·URL 접두사 일치 |
| 시점 | `updatedAt`, `modifiedAt`, `publishedAt` | 수정·게시·검토 시각을 혼동하지 않음 |
| 공개 | `indexable`, `reviewStatus`, `urgentNotice` | 플래그만으로 승인·안전성을 만들지 않음 |

현재 `description`은 20~260자, 페이지당 질문은 최대 8개다. 이는 프로젝트 계약이며 검색엔진의 보편적 글자 수 요건을 의미하지 않는다. 스키마는 `.strict()`이므로 미정의 필드를 임의로 추가할 수 없다. `template` 자체는 현재 문자열로 허용하므로 화면과 구조화 데이터 분기까지 편집자가 확인한다.

## 3. 블록·질문·출처 연결

`blocks`는 `heading`, `text`와 선택적 `paragraphs`, `items`, `steps`, `table`을 지원한다. 목록만 있는 블록의 `text`는 빈 문자열일 수 있으나 완전히 빈 블록은 안 된다. 표는 caption·columns·rows와 각 행의 열 수를 맞춘다.

블록·질문의 `id`는 안정적인 영문 앵커다. `sourceIds`는 같은 페이지의 출처 ID, `links`는 `pageId`와 선택적 `anchor`를 참조한다. 링크 대상·앵커가 실제 존재해야 한다. `questions`, `related`는 예약 앵커라 개별 ID로 재사용하지 않는다.

`sources.kind`의 `clinic`은 병원 사실, `medical`은 의학적 근거다. `checkedAt`은 출처 확인일이며 의료진 검토일이 아니다. 다른 서비스의 Q&A에서 질문을 찾았다는 이유로 의학 근거·빈도 자료로 사용하지 않는다.

## 4. 공통 사실 해석

원고에는 가능한 경우 `{{clinic.phone}}`, `{{clinic.address}}`, `{{clinic.hours.ID}}` 등을 사용한다. `resolveClinic()`·`resolvePages()`가 표시 주소·시간을 생성하고 본문과 검사에 동일하게 적용한다. 전화번호·주소를 문장마다 복사하면 변경 시 불일치가 생긴다. 새 플레이스홀더는 resolver의 지원 범위를 확인한다.

주소 좌표·검사 가격·검사 가능 여부·결과 소요 시간은 근거 없이 채우지 않는다. 공통 사실 수정은 영향을 받는 모든 페이지의 확인과 공개 근거 검증을 고려한다.

## 5. 날짜의 의미

| 필드 | 형식·용도 |
|---|---|
| `updatedAt` | 한국 달력 날짜 `YYYY-MM-DD`. 환자 표시와 XML `lastmod` |
| `modifiedAt` | 확인된 시간대 포함 ISO 8601 시각. JSON-LD `dateModified` |
| `publishedAt` | 근거 있는 최초 게시 시각 또는 `null` |
| 검토 기록의 날짜 | 실제 검토 시점·만료. 수정일·게시일과 별개 |

`modifiedAt`의 한국 날짜는 `updatedAt`과 같고 미래여서는 안 된다. 알 수 없는 시각은 생략하며 자정·빌드 시각으로 만들지 않는다. 기존 Git 기록은 원고 변경의 근거일 뿐 의료 검토 시점은 아니다. [날짜 수정 이력](../client-requests/structured-data-datetime-2026-11-08/README.ko.md).

## 6. 공개 확인과 렌더러

`scripts/data.mjs`의 `loadContent()`는 해석한 원고와 병원 사실, 주요 템플릿·CSS·분류·검색·분석 코드를 해시한 `rendererDigest`를 반환한다. `publicationDigest()`는 내용·범위·공통 사실·렌더러와 실제 공개 확인을 결합한다.

`reviewStatus: approved`나 파일 존재만으로 production이 허용되지 않는다. 확인 범위·digest·기간·실제 증거를 검사한다. `reviews.json`은 현재 빈 배열이며 사용자 공개 확인을 임의의 의사 이름으로 바꾸어 표시하지 않는다. 빌드 실패를 해결하려고 확인 시각·digest를 자동 갱신하지 않는다.

## 7. 변경 영향 예시

| 변경 | 함께 확인할 항목 |
|---|---|
| 새 증상 원고 | 목적·허브·별칭·관련 링크·위험 신호·SEO·공개 근거 |
| 진료시간 수정 | 공통 시간 해석·방문·푸터·번역·JSON-LD·운영 확인 |
| 공지 기간 수정 | `pages`와 `notices` 일치·시작/종료 경계·홈 제외 여부 |
| 이미지 교체 | 출처·해시·치수·alt·확대·OG·원본 검증 |
| 레이아웃 분리 | 기존 HTML·키보드·인쇄·성능·renderer digest |
