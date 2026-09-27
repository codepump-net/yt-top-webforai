import { type Page, clinic, phoneHref, href } from '@/lib/site';
import { articleGuidance, guidanceLabels } from '@/lib/article-guidance.mjs';

export const contentUse = {
  ko: [
    '페이지 링크를 공유할 수 있습니다. 글·이미지의 재사용은 자료별 이용 조건을 확인해 주세요.',
    '저작권·콘텐츠 이용 안내',
  ],
  en: [
    'You may share a link to this page. Check the terms for each text or image before reusing it.',
    'Copyright and content use (Korean)',
  ],
  'zh-Hans': [
    '您可以分享本页链接。转载文字或图片前，请确认各资料的使用条件。',
    '版权与内容使用说明（韩语）',
  ],
  th: [
    'สามารถแบ่งปันลิงก์หน้านี้ได้ โปรดตรวจสอบเงื่อนไขของข้อความหรือภาพแต่ละรายการก่อนนำไปใช้ซ้ำ',
    'ลิขสิทธิ์และการใช้เนื้อหา (ภาษาเกาหลี)',
  ],
  ru: [
    'Вы можете поделиться ссылкой на эту страницу. Перед повторным использованием текста или изображения ознакомьтесь с условиями.',
    'Авторские права и использование материалов (на корейском)',
  ],
  ne: [
    'यस पृष्ठको लिङ्क साझा गर्न सक्नुहुन्छ। पाठ वा चित्र पुनः प्रयोग गर्नुअघि सम्बन्धित प्रयोगका सर्तहरू हेर्नुहोस्।',
    'प्रतिलिपि अधिकार र सामग्रीको प्रयोग (कोरियालीमा)',
  ],
};

export function ArticleFooter({ page }: { page: Page }) {
  const rules = articleGuidance(page);
  if (!rules.enabled) return null;
  const t = guidanceLabels[(page.language ?? 'ko') as keyof typeof guidanceLabels];
  const use = contentUse[(page.language ?? 'ko') as keyof typeof contentUse];
  return (
    <aside
      className="article-footer"
      aria-labelledby="article-guidance-title"
      lang={page.language ?? 'ko'}
    >
      <h2 id="article-guidance-title">{t.title}</h2>
      {rules.medical && <p className="medical-safety">{t.safety}</p>}
      {rules.medical && (
        <p className="article-copyright">
          {use[0]} <a href={href('/copyright/')}>{use[1]}</a>
        </p>
      )}
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
