// Read-only analysis of the final export and the locally retained comparison samples.
// Run from web/: node scripts/seo-review.mjs. Reports are not part of the deployed site.
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { gzipSync } from 'node:zlib';
import { loadContent } from './data.mjs';
import { sha256 } from './content-contract.mjs';
const folder = process.argv[2] ?? '../docs/seo-aeo-geo-review-2026-09-11';
if (!path.resolve(folder).startsWith(path.resolve('../docs') + path.sep))
  throw new Error('Audit reports must stay in docs');
await fs.mkdir(folder, { recursive: true });
const read = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const data = await loadContent();
const manifest = await read('reports/build-manifest.json');
if (sha256(data) !== manifest.contentDigest)
  throw new Error('Export is stale relative to current content/renderers');
const flatten = (value) => {
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(flatten)];
};
const hasType = (node, type) => [node['@type']].flat().includes(type);
const rows = [];
const incoming = new Map(data.pages.map((p) => [p.path, new Set()]));
for (const route of manifest.routes) {
  const raw = await fs.readFile(path.join('out', route.file), 'utf8');
  if (sha256(raw) !== route.sha256) throw new Error(`Changed exported HTML: ${route.path}`);
  const $ = load(raw);
  const page = data.pages.find((p) => p.id === route.id);
  const graph = $('script[type="application/ld+json"]')
    .toArray()
    .flatMap((el) => flatten(JSON.parse($(el).text())));
  const clinics = graph.filter((n) => hasType(n, 'MedicalClinic'));
  const answers = page.questions.map((q) => q.answer);
  const blocks = new Set(page.blocks.map((b) => b.text));
  const externalSources = page.sources.filter((s) => new URL(s.url).hostname !== 'yttop.co.kr');
  const contentOnly = $('.main-article').clone();
  contentOnly.find('.provenance').remove();
  const bodyText = contentOnly.text().replace(/\s+/g, ' ').trim();
  const contentLinks = $('main a[href]')
    .toArray()
    .map((a) => $(a).attr('href'));
  for (const a of $('a[href]').toArray()) {
    const target = new URL($(a).attr('href'), manifest.origin + manifest.basePath + page.path);
    if (target.origin !== manifest.origin) continue;
    const local = target.pathname.slice(manifest.basePath.length) || '/';
    if (local !== page.path && incoming.has(local)) incoming.get(local).add(page.path);
  }
  rows.push({
    id: page.id,
    path: page.path,
    template: page.template,
    risk: page.risk,
    title: $('title').text(),
    description: $('meta[name=description]').attr('content'),
    canonical: $('link[rel=canonical]').attr('href'),
    robots: $('meta[name=robots]')
      .map((_, e) => $(e).attr('content'))
      .get()
      .join(', '),
    h1Count: $('main h1').length,
    h2Count: $('main h2').length,
    htmlBytes: Buffer.byteLength(raw),
    htmlGzipBytes: gzipSync(raw).length,
    mainTextChars: $('main').text().replace(/\s+/g, ' ').trim().length,
    ownArticleTextCharsExcludingSources: bodyText.length,
    authoredIntroAndBlocksChars: [page.intro, ...page.blocks.map((b) => b.text)].join(' ').length,
    questionCount: answers.length,
    answersRepeatingBody: answers.filter((a) => blocks.has(a)).length,
    sourceLinkedBlocks: page.blocks.filter((b) => b.sourceIds?.length).length,
    sourceLinkedQuestions: page.questions.filter((q) => q.sourceIds?.length).length,
    comparisonTables: $('main table.answer-table').length,
    contextualLinks: $('main .context-links a').length,
    sourceCount: page.sources.length,
    externalSourceCount: externalSources.length,
    externalSourceUrls: externalSources.map((s) => s.url),
    clinicIds: clinics.map((n) => n['@id']),
    clinicSchemaKeys: Object.keys(clinics[0] ?? {}),
    schemaTypes: [...new Set(graph.flatMap((n) => n['@type'] ?? []))],
    hasSchemaAuthor: graph.some((n) => n.author),
    hasSchemaReviewer: graph.some((n) => n.reviewedBy),
    hasOpeningHours: clinics.some((n) => n.openingHoursSpecification || n.openingHours),
    hasGeo: clinics.some((n) => n.geo),
    hasMapSchema: clinics.some((n) => n.hasMap),
    imageCount: $('img').length,
    imageAltMissing: $('img:not([alt])').length,
    imageAltMarkup: $('img')
      .toArray()
      .filter((e) => /<[^>]*|\bstyle=/i.test($(e).attr('alt') ?? '')).length,
    imageDimensionsMissing: $('img')
      .toArray()
      .filter((e) => !$(e).attr('width') || !$(e).attr('height')).length,
    bodyDoctorLinks: contentLinks.filter((u) => /\/doctors\/park-/.test(u)).length,
    bodyExternalLinks: contentLinks.filter((u) => /^https?:\/\//.test(u)).length,
  });
}
for (const row of rows) row.incomingPages = incoming.get(row.path).size;
const clinical = rows.filter((p) =>
  ['service-detail', 'condition-detail', 'checkup-detail', 'article-detail'].includes(p.template),
);
const questionCounts = new Map();
for (const p of data.pages)
  for (const q of p.questions)
    questionCounts.set(q.question, (questionCounts.get(q.question) ?? 0) + 1);
const baselines = [];
for (const name of ['2026-09-11-thegungang365', '2026-09-11-olympicpark365']) {
  const samples = (await read(`../research/${name}/evidence/audit.json`)).filter((p) => p.raw);
  const flattened = samples.flatMap((p) => flatten(p.raw.jsonld));
  const home = samples.find((p) => new URL(p.url).pathname === '/');
  const meta = (p, key) => p.raw.meta.find((m) => m.name === key)?.content;
  baselines.push({
    name,
    evidence: `research/${name}/evidence/audit.json`,
    checkedAt: samples[0].checkedAt,
    htmlSampleCount: samples.length,
    uniqueTitles: new Set(samples.map((p) => p.raw.title)).size,
    uniqueDescriptions: new Set(samples.map((p) => meta(p, 'description'))).size,
    oneH1Count: samples.filter((p) => p.raw.headings.filter((h) => h.tag === 'H1').length === 1)
      .length,
    noindexSamples: samples.filter((p) =>
      /noindex/.test(meta(p, 'robots') + ' ' + p.headers['x-robots-tag']),
    ).length,
    homeHtmlBytes: home.bytes,
    homeImageCount: home.raw.images.length,
    distinctClinicIds: [
      ...new Set(flattened.filter((n) => hasType(n, 'MedicalClinic')).map((n) => n['@id'])),
    ],
    clinicHasHours: flattened.some(
      (n) => hasType(n, 'MedicalClinic') && (n.openingHoursSpecification || n.openingHours),
    ),
    clinicHasGeo: flattened.some((n) => hasType(n, 'MedicalClinic') && n.geo),
    samplesWithSchemaAuthor: samples.filter((p) => flatten(p.raw.jsonld).some((n) => n.author))
      .length,
  });
}
const published = rows.filter((r) => r.id !== 'not-found');
const home = rows.find((r) => r.id === 'home');
const summary = {
  checkedAt: new Date().toISOString(),
  sourceContentDigest: manifest.contentDigest,
  buildMode: manifest.mode,
  plannedPublicUrl: manifest.origin + manifest.basePath + '/',
  routes: rows.length,
  non404Routes: published.length,
  noindexRoutes: rows.filter((p) => p.robots.includes('noindex')).length,
  uniqueTitles: new Set(rows.map((p) => p.title)).size,
  uniqueDescriptions: new Set(rows.map((p) => p.description)).size,
  oneH1Routes: rows.filter((p) => p.h1Count === 1).length,
  selfCanonicalRoutes: rows.filter(
    (p) => p.canonical === manifest.origin + manifest.basePath + p.path,
  ).length,
  clinicSchemaRoutes: published.filter((r) => r.clinicIds.length).length,
  clinicIds: [...new Set(published.flatMap((r) => r.clinicIds))],
  hoursSchemaRoutes: published.filter((r) => r.hasOpeningHours).length,
  mapSchemaRoutes: published.filter((r) => r.hasMapSchema).length,
  geoSchemaRoutes: published.filter((r) => r.hasGeo).length,
  imageAltMissing: rows.reduce((s, r) => s + r.imageAltMissing, 0),
  imageAltMarkup: rows.reduce((s, r) => s + r.imageAltMarkup, 0),
  imageDimensionsMissing: rows.reduce((s, r) => s + r.imageDimensionsMissing, 0),
  orphanRoutes: rows
    .filter((r) => r.id !== 'not-found' && r.incomingPages === 0)
    .map((r) => r.path),
  questionPages: rows.filter((r) => r.questionCount).length,
  questionCount: rows.reduce((s, r) => s + r.questionCount, 0),
  answersRepeatingBody: rows.reduce((s, r) => s + r.answersRepeatingBody, 0),
  sourceLinkedBlocks: rows.reduce((s, r) => s + r.sourceLinkedBlocks, 0),
  sourceLinkedQuestions: rows.reduce((s, r) => s + r.sourceLinkedQuestions, 0),
  comparisonTables: rows.reduce((s, r) => s + r.comparisonTables, 0),
  contextualLinks: rows.reduce((s, r) => s + r.contextualLinks, 0),
  repeatedQuestions: [...questionCounts]
    .filter(([, n]) => n > 1)
    .map(([question, pages]) => ({ question, pages })),
  clinicalDetails: clinical.length,
  clinicalDetailsWithExternalSources: clinical.filter((p) => p.externalSourceCount).length,
  clinicalDetailsWithAuthor: clinical.filter((p) => p.hasSchemaAuthor).length,
  clinicalDetailsWithReviewer: clinical.filter((p) => p.hasSchemaReviewer).length,
  clinicalDetailsWithDirectDoctorLinks: clinical.filter((p) => p.bodyDoctorLinks).length,
  uniqueExternalMedicalSourceUrls: [...new Set(clinical.flatMap((p) => p.externalSourceUrls))],
  shortestClinicalIntroAndBlocks: Math.min(...clinical.map((p) => p.authoredIntroAndBlocksChars)),
  longestClinicalIntroAndBlocks: Math.max(...clinical.map((p) => p.authoredIntroAndBlocksChars)),
  reviewRecords: data.reviews.length,
  operationReviewPresent: !!data.clinic.operationsReview,
  activeSitemapUrls: ((await fs.readFile('out/sitemap.xml', 'utf8')).match(/<loc>/g) ?? []).length,
  plannedSitemapUrls: (
    (await fs.readFile('reports/planned-sitemap.xml', 'utf8')).match(/<loc>/g) ?? []
  ).length,
  home: { htmlBytes: home.htmlBytes, htmlGzipBytes: home.htmlGzipBytes, images: home.imageCount },
  baselines,
  caveats: [
    'Counts describe implementation, not rankings or citation rates.',
    'Historical external sample sizes differ from the 45-route full local audit.',
    'HTML bytes are uncompressed document bytes, not total page load or clinical content quality.',
    'Duplicate answers are an editorial completeness signal, not an automatic search penalty.',
  ],
};
await fs.writeFile(
  `${folder}/metrics.json`,
  JSON.stringify({ summary, pages: rows }, null, 2) + '\n',
);
const fields = [
  'id',
  'path',
  'template',
  'h1Count',
  'htmlBytes',
  'authoredIntroAndBlocksChars',
  'questionCount',
  'answersRepeatingBody',
  'externalSourceCount',
  'hasSchemaAuthor',
  'hasSchemaReviewer',
  'hasOpeningHours',
  'hasGeo',
  'bodyDoctorLinks',
  'incomingPages',
];
const csv = (v) => '"' + String(v ?? '').replaceAll('"', '""') + '"';
await fs.writeFile(
  `${folder}/page-metrics.csv`,
  '\ufeff' +
    [fields, ...rows.map((r) => fields.map((f) => r[f]))]
      .map((r) => r.map(csv).join(','))
      .join('\n') +
    '\n',
);
console.log(JSON.stringify(summary, null, 2));
