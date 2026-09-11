"""Link the harness follow-up and preserve the audit history."""
import csv
from pathlib import Path

root = Path(__file__).resolve().parents[1]
first = root / 'research/2026-09-11-thegungang365/report.ko.md'
second = root / 'research/2026-09-11-olympicpark365/report.ko.md'
marker = '## 하네스 구축 후속 조사 — 2026-09-11'
common = '\n\n' + marker + '\n\n두 병원 비교를 [기업 사례·원리 종합](../2026-09-11-aeo-geo-synthesis.ko.md)과 [제작·검증 하네스](../../harness/README.md)로 연결했다. 기존 32개 기준의 자동 검사와 사람 검수 범위는 [매핑 문서](../../harness/coverage.md)에 구분했다. 실제 AI 인용 증가를 측정한 결과는 아니다.\n'
extra = '\n기존 저장 스냅샷에 새 alt 무결성 검사를 적용한 결과, 더건강한 표본 글 3개(두드러기·소아 고열·설사/구토)에서도 alt에 `<p style=` 조각을 확인했다. 이는 최초 감사에서 속성의 존재만 확인한 범위를 보완하는 발견이다. 현재 라이브 사이트를 재수집한 결과는 아니다. [재검사 JSON](../../harness/runs/thegungang-structural.json). 올림픽파크에서 관찰한 오류와 함께 템플릿 직렬화 경로를 확인할 필요가 있다. 공통 원인인지 여부는 소스 코드 조사가 필요하다.\n'
for file, addition in [(first, common + extra), (second, common)]:
    original = file.read_text(encoding='utf-8-sig')
    if marker not in original:
        file.write_text(original + addition, encoding='utf-8')
checklist = root / 'research/2026-09-11-thegungang365/hospital-checklist.csv'
with checklist.open(encoding='utf-8-sig', newline='') as f:
    reader = csv.DictReader(f); fields = reader.fieldnames; rows = list(reader)
for row in rows:
    if row['ID'] == 'SEO09':
        row['이번 사례 결과'] = '하네스 재검사: 저장 표본 글 3개 alt에 HTML 조각 확인; 후속 조사 절 참조'
with checklist.open('w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fields); writer.writeheader(); writer.writerows(rows)
print('Updated report links and SEO09 evidence; preserved 32 checklist rows.')
