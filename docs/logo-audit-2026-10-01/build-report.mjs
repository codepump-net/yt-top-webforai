import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from '../../web/node_modules/sharp/dist/index.cjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../..');
const readJson = async (p) => JSON.parse(await fs.readFile(path.join(root, p), 'utf8'));
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
const assets = await readJson('content/assets.json');
if (assets.some((asset) => asset.logoComposite))
  throw new Error('This is a historical pre-correction audit. Use docs/logo-correction-2026-10-01/report.ko.html for the corrected images; do not overwrite the original audit evidence.');
const pages = await readJson('content/pages.json');
const visuals = await readJson('content/visuals.json');
const inventory = await readJson('docs/logo-audit-2026-10-01/inventory.json');
const suppliedCrops = await readJson('docs/logo-audit-2026-10-01/older-crop-validation.json');

// These are visual findings, not the output of an automatic logo similarity score.
const observations = [
  ['banner-heart', '심장질환 배너', '왼쪽 위', '청진기 머리인 회색 이중 원을 없애고 상단 선만 남겼습니다. 회색 상단 선도 파란색으로 바뀌었고, 아래쪽 굽은 선의 길이와 비례가 달라졌습니다.'],
  ['banner-digestive', '소화기질환 배너', '왼쪽 위', '회색 이중 원을 청록색 단일 고리로 바꿨습니다. 상단 회색 선이 파란색이 되었고, 원과 선의 접합부·심볼 윤곽이 달라졌습니다.'],
  ['banner-respiratory', '호흡기·감염질환 배너', '왼쪽 위', '회색 이중 원을 단일 고리로 단순화했습니다. 상단 선이 회색에서 남색으로 이어지며, 심볼의 선 굵기·곡률·글자 비례가 원본과 다릅니다.'],
  ['banner-vaccinations', '성인 예방접종 배너', '왼쪽 위', '청진기 머리와 별도의 회색 상단 선이 사라졌습니다. 상단과 오른쪽을 하나의 파란색 굽은 선으로 다시 그려 원본과 다른 심볼이 되었습니다.'],
  ['banner-chronic', '만성질환 배너', '왼쪽 위', '청진기 머리인 원이 사라지고, 회색 상단 선이 파란색 열린 곡선으로 바뀌었습니다. 심볼의 비례와 끝부분도 달라졌습니다.'],
  ['banner-neck', '갑상선·경동맥·경부 멍울 배너', '왼쪽 위', '회색 이중 원을 단일 고리로 단순화하고 회색 상단 선을 청록·파란색으로 바꿨습니다. 원의 크기·곡선·심볼과 글자 사이 비례도 다릅니다.'],
  ['banner-kidney', '신장질환 배너', '왼쪽 위', '회색 이중 원을 파란 고리와 회색 일부가 섞인 원으로 바꿨습니다. 심볼 내부 선의 접합부와 색 경계·굴곡이 원본과 다릅니다.'],
  ['banner-cancer-support', '암 치료 중 지지치료 배너', '왼쪽 위', '회색 이중 원을 속이 채워진 진한 파란 점으로 바꿨습니다. 상단 회색 선도 파란색으로 바뀌었고, 병원명 중 내과가 회색 대신 남색 계열로 표현되었습니다.'],
  ['banner-services', '검사·시술 배너', '왼쪽 위', '청진기 머리와 별도의 회색 상단 선이 사라졌습니다. 심볼의 윗부분과 오른쪽을 파란색 한 줄로 다시 연결해 원본의 선 구조를 바꿨습니다.'],
  ['banner-checkups', '건강검진·서류안내 배너', '왼쪽 위', '회색 이중 원을 남색 단일 고리로 바꿨습니다. 회색 상단 선과 회색 내과 글자가 파란·남색으로 바뀌고 선 굵기와 글자 비례도 달라졌습니다.'],
  ['banner-symptoms', '증상백과 배너', '왼쪽 위', '회색 이중 원 자리에 파란 원 안의 흰 십자를 넣었습니다. 원본에 없는 십자를 추가했으며 상단 선도 파란색으로 바뀌었습니다.'],
  ['banner-diseases', '질환백과 배너', '왼쪽 위', '청진기 머리와 회색 상단 선이 사라졌습니다. 심볼 왼쪽 아래에 원본에 없는 짧은 돌출 획이 생기고, 선의 연결 구조와 비례도 달라졌습니다.'],
  ['diagram-heart-flow', '심장검사 진행 순서 안내도', '상단 중앙', '회색 이중 원을 속이 채워진 하늘색 점으로 바꿨습니다. 상단 회색 선을 청록·파란색으로 바꾸고 심볼의 곡선과 글자 비례도 다시 그렸습니다.'],
  ['diagram-endoscopy-preparation', '위·대장내시경 검사 전 준비 안내도', '상단 중앙', '회색 이중 원을 안쪽 작은 원이 없는 단일 고리로 바꾸고 고리 일부에 청록색을 넣었습니다. T 형태 선에도 원본에 없는 청록색이 들어가며 윤곽과 글자 비례가 달라졌습니다.'],
  ['diagram-after-endoscopy', '조직검사·용종절제 후 주의사항 안내도', '상단 중앙', '청진기 머리와 회색 상단 선이 사라졌습니다. 심볼 왼쪽에 원본에 없는 짧은 가로 돌출 획을 추가하고, 선 구조와 색을 파란·청록색으로 다시 그렸습니다.'],
  ['diagram-checkup-flow', '국가·채용·비자검진 진행 순서 안내도', '상단 중앙', '청진기 머리와 회색 상단 선이 사라졌습니다. 심볼 왼쪽 선의 접합부에 불규칙한 돌기와 겹침이 생기고 전체 선의 연결 구조가 원본과 달라졌습니다.'],
  ['vaccination-schedule-2026', '2026 성인 예방접종 일정표', '상단 중앙', '회색 이중 원을 파란 십자 모양으로 바꿨습니다. 원본에 없는 십자를 추가하고, 회색 상단 선과 하늘색 내부 선을 파란·청록색으로 바꿨습니다.'],
];

