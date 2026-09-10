# 페이지별 상세 개발 계획

이 문서는 `build_plan.py`의 편집 계획과 기존 수집 원장에서 생성했다. **모든 페이지는 개발 예정·게시 미승인**이다. title·description은 원고 초안이고, 질문은 집필 과제이며 완성된 의료 답변이 아니다.

전체 규칙·컴포넌트·배포는 [실행 계획](execution-plan.ko.md), 이미지 사용 원칙은 [이미지 계획](assets.ko.md)을 따른다.

## home — 영통탑내과

- 경로: `/` · 템플릿: `home` · 순서: P0
- 목적: 병원의 진료 범위와 방문 방법을 한 화면에서 판단
- title 초안: 영통탑내과 | 진료·검사·건강검진·방문 안내
- description 초안: 영통탑내과의 진료·검사·건강검진과 의료진을 소개합니다. 진료시간·위치·검사 예약 안내를 확인하세요.
- 입력: `content/pages/home.json` + `content/bodies/home.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/)
- [기존 페이지](https://yttop.co.kr/42)
- [기존 페이지](https://yttop.co.kr/43)
- [기존 페이지](https://yttop.co.kr/48)
- [기존 페이지](https://yttop.co.kr/16)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-db394c63d966.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-e006238f837b.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-fe8b82f8fca1.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-02bb2fe60567.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-633110709766.md)
- [이미지 988305921ed3aadb.png](../../research/2026-09-11-yttop/evidence/assets/988305921ed3aadb.png) — 육안 대조한 사용 후보
- [이미지 2d2fd518e1de33ef.jpg](../../research/2026-09-11-yttop/evidence/assets/2d2fd518e1de33ef.jpg) — 육안 대조한 사용 후보

**본문 순서**

1. 병원명·망포역 위치
2. 핵심 진료 카드
3. 의료진 요약
4. 진료·접수 요약
5. 유효한 공지
6. 방문 연결

**답변을 작성할 질문**

- 어떤 진료와 검사를 받을 수 있나요?
- 위치와 진료시간은 어떻게 되나요?
- 검사 전에 예약이 필요한가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 최고·유일·완치 등 미확인 표현과 종료 이벤트를 hero에 넣지 않음

**내부 링크:** `/visit/` · `/doctors/` · `/services/heart/` · `/checkups/` · `/services/endoscopy/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## not-found — 페이지를 찾을 수 없습니다

- 경로: `/404.html` · 템플릿: `not-found` · 순서: P0
- 목적: 잘못된 경로에서 안전하게 복귀
- title 초안: 페이지를 찾을 수 없습니다 | 영통탑내과
- description 초안: 영통탑내과의 페이지를 찾을 수 없습니다 안내입니다. 404 설명, 홈·방문·검색 연결 관련 정보를 확인하세요.
- 입력: `content/pages/not-found.json` + `content/bodies/not-found.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 아니오

**원문·이미지**

- 공통 승인 원장과 공개 route manifest에서 생성. 병원 사실 신규 추정 없음.

**본문 순서**

1. 404 설명
2. 홈·방문·검색 연결

**답변을 작성할 질문**

- 이전 주소의 정보를 어디서 찾나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 실제 HTTP 404 유지; SPA fallback으로 모든 URL 200 처리 금지

**내부 링크:** `/` · `/visit/` · `/search/` · `/sitemap/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## about — 병원 소개

- 경로: `/about/` · 템플릿: `about` · 순서: P0
- 목적: 기존 소개를 사실 중심으로 재구성하고 실제 시설을 보여줌
- title 초안: 병원 소개 | 영통탑내과
- description 초안: 영통탑내과의 병원 소개 안내입니다. 소개 요약, 진료 철학 원문 재구성, 확인된 진료 범위 관련 정보를 확인하세요.
- 입력: `content/pages/about.json` + `content/bodies/about.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/16)
- [기존 페이지](https://yttop.co.kr/41)
- [기존 페이지](https://yttop.co.kr/48)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-e006238f837b.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-b2f4f22dafc0.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-633110709766.md)
- [이미지 988305921ed3aadb.png](../../research/2026-09-11-yttop/evidence/assets/988305921ed3aadb.png) — 육안 대조한 사용 후보

**본문 순서**

1. 소개 요약
2. 진료 철학 원문 재구성
3. 확인된 진료 범위
4. 시설 사진
5. 의료진·방문 연결

**답변을 작성할 질문**

- 어떤 분야를 진료하나요?
- 병원 내부는 어떻게 구성되어 있나요?
- 담당 의료진은 누구인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 16·41 중복 통합; 인증·평가의 범위와 기간 증빙 확인

**내부 링크:** `/doctors/` · `/services/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## cases — 진단 사례

