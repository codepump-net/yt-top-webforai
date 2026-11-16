# TOP 건강백과 개발·운영 문서

현행 문서 기준일: **2026-11-16**. 환자용 사이트의 목표·현재 구현·기능별 개발·운영·확장을 연결한다. `pwd-2026-2 lecture 09`의 프로젝트 분석 참고자료로도 사용한다. 이 문서들은 병원 사이트의 공개 페이지로 배포하지 않는다.

## 처음 읽을 문서

| 순서 | 문서 | 알 수 있는 내용 |
|---|---|---|
| 1 | [프로젝트 개요와 docs 운영](project/overview.ko.md) | 제품 정의·현재 구조·폴더 책임·문서 우선순위 |
| 2 | [핵심 목표·사용자·사용 여정](product/goals-and-users.ko.md) | 환자의 필요·범위·성공 지표 |
| 3 | [사이트맵](product/sitemap.ko.md) · [전체 경로표](product/route-catalog.csv) | 메뉴·URL·색인 정책·135개 경로와 기능 연결 |
| 4 | [시스템 구성](architecture/system.ko.md) · [콘텐츠 모델](architecture/content-model.ko.md) | 저장소·데이터·렌더링·배포·변경 영향 |
| 5 | [디자인 콘셉트·UI 규칙](design/design-system.ko.md) | 색상·서체·화면 패턴·반응형·접근성 |
| 6 | [SEO·AEO·GEO](seo/seo-aeo-geo.ko.md) | 메타·구조화 데이터·발견·관측과 한계 |
| 7 | [기능별 명세 16개](features/README.md) | 개발 접점·완료 조건·관련 검사·확장 후보 |
| 8 | [개발 절차](development/workflow.ko.md) · [검사 기준](development/testing.ko.md) | 작업 분해·명령·검증·PR |
| 9 | [운영 런북](operations/runbook.ko.md) · [확장 백로그](roadmap/backlog.ko.md) | 출판·배포·정기 점검·복구·다음 작업 |
| 10 | [Lecture 09 참고자료](lectures/pwd-2026-2/lecture-09/README.ko.md) · [워크숍](lectures/pwd-2026-2/lecture-09/workshop.ko.md) | 수업 흐름·기능 명세 실습·제출물·평가 제안 |

## 폴더 구조

```text
docs/
  README.md                         전체 진입점
  patient-content-policy.ko.md      공개 콘텐츠 상위 기준
  project/                         제품 정의·문서 운영
  product/                         사용자·사이트맵·생성 경로표
  architecture/                    시스템·콘텐츠 모델·생성 인벤토리
  design/                          디자인 콘셉트·UI 규칙
  seo/                             발견·답변·구조화 데이터·관측
  features/                        F01~F16 명세·카탈로그
  development/                     작업·검사·이번 문서 검증
  operations/                      출판·배포·유지보수·복구
  roadmap/                         우선순위·의존성·확장 과제
  lectures/pwd-2026-2/lecture-09/    강의 보조자료·워크숍
  templates/                       기능 명세·작업 카드·ADR
  decisions/                       의미 있는 결정과 이유
  tools/                           원장 기반 docs 갱신 도구
  client-requests/                  의뢰자 요청서·요청별 검토·반영 자료
```

공개 범위는 [콘텐츠 기준](patient-content-policy.ko.md), 실제 경로·목적은 `content/pages.json`·`page-intents.json`, 동작은 코드·검사, 배포 사실은 해당 실행의 증거로 판단한다. 문서 수치는 [생성 인벤토리](architecture/inventory.json)로 대조하며 모든 현재 경로는 주 담당 기능 하나와 연결된다.

저장소 루트에서 Node.js 24로 `node docs/tools/update-inventory.mjs`를 실행해 생성 문서를 갱신하고 `--check`로 차이를 검사한다. [기능 명세](templates/feature-spec.ko.md)·[작업 카드](templates/task.ko.md)·[ADR](templates/adr.ko.md)을 재사용한다. 이번 정리의 실제 검증은 [검증 기록](development/documentation-validation.ko.md)을 참고한다.

## 의뢰자 요청 자료

날짜가 포함된 기존 폴더 26개는 **[client-requests/](client-requests/README.md)**에 모아 관리한다. 요청서와 해당 요청의 계획·검토·구현·검증·배포 자료를 원래 폴더명으로 함께 보관한다. 전체 요청 목록과 자료 진입점은 해당 색인에서 확인한다.

요청별 과거 페이지 수·검토 모드는 당시 기록이다. 현행 구현은 위 문서와 현재 원장을 우선한다.

기존 공통 설계 자료: [개발 스펙](website-spec.ko.md) · [초기 상세 계획](implementation-plan/README.md) · [이전 인수 기록](development-handoff.ko.md).
