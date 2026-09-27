'use client';
import { useSyncExternalStore } from 'react';
import notices from '../../../content/notices.json';
import { koreaDate, noticeState, noticeLabels } from '@/lib/notice-model.mjs';
const subscribe = (callback: () => void) => {
  const timer = window.setInterval(callback, 60_000);
  window.addEventListener('focus', callback);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener('focus', callback);
  };
};
type Notice = (typeof notices)[number];
function NoticeCard({ item, day }: { item: Notice; day: string }) {
  const state = noticeState(item, day) as keyof typeof noticeLabels;
  return (
    <section className="notice-card" id={item.id}>
      <span className={`notice-status ${state}`}>{noticeLabels[state]}</span>
      <h2>{item.title}</h2>
      <p className="notice-summary">{item.summary}</p>
      <p className="notice-dates">
        {item.sourcePublishedAt && (
          <>
            공식 자료 발표 <time dateTime={item.sourcePublishedAt}>{item.sourcePublishedAt}</time>{' '}
            ·{' '}
          </>
        )}
        내용 확인 <time dateTime={item.checkedAt}>{item.checkedAt}</time>
      </p>
      {item.startDate && (
        <p className="notice-period">
          안내 기간: <time dateTime={item.startDate}>{item.startDate}</time> ~{' '}
          {item.endDate ? (
            <time dateTime={item.endDate}>{item.endDate}</time>
          ) : (
            '재고·예산 및 공식 안내 확인'
          )}
        </p>
      )}
      {state === 'ended' && (
        <p className="notice-expired">
          안내된 기간이 끝난 자료입니다. 다음 사업 일정은 해당 기관의 새 공지를 확인해 주세요.
        </p>
      )}
      {item.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <p className="notice-availability">{item.availability}</p>
      <ul className="notice-sources">
        {item.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label} <span className="sr-only">(새 창)</span> ↗
            </a>
          </li>
        ))}
      </ul>
      {'attachment' in item && item.attachment && (
        <a
          className="button secondary"
          href={item.attachment.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.attachment.label} (PDF, 새 창)
        </a>
      )}
    </section>
  );
}
export function NoticeBoard({ initialDay }: { initialDay: string }) {
  const day = useSyncExternalStore(
    subscribe,
    () => koreaDate(),
    () => initialDay,
  );
  const current = notices.filter((n) => noticeState(n, day) !== 'ended');
  const archived = notices.filter((n) => noticeState(n, day) === 'ended');
  return (
    <div className="notice-board">
      <nav className="notice-topics" aria-label="예방접종·감염병 안내 주제">
        {notices.map((n) => (
          <a key={n.id} href={`#${n.id}`}>
            {n.title}
          </a>
        ))}
      </nav>
      <p className="small">
        지원 대상·일정은 공식 자료의 확인일을 기준으로 안내합니다. 방문 전 대상 요건과 백신 보유
        여부를 확인해 주세요.
      </p>
      {current.map((n) => (
        <NoticeCard key={n.id} item={n} day={day} />
      ))}
      {archived.length > 0 && (
        <div className="notice-archive">
          <h2>기간이 지난 안내</h2>
          {archived.map((n) => (
            <NoticeCard key={n.id} item={n} day={day} />
          ))}
        </div>
      )}
    </div>
  );
}
