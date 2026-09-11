# 검색 공개 전환과 구조화 데이터 확장

2026-09-11. 내부 릴리스 기록이며 웹 출력에는 포함하지 않는다.

사용자는 이 대화에서 실제 의료·운영 확인과 검색 공개 조건 검토를 마쳤다고 명시하고 검색 공개와 구조화 데이터 확장을 지시했다. 그 확인을 `content/publication-approval.json`에 기록했다. 기록 시각은 확인을 파일에 옮긴 시각이며 의료진의 실제 검토 시각으로 표시하지 않는다. 특정 검토자의 이름은 제공되지 않았으므로 개별 의료진에게 검토나 집필을 임의로 귀속하지 않았다.

확인 기록은 전체 원고, 병원 운영 사실, 의료진, 자산, 사례 링크, 페이지 목적과 렌더러의 SHA-256에 연결된다. 공개 대상 목록과 approved 상태도 검사한다. 확인 내용이 빠지거나, 사실·본문·렌더링·범위가 달라지거나, 기록이 만료되면 production 검증이 실패한다. 기록의 최대 유효기간은 내부 관리 정책으로 1년이며 자동으로 갱신하지 않는다. 기존 실명 의료진/운영자 검토 기록 검증 경로도 유지한다.

병원 안내·진료·검사 등 43개 페이지를 색인 대상으로 공개한다. 사이트 내 검색과 오류 페이지는 기존 목적에 따라 noindex를 사용한다. main의 GitHub Pages 빌드는 production이 기본이고 PR·로컬 기본 빌드는 review다. 배포 후 공개 HTML의 해시·canonical·색인 지시어와 사이트맵 URL 전체를 같은 실행의 매니페스트와 비교한다.

구조화 데이터는 기존 병원 ID `https://yttop.co.kr/#clinic`을 유지하면서 아래 정보를 확장했다. 각 정보는 환자에게 제공되는 기존 데이터와 같은 원장을 사용한다.

| 영역 | 확장 내용 |
|---|---|
| 병원·연락처 | MedicalClinic, ContactPoint, logo ImageObject, 병원·신규 사이트 연결 |
| 탐색 | WebSite·SearchAction·EntryPoint, BreadcrumbList, CollectionPage·ItemList |
| 의료진 | ProfilePage·Person, 실제 전문의·인정의 자격의 EducationalOccupationalCredential, 학회 MedicalOrganization |
| 진료·검사 | Service·ServiceChannel, MedicalTest·ImagingTest·BloodTest·MedicalProcedure |
| 건강정보 | MedicalWebPage와 Article의 연결, 소개·분야·수정일·citation |
| 질문·답변 | 본문과 동일한 FAQPage·Question·Answer, 질문별 고유 앵커와 근거 |
| 검색 동작 | 구조화 데이터에 기재된 `/search/?q=...`가 실제 검색어로 열리도록 연결 |

환자에게 존재하지 않는 가격·후기·좌표·의사별 검토 사실·검사시간은 추가하지 않았다. 토요일의 확인되지 않은 점심 적용은 기존 원장대로 보류한다. 의료진 실루엣을 실제 얼굴 이미지로 구조화하지 않는다. 공지 게시판과 사례 원문 25개는 기존 병원 사이트로 연결한다.

FAQPage는 본문 질문과 답변을 표현하는 schema.org 데이터다. Google FAQ 리치결과 노출을 주장하지 않는다. 스키마 개수나 Lighthouse 점수는 실제 검색 순위나 AI 인용률이 아니다. 구조와 검사 항목은 [schema.org MedicalTest](https://schema.org/MedicalTest), [ServiceChannel](https://schema.org/ServiceChannel), [FAQPage](https://schema.org/FAQPage)를 참고했다.

로컬 production 빌드에서 45개 경로의 정적 검증, 52개 단위 검사, 17개 Python 하네스 검사, 31개 브라우저 검사가 통과했다. lint·타입 검사와 의존성 보안 감사도 통과했다. Lighthouse 모바일 검사에서 홈·심장초음파·대장내시경 준비 페이지 SEO는 100, 접근성 100, 성능 99였고 CLS는 0이었다. 내부 검색 페이지의 noindex에 따른 SEO 66은 의도한 색인 정책으로 구분한다.

전체 그래프에 29종의 schema.org 타입을 사용한다. 27개 페이지의 질문·답변 82개, 21개 진료 서비스, 11개 목록, 4개 건강정보 Article, 의료진 프로필 2개를 포함한다. 이는 중첩된 타입을 포함한 구현 범위이며 공식 최적화 점수가 아니다. [구조화 데이터 집계](schema-summary.json).

배포 후 `npm run verify:live:seo`로 색인 대상 43개 URL의 Lighthouse SEO를 각각 검사한다. 실제 배포 상태와 결과는 작업 완료 시 추가한다.
