import type { ModelCode, ModelInfo, BomPart, Supplier, MasterPart, ContractOrder } from '../types/scm'

// 4대 표준 모델 마스터 정보
export const MODELS_INFO: ModelInfo[] = [
  {
    code: 'TAPI-9270J',
    name: '무인민원발급기 TAPI-9270J',
    identifier: '24292471',
    dimensions: '폭770 x 깊이810 x 높이1540 (mm)',
    displaySize: '27인치 TFT Color LCD',
    touchType: 'IR(적외선) 터치',
    isBarrierFree: true,
    description: '시·청각장애인용 편의제공(촉각모니터 20Cell + 음성유도기 탑재) 27인치 모델'
  },
  {
    code: 'TAPI-9270T',
    name: '무인민원발급기 TAPI-9270T',
    identifier: '24292472',
    dimensions: '폭770 x 깊이810 x 높이1540 (mm)',
    displaySize: '27인치 TFT Color LCD',
    touchType: 'IR(적외선) 터치',
    isBarrierFree: false,
    description: '일반/장애인 겸용 표준 27인치 실속형 모델 (촉각모니터/음성유도기 제외)'
  },
  {
    code: 'TAPI-9320J',
    name: '무인민원발급기 TAPI-9320J',
    identifier: '24292469',
    dimensions: '폭824 x 깊이865 x 높이1652 (mm)',
    displaySize: '32인치 TFT Color LCD',
    touchType: '정전식 터치',
    isBarrierFree: true,
    description: '대화면 32인치 프리미엄 시·청각장애인용(촉각모니터 + 음성유도기 탑재) 고성능 모델'
  },
  {
    code: 'TAPI-9320T',
    name: '무인민원발급기 TAPI-9320T',
    identifier: '24292470',
    dimensions: '폭824 x 깊이865 x 높이1652 (mm)',
    displaySize: '32인치 TFT Color LCD',
    touchType: '정전식 터치',
    isBarrierFree: false,
    description: '대화면 32인치 정전식 터치 겸용 표준형 모델 (촉각모니터/음성유도기 제외)'
  }
]

