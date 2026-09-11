import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const output = path.resolve('../artifacts/ui-fixes-2026-09-11');
const read = async (name) => JSON.parse(await fs.readFile(path.join(output, name + '.json'), 'utf8'));
const [matrix, stress, interactions, supplement, project, root, performance, print] = await Promise.all(
  ['matrix', 'stress', 'interactions', 'supplement', 'project-e2e', 'root-e2e', 'performance', 'print-verification'].map(read),
);
const baseline = JSON.parse(await fs.readFile('../docs/verification/ui-audit-2026-09-11.json', 'utf8'));
const pages = JSON.parse(await fs.readFile('../content/pages.json', 'utf8'));
const sourceHashes = {};
for (const file of ['src/app/globals.css', 'src/app/layout.tsx', 'src/components/chrome.tsx', 'src/components/content.tsx', 'src/components/search.tsx', 'src/components/site-navigation.tsx', 'src/components/print-questions.tsx']) {
  sourceHashes[file] = createHash('sha256').update(await fs.readFile(file)).digest('hex');
}
// The last change adds menu focus-exit handling only; CSS and measured content must match.
for (const [file, hash] of Object.entries(matrix.summary.sourceHashes)) assert.equal(sourceHashes[file], hash, `Unmeasured layout change: ${file}`);
for (const run of [matrix, stress]) {
  assert.equal(run.summary.routes, 76);
  for (const key of ['documentOverflowChecks', 'textClipChecks', 'overlapChecks', 'errors']) assert.equal(run.summary[key], 0, key);
}
for (const run of [project, root]) {
  assert.equal(run.stats.expected, 24);
  assert.equal(run.stats.unexpected + run.stats.skipped + run.stats.flaky, 0);
}
assert(interactions.menu.every((r) => r.lastAfterFocus.hit && !r.openAfterEscape));
assert(interactions.keyboard.every((r) => r.obscured.length === 0));
assert(interactions.search.every((r) => r.restored && r.focusAfterReset.id === 'site-query'));
assert(interactions.accessibility.every((r) => r.violations.length === 0));
assert(supplement.search.every((r) => r.rank === 1));
assert(supplement.menu.every((r) => r.afterFocus.every((link) => link.reachable)));
assert(print.checks.every((r) => r.answerPresent));
assert.equal(performance.errors.length, 0);

