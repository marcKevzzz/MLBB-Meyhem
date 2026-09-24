import heroPortraitsData from './heroPortraits.json';

// Comprehensive hero name normalization
export function normalizeHeroName(name) {
  if (!name) return '';
  return name.toLowerCase().trim();
}

// Extra fallbacks for heroes that might have special formatting
const EXTRA_PORTRAITS = {
  'lapu-lapu': 'https://akmwebstatic.yuanzhanapp.com/web/madmin/image_8b60cceca5b04e97da7372f12bfeb612.jpg',
  'lapulapu': 'https://akmwebstatic.yuanzhanapp.com/web/madmin/image_8b60cceca5b04e97da7372f12bfeb612.jpg',
  'suyou': 'https://static.wikia.nocookie.net/mobile-legends/images/4/41/Hero1261-portrait.png/revision/latest',
  'zhuxin': 'https://static.wikia.nocookie.net/mobile-legends/images/0/05/Hero1251-icon.png',
  'yi sun-shin': 'https://indoch.s3.ml.moonlian.com/web/madmin/image_232a4e2311adbf26084da82845c48b26.png',
  'yisunshin': 'https://indoch.s3.ml.moonlian.com/web/madmin/image_232a4e2311adbf26084da82845c48b26.png',
  'x.borg': 'https://indoch.s3.ml.moonlian.com/web/madmin/image_72ef8508933b45ca4628e9beaa39ca25.png',
  'xborg': 'https://indoch.s3.ml.moonlian.com/web/madmin/image_72ef8508933b45ca4628e9beaa39ca25.png',
  'x-borg': 'https://indoch.s3.ml.moonlian.com/web/madmin/image_72ef8508933b45ca4628e9beaa39ca25.png',
  'chang\'e': 'https://akmwebstatic.yuanzhanapp.com/web/madmin/image_1a6b949d43ed33a7ad939ee4a0420b3e.png',
  'change': 'https://akmwebstatic.yuanzhanapp.com/web/madmin/image_1a6b949d43ed33a7ad939ee4a0420b3e.png'
};

/**
 * Returns a high-res circular portrait URL for any MLBB hero.
 */
export function getHeroPortraitUrl(heroName) {
  if (!heroName) return null;
  const raw = heroName.trim().toLowerCase();
  const withHyphen = raw.replace(/\s+/g, '-');
  const withoutHyphen = raw.replace(/[^a-z0-9]/g, '');

  // 1. Check Extra curated list
  if (EXTRA_PORTRAITS[raw]) return EXTRA_PORTRAITS[raw];
  if (EXTRA_PORTRAITS[withHyphen]) return EXTRA_PORTRAITS[withHyphen];
  if (EXTRA_PORTRAITS[withoutHyphen]) return EXTRA_PORTRAITS[withoutHyphen];

  // 2. Direct match in JSON
  if (heroPortraitsData[raw]) return heroPortraitsData[raw];
  if (heroPortraitsData[withHyphen]) return heroPortraitsData[withHyphen];
  if (heroPortraitsData[withoutHyphen]) return heroPortraitsData[withoutHyphen];

  // 3. Fuzzy search in JSON keys
  const match = Object.keys(heroPortraitsData).find(k => {
    const cleanK = k.replace(/[^a-z0-9]/g, '');
    return cleanK === withoutHyphen || cleanK.includes(withoutHyphen) || withoutHyphen.includes(cleanK);
  });
  if (match) {
    return heroPortraitsData[match];
  }

  // 4. Clean avatar placeholder fallback
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(heroName)}&background=121634&color=00e5ff&bold=true&size=128`;
}
