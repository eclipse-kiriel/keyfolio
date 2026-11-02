/**
 * Constants & Default Data for Custom Keyboard Manager
 */

export const STORAGE_KEYS = {
  KEYBOARDS: 'kb_builds_v2',
  KEYCAPS: 'kb_keycaps_v2',
  PARTS: 'kb_parts_v2',
  SETTINGS: 'kb_settings_v2',
  FIREBASE_CONFIG: 'kb_firebase_config_v1'
};

// 구조화된 빌드 필드 섹션 정의
export const BUILD_SECTIONS = [
  {
    id: 'housing_group',
    title: '하우징 (Housing)',
    fields: [
      { key: 'housing', label: '키보드/하우징명', placeholder: '예: tofu60 3.0, Jelly Evolv, F1-8X', required: true },
      { key: 'formFactor', label: '배열 (크기)', placeholder: '예: TKL, 60%, 65%, 75%, 40%, Full, 1800' },
      { key: 'layout', label: '하판 레이아웃', placeholder: '예: WK, WKL, HHKB' },
      { key: 'topColor', label: '상판 색상', placeholder: '예: 라벤더, 아노다이징 블랙, E-White' },
      { key: 'bottomColor', label: '하판 색상', placeholder: '예: 실버 텍스쳐, 라벤더, 건메탈' },
      { key: 'weight', label: '무게추', placeholder: '예: 황동 PVD, 미러 크롬, 스테인리스, 황동' }
    ]
  },
  {
    id: 'mount_plate_group',
    title: '마운트 & 보강판 (Mount & Plate)',
    fields: [
      { key: 'mountType', label: '마운트 방식', placeholder: '예: 탑마운트, 가스켓, O-Ring, 플랫' },
      { key: 'plate', label: '보강판', placeholder: '예: PC보강, 알루미늄, FR4, POM, 황동' }
    ]
  },
  {
    id: 'pcb_stab_group',
    title: 'PCB & 스테빌라이저 (PCB & Stabilizer)',
    fields: [
      { key: 'pcb', label: 'PCB 기판', placeholder: '예: 베놈, H60, 젠온 60, 수트 기판' },
      { key: 'pcbType', label: 'PCB 타입', placeholder: '예: 핫스왑, 솔더링, 자석축(HE), 블루투스' },
      { key: 'stabilizer', label: '스테빌라이저 (기본)', placeholder: '예: 나테빌, 줄테빌, TX AP' },
      { key: 'stabilizerSpbar', label: '스페이스바 스테빌', placeholder: '예: TX AP 롱폴 6.25u' }
    ]
  },
  {
    id: 'switch_group',
    title: '스위치 (Switches)',
    fields: [
      { key: 'switches', label: '메인 스위치 모델명', placeholder: '예: 게이트론 델타, HG 블랙, 슷치, 비선로' },
      { key: 'switchLubeType', label: '윤활 여부', type: 'radio', options: ['공윤', '무윤', '손윤'], default: '손윤' },
      { key: 'switchSpring', label: '스프링', placeholder: '예: 55g 슬로우, 62g 롱스프링, 순정' },
      { key: 'switchFilm', label: '필름', placeholder: '예: 데스필름 0.15mm, 폼필름, 미적용' },
      { key: 'extraSwitches', label: '추가/포인트 스위치', placeholder: '예: 스페이스바 - HG블랙 67g 손윤' }
    ]
  },
  {
    id: 'keycap_group',
    title: '키캡 (Keycap)',
    fields: [
      { key: 'mountedKeycap', label: '장착된 키캡', placeholder: '보유 키캡 목록에서 선택 또는 직접 입력' }
    ]
  },
  {
    id: 'media_group',
    title: '미디어 & 링크 (Media & Sound)',
    fields: [
      { key: 'soundLink', label: '타건음 링크', placeholder: '예: https://youtu.be/... (유튜브/사운드클라우드)' }
    ]
  }
];

// 빌드 상태 옵션
export const BUILD_STATUS_OPTIONS = [
  { value: 'completed', label: '완성 (실사용)', color: '#10b981' },
  { value: 'building', label: '빌드 중 (조립대기)', color: '#f59e0b' },
  { value: 'stored', label: '보관 중 (소장)', color: '#6366f1' },
  { value: 'disassembled', label: '분해/교체 예정', color: '#94a3b8' }
];

// 키캡 상태 옵션
export const KEYCAP_STATUS_OPTIONS = [
  { value: 'mounted', label: '장착 중', color: '#10b981' },
  { value: 'stored', label: '보관함 (미사용)', color: '#6366f1' },
  { value: 'ordered', label: '공제/배송 대기', color: '#f59e0b' },
  { value: 'loaned', label: '대여/기타', color: '#94a3b8' }
];

// 키캡 프로파일 & 재질
export const KEYCAP_PROFILES = ['Cherry (체리)', 'OEM', 'SA', 'MT3', 'KAT', 'KAM', 'DSA', 'XDA', 'MOA', '기타'];
export const KEYCAP_MATERIALS = ['ABS 이중사출', 'PBT 이중사출', 'PBT 염료승화', 'PBT 염료승화+이중사출', 'POM', '기타'];

// 초기 샘플 데이터 (그룹화된 필드 반영)
export const INITIAL_KEYBOARDS = [
  {
    id: 'kb_demo_1',
    name: 'tofu60 3.0',
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: {
      housing: 'tofu60 3.0',
      formFactor: '60%',
      layout: 'WK',
      topColor: '라벤더',
      bottomColor: '실버텍스쳐',
      weight: '황동 PVD',
      mountType: '탑마운트',
      plate: 'PC보강',
      foamType: '폼',
      foamItems: ['기보강폼', '하부폼'],
      foamSummary: '폼 (기보강폼, 하부폼)',
      pcb: '베놈',
      pcbType: '핫스왑',
      stabilizer: '나테빌',
      stabilizerSpbar: 'TX AP 롱폴 6.25u',
      switches: '게이트론 델타',
      switchLubeType: '손윤',
      switchSpring: '55g 숏스프링',
      switchFilm: '데스필름 0.15mm',
      extraSwitches: '스페이스바: 체리 HG블랙 67g 손윤',
      mountedKeycap: 'GMK gorp',
      soundLink: ''
    },
    images: [],
    customFields: [],
    notes: '자석축 게이밍 및 메인 타건용 60% 커스텀 빌드. 라벤더 색감과 실버 하판 조화가 매우 뛰어남.'
  }
];

export const INITIAL_KEYCAPS = [
  {
    id: 'kc_demo_1',
    name: 'GMK gorp',
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    status: 'mounted',
    mountedOnKeyboardId: 'kb_demo_1',
    mountedOnKeyboardName: 'tofu60 3.0',
    customFields: [
      { id: 'cf_k1', label: '구매처', value: '스웨그키' },
      { id: 'cf_k2', label: '보유 킷', value: 'Base Kit + Novelties' }
    ],
    notes: '라벤더 하우징과 어울리는 GMK 키캡셋'
  },
  {
    id: 'kc_demo_2',
    name: 'GMK analog dream',
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    status: 'stored',
    mountedOnKeyboardId: '',
    mountedOnKeyboardName: '',
    customFields: [
      { id: 'cf_k4', label: '보유 킷', value: 'Base Kit R2' }
    ],
    notes: '파스텔 톤 감성의 레트로 사이버펑크 셋'
  }
];
