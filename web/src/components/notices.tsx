'use client';
import { useRef, useState, useSyncExternalStore } from 'react';
import {
  koreaDate,
  noticeState,
  noticeLabels,
  noticeListing,
  noticeViews,
} from '@/lib/notice-model.mjs';
import { assetPath } from '@/lib/urls.mjs';
import type { Notice } from '@/lib/notice-types';

const subscribe = (callback: () => void) => {
  const timer = window.setInterval(callback, 60_000);
  window.addEventListener('focus', callback);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener('focus', callback);
  };
};
function useDay(initialDay: string) {
  return useSyncExternalStore(
    subscribe,
    () => koreaDate(),
    () => initialDay,
  );
}
function Status({ notice, day }: { notice: Notice; day: string }) {
  const state = noticeState(notice, day) as keyof typeof noticeLabels;
  return <span className={`notice-status ${state}`}>{noticeLabels[state]}</span>;
}
export function NoticeMeta({ notice, initialDay }: { notice: Notice; initialDay: string }) {
  const day = useDay(initialDay);
  return (
    <div className="notice-article-meta">
      <div className="notice-labels">
        <span>{notice.category}</span>
        <Status notice={notice} day={day} />
      </div>
      <dl className="notice-metadata">
        <div>
          <dt>최초 게시</dt>
          <dd>
            <time dateTime={notice.postedAt}>{notice.postedAt}</time>
          </dd>
        </div>
        {notice.sourcePublishedAt && (
          <div>
            <dt>공식 자료 발표</dt>
            <dd>
              <time dateTime={notice.sourcePublishedAt}>{notice.sourcePublishedAt}</time>
            </dd>
          </div>
        )}
        {notice.sourceReviewedAt && (
          <div>
            <dt>출처 페이지 검토일</dt>
            <dd>
              <time dateTime={notice.sourceReviewedAt}>{notice.sourceReviewedAt}</time>
            </dd>
          </div>
        )}
        <div>
          <dt>내용 확인</dt>
          <dd>
            <time dateTime={notice.checkedAt}>{notice.checkedAt}</time>
          </dd>
        </div>
        <div>
          <dt>조회수</dt>
          <dd aria-label={notice.views == null ? '집계된 조회수 없음' : undefined}>
            {noticeViews(notice.views)}
          </dd>
        </div>
      </dl>
      {noticeState(notice, day) === 'ended' && (
        <p className="notice-expired">
          안내된 기간이 끝난 자료입니다. 다음 사업 일정은 해당 기관의 새 공지를 확인해 주세요.
        </p>
      )}
      <ul className="notice-tags" aria-label="공지 태그">
        {notice.tags.map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>
    </div>
  );
}
export function NoticeBoard({
  items,
  initialDay,
  basePath = '',
}: {
  items: Notice[];
  initialDay: string;
  basePath?: string;
}) {
  const day = useDay(initialDay);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const resultTitle = useRef<HTMLParagraphElement>(null);
  const listing = noticeListing(items, { query, category, page });
  const categories = [...new Set(items.map((item) => item.category))];
  const go = (next: number) => {
    setPage(next);
    requestAnimationFrame(() => resultTitle.current?.focus());
  };
  return (
    <section className="notice-board" aria-label="공지사항 게시판">
      <form
        className="notice-controls"
        role="search"
        aria-label="공지사항 검색"
        onSubmit={(event) => event.preventDefault()}
      >
        <div>
          <label htmlFor="notice-query">제목·태그 검색</label>
          <input
            id="notice-query"
            type="search"
            value={query}
            placeholder="예: 독감, 대상포진"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <div>
          <label htmlFor="notice-category">공지 분류</label>
          <select
            id="notice-category"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
          >
            <option value="">전체 분류</option>
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setQuery('');
            setCategory('');
            setPage(1);
          }}
        >
          전체 공지 보기
        </button>
      </form>
      <p ref={resultTitle} tabIndex={-1} className="notice-result-count" role="status">
        공지 {listing.total}개 · {listing.currentPage} / {listing.pageCount}페이지
      </p>
      <table className="notice-table">
        <caption className="sr-only">공지사항 목록: 번호, 제목, 게시일, 조회수</caption>
        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">제목</th>
            <th scope="col">게시일</th>
            <th scope="col">조회수</th>
          </tr>
        </thead>
        <tbody>
          {listing.items.map((item: Notice) => (
            <tr key={item.id} className={item.pinned ? 'is-pinned' : ''}>
              <td className="notice-number" data-label="번호">
                {item.number}
              </td>
              <th scope="row" className="notice-title-cell">
                <div className="notice-labels">
                  {item.pinned && <span className="notice-pin">중요 공지</span>}
                  <span>{item.category}</span>
                  <Status notice={item} day={day} />
                </div>
                <a href={assetPath(item.path, basePath)}>{item.title}</a>
                <p>{item.summary}</p>
              </th>
              <td data-label="게시일">
                <time dateTime={item.postedAt}>{item.postedAt}</time>
              </td>
              <td data-label="조회수">
                <span aria-label={item.views == null ? '집계된 조회수 없음' : undefined}>
                  {noticeViews(item.views)}
                </span>
              </td>
            </tr>
          ))}
          {listing.total === 0 && (
            <tr>
              <td colSpan={4} className="notice-empty">
                검색 결과가 없습니다. 다른 제목이나 태그를 입력해 주세요.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <nav className="notice-pagination" aria-label="공지사항 페이지 이동">
        <button
          type="button"
          disabled={listing.currentPage === 1}
          onClick={() => go(listing.currentPage - 1)}
        >
          이전
        </button>
        {Array.from({ length: listing.pageCount }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            type="button"
            aria-label={`${number}페이지`}
            aria-current={number === listing.currentPage ? 'page' : undefined}
            onClick={() => go(number)}
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          disabled={listing.currentPage === listing.pageCount}
          onClick={() => go(listing.currentPage + 1)}
        >
          다음
        </button>
      </nav>
      <p className="small">
        조회수가 ‘—’인 글은 집계된 값이 없습니다. 지원 접종은 사업별 지정 의료기관과 접종 가능 여부를
        확인해 주세요.
      </p>
      <nav className="notice-topics" aria-label="모든 공지 바로가기">
        {items.map((item) => (
          <a id={item.id} key={item.id} href={assetPath(item.path, basePath)}>
            {item.title}
          </a>
        ))}
      </nav>
    </section>
  );
}
