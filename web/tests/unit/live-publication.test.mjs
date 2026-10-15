import { expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
const run = promisify(execFile);
const script = fileURLToPath(new URL('../../scripts/verify-live.mjs', import.meta.url));

it.each([
  ['review', [], 'Publication mode mismatch'],
  ['production', [{ path: '/', indexable: false }], 'must contain indexable patient pages'],
])(
  'rejects a %s manifest that cannot satisfy a public release before any fetch',
  async (mode, routes, message) => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'clinic-publication-'));
    try {
      await fs.mkdir(path.join(dir, 'reports'));
      await fs.writeFile(
        path.join(dir, 'reports/build-manifest.json'),
        JSON.stringify({ mode, routes }),
      );
      await expect(
        run(process.execPath, [script], {
          cwd: dir,
          env: { ...process.env, EXPECTED_MODE: 'production' },
          timeout: 10000,
        }),
      ).rejects.toThrow(message);
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  },
);
