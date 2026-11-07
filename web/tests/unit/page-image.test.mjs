import { expect, it } from 'vitest';
import { loadContent } from '../../scripts/data.mjs';
import { pageImage } from '../../src/lib/page-image.mjs';
const data = await loadContent();
const imageFor = (id) =>
  pageImage(
    data.pages.find((page) => page.id === id),
    data,
  );

it('uses the illustration actually assigned to a guide and its real dimensions', () => {
  expect(imageFor('heart-disease')).toMatchObject({
    file: '/assets/clinic-visuals-hq/banner-heart-hq-original.png',
    width: 1672,
    height: 941,
  });
  const diagram = data.visuals.diagrams.find((visual) => visual.pageId === 'after-endoscopy');
  expect(imageFor('after-endoscopy').id).toBe(diagram.assetId);
  expect(imageFor('echocardiography')).toBeNull();
});

it('uses a real physician portrait while excluding a silhouette and unrelated images', () => {
  expect(imageFor('doctor-park-jongseol').imageKind).toBe('portrait');
  expect(imageFor('doctor-park-rayoung')).toBeNull();
  expect(imageFor('home').file).toBe('/assets/clinic-1600.webp');
});