await fs.mkdir(path.join(dir, 'regions'), { recursive: true });
const findings = [];
for (const [id, name, position, difference] of observations) {
  const asset = assets.find((a) => a.id === id);
  if (!asset?.generatedOriginal) throw new Error(`Missing current generated asset: ${id}`);
  const visual = [...visuals.banners, ...visuals.diagrams].find((v) => v.assetId === id);
  const page = visual ? pages.find((p) => p.id === visual.pageId) : pages.find((p) => p.id === 'vaccinations');
  const publicFile = 'web/public' + asset.file;
  const exportFile = 'web/out' + asset.file;
  const masterBytes = await fs.readFile(path.join(root, asset.sourceFile));
  const publicBytes = await fs.readFile(path.join(root, publicFile));
  const exportBytes = await fs.readFile(path.join(root, exportFile));
  const hashes = { master: hash(masterBytes), public: hash(publicBytes), exported: hash(exportBytes), registered: asset.sha256 };
  if (new Set(Object.values(hashes)).size !== 1) throw new Error(`Image copies differ: ${id}`);
  const region = id.startsWith('banner-')
    ? { left: 40, top: 50, width: 650, height: 205 }
    : { left: 360, top: 0, width: 400, height: 125 };
  const evidence = `regions/${id}.png`;
  await sharp(publicBytes).extract(region).png().toFile(path.join(dir, evidence));
  findings.push({ id, name, position, difference, pageId: page.id, pagePath: page.path, pageTitle: page.title,
    publicFile, masterFile: asset.sourceFile, exportFile, width: asset.width, height: asset.height,
    hashes, region, evidence, status: 'original-logo-mismatch' });
}

