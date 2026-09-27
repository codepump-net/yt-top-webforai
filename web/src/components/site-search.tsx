'use client';
import { useEffect, useState } from 'react';
import { Search, type SearchItem } from './search';

export function SiteSearch({
  indexUrl,
  sitemapUrl,
  categories,
}: {
  indexUrl: string;
  sitemapUrl: string;
  categories: string[];
}) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(indexUrl, { signal: controller.signal, cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error('Search unavailable');
        return response.json();
      })
      .then((data: SearchItem[]) => {
        setItems(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });
    return () => controller.abort();
  }, [indexUrl, attempt]);
  return (
    <>
      <p className="search-load-status small" role="status">
        {status === 'loading'
          ? '검색 안내를 불러오고 있습니다.'
          : status === 'error'
            ? '검색 안내를 불러오지 못했습니다. 전체 페이지에서도 안내를 찾을 수 있습니다.'
            : '검색어는 이 브라우저 안에서만 처리됩니다.'}
      </p>
      {status === 'error' && (
        <p>
          <button
            className="button secondary"
            onClick={() => {
              setStatus('loading');
              setAttempt((n) => n + 1);
            }}
          >
            다시 불러오기
          </button>{' '}
          <a href={sitemapUrl}>전체 페이지 보기</a>
        </p>
      )}
      <Search items={items} filter categories={categories} idlePrompt sitemapUrl={sitemapUrl} />
    </>
  );
}
