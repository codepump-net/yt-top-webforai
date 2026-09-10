import fs from 'node:fs/promises';
import { sha256 } from './content-contract.mjs';
export async function loadContent() {
  const names = ['pages', 'clinic', 'physicians', 'assets', 'reviews'];
  const values = await Promise.all(
    names.map((n) => fs.readFile(`../content/${n}.json`, 'utf8').then(JSON.parse)),
  );
  const templates = ['src/components/content.tsx', 'src/components/chrome.tsx', 'src/lib/site.ts'];
  const rendererDigest = sha256(
    (await Promise.all(templates.map((f) => fs.readFile(f, 'utf8')))).join('\n'),
  );
  return { ...Object.fromEntries(names.map((n, i) => [n, values[i]])), rendererDigest };
}
