import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
export async function serve({
  port = Number(process.env.PORT ?? 3000),
  root = path.resolve('out'),
} = {}) {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'build-manifest.json'), 'utf8'));
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.woff2': 'font/woff2',
  };
  const server = http.createServer(async (req, res) => {
    const error = async (status) => {
      res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(await fs.readFile(path.join(root, '404.html')));
    };
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405);
        res.end();
        return;
      }
      if (manifest.basePath && pathname === manifest.basePath) {
        res.writeHead(301, { Location: manifest.basePath + '/' });
        res.end();
        return;
      }
      if (manifest.basePath && !pathname.startsWith(manifest.basePath + '/')) {
        await error(404);
        return;
      }
      const relative = pathname.slice(manifest.basePath.length);
      let file = path.resolve(root, '.' + relative);
      if (!file.startsWith(root + path.sep) && file !== root) {
        await error(404);
        return;
      }
      const stat = await fs.stat(file);
      if (stat.isDirectory()) {
        if (!pathname.endsWith('/')) {
          res.writeHead(301, { Location: pathname + '/' });
          res.end();
          return;
        }
        file = path.join(file, 'index.html');
      }
      const buffer = await fs.readFile(file);
      const contentType = types[path.extname(file)] ?? 'application/octet-stream';
      const compress =
        /text|json|xml|svg|javascript/.test(contentType) &&
        /gzip/.test(req.headers['accept-encoding'] ?? '');
      const body = compress ? gzipSync(buffer) : buffer;
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=0, must-revalidate',
        Vary: 'Accept-Encoding',
        ...(compress ? { 'Content-Encoding': 'gzip' } : {}),
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      await error(404);
    }
  });
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}${manifest.basePath}/` };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { url } = await serve();
  console.log(`Static preview: ${url}`);
}
