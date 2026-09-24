// MLBB Signature Heroes Database
// Maps authentic iconic heroes for top MLBB pros across all eras,
// with meta-accurate classic (2018-2021) and modern (2022-2026) fallback pools,
// and competitive Hero Draft Counter engine.

// ── Classic Era Meta Pools (2018–2021: 1-3-1 Hypercarry, Invade Roam, Offlane Bruisers) ──
export const CLASSIC_ROLE_POOLS = {
  EXP: [
    'Thamuz', 'Uranus', 'Chou', 'X.Borg', 'Esmeralda',
    'Lapu-Lapu', 'Jawhead', 'Benedetta', 'Alice'
  ],
  Jungler: [
    'Granger', 'Kimmy', 'Karrie', 'Claude', 'Lancelot',
    'Ling', 'Hayabusa', 'Yi Sun-shin', 'Gusion', 'Roger'
  ],
  Mid: [
    'Harith', 'Selena', 'Pharsa', 'Kagura', 'Lunox',
    'Valir', 'Chang\'e', 'Luo Yi', 'Gusion', 'Lylia'
  ],
  Gold: [
    'Claude', 'Karrie', 'Granger', 'Bruno', 'Kimmy',
    'Moskov', 'Wanwan', 'Irithel', 'Clint'
  ],
  Roamer: [
    'Grock', 'Chou', 'Khufra', 'Kaja', 'Atlas',
    'Akai', 'Lolita', 'Franco', 'Angela', 'Carmilla'
  ]
};

// ── Modern Era Meta Pools (2022–2026: Utility Tanks, Mobile Assassins, Mage Gold, Engage Roam) ──
export const MODERN_ROLE_POOLS = {
  EXP: [
    'Arlott', 'Terizla', 'Cici', 'Yu Zhong', 'Lapu-Lapu',
    'Paquito', 'Phoveus', 'Ruby', 'Benedetta', 'Edith'
  ],
  Jungler: [
    'Suyou', 'Nolan', 'Fanny', 'Ling', 'Hayabusa',
    'Fredrinn', 'Barats', 'Baxia', 'Alpha', 'Roger', 'Julian'
  ],
  Mid: [
    'Zhuxin', 'Valentina', 'Faramis', 'Novaria', 'Yve',
    'Pharsa', 'Xavier', 'Vexana', 'Luo Yi', 'Kadita'
  ],
  Gold: [
    'Harith', 'Beatrix', 'Claude', 'Roger', 'Brody',
    'Bruno', 'Moskov', 'Wanwan', 'Natan', 'Karrie'
  ],
  Roamer: [
    'Chip', 'Mathilda', 'Tigreal', 'Minotaur', 'Ruby',
    'Khufra', 'Arlott', 'Chou', 'Lolita', 'Angela', 'Floryn', 'Diggie'
  ]
};

// General fallback pool
export const ROLE_HERO_POOLS = MODERN_ROLE_POOLS;

