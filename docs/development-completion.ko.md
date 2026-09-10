# 영통탑내과 웹사이트 개발 결과 및 검증 보고서

작성: 2026-09-11 · 구현 커밋: `eafe4bccce760a7d9b669e5801f0b1eda8a98ef1`

**76개 경로의 정적 홈페이지와 자동 검사·배포 코드를 구현했고, GitHub Actions의 두 빌드 검증은 모두 성공했습니다. 실제 GitHub Pages 배포는 저장소의 Pages 최초 활성화가 되어 있지 않아 완료되지 않았습니다.**

## 결과물 확인

- 현재 작업 PC의 [로컬 미리보기](http://127.0.0.1:4173/yt-top-webforai/)
- [GitHub 소스 코드](https://github.com/codepump-net/yt-top-webforai)
- [실제 GitHub Actions 실행과 다운로드 artifact](https://github.com/codepump-net/yt-top-webforai/actions/runs/34544178967)
- [개발·운영 인수 문서](development-handoff.ko.md)
- [페이지별 구현·검토 상태 76행](verification/page-status.csv)
- 로컬 완성 사이트 ZIP: `artifacts/yeongtong-top-review.zip` (2,418,718바이트)

미리보기 서버는 외부에 공개하지 않고 작업 PC의 `127.0.0.1:4173`에서만 실행합니다. 서버 종료나 PC 재시작 후에는 `web`에서 `$env:PORT='4173'; npm run serve`로 다시 실행할 수 있습니다. ZIP은 정적 서버의 배포 루트에 풀어 사용할 결과물입니다. `file://`로 HTML을 직접 여는 방식은 하위 경로의 리소스 주소를 지원하지 않습니다.

## 완료한 기능

| 범위 | 결과 |
|---|---|
| 화면 | 반응형 홈, 병원 소개·의료진·방문 안내, 진료·검사·검진 허브와 상세 |
| 콘텐츠 | 건강정보 4편, 익명화한 사례 요약 25편, 공지 5편, 비용·서류·작성원칙·개인정보 안내 |
| 탐색 | 사이트 검색, 분야 필터, 빈 결과 처리, 전체 페이지 목록, 관련 글, 본문 목차 |
| 정적 사이트 | 76개 계획 경로, 실제 없는 경로의 HTTP 404, JavaScript 없는 본문·메뉴·Q&A |
| SEO·AEO·GEO 기반 | 페이지별 제목·설명·canonical·OG, JSON-LD, 병원·의료진 ID, 출처·일자, 질의응답 HTML |
| 이미지 | 기존 홈페이지 이미지 5개 WebP 결과물, 원본 URL·해시·대체 텍스트·크기 관리 |
| 검수 하네스 | 원고·출처·이미지·연결 검증, 유효한 실제 검수 없이는 production 차단, 변경 시 재검수 |
| AI 관측 하네스 | 편집 질문 20개, 인용·언급·오류·검토 정확도 집계, 다른 GitHub 프로젝트 인용 제외 |
| 자동화 | main push 자동 검사·배포, PR 검사, artifact 보관, 배포 커밋·HTML 검증, 의존성 업데이트 설정 |

메뉴나 본문을 환자 검사 이미지에 의존하지 않도록 구성했습니다. 의료진 실루엣은 원본의 소개 이미지로 표시했습니다. 실제 의사 검수·환자 동의·높은 질문 빈도·AI 인용 성과를 확인 없이 만들어 넣지 않았습니다. 기존 홈페이지의 가격과 운영 정보가 불분명한 부분은 확인이 필요한 안내로 처리했습니다.

## 실제 검증 결과

실행 `34544178967`의 **Validate (root)**와 **Validate (project)**가 모두 `success`입니다. Windows의 로컬 정적 서버와 GitHub의 Linux Chromium에서 검사했습니다.

| 검사 | 결과 |
|---|---|
| 신규 단위 검사 | 20개 통과: 콘텐츠 계약, 실제 검수 통과/거절, 만료·변경 검수, 경로, JSON-LD escaping, 인용 집계 |
| 기존 Python 하네스 | 17개 통과: 임상 승인·근거·원장·기존 구조 회귀·관측 분모 |
| 브라우저 검사 | 각 빌드 16개 통과, skip·실패·flaky 0 |
| 모든 페이지 요청 | 76개 경로 응답과 정적 제목 확인 |
| JavaScript 비활성화 | 76개 경로 본문·연락처 표시 확인 |
| 자동 접근성 | 대표 8개 화면 WCAG 2.2 AA 규칙 위반 0 |
| 반응형 | 360·390·768·1280·1440px, 대표 5개 화면 가로 넘침 없음 |
| 사용자 기능 | 검색·필터·초기화, 모바일 메뉴, 키보드 이동, Q&A, 직접 경로 새로고침, 404 복구 |
| 응급 맥락 | 긴급 도움 안내 표시, 해당 글의 별도 예약 CTA 제외 |
| 빌드 감사 | 76개 HTML의 메타·JSON-LD·canonical·링크·fragment·이미지·검색 노출 정책 통과 |
| 패키지 보안 | npm audit 알려진 취약점 0건 |
| 파일 전송량 | 페이지 외부 JS 최대 174,849바이트 gzip, CSS 최대 7,758바이트 gzip |
| 로컬 배포물 검증 | 구현 커밋·76페이지 HTML 해시·메타·없는 경로 HTTP 404 통과 |

자동 접근성 검사는 보조기술과 실제 사용자의 모든 이용 상황을 보장하지 않습니다. JavaScript 전송량은 외부 스크립트 합계이며 HTML 안의 React 데이터까지 포함한 전체 페이지 전송량과 구분합니다. 전체 HTML 바이트 수는 [정적 감사 JSON](verification/static-audit.json)에 페이지별로 남겼습니다.

GitHub Actions의 프로젝트 경로 빌드에서 측정한 모바일 Lighthouse 결과는 다음과 같습니다. 인터넷에 배포된 사이트의 사용자 실측값이 아닌 **압축 정적 서버의 시뮬레이션 측정**입니다.

| 대표 페이지 | 성능 | 접근성 | 권장사항 | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| 홈 | 100 | 100 | 100 | 66 | 1.61초 | 0 |
| 심장초음파 검사 | 98 | 100 | 100 | 66 | 2.06초 | 0 |
| 검색 | 98 | 100 | 100 | 66 | 2.16초 | 0 |

SEO 66점의 실패 항목은 검토본에서 의도한 `noindex`에 따른 `is-crawlable`입니다. 점수를 높이기 위해 이 설정을 제거하지 않았습니다. 그 밖의 가중치가 있는 SEO 감사 항목은 통과했습니다. INP는 실제 사용자 측정이 없으므로 값을 제시하지 않습니다. [성능 원본 요약](verification/performance.json), 전체 Lighthouse HTML은 Actions의 `checks-project` artifact에서 볼 수 있습니다.

## 배포 상태와 남은 외부 설정

`Deploy GitHub Pages` 작업의 `actions/configure-pages@v6`에서 `Get Pages site failed … Not Found`가 발생했습니다. 현재 Pages 사이트가 설정되어 있지 않습니다. 앞서 CLI로 수행한 Pages 최초 생성도 HTTP 404로 거절됐으며, 현재 계정의 저장소 권한은 코드 push 가능·관리자 권한 없음으로 확인했습니다. 실제 Pages URL이 열리거나 공개 배포에 성공했다고 표시하지 않습니다.

배포 재개에는 저장소 관리자가 아래 설정을 한 번 수행해야 합니다.

1. [저장소 Pages 설정](https://github.com/codepump-net/yt-top-webforai/settings/pages)에서 **Build and deployment → Source → GitHub Actions**를 선택합니다.
2. [배포 워크플로](https://github.com/codepump-net/yt-top-webforai/actions/workflows/pages.yml)에서 **Run workflow → main**을 실행합니다. 오래된 실행의 재시도보다 최신 main으로 새 실행을 시작합니다.
3. 두 검사 작업과 배포 후 76페이지 검증이 모두 통과하면 `https://codepump-net.github.io/yt-top-webforai/`에서 검토할 수 있습니다.

이 절차에 별도 앱 구현은 필요하지 않습니다. [configure-pages 공식 설명](https://github.com/actions/configure-pages/blob/main/action.yml)에 따라 일반 `GITHUB_TOKEN`으로 최초 활성화 권한을 우회하지 않았으며, 다른 계정으로 전환하거나 별도 토큰을 저장소에 넣지 않았습니다. 빌드가 완료된 `site-project`와 `github-pages` artifact는 실제 실행에 업로드되어 있습니다.

현재 검토본은 `noindex`이고 실제 승인 원장은 비어 있습니다. 공개 검색 노출 전 필요한 병원 운영·의료 검토, 도메인·원본 301 이관, 소유권 인증과 사이트맵 제출 절차는 [인수 문서](development-handoff.ko.md)에 정리했습니다. 이번 결과는 **AEO·GEO가 사용할 수 있는 기술·콘텐츠 구조의 구현**이며, 아직 측정하지 않은 검색 순위나 AI 인용 증가를 뜻하지 않습니다.
