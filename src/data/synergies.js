// MLBB Synergy and Chemistry Engine
// Computes active regional synergies, era traits, and iconic duos for any roster.

export const REGIONAL_SYNERGIES = {
  Philippines: {
    id: 'ph',
    name: 'Codebreaker Macro',
    flag: '🇵🇭',
    region: 'MPL PH',
    description: 'Disciplined objective control and Lord pit execution.',
    thresholds: [
      { count: 3, bonusOvr: 3, perk: '+15% Lord steal chance' },
      { count: 5, bonusOvr: 6, perk: '+30% Lord steal & teamfight clutch' }
    ]
  },
  Indonesia: {
    id: 'id',
    name: 'Royal Aggression',
    flag: '🇮🇩',
    region: 'MPL ID',
    description: 'Explosive early teamfighting and high-tempo lane invasion.',
    thresholds: [
      { count: 3, bonusOvr: 3, perk: '+20% First Blood odds' },
      { count: 5, bonusOvr: 6, perk: '+35% Early game domination' }
    ]
  },
  Russia: {
    id: 'cis',
    name: 'Frostbite Grit',
    flag: '🇷🇺',
    region: 'MCC / CIS',
    description: 'Relentless teamfight skirmishing and fearless underdog plays.',
    thresholds: [
      { count: 3, bonusOvr: 3, perk: '+4 bonus OVR vs higher-rated foes' },
      { count: 5, bonusOvr: 6, perk: '+8 bonus OVR vs higher-rated foes' }
    ]
  },
  Malaysia: {
    id: 'my',
    name: 'Sultan Macro',
    flag: '🇲🇾',
    region: 'MPL MY',
    description: 'Patient high-ground defense and split-push wave management.',
    thresholds: [
      { count: 3, bonusOvr: 3, perk: '+20% Comeback odds when behind' },
      { count: 5, bonusOvr: 6, perk: '+40% Base crystal defense' }
    ]
  },
  'United States': {
    id: 'na',
    name: 'Lone Star Carry',
    flag: '🇺🇸',
    region: 'NACT',
    description: 'Western hyper-carry jungle funneling and skirmish confidence.',
    thresholds: [
      { count: 2, bonusOvr: 2, perk: '+3 OVR to Jungler' },
      { count: 4, bonusOvr: 5, perk: '+6 OVR to Jungler & Gold Laner' }
    ]
  }
};

export const ICONIC_DUOS = [
  {
    id: 'v33wise',
    name: 'V33Wise Duo',
    badge: '👑',
    players: ['OhMyV33NUS', 'Wise'],
    description: 'The legendary shotcalling duo. Ultimate objective rotation.',
    bonusOvr: 3
  },
  {
    id: 'royal_besties',
    name: 'Royal Besties',
    badge: '⚡',
    players: ['Kairi', 'Kiboy'],
    description: 'Unstoppable Jungle-Roam synergy. Deadly ganks and dives.',
    bonusOvr: 3
  },
  {
    id: 'kings_of_kings',
    name: 'Kings of Kings',
    badge: '🦁',
    players: ['Lemon', 'Tuturu'],
    description: 'Original RRQ legends. Unshakable clutch in Game 5.',
    bonusOvr: 4
  },
  {
    id: 'btk_brothers',
    name: 'BTK Brotherhood',
    badge: '🦅',
    players: ['MobaZane', 'Shark'],
    description: 'North America\'s finest. High-stakes objective smites.',
    bonusOvr: 3
  },
  {
    id: 'tzy_duo',
    name: 'Tzy Alliance',
    badge: '⚔️',
    players: ['KarlTzy', 'FlapTzy'],
    description: 'Double M-World championship pedigree.',
    bonusOvr: 3
  },
  {
    id: 'cis_vanguard',
    name: 'CIS Vanguard',
    badge: '🐻',
    players: ['Kid Bomba', 'Sunset Lover'],
    description: 'Fierce teamfight initiators who break foreign metas.',
    bonusOvr: 3
  },
  {
    id: 'srg_champs',
    name: 'Red Giants Core',
    badge: '🔥',
    players: ['Sekysss', 'YumS'],
    description: 'MSC 2024 Champion Jungle-Roam telepathy.',
    bonusOvr: 3
  },
  {
    id: 'homebois_pair',
    name: 'HomeBois Stars',
    badge: '🎯',
    players: ['Udil', 'Xorn'],
    description: 'Spicy playmakers capable of turnarounds out of nowhere.',
    bonusOvr: 3
  }
];

