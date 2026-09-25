type Entry = { id: string; label: string; nested?: boolean };
export function ArticleNavigation({
  title,
  label,
  entries,
  related,
  relatedLabel,
}: {
  title: string;
  label: string;
  entries: Entry[];
  related: { url: string; title: string }[];
  relatedLabel: string;
}) {
  const contents = (
    <div className="toc-content">
      <a className="toc-title" href="#article-title">
        {title}
      </a>
      <nav aria-label={label}>
        {entries.map((entry) => (
          <a
            className={entry.nested ? 'toc-subtitle' : undefined}
            key={entry.id}
            href={`#${entry.id}`}
          >
            {entry.label}
          </a>
        ))}
      </nav>
      {related.length > 0 && (
        <nav className="article-connections" aria-label={relatedLabel}>
          <strong>{relatedLabel}</strong>
          {related.map((item) => (
            <a key={item.url} href={item.url}>
              {item.title}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
  // CSS selects the layout before first paint. Native details also work without JavaScript.
  return (
    <aside className="article-sidebar">
      <div className="sidebar-box">
        <strong className="contents-label">{label}</strong>
        {contents}
      </div>
      <details className="mobile-toc">
        <summary>{label}</summary>
        {contents}
      </details>
    </aside>
  );
}
