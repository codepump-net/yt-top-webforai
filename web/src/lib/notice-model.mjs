export const koreaDate = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
export function noticeState(notice, day = koreaDate()) {
  if (notice.kind === 'reference') return 'reference';
  if (notice.endDate && day > notice.endDate) return 'ended';
  if (notice.startDate && day < notice.startDate) return 'upcoming';
  return 'period';
}
export const noticeLabels = {
  reference: '기준일 자료',
  ended: '안내 기간 종료',
  upcoming: '시작 예정',
  period: '지원 기간 안내',
};
export const recentNotices = (items, day = koreaDate()) =>
  [...items]
    .filter((n) => noticeState(n, day) !== 'ended')
    .sort((a, b) => (b.sourcePublishedAt ?? '').localeCompare(a.sourcePublishedAt ?? ''));

export const noticeViews = (views) => (views == null ? '—' : views.toLocaleString('ko-KR'));
export function noticeListing(items, { query = '', category = '', page = 1, pageSize = 5 } = {}) {
  const terms = query.normalize('NFKC').toLocaleLowerCase('ko').trim().split(/\s+/).filter(Boolean);
  const filtered = items
    .filter((item) => {
      const text = [item.title, ...item.tags].join(' ').normalize('NFKC').toLocaleLowerCase('ko');
      return (
        (!category || item.category === category) && terms.every((term) => text.includes(term))
      );
    })
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        b.postedAt.localeCompare(a.postedAt) ||
        b.number - a.number,
    );
  const size = Math.max(1, Math.trunc(pageSize) || 5);
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.max(1, Math.min(pageCount, Math.trunc(page) || 1));
  return {
    items: filtered.slice((currentPage - 1) * size, currentPage * size),
    total: filtered.length,
    pageCount,
    currentPage,
  };
}