// 모델별 정확한 BOM 명세 (한국타피 규격서 3.1항 기준)
export const MODEL_BOM: Record<ModelCode, BomPart[]> = {
  "TAPI-9270J": [
    {
      "no": 1,
      "name": "본체(PC)",
      "spec": "Intel i5 10400 2.9GHz이상 / RAM 8GB(DDR4) / SSD 256GB, HDD 500GB",
      "qty": 1,
      "note": ""
    },
    {
      "no": 2,
      "name": "운영체제",
      "spec": "MS Windows OS",
      "qty": 1,
      "note": ""
    },
    {
      "no": 3,
      "name": "모니터",
      "spec": "TFT Color LCD 27 inch",
      "qty": 1,
      "note": ""
    },
    {
      "no": 4,
      "name": "터치",
      "spec": "IR(적외선)터치방식",
      "qty": 1,
      "note": ""
    },
    {
      "no": 5,
      "name": "복합편철기",
      "spec": "배출/간추림/편철",
      "qty": 1,
      "note": ""
    },
    {
      "no": 6,
      "name": "출력프린터",
      "spec": "A4 / 61PPM / 1200 * 1200 dpi",
      "qty": 1,
      "note": ""
    },
    {
      "no": 7,
      "name": "무정전전원장치",
      "spec": "3.0 kVA",
      "qty": 1,
      "note": ""
    },
    {
      "no": 8,
      "name": "수수료정산장치",
      "spec": "코인/지폐 투입및배출제어",
      "qty": 1,
      "note": ""
    },
    {
      "no": 9,
      "name": "코인호퍼",
      "spec": "50원/100원/500원",
      "qty": 3,
      "note": ""
    },
    {
      "no": 10,
      "name": "지폐인식기",
      "spec": "(신권)1000원/5000원/10000원",
      "qty": 1,
      "note": ""
    },
    {
      "no": 11,
      "name": "지문스캐너",
      "spec": "광학식 / 500dpi",
      "qty": 1,
      "note": ""
    },
    {
      "no": 12,
      "name": "감시카메라",
      "spec": "CMOS 500만화소 (HDD 500GB에 저장)",
      "qty": 2,
      "note": ""
    },
    {
      "no": 13,
      "name": "장애인용 점자 키패드",
      "spec": "22 Key, PS/2",
      "qty": 1,
      "note": ""
    },
    {
      "no": 14,
      "name": "촉각(점자)모니터",
      "spec": "20Cell",
      "qty": 1,
      "note": ""
    },
    {
      "no": 15,
      "name": "QR리더기",
      "spec": "image Sensor 800x800 CMOS",
      "qty": 1,
      "note": ""
    },
    {
      "no": 16,
      "name": "음성유도기",
      "spec": "KW-1510A",
      "qty": 1,
      "note": ""
    },
    {
      "no": 17,
      "name": "영수증프린터",
      "spec": "200DPI/2inch/열전사방식",
      "qty": 1,
      "note": ""
    },
    {
      "no": 18,
      "name": "시군구 로그 홍보용 LED조명판",
      "spec": "가로320*세로420 (mm) / LED램프, 소비전력2W",
      "qty": 1,
      "note": ""
    },
    {
      "no": 19,
      "name": "통합보드",
      "spec": "유도안내LED램프/도어감지센서/워치독",
      "qty": 1,
      "note": ""
    },
    {
      "no": 20,
      "name": "함체(외함)",
      "spec": "철판 및 기타재료",
      "qty": 1,
      "note": ""
    }
  ],
  "TAPI-9270T": [
    {
      "no": 1,
      "name": "본체(PC)",
      "spec": "Intel i5 10400 2.9GHz이상 / RAM 8GB(DDR4) / SSD 256GB, HDD 500GB",
      "qty": 1,
      "note": ""
    },
    {
      "no": 2,
      "name": "운영체제",
      "spec": "MS Windows OS",
      "qty": 1,
      "note": ""
    },
    {
      "no": 3,
      "name": "모니터",
      "spec": "TFT Color LCD 27 inch",
      "qty": 1,
      "note": ""
    },
    {
      "no": 4,
      "name": "터치",
      "spec": "IR(적외선)터치방식",
      "qty": 1,
      "note": ""
    },
    {
      "no": 5,
      "name": "복합편철기",
      "spec": "배출/간추림/편철",
      "qty": 1,
      "note": ""
    },
    {
      "no": 6,
      "name": "출력프린터",
      "spec": "A4 / 61PPM / 1200 * 1200 dpi",
      "qty": 1,
      "note": ""
    },
    {
      "no": 7,
      "name": "무정전전원장치",
      "spec": "3.0 kVA",
      "qty": 1,
      "note": ""
    },
    {
      "no": 8,
      "name": "수수료정산장치",
      "spec": "코인/지폐 투입및배출제어",
      "qty": 1,
      "note": ""
    },
    {
      "no": 9,
      "name": "코인호퍼",
      "spec": "50원/100원/500원",
      "qty": 3,
      "note": ""
    },
    {
      "no": 10,
      "name": "지폐인식기",
      "spec": "(신권)1000원/5000원/10000원",
      "qty": 1,
      "note": ""
    },
    {
      "no": 11,
      "name": "지문스캐너",
      "spec": "광학식 / 500dpi",
      "qty": 1,
      "note": ""
    },
    {
      "no": 12,
      "name": "감시카메라",
      "spec": "CMOS 500만화소 (HDD 500GB에 저장)",
      "qty": 2,
      "note": ""
    },
    {
      "no": 13,
      "name": "장애인용 점자 키패드",
      "spec": "22 Key, PS/2",
      "qty": 1,
      "note": ""
    },
    {
      "no": 14,
      "name": "QR리더기",
      "spec": "image Sensor 800x800 CMOS",
      "qty": 1,
      "note": ""
    },
    {
      "no": 15,
      "name": "영수증프린터",
      "spec": "200DPI/2inch/열전사방식",
      "qty": 1,
      "note": ""
    },
    {
      "no": 16,
      "name": "시군구 로그 홍보용 LED조명판",
      "spec": "가로320*세로420 (mm) / LED램프, 소비전력2W",
      "qty": 1,
      "note": ""
    },
    {
      "no": 17,
      "name": "통합보드",
      "spec": "유도안내LED램프/도어감지센서/워치독",
      "qty": 1,
      "note": ""
    },
    {
      "no": 18,
      "name": "함체(외함)",
      "spec": "철판 및 기타재료",
      "qty": 1,
      "note": ""
    }
  ],
  "TAPI-9320J": [
    {
      "no": 1,
      "name": "본체(PC)",
      "spec": "Intel i5 10400 2.9GHz이상 / RAM 8GB(DDR4) / SSD 256GB, HDD 500GB",
      "qty": 1,
      "note": ""
    },
    {
      "no": 2,
      "name": "운영체제",
      "spec": "MS Windows OS",
      "qty": 1,
      "note": ""
    },
    {
      "no": 3,
      "name": "모니터",
      "spec": "TFT Color LCD 32 inch",
      "qty": 1,
      "note": ""
    },
    {
      "no": 4,
      "name": "터치",
      "spec": "전정식터치방식",
      "qty": 1,
      "note": ""
    },
    {
      "no": 5,
      "name": "복합편철기",
      "spec": "배출/간추림/편철",
      "qty": 1,
      "note": ""
    },
    {
      "no": 6,
      "name": "출력프린터",
      "spec": "A4 / 61PPM / 1200 * 1200 dpi",
      "qty": 1,
      "note": ""
    },
    {
      "no": 7,
      "name": "무정전전원장치",
      "spec": "3.0 kVA",
      "qty": 1,
      "note": ""
    },
    {
      "no": 8,
      "name": "수수료정산장치",
      "spec": "코인/지폐 투입및배출제어",
      "qty": 1,
      "note": ""
    },
    {
      "no": 9,
      "name": "코인호퍼",
      "spec": "50원/100원/500원",
      "qty": 3,
      "note": ""
    },
    {
      "no": 10,
      "name": "지폐인식기",
      "spec": "(신권)1000원/5000원/10000원",
      "qty": 1,
      "note": ""
    },
    {
      "no": 11,
      "name": "지문스캐너",
      "spec": "광학식 / 500dpi",
      "qty": 1,
      "note": ""
    },
    {
      "no": 12,
      "name": "감시카메라",
      "spec": "CMOS 500만화소 (HDD 500GB에 저장)",
      "qty": 2,
      "note": ""
    },
    {
      "no": 13,
      "name": "장애인용 점자 키패드",
      "spec": "22 Key, PS/2",
      "qty": 1,
      "note": ""
    },
    {
      "no": 14,
      "name": "촉각(점자)모니터",
      "spec": "20Cell",
      "qty": 1,
      "note": ""
    },
    {
      "no": 15,
      "name": "QR리더기",
      "spec": "image Sensor 800x800 CMOS",
      "qty": 1,
      "note": ""
    },
    {
      "no": 16,
      "name": "음성유도기",
      "spec": "KW-1510A",
      "qty": 1,
      "note": ""
    },
    {
      "no": 17,
      "name": "영수증프린터",
      "spec": "200DPI/2inch/열전사방식",
      "qty": 1,
      "note": ""
    },
    {
      "no": 18,
      "name": "시군구 로그 홍보용 LED조명판",
      "spec": "가로320*세로420 (mm) / LED램프, 소비전력2W",
      "qty": 1,
      "note": ""
    },
    {
      "no": 19,
      "name": "통합보드",
      "spec": "유도안내LED램프/도어감지센서/워치독",
      "qty": 1,
      "note": ""
    },
    {
      "no": 20,
      "name": "함체(외함)",
      "spec": "철판 및 기타재료",
      "qty": 1,
      "note": ""
    }
  ],
  "TAPI-9320T": [
    {
      "no": 1,
      "name": "본체(PC)",
      "spec": "Intel i5 10400 2.9GHz이상 / RAM 8GB(DDR4) / SSD 256GB, HDD 500GB",
      "qty": 1,
      "note": ""
    },
    {
      "no": 2,
      "name": "운영체제",
      "spec": "MS Windows OS",
      "qty": 1,
      "note": ""
    },
    {
      "no": 3,
      "name": "모니터",
      "spec": "TFT Color LCD 32 inch",
      "qty": 1,
      "note": ""
    },
    {
      "no": 4,
      "name": "터치",
      "spec": "전정식터치방식",
      "qty": 1,
      "note": ""
    },
    {
      "no": 5,
      "name": "복합편철기",
      "spec": "배출/간추림/편철",
      "qty": 1,
      "note": ""
    },
    {
      "no": 6,
      "name": "출력프린터",
      "spec": "A4 / 61PPM / 1200 * 1200 dpi",
      "qty": 1,
      "note": ""
    },
    {
      "no": 7,
      "name": "무정전전원장치",
      "spec": "3.0 kVA",
      "qty": 1,
      "note": ""
    },
    {
      "no": 8,
      "name": "수수료정산장치",
      "spec": "코인/지폐 투입및배출제어",
      "qty": 1,
      "note": ""
    },
    {
      "no": 9,
      "name": "코인호퍼",
      "spec": "50원/100원/500원",
      "qty": 3,
      "note": ""
    },
    {
      "no": 10,
      "name": "지폐인식기",
      "spec": "(신권)1000원/5000원/10000원",
      "qty": 1,
      "note": ""
    },
    {
      "no": 11,
      "name": "지문스캐너",
      "spec": "광학식 / 500dpi",
      "qty": 1,
      "note": ""
    },
    {
      "no": 12,
      "name": "감시카메라",
      "spec": "CMOS 500만화소 (HDD 500GB에 저장)",
      "qty": 2,
      "note": ""
    },
    {
      "no": 13,
      "name": "장애인용 점자 키패드",
      "spec": "22 Key, PS/2",
      "qty": 1,
      "note": ""
    },
    {
      "no": 14,
      "name": "QR리더기",
      "spec": "image Sensor 800x800 CMOS",
      "qty": 1,
      "note": ""
    },
    {
      "no": 15,
      "name": "영수증프린터",
      "spec": "200DPI/2inch/열전사방식",
      "qty": 1,
      "note": ""
    },
    {
      "no": 16,
      "name": "시군구 로그 홍보용 LED조명판",
      "spec": "가로320*세로420 (mm) / LED램프, 소비전력2W",
      "qty": 1,
      "note": ""
    },
    {
      "no": 17,
      "name": "통합보드",
      "spec": "유도안내LED램프/도어감지센서/워치독",
      "qty": 1,
      "note": ""
    },
    {
      "no": 18,
      "name": "함체(외함)",
      "spec": "철판 및 기타재료",
      "qty": 1,
      "note": ""
    }
  ]
}

