import { href } from '@/lib/site';
export default function NotFound() {
  return (
    <div className="container empty-state error-page">
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>
        주소가 변경되었거나 존재하지 않는 페이지입니다.
        <br />
        진료·검사 안내 또는 전체 목록에서 필요한 정보를 찾아보세요.
      </p>
      <div className="button-row">
        <a className="button" href={href('/')}>
          홈으로 가기
        </a>
        <a className="button secondary" href={href('/search/')}>
          사이트 검색
        </a>
        <a className="text-link" href={href('/sitemap/')}>
          전체 페이지
        </a>
      </div>
    </div>
  );
}
