type Entry = { id: string; label: string };
export function ArticleNavigation({ label, entries }: { label: string; entries: Entry[] }) {
  return (
    <aside className="article-sidebar">
      <details className="article-toc sidebar-box">
        <summary>{label}</summary>
        <nav className="toc-content" aria-label={label}>
          {entries.slice(0, 8).map((entry) => (
            <a key={entry.id} href={`#${entry.id}`}>
              {entry.label}
            </a>
          ))}
        </nav>
      </details>
    </aside>
  );
}
