# 영통탑내과 React 정적 홈페이지 개발 스펙

> 현재 구현에는 [환자용 콘텐츠 기준](patient-content-policy.ko.md)과 [전수 정리 보고서](content-audit-2026-09-11/README.md)를 우선 적용합니다. 아래 페이지 구성과 이관 가정은 사전 설계 이력이며 현재 사이트를 다시 생성하는 기준이 아닙니다.

버전 **1.0 · 2026-09-11**. 상태: **개발 기준 문서**. 이번 산출물은 설계이며 애플리케이션 설치·구현·배포 완료를 의미하지 않는다. 요구사항의 ‘필수’는 구현 완료 기준, ‘후속’은 초기 공개 이후 확장 범위다.

> 후속 [상세 실행 계획 v1.1](implementation-plan/README.md)이 페이지별 구현·파일명·개발 순서를 구체화한다. v1.1에서는 기존 후속 범위까지 한 개발 프로젝트의 대상으로 포함한다. 저장소는 `codepump-net/yt-top-webforai`, 기본 브랜치는 `main`, Pages 조회는 404로 확인되었다. 아래의 미확정 저장소 가정은 이 확인값으로 갱신한다.

**기술 기준은 Next.js App Router + React + TypeScript + Tailwind CSS의 정적 생성(SSG), 배포 대상은 GitHub Pages로 정한다.** 모든 공개 경로의 본문을 빌드 시 HTML로 생성한다. 이전 조사에서 제시한 Astro 후보는 사용자의 React 기반 개발 방향에 따라 이 문서로 대체한다.

## 1. 목표와 범위

환자가 진료 분야·의료진·검사 준비·방문 방법을 정확하게 이해하고, 검색 및 AI 답변 시스템이 같은 정보를 읽고 출처로 연결할 수 있는 한국어 홈페이지를 만든다. 프레임워크·FAQ·구조화 데이터만으로 AI 인용이나 상위 노출을 보장하지 않는다.