export const ERA_TRAITS = [
  {
    id: 'classic',
    name: 'Classic Era Veterans',
    badge: '📜',
    years: [2018, 2019, 2020],
    minCount: 3,
    description: 'Old-school grit. Immune to elimination nerves in Game 5.',
    bonusOvr: 2
  },
  {
    id: 'golden',
    name: 'Golden Era Champions',
    badge: '🏆',
    years: [2021, 2022, 2023],
    minCount: 3,
    description: 'Peak M-series dynasty mechanics and tournament composure.',
    bonusOvr: 2
  },
  {
    id: 'modern',
    name: 'Modern Prodigies',
    badge: '🚀',
    years: [2024, 2025, 2026],
    minCount: 3,
    description: 'Micro-mechanical speed and explosive early leads.',
    bonusOvr: 2
  }
];

/**
 * Evaluates all active synergies for a given roster.
 * @param {Object} roster - map of role -> player object
 * @returns {Object} { activeSynergies, activeDuos, activeEra, totalSynergyOvr }
 */
export function computeRosterSynergies(roster) {
  const players = Object.values(roster || {});
  if (!players.length) {
    return { activeSynergies: [], activeDuos: [], activeEra: null, totalSynergyOvr: 0 };
  }

  const igns = new Set(players.map(p => p.ign));
  let totalSynergyOvr = 0;

  // 1. Regional Synergies
  const countryCounts = {};
  players.forEach(p => {
    if (p.country) {
      countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
    }
  });

  const activeSynergies = [];
  Object.entries(countryCounts).forEach(([country, count]) => {
    const config = REGIONAL_SYNERGIES[country];
    if (config) {
      // Find highest satisfied threshold
      const tier = [...config.thresholds].reverse().find(t => count >= t.count);
      if (tier) {
        totalSynergyOvr += tier.bonusOvr;
        activeSynergies.push({
          id: config.id,
          name: config.name,
          flag: config.flag,
          country,
          count,
          bonusOvr: tier.bonusOvr,
          perk: tier.perk
        });
      }
    } else if (count >= 3) {
      // Generic country synergy for other countries
      const bonus = count >= 5 ? 5 : 2;
      totalSynergyOvr += bonus;
      activeSynergies.push({
        id: country.toLowerCase().replace(/\s+/g, '_'),
        name: `${country} Unity`,
        flag: '🌍',
        country,
        count,
        bonusOvr: bonus,
        perk: `${count}/5 same-country chemistry boost`
      });
    }
  });

  // 2. Iconic Duos
  const activeDuos = [];
  ICONIC_DUOS.forEach(duo => {
    if (duo.players.every(name => igns.has(name))) {
      totalSynergyOvr += duo.bonusOvr;
      activeDuos.push(duo);
    }
  });

  // 3. Era Traits
  let activeEra = null;
  for (const era of ERA_TRAITS) {
    const matchingPlayers = players.filter(p => era.years.includes(p.year));
    if (matchingPlayers.length >= era.minCount) {
      totalSynergyOvr += era.bonusOvr;
      activeEra = { ...era, count: matchingPlayers.length };
      break;
    }
  }

  // 4. Franchise Synergy (Same Organization/Team Chemistry)
  const teamCounts = {};
  players.forEach(p => {
    if (p.teamKey) {
      const baseTeam = p.teamKey.replace(/\s\d{4}$/, '').trim();
      teamCounts[baseTeam] = (teamCounts[baseTeam] || 0) + 1;
    }
  });

  let activeFranchise = null;
  Object.entries(teamCounts).forEach(([teamName, count]) => {
    if (count >= 3) {
      let bonusOvr = 2;
      let perk = `${count}/5 Franchise Trio: synchronized teamfight rotations`;
      if (count === 4) {
        bonusOvr = 3;
        perk = '4/5 Franchise Core: advanced macro coordination & wave sync';
      } else if (count >= 5) {
        bonusOvr = 5;
        perk = '5/5 Championship Dynasty: flawless comms, instinctual teamfights';
      }
      totalSynergyOvr += bonusOvr;
      activeFranchise = {
        name: `${teamName} Chemistry`,
        teamName,
        count,
        bonusOvr,
        perk
      };
    }
  });

  // 5. Disconnected Solo-Queue Roster Penalty
  // In pro play, 5 disconnected players from 5 different rosters without regional or duo chemistry suffer slight comms friction
  const isDisconnected = players.length >= 5 && !activeFranchise && activeSynergies.length === 0 && activeDuos.length === 0;
  if (isDisconnected) {
    totalSynergyOvr -= 2;
  }

  return {
    activeSynergies,
    activeDuos,
    activeEra,
    activeFranchise,
    isDisconnected,
    totalSynergyOvr
  };
}
