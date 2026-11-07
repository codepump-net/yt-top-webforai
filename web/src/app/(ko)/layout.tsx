import type { Metadata, Viewport } from 'next';
import { Header, Footer } from '@/components/chrome';
import { href, siteIdentity, reviewMode, clinic } from '@/lib/site';
import analytics from '../../../../content/analytics.json';
import { Analytics } from '@/components/analytics';
import { PrintQuestions } from '@/components/print-questions';
import '../globals.css';
import '../library.css';

export const metadata: Metadata = {
  applicationName: siteIdentity.name,
  icons: { icon: href('/favicon.svg') },
  formatDetection: { telephone: false },
  verification: {
    other: {
      'naver-site-verification': [
        '70a6bdc90d5833f8c8fa63b0e83adbd08435a1d3',
        'badf5024bd3f8f1c9469ae5261687a96ae9aa4cb',
      ],
    },
  },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#125b51' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main">
          본문으로 바로가기
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <PrintQuestions />
        {!reviewMode && (
          <Analytics
            measurementId={analytics.measurementId}
            containerId={analytics.containerId}
            mapUrl={clinic.mapUrl}
          />
        )}
      </body>
    </html>
  );
}
