# 전체 홈페이지 상세 개발 계획 v1.1

> 현재 구현에는 [환자용 콘텐츠 기준](../patient-content-policy.ko.md)과 [전수 정리 보고서](../content-audit-2026-09-11/README.md)를 우선 적용합니다. 아래 76개 페이지와 이관 가정은 사전 설계 이력이며 현재 사이트를 다시 생성하는 기준이 아닙니다.

**검토 후 전체 구현과 GitHub Actions → GitHub Pages 자동 배포를 연속 수행하기 위한 계획**이다. 작성일 2026-09-11. 앱 개발과 배포는 아직 수행하지 않았다.

1. **[전체 실행 계획](execution-plan.ko.md)** — 실제 저장소 설정·컴포넌트·데이터·구현 순서·배포·인수
2. **[전체 사이트맵](sitemap.ko.md)** — 76개 실제 경로와 공개 XML 생성 규칙
3. **[페이지별 상세 개발 계획](page-details.ko.md)** — 각 페이지의 원문·본문 순서·질문·이미지·메타·링크·검수
4. **[이미지 이관 계획](assets.ko.md)** — 실제 원본 선택과 이미지별 주의점
5. [검토 결정표](decisions.csv) — 사실 충돌·게시 조건·최초 배포 설정

개발 데이터: [페이지 JSON](page-plans.json), [페이지 CSV](page-matrix.csv), [기존 URL 145개 대응표](legacy-url-map.csv), [이미지 연결 후보](page-asset-candidates.csv), [계획용 XML](planned-sitemap.xml), [집계](plan-summary.json).

배포 참고: [workflow 설계 파일](deploy-pages.yml.example). 이 파일은 `.github/workflows/`에 설치된 실행 파일이 아니며, 앱의 명령과 검증을 구현한 후 적용한다.

전체 구현 후보 76개: P0 21개·P1 28개·P2 27개. 기존 공지 5개·사례 25개가 포함된다. XML 후보는 73개이며 실제 운영 sitemap에는 그중 공개 조건을 충족한 항목만 넣는다. 현재 임상·운영 게시 승인을 대신 생성하지 않았다.

원장과 문서의 정합성 확인:

```powershell
python -X utf8 docs/implementation-plan/build_plan.py
python -X utf8 docs/implementation-plan/verify_plan.py
```

`build_plan.py`의 개별 계획을 수정하면 JSON·CSV·사이트맵·상세 문서를 재생성한다. 이 스크립트는 네트워크 수집이나 웹사이트 생성·배포를 수행하지 않는다. [검증 결과](verification.json)는 문서 일치 검사이며 의료적·법적 승인이나 실제 배포 테스트가 아니다.