- 경로: `/cases/` · 템플릿: `case-index` · 순서: P2
- 목적: 검수된 사례의 진단 과정과 해석 한계를 소개
- title 초안: 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 진단 사례 안내입니다. 사례 이용 원칙, 주제 필터, 사례 카드 관련 정보를 확인하세요.
- 입력: `content/pages/cases.json` + `content/bodies/cases.md`
- 구조화 데이터: CollectionPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-9c5ede93048d.md)
- [이미지 27f5b8915dcaa2af.png](../../research/2026-09-11-yttop/evidence/assets/27f5b8915dcaa2af.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 589fa5799cadb78b.png](../../research/2026-09-11-yttop/evidence/assets/589fa5799cadb78b.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 509c6b62ad28af6b.png](../../research/2026-09-11-yttop/evidence/assets/509c6b62ad28af6b.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 사례 이용 원칙
2. 주제 필터
3. 사례 카드
4. 개별 결과 일반화 한계

**답변을 작성할 질문**

- 어떤 진단 과정이 소개되어 있나요?
- 사례와 내 증상을 같게 볼 수 있나요?
- 관련 검사는 어디서 확인하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 25개 원문은 전부 이관 후보; 재게시·비식별·의료 검수 통과분만 공개

**내부 링크:** `/services/` · `/conditions/` · `/content-policy/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## case-164673116 — 복수 단백뇨로 내원하여 진단된 대장암. — 진단 사례

- 경로: `/cases/case-164673116/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 복수 단백뇨로 내원하여 진단된 대장암. — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 복수 단백뇨로 내원하여 진단된 대장암. — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-164673116.json` + `content/bodies/case-164673116.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=164673116&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-01efd96da64c.md)
- [이미지 fcfe333cc21294cc.png](../../research/2026-09-11-yttop/evidence/assets/fcfe333cc21294cc.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 60fe19a405db9566.png](../../research/2026-09-11-yttop/evidence/assets/60fe19a405db9566.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 01cd27e98f44c429.png](../../research/2026-09-11-yttop/evidence/assets/01cd27e98f44c429.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/endoscopy/` · `/services/endoscopy/gastroscopy/` · `/services/endoscopy/colonoscopy/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-05-30T15:12:30+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-164673131 — 속쓰림을 내원한 위암환자 — 진단 사례

- 경로: `/cases/case-164673131/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 속쓰림을 내원한 위암환자 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 속쓰림을 내원한 위암환자 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-164673131.json` + `content/bodies/case-164673131.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=164673131&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-3368ced3e327.md)
- [이미지 fce0aadd16974509.png](../../research/2026-09-11-yttop/evidence/assets/fce0aadd16974509.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 32f6e9c3ca8aa539.png](../../research/2026-09-11-yttop/evidence/assets/32f6e9c3ca8aa539.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 d09a71a475327937.png](../../research/2026-09-11-yttop/evidence/assets/d09a71a475327937.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/endoscopy/` · `/services/endoscopy/gastroscopy/` · `/services/endoscopy/colonoscopy/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-05-30T15:12:47+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-164673206 — 갑상선암 증례 — 진단 사례

- 경로: `/cases/case-164673206/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 갑상선암 증례 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 갑상선암 증례 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-164673206.json` + `content/bodies/case-164673206.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=164673206&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-9f391a0aa3f9.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 2029ddb5451cadd2.png](../../research/2026-09-11-yttop/evidence/assets/2029ddb5451cadd2.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/ultrasound/thyroid/` · `/services/ultrasound/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-05-30T15:15:12+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-164673218 — 수신증 사례 — 진단 사례

- 경로: `/cases/case-164673218/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 수신증 사례 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 수신증 사례 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-164673218.json` + `content/bodies/case-164673218.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=164673218&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-ef7cea431dff.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f4a5885b1a29adb8.png](../../research/2026-09-11-yttop/evidence/assets/f4a5885b1a29adb8.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/ultrasound/abdomen/` · `/services/ultrasound/bowel/` · `/conditions/acute-care/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-05-30T15:15:47+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-164673233 — 하복부 통증으로 내원하여 시행한 초음파 — 진단 사례

- 경로: `/cases/case-164673233/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 하복부 통증으로 내원하여 시행한 초음파 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 하복부 통증으로 내원하여 시행한 초음파 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-164673233.json` + `content/bodies/case-164673233.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=164673233&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-615acae38773.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 fcb06669c337a2c4.png](../../research/2026-09-11-yttop/evidence/assets/fcb06669c337a2c4.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/ultrasound/abdomen/` · `/services/ultrasound/bowel/` · `/conditions/acute-care/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-05-30T15:16:07+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-164673242 — 발열 복통으로 내원한 복막염 환자. — 진단 사례

- 경로: `/cases/case-164673242/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 발열 복통으로 내원한 복막염 환자. — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 발열 복통으로 내원한 복막염 환자. — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-164673242.json` + `content/bodies/case-164673242.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=164673242&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-dc641f71b6a7.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 04f89b5ca49e2a38.png](../../research/2026-09-11-yttop/evidence/assets/04f89b5ca49e2a38.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/ultrasound/abdomen/` · `/services/ultrasound/bowel/` · `/conditions/acute-care/` · `/cases/` · `/content-policy/`

**주요 행동:** 현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-05-30T15:16:23+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165150420 — 복강내 종괴 증례 — 진단 사례

- 경로: `/cases/case-165150420/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 복강내 종괴 증례 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 복강내 종괴 증례 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165150420.json` + `content/bodies/case-165150420.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165150420&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-62fe9ad845cd.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 5f0908ad5822f94d.png](../../research/2026-09-11-yttop/evidence/assets/5f0908ad5822f94d.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/ultrasound/abdomen/` · `/services/ultrasound/bowel/` · `/conditions/acute-care/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-09T15:48:03+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165150549 — 대장 베체트 증례 — 진단 사례

- 경로: `/cases/case-165150549/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 대장 베체트 증례 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 대장 베체트 증례 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165150549.json` + `content/bodies/case-165150549.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165150549&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-1a00ed8694b4.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 cabb16f460149fe1.png](../../research/2026-09-11-yttop/evidence/assets/cabb16f460149fe1.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/endoscopy/` · `/services/endoscopy/gastroscopy/` · `/services/endoscopy/colonoscopy/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-09T15:50:09+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165150795 — 폐렴 증례 — 진단 사례

- 경로: `/cases/case-165150795/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 폐렴 증례 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 폐렴 증례 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165150795.json` + `content/bodies/case-165150795.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165150795&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-b319f043e02d.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 8be1092630188b44.png](../../research/2026-09-11-yttop/evidence/assets/8be1092630188b44.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/conditions/acute-care/` · `/conditions/chronic-cough/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-09T15:53:18+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165151140 — 비후성 심근병증 증례 — 진단 사례

- 경로: `/cases/case-165151140/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 비후성 심근병증 증례 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 비후성 심근병증 증례 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165151140.json` + `content/bodies/case-165151140.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165151140&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-626651e1fc00.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 cb3470350357f854.png](../../research/2026-09-11-yttop/evidence/assets/cb3470350357f854.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/heart/` · `/services/heart/echocardiography/` · `/conditions/heart-disease/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-09T16:00:22+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165203625 — 지속되는 두근거림으로 내원하여 진단된 심실빈맥 — 진단 사례

- 경로: `/cases/case-165203625/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 지속되는 두근거림으로 내원하여 진단된 심실빈맥 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 지속되는 두근거림으로 내원하여 진단된 심실빈맥 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165203625.json` + `content/bodies/case-165203625.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165203625&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-cbfeab771280.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 b4f5a3567b7414ce.png](../../research/2026-09-11-yttop/evidence/assets/b4f5a3567b7414ce.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/heart/` · `/services/heart/echocardiography/` · `/conditions/heart-disease/` · `/cases/` · `/content-policy/`

**주요 행동:** 현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-10T16:37:52+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165203941 — 두근거림 호흡곤란으로 내원하여 진단된 심방세동 — 진단 사례

- 경로: `/cases/case-165203941/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 두근거림 호흡곤란으로 내원하여 진단된 심방세동 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 두근거림 호흡곤란으로 내원하여 진단된 심방세동 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165203941.json` + `content/bodies/case-165203941.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165203941&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-c2b1bb3e3cd1.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 8e72c5fb753cfa46.png](../../research/2026-09-11-yttop/evidence/assets/8e72c5fb753cfa46.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/heart/` · `/services/heart/echocardiography/` · `/conditions/heart-disease/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-10T16:40:58+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165204038 — 대변에서 피가 묻어나서 시행한 대장내시경을 통해 진단 대장암 — 진단 사례

- 경로: `/cases/case-165204038/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 대변에서 피가 묻어나서 시행한 대장내시경을 통해 진단 대장암 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 대변에서 피가 묻어나서 시행한 대장내시경을 통해 진단 대장암 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165204038.json` + `content/bodies/case-165204038.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165204038&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-6a7402d90570.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 6654f68efac8a499.png](../../research/2026-09-11-yttop/evidence/assets/6654f68efac8a499.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/endoscopy/` · `/services/endoscopy/gastroscopy/` · `/services/endoscopy/colonoscopy/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-10T16:44:17+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165259713 — 생리통으로 오인된 난소종양 — 진단 사례

- 경로: `/cases/case-165259713/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 생리통으로 오인된 난소종양 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 생리통으로 오인된 난소종양 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165259713.json` + `content/bodies/case-165259713.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165259713&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-4d66ddd6eee7.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 4a15821f62bbfe0c.png](../../research/2026-09-11-yttop/evidence/assets/4a15821f62bbfe0c.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/ultrasound/abdomen/` · `/services/ultrasound/bowel/` · `/conditions/acute-care/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-11T18:22:30+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165259783 — 식도 점막하 종양 — 진단 사례

- 경로: `/cases/case-165259783/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 식도 점막하 종양 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 식도 점막하 종양 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165259783.json` + `content/bodies/case-165259783.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165259783&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-8459cf3ce54a.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 c24d153b10b04efd.png](../../research/2026-09-11-yttop/evidence/assets/c24d153b10b04efd.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/endoscopy/` · `/services/endoscopy/gastroscopy/` · `/services/endoscopy/colonoscopy/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-11T18:23:39+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165259921 — 대동맥 판막협착 및 대동맥판막 역류. — 진단 사례

- 경로: `/cases/case-165259921/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 대동맥 판막협착 및 대동맥판막 역류. — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 대동맥 판막협착 및 대동맥판막 역류. — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165259921.json` + `content/bodies/case-165259921.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165259921&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-9d54bd156b7a.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 1a1e0090b631b988.png](../../research/2026-09-11-yttop/evidence/assets/1a1e0090b631b988.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/heart/` · `/services/heart/echocardiography/` · `/conditions/heart-disease/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-11T18:26:59+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165338662 — 상,하복부 통증으로 내원한 맹장염 — 진단 사례

- 경로: `/cases/case-165338662/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 상,하복부 통증으로 내원한 맹장염 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 상,하복부 통증으로 내원한 맹장염 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165338662.json` + `content/bodies/case-165338662.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165338662&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-13570a51a108.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 05ee42d5de97b0ac.png](../../research/2026-09-11-yttop/evidence/assets/05ee42d5de97b0ac.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/ultrasound/abdomen/` · `/services/ultrasound/bowel/` · `/conditions/acute-care/` · `/cases/` · `/content-policy/`

**주요 행동:** 현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-12T18:28:20+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165338735 — 목에 혹이 만져져요. 림프종 진단사례. — 진단 사례

- 경로: `/cases/case-165338735/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 목에 혹이 만져져요. 림프종 진단사례. — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 목에 혹이 만져져요. 림프종 진단사례. — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165338735.json` + `content/bodies/case-165338735.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165338735&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-4392379aebbe.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 7a46fc90ccd93b06.png](../../research/2026-09-11-yttop/evidence/assets/7a46fc90ccd93b06.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/ultrasound/abdomen/` · `/services/ultrasound/bowel/` · `/conditions/acute-care/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-12T18:30:22+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165396187 — 재발하는 뇌경색으로 내원하여 진단된 심방세동. — 진단 사례

- 경로: `/cases/case-165396187/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 재발하는 뇌경색으로 내원하여 진단된 심방세동. — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 재발하는 뇌경색으로 내원하여 진단된 심방세동. — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165396187.json` + `content/bodies/case-165396187.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165396187&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-a5ba10f88a8f.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 e52c2453e6e51d1a.png](../../research/2026-09-11-yttop/evidence/assets/e52c2453e6e51d1a.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/heart/` · `/services/heart/echocardiography/` · `/conditions/heart-disease/` · `/cases/` · `/content-policy/`

**주요 행동:** 현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-13T15:02:54+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165396249 — 식도궤양 — 진단 사례

- 경로: `/cases/case-165396249/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 식도궤양 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 식도궤양 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165396249.json` + `content/bodies/case-165396249.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165396249&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-c3bca420a6db.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 50d02e0eadc21fea.png](../../research/2026-09-11-yttop/evidence/assets/50d02e0eadc21fea.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/endoscopy/` · `/services/endoscopy/gastroscopy/` · `/services/endoscopy/colonoscopy/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-13T15:04:10+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165396339 — 중증 대동맥판막협착 — 진단 사례

- 경로: `/cases/case-165396339/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 중증 대동맥판막협착 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 중증 대동맥판막협착 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165396339.json` + `content/bodies/case-165396339.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165396339&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-b01357b7f55d.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 6c11923506c8a43b.png](../../research/2026-09-11-yttop/evidence/assets/6c11923506c8a43b.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/heart/` · `/services/heart/echocardiography/` · `/conditions/heart-disease/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-13T15:06:35+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165407798 — 대동맥류를 동반한 이엽성 판막증 — 진단 사례

- 경로: `/cases/case-165407798/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 대동맥류를 동반한 이엽성 판막증 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 대동맥류를 동반한 이엽성 판막증 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165407798.json` + `content/bodies/case-165407798.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165407798&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-c7d99553a3f7.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 8bbd9a9885b95097.png](../../research/2026-09-11-yttop/evidence/assets/8bbd9a9885b95097.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/heart/` · `/services/heart/echocardiography/` · `/conditions/heart-disease/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-13T16:26:01+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165407885 — 궤양성대장염 — 진단 사례

- 경로: `/cases/case-165407885/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 궤양성대장염 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 궤양성대장염 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165407885.json` + `content/bodies/case-165407885.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165407885&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-adacdbf37b61.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 686d8930400f71d9.png](../../research/2026-09-11-yttop/evidence/assets/686d8930400f71d9.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/endoscopy/` · `/services/endoscopy/gastroscopy/` · `/services/endoscopy/colonoscopy/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-13T16:27:50+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-165407958 — 대장용종 절제 사례 — 진단 사례

- 경로: `/cases/case-165407958/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 대장용종 절제 사례 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 대장용종 절제 사례 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-165407958.json` + `content/bodies/case-165407958.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=165407958&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-51bf5faeee7c.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 538fdbc8dd173c5a.png](../../research/2026-09-11-yttop/evidence/assets/538fdbc8dd173c5a.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/endoscopy/` · `/services/endoscopy/gastroscopy/` · `/services/endoscopy/colonoscopy/` · `/cases/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-13T16:29:35+09:00`. 새 의학 검토일로 복사하지 않는다.

## case-167025586 — 심근경색 진단과정 — 진단 사례

- 경로: `/cases/case-167025586/` · 템플릿: `case-detail` · 순서: P2
- 목적: 사례별 진단 과정의 관찰과 일반화 한계를 설명
- title 초안: 심근경색 진단과정 — 진단 사례 | 영통탑내과
- description 초안: 영통탑내과의 심근경색 진단과정 — 진단 사례 안내입니다. 원문 사례 요약, 진단 과정의 순서, 사용 검사와 판단 근거 관련 정보를 확인하세요.
- 입력: `content/pages/case-167025586.json` + `content/bodies/case-167025586.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/21/?bmode=view&idx=167025586&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-78e5c3216fae.md)
- [이미지 212b6d872a9bdf2e.png](../../research/2026-09-11-yttop/evidence/assets/212b6d872a9bdf2e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 24f843c3c3275cc6.png](../../research/2026-09-11-yttop/evidence/assets/24f843c3c3275cc6.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 7363ee9f69ea4bcf.png](../../research/2026-09-11-yttop/evidence/assets/7363ee9f69ea4bcf.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 원문 사례 요약
2. 진단 과정의 순서
3. 사용 검사와 판단 근거
4. 원문 결과 범위
5. 이 사례의 한계
6. 관련 진료 안내

**답변을 작성할 질문**

- 이 사례에서는 무엇을 확인했나요?
- 어떤 검사와 진단 과정이 소개되나요?
- 내 증상도 같은 질환이라는 뜻인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인

**내부 링크:** `/services/heart/` · `/services/heart/echocardiography/` · `/conditions/heart-disease/` · `/cases/` · `/content-policy/`

**주요 행동:** 현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-07-25T14:23:36+09:00`. 새 의학 검토일로 복사하지 않는다.

## checkups — 건강검진 안내

- 경로: `/checkups/` · 템플릿: `checkup-index` · 순서: P0
- 목적: 검진 목적에 따른 준비와 서류 페이지를 연결
- title 초안: 건강검진 안내 | 영통탑내과
- description 초안: 영통탑내과의 건강검진 안내 안내입니다. 검진 종류, 목적별 카드, 예약 전 확인 관련 정보를 확인하세요.
- 입력: `content/pages/checkups.json` + `content/bodies/checkups.md`
- 구조화 데이터: CollectionPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/17)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-640475d9a6fa.md)
- [이미지 848e4b5ed43d2f95.png](../../research/2026-09-11-yttop/evidence/assets/848e4b5ed43d2f95.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검진 종류
2. 목적별 카드
3. 예약 전 확인
4. 준비 안내
5. 결과·서류 문의

**답변을 작성할 질문**

- 국가검진과 채용검진은 어떻게 다른가요?
- 어떤 서류가 필요한가요?
- 금식은 어떻게 확인하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 모든 검진에 같은 금식·발급 시간을 일괄 적용하지 않음

**내부 링크:** `/checkups/national/` · `/checkups/employment/` · `/checkups/drug-screening/` · `/checkups/tuberculosis/` · `/checkups/visa/` · `/checkups/cancer-screening/` · `/health/checkup-preparation-checklist/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## cancer-screening — 암검진 안내

- 경로: `/checkups/cancer-screening/` · 템플릿: `checkup-detail` · 순서: P1
- 목적: 암종별 국가검진 방법과 추가 검사를 구분
- title 초안: 암검진 안내 | 영통탑내과
- description 초안: 영통탑내과의 암검진 안내 안내입니다. 암종별 안내, 대상 확인, 검사별 역할 관련 정보를 확인하세요.
- 입력: `content/pages/cancer-screening.json` + `content/bodies/cancer-screening.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/30)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-32c19f63f158.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 암종별 안내
2. 대상 확인
3. 검사별 역할
4. 준비
5. 결과·추가 검사

