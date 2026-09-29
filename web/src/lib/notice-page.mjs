import clinic from '../../../content/clinic.json' with { type: 'json' };
// The registry and the rendered article share the same notice content.
export function noticePage(notice) {
  const blocks = [
    {
      id: 'notice-information',
      heading: notice.kind === 'reference' ? '자료와 예방 안내' : '지원 대상과 안내',
      text: notice.paragraphs[0],
      ...(notice.paragraphs.length > 1 ? { paragraphs: notice.paragraphs.slice(1) } : {}),
    },
    ...(notice.schedule
      ? [
          {
            id: 'notice-schedule',
            heading: '대상별 접종 일정',
            text: '지원 대상별 시작일과 종료일을 확인하고, 접종 이력과 준비할 자료를 살펴보세요. 표가 화면보다 넓으면 좌우로 넘겨 확인할 수 있습니다.',
            table: notice.schedule,
          },
        ]
      : []),
    {
      id: 'notice-visit',
      heading: '방문 전 확인',
      text: notice.availability.replaceAll(clinic.phone, '{{clinic.phone}}'),
    },
  ];
  return {
    id: notice.id,
    path: notice.path,
    title: notice.title,
    metaTitle: `${notice.title} | 영통탑내과`,
    description: notice.summary,
    template: 'notice-guide',
    category: '공지사항',
    intro: notice.summary,
    blocks,
    questions: [],
    related: ['notices', 'vaccinations', 'visit'],
    sources: notice.sources.map((source, i) => ({
      id: `notice-source-${i + 1}`,
      title: source.label,
      url: source.url,
      kind: 'medical',
      checkedAt: notice.checkedAt,
    })),
    image: null,
    risk: 'medical',
    publishedAt: null,
    updatedAt: notice.updatedAt,
    indexable: true,
    reviewStatus: 'pending',
    contentKind: 'original-editorial-summary',
  };
}
