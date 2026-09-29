# 작업 후 실제 결과 기록표

검증일: 2026-09-29. **54개 중 충족 47개 · 부분 충족 2개 · 미충족 5개**. PNG 17개는 사용자 정정에 따라 새로 제작하고 사이트에 연결했다. 감염병 원문 15쪽과 관련 검증은 남아 있다. 로컬 구현·검증 결과이며 운영 배포는 수행하지 않았다.

[최신 이미지 정확성 검토·4개 수정](image-accuracy.ko.md) · [최초 PNG 재제작·검증](redrawn-images.ko.md) · [현재 54개 판정](requirement-results.current.json)

[최종 재검토](final-review.ko.md) · [개발 결과와 편집 근거](implementation.ko.md) · [검사 증거](evidence/verification.json)

[요청·작업 전후 기준](README.ko.md) · [작업 전 원문 자료](baseline.json) · [원문 대조](source-coverage.ko.md)

[전체 미해결 항목·완료 기준](outstanding-items.ko.md): 기존 미완료 7개와 운영 확인·디자인 보완·배포 상태를 정리했다.

[원문 자료 식별 조사](original-material-references.ko.md): plan의 모든 관련 언급과 준비할 자료를 정리했다. PDF 파일명·URL은 plan에 없으며, 기존 38쪽 PDF와 요청 자료의 동일성은 미확인이다.

## 사용 방법

각 행의 실제 확인 내용을 먼저 적고, 증거를 연결한 뒤 판정한다. 판정은 `미검증 / 충족 / 부분 충족 / 미충족 / 확인 필요` 중 하나다. 확인자·확인일은 실제 확인한 때만 기록한다. `—`는 값 미기록을 뜻한다. 작업 후 자료 확보가 필요한 항목도 해당 ID의 문제로 남기고 다른 작업 결과와 구분한다.

