'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Phone, Search } from 'lucide-react';

type NavItem = { href: string; label: string; paths?: string[] };

export function SiteNavigation({
  items,
  homeUrl,
  logoUrl,
  searchUrl,
  noticeUrl,
  sitemapUrl,
  phoneUrl,
  basePath,
}: {
  items: NavItem[];
  homeUrl: string;
  logoUrl: string;
  searchUrl: string;
  noticeUrl: string;
  sitemapUrl: string;
  phoneUrl: string;
  basePath: string;
}) {
  const pathname = usePathname() ?? '/';
  const menu = useRef<HTMLDetailsElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const normalize = (url: string) => {
    const route = basePath && url.startsWith(basePath + '/') ? url.slice(basePath.length) : url;
    return route.replace(/\/$/, '') || '/';
  };
  const current = normalize(pathname);
  const currentState = (url: string, paths?: string[]) => {
    const route = normalize(url);
    return current === route
      ? 'page'
      : (paths ? paths.some((p) => normalize(p) === current) : current.startsWith(route + '/'))
        ? 'location'
        : undefined;
  };

  useEffect(() => {
    const header = inner.current?.closest('header');
    const contact = document.querySelector<HTMLElement>('.mobile-contact');
    if (!header) return;
    const root = document.documentElement;
    const update = () => {
      const bounds = header.getBoundingClientRect();
      root.style.setProperty('--header-height', `${bounds.height}px`);
      root.style.setProperty('--header-bottom', `${Math.max(0, bounds.bottom)}px`);
      root.style.setProperty(
        '--contact-height',
        `${contact?.getBoundingClientRect().height ?? 0}px`,
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(header);
    if (contact) observer.observe(contact);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);

    // Native focus scrolling may consider a link visible behind a fixed toolbar.
    const revealFocus = (event: FocusEvent) => {
      const target = event.target;
      if (
        !(target instanceof HTMLElement) ||
        target.closest('header,.review-bar,.mobile-contact,.skip-link')
      )
        return;
      requestAnimationFrame(() => {
        if (document.activeElement !== target) return;
        const bounds = target.getBoundingClientRect();
        const top = Math.max(0, header.getBoundingClientRect().bottom) + 10;
        const contactBounds = contact?.getBoundingClientRect();
        const bottom = contactBounds?.height ? contactBounds.top - 10 : window.innerHeight - 10;
        if (bounds.height <= bottom - top) {
          if (bounds.bottom > bottom)
            window.scrollBy({ top: bounds.bottom - bottom, behavior: 'instant' });
          else if (bounds.top < top)
            window.scrollBy({ top: bounds.top - top, behavior: 'instant' });
        } else if (bounds.top < top || bounds.top > bottom - 44) {
          window.scrollBy({ top: bounds.top - top, behavior: 'instant' });
        }
      });
    };
    document.addEventListener('focusin', revealFocus);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      document.removeEventListener('focusin', revealFocus);
    };
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent | PointerEvent | FocusEvent) => {
      if (!menu.current?.open) return;
      if (event instanceof KeyboardEvent && event.key !== 'Escape') return;
      if (!(event instanceof KeyboardEvent) && menu.current?.contains(event.target as Node)) return;
      if (menu.current) menu.current.open = false;
      if (event instanceof KeyboardEvent) menu.current?.querySelector('summary')?.focus();
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', close);
    document.addEventListener('focusin', close);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('focusin', close);
    };
  }, []);

  const link = ({ href, label, paths }: NavItem) => (
    <a key={href} href={href} aria-current={currentState(href, paths)}>
      {label}
    </a>
  );
  return (
    <div className="container header-inner" ref={inner}>
      <a className="brand" href={homeUrl} aria-label="영통탑내과 홈">
        <img src={logoUrl} width="294" height="77" alt="영통탑내과의원" />
      </a>
      <nav className="desktop-nav" aria-label="주 메뉴">
        {items.map(link)}
      </nav>
      <div className="header-actions">
        <a className="icon-button" href={searchUrl} aria-label="사이트 검색">
          <Search size={21} />
        </a>
        <a className="header-phone" href={phoneUrl} aria-label="전화 문의">
          <Phone size={18} />
          <span className="phone-label">전화 문의</span>
        </a>
        <details
          className="mobile-nav"
          ref={menu}
          onToggle={(event) => setOpen(event.currentTarget.open)}
        >
          <summary aria-label={open ? '전체 메뉴 닫기' : '전체 메뉴 열기'}>
            <Menu size={25} />
          </summary>
          <nav aria-label="모바일 메뉴">
            {items.map(link)}
            {link({ href: noticeUrl, label: '공지사항' })}
            {link({ href: sitemapUrl, label: '전체 페이지' })}
          </nav>
        </details>
      </div>
    </div>
  );
}
