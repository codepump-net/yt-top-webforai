import { pages, href } from '@/lib/site';
import { searchItems, searchablePages } from '@/lib/search-model.mjs';

// This is an exported static asset. Search terms never leave the browser.
export const dynamic = 'force-static';
export function GET() {
  return Response.json(searchItems(searchablePages(pages), href));
}
