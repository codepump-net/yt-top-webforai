'use client';
import { useId, useRef, useState } from 'react';

export function ZoomImage({
  src,
  width,
  height,
  alt,
  caption,
  className = '',
  naturalSize = false,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  className?: string;
  naturalSize?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const title = useId();
  const [open, setOpen] = useState(false);
  return (
    <figure className={`zoom-figure ${className}`}>
      <a
        style={{ maxWidth: width, marginInline: 'auto' }}
        ref={trigger}
        className="image-enlarge"
        href={src}
        aria-label={`${alt} — 이미지 크게 보기`}
        onClick={(event) => {
          if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            !dialog.current?.showModal
          )
            return;
          event.preventDefault();
          setOpen(true);
          dialog.current.showModal();
        }}
      >
        <img src={src} width={width} height={height} alt={alt} loading="lazy" decoding="async" />
        <span className="image-zoom-label">이미지 크게 보기 ↗</span>
      </a>
      <figcaption>{caption}</figcaption>
      <dialog
        ref={dialog}
        className="image-dialog"
        aria-labelledby={title}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="image-dialog-bar">
          <p id={title}>{caption}</p>
          <button type="button" onClick={() => dialog.current?.close()}>
            닫기
          </button>
        </div>
        <div
          className="image-dialog-scroll"
          tabIndex={naturalSize ? 0 : undefined}
          role={naturalSize ? 'region' : undefined}
          aria-label={naturalSize ? '확대한 이미지 스크롤 영역' : undefined}
        >
          {open && (
            <img
              src={src}
              width={width}
              height={height}
              alt={alt}
              style={{ maxWidth: width, ...(naturalSize ? { width } : {}) }}
            />
          )}
        </div>
        <a href={src} target="_blank" rel="noopener noreferrer">
          원본 크기로 보기 (새 창)
        </a>
      </dialog>
    </figure>
  );
}
