import type { Metadata } from 'next';
import rawPages from '../../../content/pages.json';
import clinicData from '../../../content/clinic.json';
import physicianData from '../../../content/physicians.json';
import reviewData from '../../../content/reviews.json';
import { assetPath, absoluteUrl, jsonSafe } from './urls.mjs';
import {
  resolveClinic,
  resolvePages,
  clinicHoursSchema,
  clinicAddressSchema,
} from './content-model.mjs';

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
  return {
    title: page.metaTitle,
    description: page.description,
    alternates: { canonical: url },
    robots: { index: !reviewMode && page.indexable, follow: true },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
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
  const clinicId = new URL('#clinic', clinic.originalUrl).href;
  const siteId = absolute('/#website');
  const pageId = absolute(page.path + '#webpage');
  const doctor = physicians.find((p) => page.id === `doctor-${p.id}`);
  const medical = page.risk !== 'operational';
  const review = reviewFor(page);
  const collection = /index|hub|sitemap|home/.test(page.template);
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'MedicalClinic',
      '@id': clinicId,
      name: clinic.name,
      url: clinic.originalUrl,
      sameAs: absolute('/'),
      telephone: clinic.phone,
      image: absolute('/assets/clinic-1600.webp'),
      address: clinicAddressSchema(clinic),
      openingHoursSpecification: clinicHoursSchema(clinic),
      hasMap: clinic.mapUrl,
      medicalSpecialty: [
        'https://schema.org/PrimaryCare',
        'https://schema.org/Cardiovascular',
        'https://schema.org/Gastroenterologic',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      name: '영통탑내과 진료·검사 안내',
      url: absolute('/'),
      inLanguage: 'ko-KR',
      publisher: { '@id': clinicId },
    },
    {
      '@type': doctor
        ? 'ProfilePage'
        : collection
          ? 'CollectionPage'
          : medical
            ? 'MedicalWebPage'
            : 'WebPage',
      '@id': pageId,
      url: absolute(page.path),
      name: page.title,
      description: page.description,
      inLanguage: 'ko-KR',
      isPartOf: { '@id': siteId },
      publisher: { '@id': clinicId },
      dateModified: page.updatedAt,
      ...(page.publishedAt ? { datePublished: page.publishedAt } : {}),
      citation: page.sources.map((s) => s.url),
      ...(review?.role === 'medical'
        ? {
            reviewedBy: {
              '@type': 'Person',
              name: review.reviewer,
              ...(review.reviewerId
                ? {
                    '@id': absolute(`/doctors/${review.reviewerId}/#person`),
                    url: absolute(`/doctors/${review.reviewerId}/`),
                  }
                : {}),
            },
            lastReviewed: review.reviewedAt.slice(0, 10),
          }
        : {}),
      ...(doctor
        ? { mainEntity: { '@id': absolute(page.path + '#person') } }
        : { about: { '@id': clinicId } }),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': absolute(page.path + '#breadcrumb'),
      itemListElement: breadcrumbs(page).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        item: absolute(p.path),
      })),
    },
  ];
  if (doctor)
    graph.push({
      '@type': 'Person',
      '@id': absolute(page.path + '#person'),
      name: doctor.name,
      jobTitle: `${doctor.specialty} · ${doctor.role}`,
      worksFor: { '@id': clinicId },
      url: absolute(page.path),
      ...(doctor.imageKind === 'portrait'
        ? { image: absolute(`/assets/${doctor.image}-640.webp`) }
        : {}),
    });
  // Q&A stays visible in semantic HTML. We do not claim FAQ rich-result eligibility.
  return jsonSafe({ '@context': 'https://schema.org', '@graph': graph });
}
