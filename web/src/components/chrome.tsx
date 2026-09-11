import { ArrowUpRight, Clock3, MapPin, Phone } from 'lucide-react';
import { clinic, href, nav, pageById, phoneHref, basePath } from '@/lib/site';
import { SiteNavigation } from './site-navigation';

export function Header() {
  return (
    <>
      <header className="site-header">
        <SiteNavigation
          items={nav.map(([id, label]) => ({ href: href(pageById(id)!.path), label }))}
          homeUrl={href('/')}
          logoUrl={href('/assets/logo.webp')}
          searchUrl={href('/search/')}
          noticeUrl={href('/notices/')}
          sitemapUrl={href('/sitemap/')}
          phoneUrl={phoneHref}
          basePath={basePath}
        />
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
                영통탑내과의 진료·검사와 방문을 안내합니다. 개인별 진단·치료와 검사 준비는 의료진의
                안내를 확인해 주세요.
              </p>
            </div>
            <a href="https://yttop.co.kr/" target="_blank" rel="noopener noreferrer">
              영통탑내과 홈페이지 <ArrowUpRight size={14} />
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