// 협력 거래처 마스터
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    "id": "SUP-01",
    "name": "(주)대원씨티에스",
    "businessNo": "106-81-12345",
    "ceo": "정명석",
    "contact": "02-2004-7700",
    "email": "order@daewoncts.co.kr",
    "category": "PC/컴포넌트",
    "leadTimeDays": 3
  },
  {
    "id": "SUP-02",
    "name": "한국마이크로소프트 총판(주)",
    "businessNo": "214-86-98765",
    "ceo": "이지원",
    "contact": "02-531-4000",
    "email": "license@ms-dist.co.kr",
    "category": "소프트웨어",
    "leadTimeDays": 1
  },
  {
    "id": "SUP-03",
    "name": "삼화디스플레이(주)",
    "businessNo": "134-87-34567",
    "ceo": "김삼화",
    "contact": "031-789-5500",
    "email": "sales@samhwadisplay.com",
    "category": "디스플레이",
    "leadTimeDays": 5
  },
  {
    "id": "SUP-04",
    "name": "(주)엔터치솔루션",
    "businessNo": "220-88-45678",
    "ceo": "박터치",
    "contact": "031-698-3320",
    "email": "support@ntouch.kr",
    "category": "터치스크린",
    "leadTimeDays": 5
  },
  {
    "id": "SUP-05",
    "name": "(주)신도리코 오피스솔루션",
    "businessNo": "119-81-56789",
    "ceo": "우석형",
    "contact": "02-460-1114",
    "email": "scm@sindoh.com",
    "category": "편철기/프린터",
    "leadTimeDays": 7
  },
  {
    "id": "SUP-06",
    "name": "교세라도큐먼트솔루션스코리아(주)",
    "businessNo": "105-86-67890",
    "ceo": "한기수",
    "contact": "02-6933-4000",
    "email": "order@kyocera.co.kr",
    "category": "고속레이저프린터",
    "leadTimeDays": 7
  },
  {
    "id": "SUP-07",
    "name": "슈나이더(APC) 파워테크(주)",
    "businessNo": "120-82-78901",
    "ceo": "최전원",
    "contact": "02-2630-9000",
    "email": "ups@apc-partner.co.kr",
    "category": "무정전전원장치(UPS)",
    "leadTimeDays": 4
  },
  {
    "id": "SUP-08",
    "name": "(주)오성정밀전자",
    "businessNo": "138-81-89012",
    "ceo": "오동진",
    "contact": "031-429-7700",
    "email": "order@ohsung-elec.com",
    "category": "금융정산/코인호퍼",
    "leadTimeDays": 5
  },
  {
    "id": "SUP-09",
    "name": "(주)코위텍",
    "businessNo": "211-87-90123",
    "ceo": "강위택",
    "contact": "02-850-6600",
    "email": "bill@cowitec.com",
    "category": "지폐인식기",
    "leadTimeDays": 4
  },
  {
    "id": "SUP-10",
    "name": "슈프리마 바이오시스템(주)",
    "businessNo": "129-86-01234",
    "ceo": "이재원",
    "contact": "031-783-4502",
    "email": "bio@suprema.co.kr",
    "category": "지문스캐너",
    "leadTimeDays": 3
  },
  {
    "id": "SUP-11",
    "name": "(주)아이디스 보안시스템",
    "businessNo": "305-81-12340",
    "ceo": "김영달",
    "contact": "042-888-8888",
    "email": "camera@idis.co.kr",
    "category": "감시카메라",
    "leadTimeDays": 4
  },
  {
    "id": "SUP-12",
    "name": "(주)에이티소프트",
    "businessNo": "107-87-23456",
    "ceo": "박승규",
    "contact": "02-588-7241",
    "email": "at@atsoft.co.kr",
    "category": "장애인 편의기기",
    "leadTimeDays": 7
  },
  {
    "id": "SUP-13",
    "name": "(주)한국장애인보조공학",
    "businessNo": "214-88-34567",
    "ceo": "홍길동",
    "contact": "02-761-9988",
    "email": "braille@assist.or.kr",
    "category": "촉각(점자)모니터",
    "leadTimeDays": 10
  },
  {
    "id": "SUP-14",
    "name": "(주)한국음성기술",
    "businessNo": "135-86-45678",
    "ceo": "임소리",
    "contact": "031-711-2300",
    "email": "voice@kvoice.co.kr",
    "category": "음성유도기",
    "leadTimeDays": 7
  },
  {
    "id": "SUP-15",
    "name": "허니웰오토메이션(주)",
    "businessNo": "211-81-56780",
    "ceo": "윤대표",
    "contact": "02-799-6114",
    "email": "scan@honeywell.com",
    "category": "QR/바코드리더",
    "leadTimeDays": 3
  },
  {
    "id": "SUP-16",
    "name": "(주)빅솔론",
    "businessNo": "124-81-67891",
    "ceo": "김형근",
    "contact": "031-218-5500",
    "email": "sales@bixolon.me",
    "category": "영수증프린터",
    "leadTimeDays": 4
  },
  {
    "id": "SUP-17",
    "name": "(주)동명LED라이팅",
    "businessNo": "131-86-78902",
    "ceo": "정동명",
    "contact": "032-811-9000",
    "email": "led@dmled.co.kr",
    "category": "LED조명판",
    "leadTimeDays": 5
  },
  {
    "id": "SUP-18",
    "name": "(주)세한전자기술",
    "businessNo": "206-85-89013",
    "ceo": "문세한",
    "contact": "031-456-1234",
    "email": "board@sehan-elec.co.kr",
    "category": "통합제어보드",
    "leadTimeDays": 6
  },
  {
    "id": "SUP-19",
    "name": "금호정밀함체(주)",
    "businessNo": "130-81-90124",
    "ceo": "김금호",
    "contact": "031-987-6543",
    "email": "order@kumhocase.com",
    "category": "함체(외함)판금",
    "leadTimeDays": 14
  }
]