**답변을 작성할 질문**

- 암종별 검사 방법은 어떻게 다른가요?
- 대장내시경이 모든 국가검진 대상에게 기본인가요?
- 대상과 주기는 어디서 확인하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 일괄 조기진단·예방 효과 문구 대신 검진의 범위와 한계 확인

**내부 링크:** `/checkups/` · `/checkups/national/` · `/services/endoscopy/` · `/notices/screening-evaluation/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## drug-screening — 마약검사·영문서류

- 경로: `/checkups/drug-screening/` · 템플릿: `checkup-detail` · 순서: P1
- 목적: 검사 항목과 제출기관 요구를 대조하여 안내
- title 초안: 마약검사·영문서류 | 영통탑내과
- description 초안: 영통탑내과의 마약검사·영문서류 안내입니다. 검사 목적, 승인된 항목·버전, 준비물·양식 관련 정보를 확인하세요.
- 입력: `content/pages/drug-screening.json` + `content/bodies/drug-screening.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/33)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7193682cfd01.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 목적
2. 승인된 항목·버전
3. 준비물·양식
4. 검사·발급 절차
5. 영문서류 조건
6. 문의

**답변을 작성할 질문**

- 어떤 항목을 검사하나요?
- 영문 결과지 발급이 가능한가요?
- 검사와 발급은 당일 가능한가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 33번과 최근 공지의 서로 다른 6종 목록 충돌 해결 전 항목 표 공개 금지

**내부 링크:** `/checkups/` · `/checkups/employment/` · `/notices/drug-certificate/` · `/fees/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## employment-checkup — 채용검진·제출 서류

- 경로: `/checkups/employment/` · 템플릿: `checkup-detail` · 순서: P1
- 목적: 제출기관 양식에 맞는 검사와 발급 조건 확인
- title 초안: 채용검진·제출 서류 | 영통탑내과
- description 초안: 영통탑내과의 채용검진·제출 서류 안내입니다. 제출 목적 구분, 양식·신분증, 가능 항목 관련 정보를 확인하세요.
- 입력: `content/pages/employment-checkup.json` + `content/bodies/employment-checkup.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/32)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7edf29d95df7.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 제출 목적 구분
2. 양식·신분증
3. 가능 항목
4. 검사 준비
5. 발급 절차·비용 조건

**답변을 작성할 질문**

- 회사 양식을 가져가야 하나요?
- 당일 발급이 가능한가요?
- 모든 면허·기관용 서류가 가능한가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 공무원·선원·보건증 등 지정 요건을 일반 발급과 혼동하지 않음

**내부 링크:** `/checkups/` · `/checkups/drug-screening/` · `/checkups/tuberculosis/` · `/checkups/visa/` · `/fees/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## national-checkup — 국가건강검진

- 경로: `/checkups/national/` · 템플릿: `checkup-detail` · 순서: P0
- 목적: 국가검진 대상 확인과 병원의 실제 검진 절차 안내
- title 초안: 국가건강검진 | 영통탑내과
- description 초안: 영통탑내과의 국가건강검진 안내입니다. 대상 확인 방법, 실제 검사 항목, 예약·신분 확인 관련 정보를 확인하세요.
- 입력: `content/pages/national-checkup.json` + `content/bodies/national-checkup.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/31)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7fc0feffaab5.md)
- [이미지 848e4b5ed43d2f95.png](../../research/2026-09-11-yttop/evidence/assets/848e4b5ed43d2f95.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 대상 확인 방법
2. 실제 검사 항목
3. 예약·신분 확인
4. 검사별 준비
5. 결과 안내
6. 추가 검사 구분

**답변을 작성할 질문**

- 검진 대상인지 어떻게 확인하나요?
- 무엇을 준비해야 하나요?
- 금식이 필요한가요?
- 결과는 어떻게 받나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 기존 연령·주기·지원 조건은 최신 공식 근거와 의료진 대조

**내부 링크:** `/checkups/` · `/checkups/cancer-screening/` · `/health/checkup-preparation-checklist/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## tuberculosis-screening — 기숙사 결핵검진

- 경로: `/checkups/tuberculosis/` · 템플릿: `checkup-detail` · 순서: P1
- 목적: 기숙사 제출용 검사의 조건과 준비물 설명
- title 초안: 기숙사 결핵검진 | 영통탑내과
- description 초안: 영통탑내과의 기숙사 결핵검진 안내입니다. 제출 목적, 필요 서류, 검사 종류 관련 정보를 확인하세요.
- 입력: `content/pages/tuberculosis-screening.json` + `content/bodies/tuberculosis-screening.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/34)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7a26c228e179.md)
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 a3d3476ee3b65f8e.png](../../research/2026-09-11-yttop/evidence/assets/a3d3476ee3b65f8e.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 제출 목적
2. 필요 서류
3. 검사 종류
4. 예약·준비
5. 결과지·유효기간 문의

**답변을 작성할 질문**

- 기숙사 양식이 필요한가요?
- 어떤 결핵검사를 하나요?
- 결과지는 언제 발급되나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 흉부 X선·잠복결핵검사를 임의로 같은 것으로 설명하지 않음

**내부 링크:** `/checkups/` · `/checkups/employment/` · `/fees/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## visa-checkup — 외국인 비자검진

- 경로: `/checkups/visa/` · 템플릿: `checkup-detail` · 순서: P1
- 목적: 비자 유형과 제출기관별 확인 절차 안내
- title 초안: 외국인 비자검진 | 영통탑내과
- description 초안: 영통탑내과의 외국인 비자검진 안내입니다. 가능한 검진 범위, 비자·제출처 확인, 신분증·서류 관련 정보를 확인하세요.
- 입력: `content/pages/visa-checkup.json` + `content/bodies/visa-checkup.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/35)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-4123e08409fa.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 가능한 검진 범위
2. 비자·제출처 확인
3. 신분증·서류
4. 검사 준비
5. 발급 절차

**답변을 작성할 질문**

- 어떤 비자 검진이 가능한가요?
- 여권이나 사진이 필요한가요?
- 영문서류도 가능한가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 국가·비자 유형별 지정기관 조건과 실제 시행 여부 확인

**내부 링크:** `/checkups/` · `/checkups/drug-screening/` · `/fees/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## conditions — 내과 진료 안내

- 경로: `/conditions/` · 템플릿: `condition-index` · 순서: P1
- 목적: 증상·질환 정보에서 실제 진료와 긴급 평가를 구분
- title 초안: 내과 진료 안내 | 영통탑내과
- description 초안: 영통탑내과의 내과 진료 안내 안내입니다. 진료 분야, 증상별 안내 링크, 검사 연결 관련 정보를 확인하세요.
- 입력: `content/pages/conditions.json` + `content/bodies/conditions.md`
- 구조화 데이터: CollectionPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/20)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-d8536f70a71b.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 진료 분야
2. 증상별 안내 링크
3. 검사 연결
4. 위험 신호
5. 방문 준비

**답변을 작성할 질문**

- 어떤 내과 질환을 상담하나요?
- 어떤 검사를 연결하나요?
- 긴급한 증상은 어떻게 해야 하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 20번의 만성기침 본문을 허브에서 전부 복제하지 않음

**내부 링크:** `/conditions/chronic-cough/` · `/conditions/heart-disease/` · `/conditions/acute-care/` · `/services/cancer-support/` · `/services/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## acute-care — 급성기질환 진료

