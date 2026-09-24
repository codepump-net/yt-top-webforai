import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { clinic, href, phoneHref } from '@/lib/site';
import { languageNames, pageLabels } from '@/lib/languages';
import '../globals.css';
export const metadata: Metadata = {
  applicationName: 'Yeongtong Top Internal Medicine Clinic',
  icons: { icon: href('/favicon.svg') },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#125b51' };
export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const language = Object.keys(languageNames).find(
    (key) => key.toLowerCase() === locale && key !== 'ko',
  );
  if (!language) notFound();
  const t = pageLabels(language);
  return (
    <html lang={language}>
      <body className="translated-site">
        <a className="skip-link" href="#main">
          {t.skip}
        </a>
        <header className="site-header">
          <div className="container language-header">
            <a className="brand" href={href('/')} aria-label={t.koreanSite}>
              <img
                src={href('/assets/logo.webp')}
                width="294"
                height="77"
                alt="Yeongtong Top Internal Medicine Clinic"
              />
            </a>
            <a href={href('/')} lang="ko">
              한국어
            </a>
            <a href={phoneHref}>
              {t.call} · {clinic.phone}
            </a>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>
              Yeongtong Top Internal Medicine Clinic · <span lang="ko">{clinic.name}</span>
            </p>
            <p lang="ko">{clinic.address}</p>
            <div className="button-row">
              <a href={phoneHref}>
                {t.call} · {clinic.phone}
              </a>
              <a href={clinic.mapUrl} target="_blank" rel="noopener noreferrer">
                {t.map} ({t.newWindow})
              </a>
              <a href={href('/')}>{t.koreanSite}</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
