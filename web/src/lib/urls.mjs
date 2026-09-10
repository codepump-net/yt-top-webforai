export function normalizeBase(base = '') {
  if (base === '' || base === '/') return '';
  if (!/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/?$/.test(base))
    throw new Error('Invalid SITE_BASE_PATH');
  return base.replace(/\/$/, '');
}
export function assetPath(path, base = '') {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('..') || path.includes('\\'))
    throw new Error('Expected a safe root-relative path');
  return normalizeBase(base) + path;
}
export function absoluteUrl(path, origin, base = '') {
  const url = new URL(origin);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    throw new Error('SITE_ORIGIN must be an origin');
  return url.origin + assetPath(path, base);
}
export function jsonSafe(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
