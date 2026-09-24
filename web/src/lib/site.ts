import type { Metadata } from 'next';
import rawPages from '../../../content/pages.json';
import clinicData from '../../../content/clinic.json';
import physicianData from '../../../content/physicians.json';
import reviewData from '../../../content/reviews.json';
import assetData from '../../../content/assets.json';
import caseLinks from '../../../content/case-links.json';
import { assetPath, absoluteUrl, jsonSafe } from './urls.mjs';
import { resolveClinic, resolvePages } from './content-model.mjs';
import { createStructuredData, childPages } from './structured-data.mjs';
export { careOverviewIds, questionAnchor, siteMapCategories } from './structured-data.mjs';

export type Source = {
  id?: string;
  title: string;
  url: string;
  kind?: 'clinic' | 'medical';
  checkedAt?: string;
};
export type ContentLink = { pageId: string; anchor?: string; label: string };
export type ContentTable = { caption: string; columns: string[]; rows: string[][] };
export type Block = {
  id?: string;
  heading: string;
  text: string;
  paragraphs?: string[];
  items?: string[];
  steps?: string[];
  sourceIds?: string[];
  links?: ContentLink[];
  table?: ContentTable;
};
export type Question = {
  id?: string;
  question: string;
  answer: string;
  sourceIds?: string[];
  links?: ContentLink[];
};
export type Page = Omit<(typeof rawPages)[number], 'blocks' | 'questions' | 'sources'> & {
  language?: string;
  translationOf?: string;
  urgentNotice?: string;
  blocks: Block[];
  questions: Question[];
  sources: Source[];
};
export const clinic = resolveClinic(clinicData) as typeof clinicData & {
  address: string;
  hours: Array<{ id: string; label: string; value: string }>;
};
export const pages: Page[] = resolvePages(rawPages, clinic);
export const phoneHref = 'tel:' + clinic.phone.replace(/[^\d+]/g, '');
export const physicians = physicianData;
export const basePath = process.env.SITE_BASE_PATH ?? '';
export const origin = process.env.SITE_ORIGIN ?? 'http://localhost:3000';
export const reviewMode = process.env.SITE_MODE !== 'production';
export const href = (path: string) => assetPath(path, basePath);
export const absolute = (path: string) => absoluteUrl(path, origin, basePath);
export const pageById = (id: string) => pages.find((p) => p.id === id);
export const pageByPath = (path: string) => pages.find((p) => p.path === path);
export const childrenFor = (page: Page): Page[] => childPages(page, pages);
type ReviewRecord = {
  pageId: string;
  status: string;
  reviewer: string;
  role: string;
  reviewedAt: string;
  expiresAt: string;
  evidence: string;
  digest: string;
  reviewerId?: string;
};
export const reviewFor = (page: Page) =>
  reviewMode
    ? undefined
    : (reviewData as ReviewRecord[]).find((r) => r.pageId === page.id && r.status === 'approved');
export const nav = [
  ['about', '병원 소개'],
  ['doctors', '의료진'],
  ['services', '진료·검사'],
  ['checkups', '건강검진'],
  ['health', '건강정보'],
  ['visit', '오시는 길'],
];

export function pageMetadata(page: Page): Metadata {
  const url = absolute(page.path);
  const versions = languageVersions(page);
  return {
    title: page.metaTitle,
    description: page.description,
    alternates: {
      canonical: url,
      ...(versions.length > 1
        ? {
            languages: Object.fromEntries([
              ...versions.map((p) => [p.language ?? 'ko', absolute(p.path)]),
              ['x-default', absolute(versions.find((p) => !p.translationOf)!.path)],
            ]),
          }
        : {}),
    },
    robots: { index: !reviewMode && page.indexable, follow: true },
    openGraph: {
      type: 'website',
      locale:
        (
          { en: 'en_US', 'zh-Hans': 'zh_CN', th: 'th_TH', ru: 'ru_RU', ne: 'ne_NP' } as Record<
            string,
            string
          >
        )[page.language ?? 'ko'] ?? 'ko_KR',
      siteName: clinic.name,
      title: page.metaTitle,
      description: page.description,
      url,
      images: [
        {
          url: absolute('/assets/clinic-1600.webp'),
          width: 1600,
          height: 417,
          alt: '영통탑내과 접수 공간',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.description,
      images: [absolute('/assets/clinic-1600.webp')],
    },
  };
}

export function languageVersions(page: Page): Page[] {
  const originalId = page.translationOf ?? page.id;
  return pages.filter((p) => p.id === originalId || p.translationOf === originalId);
}

export function breadcrumbs(page: Page) {
  const ancestors: Page[] = [];
  const parts = page.path.split('/').filter(Boolean);
  for (let i = 1; i < parts.length; i++) {
    const parent = pageByPath('/' + parts.slice(0, i).join('/') + '/');
    if (parent) ancestors.push(parent);
  }
  return [pages[0], ...ancestors, ...(page.id === 'home' ? [] : [page])];
}

export function structuredData(page: Page) {
  return jsonSafe(
    createStructuredData({
      page,
      pages,
      clinic,
      physicians,
      assets: assetData,
      caseLinks,
      absolute,
      breadcrumbs: breadcrumbs(page),
      review: reviewFor(page),
    }),
  );
}
