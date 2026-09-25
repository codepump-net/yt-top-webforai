'use client';
import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, Search as SearchIcon } from 'lucide-react';

export type SearchItem = {
  title: string;
  description: string;
  category: string;
  url: string;
  text: string;
  headings?: string;
  detail?: boolean;
  guideRole?: string;
  external?: boolean;
};
const subscribeToUrl = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
};
const queryFromUrl = () =>
  (new URLSearchParams(window.location.search).get('q') ?? '').slice(0, 120);
const emptyQuery = () => '';
export function Search({
  items,
  label = '궁금한 검사나 진료를 찾아보세요',
  filter = false,
  alphabetical = false,
}: {
  items: SearchItem[];
  label?: string;
  filter?: boolean;
  alphabetical?: boolean;
}) {
  const initialQuery = useSyncExternalStore(subscribeToUrl, queryFromUrl, emptyQuery);
  const [editedQuery, setQuery] = useState<string | null>(null);
  const query = editedQuery ?? initialQuery;
  const [category, setCategory] = useState('전체');
  const input = useRef<HTMLInputElement>(null);
  const categories = ['전체', ...new Set(items.map((p) => p.category))];
  const results = useMemo(() => {
    const normalize = (value: string) =>
      value.normalize('NFKC').toLocaleLowerCase('ko').trim().replace(/\s+/g, ' ');
    const phrase = normalize(query);
    const words = phrase.split(' ').filter(Boolean);
    return items
      .filter((p) => category === '전체' || p.category === category)
      .map((item) => {
        const title = normalize(item.title),
          description = normalize(item.description);
        const text = normalize(item.text);
        const headings = normalize(item.headings ?? '');
        if (!words.every((word) => `${title} ${description} ${text}`.includes(word))) return null;
        let score = 0;
        if (phrase) {
          score =
            title === phrase
              ? 10000
              : title.startsWith(phrase)
                ? 9000
                : title.includes(phrase)
                  ? 8000
                  : 0;
          score += words.reduce(
            (total, word) =>
              total +
              (title.includes(word)
                ? 500
                : headings.includes(word)
                  ? 80
                  : description.includes(word)
                    ? 40
                    : 1),
            0,
          );
          // For equally relevant body matches, prefer the dedicated patient guide.
          if (item.detail) score += 4;
        }
        return { item, score };
      })
      .filter((result) => result !== null)
      .sort(
        (a, b) =>
          b.score - a.score || (alphabetical ? a.item.title.localeCompare(b.item.title, 'ko') : 0),
      )
      .map(({ item }) => item);
  }, [items, query, category, alphabetical]);
  return (
    <div className={`search-widget ${alphabetical ? 'encyclopedia-search' : ''}`}>
      <label className="search-label" htmlFor="site-query">
        {label}
      </label>
      <div className="search-field">
        <SearchIcon size={22} />
        <input
          ref={input}
          id="site-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            alphabetical ? '증상이나 질환 이름을 입력하세요' : '예: 심장초음파, 내시경, 진료시간'
          }
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
        <p className="notice-box">아래 전체 목록에서 필요한 안내를 선택할 수 있습니다.</p>
      </noscript>
      {alphabetical && (
        <p className="small">
          전체 목록은 가나다순입니다. 검색하면 관련도가 높은 안내부터 보여드립니다.
        </p>
      )}
      <p className="result-count" role="status" aria-live="polite">
        {query ? `“${query}” 검색 결과 ` : '전체 '}
        {results.length}개
      </p>
      <div className="search-results">
        {results.map((p) => (
          <a
            href={p.url}
            key={p.url}
            className="result-card"
            target={p.external ? '_blank' : undefined}
            rel={p.external ? 'noopener noreferrer' : undefined}
          >
            <div>
              <span className="eyebrow">
                {p.category}
                {p.guideRole ? ` · ${p.guideRole}` : ''}
              </span>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              {p.external && (
                <span className="card-link">
                  병원 홈페이지에서 보기 <span className="sr-only"> (새 창)</span>
                </span>
              )}
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
              input.current?.focus();
            }}
          >
            전체 목록 보기
          </button>
        </div>
      )}
    </div>
  );
}
