"""Build development documents from the local research inventory. No deployment."""
import csv
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import parse_qs, urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
SRC = ROOT / 'research/2026-09-11-yttop'
ORIGIN = 'https://codepump-net.github.io'
BASE = '/yt-top-webforai'

# title, unique intent, ordered sections, questions to answer, related page IDs, specific review issue
D = {
'home': ('영통탑내과', '병원의 진료 범위와 방문 방법을 한 화면에서 판단', '병원명·망포역 위치|핵심 진료 카드|의료진 요약|진료·접수 요약|유효한 공지|방문 연결', '어떤 진료와 검사를 받을 수 있나요?|위치와 진료시간은 어떻게 되나요?|검사 전에 예약이 필요한가요?', 'visit|doctors|heart-index|checkups|endoscopy', '최고·유일·완치 등 미확인 표현과 종료 이벤트를 hero에 넣지 않음'),
'about': ('병원 소개', '기존 소개를 사실 중심으로 재구성하고 실제 시설을 보여줌', '소개 요약|진료 철학 원문 재구성|확인된 진료 범위|시설 사진|의료진·방문 연결', '어떤 분야를 진료하나요?|병원 내부는 어떻게 구성되어 있나요?|담당 의료진은 누구인가요?', 'doctors|services|visit', '16·41 중복 통합; 인증·평가의 범위와 기간 증빙 확인'),
'doctors': ('의료진 소개', '현재 의료진과 진료 분야를 구분', '현재 의료진 카드|전문과목 구분|프로필 연결|진료 일정 문의', '현재 의료진은 누구인가요?|의료진별 전문과목은 무엇인가요?|의료진별 일정은 어디에서 확인하나요?', 'doctor-park-jongseol|doctor-park-rayoung|visit', '48 현행과 MAIN2 이전 의료진 혼합 금지'),
'visit': ('진료시간·오시는 길', '주소·시간·접수·예약을 단일 원장으로 안내', '전화·도로명 주소|요일별 진료·휴게|접수 마감·검사 예약|휴진 예외|망포역 안내|주차 확인 상태|지도 열기', '토요일에도 진료하나요?|심장초음파는 예약해야 하나요?|망포역에서 어떻게 가나요?|주차 지원은 어떻게 되나요?', 'home|checkups|echocardiography|notices', '토요일 점심·주차·검사 접수 적용 범위 확인; 알 수 없는 항목 추정 금지'),
'services': ('진료·검사 안내', '심장·초음파·내시경·내과 진료를 실제 제공 범위로 안내', '진료 분류|분류별 설명·카드|검사 선택의 한계|문의 안내', '어떤 검사가 가능한가요?|검사는 어떻게 선택하나요?|건강검진과 진료는 어디서 확인하나요?', 'heart-index|ultrasound-index|endoscopy|conditions|cancer-support|checkups', '질환 설명과 모든 상황의 현장 치료 가능 여부를 구분'),
'heart-index': ('심장검사 안내', '여섯 심장검사의 목적과 담당 페이지를 연결', '검사 목적 요약|검사별 평가 대상 표|검사 안내 카드|의료진|긴급 증상 시 행동', '심장초음파와 홀터검사는 어떻게 다른가요?|검사 예약은 필요한가요?|어떤 증상은 일반 예약보다 긴급 평가가 필요한가요?', 'echocardiography|holter|carotid|hrv|abi|cardiac-markers|heart-disease|doctor-park-jongseol', '표가 자가진단·자가 검사 선택 도구처럼 읽히지 않도록 검수'),
'echocardiography': ('심장초음파 검사', '심장 구조·기능 평가와 영통탑 예약 절차 설명', '검사 목적|확인 범위·한계|검사 과정|준비·예약|결과 설명|검사 비교 안내', '무엇을 확인하는 검사인가요?|모든 심장질환을 알 수 있나요?|금식이나 예약이 필요한가요?', 'heart-index|holter|heart-test-differences|doctor-park-jongseol|visit', '경흉부·경식도·부하검사를 혼용하지 않음; 실제 시행 종류 확인'),
'holter': ('홀터검사', '생활 중 심전도 기록의 목적과 검사 중 증상 기록 설명', '검사 목적|실제 기록 시간·장비|착용과 일상생활|증상 기록|결과·한계|문의', '얼마 동안 착용하나요?|검사 중 증상을 어떻게 기록하나요?|검사 때 증상이 없으면 어떻게 하나요?', 'heart-index|palpitations-followup|echocardiography|visit', '24시간 등 구체적 장비 시간을 근거 없이 확정하지 않음'),
'carotid': ('경동맥 초음파', '경동맥 평가 범위를 설명하고 검사 한계를 구분', '경동맥과 검사 목적|대상·상담|검사 과정|준비|결과 해석의 한계', '어떤 혈관을 보는 검사인가요?|어떤 경우 상담하나요?|뇌졸중 위험을 확정할 수 있나요?', 'heart-index|abi|visit', '개인 위험 확률·예방 효과를 임의 수치화하지 않음'),
'hrv': ('심박 변이도 검사', '심박 변이도의 설명과 해석 범위를 분명히 함', '심박 변이도 설명|검사 목적|과정·조건|해석 범위|다른 심장검사와 구분', '무엇을 측정하나요?|스트레스나 질환을 확정하는 검사인가요?|홀터검사와 어떻게 다른가요?', 'heart-index|holter|visit', '원문 38번에 혼재한 심장초음파 복사 문장 제거; 진단 능력 과장 검수'),
'abi': ('동맥경화도 검사', '실제 검사 방식과 혈관 평가 지표의 의미를 안내', '측정 방식|평가 대상|준비·과정|지표 해석|한계·후속 상담', '무엇을 측정하나요?|경동맥 초음파와 다른가요?|결과만으로 진단할 수 있나요?', 'heart-index|carotid|visit', 'ABI·PWV·CAVI 중 실제 장비 지표 확인 후 표기'),
'cardiac-markers': ('심장 표지자 검사', '혈액 표지자 검사의 역할과 긴급 평가의 관계 설명', '검사 역할|실제 검사 항목|채혈·결과 절차|검사 시점과 한계|응급 안내', '어떤 항목을 검사하나요?|결과는 언제 설명받나요?|정상 수치면 심장질환이 배제되나요?', 'heart-index|heart-disease|notice-pathfast|visit', 'PATHFAST 도입 공지의 당일·분 단위 문구를 정확도나 응급 배제 보장으로 옮기지 않음'),
'checkups': ('건강검진 안내', '검진 목적에 따른 준비와 서류 페이지를 연결', '검진 종류|목적별 카드|예약 전 확인|준비 안내|결과·서류 문의', '국가검진과 채용검진은 어떻게 다른가요?|어떤 서류가 필요한가요?|금식은 어떻게 확인하나요?', 'national-checkup|employment-checkup|drug-screening|tuberculosis-screening|visa-checkup|cancer-screening|checkup-preparation', '모든 검진에 같은 금식·발급 시간을 일괄 적용하지 않음'),
'national-checkup': ('국가건강검진', '국가검진 대상 확인과 병원의 실제 검진 절차 안내', '대상 확인 방법|실제 검사 항목|예약·신분 확인|검사별 준비|결과 안내|추가 검사 구분', '검진 대상인지 어떻게 확인하나요?|무엇을 준비해야 하나요?|금식이 필요한가요?|결과는 어떻게 받나요?', 'checkups|cancer-screening|checkup-preparation|visit', '기존 연령·주기·지원 조건은 최신 공식 근거와 의료진 대조'),
'employment-checkup': ('채용검진·제출 서류', '제출기관 양식에 맞는 검사와 발급 조건 확인', '제출 목적 구분|양식·신분증|가능 항목|검사 준비|발급 절차·비용 조건', '회사 양식을 가져가야 하나요?|당일 발급이 가능한가요?|모든 면허·기관용 서류가 가능한가요?', 'checkups|drug-screening|tuberculosis-screening|visa-checkup|fees|visit', '공무원·선원·보건증 등 지정 요건을 일반 발급과 혼동하지 않음'),
'drug-screening': ('마약검사·영문서류', '검사 항목과 제출기관 요구를 대조하여 안내', '검사 목적|승인된 항목·버전|준비물·양식|검사·발급 절차|영문서류 조건|문의', '어떤 항목을 검사하나요?|영문 결과지 발급이 가능한가요?|검사와 발급은 당일 가능한가요?', 'checkups|employment-checkup|notice-drug-certificate|fees|visit', '33번과 최근 공지의 서로 다른 6종 목록 충돌 해결 전 항목 표 공개 금지'),
'tuberculosis-screening': ('기숙사 결핵검진', '기숙사 제출용 검사의 조건과 준비물 설명', '제출 목적|필요 서류|검사 종류|예약·준비|결과지·유효기간 문의', '기숙사 양식이 필요한가요?|어떤 결핵검사를 하나요?|결과지는 언제 발급되나요?', 'checkups|employment-checkup|fees|visit', '흉부 X선·잠복결핵검사를 임의로 같은 것으로 설명하지 않음'),
'visa-checkup': ('외국인 비자검진', '비자 유형과 제출기관별 확인 절차 안내', '가능한 검진 범위|비자·제출처 확인|신분증·서류|검사 준비|발급 절차', '어떤 비자 검진이 가능한가요?|여권이나 사진이 필요한가요?|영문서류도 가능한가요?', 'checkups|drug-screening|fees|visit', '국가·비자 유형별 지정기관 조건과 실제 시행 여부 확인'),
'ultrasound-index': ('초음파 검사 안내', '검사 부위별 목적과 준비 차이를 안내', '부위별 검사 카드|대상·한계|준비가 다른 이유|결과 문의', '복부와 갑상선 검사는 어떻게 다른가요?|금식이 필요한 검사는 무엇인가요?|심장초음파는 어디에서 확인하나요?', 'abdominal-ultrasound|thyroid-ultrasound|bowel-ultrasound|echocardiography|visit', '모든 부위 동일 금식 안내 금지'),
'abdominal-ultrasound': ('상·하복부 초음파', '상복부와 하복부의 평가 대상 및 준비 구분', '상하복부 구분|관찰 부위|예약·준비|검사 과정|결과와 한계', '어떤 장기를 보나요?|금식이나 소변 준비가 필요한가요?|검사 결과는 어떻게 설명받나요?', 'ultrasound-index|bowel-ultrasound|acute-care|visit', '구체적 금식 시간·방광 준비는 병원의 실제 지침 확인'),
'thyroid-ultrasound': ('갑상선 초음파', '갑상선 구조 평가와 추가 검사 판단의 구분', '검사 목적|대상|검사 과정|결과 설명|추가 검사와 한계', '어떤 경우 검사하나요?|갑상선 기능도 확인하나요?|결절이 있으면 모두 암인가요?', 'ultrasound-index|visit', '영상 소견만으로 기능·암 진단을 확정하는 표현 금지'),
'bowel-ultrasound': ('소장·대장·맹장 초음파', '장 초음파 평가 범위와 내시경 차이를 설명', '검사 목적|관찰 범위|준비·과정|영상 평가의 한계|내시경·응급 평가 구분', '내시경과 어떻게 다른가요?|맹장염을 확인할 수 있나요?|모든 장 질환을 배제하나요?', 'ultrasound-index|endoscopy|acute-care|visit', '초음파가 내시경을 항상 대체하거나 질환을 완전히 배제한다는 설명 금지'),
'conditions': ('내과 진료 안내', '증상·질환 정보에서 실제 진료와 긴급 평가를 구분', '진료 분야|증상별 안내 링크|검사 연결|위험 신호|방문 준비', '어떤 내과 질환을 상담하나요?|어떤 검사를 연결하나요?|긴급한 증상은 어떻게 해야 하나요?', 'chronic-cough|heart-disease|acute-care|cancer-support|services|visit', '20번의 만성기침 본문을 허브에서 전부 복제하지 않음'),
'chronic-cough': ('만성기침 진료', '기침 지속 시 평가 과정과 진료 준비 설명', '지속 기침 설명|상담 시 확인 정보|평가 과정|위험 신호|진료 준비', '기침이 계속되면 어떤 정보를 준비하나요?|원인은 어떻게 확인하나요?|어떤 증상은 빨리 평가받아야 하나요?', 'conditions|acute-care|visit', '기간 정의와 위험 신호 의료 검수; 온라인 자가진단 양식 제외'),
'heart-disease': ('심장질환 진료', '흉부 증상·두근거림 평가의 범위와 긴급 행동 설명', '진료 범위|확인할 증상 정보|검사 역할|긴급 행동|검사·의료진 연결', '두근거림은 어떻게 평가하나요?|어떤 심장검사가 있나요?|가슴 통증이 있을 때 예약을 기다려도 되나요?', 'conditions|heart-index|palpitations-followup|doctor-park-jongseol', '예약보다 즉시 평가가 필요한 문맥을 구분하며 CTA 의료 검수'),
'cancer-screening': ('암검진 안내', '암종별 국가검진 방법과 추가 검사를 구분', '암종별 안내|대상 확인|검사별 역할|준비|결과·추가 검사', '암종별 검사 방법은 어떻게 다른가요?|대장내시경이 모든 국가검진 대상에게 기본인가요?|대상과 주기는 어디서 확인하나요?', 'checkups|national-checkup|endoscopy|notice-screening-evaluation|visit', '일괄 조기진단·예방 효과 문구 대신 검진의 범위와 한계 확인'),
'acute-care': ('급성기질환 진료', '급성 증상 설명과 현장 진료·전원 가능 범위 구분', '진료 범위|증상별 상담|검사·평가|긴급 행동|타 기관 연계 범위', '어떤 급성 증상을 진료하나요?|검사 후 다른 병원으로 갈 수 있나요?|언제 응급 평가가 필요한가요?', 'conditions|bowel-ultrasound|abdominal-ultrasound|visit', '복막염 등 원문 질환 목록을 모두 원내 치료 가능하다는 뜻으로 옮기지 않음'),
'cancer-support': ('암환자 진료·케어 안내', '제공하는 지지 진료 범위와 주치료 관계 설명', '제공 범위|대상·상담|주치료와의 관계|근거·한계|준비·문의', '어떤 진료를 받을 수 있나요?|기존 항암치료와 어떻게 조율하나요?|치료 효과와 한계는 무엇인가요?', 'conditions|visit', '면역치료·케모포트·통증 관리의 실제 범위 확인; 근거 없는 생존·완치 효과 제외'),
'endoscopy': ('위·대장내시경 안내', '검사 부위·진정·준비 안내를 연결', '위·대장 검사 구분|진정 설명|검사별 안내|준비 안내|예약·결과 문의', '위와 대장내시경은 어떻게 다른가요?|진정 검사는 무엇인가요?|준비 안내는 어디서 확인하나요?', 'gastroscopy|colonoscopy|colonoscopy-preparation|cancer-screening|visit', '검진·증례·이벤트의 서비스 사실만 참고하고 정결제 복용법은 새로 검수'),
'notices': ('공지사항', '현재 유효한 운영 변경과 과거 기록 구분', '유효 공지|종료 공지 구분|분류|게시일·적용일|방문 안내', '현재 휴진 안내가 있나요?|검사나 서류 안내는 어디서 확인하나요?|과거 공지인지 어떻게 구분하나요?', 'visit|notice-screening-evaluation|notice-drug-certificate|notice-pathfast|notice-closure-20250624|notice-mammography', '게시일과 적용일 구분; 과거 공지를 현재 휴진에 합산하지 않음'),
'fees': ('비용·서류 발급 안내', '확인된 항목별 비용과 적용 조건 설명', '기준일|항목별 비용|포함·제외|기간·조건|서류 비용|문의', '검사 비용에 어떤 항목이 포함되나요?|수면비와 검사 총액은 다른가요?|서류 발급 비용은 얼마인가요?', 'checkups|endoscopy|visit', '이벤트 수면비를 상시 검사 총액으로 변환 금지; 미확정 가격은 숫자로 노출하지 않음'),
'health': ('검사·진료 이해하기', '반복 질문의 상세 설명을 탐색', '주제별 안내|질문과 설명 요약|의료 검수 정보|관련 서비스', '검사 차이는 어디서 확인하나요?|검진 전 준비는 어떻게 확인하나요?|글은 누가 검수하나요?', 'heart-test-differences|palpitations-followup|checkup-preparation|colonoscopy-preparation|content-policy', '질문 빈도 미검증 자료를 고빈도 통계처럼 표시하지 않음'),
'cases': ('진단 사례', '검수된 사례의 진단 과정과 해석 한계를 소개', '사례 이용 원칙|주제 필터|사례 카드|개별 결과 일반화 한계', '어떤 진단 과정이 소개되어 있나요?|사례와 내 증상을 같게 볼 수 있나요?|관련 검사는 어디서 확인하나요?', 'services|conditions|content-policy', '25개 원문은 전부 이관 후보; 재게시·비식별·의료 검수 통과분만 공개'),
'privacy': ('개인정보 처리 안내', '실제 사이트와 외부 서비스의 정보 처리 범위를 설명', '운영 주체|폼 수집 여부|호스팅·외부 링크|분석 도구 설정|문의·변경일', '사이트에서 개인정보를 입력하나요?|외부 지도 서비스로 이동하나요?|분석 도구를 사용하나요?', 'content-policy|visit', '백엔드가 없다는 이유로 호스팅 로그까지 수집이 전혀 없다고 단정하지 않음'),
'content-policy': ('의료정보 작성·검수 원칙', '출처·집필·검수·정정 책임을 공개', '작성 목적|집필자와 검수자|근거 관리|검토일 의미|사례 원칙|정정 문의', '의료정보는 누가 검수하나요?|오류를 발견하면 어떻게 알리나요?|개인 진료를 대신하나요?', 'doctors|health|visit', '실제로 없는 검수위원회·외부 인증 절차를 만들지 않음'),
'search': ('사이트 검색', '승인된 공개 문서의 제목·본문을 로컬 검색', '검색 입력|결과 수|제목·발췌|빈 결과|관련 허브', '원하는 검사 안내를 어떻게 찾나요?|검색어는 서버로 보내나요?', 'services|checkups|health|sitemap', '브라우저 내 검색; 원문 환자 사연·미공개 글·자유 검색어 분석 전송 없음'),
'not-found': ('페이지를 찾을 수 없습니다', '잘못된 경로에서 안전하게 복귀', '404 설명|홈·방문·검색 연결', '이전 주소의 정보를 어디서 찾나요?', 'home|visit|search|sitemap', '실제 HTTP 404 유지; SPA fallback으로 모든 URL 200 처리 금지'),
'sitemap': ('전체 페이지 안내', '사람이 읽을 수 있는 전체 공개 페이지 탐색', '병원·방문|진료·검사|검진|건강정보|공지·사례|정책', '전체 페이지는 어디서 보나요?', 'home|services|checkups|health|cases|notices', '게시 승인된 페이지만 표시; XML sitemap과 같은 공개 manifest 사용'),
'doctor-park-jongseol': ('박종설 대표원장', '현재 소개의 내과 전문의 경력과 담당 분야를 분리해 설명', '이름·사진|전문과목|경력|인증과 학회 소속|담당 진료|실제 집필·검수 글', '전문과목과 경력은 무엇인가요?|어떤 진료를 담당하나요?|진료 일정은 어디서 확인하나요?', 'doctors|heart-index|endoscopy|visit', '박종설 글의 실제 집필·검수 여부 확인; 자격과 학회 회원 구분'),
'doctor-park-rayoung': ('박라영 원장', '현재 소개의 가정의학과 전문의 경력과 담당 분야를 설명', '이름·실루엣 안내|전문과목|경력|인정의와 학회 소속|담당 진료|일정 문의', '전문과목과 경력은 무엇인가요?|어떤 진료를 담당하나요?|사진 대신 어떤 안내가 제공되나요?', 'doctors|checkups|visit', '기존 자료는 실루엣 이미지; 실제 얼굴 사진으로 표기하거나 새 얼굴 생성 금지'),
'gastroscopy': ('위내시경', '상부 소화관 검사와 실제 예약·준비 안내 연결', '검사 목적|진정 여부|준비 확인|과정·결과|조직검사와 추가 설명|문의', '어떤 부위를 확인하나요?|진정 검사가 가능한가요?|검사 전 무엇을 확인해야 하나요?', 'endoscopy|cancer-screening|checkup-preparation|visit', '약 중단·금식 시간·운전 안내는 실제 프로토콜과 의료 검수 후 작성'),
'colonoscopy': ('대장내시경', '대장 검사와 정결·결과·추가 처치의 관계 설명', '검사 목적|정결 준비 연결|진정 여부|과정·결과|용종 등 추가 처치 설명|문의', '어떤 경우 상담하나요?|정결 준비는 어디서 확인하나요?|용종이 있으면 어떻게 설명받나요?', 'endoscopy|colonoscopy-preparation|cancer-screening|visit', '조직검사·용종절제 가능 범위와 비용 분리; 개별 적응 판단을 온라인으로 확정하지 않음'),
'heart-test-differences': ('심전도·심장초음파·홀터검사의 차이', '검사 비교에 집중하고 실제 예약 안내는 서비스 페이지가 소유', '검사별 기록 대상|비교 표|검사 결과가 다른 이유|공통 한계|검사 페이지 연결', '심전도와 초음파 중 어느 것이 더 정확한가요?|홀터검사는 무엇이 다른가요?|정상 결과면 모든 질환이 배제되나요?', 'echocardiography|holter|heart-index|content-policy', '동일한 정확도 순위로 줄 세우지 않음; Q&A 답변 복사 금지'),
'palpitations-followup': ('검사 후에도 두근거림이 계속될 때 확인할 점', '증상 포착과 결과 설명의 한계를 이해하도록 도움', '질문의 범위|검사 중 증상 여부|기록해 갈 정보|진료에서 확인할 점|긴급 행동|관련 검사', '홀터검사 때 증상이 없었다면 어떻게 이해하나요?|진료 전 무엇을 기록하나요?|어떤 증상은 긴급 평가가 필요한가요?', 'holter|heart-disease|visit', '검사 없이 개인 부정맥을 진단하거나 안심시키는 문장 제외'),
'checkup-preparation': ('건강검진 전 준비 확인표', '검사 조합별 준비와 예약 확인의 책임을 구분', '검진 항목 확인|식사·음료 질문|복용약 상담|신분증·서류|당일 동선|문의 체크리스트', '모든 검진의 금식이 같나요?|복용약은 어떻게 확인하나요?|무엇을 가져가야 하나요?', 'national-checkup|employment-checkup|endoscopy|visit', '검사 시각·진정 조건 없는 단일 금식 시간표 금지; 약 중단 자동 안내 금지'),
'colonoscopy-preparation': ('대장내시경 준비 시 확인할 질문', '음식·음료·정결제·진정 조건별 병원 준비 지침을 설명', '검사 일정·진정 확인|음식과 음료 구분|정결제별 안내 연결|복용 어려움 문의|보호자·귀가|준비 확인', '물과 커피는 어떻게 확인하나요?|정결제를 다 먹기 어려우면 어떻게 하나요?|보호자와 귀가는 어떻게 준비하나요?', 'colonoscopy|endoscopy|checkup-preparation|visit', '정결제·시간별 복용표는 승인된 병원 지침 없으면 게시하지 않음; 외부 Q&A 인기도 미확인'),
}

