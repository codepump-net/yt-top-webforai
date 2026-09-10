import { ArrowUpRight, Clock3, MapPin, Phone, Search, Menu } from 'lucide-react';
import { clinic, href, nav, pageById, reviewMode, phoneHref } from '@/lib/site';

export function Header() {
  return (
    <>
      {reviewMode && (
        <div className="review-bar">
          홈페이지 검토본 <span>· 병원 운영·의료정보 최종 확인 전입니다.</span>
          <a href={href('/content-policy/')}>
            작성 원칙 <ArrowUpRight size={12} />
          </a>
        </div>
      )}
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href={href('/')} aria-label="영통탑내과 홈">
            <img src={href('/assets/logo.webp')} width="294" height="77" alt="영통탑내과의원" />
          </a>
          <nav className="desktop-nav" aria-label="주 메뉴">
            {nav.map(([id, label]) => (
              <a key={id} href={href(pageById(id)!.path)}>
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="icon-button" href={href('/search/')} aria-label="사이트 검색">
              <Search size={21} />
            </a>
            <a className="header-phone" href={phoneHref}>
              <Phone size={16} /> 전화 문의
            </a>
            <details className="mobile-nav">
              <summary aria-label="전체 메뉴 열기">
                <Menu size={25} />
              </summary>
              <nav aria-label="모바일 메뉴">
                {nav.map(([id, label]) => (
                  <a key={id} href={href(pageById(id)!.path)}>
                    {label}
                  </a>
                ))}
                <a href={href('/notices/')}>공지사항</a>
                <a href={href('/sitemap/')}>전체 페이지</a>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}

export function VisitInfo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`visit-info ${compact ? 'compact' : ''}`}>
      <div>
        <span className="eyebrow">
          <Phone size={16} /> 전화 문의·예약
        </span>
        <a className="phone-number" href={phoneHref}>
          {clinic.phone}
        </a>
        <p>{clinic.bookingNote}</p>
      </div>
      <div>
        <span className="eyebrow">
          <Clock3 size={16} /> 진료시간
        </span>
        <dl className="hours">
          {clinic.hours.map((h) => (
            <div key={h.label}>
              <dt>{h.label}</dt>
              <dd>{h.value}</dd>
            </div>
          ))}
        </dl>
        <p className="small">{clinic.hoursNote}</p>
      </div>
      <div>
        <span className="eyebrow">
          <MapPin size={16} /> 오시는 길
        </span>
        <p className="address">{clinic.address}</p>
        <p>{clinic.subway}</p>
        <a className="text-link" href={clinic.mapUrl} target="_blank" rel="noopener noreferrer">
          네이버 지도에서 보기 <ArrowUpRight size={16} />
          <span className="sr-only"> (새 창)</span>
        </a>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <a className="footer-brand" href={href('/')}>
                영통탑내과<span>YEONGTONG TOP CLINIC</span>
              </a>
              <p>건강을 이해하는 시간, 함께합니다.</p>
            </div>
            <div className="footer-links">
              <a href={href('/visit/')}>진료시간·위치</a>
              <a href={href('/fees/')}>비용·서류</a>
              <a href={href('/notices/')}>공지사항</a>
              <a href={href('/sitemap/')}>전체 페이지</a>
              <a href={href('/content-policy/')}>의료정보 작성 원칙</a>
              <a href={href('/privacy/')}>개인정보 처리 안내</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>
              <p>
                {clinic.name} · 대표 {clinic.representative} · 사업자등록번호 {clinic.registration}
              </p>
              <p>
                {clinic.address} · <a href={phoneHref}>{clinic.phone}</a>
              </p>
              <p className="footer-note">
                {reviewMode
                  ? '기존 홈페이지를 바탕으로 제작한 검토용 사이트입니다. 실제 진료와 검사 준비는 병원 안내를 확인해 주세요.'
                  : '이 사이트의 의료정보는 일반적인 이해를 돕기 위한 자료입니다. 개인별 진단·치료는 의료진과 상담해 주세요.'}
              </p>
            </div>
            <a href="https://yttop.co.kr/" target="_blank" rel="noopener noreferrer">
              기존 홈페이지 <ArrowUpRight size={14} />
              <span className="sr-only"> (새 창)</span>
            </a>
          </div>
        </div>
      </footer>
      <div className="mobile-contact">
        <a href={phoneHref}>
          <Phone size={18} /> 전화 문의
        </a>
        <a href={href('/visit/')}>
          <MapPin size={18} /> 진료시간·위치
        </a>
      </div>
    </>
  );
}