// ── Player Signature Hero Registry (with Era-specific variants) ──
export const SIGNATURE_HEROES = {
  // ── M1 Era (2019) ──
  'EVOS_Oura': ['Thamuz', 'Chou', 'X.Borg'],
  'EVOS_Wannn': ['Harith', 'Ling', 'Chang\'e'],
  'EVOS_Luminaire': ['Selena', 'Kaja', 'Pharsa'],
  'EVOS_REKT': ['Claude', 'Kimmy', 'Granger'],
  'EVOS_Donkey': ['Chou', 'Grock', 'Kaja'],
  'Oura': ['Thamuz', 'Chou', 'X.Borg'],
  'Wannn': ['Harith', 'Ling', 'Chang\'e'],
  'Luminaire': ['Selena', 'Kaja', 'Pharsa'],
  'REKT': ['Claude', 'Kimmy', 'Angela'],
  'Donkey': ['Chou', 'Grock', 'Tigreal'],

  // ── RRQ Kings (Classic to Modern) ──
  'Lemon': ['Kagura', 'Franco', 'Lapu-Lapu'],
  'Tuturu': ['Moskov', 'Claude', 'Granger'],
  'Xinnn': ['Claude', 'Hayabusa', 'Granger'],
  'Vyn': ['Franco', 'Khufra', 'Grock'],
  'R7': ['Chou', 'Yu Zhong', 'Lapu-Lapu'],
  'Alberttt': ['Lancelot', 'Ling', 'Hayabusa'],
  'Skylar': ['Beatrix', 'Claude', 'Bruno'],
  'Clayyy': ['Yve', 'Valentina', 'Faramis'],
  'Brusko': ['Minotaur', 'Tigreal', 'Chip'],

  // ── M2 World Champions: Bren Esports (2020) ──
  'KarlTzy': ['Lancelot', 'Benedetta', 'Yi Sun-shin'],
  'FlapTzy': ['Lapu-Lapu', 'Paquito', 'Terizla'],
  'Pheww': ['Valentina', 'Yve', 'Pharsa'],
  'Lusty': ['Atlas', 'Chou', 'Akai'],
  'Ribo': ['Alice', 'Claude', 'Harith'],
  'Super Marco': ['Beatrix', 'Claude', 'Harith'],
  'Owgwen': ['Arlott', 'Ruby', 'Tigreal'],

  // ── M3 World Champions: Blacklist International (2021-2022) ──
  'OhMyV33NUS': ['Estes', 'Mathilda', 'Rafaela'],
  'Wise': ['Barats', 'Aldous', 'Baxia'],
  'Edward': ['Benedetta', 'Lapu-Lapu', 'Uranus'],
  'Hadji': ['Yve', 'Pharsa', 'Chou'],
  'OHEB': ['Beatrix', 'Harith', 'Lunox'],

  // ── M4 World Champions: ECHO / Liquid PH (2022-2024) ──
  'Sanford': ['Yu Zhong', 'Lapu-Lapu', 'Arlott'],
  'Sanji': ['Valentina', 'Yve', 'Zhuxin'],
  'Bennyqt': ['Beatrix', 'Karrie', 'Harith'],
  'Yawi': ['Chou', 'Khufra', 'Atlas'],
  'Jaypee': ['Minotaur', 'Mathilda', 'Tigreal'],

  // ── FNATIC ONIC / ONIC ID & PH ──
  'Kairi': ['Lancelot', 'Ling', 'Suyou'],
  'Kiboy': ['Chip', 'Chou', 'Khufra'],
  'Sanz': ['Faramis', 'Valentina', 'Zhuxin'],
  'CW': ['Wanwan', 'Beatrix', 'Roger'],
  'Lutpiii': ['Cici', 'Terizla', 'Arlott'],
  'Butsss': ['Benedetta', 'Yu Zhong', 'Lapu-Lapu'],
  'Drian': ['Pharsa', 'Luo Yi', 'Kagura'],
  'Kelra': ['Harith', 'Beatrix', 'Roger'],

  // ── Selangor Red Giants (SRG 2024 MSC Champions) ──
  'Sekysss': ['Suyou', 'Nolan', 'Alpha'],
  'Kramm': ['Terizla', 'Arlott', 'Cici'],
  'Stormie': ['Zhuxin', 'Valentina', 'Faramis'],
  'Innocent': ['Harith', 'Roger', 'Claude'],
  'YumS': ['Chip', 'Ruby', 'Tigreal'],

  // ── Team Spirit / Deus Vult (CIS) ──
  'Kid Bomba': ['Yu Zhong', 'Arlott', 'Uranus'],
  'ONER': ['Lancelot', 'Fredrinn', 'Baxia'],
  'Sunset Lover': ['Faramis', 'Valentina', 'Kadita'],
  'Hassa': ['Beatrix', 'Claude', 'Bruno'],
  'SAWO': ['Tigreal', 'Lolita', 'Chou'],
  'Carvi': ['Claude', 'Beatrix', 'Wanwan'],
  'Magistor': ['Fredrinn', 'Baxia', 'Akai'],
  'zaur egoist': ['Lancelot', 'Ling', 'Hayabusa'],
  'Hiko': ['Beatrix', 'Harith', 'Claude'],

  // ── North America (Cloud9 / BTK / The Valley) ──
  'MobaZane': ['Granger', 'Roger', 'Yi Sun-shin'],
  'Shark': ['Lolita', 'Khufra', 'Chou'],
  'Basic': ['Beatrix', 'Claude', 'Wanwan'],
  'Cole': ['Pharsa', 'Valentina', 'Yve'],
  'Maro': ['Lapu-Lapu', 'Paquito', 'Arlott'],
  'FwydChickn': ['Benedetta', 'Yu Zhong', 'Chou'],
  'Hoon': ['Yve', 'Pharsa', 'Luo Yi'],
  'Zia': ['Yve', 'Pharsa', 'Lylia'],

  // ── HomeBois & Malaysia ──
  'Udil': ['Luo Yi', 'Valir', 'Pharsa'],
  'Xorn': ['Chou', 'Tigreal', 'Franco'],
  'Chibi': ['Nolan', 'Fredrinn', 'Lancelot'],
  'Nets': ['Beatrix', 'Claude', 'Bruno'],
  'Sepat': ['Terizla', 'Lapu-Lapu', 'Yu Zhong'],
  'CikuGais': ['Claude', 'Wanwan', 'Ling'],
  'Moon': ['Pharsa', 'Chang\'e', 'Kagura'],
  'Momo': ['Paquito', 'Lapu-Lapu', 'Chou'],

  // ── Fire Flux (Turkey) ──
  'Alien': ['Lapu-Lapu', 'Terizla', 'Yu Zhong'],
  'Tienzy': ['Fanny', 'Nolan', 'Lancelot'],
  'Rosa': ['Valentina', 'Faramis', 'Kadita'],
  'Sunshine': ['Beatrix', 'Claude', 'Karrie'],
  'APEX47': ['Minotaur', 'Tigreal', 'Ruby'],

  // ── See You Soon (Cambodia) ──
  'FELIX': ['Terizla', 'Arlott', 'Paquito'],
  'MP the King': ['Baxia', 'Fredrinn', 'Nolan'],
  'Lori': ['Valentina', 'Yve', 'Faramis'],
  'Kousei': ['Claude', 'Beatrix', 'Bruno'],
  'BOXI': ['Ruby', 'Tigreal', 'Minotaur'],

  // ── NIP Flash (Singapore) ──
  'Diablo': ['Yu Zhong', 'Terizla', 'Lapu-Lapu'],
  'Hadess': ['Lancelot', 'Hayabusa', 'Nolan'],
  'KurtTzy': ['Valentina', 'Yve', 'Faramis'],
  'Vanix': ['Claude', 'Harith', 'Beatrix'],
  'JPL': ['Mathilda', 'Minotaur', 'Tigreal'],

  // ── Burmese Ghouls (2020) ──
  'ACE': ['Yi Sun-shin', 'Claude', 'Hayabusa'],
  'RubyDd': ['Lunox', 'Kagura', 'Harith'],
  'Kid': ['Chou', 'Khufra', 'Atlas'],
  'Dee': ['Lapu-Lapu', 'Uranus', 'Chou'],
  'May': ['Lolita', 'Grock', 'Khufra'],

  // ── Aether Main / Cignal Ultra (2018) ──
  'Coco': ['Chou', 'Alpha', 'Gusion'],
  'Yuji': ['Fanny', 'Lancelot', 'Hayabusa'],
  'Pein': ['Kagura', 'Cyclops', 'Harley'],
  'Ribo': ['Moskov', 'Karrie', 'Claude'],
  '666': ['Lolita', 'Grock', 'Chou'],

  // ── Modern Rising Stars ──
  'Anavel': ['Nolan', 'Alpha', 'Fredrinn'],
  'Emann': ['Beatrix', 'Brody', 'Harith'],
  'Gold Baron': ['Claude', 'Beatrix', 'Bruno']
};

