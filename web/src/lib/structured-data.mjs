// The graph describes the same patient content and links that the renderer uses.
// Publication attestations never enter this module or the exported site.
import { hubGroups, hubIds, patientEntrances, siteMapGroups } from './information-architecture.mjs';
import { clinicAddressSchema, clinicHoursSchema } from './content-model.mjs';

export function childPages(page, pages) {
  if (page.id === 'home')
    return patientEntrances.map(({ id }) => pages.find((p) => p.id === id)).filter(Boolean);
  if (hubGroups[page.id]) {
    const children = hubIds(page.id)
      .map((id) => pages.find((p) => p.id === id))
      .filter(Boolean);
    return ['symptoms', 'diseases'].includes(page.id)
      ? children.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
      : children;
  }
  if (page.id === 'sitemap') return siteMapGroups(pages).flatMap((group) => group.pages);
  return pages.filter(
    (p) =>
      p.path.startsWith(page.path) &&
      p.path !== page.path &&
      p.path.slice(page.path.length).split('/').filter(Boolean).length === 1,
  );
}
export const questionAnchor = (question, index) => question.id ?? `question-${index + 1}`;
const testTypes = {
  abi: 'MedicalTest',
  'cardiac-markers': 'BloodTest',
  carotid: 'ImagingTest',
  echocardiography: 'ImagingTest',
  hrv: 'MedicalTest',
  holter: 'MedicalTest',
  'abdominal-ultrasound': 'ImagingTest',
  'bowel-ultrasound': 'ImagingTest',
  'thyroid-ultrasound': 'ImagingTest',
  colonoscopy: 'MedicalProcedure',
  gastroscopy: 'MedicalProcedure',
};
const ref = (id) => ({ '@id': id });

