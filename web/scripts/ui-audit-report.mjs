// Summarize collected evidence; does not run or change the website.
import fs from 'node:fs/promises';
import path from 'node:path';
const output = path.resolve('../artifacts/ui-audit-2026-09-11');
const read = async (name) => JSON.parse(await fs.readFile(path.join(output, name + '.json'), 'utf8'));
const [matrix, stress, interactions, supplement, pages] = await Promise.all([
  read('matrix'), read('stress'), read('interactions'), read('supplement'),
  fs.readFile('../content/pages.json', 'utf8').then(JSON.parse),
]);
const e2e = JSON.parse(await fs.readFile('reports/e2e.json', 'utf8'));
const findings = [
  { id: 'UI-01', priority: 'P1', title: '짧은 화면에서 펼친 메뉴 가림', condition: '600×320, 320×225, 844×256', detail: '메뉴 마지막 행을 하단 연락 바가 덮거나 화면 밖에 남깁니다. 내부 스크롤이 없습니다.', source: 'src/app/globals.css:1250,1931', evidence: 'menu-600x320.png' },
  { id: 'UI-02', priority: 'P1', title: 'Tab 포커스가 하단 바 뒤에 숨음', condition: '390×844 / 홈·검사 상세·검색', detail: '홈 전화 링크는 y=799.8~830.6px, 하단 바는 y=789~844px로 링크가 완전히 가려집니다.', source: 'src/app/globals.css:19,1931', evidence: 'keyboard-home-1.png' },
  { id: 'UI-03', priority: 'P2', title: '검사 직접 안내가 검색 마지막에 표시됨', condition: '심장초음파 10/10위 · 대장내시경 7/7위', detail: '원본 데이터 순서를 유지해 사례가 검사 안내보다 먼저 표시됩니다.', source: 'src/components/search.tsx:24', evidence: 'search-ranked-1.png' },
  { id: 'UI-04', priority: 'P2', title: '인쇄 시 접힌 Q&A 답변 누락', condition: '대장내시경 준비 페이지 / A4 PDF', detail: '초기 상태에서 인쇄하면 3개 중 2개 질문의 답변이 누락됩니다. 공통 Q&A 사용 페이지는 25개입니다.', source: 'src/app/globals.css:2042; src/components/content.tsx:368', evidence: 'print-last-page.png' },
  { id: 'UI-05', priority: 'P2', title: '태블릿 상세 화면의 전화 경로 부족', condition: '601~850px / 검사 상세', detail: '헤더·사이드바·하단 전화 바가 모두 숨겨져 전화 링크가 푸터에만 남습니다.', source: 'src/app/globals.css:1211,1401,1931', evidence: 'tablet-detail-768.png' },
  { id: 'UI-06', priority: 'P2', title: '작은 진료시간·예약 안내와 시간표 줄바꿈', condition: '320px 홈 / 시간표 10px', detail: '핵심 운영 정보가 작고 요일·점심시간·시간 값이 여러 줄로 나뉩니다.', source: 'src/app/globals.css:1557', evidence: 'home-contact-320.png' },
  { id: 'UI-07', priority: 'P2', title: '짧은 데스크톱 창의 사이드바 하단 이탈', condition: '1280×450 / 심장초음파 상세', detail: '397px 높이의 박스가 y=120px에 고정돼 위치 안내 링크가 화면 밖에 남습니다.', source: 'src/app/globals.css:737', evidence: 'sidebar-1280x450.png' },
  { id: 'UI-08', priority: 'P2', title: '검색 초기화 후 키보드 포커스 소실', condition: '검색·사례 검색 / 4개 폭', detail: '전체 목록 보기 버튼이 제거되면서 activeElement가 BODY로 바뀝니다.', source: 'src/components/search.tsx:97', evidence: 'search-empty-site-390.png' },
  { id: 'UI-09', priority: 'P3', title: '글자 확대 시 이름·메뉴의 지나친 분절', condition: '글자 200% / 390·1280px', detail: '고정된 열 비율과 이름·직함 행 때문에 의료진 이름이 세로로 3줄에 나뉩니다.', source: 'src/app/globals.css:523,565', evidence: 'doctors-390-text-200.png' },
  { id: 'UI-10', priority: 'P3', title: '독립 링크의 44px 조작 영역 목표 미달', condition: '전화 30.8px · 지도 21px · 필터 42px 높이', detail: '프로젝트 목표 기준 개선 항목입니다. 모든 44px 미만 링크를 WCAG 위반으로 간주하지 않습니다.', source: 'src/app/globals.css:1059', evidence: 'home-contact-320.png' },
];
const summary = {
  date: '2026-09-11', build: matrix.summary.build, browser: matrix.summary.browser,
  unchangedApplication: true, status: 'audit-complete-findings-open',
  matrix: matrix.summary, stress: stress.summary,
  dprChecks: supplement.scale.length,
  dprOverflow: supplement.scale.filter((r) => r.documentWidth > r.width + 1).length,
  mobileAxePages: interactions.accessibility.length,
  mobileAxeViolationPages: interactions.accessibility.filter((r) => r.violations.length).length,
  qaPagesWithQuestions: interactions.qa.filter((r) => r.qa.length).length,
  expandedQaOverflowPages: interactions.qa.filter((r) => r.documentWidth > 390).length,
  footerFinalLinkCoveredPages: interactions.footer.filter((r) => !r.footer.hit).length,
  e2e: { passed: e2e.stats.expected, failed: e2e.stats.unexpected, skipped: e2e.stats.skipped, flaky: e2e.stats.flaky },
  priorities: { P1: 2, P2: 6, P3: 2 }, findings,
  limitations: ['Single browser engine: Microsoft Edge Chromium on Windows', 'Viewport equivalent sizes, not browser UI zoom', 'Computed font doubling, not OS text scaling', 'No real iOS/Android keyboard or safe-area testing', 'Manual visual review of 23 representative pages plus issue states; all 76 routes measured', 'Geometry and hit-test output includes candidates requiring manual review'],
};
await fs.writeFile('../docs/verification/ui-audit-2026-09-11.json', JSON.stringify(summary, null, 2) + '\n');
const csv = (v) => '"' + String(v).replaceAll('"', '""') + '"';
const rows = pages.map((p) => {
  const basic = matrix.results.filter((r) => r.id === p.id), extra = stress.results.filter((r) => r.id === p.id);
  const a11y = interactions.accessibility.find((r) => r.route === p.path);
  return [p.id, p.path, p.title, p.template, basic.length, extra.length, basic.filter((r) => r.documentWidth > r.viewport.width + 1).length, basic.filter((r) => r.clippedText.length).length, basic.filter((r) => r.overlaps.length).length, a11y?.violations.length ?? 'not-tested', p.questions.length, '공통 UI 문제는 본문 보고서 참고'].map(csv).join(',');
});
await fs.writeFile('../docs/verification/ui-audit-pages-2026-09-11.csv', '\uFEFFid,route,title,template,defaultChecks,stressChecks,defaultDocumentOverflowChecks,defaultClipCandidateChecks,defaultOverlapCandidateChecks,mobileAxeViolations,qaCount,note\n' + rows.join('\n') + '\n');
const escape = (v) => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const screenshots = (await fs.readdir(path.join(output, 'screenshots'))).filter((f) => f.endsWith('.png')).sort();
const issueCards = findings.map((f) => `<article class="finding"><p class="tag ${f.priority}">${f.priority} · ${f.id}</p><h3>${escape(f.title)}</h3><p><strong>${escape(f.condition)}</strong></p><p>${escape(f.detail)}</p><p class="small">${escape(f.source)}</p><a href="screenshots/${f.evidence}">증거 화면 열기 ↗</a></article>`).join('');
const cards = screenshots.map((file) => `<figure data-name="${escape(file)}"><a href="screenshots/${file}"><img src="screenshots/${file}" loading="lazy" alt="${escape(file)}"><figcaption>${escape(file)}</figcaption></a></figure>`).join('');
await fs.writeFile(path.join(output, 'index.html'), `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>영통탑내과 UI 검토 증거 · 2026-09-11</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f7f5;color:#183b37;font:16px/1.7 'Malgun Gothic',sans-serif;overflow-wrap:anywhere}main{max-width:1280px;padding:40px 24px;margin:auto}h1,h2,h3{line-height:1.4}h1{font-size:32px}h2{margin-top:44px}p{max-width:900px}a{color:#125b51;text-underline-offset:4px}a:focus-visible,input:focus-visible{outline:3px solid #936000;outline-offset:4px}.small{font-size:13px;color:#56655d}.stats,.findings,.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:18px}.stats p,.finding,figure{background:white;padding:22px;border:1px solid #d6e1da;border-radius:12px;margin:0}.stats strong{display:block;font-size:30px}.tag{font-weight:bold;font-size:13px}.P1{color:#a52020}.P2{color:#805800}.P3{color:#125b51}.finding p{margin:10px 0}.finding h3{font-size:20px}.gallery figure{padding:10px}.gallery img{display:block;width:100%;height:300px;object-fit:cover;object-position:top;background:#fff}.gallery figcaption{font-size:13px;padding:12px 2px}.gallery a{text-decoration:none}input{font:inherit;padding:12px 16px;border:1px solid #849d8b;border-radius:7px;width:min(100%,600px);display:block;margin:10px 0 20px}[hidden]{display:none!important}.note{border-left:4px solid #986615;padding:12px 20px;background:#fff9ea}@media(max-width:600px){main{padding:25px 18px}h1{font-size:27px}}</style></head><body><main>
<p class="small">2026-09-11 · 커밋 ${matrix.summary.build.commit.slice(0, 8)} · Edge ${matrix.summary.browser}</p><h1>영통탑내과 UI 레이아웃·사용성 검토</h1><p>기본 반응형 배치는 안정적입니다. 짧은 화면 메뉴와 키보드 포커스 가림을 먼저 수정해야 합니다. 검색·인쇄·문의 경로·가독성 등 총 10개 개선 항목을 확인했습니다.</p><p class="note">검토 결과와 재현 증거입니다. 서비스 UI와 원고는 수정하지 않았습니다. 상세 재현 조건·수정 방향·검사 한계는 <a href="../../docs/ui-audit-2026-09-11.ko.md">한국어 보고서</a>에서 확인할 수 있습니다.</p>
<div class="stats"><p><strong>76페이지</strong>16개 폭 · 기본 검사 1,216회</p><p><strong>456회</strong>글자 확대·간격 변경 검사</p><p><strong>0건</strong>기본 문서 가로 넘침</p><p><strong>2 / 6 / 2</strong>P1 우선 수정 / P2 사용성 / P3 품질</p></div>
<h2>확인한 개선 항목</h2><div class="findings">${issueCards}</div><h2>화면 원본 ${screenshots.length}장</h2><p>원본을 클릭하면 전체 크기로 열립니다. 홈·방문·의료진·검색 등 대표 23페이지는 320·768·1440px로 캡처했습니다. 모든 76페이지의 DOM 검사 결과는 <a href="../../docs/verification/ui-audit-pages-2026-09-11.csv">페이지별 검사표</a>에 있습니다.</p><label for="filter">파일명으로 화면 찾기</label><input id="filter" type="search" placeholder="예: menu, 320, doctors, search"><p id="count" role="status">${screenshots.length}장</p><div class="gallery">${cards}</div><h2>원시 자료</h2><p><a href="matrix.json">기본 레이아웃</a> · <a href="stress.json">글자 확대·간격</a> · <a href="interactions.json">메뉴·키보드·검색·Q&A·axe</a> · <a href="supplement.json">검색 순위·인쇄·픽셀 밀도</a> · <a href="preparation-print.pdf">실제 생성 PDF</a></p><p class="small">뷰포트·계산 글꼴 스트레스 검사이며 실기기의 OS 배율·키보드·Safari/Firefox·스크린리더 검사를 대체하지 않습니다. 원시 측정의 후보와 보고서의 확인된 결함을 구분하세요.</p>
</main><script>const input=document.querySelector('#filter'),items=[...document.querySelectorAll('figure')];input.addEventListener('input',()=>{const q=input.value.toLowerCase().trim();let n=0;items.forEach(el=>{el.hidden=!el.dataset.name.toLowerCase().includes(q);if(!el.hidden)n++});document.querySelector('#count').textContent=n+'장';});</script></body></html>`);
await fs.writeFile(path.join(output, 'README.md'), '# UI audit evidence\n\nOpen index.html for the screenshot gallery. See ../../docs/ui-audit-2026-09-11.ko.md for the reviewed findings.\n\nRaw geometry/hit-test output includes candidates, not automatic final defect judgments. matrix-partial.json and stress-partial.json are checkpoints, not separate test runs.\n');
console.log(JSON.stringify({ pages: rows.length, screenshots: screenshots.length, findings: findings.length, qaOverflow: summary.expandedQaOverflowPages, axeViolationPages: summary.mobileAxeViolationPages, report: '../docs/ui-audit-2026-09-11.ko.md', gallery: output + '/index.html' }, null, 2));
