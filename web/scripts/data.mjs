import fs from 'node:fs/promises';
import { sha256 } from './content-contract.mjs';
import { resolveClinic, resolvePages } from '../src/lib/content-model.mjs';
export async function loadContent() {
  const names = [
    'pages',
    'clinic',
    'physicians',
    'assets',
    'reviews',
    'case-links',
    'page-intents',
  ];
  const values = await Promise.all(
    names.map((n) => fs.readFile(`../content/${n}.json`, 'utf8').then(JSON.parse)),
  );
  const templates = [
    'src/components/content.tsx',
    'src/components/chrome.tsx',
    'src/components/search.tsx',
    'src/components/site-navigation.tsx',
    'src/components/article-navigation.tsx',
    'src/lib/information-architecture.mjs',
    'src/lib/site.ts',
    'src/lib/content-model.mjs',
    'src/lib/structured-data.mjs',
    'src/lib/languages.ts',
    'src/app/(ko)/layout.tsx',
    'src/app/global-not-found.tsx',
    'src/app/(ko)/page.tsx',
    'src/app/(ko)/not-found.tsx',
    'src/app/(ko)/[...segments]/page.tsx',
    'src/app/[locale]/layout.tsx',
    'src/app/[locale]/checkups/visa/page.tsx',
    '../content/case-links.json',
  ];
  const rendererDigest = sha256(
    (await Promise.all(templates.map((f) => fs.readFile(f, 'utf8'))))
      .map((s) => s.replace(/\r\n/g, '\n'))
      .join('\n'),
  );
  const data = Object.fromEntries(names.map((n, i) => [n, values[i]]));
  data.clinic = resolveClinic(data.clinic);
  data.pages = resolvePages(data.pages, data.clinic);
  const publicationApproval = await fs
    .readFile('../content/publication-approval.json', 'utf8')
    .then(JSON.parse)
    .catch((e) => {
      if (e.code === 'ENOENT') return null;
      throw e;
    });
  return {
    ...data,
    caseLinks: data['case-links'],
    pageIntents: data['page-intents'],
    rendererDigest,
    publicationApproval,
  };
}
