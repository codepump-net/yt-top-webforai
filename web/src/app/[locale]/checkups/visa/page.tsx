import { notFound } from 'next/navigation';
import { PageContent } from '@/components/content';
import { pages, pageByPath, pageMetadata } from '@/lib/site';
export const dynamicParams = false;
export function generateStaticParams() {
  return pages
    .filter((p) => p.translationOf === 'visa-checkup')
    .map((p) => ({ locale: p.path.split('/')[1] }));
}
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const page = pageByPath(`/${locale}/checkups/visa/`);
  return page ? pageMetadata(page) : {};
}
export default async function VisaPage({ params }: Props) {
  const { locale } = await params;
  const page = pageByPath(`/${locale}/checkups/visa/`);
  if (!page) notFound();
  return <PageContent page={page} />;
}