- 경로: `/conditions/acute-care/` · 템플릿: `condition-detail` · 순서: P1
- 목적: 급성 증상 설명과 현장 진료·전원 가능 범위 구분
- title 초안: 급성기질환 진료 | 영통탑내과
- description 초안: 영통탑내과의 급성기질환 진료 안내입니다. 진료 범위, 증상별 상담, 검사·평가 관련 정보를 확인하세요.
- 입력: `content/pages/acute-care.json` + `content/bodies/acute-care.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/46)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-6869edd4935c.md)
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 a3d3476ee3b65f8e.png](../../research/2026-09-11-yttop/evidence/assets/a3d3476ee3b65f8e.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 진료 범위
2. 증상별 상담
3. 검사·평가
4. 긴급 행동
5. 타 기관 연계 범위

**답변을 작성할 질문**

- 어떤 급성 증상을 진료하나요?
- 검사 후 다른 병원으로 갈 수 있나요?
- 언제 응급 평가가 필요한가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 복막염 등 원문 질환 목록을 모두 원내 치료 가능하다는 뜻으로 옮기지 않음

**내부 링크:** `/conditions/` · `/services/ultrasound/bowel/` · `/services/ultrasound/abdomen/` · `/visit/`

**주요 행동:** 현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## chronic-cough — 만성기침 진료

- 경로: `/conditions/chronic-cough/` · 템플릿: `condition-detail` · 순서: P1
- 목적: 기침 지속 시 평가 과정과 진료 준비 설명
- title 초안: 만성기침 진료 | 영통탑내과
- description 초안: 영통탑내과의 만성기침 진료 안내입니다. 지속 기침 설명, 상담 시 확인 정보, 평가 과정 관련 정보를 확인하세요.
- 입력: `content/pages/chronic-cough.json` + `content/bodies/chronic-cough.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/28)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-dbea466485fd.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 지속 기침 설명
2. 상담 시 확인 정보
3. 평가 과정
4. 위험 신호
5. 진료 준비

**답변을 작성할 질문**

- 기침이 계속되면 어떤 정보를 준비하나요?
- 원인은 어떻게 확인하나요?
- 어떤 증상은 빨리 평가받아야 하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 기간 정의와 위험 신호 의료 검수; 온라인 자가진단 양식 제외

**내부 링크:** `/conditions/` · `/conditions/acute-care/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## heart-disease — 심장질환 진료

- 경로: `/conditions/heart-disease/` · 템플릿: `condition-detail` · 순서: P1
- 목적: 흉부 증상·두근거림 평가의 범위와 긴급 행동 설명
- title 초안: 심장질환 진료 | 영통탑내과
- description 초안: 영통탑내과의 심장질환 진료 안내입니다. 진료 범위, 확인할 증상 정보, 검사 역할 관련 정보를 확인하세요.
- 입력: `content/pages/heart-disease.json` + `content/bodies/heart-disease.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/29)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-3c0235a5aba9.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 6c41e5cc5a028c5e.png](../../research/2026-09-11-yttop/evidence/assets/6c41e5cc5a028c5e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 진료 범위
2. 확인할 증상 정보
3. 검사 역할
4. 긴급 행동
5. 검사·의료진 연결

**답변을 작성할 질문**

- 두근거림은 어떻게 평가하나요?
- 어떤 심장검사가 있나요?
- 가슴 통증이 있을 때 예약을 기다려도 되나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 예약보다 즉시 평가가 필요한 문맥을 구분하며 CTA 의료 검수

**내부 링크:** `/conditions/` · `/services/heart/` · `/health/palpitations-test-followup/` · `/doctors/park-jongseol/`

**주요 행동:** 현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## content-policy — 의료정보 작성·검수 원칙

- 경로: `/content-policy/` · 템플릿: `policy` · 순서: P0
- 목적: 출처·집필·검수·정정 책임을 공개
- title 초안: 의료정보 작성·검수 원칙 | 영통탑내과
- description 초안: 영통탑내과의 의료정보 작성·검수 원칙 안내입니다. 작성 목적, 집필자와 검수자, 근거 관리 관련 정보를 확인하세요.
- 입력: `content/pages/content-policy.json` + `content/bodies/content-policy.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/48)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-633110709766.md)
- [이미지 988305921ed3aadb.png](../../research/2026-09-11-yttop/evidence/assets/988305921ed3aadb.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 e81e2ee6b0f06e71.png](../../research/2026-09-11-yttop/evidence/assets/e81e2ee6b0f06e71.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 27a64c774e590f55.jpg](../../research/2026-09-11-yttop/evidence/assets/27a64c774e590f55.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 작성 목적
2. 집필자와 검수자
3. 근거 관리
4. 검토일 의미
5. 사례 원칙
6. 정정 문의

**답변을 작성할 질문**

- 의료정보는 누가 검수하나요?
- 오류를 발견하면 어떻게 알리나요?
- 개인 진료를 대신하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 실제로 없는 검수위원회·외부 인증 절차를 만들지 않음

**내부 링크:** `/doctors/` · `/health/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## doctors — 의료진 소개

- 경로: `/doctors/` · 템플릿: `physician-index` · 순서: P0
- 목적: 현재 의료진과 진료 분야를 구분
- title 초안: 의료진 소개 | 영통탑내과
- description 초안: 영통탑내과의 의료진 소개 안내입니다. 현재 의료진 카드, 전문과목 구분, 프로필 연결 관련 정보를 확인하세요.
- 입력: `content/pages/doctors.json` + `content/bodies/doctors.md`
- 구조화 데이터: CollectionPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/48)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-633110709766.md)
- [이미지 2d2fd518e1de33ef.jpg](../../research/2026-09-11-yttop/evidence/assets/2d2fd518e1de33ef.jpg) — 육안 대조한 사용 후보
- [이미지 42d82d647291539a.jpg](../../research/2026-09-11-yttop/evidence/assets/42d82d647291539a.jpg) — 육안 대조한 사용 후보

**본문 순서**

1. 현재 의료진 카드
2. 전문과목 구분
3. 프로필 연결
4. 진료 일정 문의

**답변을 작성할 질문**

- 현재 의료진은 누구인가요?
- 의료진별 전문과목은 무엇인가요?
- 의료진별 일정은 어디에서 확인하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 48 현행과 MAIN2 이전 의료진 혼합 금지

**내부 링크:** `/doctors/park-jongseol/` · `/doctors/park-rayoung/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## doctor-park-jongseol — 박종설 대표원장

- 경로: `/doctors/park-jongseol/` · 템플릿: `physician-detail` · 순서: P0
- 목적: 현재 소개의 내과 전문의 경력과 담당 분야를 분리해 설명
- title 초안: 박종설 대표원장 | 영통탑내과
- description 초안: 영통탑내과의 박종설 대표원장 안내입니다. 이름·사진, 전문과목, 경력 관련 정보를 확인하세요.
- 입력: `content/pages/doctor-park-jongseol.json` + `content/bodies/doctor-park-jongseol.md`
- 구조화 데이터: ProfilePage + Person + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/48)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-633110709766.md)
- [이미지 2d2fd518e1de33ef.jpg](../../research/2026-09-11-yttop/evidence/assets/2d2fd518e1de33ef.jpg) — 육안 대조한 사용 후보

**본문 순서**

1. 이름·사진
2. 전문과목
3. 경력
4. 인증과 학회 소속
5. 담당 진료
6. 실제 집필·검수 글

**답변을 작성할 질문**

- 전문과목과 경력은 무엇인가요?
- 어떤 진료를 담당하나요?
- 진료 일정은 어디서 확인하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 박종설 글의 실제 집필·검수 여부 확인; 자격과 학회 회원 구분

**내부 링크:** `/doctors/` · `/services/heart/` · `/services/endoscopy/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## doctor-park-rayoung — 박라영 원장

- 경로: `/doctors/park-rayoung/` · 템플릿: `physician-detail` · 순서: P0
- 목적: 현재 소개의 가정의학과 전문의 경력과 담당 분야를 설명
- title 초안: 박라영 원장 | 영통탑내과
- description 초안: 영통탑내과의 박라영 원장 안내입니다. 이름·실루엣 안내, 전문과목, 경력 관련 정보를 확인하세요.
- 입력: `content/pages/doctor-park-rayoung.json` + `content/bodies/doctor-park-rayoung.md`
- 구조화 데이터: ProfilePage + Person + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/48)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-633110709766.md)
- [이미지 42d82d647291539a.jpg](../../research/2026-09-11-yttop/evidence/assets/42d82d647291539a.jpg) — 육안 대조한 사용 후보

**본문 순서**

1. 이름·실루엣 안내
2. 전문과목
3. 경력
4. 인정의와 학회 소속
5. 담당 진료
6. 일정 문의

**답변을 작성할 질문**

- 전문과목과 경력은 무엇인가요?
- 어떤 진료를 담당하나요?
- 사진 대신 어떤 안내가 제공되나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 기존 자료는 실루엣 이미지; 실제 얼굴 사진으로 표기하거나 새 얼굴 생성 금지

