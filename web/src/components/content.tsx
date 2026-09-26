import {
  ArrowRight,
  ArrowUpRight,
  HeartPulse,
  ScanLine,
  Stethoscope,
  ClipboardCheck,
  Activity,
  Waves,
  MapPin,
} from 'lucide-react';
import {
  type Page,
  type ContentLink,
  pages,
  pageById,
  clinic,
  physicians,
  href,
  breadcrumbs,
  structuredData,
  reviewFor,
  phoneHref,
  childrenFor,
  hubGroups,
  patientEntrances,
  sectionFor,
  questionAnchor,
  siteMapGroups,
  languageVersions,
  directoryTerms,
  guideRole,
} from '@/lib/site';
import { languageNames, pageLabels } from '@/lib/languages';
import caseLinks from '../../../content/case-links.json';
import { ArticleNavigation } from './article-navigation';
import { VisitInfo } from './chrome';
import { Search, type SearchItem } from './search';
import { ArticleFooter } from './article-footer';
import { articleGuidance, guidanceLabels } from '@/lib/article-guidance.mjs';

const iconSet = [HeartPulse, ScanLine, Waves, ClipboardCheck, Stethoscope, Activity];
export function Cards({ items, icons = false }: { items: Page[]; icons?: boolean }) {
  return (
    <div className="card-grid">
      {items.map((p, i) => {
        const Icon = iconSet[i % iconSet.length];
        return (
          <a key={p.id} className={`topic-card ${icons ? 'with-icon' : ''}`} href={href(p.path)}>
            {icons && (
              <span className="card-icon">
                <Icon strokeWidth={1.5} size={30} />
              </span>
            )}
            <span className="eyebrow">{p.category}</span>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <span className="card-link">
              자세히 보기 <ArrowUpRight size={18} />
            </span>
          </a>
        );
      })}
    </div>
  );
}
const select = (ids: string[]) => ids.map(pageById).filter((p): p is Page => !!p);
function SectionHeading({
  eyebrow,
  title,
  text,
  link,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  link?: [string, string];
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {link && (
        <a className="text-link" href={href(link[0])}>
          {link[1]} <ArrowUpRight size={18} />
        </a>
      )}
    </div>
  );
}
export function ClinicPhoto({ hero = false }: { hero?: boolean }) {
  return (
    <img
      className="clinic-photo"
      src={href('/assets/clinic-1600.webp')}
      srcSet={`${href('/assets/clinic-800.webp')} 800w, ${href('/assets/clinic-1600.webp')} 1600w`}
      sizes={hero ? '(max-width: 700px) 100vw, 65vw' : '(max-width: 900px) 100vw, 900px'}
      width="1600"
      height="417"
      alt="영통탑내과 접수대와 대기 공간"
      loading={hero ? 'eager' : 'lazy'}
      fetchPriority={hero ? 'high' : 'auto'}
    />
  );
}
export function DoctorCards() {
  return (
    <div className="doctor-grid">
      {physicians.map((d) => (
        <a className="doctor-card" key={d.id} href={href(`/doctors/${d.id}/`)}>
          <div className="doctor-image">
            <img
              src={href(`/assets/${d.image}-640.webp`)}
              width="640"
              height="664"
              alt={d.imageKind === 'portrait' ? `${d.name} ${d.role}` : ''}
              loading="lazy"
            />
          </div>
          <div className="doctor-caption">
            <span className="eyebrow">{d.specialty}</span>
            <h3>{d.name}</h3>
            <p className="doctor-role">{d.role}</p>
            <p>{d.careers[0]}</p>
            <span className="text-link">
              약력 살펴보기 <ArrowRight size={16} />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" />
              {clinic.subway} · 영통탑내과
            </span>
            <h1>
              갑작스러운 내과 증상,
              <br />
              <em>위험도부터</em> 살핍니다.
            </h1>
            <p>
              심장·소화기·호흡기 증상과 암 치료 중 불편을 살피고, 필요한 검사와 응급실·상급병원 진료
              여부를 함께 판단합니다.
            </p>
            <div className="button-row">
              <a className="button" href={href('/symptoms/')}>
                증상으로 찾기 <ArrowRight size={18} />
              </a>
              <a className="button secondary" href={href('/preparation/')}>
                검사 준비 확인 <ArrowRight size={18} />
              </a>
            </div>
            <div className="hero-note">
              <span>내과 · 가정의학과</span>
              <a href={href('/visit/')}>진료시간·오시는 길</a>
            </div>
          </div>
          <div className="hero-visual">
            <ClinicPhoto hero />
            <div className="photo-caption">
              <span>YEONGTONG TOP CLINIC</span>
              <p>필요한 진료로 이어지는 첫 만남</p>
            </div>
            <div className="location-chip">
              <MapPin size={18} />
              <span>
                망포역포레스퀘어 <b>6층 609호</b>
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="emergency-strip">
        <div className="container">
          <strong>응급 증상 안내</strong>
          <p>
            심한 흉통·호흡곤란 또는 의식 저하가 있다면 예약을 기다리지 말고 119 등 긴급 도움을
            요청하세요.
          </p>
          <a href={href('/conditions/acute-care/')}>
            위험 신호 확인 <ArrowRight size={16} />
          </a>
        </div>
      </div>
      <section className="section container patient-entry-section">
        <SectionHeading
          eyebrow="START HERE"
          title="지금 무엇이 필요하신가요?"
          text="방문 목적에 맞는 안내부터 차근차근 확인하세요."
        />
        <div className="patient-entrances">
          {patientEntrances.map((entry, index) => (
            <a className="patient-entry" href={href(pageById(entry.id)!.path)} key={entry.id}>
              <span className="entry-number">0{index + 1}</span>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <ArrowUpRight size={22} />
            </a>
          ))}
        </div>
        <nav className="discovery-links" aria-label="증상과 질환 찾기">
          <a href={href('/conditions/heart-disease/')}>가슴통증·두근거림</a>
          <a href={href('/conditions/abdominal-pain/')}>갑작스러운 복통</a>
          <a href={href('/conditions/chronic-cough/')}>오래가는 기침</a>
          <a href={href('/health/fever-during-cancer-treatment/')}>항암치료 중 발열</a>
          <a href={href('/diseases/')}>
            질환 이름으로 찾기 <ArrowRight size={15} />
          </a>
        </nav>
      </section>
      <section className="section soft-section">
        <div className="container home-care-grid">
          <div>
            <SectionHeading
              eyebrow="CARE"
              title="진료분야"
              text="증상과 건강 상태에 맞춰 필요한 진료를 확인하세요."
              link={['/conditions/', '진료분야 전체']}
            />
            <PageLinks
              ids={['heart-disease', 'abdominal-pain', 'respiratory-infections', 'chronic-disease']}
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="EXAMINATIONS"
              title="검사·시술"
              text="검사 목적을 이해하고 예약한 검사의 준비를 확인하세요."
              link={['/services/', '검사·시술 전체']}
            />
            <PageLinks ids={['heart-index', 'ultrasound-index', 'endoscopy', 'examinations']} />
          </div>
        </div>
      </section>
      <section className="section container cancer-feature">
        <div>
          <span className="eyebrow">CANCER SUPPORT</span>
          <h2>
            암 치료 중 불편할 때,
            <br />
            어디에서 진료받아야 할까요?
          </h2>
          <p>
            치료 중 증상과 최근 치료·검사 정보를 바탕으로 가까운 내과에서 가능한 지지진료와 기존
            치료병원·응급실 진료가 필요한 상황을 확인하세요.
          </p>
          <a className="text-link" href={href('/services/cancer-support/')}>
            암환자 지지진료 안내 <ArrowRight size={18} />
          </a>
        </div>
        <PageLinks ids={['cancer-treatment-symptoms', 'fever-during-cancer-treatment']} />
      </section>
      <section className="section soft-section">
        <div className="container">
          <SectionHeading
            eyebrow="OUR DOCTORS"
            title="건강을 함께 살피는 의료진"
            link={['/doctors/', '의료진 소개']}
          />
          <DoctorCards />
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="VISIT"
          title="진료시간·오시는 길"
          link={['/visit/', '방문 안내']}
        />
        <VisitInfo />
        <div className="visit-channel">
          <p>휴진 일정과 검사·서류 발급 소식은 병원 홈페이지의 공지사항에서 확인하세요.</p>
          <OriginalNoticesLink />
        </div>
      </section>
    </>
  );
}

function PageLinks({ ids }: { ids: string[] }) {
  return (
    <ul className="guide-links">
      {select(ids).map((p) => (
        <li key={p.id}>
          <a href={href(p.path)}>
            {p.title}
            <ArrowRight size={16} />
          </a>
        </li>
      ))}
    </ul>
  );
}
function HubDirectory({ page }: { page: Page }) {
  const groups = hubGroups[page.id];
  if (['symptoms', 'diseases'].includes(page.id)) {
    const items = searchItems(childrenFor(page)).map((item) => ({
      ...item,
      category: groups.find((group: { ids: string[] }) =>
        group.ids.some((id: string) => href(pageById(id)!.path) === item.url),
      )!.title,
    }));
    return (
      <Search
        items={items}
        filter
        alphabetical
        categories={groups.map((g: { title: string }) => g.title)}
        label={page.id === 'symptoms' ? '어떤 증상이 불편하신가요?' : '어떤 질환이 궁금하신가요?'}
      />
    );
  }
  if (groups)
    return (
      <div className="hub-directory">
        {groups.map((group: { title: string; ids: string[] }, i: number) => (
          <section key={group.title} id={`directory-${i + 1}`}>
            <h2>{group.title}</h2>
            <PageLinks ids={group.ids} />
          </section>
        ))}
      </div>
    );
  return /index|hub/.test(page.template) && !['doctors', 'cases', 'notices'].includes(page.id) ? (
    <PageLinks ids={childrenFor(page).map((p) => p.id)} />
  ) : null;
}

function searchItems(items: Page[]): SearchItem[] {
  return items.map((p) => ({
    title: p.title,
    description: p.description,
    category: p.category,
    aliases: directoryTerms(p.id).join(' '),
    guideRole: guideRole(p.id),
    url: href(p.path),
    headings: [...p.blocks.map((b) => b.heading), ...p.questions.map((q) => q.question)].join(' '),
    detail: /detail$/.test(p.template),
    text:
      p.intro +
      ' ' +
      p.blocks
        .map(
          (b) =>
            `${b.heading} ${b.text} ${[...(b.paragraphs ?? []), ...(b.items ?? []), ...(b.steps ?? [])].join(' ')} ${b.table ? [b.table.caption, ...b.table.columns, ...b.table.rows.flat()].join(' ') : ''}`,
        )
        .join(' ') +
      ' ' +
      p.questions.map((q) => q.question + ' ' + q.answer).join(' '),
  }));
}
function OriginalNoticesLink() {
  return (
    <a
      className="button secondary"
      href="https://yttop.co.kr/44"
      target="_blank"
      rel="noopener noreferrer"
    >
      병원 공지사항 확인 <ArrowUpRight size={18} />
      <span className="sr-only"> (새 창)</span>
    </a>
  );
}
function Sources({ page }: { page: Page }) {
  const t = pageLabels(page.language);
  const groups =
    !page.language || page.language === 'ko'
      ? [
          { label: '병원 안내', sources: page.sources.filter((s) => s.kind === 'clinic') },
          {
            label: '의학·제도 참고 자료',
            sources: page.sources.filter((s) => s.kind === 'medical'),
          },
          { label: '', sources: page.sources.filter((s) => !s.kind) },
        ]
      : [{ label: '', sources: page.sources }];
  return (
    <aside className="provenance" id="sources" aria-label={t.sources}>
      <h2>{t.sources}</h2>
      {groups
        .filter((group) => group.sources.length > 0)
        .map((group) => (
          <div key={group.label}>
            {group.label && <h3>{group.label}</h3>}
            <ul>
              {group.sources.map((s, i) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title}
                    {page.sources.filter((t) => t.title === s.title).length > 1
                      ? ` · 자료 ${i + 1}`
                      : ''}
                    <ArrowUpRight size={13} />
                    <span className="sr-only"> ({t.newWindow})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </aside>
  );
}
function BodyBlocks({ page }: { page: Page }) {
  return (
    <>
      {page.blocks.map((b, i) => (
        <section className="article-section" id={b.id ?? `section-${i + 1}`} key={b.heading}>
          <h2>{b.heading}</h2>
          {b.text && <p>{b.text}</p>}
          {b.paragraphs?.map((text, n) => (
            <p key={n}>{text}</p>
          ))}
          {b.items && (
            <ul className="content-list">
              {b.items.map((text, n) => (
                <li key={n}>{text}</li>
              ))}
            </ul>
          )}
          {b.steps && (
            <ol className="content-steps">
              {b.steps.map((text, n) => (
                <li key={n}>{text}</li>
              ))}
            </ol>
          )}
          {b.table && (
            <div
              className="answer-table-wrap"
              role="region"
              aria-label={b.table.caption}
              tabIndex={0}
            >
              <table className="answer-table">
                <caption>{b.table.caption}</caption>
                <thead>
                  <tr>
                    {b.table.columns.map((c) => (
                      <th scope="col" key={c}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.table.rows.map((row, n) => (
                    <tr key={n}>
                      {row.map((cell, j) =>
                        j === 0 ? (
                          <th scope="row" key={j}>
                            {cell}
                          </th>
                        ) : (
                          <td key={j}>{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <AnswerSources page={page} ids={b.sourceIds} />
          <ContextLinks links={b.links} />
        </section>
      ))}
      {page.questions.length > 0 && (
        <section className="article-section qa-section" id="questions">
          <span className="eyebrow">QUESTIONS & ANSWERS</span>
          <h2>{pageLabels(page.language).questions}</h2>
          <div className="qa-list">
            {page.questions.map((q, i) => (
              <details id={questionAnchor(q, i)} key={q.question} open={i === 0}>
                <summary>
                  <span>Q.</span>
                  {q.question}
                </summary>
                <p>{q.answer}</p>
                <AnswerSources page={page} ids={q.sourceIds} />
                <ContextLinks links={q.links} />
              </details>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
function AnswerSources({ page, ids = [] }: { page: Page; ids?: string[] }) {
  if (!ids.length) return null;
  return (
    <ul className="answer-sources" aria-label="이 설명의 참고 자료">
      {ids.map((id) => {
        const s = page.sources.find((s) => s.id === id)!;
        return (
          <li key={id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title}
              <ArrowUpRight size={13} />
              <span className="sr-only"> (새 창)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
function ContextLinks({ links = [] }: { links?: ContentLink[] }) {
  if (!links.length) return null;
  return (
    <ul className="context-links">
      {links.map((l) => (
        <li key={`${l.pageId}#${l.anchor ?? ''}`}>
          <a href={href(pageById(l.pageId)!.path) + (l.anchor ? `#${l.anchor}` : '')}>
            {l.label} <ArrowRight size={14} />
          </a>
        </li>
      ))}
    </ul>
  );
}
function ReviewAttribution({ page }: { page: Page }) {
  const review = reviewFor(page);
  return review ? (
    <p className="small">
      {review.role === 'medical' ? '의료 검토' : '정보 확인'}:{' '}
      {review.reviewerId ? (
        <a href={href(`/doctors/${review.reviewerId}/`)}>{review.reviewer}</a>
      ) : (
        review.reviewer
      )}{' '}
      · <time dateTime={review.reviewedAt}>{review.reviewedAt.slice(0, 10)}</time>
    </p>
  ) : null;
}
function VisitPage() {
  return (
    <>
      <VisitInfo />
      <div className="location-panel">
        <div
          className="station-diagram"
          aria-label="망포역 3번 출구에서 도보 약 2분 거리의 포레스퀘어 6층, 실제 지도는 네이버 지도 링크 확인"
        >
          <span className="station">
            수인분당선
            <br />
            <b>망포역</b>
          </span>
          <span className="walk">
            3번 출구 <ArrowRight /> 도보 약 2분
          </span>
          <span className="building">
            포레스퀘어
            <br />
            <b>영통탑내과 6F</b>
          </span>
        </div>
        <div>
          <span className="eyebrow">LOCATION</span>
          <h2>망포역 가까이에서 만나요.</h2>
          <p>{clinic.address}</p>
          <p>{clinic.parkingNote}</p>
          <a className="button" href={clinic.mapUrl} target="_blank" rel="noopener noreferrer">
            네이버 지도로 길찾기 <ArrowUpRight size={18} />
            <span className="sr-only"> (새 창)</span>
          </a>
          <p className="small">
            위 도식은 위치 안내용이며 실제 거리·방향을 표현한 지도는 아닙니다.
          </p>
        </div>
      </div>
      <div className="article-section">
        <h2>검사 예약·접수 확인</h2>
        <p>
          {clinic.bookingNote} 다른 검사와 함께 진행할 때는 준비 사항을 함께 문의해 주세요. 최종
          접수 시간과 당일 검사 가능 여부는 검사 종류와 진료 상황에 따라 병원에 확인해 주세요.
        </p>
      </div>
      <ClinicPhoto />
    </>
  );
}
function doctorSections(page: Page) {
  const doctor = physicians.find((d) => page.id === `doctor-${d.id}`)!;
  return [
    { id: 'doctor-careers', title: '주요 이력', entries: doctor.careers },
    { id: 'doctor-credentials', title: '인정 자격', entries: doctor.credentials },
    { id: 'doctor-memberships', title: '학회 활동', entries: doctor.memberships },
  ].filter((section) => section.entries.length > 0);
}
const clinicValues = [
  {
    title: '진료를 이해하는 설명',
    text: '검사의 목적과 준비, 결과를 살펴볼 때 필요한 정보를 함께 안내합니다.',
  },
  {
    title: '일상 가까이의 건강관리',
    text: '내과 진료와 건강검진부터 심장·초음파·내시경 검사까지 확인할 수 있습니다.',
  },
  {
    title: '방문 전부터 편안하게',
    text: '진료시간과 위치, 검사 예약·서류 준비를 미리 살펴보세요.',
  },
];
function DoctorDetail({ page }: { page: Page }) {
  const doctor = physicians.find((d) => page.id === `doctor-${d.id}`)!;
  return (
    <div className="doctor-profile">
      <div className="profile-photo">
        <img
          src={href(`/assets/${doctor.image}-640.webp`)}
          width="640"
          height="664"
          alt={doctor.imageKind === 'portrait' ? `${doctor.name} ${doctor.role}` : ''}
        />
      </div>
      <div>
        <span className="eyebrow">{doctor.specialty}</span>
        <h2>
          {doctor.name} <small>{doctor.role}</small>
        </h2>
        {doctorSections(page).map(({ id, title, entries }) => (
          <section key={id} id={id}>
            <h3>{title}</h3>
            <ul>
              {entries.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
function SiteMap() {
  return (
    <div className="sitemap-grid">
      {siteMapGroups(pages).map(
        ({ title: category, pages: list }: { title: string; pages: Page[] }) => {
          return (
            list.length > 0 && (
              <section key={category}>
                <h2>{category}</h2>
                <ul>
                  {list.map((p) => (
                    <li key={p.id}>
                      <a href={href(p.path)}>
                        {p.title}
                        <ArrowUpRight size={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )
          );
        },
      )}
    </div>
  );
}

export function PageContent({ page }: { page: Page }) {
  const t = pageLabels(page.language);
  const versions = languageVersions(page);
  const hasToc =
    (page.blocks.length > 0 ||
      page.questions.length > 0 ||
      !!hubGroups[page.id] ||
      page.template === 'physician-detail') &&
    !['visit', 'doctors', 'sitemap', 'search', 'cases'].includes(page.id);
  const section = sectionFor(page);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData(page) }}
      />
      {page.id === 'home' ? (
        <Home />
      ) : (
        <>
          <div className="page-heading">
            <div className="container">
              <nav className="breadcrumbs" aria-label={t.home}>
                <ol>
                  {breadcrumbs(page).map((p, i, a) => (
                    <li key={p.id}>
                      {i === a.length - 1 ? (
                        <span aria-current="page">{p.title}</span>
                      ) : (
                        <a href={href(p.path)}>{p.id === 'home' ? t.home : p.title}</a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
              {section.id !== page.id && (
                <a className="page-category" href={href(section.path)}>
                  {section.title}
                </a>
              )}
              <h1 id="article-title">{page.title}</h1>
              <p className="page-intro">{page.intro}</p>
              {versions.length > 1 && (
                <nav className="language-switcher" aria-label="Language">
                  {versions.map((p) => (
                    <a
                      key={p.id}
                      href={href(p.path)}
                      hrefLang={p.language ?? 'ko'}
                      lang={p.language ?? 'ko'}
                      aria-current={p.id === page.id ? 'page' : undefined}
                    >
                      {languageNames[p.language ?? 'ko']}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </div>
          <div className={`container page-content ${hasToc ? 'article-layout' : ''}`}>
            {hasToc && (
              <ArticleNavigation
                title={page.title}
                label={t.contents}
                relatedLabel={t.related}
                entries={[
                  ...(page.template === 'physician-detail'
                    ? doctorSections(page).map((s) => ({ id: s.id, label: s.title }))
                    : []),
                  ...(page.id === 'about'
                    ? clinicValues.map((v, i) => ({ id: `value-${i + 1}`, label: v.title }))
                    : []),
                  ...(!['symptoms', 'diseases'].includes(page.id)
                    ? (hubGroups[page.id] ?? []).map((g: { title: string }, i: number) => ({
                        id: `directory-${i + 1}`,
                        label: g.title,
                      }))
                    : []),
                  ...page.blocks.map((b, i) => ({
                    id: b.id ?? `section-${i + 1}`,
                    label: b.heading,
                  })),
                  ...(page.questions.length
                    ? [
                        { id: 'questions', label: t.questions },
                        ...page.questions.map((q, i) => ({
                          id: questionAnchor(q, i),
                          label: q.question,
                          nested: true,
                        })),
                      ]
                    : []),
                  ...(page.id === 'fees'
                    ? [{ id: 'fee-enquiry', label: '전화 문의 시 함께 확인할 항목' }]
                    : []),
                  ...(articleGuidance(page).enabled
                    ? [
                        {
                          id: 'article-guidance-title',
                          label:
                            guidanceLabels[(page.language ?? 'ko') as keyof typeof guidanceLabels]
                              .title,
                        },
                      ]
                    : []),
                  ...(!['cases', 'notices'].includes(page.id) && page.sources.length
                    ? [{ id: 'sources', label: t.sources }]
                    : []),
                ]}
                related={select(page.related).map((p) => ({ url: href(p.path), title: p.title }))}
              />
            )}
            <article className="main-article">
              {page.id === 'visit' ? (
                <VisitPage />
              ) : page.id === 'doctors' ? (
                <DoctorCards />
              ) : page.template === 'physician-detail' ? (
                <DoctorDetail page={page} />
              ) : page.id === 'search' ? (
                <Search
                  items={searchItems(
                    pages.filter(
                      (p) => !['not-found', 'search', 'sitemap'].includes(p.id) && p.indexable,
                    ),
                  )}
                  filter
                />
              ) : page.id === 'sitemap' ? (
                <SiteMap />
              ) : page.id === 'cases' ? (
                <>
                  <BodyBlocks page={page} />
                  <Search
                    items={caseLinks.map((item) => ({
                      ...item,
                      text: item.description,
                      external: true,
                    }))}
                    label="진단 사례에서 궁금한 내용을 찾아보세요"
                  />
                </>
              ) : page.id === 'notices' ? (
                <>
                  <BodyBlocks page={page} />
                  <OriginalNoticesLink />
                </>
              ) : null}
              {page.id === 'about' && (
                <div className="about-intro">
                  <ClinicPhoto />
                  <div className="values">
                    {clinicValues.map((value, i) => (
                      <div id={`value-${i + 1}`} key={value.title}>
                        <span>{String(i + 1).padStart(2, '0')}</span>
                        <h2>{value.title}</h2>
                        <p>{value.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(page.urgentNotice || page.risk === 'urgent_context_review') && (
                <p className="urgent-note">
                  {page.urgentNotice ??
                    '심한 흉통·호흡곤란 또는 의식 저하가 있다면 예약을 기다리지 말고 119 등 긴급 도움을 요청하세요.'}
                </p>
              )}
              <HubDirectory page={page} />
              {!['cases', 'notices'].includes(page.id) && <BodyBlocks page={page} />}
              {page.id === 'fees' && (
                <div className="article-section" id="fee-enquiry">
                  <h2>전화 문의 시 함께 확인할 항목</h2>
                  <ul className="check-list">
                    <li>검사 종류와 건강보험·검진 적용 여부</li>
                    <li>진정·조직검사·추가 처치의 포함 여부</li>
                    <li>진단서·영문서류의 종류, 발급 소요 시간과 비용</li>
                    <li>제출 기관의 지정 양식과 필요한 신분 확인 서류</li>
                  </ul>
                  <a className="button" href={phoneHref}>
                    비용·서류 전화 문의 <ArrowUpRight size={16} />
                  </a>
                </div>
              )}
              {!hasToc && page.related.length > 0 && (
                <nav className="plain-related" aria-label={t.related}>
                  <strong>{t.related}</strong>
                  <PageLinks ids={page.related} />
                </nav>
              )}
              {page.id !== 'search' && page.id !== 'sitemap' && (
                <>
                  <ArticleFooter page={page} />
                  <ReviewAttribution page={page} />
                  {!['cases', 'notices'].includes(page.id) && <Sources page={page} />}
                </>
              )}
            </article>
          </div>
        </>
      )}
    </>
  );
}
