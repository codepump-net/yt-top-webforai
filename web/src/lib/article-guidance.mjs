// Patient-facing shared notices. Application follows the article's subject, not its display label.
export function articleGuidance(page) {
  const medical =
    /^\/(?:conditions|services|health|diseases|checkups)\//.test(page.path) ||
    ['symptoms', 'diseases', 'preparation'].includes(page.id) ||
    !!page.translationOf;
  const documents = page.path.includes('/checkups/') || page.id === 'fees';
  const heart =
    page.path.startsWith('/diseases/cardio/') ||
    page.path.startsWith('/services/heart/') ||
    [
      'heart-disease',
      'heart-test-differences',
      'palpitations-followup',
      'angina-treatment',
      'heart-valve-regurgitation',
    ].includes(page.id);
  return {
    enabled: medical || documents,
    medical,
    documents,
    heart,
    clinic: !page.blocks.some((b) => b.id === 'visit'),
  };
}

export const guidanceLabels = {
  ko: {
    title: '진료·검사 전 확인하세요',
    safety:
      '이 글은 일반적인 건강정보를 제공하기 위한 것으로 개인의 진단이나 처방을 대신하지 않습니다. 증상과 검사 필요성은 환자마다 다릅니다. 지속되는 흉통, 심한 호흡곤란, 의식 변화, 실신, 많은 출혈, 갑자기 시작된 극심한 복통 등 응급증상이 있으면 외래 예약을 기다리지 말고 119 또는 응급실 진료를 우선하십시오.',
    reservationTitle: '심장검사 예약',
    reservation:
      '심장초음파와 홀터검사 등은 전화 예약을 받고 있습니다. 당일 취소 또는 사전 연락 없는 미방문 시 이후 전화 재예약이 제한될 수 있습니다. 다시 진료를 희망하는 경우 희망일에 직접 내원해 대기 후 상담과 진료를 받을 수 있습니다.',
    documentsTitle: '제출용 서류 준비',
    documents:
      '제출용 서류가 필요한 경우 신분증과 제출기관의 최신 원본 양식을 준비하십시오. 기관마다 양식과 검사 항목이 다르므로 방문 전 병원으로 검사 가능 여부와 발급기간을 확인하십시오. 제3자 수령 시 필요한 위임·신분확인 서류는 신청인의 관계와 환자 상태에 따라 달라질 수 있으므로 사전에 문의하십시오.',
    clinicTitle: '병원 위치·진료시간·주차',
  },
  en: {
    title: 'Before your visit',
    safety:
      'This is general health information and does not replace an individual diagnosis or prescription. Symptoms and the need for tests vary. For persistent chest pain, severe difficulty breathing, altered consciousness, fainting, heavy bleeding or sudden severe abdominal pain, call 119 or go to an emergency department instead of waiting for an outpatient appointment.',
    documentsTitle: 'Documents for submission',
    documents:
      'Bring identification and the receiving institution’s latest original form. Requirements vary, so contact the clinic before visiting to confirm available tests and when the certificate can be issued. If someone else will collect it, ask in advance about authorization and identification documents; these depend on the person’s relationship to the patient and the patient’s condition.',
  },
  'zh-Hans': {
    title: '就诊前请确认',
    safety:
      '本文提供一般健康信息，不能代替个人诊断或处方。每位患者的症状和检查需求不同。如持续胸痛、严重呼吸困难、意识改变、晕厥、大量出血或突发剧烈腹痛，请优先拨打119或前往急诊，不要等待门诊预约。',
    documentsTitle: '提交材料的准备',
    documents:
      '请携带身份证明和接收机构最新的原始表格。各机构要求的表格和检查项目不同，请就诊前联系诊所，确认可做的检查和出具证明所需时间。如由他人代领，所需委托和身份核实材料可能因代领人与患者的关系及患者状况而异，请提前咨询。',
  },
  th: {
    title: 'ตรวจสอบก่อนเข้ารับบริการ',
    safety:
      'ข้อมูลนี้เป็นความรู้สุขภาพทั่วไป ไม่ใช้แทนการวินิจฉัยหรือใบสั่งยารายบุคคล อาการและความจำเป็นในการตรวจแตกต่างกัน หากเจ็บหน้าอกต่อเนื่อง หายใจลำบากรุนแรง ระดับความรู้สึกตัวเปลี่ยนไป เป็นลม เลือดออกมาก หรือปวดท้องรุนแรงฉับพลัน ให้โทร 119 หรือไปห้องฉุกเฉินโดยไม่รอนัดผู้ป่วยนอก',
    documentsTitle: 'เอกสารสำหรับยื่น',
    documents:
      'นำเอกสารยืนยันตัวตนและแบบฟอร์มต้นฉบับฉบับล่าสุดของหน่วยงานที่รับเอกสารมาด้วย ข้อกำหนดและรายการตรวจต่างกัน โปรดติดต่อคลินิกก่อนมาเพื่อยืนยันการตรวจที่ให้บริการและระยะเวลาออกเอกสาร หากให้ผู้อื่นรับแทน โปรดสอบถามล่วงหน้าเรื่องหนังสือมอบอำนาจและเอกสารยืนยันตัวตน ซึ่งอาจต่างกันตามความสัมพันธ์กับผู้ป่วยและสภาพของผู้ป่วย',
  },
  ru: {
    title: 'Перед посещением',
    safety:
      'Это общая информация о здоровье, которая не заменяет индивидуальный диагноз или назначение лечения. Симптомы и необходимость обследований различаются. При непрекращающейся боли в груди, выраженной одышке, изменении сознания, обмороке, сильном кровотечении или внезапной сильной боли в животе звоните 119 или обращайтесь в отделение неотложной помощи, не ожидая приёма в поликлинике.',
    documentsTitle: 'Документы для предоставления',
    documents:
      'Возьмите удостоверение личности и актуальный оригинальный бланк принимающей организации. Требования и перечень обследований различаются: заранее уточните в клинике возможность проведения анализов и срок выдачи справки. Если документы получает другой человек, заранее узнайте, какие доверенности и удостоверения личности нужны: требования могут зависеть от его отношения к пациенту и состояния пациента.',
  },
  ne: {
    title: 'क्लिनिक आउनुअघि ध्यान दिनुहोस्',
    safety:
      'यो सामान्य स्वास्थ्य जानकारी हो र यसले व्यक्तिगत निदान वा औषधिको सिफारिसलाई प्रतिस्थापन गर्दैन। लक्षण र परीक्षणको आवश्यकता व्यक्तिअनुसार फरक हुन्छ। लगातार छाती दुखेमा, सास फेर्न धेरै गाह्रो भएमा, चेतनामा परिवर्तन आएमा, बेहोस भएमा, धेरै रगत बगेमा वा अचानक पेट असाध्यै दुखेमा बाह्यरोगी भेटको पालो नपर्खी 119 मा फोन गर्नुहोस् वा आकस्मिक कक्षमा जानुहोस्।',
    documentsTitle: 'बुझाउने कागजातको तयारी',
    documents:
      'परिचयपत्र र कागजात लिने संस्थाको पछिल्लो मूल फाराम ल्याउनुहोस्। संस्था अनुसार फाराम र परीक्षण फरक हुने भएकाले आउनुअघि क्लिनिकमा उपलब्ध परीक्षण र प्रमाणपत्र जारी हुने समय पुष्टि गर्नुहोस्। अरू व्यक्तिले कागजात लिने भएमा अधिकारपत्र र परिचय खुल्ने कागजातबारे पहिले सोध्नुहोस्। आवश्यक कागजात बिरामीसँगको सम्बन्ध र बिरामीको अवस्थाअनुसार फरक हुन सक्छन्।',
  },
};
