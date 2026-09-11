"""One-time editorial improvement; runtime uses content JSON, not this importer."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[2]
if (root / 'content/page-intents.json').exists():
    raise SystemExit('Historical importer disabled: edit current content under docs/patient-content-policy.ko.md.')
file = root / 'content/pages.json'
pages = json.loads(file.read_text(encoding='utf-8'))
intros = {
    'home': '망포역 3번 출구 인근 영통탑내과의 진료·검사, 의료진, 건강검진과 방문 안내를 확인하세요. 전화 031-202-7555, 포레스퀘어 6층.',
    'services': '심장검사, 내시경, 초음파와 내과 진료를 안내합니다. 검사별 목적·준비 사항·결과를 이해할 때 확인할 점을 살펴보세요.',
    'heart-index': '심장초음파부터 홀터검사까지, 심장의 구조와 리듬을 살피는 검사들을 안내합니다. 검사 선택은 증상과 진료 결과에 따라 달라집니다.',
    'endoscopy': '위내시경과 대장내시경의 목적과 준비를 안내합니다. 검사 시각, 진정 여부와 복용약에 맞는 개별 안내를 확인해 주세요.',
    'ultrasound-index': '복부·갑상선·장 초음파의 관찰 범위와 준비 사항을 확인하세요. 부위와 검사 목적에 따라 준비 과정이 달라질 수 있습니다.',
    'checkups': '국가건강검진부터 채용·기숙사·비자 관련 검진까지 안내합니다. 검진 목적과 제출 기관이 요구하는 항목을 먼저 확인하세요.',
    'conditions': '반복되는 기침, 심장 관련 증상과 급성기질환의 진료를 안내합니다. 증상의 시작과 변화, 복용약을 정리하면 상담에 도움이 됩니다.',
    'doctors': '내과 전문의 박종설 대표원장과 가정의학과 전문의 박라영 원장의 전문 분야와 주요 진료 이력을 소개합니다.',
    'doctor-park-jongseol': '내과 전문의 박종설 대표원장의 주요 이력과 학회 활동을 기존 홈페이지 의료진 소개를 기준으로 안내합니다.',
    'doctor-park-rayoung': '가정의학과 전문의 박라영 원장의 주요 이력과 인정 자격을 기존 홈페이지 의료진 소개를 기준으로 안내합니다.',
    'health': '심장검사의 차이부터 건강검진·내시경 준비까지. 의료진과 상담할 때 필요한 질문과 확인 사항을 정리했습니다.',
    'cases': '기존 홈페이지에 소개된 진단 과정을 이해하기 위한 교육용 요약입니다. 환자 개인 정보와 검사 이미지는 포함하지 않았습니다.',
    'notices': '기존 홈페이지에 게시된 장비 도입, 검진과 서류 발급 소식을 확인하세요. 과거 휴진 기록과 현재 운영 안내는 구분해 살펴보세요.',
    'search': '진료·검사 이름, 의료진, 방문 안내와 건강정보를 찾아보세요. 여러 단어를 띄어 쓰면 해당 단어가 모두 포함된 자료를 찾습니다.',
    'sitemap': '병원 소개부터 진료·검사·건강검진·건강정보까지, 영통탑내과 홈페이지의 전체 페이지를 분야별로 안내합니다.',
    'not-found': '요청한 페이지를 찾을 수 없습니다. 홈페이지나 검색에서 필요한 진료·검사 안내를 찾아보세요.',
    'visit': '망포역 3번 출구에서 도보 약 2분, 포레스퀘어 6층에 있습니다. 평일 08:30–18:30, 토요일 08:30–13:30 진료를 안내합니다. 방문 전 예약과 접수를 확인해 주세요.',
}
questions = {
    'checkup-preparation': ['검진에 어떤 항목이 포함되는지 확인해야 하나요?', '금식할 때 물과 커피도 제한하나요?', '평소 먹는 약을 중단해야 하나요?'],
    'colonoscopy-preparation': ['검사 전 음식과 음료는 어떻게 준비하나요?', '정결제를 먹기 어렵다면 어떻게 하나요?', '복용약이나 기존 질환을 알려야 하나요?'],
    'heart-test-differences': ['심전도는 무엇을 기록하나요?', '심장초음파는 심전도와 어떻게 다른가요?', '홀터검사는 어떤 정보를 확인하나요?'],
    'palpitations-followup': ['두근거림이 나타날 때 무엇을 기록하나요?', '검사 중 증상이 나타나지 않았다면 어떻게 하나요?', '다음 진료에 어떤 정보를 가져가면 좋을까요?'],
}
sources = {
    'echo': {'title': '서울아산병원 · 심장초음파 검사', 'url': 'https://www.amc.seoul.kr/asan/healthinfo/management/managementDetail.do?managementId=516'},
    'colon': {'title': '서울아산병원 건강증진센터 · 진정 대장내시경', 'url': 'https://health.amc.seoul.kr/health/personal/checkInformation.do?checkno=12'},
    'holter': {'title': '서울대학교병원 · 서맥과 심전도 검사 설명', 'url': 'https://www.snuh.org/health/nMedInfo/nView.do?medid=AA001378'},
}
source_map = {'echocardiography':['echo'], 'heart-test-differences':['echo','holter'], 'holter':['holter'], 'colonoscopy':['colon'], 'colonoscopy-preparation':['colon']}
titles = {'case-164673131':'속쓰림으로 내원한 위암 진단 사례', 'case-164673116':'복수·단백뇨와 대장암 진단 사례', 'case-165204038':'혈변과 대장내시경을 통한 대장암 진단 사례', 'case-165396339':'대동맥판막협착 진단 사례'}
for page in pages:
    if page['id'] in intros:
        page['intro'] = page['description'] = intros[page['id']]
    if page['id'] in questions:
        for item, question in zip(page['questions'], questions[page['id']]):
            item['question'] = question
    for key in source_map.get(page['id'], []):
        if sources[key] not in page['sources']:
            page['sources'].append(sources[key])
    if page['id'] in titles:
        page['title'] = titles[page['id']]
        page['metaTitle'] = page['title'] + ' | 영통탑내과'
    if page['id'] == 'privacy':
        page['sources'] = [{'title': 'GitHub 개인정보 처리방침', 'url':'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement'}]
    if page['id'] == 'content-policy':
        page['blocks'] += [
            {'heading':'출처와 질문의 선정', 'text':'기존 병원 홈페이지의 공개 정보를 정리하고, 일부 검사 설명은 대학병원 건강정보를 함께 참고합니다. 질문은 안내에 필요한 주제를 편집한 것으로 검색 빈도가 검증된 순위나 외부 이용자의 실제 질의로 표시하지 않습니다. 외부 질의응답의 글과 개인정보는 옮기지 않습니다.'},
            {'heading':'사례와 자료의 범위', 'text':'진단 사례는 기존 글의 취지를 설명하는 교육용 요약입니다. 환자의 나이·성별·수치·검사 이미지는 싣지 않았으며 치료 효과를 보장하거나 전형적인 결과로 제시하지 않습니다. 현재 운영 정보와 차이가 날 수 있는 과거 공지는 게시일을 함께 표시합니다.'},
            {'heading':'검토와 수정', 'text':'현재는 홈페이지 검토본으로, 의료진의 최종 검수 이력이 없습니다. 운영 시간·비용·서류·검사 조건은 병원에서 확인해야 합니다. 실제 검수 후 담당자와 검토일, 출처를 기록하고 내용이 바뀌면 다시 확인하는 절차를 적용합니다.'},
        ]
file.write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Editorial copy and official references updated.')