// 전체 고유 자재 마스터 (22개 품목)
export const MASTER_PARTS: (MasterPart & { initialStock: number })[] = [
  {
    "id": "PART-001",
    "name": "본체(PC)",
    "spec": "Intel i5 10400 2.9GHz이상 / RAM 8GB(DDR4) / SSD 256GB, HDD 500GB",
    "category": "PC/컴포넌트",
    "defaultSupplierId": "SUP-01",
    "unitPrice": 620000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 4
  },
  {
    "id": "PART-002",
    "name": "운영체제",
    "spec": "MS Windows OS",
    "category": "소프트웨어",
    "defaultSupplierId": "SUP-02",
    "unitPrice": 175000,
    "unit": "EA",
    "safetyStock": 5,
    "initialStock": 8
  },
  {
    "id": "PART-003",
    "name": "모니터",
    "spec": "TFT Color LCD 27 inch",
    "category": "디스플레이",
    "defaultSupplierId": "SUP-03",
    "unitPrice": 260000,
    "unit": "EA",
    "safetyStock": 3,
    "initialStock": 2
  },
  {
    "id": "PART-004",
    "name": "모니터",
    "spec": "TFT Color LCD 32 inch",
    "category": "디스플레이",
    "defaultSupplierId": "SUP-03",
    "unitPrice": 350000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 1
  },
  {
    "id": "PART-005",
    "name": "터치",
    "spec": "IR(적외선)터치방식",
    "category": "터치패널",
    "defaultSupplierId": "SUP-04",
    "unitPrice": 140000,
    "unit": "EA",
    "safetyStock": 3,
    "initialStock": 3
  },
  {
    "id": "PART-006",
    "name": "터치",
    "spec": "전정식터치방식",
    "category": "터치패널",
    "defaultSupplierId": "SUP-04",
    "unitPrice": 210000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 0
  },
  {
    "id": "PART-007",
    "name": "복합편철기",
    "spec": "배출/간추림/편철",
    "category": "편철기/프린터",
    "defaultSupplierId": "SUP-05",
    "unitPrice": 980000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 1
  },
  {
    "id": "PART-008",
    "name": "출력프린터",
    "spec": "A4 / 61PPM / 1200 * 1200 dpi",
    "category": "고속레이저프린터",
    "defaultSupplierId": "SUP-06",
    "unitPrice": 1150000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 2
  },
  {
    "id": "PART-009",
    "name": "무정전전원장치",
    "spec": "3.0 kVA",
    "category": "무정전전원장치(UPS)",
    "defaultSupplierId": "SUP-07",
    "unitPrice": 420000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 3
  },
  {
    "id": "PART-010",
    "name": "수수료정산장치",
    "spec": "코인/지폐 투입및배출제어",
    "category": "금융정산기기",
    "defaultSupplierId": "SUP-08",
    "unitPrice": 310000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 2
  },
  {
    "id": "PART-011",
    "name": "코인호퍼",
    "spec": "50원/100원/500원",
    "category": "금융정산기기",
    "defaultSupplierId": "SUP-08",
    "unitPrice": 85000,
    "unit": "EA",
    "safetyStock": 6,
    "initialStock": 9
  },
  {
    "id": "PART-012",
    "name": "지폐인식기",
    "spec": "(신권)1000원/5000원/10000원",
    "category": "금융정산기기",
    "defaultSupplierId": "SUP-09",
    "unitPrice": 250000,
    "unit": "EA",
    "safetyStock": 3,
    "initialStock": 2
  },
  {
    "id": "PART-013",
    "name": "지문스캐너",
    "spec": "광학식 / 500dpi",
    "category": "생체인증",
    "defaultSupplierId": "SUP-10",
    "unitPrice": 185000,
    "unit": "EA",
    "safetyStock": 3,
    "initialStock": 4
  },
  {
    "id": "PART-014",
    "name": "감시카메라",
    "spec": "CMOS 500만화소 (HDD 500GB에 저장)",
    "category": "보안카메라",
    "defaultSupplierId": "SUP-11",
    "unitPrice": 115000,
    "unit": "EA",
    "safetyStock": 4,
    "initialStock": 6
  },
  {
    "id": "PART-015",
    "name": "장애인용 점자 키패드",
    "spec": "22 Key, PS/2",
    "category": "장애인 편의기기",
    "defaultSupplierId": "SUP-12",
    "unitPrice": 155000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 2
  },
  {
    "id": "PART-016",
    "name": "촉각(점자)모니터",
    "spec": "20Cell",
    "category": "장애인 편의기기",
    "defaultSupplierId": "SUP-13",
    "unitPrice": 1420000,
    "unit": "EA",
    "safetyStock": 1,
    "initialStock": 0
  },
  {
    "id": "PART-017",
    "name": "QR리더기",
    "spec": "image Sensor 800x800 CMOS",
    "category": "센서/리더기",
    "defaultSupplierId": "SUP-15",
    "unitPrice": 135000,
    "unit": "EA",
    "safetyStock": 3,
    "initialStock": 3
  },
  {
    "id": "PART-018",
    "name": "음성유도기",
    "spec": "KW-1510A",
    "category": "장애인 편의기기",
    "defaultSupplierId": "SUP-14",
    "unitPrice": 220000,
    "unit": "EA",
    "safetyStock": 1,
    "initialStock": 1
  },
  {
    "id": "PART-019",
    "name": "영수증프린터",
    "spec": "200DPI/2inch/열전사방식",
    "category": "영수증프린터",
    "defaultSupplierId": "SUP-16",
    "unitPrice": 125000,
    "unit": "EA",
    "safetyStock": 3,
    "initialStock": 4
  },
  {
    "id": "PART-020",
    "name": "시군구 로그 홍보용 LED조명판",
    "spec": "가로320*세로420 (mm) / LED램프, 소비전력2W",
    "category": "외장/조명",
    "defaultSupplierId": "SUP-17",
    "unitPrice": 88000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 2
  },
  {
    "id": "PART-021",
    "name": "통합보드",
    "spec": "유도안내LED램프/도어감지센서/워치독",
    "category": "통합제어보드",
    "defaultSupplierId": "SUP-18",
    "unitPrice": 280000,
    "unit": "EA",
    "safetyStock": 2,
    "initialStock": 3
  },
  {
    "id": "PART-022",
    "name": "함체(외함)",
    "spec": "철판 및 기타재료",
    "category": "함체(외함)판금",
    "defaultSupplierId": "SUP-19",
    "unitPrice": 1180000,
    "unit": "EA",
    "safetyStock": 1,
    "initialStock": 1
  }
]

