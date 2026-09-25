// Shared navigation, visible hub lists and JSON-LD use the same editorial grouping.
export const navigation = [
  ['symptoms', '증상백과'],
  ['diseases', '질환백과'],
  ['conditions', '진료분야'],
  ['services', '검사·시술'],
  ['cancer-support', '암환자 지지진료'],
  ['checkups', '검진·서류'],
  ['about', '병원안내'],
];
export const patientEntrances = [
  {
    id: 'symptoms',
    title: '지금 증상이 있어요',
    description: '가슴통증·두근거림·복통·기침 등 불편한 증상에서 시작하세요.',
  },
  {
    id: 'preparation',
    title: '검사를 예약했어요',
    description: '예약한 검사에 맞춰 음식·복용약·방문 준비를 확인하세요.',
  },
  {
    id: 'cancer-support',
    title: '암 치료 중 불편해요',
    description: '치료 중 증상과 기존 치료병원에 연락해야 할 상황을 확인하세요.',
  },
  {
    id: 'checkups',
    title: '검진·진단서가 필요해요',
    description: '건강 확인과 제출 서류 중 방문 목적에 맞는 안내를 찾으세요.',
  },
];
/** @type {Record<string, {title: string, ids: string[]}[]>} */
export const hubGroups = {
  symptoms: [
    { title: '심장·혈관', ids: ['acute-care', 'heart-disease', 'palpitations-followup'] },
    { title: '소화기·급성 복통', ids: ['abdominal-pain'] },
    { title: '호흡기·감염', ids: ['chronic-cough', 'respiratory-infections'] },
    {
      title: '암 치료 중 증상',
      ids: ['cancer-treatment-symptoms', 'fever-during-cancer-treatment'],
    },
    { title: '간·대사', ids: ['liver-disease', 'chronic-disease'] },
  ],
  diseases: [
    { title: '심장·혈관', ids: ['heart-disease', 'angina-treatment', 'heart-valve-regurgitation'] },
    { title: '소화기·간', ids: ['gallstones', 'liver-disease', 'colon-polyp-followup'] },
    {
      title: '호흡기·감염',
      ids: ['respiratory-infections', 'influenza', 'covid-19', 'chronic-cough'],
    },
    {
      title: '내분비·대사·갑상선',
      ids: ['chronic-disease', 'obesity-medication', 'thyroid-cancer-surveillance'],
    },
    { title: '암과 가족력', ids: ['cancer-family-history', 'cancer-treatment-symptoms'] },
  ],
  conditions: [
    { title: '심장·부정맥', ids: ['heart-disease', 'acute-care'] },
    { title: '소화기·간', ids: ['abdominal-pain', 'liver-disease'] },
    {
      title: '호흡기·감염·예방접종',
      ids: ['respiratory-infections', 'chronic-cough', 'influenza', 'covid-19', 'vaccinations'],
    },
    { title: '혈압·당뇨·고지혈증과 체중 관리', ids: ['chronic-disease', 'obesity-medication'] },
  ],
  services: [
    { title: '심장검사', ids: ['heart-index', 'heart-test-differences'] },
    { title: '초음파검사', ids: ['ultrasound-index'] },
    { title: '위·대장내시경', ids: ['endoscopy', 'gastroscopy', 'colonoscopy'] },
    { title: '검사 준비와 결과 확인', ids: ['preparation', 'examinations'] },
  ],
  preparation: [
    {
      title: '검사 전 준비',
      ids: [
        'checkup-preparation',
        'colonoscopy-preparation',
        'orafang-preparation',
        'plenvu-preparation',
      ],
    },
    {
      title: '예약한 검사별 확인',
      ids: [
        'gastroscopy',
        'echocardiography',
        'holter',
        'abdominal-ultrasound',
        'bowel-ultrasound',
        'thyroid-ultrasound',
      ],
    },
    {
      title: '검사 후 관리',
      ids: ['after-endoscopy', 'colon-polyp-followup', 'palpitations-followup'],
    },
  ],
  health: [
    { title: '증상·질환 이해하기', ids: ['symptoms', 'diseases'] },
    { title: '검사 선택·준비·검사 후 관리', ids: ['services', 'preparation'] },
    { title: '암 치료 중 증상과 검진', ids: ['cancer-support', 'checkups'] },
  ],
  checkups: [
    {
      title: '건강을 확인하려는 분',
      ids: ['national-checkup', 'cancer-screening', 'cancer-family-history', 'checkup-preparation'],
    },
    {
      title: '제출 서류가 필요한 분',
      ids: [
        'employment-checkup',
        'civil-service',
        'visa-checkup',
        'tuberculosis-screening',
        'drug-screening',
        'fees',
      ],
    },
  ],
  about: [
    { title: '병원과 의료진', ids: ['doctors', 'doctor-park-jongseol', 'doctor-park-rayoung'] },
    { title: '방문·이용 안내', ids: ['visit', 'fees', 'notices', 'cases', 'health'] },
  ],
  'cancer-support': [
    {
      title: '치료 중 증상 확인',
      ids: ['cancer-treatment-symptoms', 'fever-during-cancer-treatment'],
    },
  ],
};
export function hubIds(id) {
  return [...new Set((hubGroups[id] ?? []).flatMap((group) => group.ids))];
}
export function sectionId(page) {
  if (navigation.some(([id]) => id === page.id)) return page.id;
  if (['cancer-treatment-symptoms', 'fever-during-cancer-treatment'].includes(page.id))
    return 'cancer-support';
  if (
    ['health', 'preparation', 'heart-test-differences'].includes(page.id) ||
    (hubIds('preparation').includes(page.id) && page.path.startsWith('/health/'))
  )
    return 'services';
  if (page.path.includes('/checkups/') || page.id === 'fees') return 'checkups';
  if (page.path.startsWith('/conditions/') || page.id === 'vaccinations') return 'conditions';
  if (page.path.startsWith('/services/')) return 'services';
  if (page.path.startsWith('/health/')) return 'diseases';
  return 'about';
}

export function siteMapGroups(pages) {
  const utilityIds = ['home', 'search', 'sitemap', 'privacy'];
  return [...navigation, ['utilities', '사이트 이용']].map(([id, title]) => ({
    title,
    pages: pages.filter(
      (page) =>
        page.id !== 'not-found' &&
        (id === 'utilities'
          ? utilityIds.includes(page.id)
          : !utilityIds.includes(page.id) && sectionId(page) === id),
    ),
  }));
}
