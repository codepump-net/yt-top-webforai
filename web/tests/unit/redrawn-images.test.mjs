import { expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { loadContent } from '../../scripts/data.mjs';
import { validatePatientAdditions } from '../../scripts/patient-additions-contract.mjs';
import { validateRedrawnImage } from '../../scripts/redrawn-image-contract.mjs';
import { serve } from '../../scripts/serve.mjs';

const data = await loadContent();

it('rejects a low-resolution WebP substituted for any of the 17 required PNGs', () => {
  const invalid = structuredClone(data);
  const asset = invalid.assets.find((a) => a.id === 'banner-kidney');
  asset.file = '/assets/banner-kidney.webp';
  delete asset.generatedOriginal;
  expect(validatePatientAdditions(invalid)).toContain('Native redrawn PNG required: banner-kidney');
});

it('keeps the image-file hash separate from the matching HTML guidance hash', () => {
  expect(validatePatientAdditions(data)).toEqual([]);
  const invalid = structuredClone(data);
  invalid.visuals.diagrams[0].steps[0].text += ' 변경된 안내';
  expect(validatePatientAdditions(invalid)).toContain('Diagram guidance is stale: heart-flow');
});

it('verifies saved master bytes and real PNG dimensions, not just a PNG filename', async () => {
  const asset = data.assets.find((a) => a.id === 'banner-heart');
  const bytes = await fs.readFile(`public${asset.file}`);
  const source = await fs.readFile(`../${asset.sourceFile}`);
  expect(await validateRedrawnImage(asset, bytes, source)).toEqual([]);
  expect(
    await validateRedrawnImage({ ...asset, width: 400, height: 225 }, bytes, source),
  ).toContain('Native PNG format or dimensions invalid: banner-heart');
  expect(await validateRedrawnImage(asset, bytes, Buffer.from('wrong master'))).toContain(
    'Native PNG differs from saved master: banner-heart',
  );
});

it('serves PNG and PDF with usable media types at both root and project paths', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'clinic-media-'));
  const root = path.join(directory, 'out');
  await fs.mkdir(path.join(root, 'assets'), { recursive: true });
  await fs.mkdir(path.join(directory, 'reports'));
  await fs.writeFile(path.join(root, '404.html'), 'Not found');
  const asset = data.assets.find((a) => a.id === 'banner-heart');
  const png = await fs.readFile(`public${asset.file}`);
  await fs.writeFile(path.join(root, 'assets', 'image.png'), png);
  await fs.writeFile(path.join(root, 'assets', 'document.pdf'), '%PDF-1.7\n');
  try {
    for (const basePath of ['', '/yt-top-webforai']) {
      await fs.writeFile(
        path.join(directory, 'reports', 'build-manifest.json'),
        JSON.stringify({ basePath }),
      );
      const { server, url } = await serve({ port: 0, root });
      try {
        for (const [file, mime] of [
          ['image.png', 'image/png'],
          ['document.pdf', 'application/pdf'],
        ]) {
          const response = await fetch(`${url}assets/${file}`);
          expect(response.status).toBe(200);
          expect(response.headers.get('content-type')).toBe(mime);
          const bytes = Buffer.from(await response.arrayBuffer());
          if (file.endsWith('.png')) expect(bytes.equals(png)).toBe(true);
        }
      } finally {
        await new Promise((resolve) => server.close(resolve));
      }
    }
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