/**
 * Returns 3 signature heroes for a player IGN, role, and era/year.
 * Uses era-aware meta fallback pools when not in registry.
 */
export function getSignatureHeroes(ign, role, year = 2024) {
  if (ign && SIGNATURE_HEROES[ign]) {
    return SIGNATURE_HEROES[ign];
  }

  const isClassic = Number(year) <= 2021;
  const pool = isClassic
    ? (CLASSIC_ROLE_POOLS[role] || CLASSIC_ROLE_POOLS['EXP'])
    : (MODERN_ROLE_POOLS[role] || MODERN_ROLE_POOLS['EXP']);

  // Deterministic 3 picks based on player name hash
  let hash = 0;
  const str = (ign || '') + '_' + role + '_' + (isClassic ? 'classic' : 'modern');
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  const idx1 = Math.abs(hash) % pool.length;
  const idx2 = Math.abs(hash * 3 + 1) % pool.length;
  const idx3 = Math.abs(hash * 7 + 2) % pool.length;

  const res = [pool[idx1]];
  if (!res.includes(pool[idx2])) res.push(pool[idx2]);
  if (!res.includes(pool[idx3])) res.push(pool[idx3]);

  for (const h of pool) {
    if (res.length >= 3) break;
    if (!res.includes(h)) res.push(h);
  }
  return res;
}

