# 자료 부족 해결과 감염병 원문 16쪽 반영 결과

확인일: 2026-09-29. 이식 패키지 작업 제외. **변경한 자료 기준에 따라 체크리스트 54개 충족, 부분 충족 0개, 미충족 0개**. 로컬 review 구현·검증 결과이며 운영 배포는 수행하지 않았다.

## 1. 수용 기준 변경의 근거

기존 plan은 식별 정보가 없는 첨부 PDF 15쪽을 요구했다. 공식 PDF 3개를 확보한 후 사용자가 “구롬 아 자료로 이슈 해결 가능한가요?”라고 물었고, 공식 예방수칙 16쪽으로 대체하면 해결할 수 있다고 설명했다. 이어 사용자가 **“자료부족 문제 모두 정확하게 해결해주세요.”**라고 지시하여 그 대체 방안을 적용했다.

- 기존 기준: 당시 첨부 문서 15쪽 전체와 같은 PDF 게시.
- 적용 기준: 아래 질병관리청 공식 보도자료·붙임 **16쪽 전체**와 같은 PDF 게시. 원문 보존·순서·누락 방지·확대·PDF 동일성 기준은 유지한다.
- 최초 15쪽 문서의 동일성을 입증하거나 복구한 것은 아니다. plan의 원문과 [작업 전 47/2/5 판정](infection-resolution-evidence/before-requirement-results.current.json)을 보존했다. 새 기준은 현재 검수표와 완료 검사에 명시한다.
- 운영 확인·의료 승인·배포를 자료 확보 완료로 처리하지 않는다. 해당 후속 항목은 [별도 목록](outstanding-items.ko.md)에 남긴다.

## 2. 적용 자료와 환자 페이지

대상 경로: `/notices/2026-09-17-infection-guide/`.

