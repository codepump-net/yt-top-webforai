import fs from 'node:fs/promises';
import { measureObservations } from './measurement.mjs';
const file = process.argv[2];
if (!file) throw new Error('Usage: npm run measure -- path/to/private-observations.json');
const catalog = JSON.parse(await fs.readFile('../content/measurement-queries.json', 'utf8'));
const observations = JSON.parse(await fs.readFile(file, 'utf8'));
const metrics = measureObservations(observations, catalog.queries, catalog.site, catalog.aliases);
await fs.mkdir('reports', { recursive: true });
await fs.writeFile(
  'reports/ai-observations.json',
  JSON.stringify(
    {
      site: catalog.site,
      generatedAt: new Date().toISOString(),
      metrics,
      note: 'Observed samples only; no causal lift or high-frequency claim. Error responses are excluded from answer denominators.',
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(metrics, null, 2));
