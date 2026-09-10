# 전체 사이트맵과 공개 경로 규칙

총 76개 구현 후보. 상세 데이터는 [페이지 행렬](page-matrix.csv), [페이지별 명세](page-details.ko.md)에 있다. 아래 트리는 실제 경로이며 개발 순서와 공개 승인은 별개다.

## 전체 경로

```text
/  영통탑내과
  /404.html  페이지를 찾을 수 없습니다
  /about/  병원 소개
  /cases/  진단 사례
    /cases/case-164673116/  복수 단백뇨로 내원하여 진단된 대장암. — 진단 사례
    /cases/case-164673131/  속쓰림을 내원한 위암환자 — 진단 사례
    /cases/case-164673206/  갑상선암 증례 — 진단 사례
    /cases/case-164673218/  수신증 사례 — 진단 사례
    /cases/case-164673233/  하복부 통증으로 내원하여 시행한 초음파 — 진단 사례
    /cases/case-164673242/  발열 복통으로 내원한 복막염 환자. — 진단 사례
    /cases/case-165150420/  복강내 종괴 증례 — 진단 사례
    /cases/case-165150549/  대장 베체트 증례 — 진단 사례
    /cases/case-165150795/  폐렴 증례 — 진단 사례
    /cases/case-165151140/  비후성 심근병증 증례 — 진단 사례
    /cases/case-165203625/  지속되는 두근거림으로 내원하여 진단된 심실빈맥 — 진단 사례
    /cases/case-165203941/  두근거림 호흡곤란으로 내원하여 진단된 심방세동 — 진단 사례
    /cases/case-165204038/  대변에서 피가 묻어나서 시행한 대장내시경을 통해 진단 대장암 — 진단 사례
    /cases/case-165259713/  생리통으로 오인된 난소종양 — 진단 사례
    /cases/case-165259783/  식도 점막하 종양 — 진단 사례
    /cases/case-165259921/  대동맥 판막협착 및 대동맥판막 역류. — 진단 사례
    /cases/case-165338662/  상,하복부 통증으로 내원한 맹장염 — 진단 사례
    /cases/case-165338735/  목에 혹이 만져져요. 림프종 진단사례. — 진단 사례
    /cases/case-165396187/  재발하는 뇌경색으로 내원하여 진단된 심방세동. — 진단 사례
    /cases/case-165396249/  식도궤양 — 진단 사례
    /cases/case-165396339/  중증 대동맥판막협착 — 진단 사례
    /cases/case-165407798/  대동맥류를 동반한 이엽성 판막증 — 진단 사례
    /cases/case-165407885/  궤양성대장염 — 진단 사례
    /cases/case-165407958/  대장용종 절제 사례 — 진단 사례
    /cases/case-167025586/  심근경색 진단과정 — 진단 사례
  /checkups/  건강검진 안내
    /checkups/cancer-screening/  암검진 안내
    /checkups/drug-screening/  마약검사·영문서류
    /checkups/employment/  채용검진·제출 서류
    /checkups/national/  국가건강검진
    /checkups/tuberculosis/  기숙사 결핵검진
    /checkups/visa/  외국인 비자검진
  /conditions/  내과 진료 안내
    /conditions/acute-care/  급성기질환 진료
    /conditions/chronic-cough/  만성기침 진료
    /conditions/heart-disease/  심장질환 진료
  /content-policy/  의료정보 작성·검수 원칙
  /doctors/  의료진 소개
    /doctors/park-jongseol/  박종설 대표원장
    /doctors/park-rayoung/  박라영 원장
  /fees/  비용·서류 발급 안내
  /health/  검사·진료 이해하기
    /health/checkup-preparation-checklist/  건강검진 전 준비 확인표
    /health/colonoscopy-preparation-questions/  대장내시경 준비 시 확인할 질문
    /health/heart-test-differences/  심전도·심장초음파·홀터검사의 차이
    /health/palpitations-test-followup/  검사 후에도 두근거림이 계속될 때 확인할 점
  /notices/  공지사항
    /notices/closure-2025-06-24/  2025년 6월 24일 오후 휴진 기록
    /notices/drug-certificate/  마약검사 영문서류 발급 안내
    /notices/mammography-equipment/  디지털 유방촬영 장비 도입 안내
    /notices/pathfast/  심장 표지자 검사 장비 도입 안내
    /notices/screening-evaluation/  국가검진기관 평가 안내
  /privacy/  개인정보 처리 안내
  /search/  사이트 검색
  /services/  진료·검사 안내
    /services/cancer-support/  암환자 진료·케어 안내
    /services/endoscopy/  위·대장내시경 안내
      /services/endoscopy/colonoscopy/  대장내시경
      /services/endoscopy/gastroscopy/  위내시경
    /services/heart/  심장검사 안내
      /services/heart/arterial-assessment/  동맥경화도 검사
      /services/heart/cardiac-markers/  심장 표지자 검사
      /services/heart/carotid-ultrasound/  경동맥 초음파
      /services/heart/echocardiography/  심장초음파 검사
      /services/heart/heart-rate-variability/  심박 변이도 검사
      /services/heart/holter/  홀터검사
    /services/ultrasound/  초음파 검사 안내
      /services/ultrasound/abdomen/  상·하복부 초음파
      /services/ultrasound/bowel/  소장·대장·맹장 초음파
      /services/ultrasound/thyroid/  갑상선 초음파
  /sitemap/  전체 페이지 안내
  /visit/  진료시간·오시는 길
```

