# 전달 모음판의 원본 이미지 반영

2026-09-28. 사용자의 지시대로 한 장의 모음판에서 대표 배너 12개와 안내도 5개를 분리해 기존 위치의 이미지를 교체했다.

## 보존한 내용

- 글자·그림·로고·배치·색상과 원본 해상도를 보존했다. 이미지 사이 여백과 파일명 표시는 제외했다.
- WebP 무손실 저장 후 각 파일을 디코딩하여 원본의 해당 영역과 RGB 픽셀이 완전히 같은지 검증했다. 재생성·글자 재입력·확대 저장·선명화는 수행하지 않았다.
- 7번 콩팥 그림에 적힌 제목 ‘심장질환’도 원본 그대로 남겼다.
- 작은 안내도의 글씨 선명도는 전달된 모음판의 해상도에 한정된다.
- 이미지 아래의 불필요한 삽화 설명과 대표 배너 확대 기능은 되살리지 않았다. 기존 안내도 확대·키보드 복귀 기능은 유지했다.
- 기존 HTML 진료·준비 설명은 보존했다. 새로 잘라 넣은 원본 이미지의 완전한 전사본으로 오해하지 않도록 제목을 ‘관련 검사·준비 안내’로 정리했다.
- 이미지 교체 후 사실과 맞지 않게 된 AI 생성 삽화 설명은 콘텐츠 이용 안내에서 제거했다.

## 위치와 원본 영역

| 모음판 번호 | 자산 | 페이지 | 원본 좌표 x, y, 폭, 높이 |
|---|---|---|---|
| 1 | banner-heart | `/conditions/heart-disease/` | 10, 10, 400, 225 |
| 2 | banner-digestive | `/conditions/digestive/` | 430, 10, 400, 225 |
| 3 | banner-respiratory | `/conditions/respiratory-infections/` | 850, 10, 400, 225 |
| 4 | banner-vaccinations | `/services/vaccinations/` | 10, 360, 400, 225 |
| 5 | banner-chronic | `/conditions/chronic-disease/` | 430, 360, 400, 225 |
| 6 | banner-neck | `/conditions/thyroid-carotid-neck/` | 850, 360, 400, 225 |
| 7 | banner-kidney | `/conditions/kidney/` | 10, 710, 400, 225 |
| 8 | banner-cancer-support | `/services/cancer-support/` | 430, 710, 400, 225 |
| 9 | banner-services | `/services/` | 850, 710, 400, 225 |
| 10 | banner-checkups | `/checkups/` | 10, 1060, 400, 225 |
| 11 | banner-symptoms | `/symptoms/` | 430, 1060, 400, 225 |
| 12 | banner-diseases | `/diseases/` | 850, 1060, 400, 225 |
| 13 | vaccination-schedule-2026 | `/services/vaccinations/` | 90, 1410, 240, 300 |
| 14 | diagram-heart-flow | `/services/heart/` | 490, 1410, 280, 300 |
| 15 | diagram-endoscopy-preparation | `/services/endoscopy/` | 910, 1410, 280, 300 |
| 16 | diagram-after-endoscopy | `/health/after-endoscopy/` | 70, 1760, 280, 300 |
| 17 | diagram-checkup-flow | `/checkups/` | 490, 1760, 280, 300 |

## 검증

- 원본 영역과 이미지 픽셀 일치: 17개 모두 통과.
- 콘텐츠 및 정적 출력 검사: 129개 경로·22개 자산 통과.
- TypeScript 빌드·ESLint 통과.
- 관련 단위 검사 7개, 브라우저 검사 6개 통과.
- 390px·1440px 화면, 접근성 검사, 안내도 확대/복귀, 자바스크립트 없는 이미지 접근 확인.

[원본 모음판](../../assets/director-supplied/2026-09-27/contact-sheet.jpg) · [분리 좌표와 배치 목록](../../assets/director-supplied/2026-09-27/crops.json) · [재현 스크립트](../../web/scripts/crop-director-images.mjs)

재현: `cd web && node scripts/crop-director-images.mjs`. 일반 콘텐츠 검사도 원본 해시·분리 좌표·결과 이미지 픽셀을 대조한다. 기존 안내도 생성 스크립트는 제공 원본을 다시 그리지 않도록 보호했다.
