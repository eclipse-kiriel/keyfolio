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
    this.catalogPromise = null;
    // Preload MatrixZJ catalog index in the background after initial page settle
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.ensureCatalogLoaded().catch(() => {});
      }, 1000);
    }
  }

  /**
   * Ensures search-data.json is loaded once and shared across concurrent calls.
   */
  async ensureCatalogLoaded() {
    if (this.catalogIndex) return this.catalogIndex;
    if (this.catalogPromise) return this.catalogPromise;

    this.catalogPromise = (async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch('https://matrixzj.github.io/assets/js/search-data.json', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          this.catalogIndex = await res.json();
        }
      } catch (e) {
        clearTimeout(timeoutId);
        console.warn('MatrixZJ catalog preload warning:', e);
      } finally {
        this.catalogPromise = null;
      }
      return this.catalogIndex;
    })();

    return this.catalogPromise;
  }

  /**
   * Strict Token Matching Scorer.
   * - Respects explicit brand prefixes anywhere in title or vendor (e.g. "Keykobo ..." vs "GMK ..." vs "osume").
   * - Strips store tags ([In-Stock], [Group-Buy], [Pre-Order]) before tokenizing.
   * - Separates revision modifiers (r1, r2, r3, v2, cyl) from core name tokens
   *   so "GMK Bento R2" never false-matches random "R2" keycaps.
   * - Requires ALL core query tokens to match discrete target tokens (or Korean substrings).
   */
  calculateMatchScore(targetName, keywords = [], rawQuery, targetVendor = '') {
    const normQuery = (rawQuery || '').toLowerCase().trim();
    if (!normQuery) return 0;

    const stripStoreTags = (s) =>
      (s || '').replace(/\[[^\]]*\]|\((?:in[- ]?stock|group[- ]?buy|pre[- ]?order|gb|extras)[^)]*\)/gi, ' ').trim();

    // Normalize Unicode diacritics (e.g. "MÜT" -> "mut") so accented keycap names match ASCII queries
    const foldDiacritics = (s) =>
      (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const normTarget = foldDiacritics(stripStoreTags(targetName)).toLowerCase();
    const normVendor = foldDiacritics(targetVendor).toLowerCase().trim();
    const foldedQuery = foldDiacritics(normQuery);

    const brandWordRx = /\b(gmk|sa|epbt|dsa|kat|kam|pbtfans|key\s*kobo|kkb|milky\s*way|mw|keyboard\s*science|kbs|tut|osume|dmk|domikey|crp|dcx|ws|sw|jtk|mt3|sp|nicepbt)\b/gi;
    const normalizeBrandToken = (b) => {
      const lower = b.toLowerCase().replace(/\s+/g, '');
      if (lower === 'kkb' || lower === 'keykobo') return 'keykobo';
      if (lower === 'dmk' || lower === 'domikey') return 'domikey';
      if (lower === 'keyboardscience' || lower === 'kbs') return 'kbs';
      if (lower === 'milkyway' || lower === 'mw') return 'mw';
      return lower;
    };

    const extractBrands = (str) => {
      const matches = (str || '').match(brandWordRx) || [];
      return [...new Set(matches.map(normalizeBrandToken))];
    };

    const qBrands = extractBrands(foldedQuery);
    const tBrands = extractBrands(`${normTarget} ${normVendor}`);

    if (qBrands.length > 0) {
      const qB = qBrands[0];
      // Reject if target title or vendor belongs to a different known brand (e.g. "osume" vs "gmk")
      if (tBrands.some(tb => tb !== qB)) {
        return 0;
      }
      // For Shopify vendor products (where targetVendor is provided), require positive brand confirmation
      if (normVendor) {
        const hasGmkProfileHint = qB === 'gmk' && /\b(cyl|mtnu)\b/i.test(normTarget);
        if (!tBrands.includes(qB) && !hasGmkProfileHint) {
          return 0;
        }
      }
    }

    const noiseWords = new Set([
      'keycaps', 'keycap', 'set', 'kit', 'base', 'cyl', 'mtnu', 'cherry', 'profile',
      'doubleshot', 'pbt', 'abs', '키캡', 'in', 'stock', 'group', 'buy', 'preorder', 'pre', 'order'
    ]);
    const modifierWords = new Set(['r1', 'r2', 'r3', 'r4', 'r5', 'v1', 'v2', 'v3', 'round']);

    const tokenize = (str) => {
      const withoutBrands = foldDiacritics(str).toLowerCase().replace(brandWordRx, ' ');
      const cleaned = withoutBrands.replace(/[^a-z0-9가-힣\s]/g, ' ').trim();
      const rawTokens = cleaned.split(/\s+/).filter(Boolean).filter(t => !noiseWords.has(t));
      const core = rawTokens.filter(t => !modifierWords.has(t));
      const mods = rawTokens.filter(t => modifierWords.has(t));
      return {
        all: rawTokens,
        core: core.length > 0 ? core : rawTokens,
        mods
      };
    };

    const qParsed = tokenize(foldedQuery);
    if (qParsed.core.length === 0) return 0;

    const tParsed = tokenize(normTarget);
    if (tParsed.core.length === 0) return 0;

    const qClean = qParsed.all.join(' ');
    const qCoreStr = qParsed.core.join(' ');
    const tClean = tParsed.all.join(' ');
    const tCoreStr = tParsed.core.join(' ');

    // 1. Exact full match (including revision modifiers like R2)
    if (tClean === qClean) {
      return 1000;
    }

    // 2. Exact match in alias keywords (or matching core when query has R2 modifier)
    const lowerKeywords = (keywords || []).map(kw => kw.toLowerCase().trim());
    if (lowerKeywords.some(kw => kw === normQuery || kw === qClean)) {
      return 960;
    }
    if (tCoreStr === qCoreStr) {
      // e.g. Query "GMK Bento R2" against Preset "GMK Bento"
      const modBonus = qParsed.mods.some(m => tParsed.mods.includes(m)) ? 50 : 0;
      return 900 + modBonus;
    }
    if (lowerKeywords.some(kw => {
      const kwParsed = tokenize(kw);
      return kwParsed.core.length > 0 && kwParsed.core.join(' ') === qCoreStr;
    })) {
      return 890;
    }

    // 3. Check if ALL core query tokens match target
    const tokenMatchesTarget = (qt) => {
      if (tParsed.core.includes(qt) || tParsed.all.includes(qt)) return true;
      // Korean keyword support (since \b does not work on Hangul)
      if (/[가-힣]/.test(qt)) {
        if (normTarget.includes(qt)) return true;
        if (lowerKeywords.some(kw => kw.includes(qt))) return true;
      }
      // Also check if keyword aliases contain this exact token
      return lowerKeywords.some(kw => kw.split(/\s+/).includes(qt));
    };

    const allCoreMatched = qParsed.core.every(tokenMatchesTarget);
    if (!allCoreMatched) {
      return 0;
    }

    let score = 550;
    // Favor closer word count to avoid overly long unrelated bundles
    score -= Math.abs(tParsed.core.length - qParsed.core.length) * 25;

    // Bonus if target starts with the first core token
    if (tParsed.core[0] === qParsed.core[0]) {
      score += 60;
    }

    // Bonus if revision modifier (e.g. R2) also matches
    if (qParsed.mods.length > 0 && qParsed.mods.some(m => tParsed.mods.includes(m))) {
      score += 50;
    }

    return Math.max(score, 150);
  }

  /**
   * Search keycap images by keyword across 4 fast stages:
   * Stage 1 (0ms): Built-in popular presets
   * Stage 2 (~350ms): MatrixZJ catalog (parallel detail fetch for GMK/SA/DSA)
   * Stage 3 (~650ms): Global keyboard vendor Shopify JSON search (Keykobo, PBTfans, Osume, MW, GMK, etc.)
   * Stage 4 (~2s): Strict Bing Image OIP search fallback
   */
  async searchKeycap(query) {
    if (!query || !query.trim()) return null;
    const rawQuery = query.trim();
    const cleanQuery = rawQuery.toLowerCase();

    const matchedSets = [];

    // Stage 1: Score and rank preset database (0ms)
    for (const preset of POPULAR_KEYCAPS_PRESETS) {
      const score = this.calculateMatchScore(preset.name, preset.keywords, cleanQuery);
      if (score >= 450) {
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

    // If we already have a strong preset match (score >= 880), return immediately for instant UX!
    const hasStrongPreset = matchedSets.some(s => s.score >= 880);
    if (hasStrongPreset) {
      matchedSets.sort((a, b) => b.score - a.score);
      return {
        ...matchedSets[0],
        matchedSets: matchedSets.slice(0, 6)
      };
    }

    // Check if query explicitly specifies a non-GMK/SA/DSA brand
    const nonMatrixBrandRx = /^(epbt|kat|kam|pbtfans|key\s*kobo|kkb|milky\s*way|mw|keyboard\s*science|kbs|tut|osume|dmk|domikey|crp|dcx|ws|sw|jtk|mt3|nicepbt)\b/i;
    const isNonMatrixBrand = nonMatrixBrandRx.test(cleanQuery);

    // Stage 2: Search online MatrixZJ catalog (parallel) for GMK / SA / DSA or generic queries
    if (!isNonMatrixBrand) {
      try {
        const catalogResults = await this.searchOnlineCatalogMulti(cleanQuery);
        catalogResults.forEach(item => {
          const isDup = matchedSets.some(
            s => s.name.toLowerCase() === item.name.toLowerCase()
          );
          if (!isDup) {
            matchedSets.push(item);
          }
        });
      } catch (err) {
        console.warn('Online catalog lookup failed:', err);
      }
    }

    // Stage 3: Universal Web Image Search (Naver for Korean, Brave -> Bing for Global)
    // Single-request search across all keycap vendors, makers, and communities without vendor bias or 429 bursts.
    if (matchedSets.length === 0) {
      try {
        const webResult = await this.searchWebImagesFallback(rawQuery);
        if (webResult) {
          matchedSets.push(webResult);
        }
      } catch (err) {
        console.warn('Web image search fallback failed:', err);
      }
    }

    // Sort by match score descending
    matchedSets.sort((a, b) => b.score - a.score);

    if (matchedSets.length === 0) return null;

    const bestMatch = matchedSets[0];
    return {
      ...bestMatch,
      matchedSets: matchedSets.slice(0, 6)
    };
  }

  /**
   * Stage 3: Fast Parallel Shopify JSON Search routed by brand via r.jina.ai (~600ms).
   * Queries only the 1-5 most relevant stores for the requested brand to stay well below proxy rate limits.
   */
  async searchVendorCatalogsParallel(rawQuery) {
    const qLower = rawQuery.toLowerCase();
    let vendors;
    if (/^(gmk)\b/i.test(qLower)) {
      vendors = ['typemachina.com', 'oblotzky.industries', 'novelkeys.com', 'swagkeys.com', 'divinikey.com'];
    } else if (/^(kbs|keyboard\s*science)\b/i.test(qLower)) {
      vendors = ['elecfox.co', 'keybay.tech', 'qwertyqop.com', 'divinikey.com', 'prototypist.net'];
    } else if (/^(key\s*kobo|kkb)\b/i.test(qLower)) {
      vendors = ['unikeyboards.com', 'keebzncables.com', 'ktechs.store', 'divinikey.com', 'prototypist.net'];
    } else if (/^(osume)\b/i.test(qLower)) {
      vendors = ['osume.com'];
    } else if (/^(pbtfans)\b/i.test(qLower)) {
      vendors = ['divinikey.com', 'swagkeys.com', 'cannonkeys.com', 'unikeyboards.com'];
    } else if (/^(nicepbt)\b/i.test(qLower)) {
      vendors = ['cannonkeys.com'];
    } else {
      vendors = ['divinikey.com', 'swagkeys.com', 'cannonkeys.com', 'unikeyboards.com', 'oblotzky.industries'];
    }

    const excludeTitleRx = /\b(switch|switches|desk\s*mats?|desk\s*pads?|stabilizers?|stabs|wrist\s*rests?|cables?|coiled|artisan\s*trays?|trays?|carry(?:ing)?\s*cases?|lube|openers?|pullers?|films?|springs?|barebones?|pcbs?|plates?|foams?|stickers?|bags?|cloths?)\b/i;

    const fetchVendorSuggest = async (domain) => {
      const suggestUrl = `https://${domain}/search/suggest.json?q=${encodeURIComponent(rawQuery)}&resources[type]=product&resources[limit]=6&resources[options][fields]=title,vendor,product_type`;
      const proxyUrl = `https://r.jina.ai/${suggestUrl}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4200);

      try {
        const res = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return [];
        const text = await res.text();
        const jsonStart = text.indexOf('{');
        if (jsonStart === -1) return [];
        const data = JSON.parse(text.slice(jsonStart));
        const products = data?.resources?.results?.products || [];
        return products.map(p => ({ ...p, _domain: domain }));
      } catch {
        clearTimeout(timeoutId);
        return [];
      }
    };

    const vendorLists = await Promise.all(vendors.map(fetchVendorSuggest));
    const allProducts = vendorLists.flat();
    if (allProducts.length === 0) return [];

    const scoredProducts = [];
    for (const prod of allProducts) {
      const title = (prod.title || '').trim();
      if (!title || excludeTitleRx.test(title)) continue;

      const rawImage = prod.image || prod.featured_image?.url || '';
      if (!rawImage) continue;

      const score = this.calculateMatchScore(title, [], rawQuery, prod.vendor || '');
      if (score >= 450) {
        const cleanImg = rawImage.startsWith('//') ? `https:${rawImage}` : rawImage;
        scoredProducts.push({
          title,
          vendor: prod.vendor || '',
          domain: prod._domain,
          url: prod.url ? prod.url.split('?')[0] : '',
          image: cleanImg,
          score
        });
      }
    }

    if (scoredProducts.length === 0) return [];
    scoredProducts.sort((a, b) => b.score - a.score);

    // Keep up to top 3 distinct matched products (avoid mixing different sets into one gallery)
    const uniqueProds = [];
    const seenTitles = new Set();
    for (const prod of scoredProducts) {
      const key = prod.title.toLowerCase().replace(/\[[^\]]*\]/g, '').trim();
      if (seenTitles.has(key)) continue;
      seenTitles.add(key);
      uniqueProds.push(prod);
      if (uniqueProds.length >= 3) break;
    }

    const buildVendorSet = async (prod) => {
      const galleryCandidates = [];
      const seenUrls = new Set();

      const addCandidate = (title, url) => {
        if (!url) return;
        const normalized = url.startsWith('//') ? `https:${url}` : url;
        const baseKey = normalized.split('?')[0];
        if (seenUrls.has(baseKey)) return;
        seenUrls.add(baseKey);
        galleryCandidates.push({ title, url: normalized });
      };

      if (prod.url && prod.url.includes('/products/')) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3200);
        try {
          const prodJsUrl = `https://r.jina.ai/https://${prod.domain}${prod.url}.js`;
          const res = await fetch(prodJsUrl, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            const text = await res.text();
            const jsonStart = text.indexOf('{');
            if (jsonStart !== -1) {
              const prodData = JSON.parse(text.slice(jsonStart));
              if (Array.isArray(prodData.images)) {
                prodData.images.slice(0, 12).forEach((imgUrl, idx) => {
                  addCandidate(`${prod.title} (${idx + 1})`, imgUrl);
                });
              }
            }
          }
        } catch {
          clearTimeout(timeoutId);
        }
      }

      addCandidate(prod.title, prod.image);
      if (galleryCandidates.length === 0) return null;

      return {
        source: 'vendor',
        score: prod.score,
        name: prod.title,
        manufacturer: prod.vendor || '',
        profile: '',
        material: '',
        representative: galleryCandidates[0].url,
        candidates: galleryCandidates.slice(0, 12)
      };
    };

    const builtSets = await Promise.all(uniqueProds.map(buildVendorSet));
    return builtSets.filter(Boolean);
  }

  /**
   * Stage 4: Universal Web Image Search fallback
   * - Korean queries -> Naver Image Search
   * - Global queries -> Brave Image Search (independent index across all vendors/communities) -> Bing Image Search backup
   */
  async searchWebImagesFallback(rawQuery) {
    const hasHangul = /[가-힣]/.test(rawQuery);
    if (hasHangul) {
      const naverResult = await this.searchNaverImagesFallback(rawQuery);
      if (naverResult) return naverResult;
    }

    // Expand ambiguous abbreviations for general web search (e.g. KBS -> Keyboard Science, avoids Korean TV station KBS)
    const expandedQuery = rawQuery
      .replace(/\bkbs\b/gi, 'Keyboard Science')
      .replace(/\bkkb\b/gi, 'Keykobo')
      .replace(/\bmw\b/gi, 'Milkyway');

    // Try Brave Image Search first (covers all global vendors/sites in 1 request, with descriptive alt titles)
    const braveResult = await this.searchBraveImagesFallback(expandedQuery, rawQuery);
    if (braveResult) return braveResult;

    const cleanQ = expandedQuery.replace(/\b(r1|r2|r3|v1|v2)\b/gi, '').trim() || expandedQuery.trim();
    const hasKeycapWord = /\b(keycap|keycaps|키캡)\b/i.test(expandedQuery);
    const searchTerms = [
      hasKeycapWord ? `"${expandedQuery}"` : `"${expandedQuery}" keycaps`,
      hasKeycapWord ? expandedQuery : `${expandedQuery} keycaps`,
      `${cleanQ} keycap set`
    ];

    const candidates = [];
    const seenUrls = new Set();

    for (let attempt = 0; attempt < searchTerms.length; attempt++) {
      const searchTerm = searchTerms[attempt];
      const targetUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(searchTerm)}&first=1`;
      const proxyUrl = `https://r.jina.ai/${targetUrl}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      try {
        const res = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) continue;

        const text = await res.text();
        const imgRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;

        let match;
        while ((match = imgRegex.exec(text)) !== null) {
          const alt = (match[1] || '').trim();
          let url = match[2].trim();

          // Strictly accept ONLY genuine Bing OIP photo thumbnails (reject ODF 12x12 favicons & InlineBlock sidebar ads)
          if (url.includes('th.bing.com/th/id/')) {
            if (!url.includes('/th/id/OIP.') || url.includes('pid=InlineBlock')) {
              continue;
            }
            // Strip pid/w/h and request clean 600px preview
            const baseOip = url.split('?')[0];
            url = `${baseOip}?w=600&h=600&c=7&r=0&o=5&pid=1.7`;
          } else if (/\.(jpg|jpeg|png|webp)(\?|$)/i.test(url)) {
            if (url.includes('favicon') || url.includes('logo') || url.includes('icon')) {
              continue;
            }
          } else {
            continue;
          }

          if (seenUrls.has(url)) continue;
          seenUrls.add(url);

          const cleanAlt = alt
            .replace(/^Image \d+:?\s*/i, '')
            .trim();
          const label = cleanAlt
            ? cleanAlt.slice(0, 28)
            : `웹 검색 결과 ${candidates.length + 1}`;

          candidates.push({ title: label, url });
          if (candidates.length >= 12) break;
        }

        if (candidates.length >= 4) break;
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn(`Web fallback attempt ${attempt + 1} error:`, err);
      }
    }

    if (candidates.length > 0) {
      return {
        source: 'web',
        score: 300,
        name: `${rawQuery} (웹 검색 결과)`,
        manufacturer: '',
        profile: '',
        material: '',
        representative: candidates[0].url,
        candidates
      };
    }

    return null;
  }

  /**
   * Universal Web Image Search via Brave Images (CORS-accessible via r.jina.ai).
   * Searches across all keycap vendors, Geekhack, Reddit, and blogs in a single request.
   */
  async searchBraveImagesFallback(expandedQuery, displayQuery) {
    const searchTerm = /\b(keycap|keycaps|키캡)\b/i.test(expandedQuery)
      ? expandedQuery
      : `${expandedQuery} keycaps`;
    const targetUrl = `https://search.brave.com/images?q=${encodeURIComponent(searchTerm)}`;
    const proxyUrl = `https://r.jina.ai/${targetUrl}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    try {
      const res = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return null;

      const text = await res.text();
      const imgRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
      const candidates = [];
      const seenUrls = new Set();

      let match;
      while ((match = imgRegex.exec(text)) !== null) {
        const alt = (match[1] || '').trim();
        const url = match[2].trim();

        // Filter out Brave logos, 32x32 favicons, SVGs, and globe placeholders
        if (
          !url.includes('imgs.search.brave.com/') ||
          url.includes('rs:fit:32:32') ||
          url.includes('.svg') ||
          alt === '🌐' ||
          /brave logo/i.test(alt)
        ) {
          continue;
        }

        if (seenUrls.has(url)) continue;
        seenUrls.add(url);

        const cleanAlt = alt.replace(/^Image \d+:?\s*/i, '').trim();
        const label = cleanAlt ? cleanAlt.slice(0, 32) : `웹 검색 결과 ${candidates.length + 1}`;
        candidates.push({ title: label, url });
        if (candidates.length >= 12) break;
      }

      if (candidates.length === 0) return null;

      return {
        source: 'web',
        score: 320,
        name: `${displayQuery} (웹 검색 결과)`,
        manufacturer: '',
        profile: '',
        material: '',
        representative: candidates[0].url,
        candidates
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('Brave image search fallback error:', err);
      return null;
    }
  }

  /**
   * Korean Web Image Search fallback via Naver Images (CORS-accessible via r.jina.ai)
   * Handles Korean domestic keycap names such as "햄승 라벤더한글".
   */
  async searchNaverImagesFallback(rawQuery) {
    const searchTerm = /키캡|keycap/i.test(rawQuery) ? rawQuery : `${rawQuery} 키캡`;
    const targetUrl = `https://search.naver.com/search.naver?where=image&query=${encodeURIComponent(searchTerm)}`;
    const proxyUrl = `https://r.jina.ai/${targetUrl}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const res = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return null;

      const text = await res.text();
      const imgRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
      const candidates = [];
      const seenUrls = new Set();

      let match;
      while ((match = imgRegex.exec(text)) !== null) {
        const alt = (match[1] || '').trim();
        const url = match[2].trim();

        const isNaverPhoto =
          url.includes('search.pstatic.net/common/') ||
          url.includes('shopping-phinf.pstatic.net/');
        if (!isNaverPhoto) continue;
        if (url.includes('type=f30_30') || url.includes('logo_icon') || url.includes('promo_')) {
          continue;
        }

        if (seenUrls.has(url)) continue;
        seenUrls.add(url);

        const cleanAlt = alt.replace(/^Image \d+:?\s*/i, '').trim();
        const label = cleanAlt ? cleanAlt.slice(0, 28) : `네이버 검색 ${candidates.length + 1}`;
        candidates.push({ title: label, url });
        if (candidates.length >= 12) break;
      }

      if (candidates.length === 0) return null;

      return {
        source: 'web',
        score: 300,
        name: `${rawQuery} (네이버 이미지 검색)`,
        manufacturer: '',
        profile: '',
        material: '',
        representative: candidates[0].url,
        candidates
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('Naver image search fallback error:', err);
      return null;
    }
  }

  /**
   * Search online matrixzj catalog with strict token scoring & parallel detail fetching
   */
  async searchOnlineCatalogMulti(cleanQuery) {
    await this.ensureCatalogLoaded();
    if (!this.catalogIndex) return [];

    const scoredKeys = [];

    for (const [key, item] of Object.entries(this.catalogIndex)) {
      if (!item.title || !item.url) continue;

      // Only keycap doc pages (GMK, SA, DSA)
      if (
        !item.url.includes('/docs/gmk-keycaps/') &&
        !item.url.includes('/docs/sa-keycaps/') &&
        !item.url.includes('/docs/dsa-keycaps/')
      ) {
        continue;
      }

      // Extract set title: "Monochrome R2 흑백R2" -> "Monochrome R2"
      const cleanTitle = item.title.split(/[\u4e00-\u9fa5\u3040-\u30ff]/)[0].trim();
      const targetBrand = item.url.includes('/docs/sa-keycaps/')
        ? 'SA'
        : item.url.includes('/docs/dsa-keycaps/')
          ? 'DSA'
          : 'GMK';
      const score = this.calculateMatchScore(
        `${targetBrand} ${cleanTitle}`,
        [cleanTitle, `${targetBrand} ${cleanTitle}`],
        cleanQuery
      );

      if (score >= 450) {
        scoredKeys.push({ key, item, cleanTitle, score });
      }
    }

    if (scoredKeys.length === 0) return [];
    scoredKeys.sort((a, b) => b.score - a.score);

    const topKeys = scoredKeys.slice(0, 3);

    // Fetch top 3 detail pages in parallel for 3x faster response
    const detailPromises = topKeys.map(({ item, cleanTitle, score }) =>
      this.fetchMatrixDetailPage(item.url, cleanTitle, score).catch(e => {
        console.warn('Failed detail parse for:', item.title, e);
        return null;
      })
    );

    const resolvedDetails = await Promise.all(detailPromises);
    return resolvedDetails.filter(Boolean);
  }

  async fetchMatrixDetailPage(url, title, score) {
    const pageUrl = url.startsWith('http') ? url : `https://matrixzj.github.io${url}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    try {
      const res = await fetch(pageUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
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

      const brand = pageUrl.includes('sa-keycaps')
        ? 'SA'
        : pageUrl.includes('dsa-keycaps')
          ? 'DSA'
          : 'GMK';

      return {
        source: 'matrixzj',
        score,
        name: `${brand} ${title}`,
        manufacturer: brand,
        profile: brand === 'SA' ? 'SA' : brand === 'DSA' ? 'DSA' : 'Cherry (체리)',
        material: 'ABS 이중사출',
        representative,
        candidates
      };
    } catch (err) {
      clearTimeout(timeoutId);
      return null;
    }
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
