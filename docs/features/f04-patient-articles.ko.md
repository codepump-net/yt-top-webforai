# F04. 환자 안내·질문·출처 읽기

상태: 구현. 주 담당: `article-detail` 56개 경로. 다른 상세 템플릿도 읽기 부품을 공유한다. 관련: F02·F03·F06·F07·F10·F11·F13·F14.

## 목적과 현재 흐름

요약과 위험 신호를 읽고 본문·표·단계·질문·관련 안내·출처를 확인한다. 준비 안내와 질문은 인쇄 시에도 내용을 확인할 수 있어야 한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 원고 | `pages.json`: `blocks`, `questions`, `sources`, `related`, `urgentNotice` |
| 화면 | `content.tsx`: `BodyBlocks`, `AnswerSources`, `ContextLinks`, `Sources` |
| 공통 안내 | `article-guidance.mjs`, `article-footer.tsx` |
| 상호작용 | `article-navigation.tsx`, `print-questions.tsx`, CSS print 규칙 |
| 검증 | `content-contract.mjs`, `public-content-policy.mjs` |

## 완료 조건

- AC01: 본문은 정적 HTML로 읽히고 제목·목록·표의 의미 구조가 유지된다.
- AC02: 질문 답변과 JSON-LD가 일치하며 출처·문맥 링크·앵커가 해석된다.
- AC03: 필요한 위험 신호·검사 한계·개인별 상담 안내를 보존한다.
- AC04: 실제 검토 이력 없이 의료진 검토자·승인 문구를 생성하지 않는다.
- AC05: 인쇄에서 FAQ 답변과 표가 유실되지 않고 화면·종이 모두 읽을 수 있다.

## 상태·작업 예시·검증

선택적 질문·표·수정 시각이 없는 원고도 계약 범위에서 허용한다. 출처 누락·잘못된 앵커·완전히 빈 블록은 콘텐츠 검사에서 거절한다. 개별 의료 판단을 키워드 검사만으로 통과시켰다고 보고하지 않는다.

작업 예시: 기존 준비 안내의 문단을 제목·목록으로 정리 → 의미·근거·위험 안내 보존 확인 → 인쇄와 구조화 데이터 대조. 새로운 복약·치료 주장은 실제 확인이 필요하다.

검증 접점: `tests/unit/content.test.mjs`, `public-content.test.mjs`, `aeo-content.test.mjs`; `tests/e2e/patient-content.spec.ts`, `aeo-content.spec.ts`, `structured-data.spec.ts`.
