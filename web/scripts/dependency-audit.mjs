import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Unpatched ESLint-only dependency; see docs/development-handoff.ko.md.
const exceptionUrl = 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm';
const exceptionExpires = Date.parse('2026-11-10T00:00:00Z');
const allowedPackages = new Set([
  'eslint-config-next', '@next/eslint-plugin-next', 'fast-glob', 'micromatch', 'braces',
]);

export function assessAudit(report, lock, now = Date.now()) {
  if (report.error || !report.metadata?.vulnerabilities || !report.vulnerabilities || !lock.packages)
    throw new Error('Invalid npm audit report or lockfile');
  const vulnerabilities = report.vulnerabilities;
  function excepted(name, seen = new Set()) {
    const entry = vulnerabilities[name];
    if (now >= exceptionExpires || seen.has(name) || !allowedPackages.has(name) || !entry)
      return false;
    if (!entry.nodes?.length || !entry.nodes.every((node) => lock.packages[node]?.dev === true))
      return false;
    const nextSeen = new Set([...seen, name]);
    return entry.via?.length > 0 && entry.via.every((via) => {
      if (typeof via === 'string') return excepted(via, nextSeen);
      return name === 'braces' && via.name === 'braces' && via.url === exceptionUrl &&
        entry.nodes.every((node) => lock.packages[node].version === '3.0.3');
    });
  }
  const blocked = [];
  const exceptions = [];
  for (const [name, entry] of Object.entries(vulnerabilities)) {
    if (!['info', 'low', 'moderate', 'high', 'critical'].includes(entry.severity))
      throw new Error(`Unknown audit severity: ${entry.severity}`);
    if (['info', 'low'].includes(entry.severity)) continue;
    (excepted(name) ? exceptions : blocked).push(name);
  }
  return { blocked, exceptions, exceptionUrl, exceptionExpires: new Date(exceptionExpires).toISOString() };
}

async function main() {
  const result = spawnSync('npm', ['audit', '--json'], { encoding: 'utf8' });
  if (result.error || ![0, 1].includes(result.status))
    throw new Error(result.error?.message ?? result.stderr ?? 'npm audit failed');
  const report = JSON.parse(result.stdout);
  const lock = JSON.parse(await fs.readFile('package-lock.json', 'utf8'));
  const assessment = assessAudit(report, lock);
  await fs.mkdir('reports', { recursive: true });
  await fs.writeFile('reports/npm-audit.json', JSON.stringify(report, null, 2) + '\n');
  await fs.writeFile('reports/npm-audit-assessment.json', JSON.stringify(assessment, null, 2) + '\n');
  if (assessment.exceptions.length)
    console.warn(`Unpatched development-only advisory ${exceptionUrl}; expires ${assessment.exceptionExpires}. Packages: ${assessment.exceptions.join(', ')}`);
  if (assessment.blocked.length) throw new Error(`Dependency audit blocked: ${assessment.blocked.join(', ')}`);
  console.log(assessment.exceptions.length
    ? 'Dependency audit passed with the recorded, time-limited ESLint exception.'
    : 'Dependency audit passed without exceptions.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main();