| 구분 | 초기 개발 범위 |
|---|---|
| 대상 | 영통탑내과. 기존 사이트는 [yttop.co.kr](https://yttop.co.kr/) |
| 기본 기능 | 병원·의료진·진료/검사·검진·방문·공지·검수된 질문 답변 |
| 주요 행동 | 전화 문의, 지도 열기, 검사 준비 확인, 관련 의료진 확인 |
| 검색 노출 | 페이지별 HTML·메타·대표 URL·사이트맵·의미에 맞는 구조화 데이터 |
| 콘텐츠 운영 | Git 저장소의 승인된 구조화 데이터와 Markdown, PR 기반 수정 이력 |
| 후속 기능 | 정적 사이트 검색, 온라인 예약 서비스 연결, 검수 완료한 증례·건강 글 확장 |
| 별도 서비스 영역 | 회원, 환자 정보 입력, 상담·진료기록 저장, 결제, 실시간 예약 잔여석, AI 진단 챗봇 |

초기에는 개인 의료 정보를 받는 폼을 만들지 않는다. 온라인 예약이 필요해지면 병원이 실제 운영하는 승인된 외부 서비스로 이동하며, 정적 화면만 만들어 예약 완료로 표시하지 않는다.

### 개발 중 확정할 운영값

GitHub 소유자·실제 저장소명·Pages 설정·최종 대표 도메인은 아직 확인되지 않았다. 개발 가정은 프로젝트 경로 `/yt-top-webforai`, 미리보기 색인 제외, 운영 도메인은 환경 설정으로 주입하는 방식이다. 기존 `yttop.co.kr`의 DNS·서버를 변경하지 않는다. 이 미확정 항목 때문에 컴포넌트·콘텐츠 계약·로컬 정적 빌드 개발을 중단할 필요는 없다.

GitHub는 Pages를 온라인 비즈니스 운영이나 상거래를 주목적으로 하는 무료 호스팅으로 사용하는 데 제한을 둔다. **병원 홍보·예약 유도가 포함된 운영 홈페이지의 용도가 허용되는지는 별도로 판단해야 하며, 정적 사이트라는 이유만으로 허용된다고 단정하지 않는다.** Pages용 개발·검증 구성은 유지하고, 운영 용도가 제한에 해당하면 동일한 `out/`을 적합한 정적 호스팅으로 옮길 수 있도록 설계한다. 이 문서는 Pages의 운영 사용 승인을 의미하지 않는다. [GitHub Pages 이용 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## 2. 기존 조사 자료의 적용

| 입력 | 개발에 사용하는 방식 | 그대로 게시하지 않는 항목 |
|---|---|---|
| [병원 정보 원장](../research/2026-09-11-yttop/hospital-information.ko.md)·[사실 JSON](../research/2026-09-11-yttop/data/hospital-source-facts.json) | 운영 담당자가 확인한 사실만 콘텐츠 원장으로 이관 | 미확인·상충 정보, OCR 추정 |
| [19개 진료·검사 목록](../research/2026-09-11-yttop/data/service-catalog.csv) | 서비스 ID·경로·페이지 초안의 입력 | 원문 전체 및 과장된 효과 표현 |
| [145개 URL 목록](../research/2026-09-11-yttop/data/page-inventory.csv) | 유지·통합·이전·제외 대응표 작성 | URL 수만큼 기계적으로 새 페이지 생성 |
| [국내 Q&A 레퍼런스](../research/2026-09-11-korean-medical-qa/reference.ko.md) | 질문 설계 후보와 검증 기준 | 지식iN·하이닥 답변 원문, 환자 사연, 미검증 ‘고빈도’ 표시 |
| [기존 하네스](../harness/README.md) | 사실·근거·검수 기록·측정 규칙 재사용 | 합성 병원 예제의 공개 데이터 전환 |

현재 자료의 구체적인 확인 필요 항목은 현재 의료진, 토요일 점심 적용, 날짜별 휴진, 주차, 검사별 예약·준비·결과일, 마약검사 항목 충돌, 이벤트 가격과 유효기간, 증례·사진 이용 범위다. 예를 들어 과거 홈에 있는 의료진을 현재 소개에 합치지 않는다.

외부 Q&A 색인은 18개 출처·질문 후보 13개이지만 **고빈도 검증 및 게시 승인 자료는 0개**다. 이를 자동으로 ‘자주 묻는 질문’의 통계 근거로 사용하지 않는다. 수요 빈도가 미확인인 자체 질문 답변은 ‘검사 전 궁금한 점’처럼 사실에 맞는 제목을 사용할 수 있으며, 답변의 의료 검수는 동일하게 필요하다.

## 3. 기술 스택과 선택 이유

| 영역 | 개발 기준 | 선택 이유·제약 |
|---|---|---|
| 런타임 | Node.js **24 LTS** | 빌드와 CI에서 같은 버전 사용. 실행 서버는 운영하지 않음 |
| 프레임워크 | Next.js **16 계열 안정 버전**, App Router | React 기반 페이지 라우팅·빌드 시 HTML 생성·메타 관리 |
| UI | React **19 계열**, `react-dom` 같은 버전 | Next.js가 지원하는 조합으로 고정 |
| 언어 | TypeScript `strict` | 데이터 참조와 페이지 입력 타입 검사 |
| 스타일 | Tailwind CSS **4 계열** + CSS 변수 | 간격·색·타입 토큰을 공유하고 반응형 화면 구현 |
| 콘텐츠 | JSON + Markdown + 빌드 시 스키마 검증 | 운영 정보와 의학 본문을 분리하고 변경 이력 유지 |
| 검증 도구 | Zod, ESLint, Vitest, Playwright, axe-core, Lighthouse CI | 계약·핵심 동작·접근성·성능을 구분해 검사 |
| 패키지 관리 | npm + 커밋된 `package-lock.json` | Windows·Linux에서 `npm ci`로 재현 |
| 배포 | GitHub Actions → Pages artifact | 앱의 정적 산출물만 업로드 |

메이저 계열은 설계 기준이다. 착수 시 공식 안정 릴리스와 호환성·보안 공지를 확인해 **정확한 패치 버전을 lockfile에 고정**하고 `docs/toolchain-lock.md`에 기록한다. CI에서 `latest`로 매번 다른 버전을 설치하지 않는다. Next.js의 최소 Node 요구 버전과 지원 종료 여부는 다르므로, 최소 조건만 보고 종료된 Node를 채택하지 않는다. [React 버전](https://react.dev/versions), [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation), [Node.js 릴리스](https://nodejs.org/en/about/previous-releases).

React는 신규 앱에 프레임워크 사용을 권장한다. 이 프로젝트는 정적 HTML 생성과 라우팅을 함께 다루기 때문에 Next.js를 선택한다. 별도 React Router를 중복 설치하거나 Create React App으로 시작하지 않는다. [React 신규 앱 안내](https://react.dev/learn/creating-a-react-app), [Create React App 종료 안내](https://react.dev/blog/2025/02/14/sunsetting-create-react-app).

Tailwind는 공식 Next.js 연결 방식인 PostCSS 플러그인과 CSS import를 사용한다. 핵심 UI는 네이티브 링크·버튼·`details`로 만들고, 복합 Dialog가 필요할 때만 접근성이 확인된 UI 라이브러리를 제한적으로 도입한다. Redux, 클라이언트 데이터 패칭 라이브러리, 애니메이션 프레임워크는 초기 필수 의존성이 아니다. [Tailwind 설치](https://tailwindcss.com/docs/installation/framework-guides/nextjs).

## 4. 렌더링 및 정적 호스팅 구조

```mermaid
flowchart LR
  A[승인된 콘텐츠·병원 원장] --> B[계약·출처·검수 검사]
  B --> C[Next.js 빌드]
  C --> D[out: 경로별 HTML·CSS·JS·이미지]
  D --> E[HTML·URL·브라우저 검사]
  E --> F[GitHub Pages artifact]
  F --> G[실제 URL 검증·검색 및 인용 관측]
```

본문 컴포넌트는 빌드 시 실행되는 Server Component를 기본으로 한다. 여기서 ‘Server’는 CI의 빌드 과정이며 GitHub Pages에 Node 서버가 생기는 것이 아니다. Client Component는 모바일 메뉴·검색·주소 복사 등 상호작용에만 사용한다. 병원명·진료시간·의료진·본문·근거 링크는 JavaScript를 끈 상태에서도 읽혀야 한다.

기본 설정의 **참고 예시**는 다음과 같다. 실제 구현에서는 환경 변수 검증과 URL 함수를 추가한다.

```ts
// web/next.config.ts — 구현 시 생성할 설정 예시
import type { NextConfig } from 'next';

const basePath = process.env.SITE_BASE_PATH ?? '';
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};
export default config;
```

`next build`로 `web/out/`을 만든다. slug 페이지는 게시 가능한 항목을 `generateStaticParams()`로 열거하고 `dynamicParams = false`로 둔다. 데이터 로딩은 저장소의 검수된 파일을 읽으며, 빌드마다 외부 Q&A를 다시 가져오지 않는다. 기본 이미지 최적화 서버·Server Actions·ISR·요청 시 쿠키 접근·Proxy·서버 rewrite/redirect는 이 배포에서 사용하지 않는다. [Next.js 정적 내보내기](https://nextjs.org/docs/app/guides/static-exports).

Markdown은 빌드 시 파싱하고 raw HTML과 임의 실행 코드를 허용하지 않는다. 초기에는 MDX의 자유로운 JavaScript 실행을 도입하지 않는다. 임베드·표·알림 상자 등 필요한 표현은 허용한 콘텐츠 블록으로 구현한다. JSON-LD를 script에 삽입할 때 `<`를 `\u003c`로 이스케이프하며 문자열을 HTML로 직접 연결하지 않는다.

## 5. 페이지 구성과 초기 공개 순서

전역 탐색은 **병원 소개 / 의료진 / 진료·검사 / 건강검진 / 이용 안내**를 중심으로 구성한다. 건강정보·공지·정책은 관련 화면과 보조 탐색에서 접근할 수 있게 한다. 모바일에서 긴 다단 메뉴를 중첩하지 않는다.

| 경로 | 템플릿·내용 | 단계 |
|---|---|---|
| `/` | 병원 정체성, 핵심 진료, 의료진, 방문 안내, 유효한 공지 | P0 |
| `/about/` | 병원 소개, 확인된 특징·시설 | P0 |
| `/doctors/` | 현재 의료진 목록 | P0 |
| `/doctors/[slug]/` | 개인 자격·경력·담당 분야·검수 글 | P0 |
| `/visit/` | 시간·휴게·접수·휴진·전화·주소·교통·주차 | P0 |
| `/services/` | 진료·검사 안내 허브 | P0 |
| `/services/heart/` | 심장검사 허브 | P0 |
| `/services/heart/echocardiography/` | 심장초음파 | P0 |
| `/services/heart/holter/` | 홀터검사 | P0 |
| `/checkups/` | 목적별 검진 허브 | P0 |
| `/checkups/national/` | 국가검진 및 준비 안내 | P0 |
| `/notices/`·`/notices/[slug]/` | 유효기간을 가진 운영 공지 | P0 |
| `/privacy/` | 실제 서비스·분석 설정에 맞는 개인정보 안내 | P0 |
| `/content-policy/` | 의료정보 작성·검수·정정 방법 | P0 |
| `/404.html` | 찾을 수 없는 주소 안내, 홈·방문 링크 | P0 |
| 나머지 심장검사·검진·초음파·내과 안내 | 기존 19개 서비스의 검수된 설명 | P1 |
| `/services/endoscopy/` | 위·대장내시경 허브와 확정된 준비 안내 | P1 |
| `/fees/` | 확인된 비용·항목·조건·적용일 | P1 |
| `/health/`·`/health/[slug]/` | 검수된 건강정보 및 질문 설명 | P1 |
| `/cases/`·`/cases/[slug]/` | 재사용 범위·의료 검수 완료한 사례 | P2 |
| `/search/` | 공개 콘텐츠만 대상으로 하는 정적 검색 | P2 |

P0는 템플릿 구현 우선순위다. **미승인 원고를 채워 공개하라는 의미가 아니다.** 검수되지 않은 선택 페이지는 탐색·사이트맵·검색 인덱스·출력 경로에서 제외한다. 병원 기본정보·방문 안내처럼 공개에 필요한 필수 내용이 미확정이면 release 빌드를 실패시킨다. 목표 페이지 수를 맞추기 위해 빈 페이지를 게시하지 않는다.

세부 서비스 경로는 [페이지·기존 URL 대응표](route-map.csv)를 따른다. 기존 145개 URL 전체의 상세 이전 결정은 이 대응표를 확장해 관리한다. 이 파일은 모든 게시물·별칭의 리디렉션 완료표가 아니다.

## 6. 화면 및 인터랙션 명세

### 공통 구조와 디자인 기준

화면은 밝은 배경, 짙은 남색 본문, 청록 계열 강조색, 넉넉한 간격과 읽기 쉬운 한국어 문장으로 시작한다. 색·로고·사진의 최종 사용은 실제 브랜드 자산 확인 후 조정한다. 최신 디자인 관행 중 유연한 타이포그래피·반응형 그리드·절제된 움직임을 적용한다. 실제 병원·의료진 사진을 우선하며 생성 이미지로 의료진이나 시설을 꾸며내지 않는다.

| 항목 | 기준 |
|---|---|
| 레이아웃 | 콘텐츠 최대 폭 1,200px, 본문 읽기 영역 약 42rem, 모바일 좌우 여백 20px |
| 타이포그래피 | 본문 기본 17~18px·줄높이 약 1.7, 제목 `clamp()` 사용. 긴 한국어 제목 줄바꿈 확인 |
| 색 토큰 초안 | 배경 `#F8FAFC`, 본문 `#142B3A`, 강조 `#0F766E`, 경계 `#D7E2E8`; 실제 조합 대비 검사 |
| 클릭 영역 | 프로젝트 기본 목표 44×44 CSS px 이상. 버튼 간 충분한 간격 |
| 반응형 검토 폭 | 360·390·768·1280·1440px, 320px 본문 재배치 확인 |
| 움직임 | 작은 상태 변화 중심, `prefers-reduced-motion` 존중, 자동 재생 캐러셀·배경 영상 없음 |
| 이미지 | 실사 이미지의 사용 범위와 출처를 원장으로 관리. 핵심 사실은 HTML로 중복 제공 |

헤더는 로고·주요 탐색·전화 링크를 제공한다. 모바일 메뉴 버튼은 상태 이름·`aria-expanded`를 갖고 키보드로 사용할 수 있어야 한다. Dialog형 메뉴를 쓰면 포커스 이동·닫기·복귀를 구현한다. CSS와 네이티브 요소만으로 가능한 부분은 추가 JS 없이 작동시킨다.

모바일 하단에는 전화·오시는 길을 배치한다. 화면 키보드·브라우저 안전 영역과 본문 마지막 부분을 가리지 않도록 공간을 확보한다. 응급 안내 문맥에서는 의료진이 확정한 긴급 행동을 먼저 배치하며 전화 예약을 우선 행동으로 강제하지 않는다.

### 템플릿별 필수 블록

| 템플릿 | 내용 순서와 동작 |
|---|---|
| 홈 | 병원명·지역·진료 범위 → 주요 행동 → 대표 진료 → 의료진 → 방문 요약 → 공지. 장문의 건강 글 전체를 홈에 반복하지 않음 |
| 진료·검사 상세 | H1 → 목적·대상의 짧은 설명 → 적용 범위·한계 → 준비 → 과정·결과 안내 → 질문 답변 → 근거·검수 → 문의 |
| 의료진 | 실제 이름·사진 → 전문과목·자격 → 경력·학회 소속 구분 → 담당 분야 → 집필·검수한 페이지 연결 |
| 방문 | 주소·전화 → 정규 시간·점심·접수 → 날짜별 휴진 → 대중교통·주차 → 지도 링크. 지도 로딩 없이 핵심 정보 확인 가능 |
| 건강 글 | 질문·핵심 설명 → 적용 조건·위험 신호 → 자세한 설명 → 근거·한계 → 실제 저자·검수일 → 관련 검사 |
| 공지 | 게시일·적용 시작/종료·종료 상태 → 내용 → 관련 방문 안내. 과거 가격·휴진이 현재 안내처럼 표시되지 않음 |

질문 답변은 서버에서 모든 본문을 출력한다. 접힘 UI는 `<details><summary>`를 우선 검토하며, 펼치기 전에는 본문을 요청하지 않는 방식은 사용하지 않는다. 중요한 준비·위험 안내는 기본 펼침 또는 독립 본문으로 제공한다.

‘오늘 진료 중’ 표시는 초기 범위에서 제외한다. 정규 진료시간만으로 임시 휴진·의료진 일정·접수 상태를 확정할 수 없기 때문이다. 날짜 예외가 완전히 관리될 때만 서울 시간 기준 계산과 테스트를 추가한다.

## 7. 콘텐츠 데이터 계약 v2 설계

원본 수집 자료, 편집 원고, 공개 콘텐츠를 분리한다. Next.js가 읽는 것은 승인된 공개 데이터 묶음이다. 아래는 **새로 구현할 계약**이며 기존 Python 하네스가 이미 지원하는 필드라고 해석하지 않는다.

| 객체 | 필수 필드·규칙 |
|---|---|
| `site` | `origin`, `basePath`, `environment`, `indexingEnabled`, `locale: ko-KR`, `timezone: Asia/Seoul`; origin에는 경로 금지 |
| `hospital` | 안정적 ID, 이름, 주소 구조, 전화, 좌표(확인된 경우), 공식 링크, 운영 확인일·출처 |
| `hours` | 요일별 여러 시간 구간, 별도 접수 마감, 날짜별 예외·사유·유효기간. 모르는 시간을 임의의 닫힘으로 해석하지 않음 |
| `physicians` | ID·slug·이름·전문과목·자격·경력·소속·사진 자산 ID·현재 상태·적용일·근거 |
| `services` | ID·slug·제목·허브·제공 범위·대상·준비·한계·결과 안내·예약 조건·의료진 ID·원고 ID |
| `articles` | ID·slug·유형·질문·설명·본문 블록·위험도·`authorId`·`reviewerIds`·`sourceIds`·게시/수정/검토일·상태 |
| `claims` | 주장 ID·본문 연결·출처 ID·대상·시점·검사/치료·측정 지표·한계. 기존 하네스의 scope 의미를 유지 |
| `sources` | ID·제목·기관/저자·URL·자료 유형·확인일·의학 검토일(확인 시)·이용 조건 |
| `questionDemand` | 주제 ID·출처 종류·기간·독립 질문 수·분모·빈도 판정·중복 규칙·관측 근거. 미측정은 `null` |
| `fees` | 항목·가격 종류·금액/범위·총액 여부·포함/제외·적용 기간·확인자. 항목 정보 부족 시 공개 제외 |
| `notices` | slug·게시일·적용 기간·상태·관련 서비스·본문. 자동 유효기간 계산의 기준 시각 기록 |
| `assets` | 파일·크기·포맷·치수·alt·캡션·출처·사용 권한·사용 페이지 |
| `reviews` | 실제 검수자·역할·대상 ID·판정·검수일·만료일·내용 해시·근거 확인·승인 기록 위치 |
| `routes` | 페이지 ID·경로·출력 파일·제목·대표 URL·sitemap 포함 여부·이전 URL |

콘텐츠 상태는 `draft → in_review → approved → published → archived`로 관리한다. `approved`는 현재 내용 해시와 유효한 검수 기록이 일치해야 한다. 의료 검수·운영 확인·콘텐츠 사용 권리는 서로 다른 기록으로 남긴다. 자동화 도구가 실제 검수자 이름이나 승인을 만들어 넣지 않는다.

화면·메타·JSON-LD·지도 링크에서 병원 사실은 동일 객체를 참조한다. 원고 속 시간·전화·담당 의료진을 자유 텍스트로 중복 입력하지 않도록 토큰 또는 구조화 블록을 사용한다. 공개 데이터에는 문의자의 이름·증상 기록·개인 검사값이 들어가지 않는다.

### 날짜와 만료 처리

게시일·본문 수정일·의학 검토일·운영 정보 확인일을 분리한다. 재빌드 날짜를 의료 검토일이나 sitemap의 모든 `lastmod`로 사용하지 않는다. 공지·이벤트·검수 만료는 빌드 시 평가하고 일일 재빌드를 보조적으로 사용한다. 예약된 Actions 실행은 지연될 수 있으므로 중요한 휴진 변경은 즉시 수정·배포하는 운영 절차가 필요하다.

만료된 배포가 남아 있을 가능성에 대비해 화면에도 적용 기간을 명시한다. 클라이언트가 만료 표시를 바꿀 수 있지만 그것만으로 원본 HTML의 오래된 내용을 갱신했다고 보지 않는다.

## 8. SEO·AEO·GEO 명세

| ID | 필수 구현 |
|---|---|
| DISC-01 | 모든 공개 페이지의 URL 직접 접근이 200이며 원본 HTML에 H1·본문·주요 링크가 있음 |
| DISC-02 | 페이지 의도에 맞는 고유 title·description·절대 canonical·공유 메타, `lang="ko"` |
| DISC-03 | 공개 경로의 sitemap·내부 링크·canonical이 같은 origin/base 정책을 따름 |
| DISC-04 | 이미지 alt·치수, 실제 보이는 제목 체계, breadcrumb, 고립된 공개 글 없음 |
| ANSWER-01 | 질문에 대한 설명·대상·예외·다음 행동을 함께 제공. 키워드 반복량·고정 답변 길이 규칙 없음 |
| TRUST-01 | 실제 저자·검토자·자격 출처·검토일·주장별 근거·정정 경로 제공 |
| ENTITY-01 | 병원과 의료진의 ID·이름·주소·전화·담당 분야가 페이지마다 일치 |
| SCHEMA-01 | 공개 화면에 근거가 있는 `MedicalClinic`, `Person`, `WebSite`, `BreadcrumbList`, 적합한 의료 글의 `MedicalWebPage` 사용 |
| MEASURE-01 | 색인·브랜드 질문·비브랜드 질문·AI 인용 링크·사실 정확도·방문 행동을 구분해 관측 |

병원은 `MedicalClinic`, 개인 의료진은 `Person`으로 표현한다. `Physician`을 단순히 사람의 전문의 자격 표시용으로 붙이지 않는다. 병원 `@id`는 최종 대표 사이트 URL의 `#clinic`, 인물은 해당 프로필 URL의 `#person` 등으로 고정한다. 리뷰·평점·가격·장비·지정기관 지위를 추정해서 schema에 넣지 않는다. [MedicalClinic](https://schema.org/MedicalClinic), [MedicalWebPage](https://schema.org/MedicalWebPage).

Google의 공식 안내에 따라 고유하고 유용한 정보·기본 검색 접근성·실제 사업자 정보 정합성을 우선한다. AI용 특별 문체·llms.txt·특수 schema는 필수 요건으로 삼지 않는다. 봇에만 다른 의료 내용을 주거나 외부 Q&A를 바꿔 적은 대량 페이지를 만들지 않는다. [Google 생성형 검색 안내](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

**FAQ 리치 결과는 Google에서 2026-05-07부터 표시 중단되었다.** FAQ는 환자 이해를 위한 화면 요소로 사용하며 FAQ schema 개수나 리치 결과를 개발 KPI로 두지 않는다. 실제 사용자가 여러 답변을 제출하는 서비스가 아닌 병원 안내 페이지를 `QAPage`로 꾸미지 않는다. [Google 변경 기록](https://developers.google.com/search/updates#may-2026).

정적 JSON-LD 검증과 실제 검색 노출은 별개다. 최종 도메인 확인 후 Search Console·네이버 서치어드바이저 등록 및 sitemap 제출을 운영 체크리스트에 넣는다. 계정별 제공 기능을 확인하며 검색량·실제 예약·AI 인용률은 미측정 상태에서 0 또는 성공으로 기록하지 않는다.

## 9. origin·basePath·미리보기 정책

| 환경 | 예시 설정 | 색인·배포 정책 |
|---|---|---|
| 로컬 검토 | origin=`http://localhost:3000`, basePath=빈 값 | noindex, 외부 제출 없음 |
| Pages 프로젝트 검토 | origin=`https://OWNER.github.io`, basePath=`/yt-top-webforai` | 기본 noindex. OWNER는 실제 값으로 교체할 자리표시자 |
| 최종 운영 | 확인된 HTTPS origin, 통상 basePath=빈 값 | 운영 승인된 페이지만 index, 단일 대표 도메인 |

내부 URL 규칙은 다음과 같다.

- `next/link`에는 `/visit/`처럼 basePath 없는 앱 경로를 준다. Next.js가 basePath를 적용하므로 수동으로 다시 붙이지 않는다.
- `<img>`, 다운로드, 일반 `<a>`로 연결하는 정적 파일은 공통 `assetUrl()`·`sitePath()`가 basePath를 한 번만 붙인다.
- canonical·OG URL·sitemap·JSON-LD의 절대 URL은 한 개의 `absoluteUrl()` 함수에서 생성한다. 선행 `/` 처리로 프로젝트 경로가 사라지는 `new URL()` 사용 실수를 검사한다.
- 같은 콘텐츠라도 도메인 또는 basePath를 바꾸면 다시 빌드한다. `assetPrefix`를 basePath 문제의 일괄 해결책으로 쓰지 않는다.

Next.js의 링크 자동 접두어 동작은 [basePath 공식 문서](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)를 따른다. 루트 배포와 `/yt-top-webforai` 배포를 모두 CI에서 검증한다.

미리보기는 **페이지의 `noindex`가 실제 HTML에 있어야 한다.** robots 차단만으로 색인 제외가 보장되지 않으며, noindex를 읽어야 하는 공개 미리보기를 동시에 robots로 막는 정책은 채택하지 않는다. 비공개 자료는 noindex와 무관하게 공개 산출물에 넣지 않는다. Pages는 일반적인 PR별 비공개 미리보기 호스팅으로 가정하지 않고, 초기 PR 검토는 로컬 또는 다운로드 가능한 테스트 artifact를 사용한다.

프로젝트 경로의 `/yt-top-webforai/robots.txt`는 origin 루트 `/robots.txt`를 대신하지 못한다. 소유자 루트 사이트의 robots를 확인하고, 프로젝트 사이트맵은 실제 하위 URL로 제출한다. 운영 커스텀 도메인에서는 루트 robots를 생성한다. [Google noindex 안내](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [robots 위치 규칙](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec).

기존 사이트를 교체할 경우 구 번호 URL·게시판 쿼리 URL의 301/308 이전은 기존 서버 또는 이를 지원하는 호스팅에서 수행해야 한다. Pages의 `404.html`이나 클라이언트 라우팅을 실제 HTTP 리디렉션으로 취급하지 않는다. 기존 사이트와 신규 사이트를 동시에 같은 내용으로 색인시키는 운영은 기본값으로 두지 않는다. 커스텀 도메인 설정은 [GitHub 공식 안내](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)를 따른다.

## 10. 이미지·폰트·성능

이미지는 빌드 전 처리해 AVIF/WebP와 필요한 폴백을 생성한다. `picture/srcset/sizes` 또는 사전 생성 이미지용 래퍼를 사용한다. `images.unoptimized`는 파일을 가볍게 만들어 주는 옵션이 아니므로 원본 대용량 이미지를 그대로 배포하지 않는다. LCP 후보 이미지는 지연 로딩하지 않고, 화면 아래 이미지는 지연 로딩하며 모든 이미지에 치수를 제공한다.

한국어 폰트는 이용 허락을 확인한 파일을 로컬 제공하고 WOFF2·서브셋·`font-display: swap`을 검토한다. 빌드 시 외부 폰트 서비스에 연결해야만 배포되는 구조를 피한다. 지도는 주소와 외부 링크를 먼저 제공하며, 무거운 지도 SDK는 초기 화면의 필수 로딩에 넣지 않는다.

| 항목 | 목표·측정 방식 |
|---|---|
| 실제 사용자 Core Web Vitals | 기기군별 75백분위 LCP ≤2.5초, INP ≤200ms, CLS ≤0.1 |
| 출시 전 Lighthouse | 고정한 모바일 설정에서 대표 페이지 3회 중앙값: Performance ≥90, Accessibility ≥95, SEO ≥95 |
| 초기 JS | 대표 페이지의 초기 필수 전송량 gzip 250KB 이하를 프로젝트 예산으로 설정 |
| CSS·폰트 | 초기 CSS gzip 80KB 이하, 최초 화면 폰트 전송 합계 300KB 이하 목표 |
| 최초 로딩 | 기본 뷰포트 초기 네트워크 요청 합계 1.5MB 이하 목표; 스크롤·지도 클릭 이후 별도 측정 |
| 이미지 | hero 모바일 변형 200KB 이하 목표, 불가피한 경우 실제 LCP로 검토 |

용량과 Lighthouse 점수는 **프로젝트 품질 예산**이며 검색 순위 공식이 아니다. 목표 미달이면 원인·워터폴·개선 결과를 남기며 임계값을 통과하려고 필수 본문을 숨기지 않는다. INP는 일반적인 Lighthouse 탐색 점수만으로 통과 판정을 내리지 않는다. 트래픽 부족으로 실사용 데이터가 없으면 미측정으로 둔다. [Web Vitals 공식 기준](https://web.dev/articles/vitals).

## 11. 접근성·브라우저·보안 기본값

WCAG 2.2 AA를 목표로 대비·키보드·포커스·화면 확대·레이블·대체 텍스트를 검토한다. 본문 대비 4.5:1, 큰 글자 3:1을 확인하고 색만으로 의미를 전달하지 않는다. 자동 axe 검사에 더해 키보드와 VoiceOver 또는 NVDA로 메뉴·본문·질문 답변·전화 링크를 확인한다. 검사 도구 점수만으로 접근성 인증을 주장하지 않는다. [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

지원 검증은 Chrome·Edge·Firefox·Safari의 최근 주요 버전, iOS Safari, Android Chrome·Samsung Internet을 대상으로 한다. 실제 최소 CSS 지원은 Tailwind 4의 기준인 Chrome 111·Safari 16.4·Firefox 128 이상을 따른다. 한국어 긴 문장·주소·표, 200% 확대, 가로/세로 전환을 점검한다. [Tailwind 호환성](https://tailwindcss.com/docs/compatibility).

외부 링크는 승인된 HTTPS·전화·지도 스킴만 허용한다. API 비밀키·개인정보·내부 승인 메모는 JS·HTML·JSON·소스맵·정적 검색 색인에 포함하지 않는다. 원격 HTML을 `dangerouslySetInnerHTML`로 그대로 렌더링하지 않는다. Pages에서 임의 HTTP 보안 헤더를 Next.js 설정만으로 적용했다고 주장하지 않는다. 헤더 요구가 추가되면 실제 호스팅 기능과 함께 검토한다.

분석 도구는 초기 비활성 상태로 설정할 수 있어야 한다. 도입 시 `phone_click`, `map_open`, `service_view` 정도의 제한된 이벤트를 사용하고, 자유 입력 검색어·환자 사연·전화번호 등은 분석 시스템에 보내지 않는다. 전화 클릭은 통화 완료나 예약 완료와 구분한다.

## 12. 저장소 구조와 하네스 연결

```text
yt-top-webforai/
├─ docs/                         # 개발 스펙·경로표·완료 기준
├─ research/                     # 기존 조사; 웹 번들 입력 금지
├─ harness/                      # 기존 Python 계약·근거·측정 검증
├─ content/                      # 새 편집·공개 콘텐츠 원장
│  ├─ hospital.json
│  ├─ physicians.json
│  ├─ services.json
│  ├─ sources.json
│  ├─ reviews.json
│  ├─ notices/
│  └─ articles/
├─ web/                          # 새 React 애플리케이션
│  ├─ src/app/                   # 경로·레이아웃·메타
│  ├─ src/components/            # 공통 UI·페이지 블록
│  ├─ src/lib/                   # URL·콘텐츠·schema·시간 함수
│  ├─ src/generated/             # 빌드가 만든 공개 데이터, 직접 편집 금지
│  ├─ public/assets/             # 승인된 이미지·폰트
│  ├─ scripts/                   # 검증·정적 메타 생성·artifact 검사
│  ├─ tests/                     # 계약·브라우저·접근성
│  └─ out/                       # 배포 산출물, 소스와 분리
└─ .github/workflows/            # PR 검증·공개 빌드·배포
```

위에서 `web/`, `content/`, workflow 등은 앞으로 만들 구조다. 이번 문서 작업이 이 애플리케이션을 생성한 것은 아니다. 비공개 검수 증빙은 저장소 공개 범위에 맞게 외부 승인 기록 ID로 참조한다. `out/`에서 제외하는 것만으로 공개 저장소의 원본 파일이 비공개가 되는 것은 아니므로 저장소 공개 전 연구 자료의 공개 범위도 별도로 확인한다.

### 기존 하네스와의 책임 분리

기존 Python의 `validate/digest/measure` 규칙을 재사용하고, 최종 HTML 생성은 Next.js가 맡는다. v1의 `build`는 참조 템플릿으로 보존한다. 새 계약 v2는 v1로 억지 변환하면서 예외 시간·서비스·권리 정보를 버리지 않는다.

구현 순서는 v2 TypeScript 스키마와 교차 참조 검사 → 기존 승인·근거 규칙의 매핑 → v1로 표현 가능한 부분의 어댑터 → v2 추가 검증으로 한다. 기존의 프로젝트 전체 내용 해시 정책은 초기에도 유지한다. 성능상 필요가 확인될 때만 의존 관계별 해시로 확장한다.

별도 `harness-check` 명령에서 Python 검사와 v2 검사를 모두 실행하고 하나라도 실패하면 release를 막는다. 기존 `audit` 명령은 과거 스냅샷 형식용이므로 Next.js 산출물 검사와 혼동하지 않는다. 새 HTML 감사기는 원본 HTML·생성된 route manifest·실제 정적 서버 응답을 대조해야 한다. [현재 자동화 범위](../harness/coverage.md).

## 13. CI/CD와 배포 절차

애플리케이션 구현 시 다음 npm 명령 계약을 제공한다. **현재 존재하는 실행 명령이 아니라 구현 요구사항**이다.

| 명령 | 동작 |
|---|---|
| `npm run dev` | 로컬 편집 서버 |
| `npm run typecheck`·`lint` | 타입·정적 코드 검사; `next build`가 lint까지 수행한다고 가정하지 않음 |
| `npm run content:validate` | 계약·참조·출처·권리·현재 검수·만료 검사 |
| `npm run harness-check` | 기존 Python 및 v2 추가 검사 통합 |
| `npm run test` | URL·시간·승인·중복 처리의 의미 있는 단위 테스트 |
| `npm run build:preview` | noindex 미리보기, release와 분리된 출력·환경 |
| `npm run build:release` | 승인 데이터만으로 정적 생성 및 메타·manifest 생성 |
| `npm run audit:static` | HTML·경로·schema·배포 파일 누출 검사 |
| `npm run test:e2e` | `out/`을 실제 정적 서버로 제공하여 직접 접근·새로고침·모바일 검사 |
| `npm run test:performance` | 고정 조건의 대표 페이지 Lighthouse 기록 |

배포 흐름은 다음을 따른다.

1. PR: `npm ci` → 타입·lint → 콘텐츠·하네스 검증 → 단위 테스트 → 미리보기 빌드 → 정적·브라우저 검사. 공개 환경 권한은 주지 않는다.
2. 검수된 main 또는 명시적 운영 실행: 동일 검사 → release 빌드 → `out/` 검사 → 업로드 → 배포. 배포 job은 성공한 build job에 의존한다.
3. GitHub Pages의 Source를 GitHub Actions로 설정한다. build에는 `contents: read`, deploy에는 필요한 `pages: write`, `id-token: write`만 부여한다.
4. `configure-pages` → `upload-pages-artifact` → `deploy-pages` 공식 흐름을 사용한다. 현재 문서 예시는 각각 v5·v4·v4이며, 실제 workflow 작성 시 확인한 릴리스를 고정한다. 업로드 경로는 **`web/out`만** 지정한다.
5. `github-pages` environment와 저장소의 기존 보호 규칙을 사용한다. 같은 환경의 배포는 직렬화하고, 오래된 빌드가 새 버전을 덮지 않게 한다. 정적 artifact에 필요 시 `.nojekyll`을 포함한다.
6. 커스텀 도메인은 Pages 설정·DNS·HTTPS를 함께 확인한다. Actions 배포에서는 저장소의 CNAME 파일만 넣으면 도메인 설정이 끝난다고 보지 않는다.
7. 배포 직후 대표 경로·하위 경로·404·폰트·이미지·canonical·robots·sitemap·전화·지도 링크를 실제 URL로 검증한다.

Pages용 workflow와 권한은 [GitHub 공식 배포 문서](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)를 따른다. 배포 artifact에는 데이터 승인 해시·Git SHA·환경·빌드 시각·route manifest 해시를 포함한 공개 가능한 manifest만 남긴다. 원고의 내부 검수 메모는 포함하지 않는다.

실패한 빌드는 기존 배포를 유지한다. 롤백은 이전에 검증한 artifact 또는 Git SHA로 수행하되 **현재 시점에 만료된 의료 검수·가격·휴진 정보가 없는지 다시 검사**한다. 코드가 과거에 통과했다는 이유만으로 과거 콘텐츠를 무조건 재게시하지 않는다.

## 14. 수용 기준과 테스트 범위

세부 체크리스트는 [개발 완료 기준 CSV](acceptance-criteria.csv)에 있다. 모든 P0 필수 항목과 공개하는 P1/P2 페이지에 적용되는 항목을 통과해야 공개 준비 완료로 판정한다.

| 분야 | 핵심 검증 |
|---|---|
| 정적 생성 | 공개 manifest의 모든 경로에 HTML 존재, JS를 꺼도 본문·병원 사실 확인 |
| 경로 | 루트와 프로젝트 basePath 두 환경, 직접 접속·새로고침·내부 이동·미등록 경로의 실제 404 |
| 데이터 | 미승인·만료·권리 미확인 항목 공개 차단, 의사 ID·주장-근거 참조 일치 |
| 의료 내용 | 의료진이 원문·주장·적용 범위·응급 행동 대조. 자동 검사만으로 승인 불가 |
| URL 정책 | canonical·sitemap·OG·schema·assets의 prefix 누락/중복 없음, 미리보기 noindex |
| 화면 | 대표 기기·키보드·확대·접힘 내용·전화·지도·공지 기간 표시 |
| 성능 | 대표 페이지별 결과·워터폴·예산 기록. 실제 사용자 지표는 수집 가능 후 별도 판정 |
| 배포 | 연구 자료·환자 정보·비밀키 유출 없음, 실제 호스팅 응답 점검, 재배포·롤백 절차 확인 |

의미 있는 단위 테스트는 basePath 중복/누락, 날짜 경계·토요일·휴진, 승인 해시 무효화, 만료된 가격 제외, slug 중복, 원고 출처 누락을 우선한다. 모든 문장·색상값을 그대로 복제한 테스트는 작성하지 않는다. 화면 테스트는 홈·방문·의료진·검사·건강 글·404의 대표 템플릿으로 시작하고 실제 장애 위험이 있는 변형만 확장한다.

AI 성과 검증에는 [기존 측정 지침](../harness/measurement.md)을 연결한다. 고정 질문의 엔진·날짜·응답·인용 URL·사실 정확도·분모를 기록하고, 사이트 변경과 동시에 발생한 다른 요인을 남긴다. 검색 결과 한 번이나 모델의 자기 설명을 인용 효과의 증명으로 사용하지 않는다.

## 15. 구현 작업 순서와 완료 산출물

| 작업 | 구체적인 산출물 | 다음 단계로 넘어가는 조건 |
|---|---|---|
| A. 기반 | `web/`·정적 설정·도구 버전·루트/하위 경로 테스트 | 두 환경에서 HTML 직접 접근 성공 |
| B. 데이터 | v2 계약·원장 이관 초안·승인 검사·URL 원장 | 미확인 사실의 공개 차단 확인 |
| C. 디자인 | 토큰·공통 헤더/푸터·홈/방문/검사 상세 시안 | 모바일·한국어·키보드 검토 |
| D. P0 페이지 | 핵심 템플릿·메타·schema·전화/지도·공지 | 원본 HTML·의료/운영 검수·접근성 통과 |
| E. P1 확장 | 승인된 나머지 서비스·내시경·비용·건강 글 | 중복·준비 안내·가격·권리 검증 |
| F. 배포 준비 | workflow·artifact 검사·도메인/이전 설정표·롤백 | 운영 호스팅 적합성·환경·출처·콘텐츠 검수 완료 |
| G. 운영 검증 | 실제 URL 기록·색인 확인·질문 관측 기준선 | 실패 사항 수정, 미측정 지표 구분 |

개발자에게 전달할 최종 묶음은 소스·lockfile·승인 데이터·빌드/배포 설명·경로 대응표·검증 보고서·실제 화면·콘텐츠 수정 절차다. 이 문서의 설계 결정을 바꾸면 이유와 영향을 기록하며, 코드 구현 없이 명세만 수정한 사항은 구현 완료로 표시하지 않는다.
