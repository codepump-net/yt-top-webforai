import { expect, it } from 'vitest';
import fs from 'node:fs/promises';
import { loadContent } from '../../scripts/data.mjs';
import {
  resolveClinic,
  resolvePages,
  clinicAddressSchema,
  clinicHoursSchema,
} from '../../src/lib/content-model.mjs';
import { validateContent } from '../../scripts/content-contract.mjs';
import { measureObservations } from '../../scripts/measurement.mjs';
const data = await loadContent();
const raw = JSON.parse(await fs.readFile('../content/clinic.json', 'utf8'));
const manuscripts = JSON.parse(await fs.readFile('../content/pages.json', 'utf8'));

it('propagates changed contact and address through prose and schema without source-file edits', () => {
  const copy = structuredClone(raw);
  copy.phone = '031-000-0000';
  copy.addressParts.street = 'Unit-test address';
  copy.hours.find((h) => h.id === 'weekdays').closes = '19:00';
  const clinic = resolveClinic(copy);
  const pages = resolvePages(manuscripts, clinic);
  expect(pages.find((p) => p.id === 'home').description).toContain(copy.phone);
  expect(pages.find((p) => p.id === 'home').description).toContain(copy.addressParts.street);
  expect(pages.find((p) => p.id === 'visit').description).toContain('19:00');
  expect(clinicAddressSchema(clinic).streetAddress).toBe(copy.addressParts.street);
  expect(clinicHoursSchema(clinic).at(-1).closes).toBe('19:00');
  expect(JSON.stringify(pages)).not.toContain(raw.phone);
  expect(() => resolvePages([{ intro: '{{clinic.missing}}' }], clinic)).toThrow(
    'Unknown clinic reference',
  );
});
it('does not invent Saturday break intervals and rejects a break outside clinic hours', () => {
  const hours = clinicHoursSchema(resolveClinic(raw));
  expect(hours).toHaveLength(2);
  expect(hours.flatMap((h) => h.dayOfWeek)).not.toContain('Saturday');
  expect(hours[0].closes).toBe('13:00');
  expect(hours[1].opens).toBe('14:00');
  const bad = structuredClone(raw);
  bad.hours.find((h) => h.id === 'lunch').closes = '23:00';
  expect(() => resolveClinic(bad)).toThrow('Invalid clinic break');
});
it('rejects untraceable evidence and broken contextual links before exporting', () => {
  const pages = structuredClone(data.pages);
  const p = pages.find((p) => p.id === 'echocardiography');
  p.blocks[0].sourceIds = ['missing-source'];
  p.blocks[1].links = [{ pageId: 'holter', anchor: 'missing-anchor', label: 'Check details' }];
  const errors = validateContent(pages, data);
  expect(errors.some((e) => e.includes('unknown source'))).toBe(true);
  expect(errors.some((e) => e.includes('invalid contextual link'))).toBe(true);
});
it('separates both sites, their union, request errors and observation conditions', () => {
  const site = 'https://example.org/new/';
  const common = {
    queryId: 'q',
    engine: 'fixture',
    period: '2026-09',
    language: 'ko',
    status: 'ok',
    answer: 'Clinic',
    model: 'a',
  };
  const rows = [
    { ...common, runId: '1', citations: [site, site + 'test/', 'https://old.example/'] },
    { ...common, runId: '2', citations: ['https://example.org/other/'] },
    { ...common, runId: '3', status: 'error' },
    { ...common, runId: '4', model: 'b', citations: [] },
  ];
  const result = measureObservations(
    rows,
    [{ id: 'q' }],
    site,
    ['Clinic'],
    ['https://old.example/'],
  );
  expect(result).toHaveLength(2);
  expect(result[0]).toMatchObject({
    validAnswers: 2,
    errors: 1,
    newSiteCitedAnswers: 1,
    originalSiteCitedAnswers: 1,
    eitherSiteCitedAnswers: 1,
    citationRate: 0.5,
    eitherSiteCitationRate: 0.5,
    accuracyRate: null,
  });
  const empty = measureObservations(
    [{ ...common, runId: '0', status: 'error' }],
    [{ id: 'q' }],
    site,
    ['Clinic'],
  );
  expect(empty[0].eitherSiteCitationRate).toBeNull();
});