**내부 링크:** `/doctors/` · `/checkups/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## fees — 비용·서류 발급 안내

- 경로: `/fees/` · 템플릿: `fees` · 순서: P1
- 목적: 확인된 항목별 비용과 적용 조건 설명
- title 초안: 비용·서류 발급 안내 | 영통탑내과
- description 초안: 영통탑내과의 비용·서류 발급 안내 안내입니다. 기준일, 항목별 비용, 포함·제외 관련 정보를 확인하세요.
- 입력: `content/pages/fees.json` + `content/bodies/fees.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-db394c63d966.md)
- [이미지 3940fdda35ddaccb.jpg](../../research/2026-09-11-yttop/evidence/assets/3940fdda35ddaccb.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f728d93fe9a7ac8b.jpg](../../research/2026-09-11-yttop/evidence/assets/f728d93fe9a7ac8b.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 4b07624a614ff2dd.jpg](../../research/2026-09-11-yttop/evidence/assets/4b07624a614ff2dd.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 기준일
2. 항목별 비용
3. 포함·제외
4. 기간·조건
5. 서류 비용
6. 문의

**답변을 작성할 질문**

- 검사 비용에 어떤 항목이 포함되나요?
- 수면비와 검사 총액은 다른가요?
- 서류 발급 비용은 얼마인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 이벤트 수면비를 상시 검사 총액으로 변환 금지; 미확정 가격은 숫자로 노출하지 않음

**내부 링크:** `/checkups/` · `/services/endoscopy/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## health — 검사·진료 이해하기

- 경로: `/health/` · 템플릿: `article-index` · 순서: P1
- 목적: 반복 질문의 상세 설명을 탐색
- title 초안: 검사·진료 이해하기 | 영통탑내과
- description 초안: 영통탑내과의 검사·진료 이해하기 안내입니다. 주제별 안내, 질문과 설명 요약, 의료 검수 정보 관련 정보를 확인하세요.
- 입력: `content/pages/health.json` + `content/bodies/health.md`
- 구조화 데이터: CollectionPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/23)
- [기존 페이지](https://yttop.co.kr/36)
- [기존 페이지](https://yttop.co.kr/31)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-ac95c5ac1753.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7fc0feffaab5.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-1f24db63fa2c.md)
- [이미지 848e4b5ed43d2f95.png](../../research/2026-09-11-yttop/evidence/assets/848e4b5ed43d2f95.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 주제별 안내
2. 질문과 설명 요약
3. 의료 검수 정보
4. 관련 서비스

**답변을 작성할 질문**

- 검사 차이는 어디서 확인하나요?
- 검진 전 준비는 어떻게 확인하나요?
- 글은 누가 검수하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 질문 빈도 미검증 자료를 고빈도 통계처럼 표시하지 않음

**내부 링크:** `/health/heart-test-differences/` · `/health/palpitations-test-followup/` · `/health/checkup-preparation-checklist/` · `/health/colonoscopy-preparation-questions/` · `/content-policy/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## checkup-preparation — 건강검진 전 준비 확인표

- 경로: `/health/checkup-preparation-checklist/` · 템플릿: `article-detail` · 순서: P1
- 목적: 검사 조합별 준비와 예약 확인의 책임을 구분
- title 초안: 건강검진 전 준비 확인표 | 영통탑내과
- description 초안: 영통탑내과의 건강검진 전 준비 확인표 안내입니다. 검진 항목 확인, 식사·음료 질문, 복용약 상담 관련 정보를 확인하세요.
- 입력: `content/pages/checkup-preparation.json` + `content/bodies/checkup-preparation.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/31)
- [기존 페이지](https://yttop.co.kr/32)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7fc0feffaab5.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7edf29d95df7.md)
- [이미지 848e4b5ed43d2f95.png](../../research/2026-09-11-yttop/evidence/assets/848e4b5ed43d2f95.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검진 항목 확인
2. 식사·음료 질문
3. 복용약 상담
4. 신분증·서류
5. 당일 동선
6. 문의 체크리스트

**답변을 작성할 질문**

- 모든 검진의 금식이 같나요?
- 복용약은 어떻게 확인하나요?
- 무엇을 가져가야 하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 검사 시각·진정 조건 없는 단일 금식 시간표 금지; 약 중단 자동 안내 금지

**내부 링크:** `/checkups/national/` · `/checkups/employment/` · `/services/endoscopy/` · `/visit/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## colonoscopy-preparation — 대장내시경 준비 시 확인할 질문

- 경로: `/health/colonoscopy-preparation-questions/` · 템플릿: `article-detail` · 순서: P1
- 목적: 음식·음료·정결제·진정 조건별 병원 준비 지침을 설명
- title 초안: 대장내시경 준비 시 확인할 질문 | 영통탑내과
- description 초안: 영통탑내과의 대장내시경 준비 시 확인할 질문 안내입니다. 검사 일정·진정 확인, 음식과 음료 구분, 정결제별 안내 연결 관련 정보를 확인하세요.
- 입력: `content/pages/colonoscopy-preparation.json` + `content/bodies/colonoscopy-preparation.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/30)
- [기존 페이지](https://yttop.co.kr/31)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-32c19f63f158.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7fc0feffaab5.md)
- [이미지 848e4b5ed43d2f95.png](../../research/2026-09-11-yttop/evidence/assets/848e4b5ed43d2f95.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 일정·진정 확인
2. 음식과 음료 구분
3. 정결제별 안내 연결
4. 복용 어려움 문의
5. 보호자·귀가
6. 준비 확인

**답변을 작성할 질문**

- 물과 커피는 어떻게 확인하나요?
- 정결제를 다 먹기 어려우면 어떻게 하나요?
- 보호자와 귀가는 어떻게 준비하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 정결제·시간별 복용표는 승인된 병원 지침 없으면 게시하지 않음; 외부 Q&A 인기도 미확인

**내부 링크:** `/services/endoscopy/colonoscopy/` · `/services/endoscopy/` · `/health/checkup-preparation-checklist/` · `/visit/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## heart-test-differences — 심전도·심장초음파·홀터검사의 차이

- 경로: `/health/heart-test-differences/` · 템플릿: `article-detail` · 순서: P1
- 목적: 검사 비교에 집중하고 실제 예약 안내는 서비스 페이지가 소유
- title 초안: 심전도·심장초음파·홀터검사의 차이 | 영통탑내과
- description 초안: 영통탑내과의 심전도·심장초음파·홀터검사의 차이 안내입니다. 검사별 기록 대상, 비교 표, 검사 결과가 다른 이유 관련 정보를 확인하세요.
- 입력: `content/pages/heart-test-differences.json` + `content/bodies/heart-test-differences.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/23)
- [기존 페이지](https://yttop.co.kr/36)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-ac95c5ac1753.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-1f24db63fa2c.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 6c41e5cc5a028c5e.png](../../research/2026-09-11-yttop/evidence/assets/6c41e5cc5a028c5e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사별 기록 대상
2. 비교 표
3. 검사 결과가 다른 이유
4. 공통 한계
5. 검사 페이지 연결

**답변을 작성할 질문**

- 심전도와 초음파 중 어느 것이 더 정확한가요?
- 홀터검사는 무엇이 다른가요?
- 정상 결과면 모든 질환이 배제되나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 동일한 정확도 순위로 줄 세우지 않음; Q&A 답변 복사 금지

**내부 링크:** `/services/heart/echocardiography/` · `/services/heart/holter/` · `/services/heart/` · `/content-policy/`

**주요 행동:** 관련 진료 안내

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## palpitations-followup — 검사 후에도 두근거림이 계속될 때 확인할 점

- 경로: `/health/palpitations-test-followup/` · 템플릿: `article-detail` · 순서: P1
- 목적: 증상 포착과 결과 설명의 한계를 이해하도록 도움
- title 초안: 검사 후에도 두근거림이 계속될 때 확인할 점 | 영통탑내과
- description 초안: 영통탑내과의 검사 후에도 두근거림이 계속될 때 확인할 점 안내입니다. 질문의 범위, 검사 중 증상 여부, 기록해 갈 정보 관련 정보를 확인하세요.
- 입력: `content/pages/palpitations-followup.json` + `content/bodies/palpitations-followup.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/36)
- [기존 페이지](https://yttop.co.kr/29)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-3c0235a5aba9.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-1f24db63fa2c.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 6c41e5cc5a028c5e.png](../../research/2026-09-11-yttop/evidence/assets/6c41e5cc5a028c5e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 질문의 범위
2. 검사 중 증상 여부
3. 기록해 갈 정보
4. 진료에서 확인할 점
5. 긴급 행동
6. 관련 검사

**답변을 작성할 질문**

- 홀터검사 때 증상이 없었다면 어떻게 이해하나요?
- 진료 전 무엇을 기록하나요?
- 어떤 증상은 긴급 평가가 필요한가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 검사 없이 개인 부정맥을 진단하거나 안심시키는 문장 제외

**내부 링크:** `/services/heart/holter/` · `/conditions/heart-disease/` · `/visit/`

**주요 행동:** 현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## notices — 공지사항

- 경로: `/notices/` · 템플릿: `notice-index` · 순서: P0
- 목적: 현재 유효한 운영 변경과 과거 기록 구분
- title 초안: 공지사항 | 영통탑내과
- description 초안: 영통탑내과의 공지사항 안내입니다. 유효 공지, 종료 공지 구분, 분류 관련 정보를 확인하세요.
- 입력: `content/pages/notices.json` + `content/bodies/notices.md`
- 구조화 데이터: CollectionPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/44)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-3d3e7b3ccb84.md)
- [이미지 27f204147f443b15.png](../../research/2026-09-11-yttop/evidence/assets/27f204147f443b15.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 8cd0566b02c3a055.png](../../research/2026-09-11-yttop/evidence/assets/8cd0566b02c3a055.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 유효 공지
2. 종료 공지 구분
3. 분류
4. 게시일·적용일
5. 방문 안내

**답변을 작성할 질문**

- 현재 휴진 안내가 있나요?
- 검사나 서류 안내는 어디서 확인하나요?
- 과거 공지인지 어떻게 구분하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 게시일과 적용일 구분; 과거 공지를 현재 휴진에 합산하지 않음

**내부 링크:** `/visit/` · `/notices/screening-evaluation/` · `/notices/drug-certificate/` · `/notices/pathfast/` · `/notices/closure-2025-06-24/` · `/notices/mammography-equipment/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## notice-closure-20250624 — 2025년 6월 24일 오후 휴진 기록

- 경로: `/notices/closure-2025-06-24/` · 템플릿: `notice-detail` · 순서: P0
- 목적: 기존 공지의 사실과 적용 범위를 설명
- title 초안: 2025년 6월 24일 오후 휴진 기록 | 영통탑내과
- description 초안: 영통탑내과의 2025년 6월 24일 오후 휴진 기록 안내입니다. 종료 안내, 당시 적용일·의료진, 원래 공지 관련 정보를 확인하세요.
- 입력: `content/pages/notice-closure-20250624.json` + `content/bodies/notice-closure-20250624.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 아니오

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/44/?bmode=view&idx=165787604&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-bcfbbcb79756.md)
- [이미지 27f204147f443b15.png](../../research/2026-09-11-yttop/evidence/assets/27f204147f443b15.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 8cd0566b02c3a055.png](../../research/2026-09-11-yttop/evidence/assets/8cd0566b02c3a055.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 dd486d2842e3fa96.jpg](../../research/2026-09-11-yttop/evidence/assets/dd486d2842e3fa96.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 종료 안내
2. 당시 적용일·의료진
3. 원래 공지
4. 현재 진료 안내

**답변을 작성할 질문**

- 현재도 적용되는 휴진인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 과거 공지로 보존; 현재 휴진과 XML sitemap에서 제외

**내부 링크:** `/visit/` · `/notices/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-20T16:17:28+09:00`. 새 의학 검토일로 복사하지 않는다.

## notice-drug-certificate — 마약검사 영문서류 발급 안내

- 경로: `/notices/drug-certificate/` · 템플릿: `notice-detail` · 순서: P0
- 목적: 기존 공지의 사실과 적용 범위를 설명
- title 초안: 마약검사 영문서류 발급 안내 | 영통탑내과
- description 초안: 영통탑내과의 마약검사 영문서류 발급 안내 안내입니다. 발급 목적, 제출기관 양식, 검사 항목 버전 관련 정보를 확인하세요.
- 입력: `content/pages/notice-drug-certificate.json` + `content/bodies/notice-drug-certificate.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/44/?bmode=view&idx=172420773&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-17e441447746.md)
- [이미지 27f204147f443b15.png](../../research/2026-09-11-yttop/evidence/assets/27f204147f443b15.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 8cd0566b02c3a055.png](../../research/2026-09-11-yttop/evidence/assets/8cd0566b02c3a055.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 659eeb037ef62b8f.jpg](../../research/2026-09-11-yttop/evidence/assets/659eeb037ef62b8f.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 발급 목적
2. 제출기관 양식
3. 검사 항목 버전
4. 발급 조건
5. 검사 안내

**답변을 작성할 질문**

- 영문서류는 어떤 조건에서 발급되나요?
- 제출기관 양식이 필요한가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 6종 목록 충돌 해결 후 검사 페이지 단일 원장 참조

**내부 링크:** `/checkups/drug-screening/` · `/checkups/employment/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2026-07-14T12:33:16+09:00`. 새 의학 검토일로 복사하지 않는다.

## notice-mammography — 디지털 유방촬영 장비 도입 안내

- 경로: `/notices/mammography-equipment/` · 템플릿: `notice-detail` · 순서: P0
- 목적: 기존 공지의 사실과 적용 범위를 설명
- title 초안: 디지털 유방촬영 장비 도입 안내 | 영통탑내과
- description 초안: 영통탑내과의 디지털 유방촬영 장비 도입 안내 안내입니다. 장비 도입, 모델명, 관련 검진 관련 정보를 확인하세요.
- 입력: `content/pages/notice-mammography.json` + `content/bodies/notice-mammography.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/44/?bmode=view&idx=165253784&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-b87a0477e07a.md)
- [이미지 27f204147f443b15.png](../../research/2026-09-11-yttop/evidence/assets/27f204147f443b15.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 8cd0566b02c3a055.png](../../research/2026-09-11-yttop/evidence/assets/8cd0566b02c3a055.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 660cd26eace832ca.jpg](../../research/2026-09-11-yttop/evidence/assets/660cd26eace832ca.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 장비 도입
2. 모델명
3. 관련 검진
4. 검사 안내

**답변을 작성할 질문**

- 어떤 장비를 도입했나요?
- 어떤 검진에 사용하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 장비 도입 사실과 진단 성능·검사 대상 판단을 구분

**내부 링크:** `/checkups/national/` · `/checkups/cancer-screening/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-11T16:32:19+09:00`. 새 의학 검토일로 복사하지 않는다.

## notice-pathfast — 심장 표지자 검사 장비 도입 안내

- 경로: `/notices/pathfast/` · 템플릿: `notice-detail` · 순서: P0
- 목적: 기존 공지의 사실과 적용 범위를 설명
- title 초안: 심장 표지자 검사 장비 도입 안내 | 영통탑내과
- description 초안: 영통탑내과의 심장 표지자 검사 장비 도입 안내 안내입니다. 도입 사실, 장비명, 실제 운영 항목 관련 정보를 확인하세요.
- 입력: `content/pages/notice-pathfast.json` + `content/bodies/notice-pathfast.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/44/?bmode=view&idx=166166318&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-3aadf659fd5d.md)
- [이미지 27f204147f443b15.png](../../research/2026-09-11-yttop/evidence/assets/27f204147f443b15.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 8cd0566b02c3a055.png](../../research/2026-09-11-yttop/evidence/assets/8cd0566b02c3a055.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 c4b1dc0024e54b32.jpg](../../research/2026-09-11-yttop/evidence/assets/c4b1dc0024e54b32.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 도입 사실
2. 장비명
3. 실제 운영 항목
4. 검사 한계
5. 관련 안내

**답변을 작성할 질문**

- 어떤 장비를 도입했나요?
- 어떤 검사와 관련되나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 시간·정확도·심근경색 배제 단정 문구 검수

**내부 링크:** `/services/heart/cardiac-markers/` · `/services/heart/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2025-06-26T10:23:10+09:00`. 새 의학 검토일로 복사하지 않는다.

## notice-screening-evaluation — 국가검진기관 평가 안내

- 경로: `/notices/screening-evaluation/` · 템플릿: `notice-detail` · 순서: P0
- 목적: 기존 공지의 사실과 적용 범위를 설명
- title 초안: 국가검진기관 평가 안내 | 영통탑내과
- description 초안: 영통탑내과의 국가검진기관 평가 안내 안내입니다. 평가 부문·회차·기간, 공식 증빙, 의미와 범위 관련 정보를 확인하세요.
- 입력: `content/pages/notice-screening-evaluation.json` + `content/bodies/notice-screening-evaluation.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/44/?bmode=view&idx=172420973&t=board)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-8a81def8eb2e.md)
- [이미지 27f204147f443b15.png](../../research/2026-09-11-yttop/evidence/assets/27f204147f443b15.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 8cd0566b02c3a055.png](../../research/2026-09-11-yttop/evidence/assets/8cd0566b02c3a055.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 de3559e00beab695.jpg](../../research/2026-09-11-yttop/evidence/assets/de3559e00beab695.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 평가 부문·회차·기간
2. 공식 증빙
3. 의미와 범위
4. 관련 검진

**답변을 작성할 질문**

- 어떤 부문에 대한 평가인가요?
- 평가 기간과 근거는 무엇인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 간암·위암 부문을 모든 검진 분야로 확대하지 않음

**내부 링크:** `/checkups/national/` · `/checkups/cancer-screening/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

원본 게시 메타: `2026-07-14T12:44:19+09:00`. 새 의학 검토일로 복사하지 않는다.

## privacy — 개인정보 처리 안내

- 경로: `/privacy/` · 템플릿: `policy` · 순서: P0
- 목적: 실제 사이트와 외부 서비스의 정보 처리 범위를 설명
- title 초안: 개인정보 처리 안내 | 영통탑내과
- description 초안: 영통탑내과의 개인정보 처리 안내 안내입니다. 운영 주체, 폼 수집 여부, 호스팅·외부 링크 관련 정보를 확인하세요.
- 입력: `content/pages/privacy.json` + `content/bodies/privacy.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-db394c63d966.md)
- [이미지 3940fdda35ddaccb.jpg](../../research/2026-09-11-yttop/evidence/assets/3940fdda35ddaccb.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f728d93fe9a7ac8b.jpg](../../research/2026-09-11-yttop/evidence/assets/f728d93fe9a7ac8b.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 4b07624a614ff2dd.jpg](../../research/2026-09-11-yttop/evidence/assets/4b07624a614ff2dd.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 운영 주체
2. 폼 수집 여부
3. 호스팅·외부 링크
4. 분석 도구 설정
5. 문의·변경일

**답변을 작성할 질문**

- 사이트에서 개인정보를 입력하나요?
- 외부 지도 서비스로 이동하나요?
- 분석 도구를 사용하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 백엔드가 없다는 이유로 호스팅 로그까지 수집이 전혀 없다고 단정하지 않음

**내부 링크:** `/content-policy/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## search — 사이트 검색

- 경로: `/search/` · 템플릿: `search` · 순서: P2
- 목적: 승인된 공개 문서의 제목·본문을 로컬 검색
- title 초안: 사이트 검색 | 영통탑내과
- description 초안: 영통탑내과의 사이트 검색 안내입니다. 검색 입력, 결과 수, 제목·발췌 관련 정보를 확인하세요.
- 입력: `content/pages/search.json` + `content/bodies/search.md`
- 구조화 데이터: CollectionPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 아니오

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-db394c63d966.md)
- [이미지 3940fdda35ddaccb.jpg](../../research/2026-09-11-yttop/evidence/assets/3940fdda35ddaccb.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f728d93fe9a7ac8b.jpg](../../research/2026-09-11-yttop/evidence/assets/f728d93fe9a7ac8b.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 4b07624a614ff2dd.jpg](../../research/2026-09-11-yttop/evidence/assets/4b07624a614ff2dd.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검색 입력
2. 결과 수
3. 제목·발췌
4. 빈 결과
5. 관련 허브

**답변을 작성할 질문**

- 원하는 검사 안내를 어떻게 찾나요?
- 검색어는 서버로 보내나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 브라우저 내 검색; 원문 환자 사연·미공개 글·자유 검색어 분석 전송 없음

**내부 링크:** `/services/` · `/checkups/` · `/health/` · `/sitemap/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## services — 진료·검사 안내

- 경로: `/services/` · 템플릿: `service-index` · 순서: P0
- 목적: 심장·초음파·내시경·내과 진료를 실제 제공 범위로 안내
- title 초안: 진료·검사 안내 | 영통탑내과
- description 초안: 영통탑내과의 진료·검사 안내 안내입니다. 진료 분류, 분류별 설명·카드, 검사 선택의 한계 관련 정보를 확인하세요.
- 입력: `content/pages/services.json` + `content/bodies/services.md`
- 구조화 데이터: CollectionPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/18)
- [기존 페이지](https://yttop.co.kr/24)
- [기존 페이지](https://yttop.co.kr/20)
- [기존 페이지](https://yttop.co.kr/47)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-cc6a8782fb53.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-d8536f70a71b.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-0d2f9d9a903c.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-97cd7f139f7c.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 진료 분류
2. 분류별 설명·카드
3. 검사 선택의 한계
4. 문의 안내

**답변을 작성할 질문**

- 어떤 검사가 가능한가요?
- 검사는 어떻게 선택하나요?
- 건강검진과 진료는 어디서 확인하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 질환 설명과 모든 상황의 현장 치료 가능 여부를 구분

**내부 링크:** `/services/heart/` · `/services/ultrasound/` · `/services/endoscopy/` · `/conditions/` · `/services/cancer-support/` · `/checkups/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## cancer-support — 암환자 진료·케어 안내

- 경로: `/services/cancer-support/` · 템플릿: `service-detail` · 순서: P1
- 목적: 제공하는 지지 진료 범위와 주치료 관계 설명
- title 초안: 암환자 진료·케어 안내 | 영통탑내과
- description 초안: 영통탑내과의 암환자 진료·케어 안내 안내입니다. 제공 범위, 대상·상담, 주치료와의 관계 관련 정보를 확인하세요.
- 입력: `content/pages/cancer-support.json` + `content/bodies/cancer-support.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/47)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-97cd7f139f7c.md)
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 a3d3476ee3b65f8e.png](../../research/2026-09-11-yttop/evidence/assets/a3d3476ee3b65f8e.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 제공 범위
2. 대상·상담
3. 주치료와의 관계
4. 근거·한계
5. 준비·문의

**답변을 작성할 질문**

- 어떤 진료를 받을 수 있나요?
- 기존 항암치료와 어떻게 조율하나요?
- 치료 효과와 한계는 무엇인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 면역치료·케모포트·통증 관리의 실제 범위 확인; 근거 없는 생존·완치 효과 제외

**내부 링크:** `/conditions/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## endoscopy — 위·대장내시경 안내

- 경로: `/services/endoscopy/` · 템플릿: `service-hub` · 순서: P1
- 목적: 검사 부위·진정·준비 안내를 연결
- title 초안: 위·대장내시경 안내 | 영통탑내과
- description 초안: 영통탑내과의 위·대장내시경 안내 안내입니다. 위·대장 검사 구분, 진정 설명, 검사별 안내 관련 정보를 확인하세요.
- 입력: `content/pages/endoscopy.json` + `content/bodies/endoscopy.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/)
- [기존 페이지](https://yttop.co.kr/30)
- [기존 페이지](https://yttop.co.kr/31)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-db394c63d966.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-32c19f63f158.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7fc0feffaab5.md)
- [이미지 3940fdda35ddaccb.jpg](../../research/2026-09-11-yttop/evidence/assets/3940fdda35ddaccb.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f728d93fe9a7ac8b.jpg](../../research/2026-09-11-yttop/evidence/assets/f728d93fe9a7ac8b.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 4b07624a614ff2dd.jpg](../../research/2026-09-11-yttop/evidence/assets/4b07624a614ff2dd.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 위·대장 검사 구분
2. 진정 설명
3. 검사별 안내
4. 준비 안내
5. 예약·결과 문의

**답변을 작성할 질문**

- 위와 대장내시경은 어떻게 다른가요?
- 진정 검사는 무엇인가요?
- 준비 안내는 어디서 확인하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 검진·증례·이벤트의 서비스 사실만 참고하고 정결제 복용법은 새로 검수

**내부 링크:** `/services/endoscopy/gastroscopy/` · `/services/endoscopy/colonoscopy/` · `/health/colonoscopy-preparation-questions/` · `/checkups/cancer-screening/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## colonoscopy — 대장내시경

- 경로: `/services/endoscopy/colonoscopy/` · 템플릿: `service-detail` · 순서: P1
- 목적: 대장 검사와 정결·결과·추가 처치의 관계 설명
- title 초안: 대장내시경 | 영통탑내과
- description 초안: 영통탑내과의 대장내시경 안내입니다. 검사 목적, 정결 준비 연결, 진정 여부 관련 정보를 확인하세요.
- 입력: `content/pages/colonoscopy.json` + `content/bodies/colonoscopy.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/30)
- [기존 페이지](https://yttop.co.kr/31)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-32c19f63f158.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7fc0feffaab5.md)
- [이미지 848e4b5ed43d2f95.png](../../research/2026-09-11-yttop/evidence/assets/848e4b5ed43d2f95.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 목적
2. 정결 준비 연결
3. 진정 여부
4. 과정·결과
5. 용종 등 추가 처치 설명
6. 문의

**답변을 작성할 질문**

- 어떤 경우 상담하나요?
- 정결 준비는 어디서 확인하나요?
- 용종이 있으면 어떻게 설명받나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 조직검사·용종절제 가능 범위와 비용 분리; 개별 적응 판단을 온라인으로 확정하지 않음

**내부 링크:** `/services/endoscopy/` · `/health/colonoscopy-preparation-questions/` · `/checkups/cancer-screening/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## gastroscopy — 위내시경

- 경로: `/services/endoscopy/gastroscopy/` · 템플릿: `service-detail` · 순서: P1
- 목적: 상부 소화관 검사와 실제 예약·준비 안내 연결
- title 초안: 위내시경 | 영통탑내과
- description 초안: 영통탑내과의 위내시경 안내입니다. 검사 목적, 진정 여부, 준비 확인 관련 정보를 확인하세요.
- 입력: `content/pages/gastroscopy.json` + `content/bodies/gastroscopy.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/30)
- [기존 페이지](https://yttop.co.kr/31)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-32c19f63f158.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-7fc0feffaab5.md)
- [이미지 848e4b5ed43d2f95.png](../../research/2026-09-11-yttop/evidence/assets/848e4b5ed43d2f95.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 목적
2. 진정 여부
3. 준비 확인
4. 과정·결과
5. 조직검사와 추가 설명
6. 문의

**답변을 작성할 질문**

- 어떤 부위를 확인하나요?
- 진정 검사가 가능한가요?
- 검사 전 무엇을 확인해야 하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 약 중단·금식 시간·운전 안내는 실제 프로토콜과 의료 검수 후 작성

**내부 링크:** `/services/endoscopy/` · `/checkups/cancer-screening/` · `/health/checkup-preparation-checklist/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## heart-index — 심장검사 안내

- 경로: `/services/heart/` · 템플릿: `service-hub` · 순서: P0
- 목적: 여섯 심장검사의 목적과 담당 페이지를 연결
- title 초안: 심장검사 안내 | 영통탑내과
- description 초안: 영통탑내과의 심장검사 안내 안내입니다. 검사 목적 요약, 검사별 평가 대상 표, 검사 안내 카드 관련 정보를 확인하세요.
- 입력: `content/pages/heart-index.json` + `content/bodies/heart-index.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/18)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-cc6a8782fb53.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 6c41e5cc5a028c5e.png](../../research/2026-09-11-yttop/evidence/assets/6c41e5cc5a028c5e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 목적 요약
2. 검사별 평가 대상 표
3. 검사 안내 카드
4. 의료진
5. 긴급 증상 시 행동

**답변을 작성할 질문**

- 심장초음파와 홀터검사는 어떻게 다른가요?
- 검사 예약은 필요한가요?
- 어떤 증상은 일반 예약보다 긴급 평가가 필요한가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 표가 자가진단·자가 검사 선택 도구처럼 읽히지 않도록 검수

**내부 링크:** `/services/heart/echocardiography/` · `/services/heart/holter/` · `/services/heart/carotid-ultrasound/` · `/services/heart/heart-rate-variability/` · `/services/heart/arterial-assessment/` · `/services/heart/cardiac-markers/` · `/conditions/heart-disease/` · `/doctors/park-jongseol/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## abi — 동맥경화도 검사

- 경로: `/services/heart/arterial-assessment/` · 템플릿: `service-detail` · 순서: P1
- 목적: 실제 검사 방식과 혈관 평가 지표의 의미를 안내
- title 초안: 동맥경화도 검사 | 영통탑내과
- description 초안: 영통탑내과의 동맥경화도 검사 안내입니다. 측정 방식, 평가 대상, 준비·과정 관련 정보를 확인하세요.
- 입력: `content/pages/abi.json` + `content/bodies/abi.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/39)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-bebdde1f7726.md)
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 7c07b0cfe310101b.png](../../research/2026-09-11-yttop/evidence/assets/7c07b0cfe310101b.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 a242b3ac69a0d9be.jpg](../../research/2026-09-11-yttop/evidence/assets/a242b3ac69a0d9be.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 측정 방식
2. 평가 대상
3. 준비·과정
4. 지표 해석
5. 한계·후속 상담

**답변을 작성할 질문**

- 무엇을 측정하나요?
- 경동맥 초음파와 다른가요?
- 결과만으로 진단할 수 있나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** ABI·PWV·CAVI 중 실제 장비 지표 확인 후 표기

**내부 링크:** `/services/heart/` · `/services/heart/carotid-ultrasound/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## cardiac-markers — 심장 표지자 검사

- 경로: `/services/heart/cardiac-markers/` · 템플릿: `service-detail` · 순서: P1
- 목적: 혈액 표지자 검사의 역할과 긴급 평가의 관계 설명
- title 초안: 심장 표지자 검사 | 영통탑내과
- description 초안: 영통탑내과의 심장 표지자 검사 안내입니다. 검사 역할, 실제 검사 항목, 채혈·결과 절차 관련 정보를 확인하세요.
- 입력: `content/pages/cardiac-markers.json` + `content/bodies/cardiac-markers.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/40)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-a261b16ada34.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 7c07b0cfe310101b.png](../../research/2026-09-11-yttop/evidence/assets/7c07b0cfe310101b.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 역할
2. 실제 검사 항목
3. 채혈·결과 절차
4. 검사 시점과 한계
5. 응급 안내

**답변을 작성할 질문**

- 어떤 항목을 검사하나요?
- 결과는 언제 설명받나요?
- 정상 수치면 심장질환이 배제되나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** PATHFAST 도입 공지의 당일·분 단위 문구를 정확도나 응급 배제 보장으로 옮기지 않음

**내부 링크:** `/services/heart/` · `/conditions/heart-disease/` · `/notices/pathfast/` · `/visit/`

**주요 행동:** 현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## carotid — 경동맥 초음파

- 경로: `/services/heart/carotid-ultrasound/` · 템플릿: `service-detail` · 순서: P1
- 목적: 경동맥 평가 범위를 설명하고 검사 한계를 구분
- title 초안: 경동맥 초음파 | 영통탑내과
- description 초안: 영통탑내과의 경동맥 초음파 안내입니다. 경동맥과 검사 목적, 대상·상담, 검사 과정 관련 정보를 확인하세요.
- 입력: `content/pages/carotid.json` + `content/bodies/carotid.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/37)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-662713325797.md)
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 7c07b0cfe310101b.png](../../research/2026-09-11-yttop/evidence/assets/7c07b0cfe310101b.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 a242b3ac69a0d9be.jpg](../../research/2026-09-11-yttop/evidence/assets/a242b3ac69a0d9be.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 경동맥과 검사 목적
2. 대상·상담
3. 검사 과정
4. 준비
5. 결과 해석의 한계

**답변을 작성할 질문**

- 어떤 혈관을 보는 검사인가요?
- 어떤 경우 상담하나요?
- 뇌졸중 위험을 확정할 수 있나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 개인 위험 확률·예방 효과를 임의 수치화하지 않음

**내부 링크:** `/services/heart/` · `/services/heart/arterial-assessment/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## echocardiography — 심장초음파 검사

- 경로: `/services/heart/echocardiography/` · 템플릿: `service-detail` · 순서: P0
- 목적: 심장 구조·기능 평가와 영통탑 예약 절차 설명
- title 초안: 심장초음파 검사 | 영통탑내과
- description 초안: 영통탑내과의 심장초음파 검사 안내입니다. 검사 목적, 확인 범위·한계, 검사 과정 관련 정보를 확인하세요.
- 입력: `content/pages/echocardiography.json` + `content/bodies/echocardiography.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/23)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-ac95c5ac1753.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 6c41e5cc5a028c5e.png](../../research/2026-09-11-yttop/evidence/assets/6c41e5cc5a028c5e.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 목적
2. 확인 범위·한계
3. 검사 과정
4. 준비·예약
5. 결과 설명
6. 검사 비교 안내

**답변을 작성할 질문**

- 무엇을 확인하는 검사인가요?
- 모든 심장질환을 알 수 있나요?
- 금식이나 예약이 필요한가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 경흉부·경식도·부하검사를 혼용하지 않음; 실제 시행 종류 확인

**내부 링크:** `/services/heart/` · `/services/heart/holter/` · `/health/heart-test-differences/` · `/doctors/park-jongseol/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## hrv — 심박 변이도 검사

- 경로: `/services/heart/heart-rate-variability/` · 템플릿: `service-detail` · 순서: P1
- 목적: 심박 변이도의 설명과 해석 범위를 분명히 함
- title 초안: 심박 변이도 검사 | 영통탑내과
- description 초안: 영통탑내과의 심박 변이도 검사 안내입니다. 심박 변이도 설명, 검사 목적, 과정·조건 관련 정보를 확인하세요.
- 입력: `content/pages/hrv.json` + `content/bodies/hrv.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/38)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-fba3e667d9b9.md)
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 7c07b0cfe310101b.png](../../research/2026-09-11-yttop/evidence/assets/7c07b0cfe310101b.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 a242b3ac69a0d9be.jpg](../../research/2026-09-11-yttop/evidence/assets/a242b3ac69a0d9be.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 심박 변이도 설명
2. 검사 목적
3. 과정·조건
4. 해석 범위
5. 다른 심장검사와 구분

**답변을 작성할 질문**

- 무엇을 측정하나요?
- 스트레스나 질환을 확정하는 검사인가요?
- 홀터검사와 어떻게 다른가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 원문 38번에 혼재한 심장초음파 복사 문장 제거; 진단 능력 과장 검수

**내부 링크:** `/services/heart/` · `/services/heart/holter/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## holter — 홀터검사

- 경로: `/services/heart/holter/` · 템플릿: `service-detail` · 순서: P0
- 목적: 생활 중 심전도 기록의 목적과 검사 중 증상 기록 설명
- title 초안: 홀터검사 | 영통탑내과
- description 초안: 영통탑내과의 홀터검사 안내입니다. 검사 목적, 실제 기록 시간·장비, 착용과 일상생활 관련 정보를 확인하세요.
- 입력: `content/pages/holter.json` + `content/bodies/holter.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/36)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-1f24db63fa2c.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 1edecc8eac265bcc.png](../../research/2026-09-11-yttop/evidence/assets/1edecc8eac265bcc.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 7c07b0cfe310101b.png](../../research/2026-09-11-yttop/evidence/assets/7c07b0cfe310101b.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 목적
2. 실제 기록 시간·장비
3. 착용과 일상생활
4. 증상 기록
5. 결과·한계
6. 문의

**답변을 작성할 질문**

- 얼마 동안 착용하나요?
- 검사 중 증상을 어떻게 기록하나요?
- 검사 때 증상이 없으면 어떻게 하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 24시간 등 구체적 장비 시간을 근거 없이 확정하지 않음

**내부 링크:** `/services/heart/` · `/health/palpitations-test-followup/` · `/services/heart/echocardiography/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## ultrasound-index — 초음파 검사 안내

- 경로: `/services/ultrasound/` · 템플릿: `service-hub` · 순서: P1
- 목적: 검사 부위별 목적과 준비 차이를 안내
- title 초안: 초음파 검사 안내 | 영통탑내과
- description 초안: 영통탑내과의 초음파 검사 안내 안내입니다. 부위별 검사 카드, 대상·한계, 준비가 다른 이유 관련 정보를 확인하세요.
- 입력: `content/pages/ultrasound-index.json` + `content/bodies/ultrasound-index.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/24)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-0d2f9d9a903c.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 부위별 검사 카드
2. 대상·한계
3. 준비가 다른 이유
4. 결과 문의

**답변을 작성할 질문**

- 복부와 갑상선 검사는 어떻게 다른가요?
- 금식이 필요한 검사는 무엇인가요?
- 심장초음파는 어디에서 확인하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 모든 부위 동일 금식 안내 금지

**내부 링크:** `/services/ultrasound/abdomen/` · `/services/ultrasound/thyroid/` · `/services/ultrasound/bowel/` · `/services/heart/echocardiography/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## abdominal-ultrasound — 상·하복부 초음파

- 경로: `/services/ultrasound/abdomen/` · 템플릿: `service-detail` · 순서: P1
- 목적: 상복부와 하복부의 평가 대상 및 준비 구분
- title 초안: 상·하복부 초음파 | 영통탑내과
- description 초안: 영통탑내과의 상·하복부 초음파 안내입니다. 상하복부 구분, 관찰 부위, 예약·준비 관련 정보를 확인하세요.
- 입력: `content/pages/abdominal-ultrasound.json` + `content/bodies/abdominal-ultrasound.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/25)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-c32f23abb056.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 상하복부 구분
2. 관찰 부위
3. 예약·준비
4. 검사 과정
5. 결과와 한계

**답변을 작성할 질문**

- 어떤 장기를 보나요?
- 금식이나 소변 준비가 필요한가요?
- 검사 결과는 어떻게 설명받나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 구체적 금식 시간·방광 준비는 병원의 실제 지침 확인

**내부 링크:** `/services/ultrasound/` · `/services/ultrasound/bowel/` · `/conditions/acute-care/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## bowel-ultrasound — 소장·대장·맹장 초음파

- 경로: `/services/ultrasound/bowel/` · 템플릿: `service-detail` · 순서: P1
- 목적: 장 초음파 평가 범위와 내시경 차이를 설명
- title 초안: 소장·대장·맹장 초음파 | 영통탑내과
- description 초안: 영통탑내과의 소장·대장·맹장 초음파 안내입니다. 검사 목적, 관찰 범위, 준비·과정 관련 정보를 확인하세요.
- 입력: `content/pages/bowel-ultrasound.json` + `content/bodies/bowel-ultrasound.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/27)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-f3b3b057bb95.md)
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 a3d3476ee3b65f8e.png](../../research/2026-09-11-yttop/evidence/assets/a3d3476ee3b65f8e.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 목적
2. 관찰 범위
3. 준비·과정
4. 영상 평가의 한계
5. 내시경·응급 평가 구분

**답변을 작성할 질문**

- 내시경과 어떻게 다른가요?
- 맹장염을 확인할 수 있나요?
- 모든 장 질환을 배제하나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 초음파가 내시경을 항상 대체하거나 질환을 완전히 배제한다는 설명 금지

**내부 링크:** `/services/ultrasound/` · `/services/endoscopy/` · `/conditions/acute-care/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## thyroid-ultrasound — 갑상선 초음파

- 경로: `/services/ultrasound/thyroid/` · 템플릿: `service-detail` · 순서: P1
- 목적: 갑상선 구조 평가와 추가 검사 판단의 구분
- title 초안: 갑상선 초음파 | 영통탑내과
- description 초안: 영통탑내과의 갑상선 초음파 안내입니다. 검사 목적, 대상, 검사 과정 관련 정보를 확인하세요.
- 입력: `content/pages/thyroid-ultrasound.json` + `content/bodies/thyroid-ultrasound.md`
- 구조화 데이터: MedicalWebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/26)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-29ff6215119c.md)
- [이미지 fb4fab92bac241ed.png](../../research/2026-09-11-yttop/evidence/assets/fb4fab92bac241ed.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 bb70394f860f60c5.png](../../research/2026-09-11-yttop/evidence/assets/bb70394f860f60c5.png) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f21548365a7d3641.png](../../research/2026-09-11-yttop/evidence/assets/f21548365a7d3641.png) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 검사 목적
2. 대상
3. 검사 과정
4. 결과 설명
5. 추가 검사와 한계