export function createStructuredData({
  page,
  pages,
  clinic,
  physicians,
  assets,
  caseLinks,
  absolute,
  breadcrumbs,
  review,
}) {
  const clinicId = new URL('#clinic', clinic.originalUrl).href;
  const siteId = absolute('/#website');
  const pageUrl = absolute(page.path);
  const pageId = pageUrl + '#webpage';
  const contactId = absolute('/#contact');
  const logoId = absolute('/#logo');
  const doctor = physicians.find((p) => page.id === `doctor-${p.id}`);
  const collection = /index|hub|sitemap|home/.test(page.template);
  const medical = page.risk !== 'operational';
  const article = page.template === 'article-detail';
  const service = ['service-detail', 'checkup-detail', 'condition-detail'].includes(page.template);
  const testType = testTypes[page.id];
  const imageAsset = assets.find(
    (a) =>
      (doctor || ['home', 'about'].includes(page.id)) &&
      a.id === page.image &&
      (doctor ? doctor.imageKind === 'portrait' : a.width === 1600),
  );
  const staff = page.id === 'home' || page.id === 'doctors' ? physicians : doctor ? [doctor] : [];
  const personId = (p) => absolute(`/doctors/${p.id}/#person`);
  const parts = [];
  const pageNode = {
    '@type': doctor
      ? 'ProfilePage'
      : collection
        ? 'CollectionPage'
        : page.id === 'search'
          ? 'SearchResultsPage'
          : medical
            ? 'MedicalWebPage'
            : 'WebPage',
    '@id': pageId,
    url: pageUrl,
    name: page.title,
    description: page.description,
    inLanguage: page.language ?? 'ko',
    isPartOf: ref(siteId),
    publisher: ref(clinicId),
    breadcrumb: ref(pageUrl + '#breadcrumb'),
    dateModified: page.updatedAt,
    ...(page.publishedAt ? { datePublished: page.publishedAt } : {}),
    citation: page.sources.map((s) => s.url),
    relatedLink: page.related
      .slice(0, 6)
      .map((id) => pages.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => absolute(p.path)),
    about: ref(clinicId),
    ...(imageAsset ? { primaryImageOfPage: ref(pageUrl + '#image') } : {}),
    ...(doctor ? { mainEntity: ref(personId(doctor)) } : {}),
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
  };
  const graph = [
    {
      '@type': 'MedicalClinic',
      '@id': clinicId,
      name: clinic.name,
      alternateName: clinic.shortName,
      url: clinic.originalUrl,
      sameAs: [absolute('/')],
      telephone: clinic.phone,
      logo: ref(logoId),
      image: absolute('/assets/clinic-1600.webp'),
      address: clinicAddressSchema(clinic),
      openingHoursSpecification: clinicHoursSchema(clinic),
      hasMap: clinic.mapUrl,
      contactPoint: ref(contactId),
      medicalSpecialty: [
        'https://schema.org/PrimaryCare',
        'https://schema.org/Cardiovascular',
        'https://schema.org/Gastroenterologic',
      ],
      ...(staff.length ? { employee: staff.map((p) => ref(personId(p))) } : {}),
      ...(testType ? { availableService: ref(pageUrl + '#medical-service') } : {}),
    },
    {
      '@type': 'ContactPoint',
      '@id': contactId,
      telephone: clinic.phone,
      contactType: '진료·검사 문의',
      availableLanguage: 'ko',
      url: absolute('/visit/'),
    },
    {
      '@type': 'ImageObject',
      '@id': logoId,
      contentUrl: absolute('/assets/logo.webp'),
      url: absolute('/assets/logo.webp'),
      width: 294,
      height: 77,
      caption: clinic.name,
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      name: '영통탑내과 진료·검사 안내',
      url: absolute('/'),
      inLanguage: [...new Set(pages.map((p) => p.language ?? 'ko'))],
      publisher: ref(clinicId),
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: absolute('/search/') + '?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    pageNode,
    {
      '@type': 'BreadcrumbList',
      '@id': pageUrl + '#breadcrumb',
      itemListElement: breadcrumbs.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        item: absolute(p.path),
      })),
    },
  ];
  if (imageAsset)
    graph.push({
      '@type': 'ImageObject',
      '@id': pageUrl + '#image',
      contentUrl: absolute(imageAsset.file),
      url: absolute(imageAsset.file),
      width: imageAsset.width,
      height: imageAsset.height,
      caption: doctor ? `${doctor.name} ${doctor.role}` : '영통탑내과 접수대와 대기 공간',
    });
  for (const p of staff)
    graph.push({
      '@type': 'Person',
      '@id': personId(p),
      name: p.name,
      jobTitle: `${p.specialty} · ${p.role}`,
      worksFor: ref(clinicId),
      url: absolute(`/doctors/${p.id}/`),
      mainEntityOfPage: ref(absolute(`/doctors/${p.id}/#webpage`)),
      ...(p.imageKind === 'portrait' ? { image: absolute(`/assets/${p.image}-640.webp`) } : {}),
      ...(doctor
        ? {
            description: p.careers.join('. '),
            hasCredential: [p.specialty, ...p.credentials].map((name) => ({
              '@type': 'EducationalOccupationalCredential',
              name,
              credentialCategory: '의료 자격',
            })),
            memberOf: p.memberships.map((name) => ({
              '@type': 'MedicalOrganization',
              name: name.replace(/\s*(평생회원|정회원)$/u, ''),
              description: name,
            })),
            subjectOf: { '@type': 'WebPage', name: '영통탑내과 의료진 소개', url: p.sourceUrl },
          }
        : {}),
    });
  let entries =
    collection && !['notices', 'cases'].includes(page.id)
      ? childPages(page, pages).map((p) => ({
          title: p.title,
          description: p.description,
          url: absolute(p.path),
        }))
      : [];
  if (page.id === 'cases') entries = caseLinks;
  if (entries.length) {
    const listId = pageUrl + '#items';
    graph.push({
      '@type': 'ItemList',
      '@id': listId,
      name: page.id === 'home' ? '방문 목적별 안내' : page.title,
      numberOfItems: entries.length,
      itemListElement: entries.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'WebPage', url: p.url, name: p.title, description: p.description },
      })),
    });
    pageNode.mainEntity = ref(listId);
  }
  if (service) {
    const serviceId = pageUrl + '#service';
    graph.push({
      '@type': 'Service',
      '@id': serviceId,
      name: page.title,
      serviceType: page.category,
      description: page.intro,
      url: pageUrl,
      provider: ref(clinicId),
      mainEntityOfPage: ref(pageId),
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: pageUrl,
        servicePhone: ref(contactId),
        serviceLocation: ref(clinicId),
      },
    });
    pageNode.mainEntity = ref(serviceId);
  }
  if (testType) {
    graph.push({
      '@type': testType,
      '@id': pageUrl + '#medical-service',
      name: page.title,
      description: page.intro,
      url: pageUrl,
      mainEntityOfPage: ref(pageId),
    });
    pageNode.about = [ref(clinicId), ref(pageUrl + '#medical-service')];
  }
  if (article) {
    const articleId = pageUrl + '#article';
    graph.push({
      '@type': 'Article',
      '@id': articleId,
      headline: page.title,
      description: page.description,
      abstract: page.intro,
      articleSection: page.category,
      inLanguage: page.language ?? 'ko',
      url: pageUrl,
      mainEntityOfPage: ref(pageId),
      publisher: ref(clinicId),
      dateModified: page.updatedAt,
      ...(page.publishedAt ? { datePublished: page.publishedAt } : {}),
      citation: page.sources.map((s) => s.url),
    });
    pageNode.mainEntity = ref(articleId);
  }
  if (page.questions.length) {
    const faqId = pageUrl + '#questions';
    graph.push({
      '@type': 'FAQPage',
      '@id': faqId,
      url: faqId,
      name: `${page.title} · 궁금한 점`,
      inLanguage: page.language ?? 'ko',
      isPartOf: ref(pageId),
      mainEntity: page.questions.map((q, i) => ({
        '@type': 'Question',
        '@id': pageUrl + '#' + questionAnchor(q, i),
        name: q.question,
        url: pageUrl + '#' + questionAnchor(q, i),
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
          ...((q.sourceIds ?? []).length
            ? {
                citation: q.sourceIds
                  .map((id) => page.sources.find((s) => s.id === id)?.url)
                  .filter(Boolean),
              }
            : {}),
        },
      })),
    });
    parts.push(ref(faqId));
  }
  if (parts.length) pageNode.hasPart = parts;
  return { '@context': 'https://schema.org', '@graph': graph };
}
