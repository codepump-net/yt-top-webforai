# 배포 전 최종 검토 — 최초 체크리스트와 문구 대조

검토일: 2026-09-29 · 검토자: Codex(콘텐츠 대조·구현·기술 검증). 의료진의 승인 기록을 의미하지 않는다.

## 1. 범위와 기준

- 최초 [54개 체크리스트](README.ko.md), [plan 원문 7개 대조표](source-coverage.ko.md), [작업 전 기준](baseline.json)을 사용했다. plan 자체의 체크 42개 중 패키지 전용 검사 2개를 제외한 40개와 다른 문서의 추가 요구를 54개 기준으로 추적한다.
- **이식 패키지는 논이슈다.** 제공·확보·설치·복사·자동 적용·패키지 전용 검증은 작업과 완료 집계에서 제외한다. 이번 검토에서도 수행하지 않았다.
- 이미지 17개는 사용자 정정에 따른 신규 PNG 제작 기준이다. 감염병은 후속 지시에 따른 공식 16쪽 자료 대체 기준이다. 원래 특정 15쪽 문서를 복구했다는 뜻이 아니다.
- 이번 세션에서 추가·수정한 공지 6편, 용어·예방접종 본문, 메뉴·검색·버튼·안내문, 이미지 문구·ALT, 출처·날짜·검수 기록을 대조했다. 기존 본문을 포함한 135경로 전체에는 콘텐츠·정적 출력·연결 검사를 적용했다.
- 실제 운영 배포와 검색 공개 전환은 수행하지 않았다.

## 2. 발견 사항과 수정 전후

