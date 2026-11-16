# F11. 이미지·도해·확대

상태: 구현. 주 담당 단독 페이지 없음. 관련: F01·F03~F07·F10·F13·F14.

## 목적과 현재 흐름

병원 사진·분야 배너·검사 도해·공식 문서 이미지로 안내를 돕는다. 필요한 자료는 사용자가 눌러 확대하거나 원본 파일을 확인한다.

## 개발 접점

| 구분 | 위치 |
|---|---|
| 원장 | `assets.json`의 등록 자산 38개, `visuals.json`의 배너 12개·도해 4개 |
| 배포 파일 | `web/public/assets/`, 등록 원본은 원장의 `sourceFile` 등 |
| 화면·선택 | `patient-visuals.tsx`, `guide-card-image.tsx`, `zoom-image.tsx`, `page-image.mjs` |
| 가공·검증 | `prepare-assets.mjs`, `prepare-card-thumbnails.mjs`, `redrawn-image-contract.mjs`, `validate.mjs` |

등록 자산 38개는 썸네일·파비콘 등을 포함한 전체 정적 파일 개수와 다르다. 배너·도해 개수도 해당 설정 항목 수다.

## 완료 조건

- AC01: 출처·변환·해시·바이트·치수가 실제 파일과 일치한다.
- AC02: 중요 의료정보는 텍스트에서도 읽히고 도해의 내용·표현은 근거와 맞는다.
- AC03: 종횡비·alt·caption·지연 로딩을 확인한다. 실제 인물과 실루엣을 구분한다.
- AC04: 확대·닫기·Escape·초점 복귀·원본 링크가 키보드로 동작한다.
- AC05: 대체 이미지·OG·카드·문서 페이지와 루트/하위 경로가 정상이다.

## 상태·작업 예시·검증

문서 페이지·생성 원본·일반 사진은 계약의 크기·검증 예외가 다르다. 모든 자산을 같은 압축 기준으로 일괄 바꾸지 않는다. 원본 crop 픽셀 대조나 공식 PDF 무결성 검증에 필요한 파일을 정리 과정에서 제거하지 않는다.

작업 예시: 기존 배너 교체 → 사용 권리·근거 확인 → 파생 파일·원장 갱신 → 실제 표시·확대·대표 이미지·무결성 검사.

검증 접점: `tests/unit/page-image.test.mjs`, `redrawn-images.test.mjs`; `tests/e2e/redrawn-images.spec.ts`, `infection-guide.spec.ts`; `content:validate`, 관련 성능 검사.
