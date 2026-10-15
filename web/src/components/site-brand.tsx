import siteIdentity from '../../../content/site.json';

export function SiteBrand({ homeUrl, label }: { homeUrl: string; label?: string }) {
  return (
    <a className="brand" href={homeUrl} aria-label={label ?? `${siteIdentity.name} 홈`}>
      <span className="brand-name" lang="ko">
        {siteIdentity.name}
      </span>
      <span className="brand-operator" lang="ko">
        {siteIdentity.operatorLabel}
      </span>
    </a>
  );
}