| ID | 위치 | 수정 전 문제 | 최종 반영 | 확인 근거 |
|---|---|---|---|---|
| FINAL-01 | HPV 공지의 날짜 표시 | 출처의 최종 검토일 `2026-04-14`를 ‘공식 자료 발표’로 표시 | `sourceReviewedAt`으로 구분해 ‘출처 페이지 검토일’로 표시. 발표일은 확인되지 않았으므로 비워 두고, 자체 최초 게시일과 내용 확인일은 별도 유지 | [예방접종도우미 HPV](https://nip.kdca.go.kr/irhp/infm/goVcntInfo.do?menuCd=132&menuLv=1)의 날짜 명칭 대조. 미래 검토일 거절 단위 검사와 실제 화면 검사 추가 |
| FINAL-02 | 경기도 학생 인플루엔자 공지의 요약·본문 | `2008~2011년생(중3~고3)`으로 축약해 학년 조건과 출생일 조건을 같은 범위처럼 표현 | 경기도 소재 중3~고3 재학생과 경기도 중·고등학교 재학 중인 2008.1.1.~2011.12.31. 출생 학생을 함께 명시. 재학 조건·지원 기간·방문 전 참여기관 확인 유지 | [경기도교육청 사업 안내](https://www.goe.go.kr/goe/na/ntt/selectNttInfo.do?mi=&nttSn=2363059)의 지원 대상 대조 |
| FINAL-03 | 국가 인플루엔자 HTML 표 첫 행 | 2회 접종 조건을 ‘첫 접종·이력 불확실 등’으로 생략 | 해당 연령에서 `2026년 6월 30일까지 총 1회만 접종한 경우`를 추가. 대상별 6행과 시작일·종료일은 유지 | [예방접종도우미 인플루엔자](https://nip.kdca.go.kr/irhp/infm/goVcntInfo.do?menuCd=134&menuLv=1)의 실시 기준 대조 |
| FINAL-04 | HPV 공지 요약 | 이미 시작된 5월 6일 지원을 ‘시작합니다’로 표현해 본문과 시제 불일치 | ‘시작되었습니다’로 통일 | 현재 검토일·지원 개시일·본문 대조 |
| FINAL-05 | 수원시 공지·지역사업 방문 안내·게시판 상태 | `짝수연도`, `지원접종`, `지원기간 안내` 표기가 혼재 | `짝수 연도`, `지원 접종`, `지원 기간 안내`로 정리 | 공지 목록·상세·상태 표시 대조 |

공식 자료를 실제 재확인한 공지의 내용 확인일을 2026-09-29로 갱신했다. 공지 원장과 6개 상세 페이지를 함께 동기화했다. 전후 전체 차이는 [공지 원장 비교](predeploy-evidence/notices-final-review.diff)와 [페이지 비교](predeploy-evidence/pages-final-review.diff)에 보존했다.

추가 대조 출처: [65세 이상 폐렴구균](https://nip.kdca.go.kr/irhp/infm/goVcntInfo.do?menuCd=135&menuLv=1), [수원시 대상포진 지원](https://health.suwon.go.kr/board_view.asp?bd_gubn=&no=870&page_code=sub060901). 수원시 자료는 일반 HTTP 접근으로 본문을 확보했으며, 예방접종도우미는 로컬 Python TLS 연결 실패 후 웹 열람으로 확인했다. 접근 방법의 차이를 자료 미확보로 집계하지 않았다.

## 3. 문장·이미지·기존 요청의 재확인

| 검토 대상 | 확인 범위 | 결과 |
|---|---|---|
| 최초 plan | 7개 파일의 SHA-256을 초기 기록과 대조 | 전부 일치. 요청 원문 변경 없음 |
| 용어 치환 | 최초 TXT-01~20의 정확한 목표 문구, 기존 ID·주소·의뢰 범위 | 20곳 일치. 공개 콘텐츠에서 이전 용어 잔존 없음 |
| 세션의 변경 문장 | 기준 커밋 대비 변경 페이지 15개 중 신규 공지 6편 및 나머지 페이지의 변경 문자열 21개, 추가 UI·채널·안내도 문구 | 문맥·표기·진료 범위·출처 대조. 위 5종 수정 반영 |
| 전체 공개 데이터 | 페이지·공지·이미지 설명·공식 채널의 문자열 4,705개, 178,217자 | 깨진 문자·숨은 문자·이전 용어·임시 문구 등의 자동 검사에서 발견 0건. 자동 검사가 모든 문장의 의학적 승인이나 맞춤법 정확성을 보증하지는 않음 |
| 새 PNG | 배너 12개와 안내도 5개를 다시 읽고 이미지·HTML·ALT 대조 | 추가 오타 발견 없음. OCR에서 의심한 심장·신장·증상·외국인등록증 등은 실제 이미지에서 정상 표기 확인 |
| PNG 동일성 | 17개 공개 PNG와 생성 마스터, 직전 정확성 검토의 해시 대조 | 모두 일치. 이번 검토에서 이미지 재생성·수정 없음 |
| 감염병 원문 | 직전 전수 시각 검토를 마친 PDF·16개 이미지의 해시, 페이지 순서·해상도, 모바일·PC 확대·키보드·원본 접근 | 원문 바이트 유지. 15쪽 요구의 16쪽 대체 이력과 통계 38쪽 별도 링크 유지 |
| 공지 기능 | 검색·분류·중요 고정·페이지 이동·날짜 의미·미집계 조회수·기존 앵커 | 실제 공지 6편 기준으로 확인. 가짜 조회수·의료 승인 표시 없음 |
| 공식 채널·기존 사이트 | 홈·병원안내·푸터 3개 채널, sameAs, 원래 공지·사례 URL | 중복·잘못된 내부 연결 없이 유지 |

수치·파일별 근거: [최초 기준·문자·해시 검사](predeploy-evidence/baseline-and-text-check.json). 배너 검토용 모음: [1](predeploy-evidence/banner-sheet-1.png), [2](predeploy-evidence/banner-sheet-2.png), [3](predeploy-evidence/banner-sheet-3.png). 이미지별 이전 교정 이력은 [정확성 검토](image-accuracy.ko.md), 공식 PDF의 전수 시각 검토는 [자료 해결 기록](infection-resolution.ko.md)에 있다.

## 4. 실행 검증

최종 실행 결과를 아래에 기록한다.

| 검사 | 결과 | 실행 근거 |
|---|---|---|
| 콘텐츠·실제 자산 검사 | 135경로·38자산 통과 | [content.log](predeploy-evidence/content.log) |
| 타입 검사·ESLint | 모두 통과 | [typecheck.log](predeploy-evidence/typecheck.log) · [lint.log](predeploy-evidence/lint.log) |
| 단위 테스트 | 13개 파일, **85개 통과** | [unit.log](predeploy-evidence/unit.log) |
| 기존 하네스 | **17개 통과** | [harness.log](predeploy-evidence/harness.log). macOS의 Python 명령에 맞춰 `PYTHON=python3` 지정 |
| 루트 review 빌드·정적 검사 | 135경로, 링크·HTML·메타·구조화 데이터·색인 상태·자산 통과 | [root-build.log](predeploy-evidence/root-build.log) · [정적 검사](predeploy-evidence/root-static-audit.json) |
| 프로젝트 접두사 review 빌드·정적 검사 | `/yt-top-webforai`, 135경로 모두 통과 | [project-build.log](predeploy-evidence/project-build.log) · [정적 검사](predeploy-evidence/project-static-audit.json) |
| 루트 관련 브라우저 검사 | **14개 통과**, 실패·건너뜀·불안정 재시도 0 | [root-e2e.log](predeploy-evidence/root-e2e.log) · [상세](predeploy-evidence/root-e2e.json) |
| 프로젝트 접두사 전체 브라우저 검사 | **69개 통과**, 실패·건너뜀·불안정 재시도 0. 기존 의료진·탐색·검색·번역·접근성·확대·인쇄·하단 UI 검사 포함 | [project-e2e.log](predeploy-evidence/project-e2e.log) · [상세](predeploy-evidence/project-e2e.json) |
| 요청 완료 검사 | PNG 17개·공식 감염병 16쪽·오류 0 | [plan-completion.log](predeploy-evidence/plan-completion.log) |
| 문자·초기 기준·해시 | plan 7개·용어 20곳·PNG 17개·감염병 16쪽 및 PDF 일치 | [baseline-and-text-check.json](predeploy-evidence/baseline-and-text-check.json) |
| 문서 일관성 | 54개 판정과 결과표 일치, 검사한 문서의 로컬 링크 오류 0 | [document-consistency.json](predeploy-evidence/document-consistency.json) |

추가로 수정한 공지의 390px 화면을 직접 확인했다. HPV 날짜 명칭과 경기도 지원 대상 문장이 잘림 없이 표시되며 페이지 가로 넘침이 없다. [HPV 화면](predeploy-evidence/2026-hpv-390.png) · [경기도 화면](predeploy-evidence/2026-gyeonggi-student-influenza-390.png) · [측정 기록](predeploy-evidence/corrected-notice-mobile.json).

모바일 Lighthouse 실험실 측정은 다음과 같다. 성능 90점 이상, 접근성·모범 사례 95점 이상, LCP 2,500ms 이하, CLS 0.1 이하의 기존 기준을 모두 통과했다. 실제 사용자 성능 측정이나 운영 서버 측정은 아니다. [전체 결과](predeploy-evidence/performance-selected.json).

| 화면 | 성능 | 접근성 | 모범 사례 | LCP | CLS |
|---|---:|---:|---:|---:|---:|
| 홈 | 98 | 100 | 100 | 2,343ms | 0 |
| 공지 목록 | 100 | 100 | 100 | 1,885ms | 0 |
| 감염병 안내 | 99 | 100 | 100 | 2,254ms | 0 |

SEO 점수는 세 화면 모두 66점이다. `review/noindex`에서 검색 수집을 막는 현행 정책에 따른 결과이며, 이 항목만 예외로 처리하는 기존 성능 검증을 유지했다. 검색 수집 허용으로 바꾸어 점수를 올리지 않았다.


## 5. 최종 체크리스트 판정

| 분야 | 검수 ID | 충족 | 부분 충족 | 미충족 |
|---|---|---:|---:|---:|
| 메뉴 | NAV-01~03 | 3 | 0 | 0 |
| 용어 | TERM-01~07 | 7 | 0 | 0 |
| 공지 | BOARD-01~12 | 12 | 0 | 0 |
| 인플루엔자 표 | FLU-01~04 | 4 | 0 | 0 |
| 감염병 자료 | INF-01~06 | 6 | 0 | 0 |
| PNG 이미지 | IMG-01~07 | 7 | 0 | 0 |
| 공식 채널 | CHANNEL-01~07 | 7 | 0 | 0 |
| 기존 정보·검토 상태 보존 | SAFE-01~04 | 4 | 0 | 0 |
| 결과 검증·기록 | VERIFY-01~04 | 4 | 0 | 0 |
| **합계** | **54개** | **54** | **0** | **0** |

개별 항목의 작업 전·후와 증거는 [54개 결과 기록표](work-results.ko.md), 기계 판독용 현재 판정은 [requirement-results.current.json](requirement-results.current.json)을 사용한다. 이식 패키지는 위 표의 분모·미충족·자료 부족에 포함하지 않는다.

## 6. 배포 판단과 별도 확인

문구·구현 검토에서 확인한 수정 사항을 반영했다. 위 범위에서 추가로 확정한 미수정 오류는 없다. 로컬 `review/noindex` 상태를 유지한다.

현재 `production` 검증은 다음 실제 사유 3개로 차단된다. 승인 내용을 임의로 만들거나 검사를 완화하지 않았다. [실행 결과](predeploy-evidence/production-validation.json).

1. 공개 승인 범위와 현재 색인 대상 페이지 범위가 다름.
2. 공개 승인에 필요한 콘텐츠 승인 상태가 충족되지 않음.
3. 콘텐츠·운영 사실·렌더러 변경으로 기존 승인 확인의 digest가 현재 버전과 일치하지 않음.

배포 전에 원내 검사 시간·장비, 검진 예약·서류 발급기간, 이번 버전의 의료·운영 승인 기록을 실제 담당자가 확인해야 한다. 구체적인 확인 값과 완료 기준은 [FOLLOW-01~03](outstanding-items.ko.md)에 유지한다. 이미지 로고의 정밀한 CI 통일은 기존 선택 보완 항목(FOLLOW-04)이며, 최신 버전의 실제 배포·운영 응답 확인은 FOLLOW-05다.

**콘텐츠 체크리스트 충족과 운영 공개 승인 완료는 각각의 기록으로 판단한다. 이번 최종 검토는 배포 완료 또는 의료 승인 완료를 뜻하지 않는다.**
