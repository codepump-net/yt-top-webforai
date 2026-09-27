'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function HomeSearch({ searchUrl, sitemapUrl }: { searchUrl: string; sitemapUrl: string }) {
  const router = useRouter();
  return (
    <section className="container home-search" aria-labelledby="home-search-title">
      <h2 id="home-search-title">증상·질환·검사로 찾기</h2>
      <form
        action={searchUrl}
        role="search"
        aria-label="사이트 검색"
        onSubmit={(event) => {
          event.preventDefault();
          const input = event.currentTarget.elements.namedItem('home-query') as HTMLInputElement;
          router.push(`/search/#q=${encodeURIComponent(input.value.trim())}`);
        }}
      >
        <label htmlFor="home-query">어떤 안내가 필요하신가요?</label>
        <div className="home-search-field">
          <input
            id="home-query"
            type="search"
            maxLength={120}
            autoComplete="off"
            placeholder="예: 맹장, 고지혈증, 홀터, 비자검진"
            aria-describedby="home-search-privacy"
          />
          <button className="button" type="submit">
            <Search size={18} aria-hidden="true" />
            검색
          </button>
        </div>
        <p className="small" id="home-search-privacy">
          이름·연락처·주민등록번호 등 개인정보는 입력하지 마세요.
        </p>
        <noscript>
          <p>
            <a href={sitemapUrl}>전체 페이지에서 증상·검사 안내를 찾아보세요.</a>
          </p>
        </noscript>
      </form>
    </section>
  );
}
