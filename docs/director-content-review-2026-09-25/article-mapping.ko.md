# 원장님 원고 46편의 현재 사이트 대응표

2026-09-25. 내부 편집·개발 계획. [종합 검토](README.ko.md)의 권고 범위를 구체화한다. 경로는 사이트 기준이며 **신규 경로는 아직 구현되지 않은 제안**이다. 원문 번호·제목·행 위치는 [evidence.json](evidence.json)의 `sourceArticles`에서 확인할 수 있다.

우선순위: P0 공통 사실·운영 충돌 정리, P1 핵심 진료·준비 안내, P2 심화 설명, L 번역판. P1도 약물·제도 등 근거를 정리한 뒤 게시한다. “기존”은 해당 주제의 페이지가 있다는 뜻이며 원고 내용이 이미 충분히 반영됐다는 뜻이 아니다.

| 번호 | 원고 주제 | 현재와 다른 핵심 | 권고 반영 위치 | 조치·우선순위 |
|---:|---|---|---|---|
| 1 | 병원 소개 | 진료철학·609호·토요일 점심·지하주차·예약 정책 구체화 | 기존 `/`, `/about/`, `/visit/` | 소개 재작성·공통 데이터 변경 / P0 |
| 2 | 박종설 원장 | 임상교수 기관명·현/전 직책 차이, 내시경·초음파 자격 추가 | 기존 `/doctors/park-jongseol/`, `/doctors/` | 프로필 원장 수정·진료 설명 보강 / P0 |
| 3 | 전체 진료 분야 | 증상·검사·치료·의뢰의 실제 범위 확대 | 기존 `/services/`, `/conditions/` 및 분야 페이지 | 분야별로 분배·공통 개요 / P1 |
| 4 | 검사·장비 | 원내 신속검사·위탁·장비·미시행 검사·결과시간 제시 | 신규 `/services/examinations/` | 검사별 시행 위치·조건 표 / P1 |
| 5 | 응급 전원 원칙 | 일반 위험 안내에서 증상별 전원·제공자료까지 확장 | 기존 `/conditions/acute-care/`, 관련 심장·암·복통 페이지 | 공통 원칙+해당 페이지의 위험 안내 / P1 |
| 6 | 심장검사 순서 | 기존 검사 목록에 진료 흐름·72시간·Troponin I를 더함 | 기존 `/services/heart/`, `/services/heart/cardiac-markers/` | 검사 선택 과정·실제 검사 보강 / P1 |
| 7 | 심전도·홀터·초음파 차이 | 일반 차이에 구체적 시행기간·준비·예시 추가 | 기존 `/health/heart-test-differences/`, `/services/heart/holter/` | 기존 글 개선, 중복 글 신설 불필요 / P1 |
| 8 | 국가검진 과정 | 당일접수·예약 구분·시간·검사단계·복약·여성 준비 | 기존 `/checkups/national/`, `/health/checkup-preparation-checklist/` | 실제 절차와 준비 표 / P1 |
| 9 | 국가암검진 | 원내 시행 5종과 폐암검진 미시행 명확화 | 기존 `/checkups/cancer-screening/` | 검사별 대상·절차·준비. 대장암 분변검사 경로 보존 / P1 |
| 10 | 채용·공무원·비자 전체 | 발급기간·공무원 제도·비자 종류 추가 | 기존 `/checkups/`, `/checkups/employment/`, `/checkups/visa/`; 신규 `/checkups/civil-service/` | 개요와 세부 페이지로 분배, 37–40과 중복 통합 / P1 |
| 11 | 초음파 준비 | 검사별 금식·방광·복장과 세침검사 미시행 추가 | 기존 `/services/ultrasound/`, `/services/ultrasound/abdomen/`, `/services/ultrasound/thyroid/`, `/services/heart/carotid-ultrasound/`, `/services/heart/echocardiography/` | 부위별 준비·복합검사 개별 안내 / P1 |
| 12 | 위내시경 준비 | 약 계열·보호자·귀가·식사·위험 증상 구체화 | 기존 `/services/endoscopy/gastroscopy/` | 준비와 퇴실 안내 확대 / P1 |
| 13 | 대장내시경 준비·회복 | 오라팡·플렌뷰·식이·복약·용종절제 후 관리 | 기존 `/services/endoscopy/colonoscopy/`, `/health/colonoscopy-preparation-questions/`; 신규 제품별·시술 후 안내 | 32·33·36과 합쳐 기준 원고 1개씩 유지 / P1 |
| 14 | 가슴통증 검사 | 위험 감별·Troponin I 약 20분·초기 정상 한계 | 기존 `/conditions/heart-disease/`, `/services/heart/cardiac-markers/` | 심장 증상 평가 중심으로 기존 페이지 보강 / P1 |
| 15 | 정상 심전도와 부정맥 | 원인 설명·72시간·추가검사·스마트워치·위험 신호 | 기존 `/health/palpitations-test-followup/`, `/services/heart/holter/` | 첫 검사 정상부터 후속 진료까지 설명 확대 / P1 |
| 16 | 판막 역류와 수술 | 현재 초음파 설명에 없는 치료·추적 판단 | 신규 `/health/heart-valve-regurgitation/` | 초음파·심장질환 안내와 연결 / P2 |
| 17 | 협심증과 스텐트 | 안정형·급성 구분, 약물·시술 선택, 의원 역할 | 신규 `/health/angina-treatment/` | 응급 판단의 시간 오해 교정·의뢰 범위 명확화 / P2 |
| 18 | 암환자 지지진료 | 기존 범위 문의에 실제 처치·치료팀 연계 제공 | 기존 `/services/cancer-support/` | 서비스 페이지 대폭 보강, 42와 역할 구분 / P1 |
| 19 | 항암 중 38도 발열 | 행동 중심 독립 안내 없음 | 신규 `/health/fever-during-cancer-treatment/` | 치료팀 연락·긴급 기준을 최상단에 / P1 |
| 20 | 급성 복통 | 초음파 활용·한계·CT 의뢰·수술 위험 설명 | 신규 `/conditions/abdominal-pain/`; 기존 `/services/ultrasound/bowel/`, `/services/ultrasound/abdomen/` | 증상 안내 신설, 검사 페이지와 연결 / P1 |
| 21 | 호흡기·결핵·백신 | 기존 기침 진료보다 구체적 검사·질환·치료 범위 | 신규 `/conditions/respiratory-infections/`, `/services/vaccinations/`; 기존 `/conditions/chronic-cough/`, `/checkups/tuberculosis/` | 호흡기 진료·서류·접종을 분리 / P1 |
| 22 | 고지혈증 약 | 약 시작·장기복용·부작용 설명 없음 | 신규 `/conditions/chronic-disease/` | 원고 23과 통합하고 지질약 설명을 독립 절로 / P2 |
| 23 | 생활습관과 만성질환약 | 약과 생활관리의 병행·재평가 설명 없음 | 신규 `/conditions/chronic-disease/` | 혈압·당뇨·지질 관리 허브 / P2 |
| 24 | 담석과 수술 | 복부초음파 일반 안내 외 치료 판단 부족 | 신규 `/health/gallstones/` | 복통·초음파·외과 의뢰 연결 / P2 |
| 25 | 심장 가족력·약·추적 | 기존 증상 안내에 가족력과 추적 판단 추가 | 기존 `/conditions/heart-disease/`, `/health/palpitations-test-followup/`; 신규 판막 안내 | 질문별 해당 절에 배치, 종합 FAQ 새 글은 생략 / P2 |
| 26 | 폐렴구균·대상포진 | 예방접종 전문 안내 없음 | 신규 `/services/vaccinations/` | 46과 통합, 접종력·면역상태 조건 / P1 |
| 27 | 암 가족력 | 검진 일반 설명에 없는 위험별 상담 | 신규 `/health/cancer-family-history/`; 기존 `/checkups/cancer-screening/` 연결 | 가족력 자료·검진·유전상담 의뢰 설명 / P2 |
| 28 | 반복되는 간수치 상승 | 원인 평가·B형간염 처방과 추적 설명 부족 | 신규 `/conditions/liver-disease/` | 복부초음파·검진 이상 후 진료 연결 / P2 |
| 29 | 대장용종 추적 | 기존 검사·결과 문의 외 추적 결정 설명 부족 | 신규 `/health/colon-polyp-followup/` | 개수·크기·병리·정결·완전절제 기준 / P2 |
| 30 | 갑상선암 적극적 관찰 | 초음파 안내 외 치료 선택 설명 없음 | 신규 `/health/thyroid-cancer-surveillance/`; 기존 `/services/ultrasound/thyroid/` | 저위험군 조건·협력병원 역할 보존 / P2 |
| 31 | 위고비·마운자로 | 해당 약물 상담 설명 없음 | 신규 `/health/obesity-medication/` | 국내 제품별 허가·부작용·비만 진료 기준 / P2 |
| 32 | 오라팡 | 제품별 안내 없음 | 신규 `/health/orafang-preparation/` | 13의 같은 내용 통합, 국내 제품·병원 안내 대조 / P1 |
| 33 | 플렌뷰 | 제품별 안내 없음 | 신규 `/health/plenvu-preparation/` | 13과 통합, 용해량·추가 수분·출처 정리 / P1 |
| 34 | 보호자 동행 | 기존은 동행 필요 여부 문의 중심 | 기존 `/services/endoscopy/gastroscopy/`, `/services/endoscopy/colonoscopy/`, `/health/colonoscopy-preparation-questions/` | 병원의 동행 원칙을 공통 반영 / P1 |
| 35 | 검진 전 복약 | 일반적인 개별 문의에서 계열별 안내로 확장 | 기존 `/health/checkup-preparation-checklist/`, `/checkups/national/` | 8·12의 중복 복약 설명 통합 / P1 |
| 36 | 조직검사·용종절제 후 | 시술별 회복·지연출혈·약 재개 상세 부족 | 신규 `/health/after-endoscopy/` | 13과 통합, 시술 구분과 적용 시간 정리 / P1 |
| 37 | E-2·F-2·H-2 | 비자 종류·여권·발급 2–3일·진행절차 | 기존 `/checkups/visa/` | 지정기관·제출처 인정 조건 보존 / P1 |
| 38 | 비자 결핵진단서 | 현재 결핵 페이지 제목·설명이 기숙사 중심 | 기존 `/checkups/tuberculosis/`, `/checkups/visa/` | 기존 결핵 URL 유지, 제목·본문을 기숙사·비자 목적에 맞게 확대 / P1 |
| 39 | 일반 채용검진 | 접수·양식·평일/휴일 발급기간 구체화 | 기존 `/checkups/employment/`, `/fees/` | 10과 통합, 특수건강진단과 구분 / P1 |
| 40 | 공무원 채용·마약 6종 | 공무원 별도 안내 없음, 마약검사 페이지는 항목 문의 중심 | 신규 `/checkups/civil-service/`; 기존 `/checkups/drug-screening/` | 제도·선별/확인검사·복용약 안내 보강 / P1 |
| 41 | 6개 언어 비자 안내 | 한국어 단일 사이트 | 기존 `/checkups/visa/`와 `/en/checkups/visa/`, `/zh-hans/checkups/visa/`, `/th/checkups/visa/`, `/ru/checkups/visa/`, `/ne/checkups/visa/` 신규 | 외국어 5개, 대응 번역·언어 metadata·hreflang / L |
| 42 | 항암 중 증상별 대처 | 상세한 합병증·치료약별 위험·증상 대응 없음 | 신규 `/health/cancer-treatment-symptoms/`; 기존 `/services/cancer-support/` 연결 | 증상 목차·치료팀 연락·자료 준비, 18·19와 반복 축소 / P1 |
| 43 | 독감 예방접종 | 연례 접종·고위험군·접종 후 감염 설명 없음 | 신규 `/services/vaccinations/`; 신규 `/conditions/influenza/` 연결 | 예방접종 페이지의 충분한 본문·고유 앵커 / P1 |
| 44 | 독감 진단·치료 | 진단검사·경구/주사 치료·합병증 안내 없음 | 신규 `/conditions/influenza/` | 원내 신속검사와 일반 PCR 설명 구분 / P1 |
| 45 | 코로나·팍스로비드 | 고위험군 진료·상호작용·안전평가 설명 없음 | 신규 `/conditions/covid-19/` | 국내 기준 확인, 법적 요건과 병원 원칙 분리 / P1 |
| 46 | 성인 예방접종 일정 | 접종 일정·기저질환별 안내 없음 | 신규 `/services/vaccinations/` | 26·43과 통합, 국내 권고·접종 제품·시행 범위 구분 / P1 |

## 번호 없는 부속 내용의 처리

| 원문 부분 | 반영 방법 |
|---|---|
| 병원 공통 안내 | 주소·전화·시간은 공통 사실 데이터에서 생성. 모든 글에 긴 동일 문구를 복사하지 않음 |
| 의학정보 안전 안내 | 해당 증상·검사 문맥에 필요한 한계와 행동을 유지. 응급 안내를 하단에만 두지 않음 |
| 심장검사 취소·재예약 | 방문·예약 안내와 관련 검사 페이지에 배치. 무관한 건강정보의 반복 바닥글로 사용하지 않음 |
| 건강진단서 공통 안내 | 제출 양식·본인확인·수령 조건의 공통 원장으로 관리 |
| 4개월 게시 순서 | 내부 블로그 운영계획. 환자용 별도 페이지는 만들지 않음 |
| 참고자료 34항목 | 주장별 출처로 대응. 동일 자료 중복·기관 홈 링크·미제공 파일·연도·해외 자료를 정리 |

원고의 “자주 묻는 질문”은 실제 질문 빈도 통계가 제시된 자료가 아니다. 환자에게 유용한 질문은 반영하되 질문 횟수·검색량·인기 순위를 새로 주장하지 않는다.
