import fs from 'node:fs/promises';
import { measureConversations } from './conversation-measurement.mjs';
const file = process.argv[2];
if (!file)
  throw new Error('Usage: npm run measure:conversations -- path/to/private-observations.json');
const catalog = JSON.parse(await fs.readFile('../content/measurement-conversations.json', 'utf8'));
const rows = JSON.parse(await fs.readFile(file, 'utf8'));
if (rows.some((r) => r.querySetVersion !== catalog.version))
  throw new Error('Scenario version mismatch');
const metrics = measureConversations(
  rows,
  catalog.scenarios,
  catalog.site,
  catalog.aliases,
  catalog.originalSites,
);
await fs.mkdir('reports', { recursive: true });
await fs.writeFile(
  'reports/ai-conversations.json',
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      version: catalog.version,
      metrics,
      note: 'Observed samples only. Failed and incomplete conversations remain explicit. No causal lift claim.',
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(metrics, null, 2));
