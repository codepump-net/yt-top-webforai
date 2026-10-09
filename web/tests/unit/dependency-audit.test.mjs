import { describe, expect, it } from 'vitest';
import { assessAudit } from '../../scripts/dependency-audit.mjs';

const now = Date.parse('2026-10-10T00:00:00Z');
function fixture() {
  const report = {
    metadata: { vulnerabilities: { high: 2 } },
    vulnerabilities: {
      braces: {
        severity: 'high', nodes: ['node_modules/braces'],
        via: [{ name: 'braces', url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm' }],
      },
      micromatch: {
        severity: 'high', nodes: ['node_modules/micromatch'], via: ['braces'],
      },
    },
  };
  const lock = { packages: {
    'node_modules/braces': { dev: true, version: '3.0.3' },
    'node_modules/micromatch': { dev: true, version: '4.0.8' },
  } };
  return { report, lock };
}

describe('time-limited development dependency exception', () => {
  it('allows only the recorded unpatched advisory and its development dependents', () => {
    const { report, lock } = fixture();
    expect(assessAudit(report, lock, now).blocked).toEqual([]);
    expect(assessAudit(report, lock, now).exceptions).toEqual(['braces', 'micromatch']);
  });
  it('rejects another advisory on the same package', () => {
    const { report, lock } = fixture();
    report.vulnerabilities.braces.via.push({ name: 'braces', url: 'https://example.com/another' });
    expect(assessAudit(report, lock, now).blocked).toEqual(['braces', 'micromatch']);
  });
  it('rejects runtime copies and missing lockfile nodes', () => {
    const { report, lock } = fixture();
    lock.packages['node_modules/braces'].dev = false;
    expect(assessAudit(report, lock, now).blocked).toEqual(['braces', 'micromatch']);
    delete lock.packages['node_modules/braces'];
    expect(assessAudit(report, lock, now).blocked).toEqual(['braces', 'micromatch']);
  });
  it('requires reassessment after expiry or a package version change', () => {
    const { report, lock } = fixture();
    expect(assessAudit(report, lock, Date.parse('2026-11-10T00:00:00Z')).blocked).toHaveLength(2);
    lock.packages['node_modules/braces'].version = '3.0.4';
    expect(assessAudit(report, lock, now).blocked).toHaveLength(2);
  });
  it('fails closed for audit service errors and dependency cycles', () => {
    const { report, lock } = fixture();
    expect(() => assessAudit({ error: { message: 'network failure' } }, lock, now)).toThrow();
    report.vulnerabilities.braces.via = ['micromatch'];
    expect(assessAudit(report, lock, now).blocked).toHaveLength(2);
  });
});
