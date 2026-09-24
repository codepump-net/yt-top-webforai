import { notFound } from 'next/navigation';
import { PageContent } from '@/components/content';
import { pages, pageByPath, pageMetadata } from '@/lib/site';
export const dynamicParams = false;
export function generateStaticParams() {
  return pages
    .filter((p) => p.id !== 'home' && p.id !== 'not-found' && !p.translationOf)
    .map((p) => ({ segments: p.path.split('/').filter(Boolean) }));
}
type Props = { params: Promise<{ segments: string[] }> };
export async function generateMetadata({ params }: Props) {
  const { segments } = await params;
  const page = pageByPath('/' + segments.join('/') + '/');
  return page ? pageMetadata(page) : {};
}
export default async function ContentPage({ params }: Props) {
  const { segments } = await params;
  const page = pageByPath('/' + segments.join('/') + '/');
  if (!page) notFound();
  return <PageContent page={page} />;
}
