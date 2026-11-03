/**
 * Keycap Image Search & Processing Service
 * Provides automated search, multi-set candidate resolution (Exact Token Match),
 * kits/renders extraction, and Canvas-based WebP conversion.
 */

// Preset database for popular keycaps with high-res renders & kit variations
export const POPULAR_KEYCAPS_PRESETS = [
  // 1. GMK Mono (Geonworks Design - Distinct from Monochrome!)
  {
    name: 'GMK Mono',
    keywords: ['mono', 'gmk mono', '모노', 'gmk cyl mono'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://oblotzky.industries/cdn/shop/files/gmk_cyl_mono_thumbnail_1200x1200.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://oblotzky.industries/cdn/shop/files/gmk_cyl_mono_thumbnail_1200x1200.jpg' },
      { title: '키보드 장착 렌더 (F1-722)', url: 'https://cdn.shopify.com/s/files/1/0252/3958/4834/files/F1-722.1602.TopwithKCTKL.webp' },
      { title: '키보드 장착 렌더 2', url: 'https://oblotzky.industries/cdn/shop/files/gmk_cyl_mono_keyboard_01_1200x1200.jpg' },
      { title: '키보드 장착 렌더 3', url: 'https://oblotzky.industries/cdn/shop/files/gmk_cyl_mono_keyboard_02_1200x1200.jpg' }
    ]
  },

  // 2. GMK Monochrome (Classic Black & White)
  {
    name: 'GMK Monochrome',
    keywords: ['monochrome', 'gmk monochrome', '모노크롬'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/monochrome/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/monochrome/rendering_pics/1.jpg' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/monochrome/kits_pics/base.jpg' }
    ]
  },

  // 3. Dolch Family (Distinct Sets!)
  {
    name: 'GMK Dolch (Classic)',
    keywords: ['dolch', 'gmk dolch', '클래식 돌치', '돌치'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dolch-r5/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링 (R5)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dolch-r5/rendering_pics/1.png' },
      { title: 'Base Kit (R5)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dolch-r5/kits_pics/base.png' },
      { title: 'Novelties', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dolch-r5/kits_pics/novelties.png' },
      { title: 'Color Extension', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dolch-r5/kits_pics/color-extension.png' }
    ]
  },
  {
    name: 'GMK Modern Dolch (MoDo)',
    keywords: ['modern dolch', 'modo', '모던돌치', '모도', 'gmk modern dolch'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/modern-dolch/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/modern-dolch/rendering_pics/1.png' },
      { title: 'Standard (Base Kit)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/modern-dolch/kits_pics/standard.png' },
      { title: 'Novelties', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/modern-dolch/kits_pics/novelties.png' },
      { title: 'Spacebars', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/modern-dolch/kits_pics/spacebars.png' }
    ]
  },
  {
    name: 'GMK Modern Dolch Light',
    keywords: ['modern dolch light', 'modo light', '모도라이트', '모던돌치라이트'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/modern-dolch-light/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/modern-dolch-light/rendering_pics/1.png' },
      { title: 'Standard (Base Kit)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/modern-dolch-light/kits_pics/standard.png' },
      { title: 'Novelties', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/modern-dolch-light/kits_pics/novelties.png' }
    ]
  },
  {
    name: 'GMK Mint Dolch',
    keywords: ['mint dolch', '민트돌치', 'gmk mint dolch'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/mint-dolch/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/mint-dolch/rendering_pics/1.jpg' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/mint-dolch/kits_pics/base.jpg' }
    ]
  },
  {
    name: 'GMK Evil Dolch',
    keywords: ['evil dolch', '이블돌치', 'gmk evil dolch'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/evil-dolch/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/evil-dolch/rendering_pics/1.jpg' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/evil-dolch/kits_pics/base.jpg' },
      { title: 'Novelties', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/evil-dolch/kits_pics/novelties.jpg' }
    ]
  },
  {
    name: 'GMK Ocean Dolch',
    keywords: ['ocean dolch', '오션돌치', 'gmk ocean dolch'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/ocean-dolch/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/ocean-dolch/rendering_pics/1.jpg' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/ocean-dolch/kits_pics/base.jpg' }
    ]
  },
  {
    name: 'GMK Sky Dolch',
    keywords: ['sky dolch', '스카이돌치', 'gmk sky dolch'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/sky-dolch/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/sky-dolch/rendering_pics/1.jpg' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/sky-dolch/kits_pics/base.jpg' }
    ]
  },

  // 4. GMK Gorp
  {
    name: 'GMK Gorp',
    keywords: ['gorp', 'gmk gorp', '고프'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://i.imgur.com/y3v18MY.jpeg',
    candidates: [
      { title: '대표 렌더링 (키보드 장착)', url: 'https://i.imgur.com/y3v18MY.jpeg' },
      { title: 'Base Kit (베이스 킷)', url: 'https://i.imgur.com/tnCNFL1.png' },
      { title: 'Novelties (노벨티)', url: 'https://i.imgur.com/xw2fX6N.jpg' },
      { title: '하우징 렌더 (각도 1)', url: 'https://i.imgur.com/hVwqe4R.jpeg' },
      { title: '하우징 렌더 (각도 2)', url: 'https://i.imgur.com/GyZ7VcZ.jpeg' },
      { title: '데스크매트 매칭', url: 'https://i.imgur.com/hSDruZP.jpeg' }
    ]
  },

  // 5. Popular GMK / PBT Keycaps
  {
    name: 'GMK Bento',
    keywords: ['bento', 'gmk bento', '도시락', '벤토'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/bento/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/bento/rendering_pics/1.png' },
      { title: 'Base Kit (전체 킷)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/bento/kits_pics/base.png' },
      { title: 'Kobe Kit (일각 킷)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/bento/kits_pics/kobe.jpeg' },
      { title: 'Spacebars', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/bento/kits_pics/spacebars.png' },
      { title: '렌더링 각도 2', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/bento/rendering_pics/2.png' }
    ]
  },
  {
    name: 'GMK Botanical',
    keywords: ['botanical', 'gmk botanical', '보타니컬'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/botanical/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/botanical/rendering_pics/1.jpg' },
      { title: 'Base Kit (베이스 킷)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/botanical/kits_pics/Standard.png' },
      { title: 'Novelties (노벨티 킷)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/botanical/kits_pics/Herbal.png' },
      { title: 'Spacebars (스페이스바)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/botanical/kits_pics/Spacebars.png' },
      { title: '렌더링 각도 2', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/botanical/rendering_pics/2.jpg' }
    ]
  },
  {
    name: 'GMK Olivia',
    keywords: ['olivia', 'gmk olivia', '올리비아'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/olivia++/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/olivia++/rendering_pics/1.png' },
      { title: 'Base Kit (Light)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/olivia++/kits_pics/light.png' },
      { title: 'Base Kit (Dark)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/olivia++/kits_pics/dark.png' },
      { title: 'Novelties (노벨티)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/olivia++/kits_pics/novelties.png' },
      { title: 'Spacebars (스페이스바)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/olivia++/kits_pics/spacebars.png' }
    ]
  },
  {
    name: 'GMK Laser',
    keywords: ['laser', 'gmk laser', '레이저'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/laser/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/laser/rendering_pics/1.png' },
      { title: 'Cyberdeck (Base Kit)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/laser/kits_pics/cyberdeck.png' },
      { title: 'Novelties', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/laser/kits_pics/novelties.png' },
      { title: 'Gaijin (일각)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/laser/kits_pics/gaijin.png' },
      { title: 'Mitowaves', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/laser/kits_pics/mitowaves.png' }
    ]
  },
  {
    name: 'GMK Striker',
    keywords: ['striker', 'gmk striker', '스트라이커'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/striker/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/striker/rendering_pics/1.jpg' },
      { title: 'Core (Base Kit)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/striker/kits_pics/core.png' },
      { title: 'Spacebars', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/striker/kits_pics/spacebars.png' }
    ]
  },
  {
    name: 'GMK Dualshot',
    keywords: ['dualshot', 'gmk dualshot', '듀얼샷', '플스'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dualshot/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dualshot/rendering_pics/1.png' },
      { title: 'Standard (Base Kit)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dualshot/kits_pics/Standard.png' },
      { title: 'Novelties (노벨티)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dualshot/kits_pics/Novelty.png' },
      { title: 'Spacebars', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dualshot/kits_pics/Spacebars.png' }
    ]
  },
  {
    name: 'GMK Apollo',
    keywords: ['apollo', 'gmk apollo', '아폴로'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/apollo/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/apollo/rendering_pics/1.jpg' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/apollo/kits_pics/base.jpg' },
      { title: 'Novelties', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/apollo/kits_pics/novelties.jpg' }
    ]
  },
  {
    name: 'GMK Dracula',
    keywords: ['dracula', 'gmk dracula', '드라큘라'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dracula/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dracula/rendering_pics/1.png' },
      { title: 'Core (Base Kit)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dracula/kits_pics/core.png' },
      { title: 'Highlight (노벨티)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/dracula/kits_pics/highlight.png' }
    ]
  },
  {
    name: 'GMK 8008',
    keywords: ['8008', 'gmk 8008', '팔공공팔'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/8008/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/8008/rendering_pics/1.png' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/8008/kits_pics/base.png' },
      { title: 'Accent Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/8008/kits_pics/accent.png' }
    ]
  },
  {
    name: 'GMK Cafe',
    keywords: ['cafe', 'gmk cafe', '카페'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/cafe/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/cafe/rendering_pics/1.jpg' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/cafe/kits_pics/base.jpg' },
      { title: 'Novelties', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/cafe/kits_pics/novelties.jpg' }
    ]
  },
  {
    name: 'GMK Mizu',
    keywords: ['mizu', 'gmk mizu', '미즈'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/mizu/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/mizu/rendering_pics/1.png' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/mizu/kits_pics/base.png' },
      { title: 'Novelties', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/mizu/kits_pics/novelties.png' }
    ]
  },
  {
    name: 'GMK Noel',
    keywords: ['noel', 'gmk noel', '노엘'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/noel/rendering_pics/1.png',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/noel/rendering_pics/1.png' },
      { title: 'Base Kit (Hire)', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/noel/kits_pics/hire.png' }
    ]
  },
  {
    name: 'GMK Analog Dreams',
    keywords: ['analog dreams', 'analog dream', '아날로그 드림', '아날로그드림'],
    manufacturer: 'GMK',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://matrixzj.github.io/assets/images/gmk-keycaps/analog-dreams/rendering_pics/1.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/analog-dreams/rendering_pics/1.jpg' },
      { title: 'Base Kit', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/analog-dreams/kits_pics/base.jpg' },
      { title: 'Novelties', url: 'https://matrixzj.github.io/assets/images/gmk-keycaps/analog-dreams/kits_pics/novelties.jpg' }
    ]
  },
  {
    name: 'PBTfans Pyga',
    keywords: ['pyga', 'pbtfans pyga', '파이가'],
    manufacturer: 'PBTfans',
    profile: 'Cherry (체리)',
    material: 'PBT 이중사출',
    representative: 'https://kbdfans.com/cdn/shop/products/1_3a5c2d30-746a-4933-9189-d1928fe340e4_1000x.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://kbdfans.com/cdn/shop/products/1_3a5c2d30-746a-4933-9189-d1928fe340e4_1000x.jpg' },
      { title: 'Base Kit', url: 'https://kbdfans.com/cdn/shop/products/Base_2a5d99ca-299f-4db3-bfe8-b97ec7628859_1000x.jpg' }
    ]
  },
  {
    name: 'Keykobo Retro Mixed Lights',
    keywords: ['retro mixed lights', 'rml', '키코보 레믹라', '레믹라'],
    manufacturer: 'Keykobo',
    profile: 'Cherry (체리)',
    material: 'ABS 이중사출',
    representative: 'https://swagkeys.com/cdn/shop/files/1_d2889c17-1f9e-4c75-ae90-7fd95ddceca6_1000x.jpg',
    candidates: [
      { title: '대표 렌더링', url: 'https://swagkeys.com/cdn/shop/files/1_d2889c17-1f9e-4c75-ae90-7fd95ddceca6_1000x.jpg' },
      { title: 'Base Kit', url: 'https://swagkeys.com/cdn/shop/files/Base_26fef093-b09e-4286-905c-5f8e5616eec2_1000x.jpg' }
    ]
  }
];

class KeycapSearchService {
  constructor() {
    this.catalogIndex = null;
    this.isLoadingIndex = false;
  }

  /**
   * Word-Boundary / Exact Token Matching Scorer.
   * Prevents false positives like matching "mono" to "monochrome".
   */
  calculateMatchScore(targetName, keywords = [], rawQuery) {
    const normQuery = rawQuery.toLowerCase().trim();
    if (!normQuery) return 0;

    // Strip brand prefixes: "gmk mono" -> "mono"
    const qClean = normQuery.replace(/^(gmk|sa|epbt|dsa|kat|kam|pbtfans|keykobo)\s+/i, '').trim();
    const qTokens = qClean.split(/\s+/).filter(Boolean);
    if (qTokens.length === 0) return 0;

    const normTarget = targetName.toLowerCase().trim();
    const tClean = normTarget.replace(/^(gmk|sa|epbt|dsa|kat|kam|pbtfans|keykobo)\s+/i, '').replace(/[^a-z0-9가-힣\s]/g, ' ').trim();
    const tTokens = tClean.split(/\s+/).filter(Boolean);

    // 1. Exact Match on stripped name: e.g. "mono" === "mono"
    if (tTokens.join(' ') === qTokens.join(' ')) {
      return 1000;
    }

    // 2. Exact match in alias keywords: e.g. 'mono' in ['mono', 'gmk mono']
    if (keywords.some(kw => kw.toLowerCase().trim() === normQuery || kw.toLowerCase().trim() === qClean)) {
      return 950;
    }

    let score = 0;

    // 3. Exact Word Token Containment (All query tokens must exist as discrete tokens in target)
    // "mono" is NOT in ["monochrome"], so score is 0.
    const allTokensExist = qTokens.every(qt => tTokens.includes(qt));
    if (allTokensExist) {
      score += 500;
      // Favor closer word counts (e.g. "Dolch" over "Dolch Reborn Accent Special")
      score -= Math.abs(tTokens.length - qTokens.length) * 20;
    }

    // 4. Regex Word Boundary: \bmono\b
    let boundaryMatches = 0;
    qTokens.forEach(qt => {
      const escaped = qt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp('\\b' + escaped + '\\b', 'i');
      if (rx.test(normTarget)) {
        boundaryMatches++;
        score += 120;
      }
    });

    // If query has multiple tokens and none matched as distinct boundary words, reject
    if (boundaryMatches === 0 && !allTokensExist) {
      return 0;
    }

    return score;
  }

  /**
   * Search keycap images by keyword.
   * Returns multiple matched set candidates (e.g. Dolch Family or Mono)
   * so the user can easily toggle between variations.
   */
  async searchKeycap(query) {
    if (!query || !query.trim()) return null;
    const cleanQuery = query.trim().toLowerCase();

    const matchedSets = [];

    // 1. Score and rank preset database
    for (const preset of POPULAR_KEYCAPS_PRESETS) {
      const score = this.calculateMatchScore(preset.name, preset.keywords, cleanQuery);
      if (score > 100) {
        matchedSets.push({
          source: 'preset',
          score,
          name: preset.name,
          manufacturer: preset.manufacturer,
          profile: preset.profile,
          material: preset.material,
          representative: preset.representative,
          candidates: preset.candidates
        });
      }
    }

    // 2. If presets didn't give a definitive 1000-point exact match, search online matrixzj catalog
    const hasPerfectMatch = matchedSets.some(s => s.score >= 950);
    if (!hasPerfectMatch || matchedSets.length < 3) {
      try {
        const catalogResults = await this.searchOnlineCatalogMulti(cleanQuery);
        catalogResults.forEach(item => {
          const isDup = matchedSets.some(s => s.name.toLowerCase().includes(item.name.toLowerCase()));
          if (!isDup) {
            matchedSets.push(item);
          }
        });
      } catch (err) {
        console.warn('Online catalog lookup failed:', err);
      }
    }

    // Sort by match score descending
    matchedSets.sort((a, b) => b.score - a.score);

    if (matchedSets.length === 0) return null;

    // Return the top set, and keep the list of matched sets for user switching
    const bestMatch = matchedSets[0];
    return {
      ...bestMatch,
      matchedSets: matchedSets.slice(0, 6) // Top 6 sets for family selection
    };
  }

  /**
   * Search online matrixzj catalog with token-based scoring
   */
  async searchOnlineCatalogMulti(cleanQuery) {
    if (!this.catalogIndex && !this.isLoadingIndex) {
      this.isLoadingIndex = true;
      try {
        const res = await fetch('https://matrixzj.github.io/assets/js/search-data.json');
        if (res.ok) {
          this.catalogIndex = await res.json();
        }
      } catch (e) {
        console.error('Failed to load matrixzj catalog index:', e);
      } finally {
        this.isLoadingIndex = false;
      }
    }

    if (!this.catalogIndex) return [];

    const scoredKeys = [];

    for (const [key, item] of Object.entries(this.catalogIndex)) {
      if (!item.title || !item.url) continue;

      // Only keycap doc pages
      if (!item.url.includes('/docs/gmk-keycaps/') && !item.url.includes('/docs/sa-keycaps/')) {
        continue;
      }

      // Extract set title: "Monochrome R2 흑백R2" -> "Monochrome R2"
      const cleanTitle = item.title.split(/[\u4e00-\u9fa5\u3040-\u30ff]/)[0].trim();
      const score = this.calculateMatchScore(cleanTitle, [cleanTitle], cleanQuery);

      if (score > 100) {
        scoredKeys.push({ key, item, cleanTitle, score });
      }
    }

    scoredKeys.sort((a, b) => b.score - a.score);

    const results = [];
    const topKeys = scoredKeys.slice(0, 3); // Fetch detail for top 3 matches

    for (const { item, cleanTitle, score } of topKeys) {
      try {
        const detail = await this.fetchMatrixDetailPage(item.url, cleanTitle, score);
        if (detail) results.push(detail);
      } catch (e) {
        console.warn('Failed detail parse for:', item.title, e);
      }
    }

    return results;
  }

  async fetchMatrixDetailPage(url, title, score) {
    const pageUrl = url.startsWith('http') ? url : `https://matrixzj.github.io${url}`;
    const res = await fetch(pageUrl);
    if (!res.ok) return null;
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgElements = Array.from(doc.querySelectorAll('img'));

    const candidates = [];
    let representative = '';

    imgElements.forEach(img => {
      let src = img.getAttribute('src') || '';
      if (!src) return;
      if (src.includes('history.png') || src.includes('order.png')) return;

      if (src.startsWith('/')) {
        src = `https://matrixzj.github.io${src}`;
      }

      const alt = img.getAttribute('alt') || '';
      let itemTitle = '키캡 사진';

      if (src.includes('kits_pics')) {
        const filename = src.split('/').pop().replace(/\.[^/.]+$/, '');
        itemTitle = `Kit: ${filename.toUpperCase()}`;
      } else if (src.includes('rendering_pics')) {
        const filename = src.split('/').pop().replace(/\.[^/.]+$/, '');
        itemTitle = `Render: ${filename}`;
        if (!representative) representative = src;
      }

      if (alt) itemTitle = `${itemTitle} (${alt})`;
      candidates.push({ title: itemTitle, url: src });
    });

    if (!representative && candidates.length > 0) {
      representative = candidates[0].url;
    }

    if (candidates.length === 0) return null;

    const brand = pageUrl.includes('sa-keycaps') ? 'SA' : 'GMK';

    return {
      source: 'matrixzj',
      score,
      name: `${brand} ${title}`,
      manufacturer: brand,
      profile: brand === 'SA' ? 'SA' : 'Cherry (체리)',
      material: 'ABS 이중사출',
      representative,
      candidates
    };
  }

  /**
   * Convert an image URL to a high-quality WebP Base64 string via HTML5 Canvas.
   * If CORS is blocked, gracefully falls back to images.weserv.nl proxy.
   */
  async convertUrlToWebP(imageUrl, maxWidth = 600, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      let fallbackTried = false;

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(dataUrl);
        } catch (err) {
          console.error('Canvas conversion error:', err);
          if (!fallbackTried) {
            fallbackTried = true;
            tryFallback();
          } else {
            reject(err);
          }
        }
      };

      img.onerror = () => {
        if (!fallbackTried) {
          fallbackTried = true;
          tryFallback();
        } else {
          reject(new Error('Failed to load image from URL'));
        }
      };

      const tryFallback = () => {
        const cleanUrl = imageUrl.replace(/^https?:\/\//, '');
        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=600&output=webp`;
      };

      img.src = imageUrl;
    });
  }
}

export const keycapSearchService = new KeycapSearchService();
