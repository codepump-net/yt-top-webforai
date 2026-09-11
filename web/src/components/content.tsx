import {
  ArrowRight,
  ArrowUpRight,
  HeartPulse,
  ScanLine,
  Stethoscope,
  ClipboardCheck,
  Activity,
  Waves,
  Check,
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
} from '@/lib/site';
import caseLinks from '../../../content/case-links.json';
import { VisitInfo } from './chrome';
import { Search, type SearchItem } from './search';

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
              <span className="status-dot" /> 망포역 3번 출구 · 영통탑내과
            </span>
            <h1>
              내 몸을 이해하는 진료,
              <br />
              <em>건강한 일상</em>의 시작.
            </h1>
            <p>
              일상의 불편함부터 건강을 위한 검진까지.
              <br />
              나에게 필요한 진료와 검사를 차근차근 확인하세요.
            </p>
            <div className="button-row">
              <a className="button" href={href('/services/')}>
                진료·검사 알아보기 <ArrowUpRight size={19} />
              </a>
              <a className="button secondary" href={href('/visit/')}>
                처음 방문하시나요? <ArrowRight size={18} />
              </a>
            </div>
            <div className="hero-note">
              <span>내과 · 가정의학과</span>
              <span>건강검진 · 내시경 · 심장검사</span>
            </div>
          </div>
          <div className="hero-visual">
            <ClinicPhoto hero />
            <div className="photo-caption">
              <span>YOUR HEALTH, OUR CARE</span>
              <p>편안한 만남이 시작되는 곳</p>
            </div>
            <div className="location-chip">
              <MapPin size={18} />
              <span>
                포레스퀘어 <b>6층</b>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="quick-strip">
        <div className="container">
          <VisitInfo compact />
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="CARE & EXAMINATION"
          title="어떤 도움이 필요하신가요?"
          text="궁금한 진료 분야를 선택하면 검사 과정과 방문 전 준비를 확인할 수 있습니다."
          link={['/services/', '전체 진료·검사']}
        />
        <Cards
          icons
          items={select([
            'heart-index',
            'endoscopy',
            'ultrasound-index',
            'checkups',
            'conditions',
            'cancer-support',
          ])}
        />
      </section>
      <section className="section soft-section">
        <div className="container">
          <SectionHeading
            eyebrow="OUR DOCTORS"
            title="건강을 함께 살피는 의료진"
            text="의료진의 전문 분야와 진료 이력을 확인하세요."
            link={['/doctors/', '의료진 소개']}
          />
          <DoctorCards />
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="HEALTH GUIDE"
          title="검사 전에, 먼저 이해하세요."
          text="검사의 목적과 준비 사항을 쉬운 설명으로 확인하세요."
          link={['/health/', '건강정보 모두 보기']}
        />
        <Cards
          items={select([
            'heart-test-differences',
            'colonoscopy-preparation',
            'checkup-preparation',
          ])}
        />
      </section>
      <section className="visit-banner container">
        <div>
          <span className="eyebrow">YOUR FIRST VISIT</span>
          <h2>
            방문 전 확인하면
            <br />
            진료가 더 편안해집니다.
          </h2>
          <p>진료시간, 검사 예약, 준비할 서류를 살펴보세요.</p>
          <a className="button light" href={href('/visit/')}>
            방문 안내 보기 <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="visit-checklist">
          {[
            '예약할 검사와 방문 목적 확인',
            '복용 중인 약과 이전 검사 결과 준비',
            '제출 기관의 서류와 검사 항목 확인',
          ].map((s, i) => (
            <p key={s}>
              <span>0{i + 1}</span>
              {s}
              <Check size={18} />
            </p>
          ))}
          <a href={href('/fees/')}>
            검사 비용·서류 안내 <ArrowRight size={17} />
          </a>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="CLINIC NEWS"
          title="병원 소식"
          link={['/notices/', '공지사항 전체 보기']}
        />
        <p>휴진 일정과 검사·서류 발급 소식은 병원 홈페이지의 공지사항에서 확인하세요.</p>
        <OriginalNoticesLink />
      </section>
    </>
  );
}