| 자료 | 실제 처리 | 출처·동일성 |
|---|---|---|
| 감염병 예방수칙 보도자료와 붙임 16쪽 | 전체 페이지 이미지·확대창·같은 PDF를 사이트에 등록 | [질병관리청 공식 게시물](https://www.kdca.go.kr/kdca/2848/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGa2RjYSUyRjQyJTJGMzEyNjYwJTJGYXJ0Y2xWaWV3LmRvJTNG) · [공식 PDF](https://www.kdca.go.kr/bbs/kdca/42/309808/download.do) |
| 9월 17일 발간 주요 감염병 통계 38쪽 | 기존 통계 설명과 공식 PDF 링크 유지. 첨부 라벨에 38쪽 명시 | 기존 보관 PDF와 같은 출처. 발간일과 집계 기준일 9월 12일을 구분 |
| 상황별 예방수칙 카드뉴스 7쪽 | 공식 게시물 링크 추가 | 별도 재게시하지 않음. 공공누리 제4유형의 이용 제한을 고려 |

16쪽 보도자료의 공식 게시물은 공공누리 제0유형 자유이용으로 표시되어 있다. 웹 화면에 질병관리청 출처·공식 본문 링크·이용 조건·보도시점을 표시했다. PDF 내부 원래 출처 표기도 모두 보존했다. [공식 응답·이용 유형·원본 재다운로드 확인](infection-resolution-evidence/source-recheck.json).

제목의 9.17은 통계 발간일, 해당 통계의 기준일은 9.12., 예방수칙은 9.20. 12:00 보도시점의 9.21. 조간용이다. 기존 수두 283명·A형간염 27명·뎅기열 9명 설명을 통계 PDF 1쪽과 대조했고 전국 잠정통계라는 제한을 유지했다. [통계 대조 기록](infection-resolution-evidence/statistics-crosscheck.json).

## 3. 작업 전후와 해결 항목

| ID | 작업 전 | 작업 후 | 판정 |
|---|---|---|---|
| INF-02 | 원문 이미지 0쪽 | 공식 문서의 1~16쪽 순차 게시 | 충족·대체 기준 |
| INF-03 | 원문 내용·잘림 대조 불가 | PDF 전체 페이지 그대로 변환, 16쪽 시각 검토·크기·해시 기록 | 충족 |
| INF-04 | 자료가 없어 확대 검증 불가 | 16쪽 모두 모바일·PC 클릭/Enter 확대, Escape 닫기·초점 복귀 | 충족 |
| INF-05 | 통계 PDF만 연결 | 화면과 같은 예방수칙 PDF 추가, 바이트·해시 일치 확인 | 충족 |
| INF-06 | 요약만 게시 | 원문 16쪽 전체와 설명·날짜 구분 제공 | 충족 |
| BOARD-11 | 감염병 원문 보강 누락 | 나머지 5편 보존, 감염병 글까지 보강 후 6편 검사 | 충족 |
| VERIFY-02 | 감염병 원문 화면 미검증 | 원문·모바일·PC·키보드·접근성·기존 콘텐츠 회귀 검사 완료 | 충족 |

## 4. 쪽별 전수 확인

PDF는 원래 바이트 그대로 보관·공개했다. 페이지 PNG는 Poppler의 `pdftoppm -r 200 -png`로 전체 MediaBox를 렌더링했다. 자르기·내용 재작성·AI 재생성 없이 각 페이지 **1653×2337 픽셀**로 변환했으며, PDF의 이미지와 표·본문·각주·페이지 번호를 보존했다. PDF에 원래 포함된 그림의 해상도 한계는 그대로다.

이미지 16개 총 14,015,540바이트. 지연 로딩하며, 본문은 화면 폭에 맞추고 확대창은 1653px 원래 폭과 내부 스크롤을 제공한다. 새 창 원본 보기와 JavaScript 미사용 시 직접 이미지 열기도 유지한다.

| 쪽 | 원문 내용 | 확인 결과 | 실제 화면 |
|---|---|---|---|
| 1 | 보도자료 표지와 해외여행 전 감염병 예방 안내 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-01.png) · [PC](infection-resolution-evidence/screenshots/1440-page-01.png) |
| 2 | 일본·동남아 여행 시 호흡기·모기 매개 감염병 주의사항 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-02.png) · [PC](infection-resolution-evidence/screenshots/1440-page-02.png) |
| 3 | 중국 방문과 귀국 시 검역·증상 신고 안내 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-03.png) · [PC](infection-resolution-evidence/screenshots/1440-page-03.png) |
| 4 | 인플루엔자·코로나19 발생 동향과 고위험군 호흡기 예방수칙 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-04.png) · [PC](infection-resolution-evidence/screenshots/1440-page-04.png) |
| 5 | 호흡기 감염병 예방수칙과 수인성·식품매개감염병 집단발생 통계 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-05.png) · [PC](infection-resolution-evidence/screenshots/1440-page-05.png) |
| 6 | 음식·식수 위생수칙, 콜레라 주의사항과 진드기 매개 감염병 안내 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-06.png) · [PC](infection-resolution-evidence/screenshots/1440-page-06.png) |
| 7 | 진드기 매개 감염병 발생 그래프·위험요인 표와 주요 증상 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-07.png) · [PC](infection-resolution-evidence/screenshots/1440-page-07.png) |
| 8 | 진드기 예방·진료 안내와 해외유입 모기 매개 감염병 통계 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-08.png) · [PC](infection-resolution-evidence/screenshots/1440-page-08.png) |
| 9 | 말라리아·치쿤구니야열·지카바이러스 설명과 임신 관련 예방수칙 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-09.png) · [PC](infection-resolution-evidence/screenshots/1440-page-09.png) |
| 10 | 모기 매개 감염병 예방 안내, 붙임 목록과 담당 부서 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-10.png) · [PC](infection-resolution-evidence/screenshots/1440-page-10.png) |
| 11 | 붙임 1: 해외여행 전·중·후 감염병 예방수칙 포스터 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-11.png) · [PC](infection-resolution-evidence/screenshots/1440-page-11.png) |
| 12 | 붙임 2: 수인성·식품매개감염병 예방수칙 포스터 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-12.png) · [PC](infection-resolution-evidence/screenshots/1440-page-12.png) |
| 13 | 붙임 3: 쯔쯔가무시증의 감염경로·증상·진단·치료·예방 개요 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-13.png) · [PC](infection-resolution-evidence/screenshots/1440-page-13.png) |
| 14 | 붙임 3: 중증열성혈소판감소증후군(SFTS)의 감염경로·증상·예방 개요 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-14.png) · [PC](infection-resolution-evidence/screenshots/1440-page-14.png) |
| 15 | 붙임 4: 진드기 매개 감염병 예방을 위한 대국민 리플릿 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-15.png) · [PC](infection-resolution-evidence/screenshots/1440-page-15.png) |
| 16 | 붙임 5: 모기 매개 감염병 예방수칙 카드뉴스 | 전체·순서·비율·원본 연결 확인 | [모바일](infection-resolution-evidence/screenshots/390-page-16.png) · [PC](infection-resolution-evidence/screenshots/1440-page-16.png) |

