# yt-top-webforai

기존 `yttop.co.kr`과 함께 운영할 **환자용 영통탑내과 병원 홈페이지**의 React 정적 사이트 구현 저장소입니다. 병원 소개·진료·검사·방문 안내를 환자와 AI 모델이 이해하기 쉽게 구성하며, 조사·개발 보고서는 사이트에 게시하지 않습니다.

- **[2026-09-26 심장·혈관 20편 및 홈페이지 업데이트](docs/director-content-review-2026-09-26/implementation.ko.md)** — 영문 URL로 총 94개 경로 구현. 검사 정보·공통 안내·백과 분류 개선, 로컬 검토본이며 미배포.
- **[2026-09-25 세션 작업 요약·배포 결과](docs/patient-navigation-2026-09-25/session-summary.ko.md)** — 74개 경로 배포와 실제 사이트 검증 완료. 메뉴·목차 개편, 출처·오타 교정 및 후속 확인 사항.
- **[2026-09-25 환자 목적별 메뉴·화면 개편](docs/patient-navigation-2026-09-25/README.ko.md)** — 7개 메뉴, 4개 진입로, 좌측 목차와 두 백과 탐색. 별도 220편 원고 연결은 원고 위치 확인 후 진행합니다.
- **[2026-09-25 원장님 원고 기반 개편](docs/director-content-review-2026-09-25/implementation.ko.md)** — 당시 개발 범위 71개 경로, 한국어 안내 21개·번역 5개 추가. 새 편집본은 검토용이며 기존 공개 승인과 분리합니다.

- **[검색 공개 전환·구조화 데이터 확장](docs/production-release-2026-09-11/README.ko.md)** — 사용자 확인에 따른 production 공개, 43개 색인 대상, 82개 질문·답변과 의료진·검사·서비스 연결
- **[실제 배포 사이트 3곳 비교](docs/seo-aeo-geo-comparison-2026-09-11/README.ko.md)** — 공개 전환 전의 HTTP·모바일 성능·콘텐츠 비교 근거

- **[AEO·GEO 개선 실행 계획](docs/aeo-geo-improvement-plan-2026-09-11/README.md)** — 기존 Q&A 조사 후보 13개 활용, 현재 45개 경로 개선, 병원 확인·구현·배포·레퍼런스 비교 기준
- **[AEO·GEO 개선 반영·전후 비교](docs/aeo-geo-improvement-results-2026-09-11/README.md)** — 의료 상세 25개 보강, 조사 질문 13개 반영, 근거·공통 사실·검증 및 남은 공개 조건
- **[최종 SEO·AEO·GEO 비교 검토](docs/seo-aeo-geo-review-2026-09-11/README.md)** — 기존 3개 사례와 기술·답변·근거·공개 상태 비교, 남은 개선 우선순위

- **[환자용 콘텐츠 전수 정리](docs/content-audit-2026-09-11/README.md)** — 기존 76개 경로 검토, 현재 45개 경로, 사례 원문 25개 연결, 기존 공지 채널 유지
- **[공개 콘텐츠 기준](docs/patient-content-policy.ko.md)** — 병원 홈페이지 목적, 병행 운영, 내부 문구·보고서 배포 차단

- **[이전 UI 검토·수정 이력](docs/ui-fixes-2026-09-11.ko.md)** — 당시 76페이지의 반응형·메뉴·키보드·검색·인쇄 검증

- **[초기 개발·검증 이력](docs/development-completion.ko.md)** — 최초 76페이지 구현과 당시 CI·Pages 상태
- **[개발·운영 인수 문서](docs/development-handoff.ko.md)** — 실행, 원고 수정, 실제 검수, 자동 배포, AI 인용 관측
- **[웹 앱 실행](web/README.md)** — Next.js 16.3.4 · React 19.3.0 · TypeScript · Tailwind CSS 4.3.3
- [콘텐츠 원장](content/README.md) — 74개 개발 경로, 의료진 2명, 진단 사례 원문 링크 25개
- [자동 검사·배포 워크플로](.github/workflows/pages.yml)

배포 주소: `https://codepump-net.github.io/yt-top-webforai/`. 2026-09-25 사용자의 커밋·푸시·배포 요청에 따라 메뉴·화면과 출처 검토 내용을 배포하고 실제 74개 경로를 검증했습니다. 저장소 변수 `PUBLICATION_MODE=review`를 유지하여 방문은 가능하지만 모든 페이지는 검토 기간에 noindex이며 공개 사이트맵은 비어 있습니다. 기존 승인 digest와 의료 검토 기록은 갱신하지 않았습니다. 의료·운영 확인 후 현재 편집본에 대한 실제 승인 근거를 기록하고 production으로 전환합니다. [이번 세션 요약·배포 결과](docs/patient-navigation-2026-09-25/session-summary.ko.md)와 [앞선 71개 경로 배포 기록](docs/director-content-review-2026-09-25/deployment.ko.md)을 참고하세요. 원장님 원본 자료는 로컬 `plan/`에, 원본 크롤링·OCR·환자 관련 이미지는 로컬 `research/`에 보관하므로 해당 조사 자료는 공유 작업 공간에서 확인할 수 있습니다.

## 개발 스펙

아래 76개 페이지·이관 계획은 사전 설계 이력입니다. 현재 공개 범위와 병행 운영 방식은 위의 콘텐츠 정리 보고서와 개발·운영 인수 문서를 우선합니다.

- **[전체 사이트 상세 개발·자동 배포 계획 v1.1](docs/implementation-plan/README.md)** — 76개 페이지·전체 사이트맵·145개 URL 이관·기존 이미지·Actions 배포

- **[React 기반 정적 홈페이지 개발 스펙](docs/website-spec.ko.md)** — Next.js·TypeScript·Tailwind·GitHub Pages·콘텐츠 계약·검증·배포
- [페이지 경로 대응표](docs/route-map.csv) / [개발 완료 기준](docs/acceptance-criteria.csv)

## 조사 자료

- [국내 의료 Q&A 수집·공신력·질문 빈도 레퍼런스](research/2026-09-11-korean-medical-qa/README.md) — 실제 출처 18개, 후보·제외 사유, 이용 조건과 검증 기준

- [영통탑내과 실제 사이트 크롤링·정보 원장·기초 평가](research/2026-09-11-yttop/README.md) — 145개 공개 URL, 진료·의료진·증례·공지·이미지/OCR 자료

- [병원 웹사이트 제작·검증 하네스](harness/README.md) — 공통 데이터, 근거 검수, 페이지 생성, 회귀 검사, 인용 관측 집계
- [두 병원의 원리와 기업 AEO·GEO 사례 종합](research/2026-09-11-aeo-geo-synthesis.ko.md) — 2026-09-11

- [더건강한365의원 SEO·AEO·GEO 조사 및 병원 공통 점검 기준](research/2026-09-11-thegungang365/README.md) — 2026-09-11

- [올림픽파크365의원 추가 조사](research/2026-09-11-olympicpark365/report.ko.md) — 기존 보고서 비교 및 32개 공통 점검 기준에 반영