function getChildren(page: Page): Page[] {
  if (page.id === 'services')
    return select([
      'heart-index',
      'endoscopy',
      'ultrasound-index',
      'checkups',
      'conditions',
      'cancer-support',
    ]);
  if (page.id === 'health') return pages.filter((p) => p.template === 'article-detail');
  return pages.filter(
    (p) =>
      p.path.startsWith(page.path) &&
      p.path !== page.path &&
      p.path.slice(page.path.length).split('/').filter(Boolean).length === 1,
  );
}
function searchItems(items: Page[]): SearchItem[] {
  return items.map((p) => ({
    title: p.title,
    description: p.description,
    category: p.category,
    url: href(p.path),
    text:
      p.blocks
        .map(
          (b) =>
            `${b.heading} ${b.text} ${b.table ? [b.table.caption, ...b.table.columns, ...b.table.rows.flat()].join(' ') : ''}`,
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
  return (
    <aside className="provenance" aria-label="참고 자료">
      <h2>참고 자료</h2>
      <ul>
        {page.sources.map((s, i) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title}
              {page.sources.filter((t) => t.title === s.title).length > 1 ? ` · 자료 ${i + 1}` : ''}
              <ArrowUpRight size={13} />
              <span className="sr-only"> (새 창)</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
function BodyBlocks({ page }: { page: Page }) {
  return (
    <>
      {page.blocks.map((b, i) => (
        <section className="article-section" id={b.id ?? `section-${i + 1}`} key={b.heading}>
          <h2>{b.heading}</h2>
          <p>{b.text}</p>
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
          <h2>궁금한 점을 확인하세요</h2>
          <div className="qa-list">
            {page.questions.map((q, i) => (
              <details id={q.id} key={q.question} open={i === 0}>
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
function SidebarCta({ page }: { page: Page }) {
  if (page.risk === 'urgent_context_review') return null;
  return (
    <div className="sidebar-cta">
      <p>방문·검사 문의</p>
      <a href={phoneHref}>{clinic.phone}</a>
      <a className="text-link" href={href('/visit/')}>
        진료시간·오시는 길 <ArrowRight size={15} />
      </a>
    </div>
  );
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
        {[
          ['주요 이력', doctor.careers],
          ['인정 자격', doctor.credentials],
          ['학회 활동', doctor.memberships],
        ].map(
          ([title, entries]) =>
            (entries as string[]).length > 0 && (
              <section key={title as string}>
                <h3>{title as string}</h3>
                <ul>
                  {(entries as string[]).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>
            ),
        )}
      </div>
    </div>
  );
}
function SiteMap() {
  const groups = [
    '병원 안내',
    '심장검사',
    '내시경',
    '초음파',
    '건강검진',
    '내과 진료',
    '건강정보',
    '진단 사례',
    '공지사항',
  ];
  const categories = [...new Set([...groups, ...pages.map((p) => p.category)])];
  return (
    <div className="sitemap-grid">
      {categories.map((category) => {
        const list = pages.filter((p) => p.category === category && p.id !== 'not-found');
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
      })}
    </div>
  );
}

export function PageContent({ page }: { page: Page }) {
  const isWide =
    /index|hub/.test(page.template) || ['visit', 'about', 'sitemap', 'search'].includes(page.id);
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
              <nav className="breadcrumbs" aria-label="현재 위치">
                <ol>
                  {breadcrumbs(page).map((p, i, a) => (
                    <li key={p.id}>
                      {i === a.length - 1 ? (
                        <span aria-current="page">{p.title}</span>
                      ) : (
                        <a href={href(p.path)}>{p.id === 'home' ? '홈' : p.title}</a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
              <span className="eyebrow">{page.category}</span>
              <h1>{page.title}</h1>
              <p className="page-intro">{page.intro}</p>
            </div>
          </div>
          <div className={`container page-content ${isWide ? '' : 'article-layout'}`}>
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
                    <div>
                      <span>01</span>
                      <h2>진료를 이해하는 설명</h2>
                      <p>검사의 목적과 준비, 결과를 살펴볼 때 필요한 정보를 함께 안내합니다.</p>
                    </div>
                    <div>
                      <span>02</span>
                      <h2>일상 가까이의 건강관리</h2>
                      <p>
                        내과 진료와 건강검진부터 심장·초음파·내시경 검사까지 확인할 수 있습니다.
                      </p>
                    </div>
                    <div>
                      <span>03</span>
                      <h2>방문 전부터 편안하게</h2>
                      <p>진료시간과 위치, 검사 예약·서류 준비를 미리 살펴보세요.</p>
                    </div>
                  </div>
                </div>
              )}
              {page.risk === 'urgent_context_review' && (
                <p className="urgent-note">
                  심한 흉통·호흡곤란 또는 의식 저하가 있다면 예약을 기다리지 말고 119 등 긴급 도움을
                  요청하세요.
                </p>
              )}
              {!['cases', 'notices'].includes(page.id) && <BodyBlocks page={page} />}
              {/index|hub/.test(page.template) &&
                !['doctors', 'cases', 'notices'].includes(page.id) && (
                  <Cards icons={page.id !== 'health'} items={getChildren(page)} />
                )}
              {page.id === 'fees' && (
                <div className="article-section">
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
              {page.id !== 'search' && page.id !== 'sitemap' && (
                <>
                  <ReviewAttribution page={page} />
                  {!['cases', 'notices'].includes(page.id) && <Sources page={page} />}
                </>
              )}
            </article>
            {!isWide && (
              <aside className="article-sidebar">
                <div className="sidebar-box">
                  <span className="eyebrow">이 페이지에서</span>
                  <nav aria-label="본문 목차">
                    {page.blocks.map((b, i) => (
                      <a href={`#${b.id ?? `section-${i + 1}`}`} key={b.heading}>
                        {b.heading}
                      </a>
                    ))}
                    {page.questions.length > 0 && <a href="#questions">궁금한 점</a>}
                    <a href="#related">함께 보면 좋은 안내</a>
                  </nav>
                  <SidebarCta page={page} />
                </div>
              </aside>
            )}
          </div>
          {page.related.length > 0 && (
            <section className="section related-section" id="related">
              <div className="container">
                <SectionHeading eyebrow="RELATED INFORMATION" title="함께 보면 좋은 안내" />
                <Cards items={select(page.related).slice(0, 6)} />
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
