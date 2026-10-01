# 17개 배너·안내도 고해상도 재제작

2026-09-29 사용자 정정: 기존 원본 파일을 요구하는 대신, 보유한 작은 참고 이미지와 현재 환자 안내 문구로 새 그림을 제작한다.

- 제작 도구: 내장 `image_gen`. 배너 12개, 안내도·일정표 5개를 개별 생성하고 직접 열어 검수했다.
- 배너: 1672×941px(질환백과 1672×940px). 안내도: 1086×1448px.
- 2026-09-29 제작 당시에는 최종 생성 결과의 바이트를 그대로 저장했다. 현재 파일에는 아래 2026-10-01 공식 로고 합성 수정이 적용되어 있다. 캔버스 크기는 유지한다.
- 동일한 파일을 `web/public/assets/clinic-visuals-hq/`에 복사하고 `content/assets.json`에 등록했다.
- 파일명의 `hq-original`은 이번에 새로 제작한 고해상도 마스터를 뜻한다. 과거의 최초 PNG를 복구했다는 의미가 아니다.
- [프롬프트 기록](prompts.json)에 17개 입력과 암환자·증상백과 배너의 수정 입력을 보관했다. 암환자 그림은 외래 상담 장면이며 실제 환자·의료진의 사진이 아니다.
- 안내도의 문구는 `content/visuals.json`, 예방접종 9행은 `content/pages.json`의 현재 HTML 안내와 대조했다. 의료 승인이나 새로운 임상 검토를 받았다고 표시하지 않는다.

검사·전후 비교는 [작업 결과](../../../docs/plan-content-checklist-2026-09-29/redrawn-images.ko.md)와 [17개 파일 기록](../../../docs/plan-content-checklist-2026-09-29/redraw-evidence/assets.json)에 있다.

## 정확성 후속 수정

17개를 OCR·직접 열람·공식 자료와 대조하고 검사·시술, 만성질환, 예방접종 배너 및 접종 일정표 4개를 다시 생성했다. `prompts.json`의 `accuracyEdits`에 입력과 결과 해시를 남겼다. [최신 정확성 검토](../../../docs/plan-content-checklist-2026-09-29/image-accuracy.ko.md)와 [현재 17개 파일 기록](../../../docs/plan-content-checklist-2026-09-29/accuracy-evidence/assets.json)을 확인한다.

## 공식 로고 합성 수정

2026-10-01 사용자 지시에 따라 잘못 생성된 로고 영역을 정리하고 기존 홈페이지에서 가져온 `web/public/assets/logo.webp`를 **294×77px 원래 픽셀 그대로** 합성했다. 로고를 확대하거나 다시 그리지 않았으며 ‘의원’과 하단 영문 병원명도 보존했다. 기존 그림과 안내 문구는 교체 영역 밖의 디코딩 픽셀 비교로 그대로임을 확인했다.

- 현재 PNG 17개와 공개 파일을 함께 갱신했다. 두 파일의 바이트는 동일하다.
- 파일명의 `hq-original`은 현재 저장 마스터를 가리킨다. 합성 후 파일을 원래 image_gen 출력의 미수정 바이트라고 설명하지 않는다.
- 과거 검수 전 PNG 4개의 수정판은 `assets/corrected-logo-2026-10-01/historical/`에 보관한다. 과거 검증 증거 원본은 유지한다.
- 현재 파일 해시·교체 좌표·전후 픽셀 검증은 [공식 로고 수정 기록](../../../docs/logo-correction-2026-10-01/corrections.json)에 있다. 9월 29일의 파일 원장은 당시 상태를 기록한 이력이다.
- 재현은 `web/scripts/apply-official-logo.mjs --apply`를 실행한다. 기본 실행은 검토용 수정판만 생성한다.
