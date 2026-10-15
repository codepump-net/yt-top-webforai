import assets from '../../../content/assets.json';
import visuals from '../../../content/visuals.json';
import { href } from '@/lib/site';

// Only reuse the illustration already assigned to this page. Text-only guides
// retain a text card instead of borrowing an unrelated medical illustration.
export function GuideCardImage({
  pageId,
  priority = false,
}: {
  pageId: string;
  priority?: boolean;
}) {
  const visual = visuals.banners.find((item) => item.pageId === pageId);
  const asset = visual && assets.find((item) => item.id === visual.assetId);
  if (!asset) return null;
  const sizes =
    '(max-width: 600px) calc(100vw - 44px), (max-width: 1100px) calc((100vw - 70px) / 2), 400px';
  const avifSources = `${href(`/assets/card-thumbnails/${asset.id}-400.avif`)} 400w, ${href(`/assets/card-thumbnails/${asset.id}.avif`)} 720w`;
  return (
    <div className="guide-card-image">
      {priority && (
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href={href(`/assets/card-thumbnails/${asset.id}.avif`)}
          imageSrcSet={avifSources}
          imageSizes={sizes}
          fetchPriority="high"
        />
      )}
      <picture>
        <source type="image/avif" srcSet={avifSources} sizes={sizes} />
        <img
          src={href(`/assets/card-thumbnails/${asset.id}.webp`)}
          srcSet={`${href(`/assets/card-thumbnails/${asset.id}-400.webp`)} 400w, ${href(`/assets/card-thumbnails/${asset.id}.webp`)} 720w`}
          sizes={sizes}
          width={asset.width}
          height={asset.height}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding={priority ? 'sync' : 'async'}
        />
      </picture>
    </div>
  );
}
