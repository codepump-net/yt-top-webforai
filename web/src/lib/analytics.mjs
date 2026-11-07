export function analyticsPage(path, search = '') {
  const searchKeys = new Set([
    'q',
    's',
    'search',
    'query',
    'keyword',
    'search_term',
    'search_query',
  ]);
  return (
    !/(?:^|\/)(?:search|cases)(?:\/|$)/.test(path) &&
    ![...new URLSearchParams(search).keys()].some((key) => searchKeys.has(key.toLowerCase()))
  );
}
export function analyticsLocation(value) {
  const url = new URL(value);
  return url.origin + url.pathname;
}
export function analyticsReferrer(value) {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) ? url.origin + '/' : '';
  } catch {
    return '';
  }
}
export function contactMethod(value, mapUrl) {
  if (value.startsWith('tel:')) return 'phone';
  if (value === mapUrl) return 'map';
  return null;
}