NOTICE = {
'172420973': ('notice-screening-evaluation','screening-evaluation','국가검진기관 평가 안내','평가 부문·회차·기간|공식 증빙|의미와 범위|관련 검진','어떤 부문에 대한 평가인가요?|평가 기간과 근거는 무엇인가요?','national-checkup|cancer-screening','간암·위암 부문을 모든 검진 분야로 확대하지 않음'),
'172420773': ('notice-drug-certificate','drug-certificate','마약검사 영문서류 발급 안내','발급 목적|제출기관 양식|검사 항목 버전|발급 조건|검사 안내','영문서류는 어떤 조건에서 발급되나요?|제출기관 양식이 필요한가요?','drug-screening|employment-checkup','6종 목록 충돌 해결 후 검사 페이지 단일 원장 참조'),
'166166318': ('notice-pathfast','pathfast','심장 표지자 검사 장비 도입 안내','도입 사실|장비명|실제 운영 항목|검사 한계|관련 안내','어떤 장비를 도입했나요?|어떤 검사와 관련되나요?','cardiac-markers|heart-index','시간·정확도·심근경색 배제 단정 문구 검수'),
'165787604': ('notice-closure-20250624','closure-2025-06-24','2025년 6월 24일 오후 휴진 기록','종료 안내|당시 적용일·의료진|원래 공지|현재 진료 안내','현재도 적용되는 휴진인가요?','visit|notices','과거 공지로 보존; 현재 휴진과 XML sitemap에서 제외'),
'165253784': ('notice-mammography','mammography-equipment','디지털 유방촬영 장비 도입 안내','장비 도입|모델명|관련 검진|검사 안내','어떤 장비를 도입했나요?|어떤 검진에 사용하나요?','national-checkup|cancer-screening','장비 도입 사실과 진단 성능·검사 대상 판단을 구분'),
}

