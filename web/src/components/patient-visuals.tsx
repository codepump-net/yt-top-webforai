import visuals from '../../../content/visuals.json';
import assets from '../../../content/assets.json';
import { href } from '@/lib/site';
import { ZoomImage } from './zoom-image';

export function PatientBanner({ pageId }: { pageId: string }) {
  const visual = visuals.banners.find((v) => v.pageId === pageId);
  if (!visual) return null;
  const asset = assets.find((a) => a.id === visual.assetId)!;
  return (
    <ZoomImage
      className="patient-banner"
      src={href(asset.file)}
      width={asset.width}
      height={asset.height}
      alt={visual.alt}
      caption={visual.caption}
    />
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
        <h3>안내도 내용 읽기</h3>
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