const previousDir = 'docs/plan-content-checklist-2026-09-29/accuracy-evidence/before/';
const previous = inventory.filter((i) => i.path.startsWith(previousDir)).map((i) => ({
  ...i, status: 'historical-logo-mismatch', position: i.path.includes('vaccination-schedule') ? '상단 중앙' : '왼쪽 위',
  difference: i.path.includes('vaccination-schedule') ? '청진기 머리가 파란 십자로 대체되고 청록색이 추가된 이전 생성본.' : '청진기 머리와 회색 상단 선을 생략한 이전 생성본.',
}));
const logo = assets.find((a) => a.id === 'logo');
const logoBytes = await fs.readFile(path.join(root, 'web/public' + logo.file));
if (hash(logoBytes) !== logo.sha256) throw new Error('Reference logo hash differs from the recorded clinic asset');
const publicPaths = new Set(findings.map((f) => f.publicFile));
const masterPaths = new Set(findings.map((f) => f.masterFile));
for (const item of inventory) {
  if (publicPaths.has(item.path)) item.review = 'current-original-logo-mismatch';
  else if (masterPaths.has(item.path)) item.review = 'identical-master-original-logo-mismatch';
  else if (item.path.startsWith(previousDir)) item.review = 'historical-original-logo-mismatch';
  else if (item.path === 'web/public/favicon.svg') item.review = 'additional-brand-icon-mismatch';
  else if (item.path === 'web/public/assets/logo.webp') item.review = 'official-reference-asset';
  else if (item.path.includes('/notice-documents/')) item.review = 'no-clinic-logo-official-kdca-document';
  else if (item.path.includes('assets/generated/banners/') || item.path.includes('assets/generated/diagrams/')) item.review = 'no-graphic-clinic-logo-earlier-draft';
  else if (/\/clinic-(800|1600)\.webp$/.test(item.path)) item.review = 'original-interior-photo-with-physical-signage-no-redrawn-logo';
  else if (/\/(jongseol|rayoung)-640\.webp$/.test(item.path)) item.review = 'no-graphic-clinic-logo-portrait-or-silhouette';
  else if (item.path.includes('/director-supplied/')) item.review = 'supplied-low-resolution-contact-sheet-fine-details-unresolved';
  else item.review = 'supplied-low-resolution-crop-pixels-preserved-fine-details-unresolved';
}
await fs.writeFile(path.join(dir, 'inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
const audit = {
  date: '2026-10-01', scope: 'Local source assets, public image assets, four archived generated files, current route wiring and exported copies of the 17 current generated images. Historical browser screenshots are derivative evidence, not independent image masters.',
  reference: { file: 'web/public' + logo.file, sha256: hash(logoBytes), width: logo.width, height: logo.height,
    recordedSourcePage: logo.sourcePage, recordedSourceUrl: logo.sourceUrl, recordedSourceCheckedAt: logo.checkedAt,
    onlineRecheck: 'The original website and recorded CDN URL returned HTTP 403 on this audit run. Comparison uses the locally stored, provenance-recorded clinic logo.' },
  counts: { inventoriedFiles: inventory.length, uniqueImageHashes: new Set(inventory.map((i) => i.sha256)).size,
    publicImages: inventory.filter((i) => i.path.startsWith('web/public/')).length,
    sourceImages: inventory.filter((i) => i.path.startsWith('assets/')).length, archivedGeneratedImages: previous.length,
    currentMismatchedImages: findings.length, distinctAffectedPageRoutes: new Set(findings.map((i) => i.pagePath)).size,
    additionalDifferentBrandIcons: 1, identicalMasterPublicExportTriples: findings.length,
    originalSuppliedCropsPixelPreserved: suppliedCrops.filter((c) => c.sourcePixelsMatch).length },
  commonDifferences: ['17개 모두 의원 표기와 하단 영문 병원명이 없습니다.', '17개 모두 원본 글자를 그대로 합성하지 않고 글꼴·자간·비례를 다시 표현했습니다.', '승인된 간략형 로고 또는 별도 CI 변형을 입증하는 자료는 이번 저장소 검토에서 확인하지 못했습니다. 생략 자체와 심볼 변형을 구분하여 기록했습니다.'],
  findings, previous,
  favicon: { file: 'web/public/favicon.svg', position: '브라우저 탭 및 즐겨찾기 아이콘, 한국어·다국어 layout 공통',
    difference: '짙은 초록 사각형 안의 흰 T와 작은 연두 사각형. 원본 청진기 심볼의 선·색과 모두 다른 기존 별도 아이콘. 9월 29일 생성 PNG 17개와 별도로 집계.',
    evidence: 'favicon-preview.png', sourceCode: ['web/src/app/(ko)/layout.tsx:9', 'web/src/app/[locale]/layout.tsx:10'] },
  inference: '재제작 프롬프트가 원본 로고 파일의 정확한 합성 대신 simple blue clinic emblem과 영통탑내과 문구를 지정한 점이 재발 경로로 판단됩니다. 생성 마스터 자체에 이미 변형이 있고 공개·내보내기 복사본이 동일하므로, CSS나 PNG 복사 과정에서 생긴 변형은 아닙니다.',
  changesMade: 'Audit evidence and report only. No public asset, patient content, application code or deployment was changed.',
};
await fs.writeFile(path.join(dir, 'findings.json'), JSON.stringify(audit, null, 2) + '\n');
const esc = (s) => String(s).replace(/[&<>"']/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[x]);
const fileLink = (p, label = p) => `<a href="../../${esc(p)}">${esc(label)}</a>`;
const currentRows = findings.map((f, i) => `<tr><td>${i + 1}</td><td><strong>${esc(f.name)}</strong><br>${fileLink(f.publicFile, path.basename(f.publicFile))}<br><small>${fileLink(f.masterFile, '생성 마스터')}</small></td><td><code>${esc(f.pagePath)}</code><br>${esc(f.position)}</td><td>${esc(f.difference)}</td><td><a href="${f.evidence}"><img class="region" src="${f.evidence}" alt="${esc(f.name)} 로고 확대 영역"></a></td></tr>`).join('\n');
const previousRows = previous.map((p) => `<tr><td>${fileLink(p.path, path.basename(p.path))}</td><td>${esc(p.position)}</td><td>${esc(p.difference)}</td><td>과거 검수 전 파일. 현재 페이지에서 사용하지 않음.</td></tr>`).join('\n');
const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>영통탑내과 이미지 로고 오류 검토표</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;color:#18334b;background:#f5f7fa;margin:0;line-height:1.65}main{max-width:1500px;margin:auto;padding:32px 24px}h1{font-size:30px}h2{font-size:23px;margin-top:36px}p{max-width:1050px}a{color:#075fa0;overflow-wrap:anywhere}.ref{background:#fff;border:1px solid #d8e0e8;padding:24px;border-radius:12px}.reference{display:block;max-width:100%;width:650px;height:auto}.table{overflow:auto}table{width:100%;border-collapse:collapse;background:#fff;font-size:14px}th,td{text-align:left;vertical-align:top;border:1px solid #d5dfe8;padding:12px}th{background:#e7eff6}td:nth-child(1){width:32px}.region{width:260px;max-width:100%;height:auto;display:block}small{font-size:12px}code{font-size:13px;white-space:normal;overflow-wrap:anywhere}.scope td:first-child{width:230px}.favicon{width:100px;height:100px}.note{padding:16px 20px;border-left:4px solid #087ac0;background:#fff}.gallery-link{display:inline-block;margin-right:16px}@media(max-width:700px){main{padding:20px 12px}h1{font-size:24px}.audit-table{min-width:1050px}}</style></head><body><main>
<h1>영통탑내과 이미지 로고 오류 검토표</h1>
<p>검토일 2026년 10월 1일. <strong>현재 연결된 재제작 PNG 17개 모두 원본 로고와 다릅니다.</strong> 추가로 기존 탭 아이콘 1개가 원본과 다른 도형을 사용하며, 보관된 이전 생성 PNG 4개에도 같은 종류의 변형이 있습니다. 현재 PNG 17개는 15개 페이지에서 사용됩니다.</p>
<div class="ref"><h2 style="margin-top:0">비교 기준인 원본 병원 로고</h2><img class="reference" src="official-logo-on-white.png" alt="회색 이중 원형 청진기 머리와 하늘색·파란 심볼, 영통탑내과의원 및 영문 병원명으로 구성된 원본 로고"><p>${fileLink(audit.reference.file, '저장소에 보관된 기존 홈페이지 로고')}를 기준으로 대조했습니다. 원본은 회색 이중 원형 청진기 머리·회색 상단 선·하늘색과 파란색 연결 심볼, 하늘색 ‘영통’·진한 파란색 ‘탑’·회색 ‘내과 의원’, 하단 영문 병원명으로 구성됩니다.</p><p><small>원본 출처 기록: <a href="${esc(logo.sourcePage)}">기존 병원 홈페이지</a> · <a href="${esc(logo.sourceUrl)}">기록된 원본 CDN 파일</a> · ${fileLink('content/assets.json', '자산 출처 원장')}. 이번 원사이트·CDN 재접속은 HTTP 403으로 제한되어 로컬 보관본을 사용했습니다. 흰 배경의 확대 이미지는 비교용이며 로고 원본 파일을 변경하지 않았습니다.</small></p></div>
<h2>현재 사용 중인 이미지 17개</h2><p>아래 표는 심볼 변형을 파일별로 구분합니다. 공통으로 <strong>‘의원’ 표기와 하단 영문 병원명이 빠졌고, 글꼴·자간·글자 비례도 원본과 다릅니다.</strong> 별도 승인된 간략형 로고 자료는 확인되지 않았습니다. 확대 영역은 각 파일의 일부를 잘라낸 검토용 이미지입니다.</p>
<p><a class="gallery-link" href="current-banners-logo-regions.png">배너 12개 로고 비교 모음</a><a class="gallery-link" href="current-guide-logo-details.png">안내도와 일정표 5개 로고 비교 모음</a></p>
<div class="table"><table class="audit-table"><thead><tr><th>번호</th><th>이미지와 파일</th><th>사용 페이지와 이미지 내 위치</th><th>원본과 다른 부분</th><th>실제 로고 영역</th></tr></thead><tbody>${currentRows}</tbody></table></div>
<p class="note">각 파일은 <code>assets/generated/redrawn-2026-09-29/</code>의 생성 마스터, <code>web/public/assets/clinic-visuals-hq/</code>의 공개 파일, <code>web/out/assets/clinic-visuals-hq/</code>의 로컬 내보내기 파일이 SHA-256으로 같습니다. 즉 17개 디자인이 세 위치에 중복 보관되어 있으며, 51개의 서로 다른 오류 디자인이라는 의미가 아닙니다.</p>
<h2>추가 브랜드 아이콘 불일치</h2><div class="table"><table><thead><tr><th>파일</th><th>사용 위치</th><th>차이</th><th>실제 아이콘</th></tr></thead><tbody><tr><td>${fileLink(audit.favicon.file)}</td><td>브라우저 탭·즐겨찾기, 한국어 및 다국어 페이지 공통</td><td>${esc(audit.favicon.difference)} 별도 아이콘으로 승인되었는지는 확인되지 않았습니다.</td><td><img class="favicon" src="favicon-preview.png" alt="초록색 배경의 흰 T와 작은 연두 사각형 아이콘"></td></tr></tbody></table></div>
<h2>보관된 이전 생성 이미지 4개</h2><p>위치는 <code>docs/plan-content-checklist-2026-09-29/accuracy-evidence/before/</code>입니다. 현재 사용하는 17개와 합쳐 세지 않고, 과거 파일에 남은 오류로 별도 기록합니다.</p><div class="table"><table><thead><tr><th>이전 파일</th><th>로고 위치</th><th>차이</th><th>현재 사용 여부</th></tr></thead><tbody>${previousRows}</tbody></table></div><p><a href="previous-redrawn-logo-regions.png">이전 생성본 로고 비교 모음</a></p>
<h2>전수 검토 범위와 나머지 판정</h2><p>공개 이미지 56개, 제작·제공 이미지 34개, 보관된 이전 생성 이미지 4개를 목록화했습니다. 총 94개 파일이며 동일 바이트를 묶으면 77개입니다. 별도로 현재 오류 PNG 17개의 내보내기 복사본을 대조했습니다. 과거 브라우저 화면 캡처는 이미지 원본이 아닌 파생 검증 자료이므로 개별 수정 대상 이미지 수에서 제외했습니다.</p>
<div class="table"><table class="scope"><thead><tr><th>이미지 그룹</th><th>파일 수</th><th>검토 결과</th></tr></thead><tbody>
<tr><td>현재 공개 PNG</td><td>17</td><td>모두 원본 로고 불일치. 각 전체 이미지와 로고 영역을 확인했습니다.</td></tr>
<tr><td>해당 생성 마스터</td><td>17</td><td>공개 PNG와 바이트가 같아 동일 오류가 있습니다.</td></tr>
<tr><td>보관된 이전 생성 PNG</td><td>4</td><td>모두 로고 불일치. 위 별도 표에 기록했습니다.</td></tr>
<tr><td>기존 WebP 배너·안내도·일정표</td><td>17</td><td>제공 모음판을 잘라낸 이미지입니다. 17개 모두 원본 영역과 디코딩 픽셀이 일치합니다. 회색 청진기 부분·의원·하단 영문 표기 등의 큰 구조는 남아 있습니다. 로고가 매우 작아 미세한 선·영문 철자의 완전 일치는 확정하지 않았습니다. 현재 페이지 연결은 PNG로 교체되어 있습니다.</td></tr>
<tr><td>제공 모음판 JPG</td><td>1</td><td>기존 WebP 17개의 출처. 낮은 해상도 때문에 로고 미세 정합성은 위와 같은 한계가 있습니다.</td></tr>
<tr><td>초기 생성 배너 PNG</td><td>12</td><td>전체 확인 결과 병원 로고가 들어 있지 않습니다. 일반 의료 삽화입니다.</td></tr>
<tr><td>초기 안내도 PNG</td><td>4</td><td>병원명은 안내 문구로 들어 있지만 그래픽 로고는 없습니다.</td></tr>
<tr><td>질병관리청 자료 PNG</td><td>16</td><td>병원 로고 없음. 질병관리청 등 원자료 기관의 로고는 병원 로고 오류에 포함하지 않습니다.</td></tr>
<tr><td>기존 병원 로고 WebP</td><td>1</td><td>이번 비교 기준. 출처 원장에 등록된 SHA-256과 실제 파일이 일치합니다. 공통 헤더가 이 파일을 사용합니다.</td></tr>
<tr><td>병원 내부 사진 WebP</td><td>2</td><td>실제 벽면 간판에 병원 로고가 있습니다. 기존 홈페이지에서 가져온 사진으로, 이번 생성 로고 오류와 같은 재그리기는 확인되지 않습니다.</td></tr>
<tr><td>의료진 사진·실루엣 WebP</td><td>2</td><td>교체 대상으로 볼 그래픽 병원 로고를 확인하지 못했습니다.</td></tr>
<tr><td>탭 아이콘 SVG</td><td>1</td><td>공식 로고와 다른 초록색 T 도형. 추가 브랜드 불일치로 별도 기록했습니다.</td></tr>
</tbody></table></div>
<h2>오류가 들어간 단계와 후속 수정 대상</h2><p>${esc(audit.inference)} 프롬프트 근거는 ${fileLink('assets/generated/redrawn-2026-09-29/prompts.json', '재제작 입력 기록')}에 있습니다. 이는 기록과 파일 비교에서 도출한 판단입니다.</p><p>수정할 때는 생성 그림 안의 브랜드 영역에 공식 로고 파일을 합성하는 방식이 적절합니다. 공개 PNG 17개와 마스터 17개를 함께 갱신하고 내보내기 파일을 다시 만들면 같은 오류가 재유입되는 것을 막을 수 있습니다. 이 검토에서는 이미지 수정·재생성·배포를 수행하지 않았습니다.</p>
<p><a href="findings.json">상세 판정 및 파일 해시</a> · <a href="inventory.json">94개 파일 검토 목록</a> · <a href="older-crop-validation.json">기존 WebP 17개 원본 픽셀 대조</a></p>
</main></body></html>`;
await fs.writeFile(path.join(dir, 'report.ko.html'), html);
await fs.writeFile(path.join(dir, 'verification.json'), JSON.stringify({
  referenceHashMatchesRegisteredAsset: true, currentFindings: findings.length,
  currentImageCopiesMatchRegisteredHash: findings.every((f) => new Set(Object.values(f.hashes)).size === 1),
  currentRoutes: new Set(findings.map((f) => f.pagePath)).size,
  oldSuppliedCropsMatchSourcePixels: suppliedCrops.every((c) => c.sourcePixelsMatch),
  inventoryCount: inventory.length, uniqueInventoryHashCount: new Set(inventory.map((i) => i.sha256)).size,
  allInventoriedFilesClassified: inventory.every((i) => i.review),
  siteFilesChanged: false,
}, null, 2) + '\n');
console.log(JSON.stringify(audit.counts));
