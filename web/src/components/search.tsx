'use client';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Search as SearchIcon } from 'lucide-react';

export type SearchItem = {
  title: string;
  description: string;
  category: string;
  url: string;
  text: string;
};
export function Search({
  items,
  label = '궁금한 검사나 진료를 찾아보세요',
  filter = false,
}: {
  items: SearchItem[];
  label?: string;
  filter?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const categories = ['전체', ...new Set(items.map((p) => p.category))];
  const results = useMemo(() => {
    const words = query
      .normalize('NFKC')
      .toLocaleLowerCase('ko')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return items.filter(
      (p) =>
        (category === '전체' || p.category === category) &&
        words.every((word) =>
          `${p.title} ${p.description} ${p.text}`
            .normalize('NFKC')
            .toLocaleLowerCase('ko')
            .includes(word),
        ),
    );
  }, [items, query, category]);
  return (
    <div className="search-widget">
      <label className="search-label" htmlFor="site-query">
        {label}
      </label>
      <div className="search-field">
        <SearchIcon size={22} />
        <input
          id="site-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 심장초음파, 내시경, 진료시간"
          autoComplete="off"
          maxLength={120}
        />
      </div>
      {filter && (
        <div className="filter-row" role="group" aria-label="분야 선택">
          {categories.map((c) => (
            <button
              type="button"
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <noscript>
        <p className="notice-box">
          검색 필터는 JavaScript가 필요합니다. 아래 전체 목록에서 페이지를 선택할 수 있습니다.
        </p>
      </noscript>
      <p className="result-count" role="status" aria-live="polite">
        {query ? `“${query}” 검색 결과 ` : '전체 '}
        {results.length}개
      </p>
      <div className="search-results">
        {results.map((p) => (
          <a href={p.url} key={p.url} className="result-card">
            <div>
              <span className="eyebrow">{p.category}</span>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
            </div>
            <ArrowUpRight size={22} />
          </a>
        ))}
      </div>
      {results.length === 0 && (
        <div className="empty-state">
          <h2>검색 결과가 없습니다.</h2>
          <p>다른 검사 이름이나 짧은 단어로 검색해 주세요.</p>
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('전체');
            }}
          >
            전체 목록 보기
          </button>
        </div>
      )}
    </div>
  );
}
