# 이번 세션 커밋·푸시·배포 완료 기록

확인일: 2026-09-29 16:15 KST. 사용자의 커밋·푸시·배포 지시에 따라 실행했다. 이식 패키지 작업은 수행하지 않았다.

## 배포 결과

- 사이트: [영통탑내과](https://codepump-net.github.io/yt-top-webforai/)
- 배포 코드: [`36d5e7a`](https://github.com/codepump-net/yt-top-webforai/commit/36d5e7a55bc4b5a6070418d57e3eb9fd6cf58b97), `main` 푸시 완료
- [GitHub Actions 36534969998](https://github.com/codepump-net/yt-top-webforai/actions/runs/36534969998): 루트 검사·프로젝트 경로 검사·Pages 배포 모두 성공
- 모드: **review/noindex**. `PUBLICATION_MODE=review` 유지, 검색 공개 승인이나 의료 검토 기록 생성 없음
- 내부 보고서와 검증 자료는 저장소에 보관하며, 기존 절차대로 `web/out/`만 사이트에 배포

## 확인 결과

| 구분 | 실제 결과 |
|---|---|
| CI 기본 검사 | 루트·프로젝트 환경 모두 의존성 취약점 0건, 린트·타입·단위 85개·하네스 17개 통과 |
| CI 정적 출력 | 각 환경 135경로의 HTML·링크·메타·구조화 데이터·자산 검사 통과 |
| CI 브라우저 | 루트·프로젝트 각각 69개 통과 |
| CI 성능 | 각 환경 대표 6경로, 성능 93~99점. LCP 최대 2,376ms, CLS 최대 약 0.0023으로 기존 기준 통과 |
| 실제 페이지 | 135경로의 HTTP·HTML SHA-256·canonical·noindex가 해당 실행의 빌드 매니페스트와 일치 |
| 사이트맵·없는 주소 | review 모드의 공개 XML 사이트맵 URL 0개 유지, 존재하지 않는 경로 HTTP 404 |
| 실제 자산 | 신규 PNG 17개·감염병 PNG 16개·PDF 1개, 총 34개가 HTTP 200·올바른 형식·바이트·SHA-256 일치 |
| 실제 브라우저 | 홈·공지 목록·HPV·감염병 안내를 390·1440px에서 확인. 총 8개 화면, 가로 넘침·실행 오류 없음. HPV 날짜 의미와 감염병 16쪽·확대·닫기 확인 |
| 내부 문서 미노출 | 사이트의 요약보고서·빌드 매니페스트 경로는 모두 HTTP 404 |

[Actions 전체 상태](deployment-evidence/actions-run.json) · [CI 결과 발췌](deployment-evidence/ci-result-excerpts.log) · [실제 135경로 검사](deployment-evidence/live-verification.json) · [34개 자산·8개 화면 검사](deployment-evidence/assets-and-browser.json)

## 기록과 남은 상태

최초 체크리스트는 **54개 충족·부분 충족 0개·미충족 0개**다. 이미지 재제작과 공식 16쪽 대체에 대한 사용자 후속 지시를 적용했다. 작업 시작 전의 `plan/` 추가·삭제, 로컬 조사용 `output/`·`tmp/`, 외부 사이트 원시 HTML은 커밋하지 않았다. 요청 문서는 초기 해시와 같은 보관본을 `request-sources/`에 남겼다.

원내 운영 정보와 이번 버전의 실제 의료·운영 승인 기록은 [FOLLOW-01~03](outstanding-items.ko.md)에 유지한다. 기존 production 검증의 승인 범위·승인 상태·버전 확인을 완화하지 않았다. 이번 배포는 검색 수집 허용 또는 의료 승인 완료를 뜻하지 않는다.

배포 확인 후 작성한 보고서·검증 기록은 별도 문서 커밋으로 푸시한다. 이 기록 커밋은 사이트 코드·콘텐츠·자산을 바꾸지 않으므로 `[skip ci]`로 중복 배포를 생략한다. 실제 배포 코드와 확인 근거는 위 커밋·Actions 실행에 연결된다.