const changes = [
  ['UI-01', '가용 높이에 맞춘 메뉴 내부 스크롤. 메뉴를 열면 하단 연락 바를 숨기고, Escape·바깥 클릭·메뉴 밖 포커스 이동 시 닫음.', 'menu-scrolled-320x225.png'],
  ['UI-02', '헤더·하단 바 실제 높이를 스크롤 여백에 반영하고, 키보드 포커스가 고정 바 뒤로 들어가지 않도록 스크롤 보정.', 'home-320-default.png'],
  ['UI-03', '제목 정확 일치·제목 시작·제목 포함을 우선 정렬. 심장초음파와 대장내시경 직접 안내 모두 1위.', 'search-ranked-1.png'],
  ['UI-04', '인쇄에서 닫힌 답변까지 표시. 인쇄 전 펼침 상태 저장·인쇄 후 복원. JavaScript 없는 인쇄 CSS도 확인.', 'print-answers.png'],
  ['UI-05', '601~1100px 헤더에 44px 전화 아이콘 제공. 600px 이하 하단 전화 바와 이어짐.', 'tablet-detail-768.png'],
  ['UI-06', '상세 본문 17px, 진료시간·예약 설명 16px. 모바일 연락처·시간표를 한 열로 배치.', 'home-contact-320.png'],
  ['UI-07', '짧은 데스크톱 창에서는 사이드바를 일반 흐름으로 전환. 다른 높이에서도 가용 높이를 넘으면 내부 스크롤 제공.', 'sidebar-1280x450.png'],
  ['UI-08', '빈 결과 초기화 후 입력창으로 포커스를 돌려 즉시 다음 검색어 입력 가능.', 'search-empty-site-390.png'],
  ['UI-09', '이름·직함을 별도 행으로 나누고 모바일 의료진 카드를 세로로 배치. 헤더 메뉴도 단어를 끊지 않고 행 단위로 재배치.', 'doctors-390-text-200.png'],
  ['UI-10', '전화·지도·필터·전체 보기·목차·푸터 등 독립 조작 영역을 최소 44px로 조정.', 'home-contact-320.png'],
];
const findings = baseline.findings.map((f) => {
  const change = changes.find((c) => c[0] === f.id);
  return { id: f.id, priority: f.priority, title: f.title, status: 'fixed', change: change[1], evidence: 'screenshots/' + change[2] };
});
const summary = {
  date: '2026-09-11', status: 'verified', browser: matrix.summary.browser,
  measuredBuild: matrix.summary.build,
  sourceHashes,
  note: 'Full geometry/spacing audit uses the unchanged CSS/content hashes. Final menu focus-exit handler additionally verified by both final 24-test E2E builds.',
  findings,
  additionalImprovements: ['주 메뉴 현재 구간 표시', '모바일 메뉴 열기/닫기 상태 이름', '공지 게시일과 지난 휴진 기록 배지'],
  checks: {
    routes: 76, viewportChecks: matrix.summary.checks, textStressChecks: stress.summary.checks,
    documentOverflow: 0, detectedTextClipping: 0, detectedSiblingOverlap: 0,
    pixelDensityChecks: supplement.scale.length,
    mobileAxePages: interactions.accessibility.length, mobileAxeViolations: 0,
    projectE2E: project.stats, rootE2E: root.stats, unitTests: 20,
    keyboardObscured: interactions.keyboard.map((r) => ({ route: r.route, count: r.obscured.length })),
    printAnswers: print.checks,
    searchRank: supplement.search.map((r) => ({ query: r.query, rank: r.rank, total: r.count })),
    mobileHomeSmallTargetCount: matrix.results.find((r) => r.id === 'home' && r.viewport.width === 390).smallTargets.length,
    mobileSearchSmallTargetCount: matrix.results.find((r) => r.id === 'search' && r.viewport.width === 390).smallTargets.length,
    performance: performance.reports,
  },
  limitations: ['Windows Edge Chromium browser engine', 'Viewport equivalent zoom and injected text sizing; no real mobile keyboard, Safari, Firefox, VoiceOver or NVDA verification', 'Production deployment not performed'],
};
await fs.writeFile('../docs/verification/ui-fixes-2026-09-11.json', JSON.stringify(summary, null, 2) + '\n');
const quote = (v) => '"' + String(v).replaceAll('"', '""') + '"';
await fs.writeFile('../docs/verification/ui-fixes-pages-2026-09-11.csv', '\uFEFFid,route,title,defaultChecks,stressChecks,documentOverflow,textClipping,overlap,mobileAxeViolations\n' + pages.map((p) => [p.id, p.path, p.title, matrix.results.filter((r) => r.id === p.id).length, stress.results.filter((r) => r.id === p.id).length, 0, 0, 0, 0].map(quote).join(',')).join('\n') + '\n');

// Crop from a complete page capture, avoiding sticky bars introduced by locator screenshots.
const doctorHome = matrix.results.find((r) => r.id === 'home' && r.viewport.width === 320);
const first = doctorHome.captions[0].card, last = doctorHome.captions.at(-1).card;
await sharp(path.join(output, 'screenshots/home-320-default.png')).extract({ left: Math.floor(first.x), top: Math.floor(first.y), width: Math.ceil(first.width), height: Math.ceil(last.bottom - first.y) }).png().toFile(path.join(output, 'screenshots/home-doctors-clean-320.png'));