## XML sitemap 생성 계약

- [planned-sitemap.xml](planned-sitemap.xml)은 계획 검토용 73개 후보 URL이다. 운영 sitemap으로 제출하거나 그대로 배포하지 않는다.
- 운영 `sitemap.xml`은 게시 승인·유효 검수·indexable·대표 경로 조건을 모두 충족한 public manifest에서 빌드 시 생성한다. 현재 승인된 운영 페이지는 0개다.
- 검색 `/search/`, 오류 `/404.html`, 종료된 2025년 휴진 기록은 XML에서 제외한다. 검색과 종료 공지는 화면 제공 시 noindex, 404는 실제 HTTP 404와 noindex를 사용한다.
- 검수 대기 페이지는 HTML·내부 링크·검색 색인·사이트맵에서 모두 제외한다. 공개 필요 페이지가 누락되면 release 검사 실패로 처리한다.
- 프로젝트 환경의 URL은 `https://codepump-net.github.io/yt-top-webforai`에 경로를 정확히 한 번 붙인다. 최종 운영 도메인을 바꾸면 canonical·schema·사이트맵을 함께 재빌드한다.
- `<lastmod>`는 실질적 공개 본문 변경일이 확인된 경우에만 넣는다. 원본 게시일·빌드 시각·의학 검수일과 혼동하지 않는다. 의미 없는 changefreq·priority는 생략한다.
- 초기 공개 검토 모드 `SITE_INDEXING_ENABLED=false`에서는 meta noindex를 사용하고 XML sitemap을 생성·광고·제출하지 않는다. 사람용 `/sitemap/`은 탐색 목적으로 유지할 수 있다.
- `/yt-top-webforai/robots.txt`는 origin 루트 robots를 대신하지 못한다. 원격 루트 정책을 따로 확인하며 프로젝트 하위 sitemap은 도구에 정확한 URL로 제출한다.
- `/sitemap/` 화면은 공개된 페이지를 병원·진료·검진·건강정보·사례·공지·정책으로 나눈다. XML 제외된 공개 보관 공지는 종료 표시와 함께 탐색할 수 있다.
- sitemap URL 전체 HTTP·canonical 일치, 중복·미승인·404·noindex URL 포함 여부를 CI와 실제 배포에서 모두 검사한다. 색인이나 AI 인용은 별도 관측한다.

## 기존 주소 이관

[legacy-url-map.csv](legacy-url-map.csv)는 발견된 145개 URL을 빠짐없이 분류한다. 게시물은 `idx`를 먼저 판정해 홈·게시판의 같은 글을 같은 새 경로로 합친다. 페이지네이션은 해당 목록으로 통합한다. `/49`는 대체 본문이 없는 푸터 중심 페이지이므로 폐기 후보다. 이관 대상 공개 확인 후 기존 호스팅에서 301/308 또는 필요한 404/410을 설정한다. Pages 파일만으로 기존 도메인의 HTTP 상태를 변경할 수 없다.