def readcsv(path):
    with path.open(encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))

def writecsv(path, rows):
    with path.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader(); w.writerows(rows)

def dump(name, obj):
    (OUT/name).write_text(json.dumps(obj, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

def split(s): return s.split('|') if s else []

def sourcekey(url):
    u = urlsplit(url); idx = parse_qs(u.query).get('idx')
    return 'post:'+idx[0] if idx else u.path.rstrip('/') or '/'

def main():
    inventory = json.loads((SRC/'data/page-inventory.json').read_text(encoding='utf-8-sig'))
    assets = readcsv(SRC/'data/asset-inventory.csv')
    posts = readcsv(SRC/'data/board-posts.csv')
    routes = readcsv(ROOT/'docs/route-map.csv')
    rows = [r for r in routes if '[slug]' not in r['new_path']]
    for rid,path,template in [
        ('doctor-park-jongseol','/doctors/park-jongseol/','physician-detail'),
        ('doctor-park-rayoung','/doctors/park-rayoung/','physician-detail'),
        ('gastroscopy','/services/endoscopy/gastroscopy/','service-detail'),
        ('colonoscopy','/services/endoscopy/colonoscopy/','service-detail'),
        ('heart-test-differences','/health/heart-test-differences/','article-detail'),
        ('palpitations-followup','/health/palpitations-test-followup/','article-detail'),
        ('checkup-preparation','/health/checkup-preparation-checklist/','article-detail'),
        ('colonoscopy-preparation','/health/colonoscopy-preparation-questions/','article-detail'),
        ('sitemap','/sitemap/','sitemap')]:
        rows.append(dict(route_id=rid,new_path=path,template=template,phase='P0' if template=='physician-detail' else 'P1',source_url='https://yttop.co.kr/48' if template=='physician-detail' else '',disposition='new',release_condition=D[rid][5]))
    for p in posts:
        if p['id'] in NOTICE:
            rid,slug,title,sections,qs,links,risk=NOTICE[p['id']]
            D[rid]=(title,'기존 공지의 사실과 적용 범위를 설명',sections,qs,links,risk)
            path='/notices/'+slug+'/'; template='notice-detail'
        else:
            rid='case-'+p['id']; path='/cases/'+rid+'/'; template='case-detail'
            t=p['title']
            if any(k in t for k in ['심','판막','대동맥']): links='heart-index|echocardiography|heart-disease'
            elif any(k in t for k in ['식도','위암','대장']): links='endoscopy|gastroscopy|colonoscopy'
            elif '갑상선' in t: links='thyroid-ultrasound|ultrasound-index'
            elif '폐렴' in t: links='acute-care|chronic-cough'
            else: links='abdominal-ultrasound|bowel-ultrasound|acute-care'
            D[rid]=(t+' — 진단 사례','사례별 진단 과정의 관찰과 일반화 한계를 설명',
                '원문 사례 요약|진단 과정의 순서|사용 검사와 판단 근거|원문 결과 범위|이 사례의 한계|관련 진료 안내',
                '이 사례에서는 무엇을 확인했나요?|어떤 검사와 진단 과정이 소개되나요?|내 증상도 같은 질환이라는 뜻인가요?',
                links+'|cases|content-policy','원문 관리자 표기를 의료 저자로 옮기지 않음; 환자 사연·검사 이미지 비식별과 이용 범위·응급 문맥 개별 확인')
        rows.append(dict(route_id=rid,new_path=path,template=template,phase='P2' if template=='case-detail' else 'P0',source_url=p['url'],disposition='select',release_condition=D[rid][5],post=p))
    extra_sources={
        'home':['/42','/43','/48','/16'], 'about':['/41','/48'], 'visit':['/43'],
        'services':['/18','/24','/20','/47'], 'endoscopy':['/','/30','/31'],
        'gastroscopy':['/30','/31'], 'colonoscopy':['/30','/31'],
        'heart-test-differences':['/23','/36'], 'palpitations-followup':['/36','/29'],
        'checkup-preparation':['/31','/32'], 'colonoscopy-preparation':['/30','/31'],
        'fees':['/'], 'privacy':['/'], 'content-policy':['/48'],
        'health':['/23','/36','/31'], 'sitemap':['/'], 'search':['/'],
    }
    selected = {
        'home':['assets/988305921ed3aadb.png','assets/2d2fd518e1de33ef.jpg'],
        'about':['assets/988305921ed3aadb.png'],
        'doctor-park-jongseol':['assets/2d2fd518e1de33ef.jpg'],
        'doctor-park-rayoung':['assets/42d82d647291539a.jpg'],
        'doctors':['assets/2d2fd518e1de33ef.jpg','assets/42d82d647291539a.jpg'],
        'visit':['assets/988305921ed3aadb.png'],
    }
    pages=[]; asset_matches=[]
    paths={r['route_id']:r['new_path'] for r in rows}
    for r in rows:
        rid=r['route_id']; title,intent,sections,qs,links,risk=D[rid]
        source_urls=([r['source_url']] if r['source_url'] else [])+['https://yttop.co.kr'+x for x in extra_sources.get(rid,[])]
        keys={sourcekey(u) for u in source_urls}
        docs=list(dict.fromkeys('research/2026-09-11-yttop/'+p['document'] for p in inventory if p['url'] in source_urls))
        if r.get('post'):
            docs=['research/2026-09-11-yttop/'+r['post']['document']]
        candidates=[]
        for a in assets:
            if not a['file'] or a['status']!='200': continue
            used=a['pages'].split(' | ')
            match=bool(keys & {sourcekey(u) for u in used})
            # Shared site chrome is accounted for separately, not a content image for every page.
            if match and len(used)<35:
                candidates.append(a['file'])
                asset_matches.append(dict(page_id=rid,source_file='research/2026-09-11-yttop/evidence/'+a['file'],source_url=a['url'],width=a['width'],height=a['height'],ocr_file='research/2026-09-11-yttop/evidence/'+a['ocr_file'],status='candidate_not_visually_approved'))
        for f in selected.get(rid,[]):
            if f not in candidates: candidates.insert(0,f)
        template=r['template']
        clinical=template in ['service-detail','condition-detail','checkup-detail','article-detail','case-detail','service-hub']
        schema='MedicalWebPage' if clinical else ('ProfilePage + Person' if template=='physician-detail' else ('CollectionPage' if template.endswith('index') or template in ['sitemap','search'] else 'WebPage'))
        questions=split(qs)
        urgent = rid in ['heart-disease','acute-care','cardiac-markers','palpitations-followup'] or (template=='case-detail' and any(k in title for k in ['심근경색','뇌경색','심실빈맥','복막염','맹장염']))
        pages.append(dict(
            id=rid,path=r['new_path'],title=title,meta_title=title+' | 영통탑내과' if rid!='home' else '영통탑내과 | 진료·검사·건강검진·방문 안내',
            meta_description=('영통탑내과의 진료·검사·건강검진과 의료진을 소개합니다. 진료시간·위치·검사 예약 안내를 확인하세요.' if rid=='home' else '영통탑내과의 '+title+' 안내입니다. '+', '.join(split(sections)[:3])+' 관련 정보를 확인하세요.'),
            template=template,phase=r['phase'],build_status='planned',publication_status='pending',
            intent=intent,source_urls=source_urls,source_documents=docs,
            content_file='content/pages/'+rid+'.json',body_file='content/bodies/'+rid+'.md',
            component_family={'service-detail':'ServiceDetail','checkup-detail':'CheckupDetail','condition-detail':'ConditionDetail','article-detail':'ArticleDetail','case-detail':'CaseDetail','notice-detail':'NoticeDetail','physician-detail':'PhysicianDetail'}.get(template,'PageRenderer'),
            h1=title,ordered_sections=split(sections),question_outlines=questions,
            answer_contract='각 질문은 자체 원고로 답변·적용 조건·한계·다음 행동을 함께 작성. 원문 근거가 없는 의료 판단·운영값은 생성하지 않음.',
            schema=schema+' + BreadcrumbList (home 제외) + clinic reference',
            related_page_ids=split(links),related_paths=[paths[x] for x in split(links)],
            primary_action='현재 유사한 긴급 증상에 대한 행동 우선·일반 문의 분리' if urgent else ('관련 진료 안내' if template in ['case-detail','article-detail'] else '전화 문의·오시는 길'),
            risk='urgent_context_review' if urgent else ('medical' if clinical else 'operational'),
            image_candidates=candidates,visually_checked_preferred_images=selected.get(rid,[]),
            image_rule='기존 사이트 원본만 사용. 의료·검사·본문 이미지는 육안 대조 후 선택. 적합한 이미지가 없으면 텍스트 구성; 새 사진 생성 금지.',
            special_review=risk,medical_review_required=clinical or template in ['physician-detail','notice-detail'],
            sitemap_candidate=rid not in ['search','not-found','notice-closure-20250624'],
            seo_ownership='이 페이지가 담당하는 의도를 본문으로 설명; 관련 페이지에서는 짧은 요약과 링크만 제공',
            acceptance=['원본 HTML에 제목·전체 본문·근거 링크 존재','본 페이지 원문·새 원고의 사실 대조','관련 페이지 연결과 실제 주소 직접 접근','schema와 보이는 사실 동일','미승인 이미지·수치·작성자 공개 없음'],
            source_published_at=r.get('post',{}).get('date_published_schema'),
            source_modified_at=r.get('post',{}).get('date_modified_schema'),
        ))
    pages.sort(key=lambda p:p['path'])
    dump('page-plans.json',pages)
    writecsv(OUT/'page-matrix.csv',[dict(id=p['id'],path=p['path'],title=p['title'],template=p['template'],phase=p['phase'],source_urls=' | '.join(p['source_urls']),source_documents=' | '.join(p['source_documents']),schema=p['schema'],related_paths=' | '.join(p['related_paths']),sitemap_candidate=p['sitemap_candidate'],publication_status=p['publication_status']) for p in pages])
    writecsv(OUT/'page-asset-candidates.csv',asset_matches)
    # Every discovered old URL receives a documented decision; this does not implement redirects.
    legacy=[]
    post_paths={r['post']['id']:r['new_path'] for r in rows if r.get('post')}
    base_paths={urlsplit(r['source_url']).path.rstrip('/') or '/':r['new_path'] for r in rows if r['source_url'] and '?' not in r['source_url'] and r['route_id'] not in ['doctor-park-jongseol','doctor-park-rayoung']}
    base_paths.update({'/':'/','/home':'/','/MAIN2':'/','/41':'/about/','/43':'/visit/'})
    for old in inventory:
        u=urlsplit(old['url']); q=parse_qs(u.query); key=u.path.rstrip('/') or '/'
        target=post_paths.get(q.get('idx',[''])[0]) if 'idx' in q else base_paths.get(key)
        action='map_after_target_approved' if target else 'retire_no_replacement'
        if 'page' in q and target: action='merge_pagination_into_static_index'
        legacy.append(dict(old_url=old['url'],new_path=target or '',decision=action,redirect_execution='not_implemented_requires_old_host',old_document='research/2026-09-11-yttop/'+old['document']))
    writecsv(OUT/'legacy-url-map.csv',legacy)
    # Candidate sitemap, NOT a sitemap that may be submitted or deployed without approval filtering.
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    xml=ET.Element('{http://www.sitemaps.org/schemas/sitemap/0.9}urlset')
    xml.append(ET.Comment(' DEVELOPMENT PLAN ONLY: candidates pending approval; not a live sitemap. No invented lastmod. '))
    for p in pages:
        if p['sitemap_candidate']:
            item=ET.SubElement(xml,'{http://www.sitemaps.org/schemas/sitemap/0.9}url')
            ET.SubElement(item,'{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text=ORIGIN+BASE+p['path']
    ET.indent(xml)
    ET.ElementTree(xml).write(OUT/'planned-sitemap.xml',encoding='utf-8',xml_declaration=True)
    lines=['# 페이지별 상세 개발 계획','','이 문서는 `build_plan.py`의 편집 계획과 기존 수집 원장에서 생성했다. **모든 페이지는 개발 예정·게시 미승인**이다. title·description은 원고 초안이고, 질문은 집필 과제이며 완성된 의료 답변이 아니다.','','전체 규칙·컴포넌트·배포는 [실행 계획](execution-plan.ko.md), 이미지 사용 원칙은 [이미지 계획](assets.ko.md)을 따른다.','']
    for p in pages:
        lines += [f'## {p["id"]} — {p["title"]}','',f'- 경로: `{p["path"]}` · 템플릿: `{p["template"]}` · 순서: {p["phase"]}',f'- 목적: {p["intent"]}',f'- title 초안: {p["meta_title"]}',f'- description 초안: {p["meta_description"]}',f'- 입력: `{p["content_file"]}` + `{p["body_file"]}`',f'- 구조화 데이터: {p["schema"]}',f'- 공개 XML 후보: {"예 — 검수 후 포함" if p["sitemap_candidate"] else "아니오"}','', '**원문·이미지**','']
        for u in p['source_urls']: lines.append(f'- [기존 페이지]({u})')
        for d in p['source_documents']: lines.append(f'- [수집 원문]({"../../"+d})')
        if not p['source_urls']: lines.append('- 공통 승인 원장과 공개 route manifest에서 생성. 병원 사실 신규 추정 없음.')
        preferred=p['visually_checked_preferred_images'] or p['image_candidates'][:3]
        for f in preferred: lines.append(f'- [이미지 {Path(f).name}](../../research/2026-09-11-yttop/evidence/{f}) — {"육안 대조한 사용 후보" if f in p["visually_checked_preferred_images"] else "연결 관계로 찾은 후보; 육안 검수 필요"}')
        lines += ['','**본문 순서**','']+[f'{i}. {s}' for i,s in enumerate(p['ordered_sections'],1)]
        lines += ['','**답변을 작성할 질문**','']+[f'- {q}' for q in p['question_outlines']]
        lines += ['',p['answer_contract'],'',f'**개별 검수:** {p["special_review"]}','',f'**내부 링크:** {" · ".join("`"+x+"`" for x in p["related_paths"])}','',f'**주요 행동:** {p["primary_action"]}','', '**완료 검사:** '+ '; '.join(p['acceptance'])+'.','']
        if p['source_published_at']: lines += [f'원본 게시 메타: `{p["source_published_at"]}`. 새 의학 검토일로 복사하지 않는다.','']
    (OUT/'page-details.ko.md').write_text('\n'.join(lines),encoding='utf-8')
    sitemap_lines=['# 전체 사이트맵과 공개 경로 규칙','','총 76개 구현 후보. 상세 데이터는 [페이지 행렬](page-matrix.csv), [페이지별 명세](page-details.ko.md)에 있다. 아래 트리는 실제 경로이며 개발 순서와 공개 승인은 별개다.','','## 전체 경로','','```text']
    for p in pages:
        depth=len([s for s in p['path'].split('/') if s])
        sitemap_lines.append('  '*depth+p['path']+'  '+p['title'])
    sitemap_lines += ['```','','## XML sitemap 생성 계약','',
      '- [planned-sitemap.xml](planned-sitemap.xml)은 계획 검토용 73개 후보 URL이다. 운영 sitemap으로 제출하거나 그대로 배포하지 않는다.',
      '- 운영 `sitemap.xml`은 게시 승인·유효 검수·indexable·대표 경로 조건을 모두 충족한 public manifest에서 빌드 시 생성한다. 현재 승인된 운영 페이지는 0개다.',
      '- 검색 `/search/`, 오류 `/404.html`, 종료된 2025년 휴진 기록은 XML에서 제외한다. 검색과 종료 공지는 화면 제공 시 noindex, 404는 실제 HTTP 404와 noindex를 사용한다.',
      '- 검수 대기 페이지는 HTML·내부 링크·검색 색인·사이트맵에서 모두 제외한다. 공개 필요 페이지가 누락되면 release 검사 실패로 처리한다.',
      '- 프로젝트 환경의 URL은 `https://codepump-net.github.io/yt-top-webforai`에 경로를 정확히 한 번 붙인다. 최종 운영 도메인을 바꾸면 canonical·schema·사이트맵을 함께 재빌드한다.',
      '- `<lastmod>`는 실질적 공개 본문 변경일이 확인된 경우에만 넣는다. 원본 게시일·빌드 시각·의학 검수일과 혼동하지 않는다. 의미 없는 changefreq·priority는 생략한다.',
      '- 초기 공개 검토 모드 `SITE_INDEXING_ENABLED=false`에서는 meta noindex를 사용하고 XML sitemap을 생성·광고·제출하지 않는다. 사람용 `/sitemap/`은 탐색 목적으로 유지할 수 있다.',
      '- `/yt-top-webforai/robots.txt`는 origin 루트 robots를 대신하지 못한다. 원격 루트 정책을 따로 확인하며 프로젝트 하위 sitemap은 도구에 정확한 URL로 제출한다.',
      '- `/sitemap/` 화면은 공개된 페이지를 병원·진료·검진·건강정보·사례·공지·정책으로 나눈다. XML 제외된 공개 보관 공지는 종료 표시와 함께 탐색할 수 있다.',
      '- sitemap URL 전체 HTTP·canonical 일치, 중복·미승인·404·noindex URL 포함 여부를 CI와 실제 배포에서 모두 검사한다. 색인이나 AI 인용은 별도 관측한다.','',
      '## 기존 주소 이관','',
      '[legacy-url-map.csv](legacy-url-map.csv)는 발견된 145개 URL을 빠짐없이 분류한다. 게시물은 `idx`를 먼저 판정해 홈·게시판의 같은 글을 같은 새 경로로 합친다. 페이지네이션은 해당 목록으로 통합한다. `/49`는 대체 본문이 없는 푸터 중심 페이지이므로 폐기 후보다. 이관 대상 공개 확인 후 기존 호스팅에서 301/308 또는 필요한 404/410을 설정한다. Pages 파일만으로 기존 도메인의 HTTP 상태를 변경할 수 없다.','']
    (OUT/'sitemap.ko.md').write_text('\n'.join(sitemap_lines),encoding='utf-8')
    summary=dict(planned_pages=len(pages),phase_counts=dict(Counter(p['phase'] for p in pages)),case_pages=sum(p['template']=='case-detail' for p in pages),notice_pages=sum(p['template']=='notice-detail' for p in pages),sitemap_candidate_urls=sum(p['sitemap_candidate'] for p in pages),approved_publication_pages=0,legacy_urls=len(legacy),legacy_unmapped=[x['old_url'] for x in legacy if not x['new_path']],asset_page_associations=len(asset_matches),application_implemented=False,deployed=False)
    dump('plan-summary.json',summary)
    print(json.dumps(summary,ensure_ascii=False,indent=2))

if __name__=='__main__': main()
