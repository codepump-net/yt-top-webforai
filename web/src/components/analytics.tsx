'use client';

import { useEffect } from 'react';
import {
  analyticsPage,
  analyticsLocation,
  analyticsReferrer,
  contactMethod,
} from '@/lib/analytics.mjs';

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  yttopAnalyticsStarted?: boolean;
};

// Operator analytics never add a visitor interface or request an interaction.
// No consent is inferred: storage and advertising stay denied. Google's tag
// can send limited cookieless measurements under this configuration.
export function Analytics({
  measurementId,
  containerId,
  mapUrl,
}: {
  measurementId: string;
  containerId: string;
  mapUrl: string;
}) {
  useEffect(() => {
    if (location.hostname !== 'yttop.kr' || !analyticsPage(location.pathname, location.search))
      return;
    const target = window as AnalyticsWindow;
    target.dataLayer ??= [];
    target.gtag ??= function () {
      // Google's published bootstrap uses an Arguments object.
      // eslint-disable-next-line prefer-rest-params
      target.dataLayer!.push(arguments);
    };
    if (!target.yttopAnalyticsStarted) {
      target.yttopAnalyticsStarted = true;
      target.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      target.gtag('set', 'ads_data_redaction', true);
      target.gtag('set', 'url_passthrough', false);
      target.gtag('js', new Date());
      target.gtag('config', measurementId, {
        send_page_view: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: analyticsLocation(location.href),
        page_referrer: analyticsReferrer(document.referrer),
        page_title: document.title,
      });
      const script = document.createElement('script');
      script.id = 'yttop-ga4';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
      document.head.append(script);
    }
    const clicked = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      const method = anchor && contactMethod(anchor.getAttribute('href') ?? '', mapUrl);
      if (method) target.gtag?.('event', 'contact_click', { contact_method: method });
    };
    document.addEventListener('click', clicked);
    return () => document.removeEventListener('click', clicked);
  }, [measurementId, containerId, mapUrl]);
  return null;
}
