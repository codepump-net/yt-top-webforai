import { it, expect } from 'vitest';
import { citationBelongsToSite, measureObservations } from '../../scripts/measurement.mjs';
const site = 'https://codepump-net.github.io/yt-top-webforai/';
it('does not count another project or spoofed host as a clinic citation', () => {
  expect(citationBelongsToSite(site + 'visit/', site)).toBe(true);
  expect(citationBelongsToSite('https://codepump-net.github.io/another-project/', site)).toBe(
    false,
  );
  expect(citationBelongsToSite('https://codepump-net.github.io/yt-top-webforai-evil/', site)).toBe(
    false,
  );
  expect(
    citationBelongsToSite('https://codepump-net.github.io.attacker.test/yt-top-webforai/', site),
  ).toBe(false);
});
it('separates failed answers and unlabeled accuracy from measured rates', () => {
  const common = { engine: 'test-only', period: '2026-09', language: 'ko', runId: '1' };
  const rows = [
    { ...common, queryId: 'a', status: 'ok', answer: '영통탑내과 안내', citations: [site] },
    { ...common, queryId: 'b', status: 'error' },
    {
      ...common,
      queryId: 'c',
      status: 'ok',
      answer: '다른 설명',
      citations: [],
      accurate: true,
      reviewer: 'Unit reviewer',
    },
  ];
  const metrics = measureObservations(
    rows,
    ['a', 'b', 'c'].map((id) => ({ id })),
    site,
    ['영통탑내과'],
  )[0];
  expect(metrics.citationRate).toBe(0.5);
  expect(metrics.queryCoverage).toBe(2 / 3);
  expect(metrics.errors).toBe(1);
  expect(metrics.accuracyRate).toBe(1);
  expect(metrics.humanLabeledAnswers).toBe(1);
  expect(() =>
    measureObservations(
      [...rows, rows[0]],
      ['a', 'b', 'c'].map((id) => ({ id })),
      site,
      ['영통탑내과'],
    ),
  ).toThrow('Duplicate');
});