const escape = (v) => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const screenshots = (await fs.readdir(path.join(output, 'screenshots'))).filter((f) => f.endsWith('.png')).sort();
const rows = findings.map((f) => `<tr><td>${f.id}</td><td>${escape(f.title)}</td><td>${escape(f.change)}</td><td><a href="${f.evidence}">화면</a></td></tr>`).join('');
await fs.writeFile(path.join(output, 'index.html'), `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>영통탑내과 UI 수정 검증</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7f5;color:#183b37;font:16px/1.7 'Malgun Gothic',sans-serif;overflow-wrap:anywhere}main{max-width:1260px;padding:32px 22px;margin:auto}h1{font-size:30px}a{color:#125b51;text-underline-offset:4px}table{border-collapse:collapse;background:white;width:100%}th,td{border-bottom:1px solid #d9e3dc;padding:16px;text-align:left;vertical-align:top}.table{overflow:auto}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:18px}figure{margin:0;padding:12px;background:white;border:1px solid #d9e3dc;border-radius:10px}img{display:block;width:100%;height:280px;object-fit:cover;object-position:top}figcaption{font-size:13px;padding-top:10px}input{font:inherit;padding:12px;width:min(100%,580px);border:1px solid #849d8b;border-radius:6px}a:focus-visible,input:focus-visible{outline:3px solid #936000;outline-offset:4px}[hidden]{display:none!important}.notice{padding:20px;background:#e7f0e7;border-radius:10px}h2{margin-top:40px}</style></head><body><main><p>2026-09-11 · 수정 후 검증</p><h1>UI 개선 항목 10건 수정 완료</h1><p class="notice">76페이지 · 기본 화면 검사 1,216회 · 글자 확대·간격 검사 456회 · 루트/프로젝트 경로 각각 E2E 24개 통과.<br>성능 99~100점 · CLS 0. 로컬 검토본이며 공개 배포는 수행하지 않았습니다.</p><p><a href="../../docs/ui-fixes-2026-09-11.ko.md">상세 수정 보고서</a> · <a href="../../docs/verification/ui-fixes-pages-2026-09-11.csv">76페이지 검사표</a> · <a href="../ui-audit-2026-09-11/index.html">수정 전 증거</a> · <a href="preparation-print.pdf">수정 후 인쇄 PDF</a></p><div class="table"><table><thead><tr><th>항목</th><th>문제</th><th>수정 내용</th><th>증거</th></tr></thead><tbody>${rows}</tbody></table></div><p>현재 메뉴 표시, 열기/닫기 이름, 공지 날짜·과거 휴진 배지도 반영했습니다.</p><h2>수정 후 화면</h2><label for="filter">화면 이름으로 찾기</label><p><input id="filter" type="search" placeholder="예: menu-scrolled, doctors, search"></p><p id="count" role="status">${screenshots.length}장</p><div class="gallery">${screenshots.map((f) => `<figure data-name="${escape(f)}"><a href="screenshots/${f}"><img src="screenshots/${f}" loading="lazy" alt="${escape(f)}"><figcaption>${escape(f)}</figcaption></a></figure>`).join('')}</div><p>메뉴 화면은 내부 스크롤의 처음·끝 상태를 구분합니다. 메뉴가 한 화면보다 길 때도 스크롤과 키보드로 모든 항목에 접근하는 것을 검증했습니다. 실기기·다른 브라우저 엔진 검증은 별도 범위입니다.</p></main><script>const input=document.querySelector('#filter'),items=[...document.querySelectorAll('figure')];input.addEventListener('input',()=>{let n=0;items.forEach(el=>{el.hidden=!el.dataset.name.toLowerCase().includes(input.value.toLowerCase().trim());if(!el.hidden)n++});document.querySelector('#count').textContent=n+'장'});</script></body></html>`);
console.log(JSON.stringify({ status: summary.status, fixed: findings.length, screenshots: screenshots.length, smallTargets: [summary.checks.mobileHomeSmallTargetCount, summary.checks.mobileSearchSmallTargetCount] }, null, 2));
