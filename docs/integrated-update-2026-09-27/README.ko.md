# 블로그 미반영사항 통합반영안 적용

기준일: 2026-09-27. 현재 작업 트리의 구현 기록이며 병원 사이트에 게시하지 않는다.

간단한 공유용 요약은 [작업 결과 보고서](work-report.ko.md)를 참고한다.

후속 요청에 따른 작업 의도 확인과 커밋·배포 진행은 [배포 기록](deployment.ko.md)에 별도로 기록한다. 아래 미배포 상태는 최초 구현 완료 시점의 기록이다.

사용자가 지정한 `plan/영통탑내과_블로그_미반영사항_통합반영안_2026-09-27.md`와 같은 이름의 DOCX만 요구사항으로 사용했다. 이식 패키지 README, 패키지 실행 스크립트, 작업 브랜치 생성 절차는 제외했다. 통합반영안 DOCX에도 들어 있는 브랜치 생성·패키지 자동 적용 명령은 사용자의 명시적 제외 지시를 우선하여 실행하지 않았다. 기존 `main` 작업 트리에서 편집했으며 브랜치 생성·전환, 커밋·푸시·배포는 수행하지 않았다. 작업 전부터 있던 `plan/` 파일 삭제·추가는 유지했다.

## 구현 범위

기존 94개 URL을 유지하면서 14개를 추가하여 총 108개 경로가 되었다. 기존 페이지 23개를 수정했고 질문·답변은 기존 152개를 유지했다. 문서의 “신규 18개”는 별도 패키지 구성 설명이다. 이번 작업은 통합반영안에 명시된 기능과 하위 구조를 기준으로 했으며 간질환은 기존 안내를 재사용했다. 원고가 제공되지 않은 별도 증상백과 글을 페이지 수에 맞춰 만들지는 않았다.

| 통합반영안 요구 | 반영 내용 |
|---|---|
| 진료분야 8개 | 같은 위계의 8개 카드, 짧은 소개·응급 안내·관련 진입 링크로 정리. 기존 긴 혼합 본문은 해당 하위 안내로 연결 |
| 소화기 5개 | 식도·위, 소장·대장·충수, 담낭·담도, 췌장, 기존 간질환 안내. 급성 복통은 허브 상단 별도 진입 링크 |
| 갑상선·경동맥·경부 멍울 | 허브와 세 하위 안내. 기능검사·초음파·약물치료·조직검사 및 전문 진료 의뢰 범위 설명 |
| 신장 3개 | 허브와 신장기능·신우신염·수신증 안내. 혈액·소변·초음파, 치료와 대학병원 연계 |
| 심장 관련 혈액검사 | 제목과 관련 링크 이름 변경. 현재 가능 6종의 결과 시점, IMA 현재 미시행 구분 유지 |
| CART BP Pro | 독립 검사 안내, 약 24시간 착용·반납 후 약 1시간·평가 목적·홀터와의 차이. 검사 허브·준비 안내·관련 진료에서 연결 |
| 초음파 3종 | 복부 장기, 장관 부종·비후·충수염·폐색·천공 의심·복수·혈복강·종괴, 경동맥 내중막·플라크·협착·혈류 설명. 제목은 충수, 본문에 맹장염 병기 |
| 심뇌혈관 예방·금연 | 고혈압·당뇨·고지혈증·금연·체중관리로 제목 정리. 합병증 예방 목표, 공단 금연치료 지원사업 참여와 등록 시 조건 확인 |
| 성인 예방접종 | 제공 DOCX의 일정표를 추출하여 내용 변경 없이 WebP로 압축. 1055×1491, 178,268바이트. 대표 이미지와 같은 9개 백신의 HTML 표·상담 문장·자체 제작 캡션 |
| 백과 분류 | 기존 증상 7개·질환 5개 분류 유지, 급성·만성 복통 표기 정리. 심장·혈관 20편 목록을 페이지 원장에서 도출 |
| 홈·사이트 검색 | 응급 안내 다음 검색창, 헤더 검색 텍스트, 전체+7개 필터, 별칭. 처음에는 검색 안내만 표시하고 분야 선택·입력 후 결과 표시 |
| 검색 개인정보 | 개인정보 입력 금지 안내. 홈 입력값은 URL fragment로 전달하여 검색어를 HTTP query로 보내지 않음. 기존 `?q=` 링크는 호환 유지 |
| 공통 하단 | 기존 조건부 컴포넌트 재사용. 비용·서류 안내에도 의료 안전 문구 적용, 비심장 페이지에 심장 예약문 제외 |
| 목차 | PC·모바일에서 하나의 nav 사용, 상위 항목 최대 8개. FAQ·출처·관련 안내·병원 주소는 목차에서 제외하고 관련 안내는 본문 하단으로 이동 |
| 환자 사례 | 검색·관련 링크·HTML/XML 사이트맵·사례 ItemList에서 제외. 4종 robots 제한. 원문 링크 25개와 푸터 진입 유지, 사례 검색 입력 제거 |
| 개인정보 원칙 | 이름·연락처·정확한 진료일·원본 검사자료 및 간접 식별정보 공개 금지 안내. 새로운 개별 증례나 복합 사례는 생성하지 않음 |
| 단일 원장·영문명 | `pages.json`·공통 정보구조에서 허브·검색·사이트맵·구조화 데이터 생성. 병원 영문명을 `clinic.json`에 두고 홈·푸터 공통 사용 |

