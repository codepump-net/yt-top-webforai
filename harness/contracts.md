# 데이터 계약과 검토 기록

계약 버전은 1이다. 실행 가능한 전체 예시는 [project.json](examples/project.json)에 있다. 예시 기관·인물·문헌은 합성이므로 실제 사이트에 복사해 게시하지 않는다.

| 묶음 | 필드와 규칙 |
|---|---|
| 프로젝트 | `version: 1`, `demo: boolean`, `hospital`, `physicians`, `sources`, `articles`, `reviews` |
| hospital | `name`, `origin`, `address`, `phone`, `hours`, `holiday_note`, `parking`, `intake`, `verified_at` |
| physicians[] | `id`, `name`, `specialty`, `bio`, `credentials[]`, `memberships[]`. 자격과 학회 소속을 별개로 관리 |
| sources[] | `id`, `url`, `title`, `publisher`, `design`, `checked_at`, `scope` |
| articles[] | `id`, `title`, `description`, `question`, `answer`, `limits`, `author_id`, `risk`, `updated_at`, `sections[]`, `claims[]`, `cta` |
| sections[] | `heading`, `text` |
| claims[] | `text`, `source_id`, `scope` |
| images[] | 선택 항목. `src`는 HTTPS, `alt`는 비어 있지 않은 일반 텍스트. 장식 이미지는 디자인 어댑터에서 별도 처리 |

ID는 영문 소문자로 시작하며 소문자·숫자·하이픈만 허용한다. 같은 묶음 안의 ID는 유일해야 한다. 본문은 일반 텍스트이며 HTML을 허용하지 않는다. 의료진과 출처는 ID로 참조한다. 원본 문헌이 실제 주장을 뒷받침하는지는 사람이 확인한다.

`risk`는 `operational`, `medical`, `urgent` 중 하나다. 의료·응급 글에는 근거 연결이 필요하다. 응급 글은 `emergency_action`과 `cta: emergency`를 요구한다. 나머지는 `contact` 또는 `none`이다. 위험 분류와 행동 지침의 적절성은 의료진 검수 대상이다. 분류를 바꿔 검수를 우회해서는 안 된다.

## 병원 사실의 참조

답변·본문·한계 문장에서 `{{hospital.name}}`, `{{hospital.address}}`, `{{hospital.phone}}`, `{{hospital.hours}}`, `{{hospital.parking}}`, `{{hospital.intake}}`를 사용할 수 있다. 화면의 운영 안내와 JSON-LD는 같은 `hospital` 객체에서 만들어진다.

`hours`는 `days` 배열과 `opens`, `closes`를 갖는 구간 배열이다. 요일은 Monday부터 Sunday까지의 영문 이름, 시각은 00:00~23:59이며 시작이 종료보다 빨라야 한다. 점심시간은 구간을 나눠 표시한다. **자정을 넘는 진료·24시간 진료·날짜별 휴진은 현재 계약으로 완전하게 표현하지 못한다.** 해당 병원 제작 전에 시간 모델과 화면·schema·테스트를 함께 확장한다. 공휴일 안내 문장만으로 날짜별 예외를 구현했다고 판단하지 않는다.

`HH:MM` 형태의 본문 시간 복사와 알 수 없는 참조 토큰은 검사한다. ‘밤 열 시’ 같은 자연어 시간, 본문에 복사된 주소·경력 전체를 자동으로 해석하지 않는다. `author_bio` 필드 금지는 중복 경력의 한 경로만 차단한다.

## 문장별 근거 범위

`scope`에는 다음 여섯 개의 비어 있지 않은 문자열이 필요하다.

| 필드 | 확인할 내용 |
|---|---|
| condition | 대상 질환·상태 |
| population | 연령·환자군·선정 조건 |
| intervention | 처치·비교 조건 |
| timing | 시작 시점·추적 기간 |
| outcome | 실제 측정한 결과 |
| measure | OR, RR, 절대위험 등 통계량과 분모 |

주장과 출처의 선언값이 다르면 오류다. 이 일치는 **입력된 범위 문자열의 일치**이며 의학적 타당성의 증명이 아니다. 연구에서 3시간 이내 처치를 관찰했다면 다음 날 효과의 근거로 자동 확대할 수 없고, OR을 위험 감소율로 바꿔 적을 수 없다. 의료진은 원문·본문·표·그래프를 함께 대조한다. 한 논문이 여러 범위를 다루면 출처 ID를 범위별로 나누어 같은 URL을 참조할 수 있다.

## 검수와 내용 변경

1. 운영 담당자가 사실과 외부 증빙을 확인하고 의료진이 의료 문장과 출처를 검토한다.
2. `python -X utf8 harness/hospital_harness.py digest --project 실제파일.json`으로 현재 내용 해시를 구한다.
3. 실제 검수가 끝났을 때만 아래 형태의 기록을 `reviews`에 넣는다. 이 예시는 미승인 상태다.

```json
{
  "scope": "operations",
  "role": "operations",
  "status": "pending",
  "reviewer": "",
  "reviewed_at": "",
  "expires_at": "",
  "digest": "",
  "evidence_checked": false,
  "record": ""
}
```

운영 검수 scope는 `operations`, 의료 검수 scope는 해당 글의 ID, role은 `medical`이다. 릴리스에는 `approved`, 책임자를 식별하는 이름, 유효한 검수일·만료일, 현재 해시, `evidence_checked: true`, 실제 CMS/PR/문서 기록의 위치가 필요하다. 기록의 권한과 진위는 CLI가 인증하지 않는다. 의료 검토 날짜는 유효한 기록이 있는 릴리스에서만 화면과 구조화 데이터에 표시된다.

해시는 `reviews`를 제외한 프로젝트 전체에 걸린다. 병원 사실·문장·출처·이미지 하나라도 바뀌면 전체 검수가 다시 필요하다. 초기 버전의 보수적인 정책이다. 규모가 커지면 의존 관계를 추적하는 글별 해시로 확장하되 회귀 테스트를 먼저 추가한다.

검수 유효기간은 책임자가 내용 위험과 업데이트 주기에 따라 정한다. 자동 승인 기능은 없다. `--as-of`는 과거 조사 재현용이다. 실제 릴리스에는 과거 날짜를 지정하지 않는다. 기록은 전자서명이나 접근 통제를 대신하지 않으므로 기존 CMS·저장소의 권한과 승인 절차에 연결한다.
