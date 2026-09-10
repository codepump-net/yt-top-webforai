import { spawnSync } from 'node:child_process';
const result = spawnSync(
  process.env.PYTHON ?? 'python',
  ['-m', 'unittest', 'discover', '-s', 'harness/tests', '-v'],
  { cwd: '..', stdio: 'inherit', env: { ...process.env, PYTHONUTF8: '1' } },
);
if (result.error || result.status !== 0) process.exit(result.status || 1);
