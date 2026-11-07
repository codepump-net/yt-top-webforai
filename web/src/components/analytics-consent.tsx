'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  analyticsPage,
  analyticsLocation,
  analyticsReferrer,
  contactMethod,
} from '@/lib/analytics.mjs';

const key = 'yttop-analytics-consent-v1';
const change = 'yttop-analytics-change';
const openSettings = 'yttop-analytics-settings';
let memoryChoice = 'unknown';
const readChoice = () => {
  try {
    return localStorage.getItem(key) ?? memoryChoice;
  } catch {
    return memoryChoice;
  }
};
const serverChoice = () => 'pending';
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener(change, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(change, callback);
  };
};
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  yttopAnalyticsStarted?: boolean;
};

export function AnalyticsSettingsButton({ english = false }: { english?: boolean }) {
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);
  if (choice === 'pending') return null;
  return (
    <button
      className="analytics-settings"
      type="button"
      onClick={() => window.dispatchEvent(new Event(openSettings))}
    >
      {english ? 'Analytics choices' : '방문 통계 설정'}
    </button>
  );
}

export function AnalyticsConsent({
  measurementId,
  containerId,
  privacyUrl,
  mapUrl,
  english = false,
}: {
  measurementId: string;
  containerId: string;
  privacyUrl: string;
  mapUrl: string;
  english?: boolean;
}) {
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const show = () => setEditing(true);
    window.addEventListener(openSettings, show);
    return () => window.removeEventListener(openSettings, show);
  }, []);
  useEffect(() => {
    const target = window as AnalyticsWindow;
    const flags = target as unknown as Record<string, unknown>;
    flags[`ga-disable-${measurementId}`] = choice !== 'granted';
    if (
      choice !== 'granted' ||
      location.hostname !== 'yttop.kr' ||
      !analyticsPage(location.pathname, location.search)
    )
      return;
    target.dataLayer ??= [];
    target.gtag ??= function () {
      // Preserve Google's published gtag bootstrap queue format.
      // eslint-disable-next-line prefer-rest-params
      target.dataLayer!.push(arguments);
    };
    if (!target.yttopAnalyticsStarted) {
      target.yttopAnalyticsStarted = true;
      target.gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
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
  }, [choice, measurementId, containerId, mapUrl]);
  const choose = (value: string) => {
    memoryChoice = value;
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Keep this visit's choice in memory. */
    }
    if (value === 'denied') {
      (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (name !== '_ga' && !name.startsWith('_ga_')) continue;
        for (const domain of ['', `;domain=${location.hostname}`, `;domain=.${location.hostname}`])
          document.cookie = `${name}=;Max-Age=0;path=/${domain};SameSite=Lax`;
      }
    }
    window.dispatchEvent(new Event(change));
    setEditing(false);
  };
  if (choice === 'pending' || (choice !== 'unknown' && !editing)) return null;
  return (
    <aside
      className="analytics-consent"
      aria-label={english ? 'Analytics choices' : '방문 통계 설정'}
      data-nosnippet
    >
      <strong>{english ? 'Optional visit analytics' : '방문 통계 수집 선택'}</strong>
      <p>
        {english
          ? 'Allow Google Analytics to measure site use, including page visits, scrolling, and phone or map clicks. You can use all guides without agreeing.'
          : '사이트 개선을 위해 Google Analytics로 페이지 조회·스크롤 등 이용 통계와 전화·길찾기 클릭을 집계합니다. 동의하지 않아도 모든 안내를 이용할 수 있습니다.'}
      </p>
      <a href={privacyUrl}>
        {english ? 'Privacy information (Korean)' : '수집 내용과 선택 변경 안내'}
      </a>
      <div className="analytics-actions">
        <button type="button" onClick={() => choose('denied')}>
          {english ? 'Decline' : '동의하지 않음'}
        </button>
        <button type="button" onClick={() => choose('granted')}>
          {english ? 'Allow analytics' : '통계 수집에 동의'}
        </button>
      </div>
    </aside>
  );
}
