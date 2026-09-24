import { PageContent } from '@/components/content';
import { pageById, pageMetadata } from '@/lib/site';
const page = pageById('home')!;
export const metadata = pageMetadata(page);
export default function HomePage() {
  return <PageContent page={page} />;
}