**답변을 작성할 질문**

- 어떤 경우 검사하나요?
- 갑상선 기능도 확인하나요?
- 결절이 있으면 모두 암인가요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 영상 소견만으로 기능·암 진단을 확정하는 표현 금지

**내부 링크:** `/services/ultrasound/` · `/visit/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## sitemap — 전체 페이지 안내

- 경로: `/sitemap/` · 템플릿: `sitemap` · 순서: P1
- 목적: 사람이 읽을 수 있는 전체 공개 페이지 탐색
- title 초안: 전체 페이지 안내 | 영통탑내과
- description 초안: 영통탑내과의 전체 페이지 안내 안내입니다. 병원·방문, 진료·검사, 검진 관련 정보를 확인하세요.
- 입력: `content/pages/sitemap.json` + `content/bodies/sitemap.md`
- 구조화 데이터: CollectionPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-db394c63d966.md)
- [이미지 3940fdda35ddaccb.jpg](../../research/2026-09-11-yttop/evidence/assets/3940fdda35ddaccb.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 f728d93fe9a7ac8b.jpg](../../research/2026-09-11-yttop/evidence/assets/f728d93fe9a7ac8b.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요
- [이미지 4b07624a614ff2dd.jpg](../../research/2026-09-11-yttop/evidence/assets/4b07624a614ff2dd.jpg) — 연결 관계로 찾은 후보; 육안 검수 필요

**본문 순서**

1. 병원·방문
2. 진료·검사
3. 검진
4. 건강정보
5. 공지·사례
6. 정책

**답변을 작성할 질문**

- 전체 페이지는 어디서 보나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 게시 승인된 페이지만 표시; XML sitemap과 같은 공개 manifest 사용

**내부 링크:** `/` · `/services/` · `/checkups/` · `/health/` · `/cases/` · `/notices/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.

