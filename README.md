# yt-top-webforai

영통탑내과 홈페이지의 SEO·AEO·GEO 조사와 React 정적 사이트 구현 저장소입니다.

- **[개발 결과·실제 검증 보고서](docs/development-completion.ko.md)** — 76개 페이지 구현, 두 CI 검증 성공, Pages 최초 활성화 필요
- **[개발·운영 인수 문서](docs/development-handoff.ko.md)** — 실행, 원고 수정, 실제 검수, 자동 배포, AI 인용 관측
- **[웹 앱 실행](web/README.md)** — Next.js 16.3.4 · React 19.3.0 · TypeScript · Tailwind CSS 4.3.3
- [콘텐츠 원장](content/README.md) — 76개 페이지, 의료진 2명, 진단 사례 25편, 공지 5편
- [자동 검사·배포 워크플로](.github/workflows/pages.yml)

배포 목표 주소: `https://codepump-net.github.io/yt-top-webforai/`. 현재 빌드 기본값은 의료·운영 검토 전의 **noindex 검토본**입니다. Pages 최초 활성화와 실제 배포 결과는 개발 완료 보고서에서 확인합니다. 원본 크롤링·OCR·환자 관련 이미지는 로컬 `research/`에만 보관하므로 아래 조사 자료 링크는 공유 작업 공간에서 확인할 수 있습니다.

## 개발 스펙

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