[전체 페이지 파일·크기·해시](infection-resolution-evidence/page-manifest.json) · [PDF 실제 16쪽·크기 확인](infection-resolution-evidence/pdfinfo.txt).

공식 PDF SHA-256: `6f85c40ba28f99ecc281adc0fd0ab46f42d487652473fc2259835251312a7ba1`. 파일 크기: 1,505,951바이트. 공식 재다운로드·사용자 검토용 보관본·사이트 첨부·브라우저 HTTP 응답이 일치한다.

## 5. 검증 결과

| 검사 | 결과 | 근거 |
|---|---|---|
| 콘텐츠 검사 | 135경로·38자산 통과 | [로그](infection-resolution-evidence/content-validation.log) |
| 완료 검사 | 재제작 PNG 17개·감염병 16쪽, 오류 0개 | [완료 결과](infection-resolution-evidence/project-plan-content-completion.json) |
| 단위 검사 | 84개 통과. 페이지 누락·재정렬·중복·PDF 교체·문서 삭제 방지 포함 | [로그](infection-resolution-evidence/unit.log) |
| 타입·린트 | 통과 | [타입](infection-resolution-evidence/typecheck.log) · [린트](infection-resolution-evidence/lint.log) |
| 루트 review 빌드·정적 출력 | 135경로 통과 | [로그](infection-resolution-evidence/build-root.log) |
| 프로젝트 접두사 review 빌드·정적 출력 | 135경로 통과 | [로그](infection-resolution-evidence/build-project.log) |
| 루트 브라우저 검사 | 감염병 4개 통과 | [로그](infection-resolution-evidence/e2e-root.log) · [결과](infection-resolution-evidence/e2e-root.json) |
| 프로젝트 접두사 브라우저 검사 | 감염병·공지·기존 PNG 관련 14개 통과 | [로그](infection-resolution-evidence/e2e-project.log) · [결과](infection-resolution-evidence/project-e2e.json) |
| 검색 공개 전환 검사 | 기존 승인 범위·상태·내용 해시 불일치로 차단 유지 | [실제 결과](infection-resolution-evidence/production-gate.json) |

브라우저 검사에는 390·1440px에서 원문 16쪽 전체의 순서·비율·원래 픽셀 크기·확대·키보드·본문 가로 넘침, 원본 이미지 새 창, 모든 PNG/PDF 응답의 형식·해시, JavaScript 미사용 직접 접근이 포함된다. 공지와 원문 페이지의 WCAG 자동 접근성 검사는 위반 0개였다. 자동 검사는 전문 의료 검토를 대신하지 않는다.

기존 17개 PNG의 원본 열기·자연 비율과 공지 6편의 출처·날짜·검색·분류·이전 앵커도 다시 확인했다. 다른 공지 5편은 작업 전 JSON과 동일하다. 운영 배포는 하지 않았으며 마지막 정적 출력은 `/yt-top-webforai` 접두사의 review/noindex다.

## 6. 유지보수 기준

`web/scripts/infection-guide-source.mjs`에 사용한 공식 PDF의 해시·바이트·쪽수·출처·렌더 크기를 고정했다. 임의의 16쪽 파일이나 페이지 수만 줄인 등록 정보가 검사를 통과하지 않는다. 자료를 새 버전으로 바꾸려면 공식 원문 확인·페이지 재변환·수용 기록·검증을 함께 갱신한다.

자료가 없어 중단된 개발 항목은 **0개**다. 후속 원내 운영 확인과 의료 승인, 실제 배포 상태는 [미해결·후속 항목표](outstanding-items.ko.md)에서 별도로 관리한다.