| 확인 환경 | 실제 기록 |
|---|---|
| 작업 후 커밋·변경 파일 | 커밋 전 작업 트리. [변경 파일](evidence/changed-files.json). 기존 plan 추가·삭제는 사용자 작업 상태를 보존. |
| 검증한 주소·실행 환경 | macOS arm64 · Node 24.10.0 · Chromium · 로컬 review 빌드. 루트 및 프로젝트 접두사 경로. |
| 데스크톱 화면 폭 | 1024·1440px 메뉴, 1440px 상세/공지/채널. 기존 회귀 검사 포함. |
| 모바일 화면 폭 | 320·390·850px 메뉴, 390px 공지/표/채널. 기존 360·768px 검사 포함. |
| 확인한 빌드·콘텐츠·출력 검사와 로그 | [검사 기록](evidence/verification.json) · [화면 증거](implementation.ko.md#화면-증거) |
| 의료·운영 확인 근거 / review 상태 | 승인 갱신 없음. review/noindex. [production 차단](evidence/production-gate.json) |

## 1. 요구사항별 판정

검수 문장의 전체 내용과 작업 전 상태는 README의 동일 ID를 따른다. 아래 확인 항목과 README의 확인 방법을 함께 사용한다.

| ID | 확인 항목 | 작업 후 실제 결과 | 판정 | 확인일·확인자 | 증거·남은 문제 |
|---|---|---|---|---|---|
| NAV-01 | 데스크톱 주 메뉴에 위 8개 명칭이 정확한 순서로 나타난다. `공지사항`은 병원안내에 들어가지 않고 마지막 독립 주 메뉴다. | 데스크톱 메뉴 8개를 지정 순서로 출력. 공지사항이 마지막 독립 메뉴. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| NAV-02 | 모바일에서도 같은 8개 주 메뉴가 같은 순서로 나타나며 `공지사항`이 한 번만 표시된다. 기존 `전체 페이지` 같은 보조 링크는 주 메뉴와 구분해 유지할 수 있다. | 320·390·850px 메뉴 순서와 중복 없음 확인. 모바일의 별도 공지 추가 코드를 제거. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| NAV-03 | 각 메뉴에서 해당 내용을 바로 열 수 있다. 특히 `암환자 지지치료`는 기존 `/services/cancer-support/`, `공지사항`은 `/notices/`로 연결된다. | 기존 암환자 주소와 /notices/ 링크 유지, 1024·1440px 및 모바일 이동 확인. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| TERM-01 | 위 6개 페이지의 14곳을 문맥에 맞게 바꾸고 문장이 자연스러운지 읽었다. 특히 암환자 페이지 제목은 `암 의심 소견 및 암 치료 중 지지치료`로 맞춘다. | 6개 페이지 14개 필드를 목표 문구와 대조해 일치 확인. 제목·본문·FAQ와 진료 범위 보존. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| TERM-02 | 홈의 설명·안내 링크 2곳과 메뉴·진료분야 분류·검색 분류 3곳을 바꿨다. | 홈 2곳·메뉴/분류/검색 3곳을 지지치료로 변경. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| TERM-03 | 암환자 배너 ALT의 기존 표현 1곳을 바꿨다. | 배너 ALT를 암 치료 중 지지치료로 변경. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| TERM-04 | 암환자 배너의 **그림 안 글자**도 `암 치료 중 지지치료`로 일치한다. | 새 암환자 배너 그림 안의 암 치료 중 지지치료 확인. 외래 상담 장면으로 제작. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| TERM-05 | 최종 화면의 제목·본문·FAQ·관련글·목차·메뉴·검색 결과·검색 제목/설명 및 그 내용을 사용하는 구조화 데이터에 이전 표현이 남지 않는다. | 135경로의 HTML·공개 JSON/XML/TXT/JS 검색에서 이전 용어 0건. 비트맵 글자는 TERM-04에 기록. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| TERM-06 | `/services/cancer-support/`와 페이지 ID `cancer-support`를 유지하며 기존 내부 링크가 열린다. | cancer-support ID와 /services/cancer-support/ 주소를 보존. 내부 링크와 직접 접근 통과. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| TERM-07 | 명칭 교정 후에도 기존 항암치료팀과의 연계, 본원에서 가능한 증상 관리와 응급 의뢰의 설명이 같은 범위로 읽힌다. | 20곳의 정확한 용어 치환 외에 기존 항암치료·응급 의뢰 범위 문장은 변경하지 않음. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-01 | 목록에 `번호 · 제목 · 게시일 · 조회수`가 표시되고 각 값이 해당 글과 일치한다. | 번호·제목·게시일·조회수 4열 구현. 미집계 조회수는 —로 표시. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-02 | 제목의 일부와 태그로 각각 검색할 수 있다. | 제목·태그 검색, 여러 단어 조건, 결과 없음과 초기화 확인. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-03 | 공지 분류를 선택하면 해당 글만 나타난다. | 예방접종·지역 지원사업·감염병 예방 3분류와 전체 보기 구현. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-04 | 중요 공지가 목록 상단에 고정되고 일반 글과 구별된다. | 국가 인플루엔자 안내를 중요 공지로 지정하고 목록 상단에 고정. 선정 이유는 개발 기록에 보존. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-05 | 페이지 이동 시 빠짐·중복 없이 글을 볼 수 있고 검색·분류 결과에서도 페이지 수가 맞는다. | 실제 6편을 5개씩 2페이지로 제공. 누락·중복, 필터 후 페이지 초기화와 범위 보정 검사 통과. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-06 | 모바일에서 카드 또는 반응형 표로 번호·제목·날짜·조회수를 읽고 제목을 눌러 글을 열 수 있다. | 390px에서 4개 항목을 카드로 표시하고 상세 링크 접근. 문서 전체 가로 넘침 없음. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-07 | 6편이 각각 복사·공유·직접 열기 가능한 독립 상세 URL을 가진다. | 독립 상세 6경로 등록·렌더링·직접 접근·목록 복귀 확인. 등록되지 않은 notice-guide는 검사에서 거절. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-08 | 게시일·공식 자료 발표일·내용 확인일의 의미가 구분되고 실제 기록에 근거한다. | 최초 게시 9/28은 기존 배포 기록에 근거. 자료 발표일·내용 확인일과 구분. 독립 경로 개편일은 9/29. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-09 | 조회수는 원문 요구대로 데이터의 `views`를 표시하며 그 수치의 의미와 출처가 정해져 있다. | views=null은 —, 숫자는 실제 데이터 값으로 표시. 미집계 설명 제공. 브라우저별 가짜 누적값 없음. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-10 | 홈의 최근 공지 3개, 공지 목록·주제 링크가 해당 상세 글로 이어지며 기존 공지 앵커로 들어온 독자도 해당 글을 찾을 수 있다. | 홈 3편을 상세로 연결하고 예전 6개 앵커를 항상 표시되는 주제 링크에 보존. JS 없이도 6편 접근 가능. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-11 | 공지 6개 주제의 대상·조건·준비사항·출처가 목록 개편 과정에서 누락되지 않는다. | 6편의 문단·대상·조건·준비 안내·기간·기존 출처는 보존. 감염병 원문 15쪽 보강은 대기. | 부분 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| BOARD-12 | 기간이 지난 지원사업을 진행 중으로 오해하게 하지 않으며, 기준일 통계와 현재 지원사업을 구분한다. | 시작 예정·지원기간 안내·안내 기간 종료·기준일 자료 구분. 2027-05-01 시뮬레이션에서 종료 문구 확인. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| FLU-01 | 어린이·임신부·어르신 연령군 등 공식 자료에서 구분하는 대상별 시작일·종료일·확인사항이 **HTML 표**로 표시된다. | 어린이 2회/1회·임신부·75세 이상·70~74세·65~69세 총 6행 HTML 표 구현. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| FLU-02 | 모바일에서 표를 가로로 넘기거나 카드 형태로 읽을 수 있고 대상과 날짜의 관계가 유지된다. | 390px에서 표 영역만 가로 스크롤. 키보드 접근 가능한 영역과 좌우 이동 안내 제공. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| FLU-03 | 일정의 공식 출처와 실제 확인일이 글에 표시된다. | 예방접종도우미 대상별 일정과 9/16 변경 발표 대조. 실제 확인일 2026-09-29와 공식 링크 표시. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| FLU-04 | 글 제목·요약·본문·표가 같은 절기와 대상을 설명한다. 기존 `2026 성인 예방접종 일정표`를 이 절기별 지원 일정표로 오인하지 않게 구분한다. | 2026–2027절기 제목·본문·표 일치. 예방접종 페이지의 성인 백신별 기본표 보존. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| INF-01 | 글의 제목을 지정 문구와 정확히 맞추고 홈·목록·상세·검색 등 같은 글을 가리키는 위치에서도 제목이 일치한다. | 지정 제목을 원장·상세·목록·홈·검색·메타데이터에서 사용. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| INF-02 | 요청된 원문을 확인한 뒤 **1~15쪽의 총 15개 이미지**를 빠짐·중복 없이 순서대로 게시한다. | 요청된 15쪽 PDF 미확보. 기존 통계 PDF는 38쪽이며 요청 자료와의 동일성 미확인. 15개 이미지 미게시. | 미충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| INF-03 | 원문의 페이지 전체와 문구·수치·단위·표기·기준일을 보존하며 이미지가 잘리지 않는다. | 원문 전체 문구·수치·단위·잘림은 실제 15쪽 원본을 받아야 비교 가능. | 미충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| INF-04 | 각 페이지 이미지를 클릭하면 원본 크기로 볼 수 있다. | 페이지별 확대·원본 링크 표시 기능은 준비했으나 실제 원문 15개 클릭 확인은 불가. | 미충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| INF-05 | 원본 PDF 링크가 열리고 게시한 15쪽과 같은 원문임을 확인한다. | 기존 통계 PDF 링크는 보존. 요청된 15쪽 원본 PDF 링크는 아직 등록하지 못함. | 미충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| INF-06 | 임의 요약문이 원문 이미지를 대체하지 않는다. 보조 설명을 남기는 경우 원문과의 관계·기준일이 명확하고 수치·의미가 일치한다. | 현재 기존 통계 요약 유지. 원문을 받은 뒤 원문 이미지와 설명의 관계·수치 대조 필요. | 미충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| IMG-01 | 배너 12개와 안내도 5개를 고해상도 PNG로 새로 제작한다. | 사용자 정정에 따라 12개 배너·5개 안내도를 고해상도 PNG로 신규 제작. 생성 마스터와 공개 파일의 SHA-256·바이트 일치 확인. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| IMG-02 | 최종 화면이 `/assets/clinic-visuals-hq/*-hq-original.png`를 실제로 요청한다. | 17개 전부 지정 clinic-visuals-hq/*-hq-original.png로 요청. 루트와 /yt-top-webforai 접두사에서 HTTP 200·image/png·파일 해시 확인. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| IMG-03 | 17개가 원본 비율을 유지하고 글자·로고·도표를 자르지 않는다. | 17개 전체 그림·문구를 읽어 검수. 390·1440px에서 자연 비율·잘림 없음 확인. 안내도는 현재 HTML 문구와 대조. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| IMG-04 | 페이지와 확대 화면의 이미지 표시 폭이 해당 원본의 픽셀 폭을 넘지 않는다. | 17개 본문 표시 폭이 실제 PNG 픽셀 폭 이내. 확대창에도 동일 폭 상한 유지. 배너 1672px, 안내도 1086px 기준. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| IMG-05 | 대표 배너를 포함한 17개 모두 클릭하면 해당 원본 PNG를 볼 수 있다. | 12개 배너의 실제 새 창 열기와 5개 안내도의 확대·원본 링크 확인. 17개 PNG 모두 브라우저 이미지 응답. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| IMG-06 | ALT가 누락되지 않고 각 이미지의 실제 주제를 설명한다. | 17개 ALT·주제 대조. 암환자 지지치료와 신장질환 제목을 그림·ALT 모두에 반영. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| IMG-07 | 17개가 위의 정확한 페이지에 연결되고 불필요하게 중복되지 않는다. 기존 환자용 HTML 설명과 이미지의 대응도 읽어 확인한다. | 17개 지정 페이지 배치 확인. 4개 안내도 단계·9행 백신표가 HTML과 대응. 신장 제목과 숨참 그림 오류 교정. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| CHANNEL-01 | 홈의 `진료시간·오시는 길` 영역에 세 채널이 각각 알아볼 수 있는 카드로 표시된다. | 홈 진료시간·오시는 길 영역에 홈페이지·블로그·인스타그램 3개 카드. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| CHANNEL-02 | 전역 푸터에 세 채널 링크가 있다. | 한국어·5개 번역 언어 공통 푸터에 3개 채널. 번역 화면의 한국어 채널 묶음에 lang=ko 지정. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| CHANNEL-03 | 병원안내 `/about/`에도 세 채널이 안내된다. | 병원안내 /about/ 본문에 3개 카드. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| CHANNEL-04 | 외부 채널 링크는 새 창으로 열리고 `rel`에 `noopener noreferrer external`이 모두 적용된다. | 세 주소 모두 target=_blank, rel=noopener noreferrer external 확인. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| CHANNEL-05 | 기존 MedicalClinic/Organization의 `sameAs`에 세 주소를 중복 없이 병합한다. | 기존 신규 사이트 주소에 세 주소를 중복 없이 병합. https://yttop.co.kr/#clinic 식별자 보존. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| CHANNEL-06 | 기존 푸터의 단독 홈페이지 링크가 새 채널 영역 옆에서 중복되지 않고 같은 위치에 채널 묶음이 두 번 출력되지 않는다. | 이전 한국어 푸터의 단독 홈페이지 링크 제거. 요구 위치별 묶음은 각각 1회 출력. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| CHANNEL-07 | 세 링크가 실제 해당 채널로 연결되고 화면에 표시한 주소와 구조화 데이터의 주소가 일치한다. | 3개 주소 HTTP 200, 블로그·인스타그램 제목에서 영통탑내과 채널 확인. 링크와 sameAs 일치. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| SAFE-01 | 수원시 대상포진·경기도 학생 인플루엔자 두 글 모두, 본원이 해당 사업의 지정 참여기관인지 확인된 근거 없이 지원접종 가능을 단정하지 않는다. | 두 지역 지원사업의 참여 여부·예약 전화 확인 문장을 그대로 보존. 본원 지원접종 가능을 확정하지 않음. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| SAFE-02 | 출처·확인일·검토자 표시는 실제 근거와 일치한다. | 기존 출처·발표일 보존, 재확인한 인플루엔자만 확인일 변경. 실제 의료 검토자나 승인 기록 생성 없음. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| SAFE-03 | 기존 홈페이지의 휴진·진료 소식 공지 채널과 사례 원문 링크 접근이 유지된다. | 병원 기존 공지 /44와 사례 원문 25개 HTTP 200. URL 보존·자체 안내 6편만 추가. 폐기한 복제 템플릿 금지 유지. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| SAFE-04 | 의료·운영 검토가 완료되었다는 실제 근거가 생기기 전에는 `review/noindex`를 유지한다. | review/noindex 유지. production 검증은 현재 원고·범위·승인 상태 불일치로 차단됨을 확인. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [개발·검증 기록](implementation.ko.md) |
| VERIFY-01 | 변경한 콘텐츠에 대해 기존 콘텐츠 검사·정적 출력 검사·빌드가 통과한다. | 135경로·22자산의 콘텐츠 검사, 루트·프로젝트 경로 빌드·정적 출력 검사, 타입·린트·단위 82개·하네스 17개 통과. PNG 필수 검사 추가. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| VERIFY-02 | 데스크톱·모바일에서 메뉴, 게시판, 표, 원문 이미지, 원본 보기, 공식 채널을 직접 확인한다. | 메뉴·게시판·표·공식 채널·새 PNG 17개의 모바일·데스크톱·키보드·접근성 확인. 감염병 15쪽 원문만 미게시·미검증. | 부분 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| VERIFY-03 | 새로고침 후 실제 제공 파일이 최신 원본 PNG와 최신 콘텐츠인지 확인한다. | 캐시를 비활성화한 브라우저 요청으로 새 PNG 17개의 실제 로딩·크기를 확인. HTTP 바이트가 새 마스터 해시와 일치. 두 경로에서 재빌드·정적 검사 완료. 운영 배포·CDN 갱신은 미수행. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |
| VERIFY-04 | 변경 파일 목록, 작업 전후 결과, 실행한 검사, 남은 경고·확인 필요 사항을 결과 기록표에 남긴다. | 사용자 해석 정정, 17개 전후 파일·해시·픽셀 크기·프롬프트, 검사 결과와 감염병 PDF 잔여 항목을 별도 증거로 기록. | 충족 | 2026-09-29 · Codex(구현·기술 확인) | [PNG 재제작·검증](redrawn-images.ko.md) |

## 2. 용어 20곳 전후 대조

각 행은 소스에 남은 표현 한 곳이다. 화면에 여러 번 출력되는 경우 TERM-05로 추가 확인한다. 아래 목표 문장은 최소 치환안이며 최종 편집 문장이 달라지면 실제 결과에 이유를 남긴다.

| 번호 | 현재 위치 | 작업 전 원문 | 치환 목표 | 작업 후 실제 문구·판정·증거 |
|---|---|---|---|---|
| TXT-01 | content/pages.json · /about/ · /blocks/1/items/1 | 소화기: 담석·담낭염, 췌장염, 충수염 의심, 게실염, 급성 장염, 위궤양, 간질환, 염증성 장질환의 진단과 지지진료 | 소화기: 담석·담낭염, 췌장염, 충수염 의심, 게실염, 급성 장염, 위궤양, 간질환, 염증성 장질환의 진단과 지지치료 | 소화기: 담석·담낭염, 췌장염, 충수염 의심, 게실염, 급성 장염, 위궤양, 간질환, 염증성 장질환의 진단과 지지치료 · **충족** ([대조](evidence/comparison.json)) |
| TXT-02 | content/pages.json · /about/ · /blocks/1/items/4 | 암 관련 진료: 위·대장 병변의 내시경 조직검사, 암 의심 소견의 초기 평가와 정밀검사 의뢰, 항암치료 중 증상과 합병증의 지지진료 | 암 관련 진료: 위·대장 병변의 내시경 조직검사, 암 의심 소견의 초기 평가와 정밀검사 의뢰, 항암치료 중 증상과 합병증의 지지치료 | 암 관련 진료: 위·대장 병변의 내시경 조직검사, 암 의심 소견의 초기 평가와 정밀검사 의뢰, 항암치료 중 증상과 합병증의 지지치료 · **충족** ([대조](evidence/comparison.json)) |
| TXT-03 | content/pages.json · /conditions/ · /description | 심장·소화기·호흡기질환부터 예방접종, 만성질환 관리, 갑상선·경동맥·목 멍울, 신장질환과 암환자 지지진료까지 방문 목적에 맞는 안내를 선택하세요. | 심장·소화기·호흡기질환부터 예방접종, 만성질환 관리, 갑상선·경동맥·목 멍울, 신장질환과 암환자 지지치료까지 방문 목적에 맞는 안내를 선택하세요. | 심장·소화기·호흡기질환부터 예방접종, 만성질환 관리, 갑상선·경동맥·목 멍울, 신장질환과 암환자 지지치료까지 방문 목적에 맞는 안내를 선택하세요. · **충족** ([대조](evidence/comparison.json)) |
| TXT-04 | content/pages.json · /conditions/ · /intro | 심장·소화기·호흡기질환부터 예방접종, 만성질환 관리, 갑상선·경동맥·목 멍울, 신장질환과 암환자 지지진료까지 방문 목적에 맞는 안내를 선택하세요. | 심장·소화기·호흡기질환부터 예방접종, 만성질환 관리, 갑상선·경동맥·목 멍울, 신장질환과 암환자 지지치료까지 방문 목적에 맞는 안내를 선택하세요. | 심장·소화기·호흡기질환부터 예방접종, 만성질환 관리, 갑상선·경동맥·목 멍울, 신장질환과 암환자 지지치료까지 방문 목적에 맞는 안내를 선택하세요. · **충족** ([대조](evidence/comparison.json)) |
| TXT-05 | content/pages.json · /doctors/park-jongseol/ · /blocks/1/paragraphs/0 | 암과 관련해서는 위·대장내시경 조직검사가 필요한 병변을 진단하고, 초음파·흉부 X선·혈액검사에서 암이 의심되는 소견이 발견되면 필요한 정밀검사와 협력병원 진료를 안내합니다. 대학병원에서 암 치료 중인 환자에게는 발열, 감염 의심 증상, 구역·구토, 식사량 감소, 탈수, 백혈구·호중구 감소 등 치료 중 합병증을 평가하고 기존 치료팀과 연계한 지지진료를 시행합니다. | 암과 관련해서는 위·대장내시경 조직검사가 필요한 병변을 진단하고, 초음파·흉부 X선·혈액검사에서 암이 의심되는 소견이 발견되면 필요한 정밀검사와 협력병원 진료를 안내합니다. 대학병원에서 암 치료 중인 환자에게는 발열, 감염 의심 증상, 구역·구토, 식사량 감소, 탈수, 백혈구·호중구 감소 등 치료 중 합병증을 평가하고 기존 치료팀과 연계한 지지치료를 시행합니다. | 암과 관련해서는 위·대장내시경 조직검사가 필요한 병변을 진단하고, 초음파·흉부 X선·혈액검사에서 암이 의심되는 소견이 발견되면 필요한 정밀검사와 협력병원 진료를 안내합니다. 대학병원에서 암 치료 중인 환자에게는 발열, 감염 의심 증상, 구역·구토, 식사량 감소, 탈수, 백혈구·호중구 감소 등 치료 중 합병증을 평가하고 기존 치료팀과 연계한 지지치료를 시행합니다. · **충족** ([대조](evidence/comparison.json)) |
| TXT-06 | content/pages.json · /services/cancer-support/ · /title | 암 의심 소견 및 암 치료 중 지지진료 | 암 의심 소견 및 암 치료 중 지지치료 | 암 의심 소견 및 암 치료 중 지지치료 · **충족** ([대조](evidence/comparison.json)) |
| TXT-07 | content/pages.json · /services/cancer-support/ · /metaTitle | 암 의심 소견 및 암 치료 중 지지진료 \| 영통탑내과 | 암 의심 소견 및 암 치료 중 지지치료 \| 영통탑내과 | 암 의심 소견 및 암 치료 중 지지치료 \| 영통탑내과 · **충족** ([대조](evidence/comparison.json)) |
| TXT-08 | content/pages.json · /services/cancer-support/ · /description | 영통탑내과의 암 치료 중 구역·구토·탈수·설사·변비 평가와 지지진료, 조건에 따른 호중구 증가 주사, 케모포트 후버바늘 제거와 치료병원 연계를 안내합니다. | 영통탑내과의 암 치료 중 구역·구토·탈수·설사·변비 평가와 지지치료, 조건에 따른 호중구 증가 주사, 케모포트 후버바늘 제거와 치료병원 연계를 안내합니다. | 영통탑내과의 암 치료 중 구역·구토·탈수·설사·변비 평가와 지지치료, 조건에 따른 호중구 증가 주사, 케모포트 후버바늘 제거와 치료병원 연계를 안내합니다. · **충족** ([대조](evidence/comparison.json)) |
| TXT-09 | content/pages.json · /services/cancer-support/ · /intro | 영통탑내과는 암 치료 중 구역·구토, 섭취 저하, 탈수, 설사·변비, 감염 의심 증상을 평가하고 기존 치료팀과 연계해 지지진료를 시행합니다. 항암치료 계획 변경이나 입원이 필요한 상황은 치료병원으로 연결합니다. | 영통탑내과는 암 치료 중 구역·구토, 섭취 저하, 탈수, 설사·변비, 감염 의심 증상을 평가하고 기존 치료팀과 연계해 지지치료를 시행합니다. 항암치료 계획 변경이나 입원이 필요한 상황은 치료병원으로 연결합니다. | 영통탑내과는 암 치료 중 구역·구토, 섭취 저하, 탈수, 설사·변비, 감염 의심 증상을 평가하고 기존 치료팀과 연계해 지지치료를 시행합니다. 항암치료 계획 변경이나 입원이 필요한 상황은 치료병원으로 연결합니다. · **충족** ([대조](evidence/comparison.json)) |
| TXT-10 | content/pages.json · /services/cancer-support/ · /questions/0/answer | 아니요. 기존 암 치료팀의 항암치료를 이어가면서, 영통탑내과는 치료 사이의 구역·탈수·설사·발열 등 증상을 평가하고 지지진료를 합니다. 항암치료 계획 변경이나 입원이 필요한 상태는 치료병원으로 연결합니다. | 아니요. 기존 암 치료팀의 항암치료를 이어가면서, 영통탑내과는 치료 사이의 구역·탈수·설사·발열 등 증상을 평가하고 지지치료를 합니다. 항암치료 계획 변경이나 입원이 필요한 상태는 치료병원으로 연결합니다. | 아니요. 기존 암 치료팀의 항암치료를 이어가면서, 영통탑내과는 치료 사이의 구역·탈수·설사·발열 등 증상을 평가하고 지지치료를 합니다. 항암치료 계획 변경이나 입원이 필요한 상태는 치료병원으로 연결합니다. · **충족** ([대조](evidence/comparison.json)) |
| TXT-11 | content/pages.json · /health/cancer-treatment-symptoms/ · /intro | 암 치료 중 발열·새 호흡곤란·혈변·의식 변화는 기존 치료팀이나 응급실 평가를 서둘러야 합니다. 위험 신호가 없는 경한 구역·섭취 저하·변비 등은 영통탑내과에서 원인을 평가하고 기존 치료팀과 연계해 지지진료를 받을 수 있습니다. | 암 치료 중 발열·새 호흡곤란·혈변·의식 변화는 기존 치료팀이나 응급실 평가를 서둘러야 합니다. 위험 신호가 없는 경한 구역·섭취 저하·변비 등은 영통탑내과에서 원인을 평가하고 기존 치료팀과 연계해 지지치료를 받을 수 있습니다. | 암 치료 중 발열·새 호흡곤란·혈변·의식 변화는 기존 치료팀이나 응급실 평가를 서둘러야 합니다. 위험 신호가 없는 경한 구역·섭취 저하·변비 등은 영통탑내과에서 원인을 평가하고 기존 치료팀과 연계해 지지치료를 받을 수 있습니다. · **충족** ([대조](evidence/comparison.json)) |
| TXT-12 | content/pages.json · /health/cancer-treatment-symptoms/ · /blocks/21/heading | 영통탑내과에서 가능한 암환자 지지진료 | 영통탑내과에서 가능한 암환자 지지치료 | 영통탑내과에서 가능한 암환자 지지치료 · **충족** ([대조](evidence/comparison.json)) |
| TXT-13 | content/pages.json · /health/cancer-treatment-symptoms/ · /blocks/21/text | 영통탑내과에서는 환자의 상태에 따라 다음과 같은 평가와 지지진료를 시행합니다. | 영통탑내과에서는 환자의 상태에 따라 다음과 같은 평가와 지지치료를 시행합니다. | 영통탑내과에서는 환자의 상태에 따라 다음과 같은 평가와 지지치료를 시행합니다. · **충족** ([대조](evidence/comparison.json)) |
| TXT-14 | content/pages.json · /conditions/digestive/bowel-appendix/ · /blocks/1/text | 증상에 따라 혈액검사, 장관초음파와 대장내시경을 선택하고 필요한 조직검사·용종절제를 시행합니다. 궤양성 대장염과 크론병의 진단·경과 평가와 증상 지지진료를 하며, 생물학적 제제 등 전문 치료는 상급병원으로 연계합니다. | 증상에 따라 혈액검사, 장관초음파와 대장내시경을 선택하고 필요한 조직검사·용종절제를 시행합니다. 궤양성 대장염과 크론병의 진단·경과 평가와 증상 지지치료를 하며, 생물학적 제제 등 전문 치료는 상급병원으로 연계합니다. | 증상에 따라 혈액검사, 장관초음파와 대장내시경을 선택하고 필요한 조직검사·용종절제를 시행합니다. 궤양성 대장염과 크론병의 진단·경과 평가와 증상 지지치료를 하며, 생물학적 제제 등 전문 치료는 상급병원으로 연계합니다. · **충족** ([대조](evidence/comparison.json)) |
| TXT-15 | web/src/lib/information-architecture.mjs:36 | ['cancer-support', '암환자 지지진료'], | ['cancer-support', '암환자 지지치료'], | ['cancer-support', '암환자 지지치료'], · **충족** ([대조](evidence/comparison.json)) |
| TXT-16 | web/src/lib/information-architecture.mjs:74 | { title: '암 의심 소견 및 암 치료 중 지지진료', ids: ['cancer-support'] }, | { title: '암 의심 소견 및 암 치료 중 지지치료', ids: ['cancer-support'] }, | { title: '암 의심 소견 및 암 치료 중 지지치료', ids: ['cancer-support'] }, · **충족** ([대조](evidence/comparison.json)) |
| TXT-17 | web/src/lib/search-model.mjs:10 | 'cancer-support': '암환자 지지진료', | 'cancer-support': '암환자 지지치료', | 'cancer-support': '암환자 지지치료', · **충족** ([대조](evidence/comparison.json)) |
| TXT-18 | web/src/components/content.tsx:265 | 치료 중 증상과 최근 치료·검사 정보를 바탕으로 가까운 내과에서 가능한 지지진료와 기존 | 치료 중 증상과 최근 치료·검사 정보를 바탕으로 가까운 내과에서 가능한 지지치료와 기존 | 치료 중 증상과 최근 치료·검사 정보를 바탕으로 가까운 내과에서 가능한 지지치료와 기존 · **충족** ([대조](evidence/comparison.json)) |
| TXT-19 | web/src/components/content.tsx:269 | 암환자 지지진료 안내 <ArrowRight size={18} /> | 암환자 지지치료 안내 <ArrowRight size={18} /> | 암환자 지지치료 안내 <ArrowRight size={18} /> · **충족** ([대조](evidence/comparison.json)) |
| TXT-20 | content/visuals.json:41 | "alt": "암 치료 중 지지진료: 발열·피로·구역·백혈구 감소 대응" | "alt": "암 치료 중 지지치료: 발열·피로·구역·백혈구 감소 대응" | "alt": "암 치료 중 지지치료: 발열·피로·구역·백혈구 감소 대응" · **충족** ([대조](evidence/comparison.json)) |

별도 육안 확인: `ASSET-08` 새 암환자 배너의 그림 안 글자는 **암 치료 중 지지치료**다. 외래 상담 장면과 전체 글자를 확인했다. [새 PNG](../../web/public/assets/clinic-visuals-hq/banner-cancer-support-hq-original.png).

## 3. 공지 6편 전후 대조

BOARD-07~12, FLU, INF, SAFE-01~02와 함께 사용한다. 원자료 발표일과 실제 게시일을 구분하고 출처를 기록한다.

| 공지 ID | 작업 전 제목 | 작업 전 접근 | 작업 후 제목·독립 상세 URL | 날짜·출처·조건·홈/목록 연결 확인 | 판정·증거 |
|---|---|---|---|---|---|
| `notice-2026-hpv-national` | 2026년 HPV 국가예방접종 지원 대상과 일정 | `/notices/#notice-2026-hpv-national` | 2026년 HPV 국가예방접종 지원 대상과 일정 · `/notices/2026-hpv/` | 최초 게시 2026-09-28 · 내용 확인 2026-09-28 · 출처/본문 보존 · 홈/목록 연결 | 충족 · [대조](evidence/comparison.json) |
| `notice-2026-pneumococcal-65plus` | 2026년 65세 이상 폐렴구균 국가예방접종 | `/notices/#notice-2026-pneumococcal-65plus` | 2026년 65세 이상 폐렴구균 국가예방접종 · `/notices/2026-pneumococcal/` | 최초 게시 2026-09-28 · 내용 확인 2026-09-28 · 출처/본문 보존 · 홈/목록 연결 | 충족 · [대조](evidence/comparison.json) |
| `notice-2026-2027-national-influenza` | 2026–2027절기 인플루엔자 국가예방접종 일정 | `/notices/#notice-2026-2027-national-influenza` | 2026–2027절기 인플루엔자 국가예방접종 일정 · `/notices/2026-2027-influenza/` | 최초 게시 2026-09-28 · 내용 확인 2026-09-29 · 출처/본문 보존 · 홈/목록 연결 | 충족 · [대조](evidence/comparison.json) |
| `notice-2026-suwon-shingles-support` | 2026년 수원시 대상포진 예방접종 비용지원 | `/notices/#notice-2026-suwon-shingles-support` | 2026년 수원시 대상포진 예방접종 비용지원 · `/notices/2026-suwon-shingles/` | 최초 게시 2026-09-28 · 내용 확인 2026-09-28 · 출처/본문 보존 · 홈/목록 연결 | 충족 · [대조](evidence/comparison.json) |
| `notice-2026-gyeonggi-student-influenza` | 2026년 경기도 중·고등학생 인플루엔자 지원 | `/notices/#notice-2026-gyeonggi-student-influenza` | 2026년 경기도 중·고등학생 인플루엔자 지원 · `/notices/2026-gyeonggi-student-influenza/` | 최초 게시 2026-09-28 · 내용 확인 2026-09-28 · 출처/본문 보존 · 홈/목록 연결 | 충족 · [대조](evidence/comparison.json) |
| `notice-2026-09-17-infection-guide` | 9월 17일 감염병 자료와 가족 예방 안내 | `/notices/#notice-2026-09-17-infection-guide` | 질병관리청 최신 데이터(9.17 기준)로 보는 우리 가족 감염병 예방 가이드 · `/notices/2026-09-17-infection-guide/` | 최초 게시 2026-09-28 · 내용 확인 2026-09-28 · 출처/본문 보존 · 홈/목록 연결 | 상세 경로·제목 충족 / 원문 15쪽 대기 · [대조](evidence/comparison.json) |

## 4. 이미지 17개 전후 대조

IMG-01~07을 **모든 행**에서 확인한다. 원본 파일과 최종 PNG가 같은 자료인지, 실제 요청 주소, 자연 크기와 표시 크기, 비율·잘림, 원본 열기, ALT, 게시 위치를 증거에 남긴다. 감염병 PDF 15쪽은 다음 표에서 별도로 확인한다.

| 검수 번호·자산 | 게시 위치 | 작업 전 파일·크기 | 작업 후 원본 근거·PNG 주소·크기 | 비율/잘림·표시 폭·원본 열기·ALT·배치 | 판정·증거 |
|---|---|---|---|---|---|
| ASSET-01 · `banner-heart` | `/conditions/heart-disease/` | `/assets/banner-heart.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-heart-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-02 · `banner-digestive` | `/conditions/digestive/` | `/assets/banner-digestive.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-digestive-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-03 · `banner-respiratory` | `/conditions/respiratory-infections/` | `/assets/banner-respiratory.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-respiratory-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-04 · `banner-vaccinations` | `/services/vaccinations/` | `/assets/banner-vaccinations.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-vaccinations-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-05 · `banner-chronic` | `/conditions/chronic-disease/` | `/assets/banner-chronic.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-chronic-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-06 · `banner-neck` | `/conditions/thyroid-carotid-neck/` | `/assets/banner-neck.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-neck-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-07 · `banner-kidney` | `/conditions/kidney/` | `/assets/banner-kidney.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-kidney-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-08 · `banner-cancer-support` | `/services/cancer-support/` | `/assets/banner-cancer-support.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-cancer-support-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-09 · `banner-services` | `/services/` | `/assets/banner-services.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-services-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-10 · `banner-checkups` | `/checkups/` | `/assets/banner-checkups.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-checkups-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-11 · `banner-symptoms` | `/symptoms/` | `/assets/banner-symptoms.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-symptoms-hq-original.png) · 1672×941 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-12 · `banner-diseases` | `/diseases/` | `/assets/banner-diseases.webp` · 400×225 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/banner-diseases-hq-original.png) · 1672×940 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-13 · `diagram-heart-flow` | `/services/heart/` | `/assets/diagram-heart-flow.webp` · 280×300 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/diagram-heart-flow-hq-original.png) · 1086×1448 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-14 · `diagram-endoscopy-preparation` | `/services/endoscopy/` | `/assets/diagram-endoscopy-preparation.webp` · 280×300 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/diagram-endoscopy-preparation-hq-original.png) · 1086×1448 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-15 · `diagram-after-endoscopy` | `/health/after-endoscopy/` | `/assets/diagram-after-endoscopy.webp` · 280×300 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/diagram-after-endoscopy-hq-original.png) · 1086×1448 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-16 · `diagram-checkup-flow` | `/checkups/` | `/assets/diagram-checkup-flow.webp` · 280×300 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/diagram-checkup-flow-hq-original.png) · 1086×1448 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |
| ASSET-17 · `vaccination-schedule-2026` | `/services/vaccinations/` | `/assets/vaccination-schedule-2026.webp` · 240×300 | 신규 제작 [PNG](../../web/public/assets/clinic-visuals-hq/vaccination-schedule-2026-hq-original.png) · 1086×1448 · 마스터 해시 일치 | 390·1440px 비율·폭·열기·ALT·배치 확인 | **충족** · [증거](redrawn-images.ko.md) |

## 5. 감염병 원문 15쪽 전수 확인

요청된 15쪽 원문은 **미확보**. 기존 `PHWR_Supple_19-36.pdf`는 pdfinfo로 **38쪽** 확인했으며 요청 문서를 대신하지 않는다. 15쪽 순차 표시·확대·PDF 기능과 검사는 준비했으나 실제 원문은 미게시. [파일 식별 근거](implementation.ko.md#원본-자료가-필요한-작업).

| 원문 쪽 | 작업 전 | 작업 후 이미지 주소 | 원문과 순서·전체 내용·표기 일치 | 잘림 없음·원본 보기·PDF 대응 | 판정·증거 |
|---|---|---|---|---|---|
| PDF-01 · 1쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-02 · 2쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-03 · 3쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-04 · 4쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-05 · 5쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-06 · 6쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-07 · 7쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-08 · 8쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-09 · 9쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-10 · 10쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-11 · 11쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-12 · 12쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-13 · 13쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-14 · 14쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |
| PDF-15 · 15쪽 | 페이지 이미지 미게시 | 미게시 | 요청 원문 미확보 | 기존 링크는 별도 38쪽 통계 PDF | **확인 필요** |

## 6. 공식 채널 3개 배치 확인

각 셀에 확인일과 화면·HTML 또는 링크 확인 근거를 기록한다. 아래 주소는 2026-09-29 실제 HTTP 응답과 채널 제목을 확인했다. [HTTP 기록](evidence/channels.json).

| 채널·주소 | 홈 카드 | 전역 푸터 | 병원안내 | sameAs·기존 값 보존 | 새 창·rel·실제 도착지·중복 | 판정·증거 |
|---|---|---|---|---|---|---|
| 홈페이지 · `https://yttop.co.kr/` | 3개 카드 중 해당 링크 확인 | 한국어·번역 푸터 확인 | 본문 카드 확인 | 기존 신규 사이트 URL·clinic ID 보존 | 새 창·rel·HTTP 200·중복 없음 | **충족**, 2026-09-29 · [응답](evidence/channel-destinations.json) |
| 네이버 블로그 · `https://blog.naver.com/goytt2022` | 3개 카드 중 해당 링크 확인 | 한국어·번역 푸터 확인 | 본문 카드 확인 | 기존 신규 사이트 URL·clinic ID 보존 | 새 창·rel·HTTP 200·중복 없음 | **충족**, 2026-09-29 · [응답](evidence/channel-destinations.json) |
| 인스타그램 · `https://www.instagram.com/yttopim` | 3개 카드 중 해당 링크 확인 | 한국어·번역 푸터 확인 | 본문 카드 확인 | 기존 신규 사이트 URL·clinic ID 보존 | 새 창·rel·HTTP 200·중복 없음 | **충족**, 2026-09-29 · [응답](evidence/channel-destinations.json) |

## 7. 편집 결정과 남은 문제

| 항목 | 실제 결정·확인 내용 | 상태 |
|---|---|---|
| 분류·태그·중요 공지 | 3분류, 주제·대상·지역 태그, 국가 인플루엔자 상단 고정 | 반영 |
| 게시일·조회수 | 최초 게시 9/28은 배포 기록 근거. views=null은 미집계 —로 표시 | 반영 |
| 인플루엔자 공식 일정 | 9/29 공식 대상별 날짜 확인, HTML 6행 | 반영 |
| 감염병 원문 | 기존 통계 PDF 38쪽. 요청된 15쪽 자료와의 동일성 미확인 | 자료 필요 |
| PNG 17개 | 사용자 정정에 따라 고해상도 신규 제작·바이트 그대로 반영 | 완료 |
| 암환자 이미지 용어 | 그림 안 지지치료 교정·외래 상담 장면 확인 | 완료 |
| 신장 배너 | 콩팥 그림과 신장질환 제목 일치 | 완료 |
| 지역사업 참여 | 기존 문의 문구 보존, 참여를 단정하지 않음 | 내용 기준 충족 |

세부 근거·날짜·출처·구현 위치는 [개발 결과](implementation.ko.md)에 기록했다.

## 8. 최종 보고

- **충족 47개:** 새 PNG 17개와 배너 내부 용어, 로컬 최신 파일 확인까지 반영했다.
- **부분 충족 2개:** BOARD-11, VERIFY-02. 감염병 원문 15쪽 게시·화면 검증이 남아 있다.
- **미충족 5개:** INF-02~06. 요청은 특정 15쪽 PDF의 원문 보존이며, 현재 연결된 통계 PDF는 38쪽이다. 신규 안내문을 임의 제작해 기존 원문으로 표시하지 않는다.
- PNG/PDF 응답 형식과 PNG 무결성·용량·필수 경로 검사를 보완했다. `verify:plan`은 새 PNG 17개를 확인하고 감염병 항목만 미완료로 보고한다.
- 실제 파일·검사·화면과 변경 내역은 [재제작 기록](redrawn-images.ko.md), [증거 목록](redraw-evidence/verification.json)에 있다.
- 운영 배포·의료 승인·검색 공개는 수행하지 않았다. 현재 출력은 review/noindex다.
