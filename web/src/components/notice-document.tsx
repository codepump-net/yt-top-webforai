import type { Notice } from '@/lib/notice-types';
import { href } from '@/lib/site';
import assets from '../../../content/assets.json';
import { ZoomImage } from './zoom-image';

export function NoticeDocument({ notice }: { notice: Notice }) {
  return (
    <>
      {notice.document && (
        <section
          id="notice-original"
          className="notice-original"
          aria-labelledby="notice-original-title"
        >
          <h2 id="notice-original-title">{notice.document.title}</h2>
          <p>{notice.document.publicationNote}</p>
          <p>
            <a href={notice.document.sourceUrl} target="_blank" rel="noopener noreferrer external">
              질병관리청 공식 자료와 본문 보기 (새 창)
            </a>{' '}
            ·{' '}
            <a
              href={notice.document.license.url}
              target="_blank"
              rel="noopener noreferrer external"
            >
              {notice.document.license.label}
            </a>
          </p>
          <p>
            원문 {notice.document.pages.length}쪽을 순서대로 볼 수 있습니다. 이미지를 누르면 원본
            크기로 열립니다.
          </p>
          <a
            className="button secondary"
            href={href(notice.document.pdf)}
            target="_blank"
            rel="noopener noreferrer"
          >
            원본 PDF 보기 (새 창)
          </a>
          {notice.document.pages.map((figure) => {
            const asset = assets.find((item) => item.id === figure.assetId);
            if (!asset) throw new Error(`Missing notice page image: ${figure.assetId}`);
            return (
              <ZoomImage
                key={figure.page}
                className="notice-page-image"
                naturalSize
                src={href(asset.file)}
                width={asset.width}
                height={asset.height}
                alt={figure.alt}
                caption={`${figure.page} / ${notice.document!.pages.length}쪽`}
              />
            );
          })}
        </section>
      )}
      {notice.attachment && (
        <p className="notice-attachment">
          <a
            className="button secondary"
            href={notice.attachment.url}
            target="_blank"
            rel="noopener noreferrer external"
          >
            {notice.attachment.label} (PDF, 새 창)
          </a>
        </p>
      )}
      <p>
        <a className="text-link" href={href('/notices/')}>
          공지사항 목록으로 돌아가기
        </a>
      </p>
      <p className="article-copyright">
        페이지 링크를 공유할 수 있습니다. 글·이미지의 재사용은 자료별 이용 조건을 확인해 주세요.{' '}
        <a href={href('/copyright/')}>저작권·콘텐츠 이용 안내</a>
      </p>
    </>
  );
}
