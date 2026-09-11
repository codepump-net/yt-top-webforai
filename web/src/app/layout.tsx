import type { Metadata, Viewport } from 'next';
import { Header, Footer } from '@/components/chrome';
import { href } from '@/lib/site';
import { PrintQuestions } from '@/components/print-questions';
import './globals.css';

export const metadata: Metadata = {
  applicationName: '영통탑내과',
  icons: { icon: href('/favicon.svg') },
  formatDetection: { telephone: false },
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
      </body>
    </html>
  );
}
