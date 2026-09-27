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
  period: '지원기간 안내',
};
export const recentNotices = (items, day = koreaDate()) =>
  [...items]
    .filter((n) => noticeState(n, day) !== 'ended')
    .sort((a, b) => (b.sourcePublishedAt ?? '').localeCompare(a.sourcePublishedAt ?? ''));
