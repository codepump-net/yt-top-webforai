import RootLayout from './(ko)/layout';
import NotFound from './(ko)/not-found';

// Multiple language root layouts share the same patient-facing 404 recovery page.
export default function GlobalNotFound() {
  return (
    <RootLayout>
      <NotFound />
    </RootLayout>
  );
}
