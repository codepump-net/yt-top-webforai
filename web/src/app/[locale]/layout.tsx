import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { clinic, siteIdentity, href, phoneHref, reviewMode } from '@/lib/site';
import analytics from '../../../../content/analytics.json';
import { AnalyticsConsent, AnalyticsSettingsButton } from '@/components/analytics-consent';
import { languageNames, pageLabels } from '@/lib/languages';
import { contentUse } from '@/components/article-footer';
import { OfficialChannels } from '@/components/official-channels';
import { SiteBrand } from '@/components/site-brand';
import '../globals.css';
import '../library.css';
export const metadata: Metadata = {
  applicationName: siteIdentity.name,
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
            <SiteBrand homeUrl={href('/')} label={t.koreanSite} />
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
            <a className="footer-brand" href={href('/')} lang="ko">
              {siteIdentity.name}
              <span>{siteIdentity.operatorLabel}</span>
            </a>
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
              <a href={href('/copyright/')}>{contentUse[language as keyof typeof contentUse][1]}</a>
              {!reviewMode && <AnalyticsSettingsButton english />}
            </div>
            <p className="footer-note">© 2026 Yeongtong Top Internal Medicine Clinic</p>
            <OfficialChannels variant="footer" />
          </div>
        </footer>
        {!reviewMode && (
          <AnalyticsConsent
            measurementId={analytics.measurementId}
            containerId={analytics.containerId}
            privacyUrl={href('/privacy/')}
            mapUrl={clinic.mapUrl}
            english
          />
        )}
      </body>
    </html>
  );
}
