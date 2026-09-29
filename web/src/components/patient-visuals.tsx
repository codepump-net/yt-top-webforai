import visuals from '../../../content/visuals.json';
import assets from '../../../content/assets.json';
import { href } from '@/lib/site';
import { ZoomImage } from './zoom-image';

const diagramTextTitles: Record<string, string> = {
  'heart-flow': '증상에 따라 선택하는 검사',
  'endoscopy-preparation': '검사 종류별 준비',
  'after-endoscopy': '식사와 생활 관리',
  'checkup-flow': '검진별 준비와 결과',
};

export function PatientBanner({ pageId }: { pageId: string }) {
  const visual = visuals.banners.find((v) => v.pageId === pageId);
  if (!visual) return null;
  const asset = assets.find((a) => a.id === visual.assetId)!;
  return (
    <figure className="patient-banner">
      <a
        className="banner-original"
        href={href(asset.file)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ maxWidth: asset.width }}
        aria-label={`${visual.alt} — 원본 이미지 보기 (새 창)`}
      >
        <img
          src={href(asset.file)}
          width={asset.width}
          height={asset.height}
          alt={visual.alt}
          loading="lazy"
          decoding="async"
        />
      </a>
    </figure>
  );
}

export function PatientDiagram({ pageId }: { pageId: string }) {
  const visual = visuals.diagrams.find((v) => v.pageId === pageId);
  if (!visual) return null;
  const asset = assets.find((a) => a.id === visual.assetId)!;
  return (
    <section className="patient-diagram" aria-labelledby={`${visual.id}-title`}>
      <h2 id={`${visual.id}-title`}>{visual.title}</h2>
      <ZoomImage
        src={href(asset.file)}
        width={asset.width}
        height={asset.height}
        alt={visual.alt}
        caption={visual.caption}
      />
      <div className="diagram-text">
        <h3>{diagramTextTitles[visual.id]}</h3>
        <ol>
          {visual.steps.map((step) => (
            <li key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="diagram-note">{visual.note}</p>
      </div>
    </section>
  );
}