/**
 * Selects 1 hero from the player's signature pool for a specific game index.
 */
export function pickGameHero(ign, role, gameIndex = 0, year = 2024) {
  const heroes = getSignatureHeroes(ign, role, year);
  return heroes[gameIndex % heroes.length];
}

// ══════════════════════════════════════════════════════════════
// ── COMPETITIVE HERO COUNTER & DRAFT ADVANTAGE ENGINE ──
// ══════════════════════════════════════════════════════════════

/**
 * Authentic MLBB Hard & Soft Counter Mappings
 * Format: Hero -> Array of heroes they counter + strategic reason
 */
export const HERO_COUNTERS = {
  // ── Anti-Crowd Control / Anti-Initiation ──
  'Diggie': {
    counters: ['Atlas', 'Tigreal', 'Khufra', 'Minotaur', 'Guinevere', 'Chou', 'Ruby'],
    reason: 'Time Journey cleanses AOE crowd control initiations'
  },

  // ── Anti-Dash / Anti-Mobility (Grounding & Bounce) ──
  'Khufra': {
    counters: ['Fanny', 'Ling', 'Lancelot', 'Joy', 'Benedetta', 'Harith', 'Nolan', 'Suyou', 'Hayabusa'],
    reason: 'Bouncing Ball disrupts and cancels all mobility dashes'
  },
  'Phoveus': {
    counters: ['Fanny', 'Ling', 'Lancelot', 'Joy', 'Benedetta', 'Harith', 'Nolan', 'Wanwan'],
    reason: 'Astaros strikes punish enemy dashes and blinks'
  },

  // ── Anti-Heal / Anti-Sustain Specialists ──
  'Baxia': {
    counters: ['Estes', 'Floryn', 'Rafaela', 'Angela', 'Uranus', 'Esmeralda', 'Alice'],
    reason: 'Passive healing reduction neutralizes sustain compositions'
  },

  // ── Anti-Projectile / Barrage Shield ──
  'Lolita': {
    counters: ['Beatrix', 'Chang\'e', 'Claude', 'Granger', 'Kimmy', 'Novaria', 'Bruno', 'Moskov', 'Wanwan'],
    reason: 'Guardian\'s Bulwark absorbs and blocks all incoming projectile damage'
  },

  // ── Unbreakable Suppression / Assassin Lockdown ──
  'Franco': {
    counters: ['Fanny', 'Ling', 'Hayabusa', 'Lancelot', 'Suyou', 'Nolan'],
    reason: 'Bloody Hunt suppression shuts down slippery hypercarries'
  },
  'Kaja': {
    counters: ['Fanny', 'Ling', 'Hayabusa', 'Lancelot', 'Suyou', 'Nolan'],
    reason: 'Divine Judgment suppression kidnaps priority targets without cleanse'
  },

  // ── Tank Shredders / % Max HP True Damage ──
  'Karrie': {
    counters: ['Barats', 'Fredrinn', 'Baxia', 'Grock', 'Uranus', 'Terizla', 'Tigreal', 'Minotaur', 'Edith'],
    reason: 'Lightwheel Mark deals true percentage HP damage to tanks'
  },
  'Claude': {
    counters: ['Barats', 'Fredrinn', 'Baxia', 'Uranus', 'Terizla', 'Minotaur'],
    reason: 'Demon Hunter Sword stacking melts heavy frontliners'
  },
  'Lunox': {
    counters: ['Barats', 'Fredrinn', 'Baxia', 'Uranus', 'Terizla', 'Tigreal'],
    reason: 'Chaos Assault penetrates high magic resistance tanks'
  },

  // ── Dive Assassins counter Immobile Backline Artillery ──
  'Ling': {
    counters: ['Pharsa', 'Yve', 'Xavier', 'Vexana', 'Layla', 'Zhuxin'],
    reason: 'Wall mobility dives straight into unprotected backline snipers'
  },
  'Hayabusa': {
    counters: ['Pharsa', 'Yve', 'Xavier', 'Novaria', 'Layla', 'Zhuxin'],
    reason: 'Shadow execution assassinates isolated artillery mages'
  },
  'Nolan': {
    counters: ['Pharsa', 'Yve', 'Xavier', 'Novaria', 'Vexana'],
    reason: 'Dimensional rift burst deletes immobile backliners'
  },
  'Fanny': {
    counters: ['Pharsa', 'Yve', 'Xavier', 'Layla', 'Novaria'],
    reason: 'High-speed cables bypass frontline tanks directly to the backline'
  },

  // ── Ultimate Steal & Teamfight Counter ──
  'Valentina': {
    counters: ['Faramis', 'Minotaur', 'Atlas', 'Terizla', 'Diggie', 'Mathilda'],
    reason: 'I Am You steals game-changing teamfight ultimates'
  },

  // ── Airborne / Channelling Disruption ──
  'Chou': {
    counters: ['Pharsa', 'Yve', 'Gord', 'Odette', 'Lancelot'],
    reason: 'Jeet Kune Do & Way of Dragon cancel channeled ultimates'
  },
  'Arlott': {
    counters: ['Pharsa', 'Yve', 'Gord'],
    reason: 'Final Slash sweeps and cancels channeled spells'
  }
};

