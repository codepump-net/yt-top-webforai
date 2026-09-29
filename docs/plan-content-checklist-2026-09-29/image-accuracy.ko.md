# 생성 이미지 17개 정확성 검토와 수정 결과

**후속 완료 기록:** [공식 자료 16쪽 적용·자료 부족 해결](infection-resolution.ko.md). 사용자 후속 지시에 따른 대체 기준으로 현재 체크리스트는 54/0/0이다. 아래 원문 인용·이전 시점의 판단과 이미지 검수 이력은 보존한다.

검토일: 2026-09-29. 검토자: Codex(원고·그림 대조 및 기술 검사). **17개 전수 확인, 4개 수정·재생성, 나머지 13개는 이번 대조에서 명확한 오탈자·설명 누락을 발견하지 못했다.** 로컬 review 출력에 반영했으며 운영 배포는 수행하지 않았다.

## 1. 확인 방법과 판정 범위

- 실제 사이트에 연결된 PNG 17개를 원본 크기로 열어 제목·작은 설명·단계·표·그림을 확인했다.
- Apple Vision 한국어·영어 OCR로 전체 문자를 추출하고, `content/visuals.json` 및 `content/pages.json` 원고와 대조했다. 표는 9행·4열 및 하단 안내 두 문단을 확인했다.
- OCR 의심 문자는 이미지로 다시 확인했다. 예를 들어 OCR의 `신정질환`, `외국인동록증`, `항채`, `톡히`는 실제 그림의 `신장질환`, `외국인등록증`, `항체`, `특히`를 잘못 읽은 경우였다. OCR 신뢰도는 내용의 정확도 점수가 아니다.
- 장비 모양·혈압 측정 장면·예방접종 조건은 아래 공식 자료와 대조했다. 안내도의 원내 검사 시간·서류 발급기간은 현재 원고와의 일치를 확인했으며 실제 운영 시간을 새로 확정하지 않았다.
- 수정한 그림은 내장 `image_gen`으로 재생성했다. 생성 PNG를 확대·잘라내기·재압축하지 않고 마스터와 공개 폴더에 동일하게 복사했다.

이 결과를 **의료진 승인 또는 의학적 정확도 100%**로 해석하지 않는다. 임상적 사용 조건과 남은 확인 사항은 4절에 명시한다.

## 2. 발견 사항과 작업 전후

