import aliases from '../../../content/search-aliases.json' with { type: 'json' };
import { directoryTerms, discoverable, guideRole, sectionId } from './information-architecture.mjs';

const categories = {
  symptoms: '증상',
  diseases: '질환',
  conditions: '진료분야',
  services: '검사·시술',
  'cancer-support': '암환자 지지진료',
  checkups: '검진·서류',
  about: '병원안내',
};
export const searchCategories = Object.values(categories);
export const searchCategory = (page) => categories[sectionId(page)];
export const searchablePages = (pages) =>
  pages.filter(
    (page) => discoverable(page) && page.indexable && !['search', 'sitemap'].includes(page.id),
  );

// Matching uses individual query words, so repeated body words need only one copy.
const searchWords = (parts) =>
  [
    ...new Set(
      parts.join(' ').normalize('NFKC').toLocaleLowerCase('ko').split(/\s+/).filter(Boolean),
    ),
  ].join(' ');

export function searchItems(pages, href = (path) => path) {
  return pages.filter(discoverable).map((page) => ({
    title: page.title,
    description: page.description,
    category: searchCategory(page),
    aliases: [...directoryTerms(page.id), ...(aliases[page.id] ?? [])].join(' '),
    guideRole: guideRole(page.id),
    url: href(page.path),
    headings: [...page.blocks.map((b) => b.heading), ...page.questions.map((q) => q.question)].join(
      ' ',
    ),
    detail: /detail$/.test(page.template),
    text: searchWords([
      page.intro,
      ...page.blocks.map((b) =>
        [
          b.heading,
          b.text,
          ...(b.paragraphs ?? []),
          ...(b.items ?? []),
          ...(b.steps ?? []),
          ...(b.table ? [b.table.caption, ...b.table.columns, ...b.table.rows.flat()] : []),
        ].join(' '),
      ),
      ...page.questions.map((q) => q.question + ' ' + q.answer),
    ]),
  }));
}