// 기본 샘플 계약서 목록
export const INITIAL_CONTRACTS: ContractOrder[] = [
  {
    id: 'CNT-2026-001',
    contractNo: '강남구-2026-088',
    clientName: '서울특별시 강남구청 주민생활지원과',
    orderDate: '2026-11-01',
    dueDate: '2026-11-20',
    manager: '김민수 주무관',
    managerContact: '02-3423-5114',
    memo: '관내 주민센터 노후 발주분 교체 (시·청각장애인 편의모델 우선 배치)',
    modelQuantities: {
      'TAPI-9270J': 2,
      'TAPI-9270T': 1,
      'TAPI-9320J': 1,
      'TAPI-9320T': 0
    },
    status: '접수완료'
  },
  {
    id: 'CNT-2026-002',
    contractNo: '수원시-2026-042',
    clientName: '경기도 수원시청 민원봉사과',
    orderDate: '2026-11-02',
    dueDate: '2026-11-25',
    manager: '이지은 계장',
    managerContact: '031-228-2114',
    memo: '수원역 민원센터 및 팔달구청 32인치 대화면 신규 도입',
    modelQuantities: {
      'TAPI-9270J': 0,
      'TAPI-9270T': 0,
      'TAPI-9320J': 2,
      'TAPI-9320T': 1
    },
    status: '접수완료'
  }
]
