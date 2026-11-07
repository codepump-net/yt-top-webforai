import { expect, it } from 'vitest';
import {
  analyticsPage,
  analyticsLocation,
  analyticsReferrer,
  contactMethod,
} from '../../src/lib/analytics.mjs';
it('excludes internal search and case pages and strips query and hash data', () => {
  expect(analyticsPage('/search/')).toBe(false);
  expect(analyticsPage('/hospital/search/')).toBe(false);
  expect(analyticsPage('/cases/')).toBe(false);
  expect(analyticsPage('/health/after-endoscopy/')).toBe(true);
  expect(analyticsPage('/visit/', '?q=PRIVATE')).toBe(false);
  expect(analyticsLocation('https://yttop.kr/visit/?name=PRIVATE#q=PRIVATE')).toBe(
    'https://yttop.kr/visit/',
  );
  expect(analyticsReferrer('https://search.example/query?name=PRIVATE#secret')).toBe(
    'https://search.example/',
  );
  expect(analyticsReferrer('invalid')).toBe('');
});
it('records only the contact method without sending numbers, URLs or link text', () => {
  expect(contactMethod('tel:031-202-7555', 'https://map.example/clinic')).toBe('phone');
  expect(contactMethod('https://map.example/clinic', 'https://map.example/clinic')).toBe('map');
  expect(contactMethod('https://external.example/', 'https://map.example/clinic')).toBeNull();
});