## visit — 진료시간·오시는 길

- 경로: `/visit/` · 템플릿: `visit` · 순서: P0
- 목적: 주소·시간·접수·예약을 단일 원장으로 안내
- title 초안: 진료시간·오시는 길 | 영통탑내과
- description 초안: 영통탑내과의 진료시간·오시는 길 안내입니다. 전화·도로명 주소, 요일별 진료·휴게, 접수 마감·검사 예약 관련 정보를 확인하세요.
- 입력: `content/pages/visit.json` + `content/bodies/visit.md`
- 구조화 데이터: WebPage + BreadcrumbList (home 제외) + clinic reference
- 공개 XML 후보: 예 — 검수 후 포함

**원문·이미지**

- [기존 페이지](https://yttop.co.kr/42)
- [기존 페이지](https://yttop.co.kr/43)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-fe8b82f8fca1.md)
- [수집 원문](../../research/2026-09-11-yttop/pages/p-02bb2fe60567.md)
- [이미지 988305921ed3aadb.png](../../research/2026-09-11-yttop/evidence/assets/988305921ed3aadb.png) — 육안 대조한 사용 후보

**본문 순서**

1. 전화·도로명 주소
2. 요일별 진료·휴게
3. 접수 마감·검사 예약
4. 휴진 예외
5. 망포역 안내
6. 주차 확인 상태
7. 지도 열기

**답변을 작성할 질문**

- 토요일에도 진료하나요?
- 심장초음파는 예약해야 하나요?
- 망포역에서 어떻게 가나요?
- 주차 지원은 어떻게 되나요?

각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.

**개별 검수:** 토요일 점심·주차·검사 접수 적용 범위 확인; 알 수 없는 항목 추정 금지

**내부 링크:** `/` · `/checkups/` · `/services/heart/echocardiography/` · `/notices/`

**주요 행동:** 전화 문의·오시는 길

**완료 검사:** 원본 HTML에 제목·전체 본문·근거 링크 존재; 본 페이지 원문·새 원고의 사실 대조; 관련 페이지 연결과 실제 주소 직접 접근; schema와 보이는 사실 동일; 미승인 이미지·수치·작성자 공개 없음.