## 추가 경로

| 안내 | 경로 |
|---|---|
| 소화기질환 | `/conditions/digestive/` |
| 식도·위 | `/conditions/digestive/esophagus-stomach/` |
| 소장·대장·충수 | `/conditions/digestive/bowel-appendix/` |
| 담낭·담도 | `/conditions/digestive/gallbladder-bile-duct/` |
| 췌장 | `/conditions/digestive/pancreas/` |
| 갑상선·경동맥·경부 멍울 | `/conditions/thyroid-carotid-neck/` |
| 갑상선 | `/conditions/thyroid-carotid-neck/thyroid/` |
| 경동맥 | `/conditions/thyroid-carotid-neck/carotid/` |
| 목 멍울 | `/conditions/thyroid-carotid-neck/neck-lump/` |
| 신장질환 | `/conditions/kidney/` |
| 신장기능 | `/conditions/kidney/function/` |
| 신우신염 | `/conditions/kidney/pyelonephritis/` |
| 수신증 | `/conditions/kidney/hydronephrosis/` |
| 24시간 혈압 | `/services/heart/ambulatory-blood-pressure/` |

## 자료와 검토 상태

일반 의학 설명은 NHS·NIDDK 등 공개 자료와 기존 페이지 출처를 대조하여 요약했고, 상세 출처는 각 페이지 `sources`에 기록했다. [NIDDK 신장기능 검사](https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/tests-diagnosis), [NIDDK 신우신염](https://www.niddk.nih.gov/health-information/urologic-diseases/kidney-infection-pyelonephritis), [NHS 수신증](https://www.nhs.uk/conditions/hydronephrosis/), [NHS 췌장염](https://www.nhs.uk/conditions/acute-pancreatitis/) 등을 확인했다. 예방접종 이미지는 새로 그리지 않고 원장님 제공 자료를 사용했다. A형간염 본문은 이미지의 일반 일정과 질병관리청 자료의 제품별 간격 설명을 함께 제시했다. [질병관리청 A형간염 안내](https://nip.kdca.go.kr/irhp/infm/goVcntInfo.do?menuCd=1109&menuLv=1).

CART BP Pro의 운영 시간, 원내 검사·백신 제공 범위와 금연치료 지원사업 참여는 원장님이 보낸 통합반영안 및 기존 원고를 근거로 반영했다. 공단 자료는 지원사업의 일반 설명에 사용했으며 본원의 현재 등록 상태를 외부 조회로 새로 인증한 것은 아니다. 특정 비용·지원 횟수·본인부담을 임의로 확정하지 않았다.

추가·수정된 원고는 검토 대기 상태다. `reviews.json`과 `publication-approval.json`은 변경하지 않았다. 실제 의료 검토자·검토 완료 표시를 만들지 않았으며 이전 승인으로 변경된 편집본을 production 공개할 수 없다. 자동 검사는 의료·운영 검토를 대신하지 않는다.

## 검증

Node.js 24.21.0에서 콘텐츠 검사·TypeScript·ESLint·단위 테스트 68개·Python 하네스 17개를 통과했다. 루트와 `/yt-top-webforai/` 경로 각각 108개 경로를 review 빌드했으며 정적 검사와 Playwright 48개씩을 통과했다. 두 빌드의 콘텐츠 digest는 같다.

브라우저 검사는 전체 경로의 HTML·자바스크립트 없는 이용·FAQ와 JSON-LD 일치·빈 목차와 중복 목차 금지·사례 제외, 대표 화면의 자동 접근성·모바일 메뉴·키보드 이동·인쇄·검색을 포함한다. PC·모바일 캡처에서 진료분야 카드, 홈, 본문 목차, 신장 안내, 예방접종 그림을 확인했다.

로컬 모바일 Lighthouse 결과: 홈 성능 99, 예방접종 98, 접근성·Best Practices는 각각 100. LCP는 약 1.96초·2.35초이고 CLS는 모두 0이다. SEO 66은 review/noindex 환경의 측정값이며 실제 검색 노출·순위나 실사용 성능 결과가 아니다. 기존 production 검증은 승인 범위·상태·digest 불일치로 새 편집본 공개를 차단하는 것을 확인했다.

검증 결과와 범위는 [verification.json](verification.json)에 기록한다. 원시 브라우저·정적 검사·성능 보고서와 화면 캡처는 로컬 `web/reports/`에 보관하며 `web/out/`에는 포함하지 않는다.

이번 변경은 로컬 구현이며 배포하지 않았다. 이전 94개 경로 배포 기록은 [별도 기록](../director-content-review-2026-09-26/deployment.ko.md)으로 보존한다.