/**
 * Evaluates draft matchup between user's heroes and opponent's heroes.
 * @param {Array<string>|Object} userHeroes - map or array of user hero names
 * @param {Array<string>|Object} oppHeroes - map or array of opponent hero names
 * @returns {Object} { userScore, oppScore, netBonus, breakdown }
 */
export function calcHeroCounters(userHeroes, oppHeroes) {
  const uList = Array.isArray(userHeroes) ? userHeroes : Object.values(userHeroes || {}).map(h => (typeof h === 'string' ? h : h?.hero)).filter(Boolean);
  const oList = Array.isArray(oppHeroes) ? oppHeroes : Object.values(oppHeroes || {}).map(h => (typeof h === 'string' ? h : h?.hero)).filter(Boolean);

  let userScore = 0;
  let oppScore = 0;
  const userBreakdown = [];
  const oppBreakdown = [];

  // Evaluate user counters against opp
  uList.forEach(uHero => {
    const rule = HERO_COUNTERS[uHero];
    if (rule) {
      oList.forEach(oHero => {
        if (rule.counters.includes(oHero)) {
          userScore += 1;
          userBreakdown.push(`${uHero} counters ${oHero}`);
        }
      });
    }
  });

  // Evaluate opp counters against user
  oList.forEach(oHero => {
    const rule = HERO_COUNTERS[oHero];
    if (rule) {
      uList.forEach(uHero => {
        if (rule.counters.includes(uHero)) {
          oppScore += 1;
          oppBreakdown.push(`${oHero} counters ${uHero}`);
        }
      });
    }
  });

  // Subtle tactical nudge: Each net counter awards +/- 0.8% win odds (capped gently between -2.5% and +2.5%)
  const netDiff = userScore - oppScore;
  const netBonus = Math.max(-2.5, Math.min(2.5, +(netDiff * 0.8).toFixed(1)));

  return {
    userScore,
    oppScore,
    netDiff,
    netBonus,
    userBreakdown,
    oppBreakdown,
    hasAdvantage: netDiff > 0,
    hasDisadvantage: netDiff < 0
  };
}
