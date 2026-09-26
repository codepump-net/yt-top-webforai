import { type Page, clinic, phoneHref } from '@/lib/site';
import { articleGuidance, guidanceLabels } from '@/lib/article-guidance.mjs';

export function ArticleFooter({ page }: { page: Page }) {
  const rules = articleGuidance(page);
  if (!rules.enabled) return null;
  const t = guidanceLabels[(page.language ?? 'ko') as keyof typeof guidanceLabels];
  return (
    <aside
      className="article-footer"
      aria-labelledby="article-guidance-title"
      lang={page.language ?? 'ko'}
    >
      <h2 id="article-guidance-title">{t.title}</h2>
      {rules.medical && <p className="medical-safety">{t.safety}</p>}
      {rules.heart && (
        <section className="heart-reservation">
          <h3>{guidanceLabels.ko.reservationTitle}</h3>
          <p>{guidanceLabels.ko.reservation}</p>
        </section>
      )}
      {rules.documents && (
        <section className="document-notice">
          <h3>{t.documentsTitle}</h3>
          <p>{t.documents}</p>
        </section>
      )}
      {rules.clinic && (
        <details className="article-clinic">
          <summary>{guidanceLabels.ko.clinicTitle}</summary>
          <p>
            {clinic.name} · <a href={phoneHref}>{clinic.phone}</a>
          </p>
          <p>{clinic.address}</p>
          <dl className="hours">
            {clinic.hours.map((h) => (
              <div key={h.id}>
                <dt>{h.label}</dt>
                <dd>{h.value}</dd>
              </div>
            ))}
          </dl>
          <p>{clinic.hoursNote}</p>
          <p>{clinic.bookingNote}</p>
          <p>{clinic.parkingNote}</p>
        </details>
      )}
    </aside>
  );
}