| 이미지 / 위치 | 수정 전 | 수정 후 | 근거 |
|---|---|---|---|
| 검사·시술 배너 | 홀터와 24시간 혈압 아이콘이 모두 손목 장비처럼 보임 | 홀터는 가슴 부착 심전도 장치, 24시간 혈압은 손가락 반지와 시계 아이콘으로 구분 | 휴대 심전도는 가슴 전극을 사용한다는 [NHS 안내](https://www.nhs.uk/tests-and-treatments/electrocardiogram/), CART BP pro의 반지형 장치를 설명한 [제조사 사용설명서](https://www.skylabs.io/en/_files/ugd/c36307_9018d36671b34624b1f6d23766dfa5f0.pdf). 개별 장치의 세부 형상·착용법을 가르치는 도해는 아님. |
| 만성질환 배너 | 셔츠 위에 커프를 감고 진료 중 대화하는 장면 | 맨팔의 상완 커프, 탁자에 놓은 팔, 조용히 측정하는 장면 | 옷 위 측정 금지, 팔 지지와 안정 상태를 설명한 [미국심장협회 안내](https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/monitoring-your-blood-pressure-at-home). |
| 예방접종 배너 | `독감·폐렴·대상포진·간염 예방` | `독감·폐렴구균·대상포진·간염 예방`. ALT도 일치 | HTML의 실제 접종 항목인 폐렴구균과 명칭을 일치시킴. 모든 원인의 폐렴을 예방하는 백신으로 읽히는 표현을 구체화. |
| 일정표: Tdap/Td | `Tdap 1회 + 이후 10년마다…`만 있어 기초 미접종자도 1회로 끝나는 것으로 읽힐 수 있음 | `기초접종 완료 후 10년마다 Td/Tdap`, `Tdap 미접종 시 1회 포함; 기초 미접종자는 3회 상담` | [질병관리청 백일해 안내](https://nip.kdca.go.kr/irhp/infm/goVcntInfo.do?menuCd=1120&menuLv=1)의 기초접종·추가접종 구분. |
| 일정표: 대상포진 | 대상이 `50세 이상 성인`으로만 표시 | `50세 이상; 면역저하자는 18세 이상`, 재조합 백신 상담 조건 추가 | [질병관리청 대상포진 안내](https://nip.kdca.go.kr/irhp/infm/goVcntInfo.do?menuCd=1117&menuLv=1)의 재조합 백신 대상. |
| 일정표: A형간염 | `0, 6~12개월`로 고정 | `1차 후 6개월 이상, 제품별 간격 확인` | [질병관리청 A형간염 안내](https://nip.kdca.go.kr/irhp/infm/goVcntInfo.do?menuCd=1109&menuLv=1)의 최소 간격·제품별 차이. |
| 일정표: 수두 | `임신·면역저하 시 상담 필요`만 표시 | `임신 중 접종 금지·면역저하자는 상담` | [질병관리청 수두 안내](https://nip.kdca.go.kr/irhp/infm/goVcntInfo.do?menuCd=1108&menuLv=1)의 임신 금기. HTML의 수두 설명도 같은 의미로 보완. |

일정표 4행은 PNG와 HTML을 함께 수정했다. 해당 출처의 실제 확인일과 이미지 내용 해시도 갱신했다. 나머지 5행과 상단 설명·하단 상담/재고 안내는 보존했다.

### 수정 전후 파일

| 대상 | 수정 전 PNG | 수정 후 PNG |
|---|---|---|
| 검사·시술 | [이전](accuracy-evidence/before/banner-services-hq-original.png) | [현재](../../web/public/assets/clinic-visuals-hq/banner-services-hq-original.png) |
| 만성질환 | [이전](accuracy-evidence/before/banner-chronic-hq-original.png) | [현재](../../web/public/assets/clinic-visuals-hq/banner-chronic-hq-original.png) |
| 예방접종 배너 | [이전](accuracy-evidence/before/banner-vaccinations-hq-original.png) | [현재](../../web/public/assets/clinic-visuals-hq/banner-vaccinations-hq-original.png) |
| 예방접종 일정표 | [이전](accuracy-evidence/before/vaccination-schedule-2026-hq-original.png) | [현재](../../web/public/assets/clinic-visuals-hq/vaccination-schedule-2026-hq-original.png) |

## 3. 17개 전수 점검표

`오류 미발견`은 이번 원고·그림 대조의 결과다. 해부학적 세부, 장비 사용법, 실제 원내 운영을 모두 보증하는 판정이 아니다.

| 자산 ID | 확인한 내용 | 결과 |
|---|---|---|
| banner-heart | 심장질환 제목, 협심증·심근경색·부정맥·판막질환 문구, 심장 주제 그림 | 오류 미발견 |
| banner-digestive | 소화기질환 제목, 위·대장·소장·췌장·담도·담낭·간질환 문구 | 오류 미발견 |
| banner-respiratory | 호흡기·감염질환 제목, 폐렴·독감·코로나19·만성기침 문구 | 오류 미발견 |
| banner-vaccinations | 성인 예방접종 제목, 폐렴구균 명칭, 상완 접종 장면 | 수정 후 재확인 |
| banner-chronic | 고혈압·당뇨·고지혈증 치료, 금연치료·체중관리, 커프와 팔 | 수정 후 재확인 |
| banner-neck | 갑상선·경동맥·경부 멍울, 초음파·혈액검사·추적관리, 목 부위 그림 | 오류 미발견 |
| banner-kidney | 신장질환 제목과 콩팥 그림, 신부전 예방·신우신염·수신증 안내 | 오류 미발견 |
| banner-cancer-support | 암 치료 중 지지치료, 발열·피로·구역·백혈구 감소 대응, 외래 상담 장면 | 오류 미발견 |
| banner-services | 검사·시술 제목과 6종 검사, 홀터·24시간 혈압 장치 구분 | 수정 후 재확인 |
| banner-checkups | 건강검진·서류안내, 국가·채용·공무원·비자검진 | 오류 미발견 |
| banner-symptoms | 흉통·숨참·복통·기침·발열·어지럼, 숨참의 폐 그림 | 오류 미발견 |
| banner-diseases | 질환백과, 심장혈관·소화기·호흡기·내분비·신장 | 오류 미발견 |
| diagram-heart-flow | 6단계와 하단 주의문. 응급진료 우선, 초기 정상 Troponin I 결과의 한계, 증상에 따른 검사 선택 | 원고 일치. 원내 시간·장비 운영은 4절 참고 |
| diagram-endoscopy-preparation | 6단계와 하단 주의문. 약·금식의 개별 안내, 보호자 귀가, 당일 운전 제한 | 원고 일치. 진정검사 관련 내용은 [서울아산병원 안내](https://health.amc.seoul.kr/health/personal/checkInformation.do?checkno=11)도 대조 |
| diagram-after-endoscopy | 6단계와 하단 주의문. 시술 범위별 식사·활동, 출혈·복통 등 즉시 진료 증상 | 원고 일치. 모든 환자에게 동일한 회복 시간을 지정하지 않음 |
| diagram-checkup-flow | 5단계와 하단 주의문. 신분증·양식·사진·여권/외국인등록증, 발급기간 조건 | 원고 일치. 실제 예약·발급 운영은 4절 참고 |
| vaccination-schedule-2026 | 9행·4열, 상단 설명, 하단 두 안내 문단 | 4행 수정 후 전체 재확인 |

## 4. 아직 보증하지 못하는 부분

| 구분 | 구체적인 내용 | 확인 방법 |
|---|---|---|
| 원내 운영 사실 | Troponin I 약 20분, 홀터 주로 72시간, CART BP Pro 24시간, 일반 국가검진 예약 여부, 서류 약 1일·1~2일·2~3일 | 현재 병원 원고와는 일치. 실제 운영 담당자가 장비·검사실·발급 업무 기준과 최종 대조해야 함 |
| 의료진 검토 | 개별 환자의 접종 대상·간격·금기와 내시경 준비·퇴실 지침 | 공식 자료를 이용한 편집 검토를 했지만 담당 의료진 승인 기록은 추가되지 않음. `pending`과 review/noindex 유지 |
| 로고 정합성 | 병원명 글자는 확인했으나, 생성된 엠블럼의 선·장식·비례는 이미지마다 조금씩 다름 | 공식 로고 원본과 픽셀 수준으로 일치한다고 판정하지 않음. 정확한 CI 재현을 요구하면 공식 로고를 별도로 적용하는 후속 디자인 작업 필요 |
| 그림의 세부 정확성 | 장기·심전도 파형·장비는 주제 설명용 일러스트. 실제 의료진·환자·시설의 사진이 아님 | 해부학 교육자료나 기기 사용설명서로 사용 가능한 수준의 검증은 하지 않음 |

위 항목을 숨기고 ‘정확도 100%’ 또는 ‘의료 검수 완료’라고 표시하지 않는다. 원래 요청에 없던 정밀 해부도·정확한 CI 재현을 새로운 필수 요구로 추가하지는 않았다.

## 5. 수정 후 기술 검증

| 검사 | 실제 결과 | 증거 |
|---|---|---|
| 콘텐츠 검사 | 135페이지·22자산 통과 | [로그](accuracy-evidence/content.log) |
| 단위 검사 | 82개 통과 | [로그](accuracy-evidence/unit.log) |
| review 빌드·정적 출력 검사 | `/yt-top-webforai`에서 135경로 통과 | [로그](accuracy-evidence/build.log) |
| 관련 브라우저 검사 | 7개 통과. 예방접종 표·목차, 17개 PNG 응답과 390/1440px 표시·확대 포함 | [로그](accuracy-evidence/e2e.log) |
| 실제 파일 | 17개 HTTP 200·image/png·SHA-256 일치, 생성 마스터와 공개 PNG 동일 | [현재 파일 원장](accuracy-evidence/assets.json) |
| 그림 속 글자 | 수정 전후 OCR 및 직접 열람으로 대조 | [수정 전](accuracy-evidence/ocr-before.json) · [수정 후](accuracy-evidence/ocr-after.json) |

이번 변경은 콘텐츠와 이미지다. 이전 전체 65개 브라우저 검사의 기록을 이번 실행으로 표시하지 않는다. 이번에는 변경 관련 7개를 다시 실행했다. 과거 재제작·성능 측정 기록은 `redraw-evidence/`에 당시 상태로 보존한다.

## 6. 다음 수정 때 재사용할 체크리스트

- [x] 실제 표시되는 PNG를 기준으로 17개 모두 확인했다.
- [x] 제목·설명·단계·표가 HTML 원고와 같은 의미인지 대조했다.
- [x] OCR의 의심 문자는 실제 이미지로 재확인했다.
- [x] 장비 이름과 그림의 불일치, 임상 조건의 생략을 보완했다.
- [x] 수정한 PNG와 HTML·ALT·해시를 함께 갱신했다.
- [x] 모바일·데스크톱 표시, 원본 링크·확대, 응답 형식·실제 바이트를 다시 확인했다.
- [x] 수정 전 파일·공식 근거·실행 로그를 보존했다.
- [ ] 원내 운영 수치와 개별 준비 지침에 대한 담당자의 최종 확인을 기록한다.
- [ ] 의료진 승인 여부는 실제 승인 기록이 있을 때만 변경한다.

전체 plan 요구 판정은 종전의 **47개 충족·2개 부분 충족·5개 미충족**을 유지한다. 감염병 원문 15쪽의 미확보 상태와 관련 검증은 이번 이미지 검토로 해결된 것이 아니다.
