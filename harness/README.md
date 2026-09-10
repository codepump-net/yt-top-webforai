# 병원 웹사이트 제작·검증 하네스 v1

두 병원 감사와 기업 AEO·GEO 조사를 제작 규칙으로 연결한 실행 가능한 기반이다. **병원 사실 → 의료진·콘텐츠·근거 → 검증 → 미리보기 → 검수 후 릴리스 산출물 → 운영 측정** 순서로 사용한다. 아직 특정 병원의 최종 디자인·예약 시스템을 구현한 것은 아니다.

- [원리와 기업 사례 조사](../research/2026-09-11-aeo-geo-synthesis.ko.md)
- [제작 실행 지침](HARNESS.md)
- [데이터 계약과 검수 기록](contracts.md)
- [자동·수동 검사 범위 및 기존 32개 기준 매핑](coverage.md)
- [질문·외부 정보·배포 후 측정 운영](measurement.md)
- [합성 예제](examples/project.json), [측정 합성 예제](examples/observations.json)

## 실행

Python 3.11 이상만 필요하다. 아래 명령은 저장소 루트에서 실행한다. Windows 터미널에서는 한글 출력을 위해 `-X utf8`을 사용한다. 프로젝트에 외부 Python 의존성을 설치하지 않는다.

```powershell
python -X utf8 harness/hospital_harness.py validate --project harness/examples/project.json --mode preview --report harness/runs/example-validation.json
python -X utf8 harness/hospital_harness.py build --project harness/examples/project.json --mode preview --out harness/runs/preview-v1
python -m http.server 8765 --bind 127.0.0.1 --directory harness/runs/preview-v1
```

미리보기는 `http://127.0.0.1:8765`에서 확인한다. 예제는 가상 병원·가상 의료진·합성 연구이며 실제 진료 정보가 아니다. 홈·방문 안내·개인 프로필·건강/이용 글의 5개 정적 HTML 페이지를 생성한다. 미리보기는 noindex 및 수집 차단을 포함한다. 파일을 더블클릭하기보다 위 로컬 서버를 사용한다.

출력 폴더는 비어 있어야 한다. 재실행 시 `preview-v2`처럼 새 폴더를 지정하면 이전 검토 결과가 보존된다. 서버 실행은 로컬 확인 절차이며 외부 배포는 아니다.

```powershell
# 이전 실사이트 스냅샷의 구조 검사를 재현
python -X utf8 harness/hospital_harness.py audit --snapshot research/2026-09-11-olympicpark365/evidence/audit.json --report harness/runs/olympic-structural.json
python -X utf8 harness/hospital_harness.py audit --snapshot research/2026-09-11-thegungang365/evidence/audit.json --environment demo --report harness/runs/thegungang-structural.json

# 합성 관측 데이터의 분모·인용·언급·정확도 집계
python -X utf8 harness/hospital_harness.py measure --input harness/examples/observations.json --report harness/runs/example-metrics.json

# 회귀 테스트
python -m unittest discover -s harness/tests -v
```

`audit`는 저장된 응답의 재분석이며 새 네트워크 수집이 아니다. 실제 기록의 alt 오류 때문에 올림픽파크 표본은 오류 종료가 정상이다. 의료 근거·경력 귀속을 자동 판정했다고 주장하지 않는다.

## 명령과 종료 코드

실행 결과는 [검증 기록](runs/verification.ko.md)에서 확인할 수 있다. 선택적인 브라우저 검사는 Node.js, 설치된 Playwright와 Microsoft Edge가 필요하다. `PLAYWRIGHT_MODULE` 환경 변수로 Playwright 모듈 경로를 지정한 뒤 `node harness/browser-check.cjs`를 실행한다. 핵심 Python CLI는 이 도구에 의존하지 않는다.

| 명령 | 용도 |
|---|---|
| validate | 데이터 계약·참조·scope·검수 상태 검사 |
| digest | 현재 데이터 묶음의 SHA-256 출력. 승인이나 서명은 아님 |
| build | 서버 렌더링에 해당하는 정적 HTML·JSON-LD·robots·sitemap 생성 |
| audit | 기존 audit.cjs 스냅샷의 구조 재검사 |
| measure | 외부에서 확보한 답변 기록의 관측 지표 집계 |

종료 코드 0=해당 검사가 통과하거나 집계 성공, 1=검사 오류, 2=입력/실행 오류. preview의 미검수 경고는 오류가 아니지만 `release_ready`는 false다. `--mode release`는 가상 데이터·현재 내용에 대한 검수 기록 부족을 오류로 처리한다.

## 최종 사이트에 연결

실제 병원용 JSON을 예제와 같은 계약으로 작성한다. 운영정보는 담당자 확인을 받고, 의료 글은 승인된 원문과 검토 기록을 연결한다. [HARNESS.md](HARNESS.md)의 제작 단계에 따라 CMS/프레임워크 어댑터와 디자인을 구현한다. 병원 기본정보·의료진·JSON-LD는 같은 데이터에서 생성해야 한다.

`build --mode release`는 로컬 릴리스 후보 산출물만 만든다. 서버 헤더·CDN·실제 검색 로봇·모바일 성능·예약 동작·외부 프로필·운영 권한은 배포 환경에서 따로 확인한다. 현재 생성기는 공휴일 예외를 안내 문장으로만 제공한다. 실제 사이트에서는 날짜별 운영 예외와 대응 schema를 구현해야 한다.

원문의 진위·효능·적법성·검수자 신원 인증은 이 CLI의 범위를 벗어난다. 검수 기록은 변조 방지 전자서명이 아니므로 실제 운영에서는 권한 있는 CMS/PR 승인과 함께 사용한다. 내용 변경 시 이전 검수 해시가 무효화되어 재검토 누락을 줄이는 역할을 한다.
