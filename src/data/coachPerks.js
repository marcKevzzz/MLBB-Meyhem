// MLBB Roguelike Coach Perks Catalog
// 4 Distinct Rarities: Legendary (🌟 Gold Prismatic), Epic (💜 Violet), Rare (🩵 Cyan), Common (🤍 Silver)
// Rich variety with calibrated rarity weights so Legendary is an elusive, exciting jackpot.

export const COACH_PERKS = [
  // ══════════════════════════════════════════════════════════════
  // ── Legendary Perks (🌟 Golden Prismatic Tier: Elusive Jackpots) ──
  // ══════════════════════════════════════════════════════════════
  {
    id: 'm_world_dynasty',
    name: 'M-World Championship Aura',
    rarity: 'legendary',
    icon: '🏆',
    tagline: 'Grand Stage Composure',
    description: 'The aura of world champions flows through your squad, granting +5% win chance in the Semis and +7% in the Grand Finals.',
    effect: { type: 'playoff_god_mode', amount: 7 }
  },
  {
    id: 'silver_bullet_draft',
    name: 'Target Ban Mastermind',
    rarity: 'legendary',
    icon: '🎯',
    tagline: 'Carry Neutralization',
    description: 'Your coaching staff completely decodes the opposing star playmaker, neutralizing their impact for a +5.5% series win edge.',
    effect: { type: 'counter_neutralize', amount: 5.5 }
  },
  {
    id: 'divine_retribution',
    name: 'Divine Retribution',
    rarity: 'legendary',
    icon: '⚡',
    tagline: 'Clutch Objective Smites',
    description: 'Unlocks god-tier smite timing at the Lord pit. Grants +7% win chance in decider games or whenever trailing in a series.',
    effect: { type: 'decider_smite', amount: 7 }
  },
  {
    id: 'apex_hypercarry',
    name: 'Apex Carry Protocol',
    rarity: 'legendary',
    icon: '👑',
    tagline: 'Superstar Ascension',
    description: 'If either your Jungler or Gold Laner has 85+ OVR, your team coordinates entirely around their lead for a +5% teamfight bonus.',
    effect: { type: 'apex_carry', amount: 5 }
  },
  {
    id: 'time_rewind_reset',
    name: 'Tactical Time Rewind',
    rarity: 'legendary',
    icon: '🌌',
    tagline: 'Finals Safety Net',
    description: 'Once during the Semis or Grand Finals, rewinds a match defeat, negating the loss and granting an immediate second chance.',
    effect: { type: 'shield_finals', amount: 1 }
  },

  // ══════════════════════════════════════════════════════════════
  // ── Epic Perks (💜 Violet Tier: Powerful Specialized Strategies) ──
  // ══════════════════════════════════════════════════════════════
  {
    id: 'immortal_armor',
    name: 'Immortal Armor',
    rarity: 'epic',
    icon: '🛡️',
    tagline: 'Base Defense Revival',
    description: 'Negates your team\'s first game defeat in the playoffs, providing one essential tournament safety net.',
    effect: { type: 'shield_loss', amount: 1 }
  },
  {
    id: 'blade_of_despair',
    name: 'Blade of Despair',
    rarity: 'epic',
    icon: '⚔️',
    tagline: 'Game 5 Executioner',
    description: 'When facing elimination in Game 5, your carries tap into maximum clutch mechanics (+5% win chance).',
    effect: { type: 'clutch_ovr', amount: 5 }
  },
  {
    id: 'high_ground_fortress',
    name: 'Base Defense Lockdown',
    rarity: 'epic',
    icon: '🏰',
    tagline: 'Never Say Die',
    description: 'When trailing behind in a BO5 series (0-1 or 1-2), your team rallies with +5% comeback odds.',
    effect: { type: 'comeback_boost', amount: 5 }
  },
  {
    id: 'lord_dominance',
    name: 'Smite Discipline',
    rarity: 'epic',
    icon: '🐉',
    tagline: '50/50 Retribution Focus',
    description: 'Improves late-game Lord pit smite timing, granting a +4% win chance in close matches.',
    effect: { type: 'objective_boost', amount: 4 }
  },
  {
    id: 'lvl1_buff_invade',
    name: 'Level 1 Jungle Invade',
    rarity: 'epic',
    icon: '🥷',
    tagline: 'Early Game Chokehold',
    description: 'Your Roamer and Mid coordinate an explosive level 1 buff steal, delaying the enemy spike for a +4% early game edge.',
    effect: { type: 'invade_boost', amount: 4 }
  },
  {
    id: 'split_push_telepathy',
    name: 'Split-Push Decoy',
    rarity: 'epic',
    icon: '🏹',
    tagline: 'Map Pressure Overload',
    description: 'Your EXP Laner applies endless sidelane pressure, forcing messy enemy rotations for a +4% macro advantage.',
    effect: { type: 'split_boost', amount: 4 }
  },
  {
    id: 'flawless_micro',
    name: 'Mechanical Transcendence',
    rarity: 'epic',
    icon: '💎',
    tagline: 'Fingertip Precision',
    description: 'Intense reaction-time conditioning grants your core playmakers a +4% boost in high-intensity 5v5 teamfights.',
    effect: { type: 'micro_boost', amount: 4 }
  },

  // ══════════════════════════════════════════════════════════════
  // ── Rare Perks (🩵 Cyan Tier: Targeted Tactical Upgrades) ──
  // ══════════════════════════════════════════════════════════════
  {
    id: 'scouting_mastery',
    name: 'Analyst Scouting',
    rarity: 'rare',
    icon: '👁️',
    tagline: 'Lane Exploitation',
    description: 'Identifies flaws in the opponent’s draft, granting your team a +3% macro advantage.',
    effect: { type: 'scout_boost', amount: 3 }
  },
  {
    id: 'turtle_tempo',
    name: 'Turtle Stacking',
    rarity: 'rare',
    icon: '🐢',
    tagline: 'Early Gold Shield',
    description: 'Prioritizes early neutral objectives, giving +3% win probability across all games.',
    effect: { type: 'global_win_chance', amount: 3 }
  },
  {
    id: 'vocal_captain',
    name: 'Shotcaller Aura',
    rarity: 'rare',
    icon: '📢',
    tagline: 'Macro Synergy',
    description: 'Your Roamer directs rotations cleanly, giving +3% teamfight coordination.',
    effect: { type: 'roamer_aura', amount: 3 }
  },
  {
    id: 'home_crowd',
    name: 'Arena Momentum',
    rarity: 'rare',
    icon: '🏟️',
    tagline: 'Crowd Roar in Game 1',
    description: 'The roaring arena crowd energizes your roster, giving +4% momentum in Games 1 & 2.',
    effect: { type: 'early_momentum', amount: 4 }
  },
  {
    id: 'gold_lane_funnel',
    name: 'Gold Lane Priority',
    rarity: 'rare',
    icon: '🪙',
    tagline: 'Marksman Scaling',
    description: 'Allocates extra jungle waves to the Gold Laner, adding +3% win chance in late-game teamfights.',
    effect: { type: 'gold_lane_boost', amount: 3 }
  },
  {
    id: 'draft_flexibility',
    name: 'Pocket Counterpick',
    rarity: 'rare',
    icon: '🎭',
    tagline: 'Surprise Strategy',
    description: 'Catches the enemy by surprise with an unexpected hero pick (+3.5% series win rate).',
    effect: { type: 'flex_boost', amount: 3.5 }
  },
  {
    id: 'flash_initiation',
    name: 'Vision Bait & Ambush',
    rarity: 'rare',
    icon: '🔮',
    tagline: 'Bush Control Traps',
    description: 'Baiting face-checks in crucial objective bushes yields devastating pickoffs (+3.5% pickoff victory odds).',
    effect: { type: 'bait_boost', amount: 3.5 }
  },
  {
    id: 'exp_lane_bully',
    name: 'Offlane Dominance',
    rarity: 'rare',
    icon: '🛡️',
    tagline: 'Top-Side Freedom',
    description: 'Your EXP Laner pins down the opposing offlaner, giving your Jungler complete invasion freedom (+3% odds).',
    effect: { type: 'exp_dom_boost', amount: 3 }
  },
  {
    id: 'crab_neutral_control',
    name: 'Gold Crab Control',
    rarity: 'rare',
    icon: '🦀',
    tagline: 'Lane Economy Lead',
    description: 'Disciplined early neutral monster control provides a steady +3% gold scaling edge.',
    effect: { type: 'crab_boost', amount: 3 }
  },
  {
    id: 'mid_lane_prio',
    name: 'Mid Lane Fast Push',
    rarity: 'rare',
    icon: '🏛️',
    tagline: 'Central Map Authority',
    description: 'Rapid mid-lane wave clearance opens up lightning fast side-ganks (+3% rotation odds).',
    effect: { type: 'mid_prio_boost', amount: 3 }
  },
  {
    id: 'tier2_tower_defense',
    name: 'Inner Turret Fortification',
    rarity: 'rare',
    icon: '🏰',
    tagline: 'High-Ground Discipline',
    description: 'Patients under tower stalls aggressive opponent dives, yielding +3.5% defensive composure.',
    effect: { type: 'defense_boost', amount: 3.5 }
  },

  // ══════════════════════════════════════════════════════════════
  // ── Common Perks (🤍 Silver Tier: Abundant Foundational Upgrades) ──
  // ══════════════════════════════════════════════════════════════
  {
    id: 'bootcamp_drill',
    name: 'Late-Night Scrims',
    rarity: 'common',
    icon: '🎯',
    tagline: 'Mechanical Tuning',
    description: 'Sharpened micro-mechanics add a subtle +2% boost to individual lane clashes.',
    effect: { type: 'drill_boost', amount: 2 }
  },
  {
    id: 'bush_ambush',
    name: 'River Bush Trap',
    rarity: 'common',
    icon: '🌿',
    tagline: 'First Blood Ambush',
    description: 'Improves early vision control in the river, granting +2.5% early-game odds.',
    effect: { type: 'ambush_boost', amount: 2.5 }
  },
  {
    id: 'energy_drink',
    name: 'Endurance Hydration',
    rarity: 'common',
    icon: '🥤',
    tagline: 'Stamina in Deciders',
    description: 'Maintains player focus through long marathons, granting +3% in Games 4 & 5.',
    effect: { type: 'stamina_boost', amount: 3 }
  },
  {
    id: 'comfort_picks',
    name: 'Comfort Hero Mastery',
    rarity: 'common',
    icon: '✨',
    tagline: 'Signature Confidence',
    description: 'Players execute with +2% higher confidence when on their primary signature hero.',
    effect: { type: 'signature_boost', amount: 2 }
  },
  {
    id: 'minion_wave_mgmt',
    name: 'Freeze Lane Wave',
    rarity: 'common',
    icon: '🌊',
    tagline: 'EXP Lane Discipline',
    description: 'Your EXP Laner manages waves patiently, reducing the enemy team’s early tower push (+2% odds).',
    effect: { type: 'wave_boost', amount: 2 }
  },
  {
    id: 'mental_fortitude',
    name: 'Sports Psychologist',
    rarity: 'common',
    icon: '🧠',
    tagline: 'Composure Reset',
    description: 'Prevents tilt after a lost game, stabilizing series performance (+2.5% bounceback).',
    effect: { type: 'mental_boost', amount: 2.5 }
  },
  {
    id: 'potion_refill',
    name: 'Post-Game Debrief',
    rarity: 'common',
    icon: '📋',
    tagline: 'Rapid Video Review',
    description: 'Quick tactical whiteboard review between games grants a steady +2% consistency boost.',
    effect: { type: 'debrief_boost', amount: 2 }
  },
  {
    id: 'scrim_vod_review',
    name: 'VOD Replay Analysis',
    rarity: 'common',
    icon: '📼',
    tagline: 'Pattern Recognition',
    description: 'Studying enemy rotation habits awards a clean +2% positioning advantage.',
    effect: { type: 'vod_boost', amount: 2 }
  },
  {
    id: 'hand_warmers',
    name: 'Hand Warmers & Grip',
    rarity: 'common',
    icon: '🧤',
    tagline: 'Skillshot Agility',
    description: 'Warm hands maintain lightning-fast response times, granting +2% skillshot consistency.',
    effect: { type: 'hand_boost', amount: 2 }
  },
  {
    id: 'wave_clear_rotation',
    name: 'Fast Wave Push',
    rarity: 'common',
    icon: '⚡',
    tagline: 'Tempo Acceleration',
    description: 'Fast lane-clearing enables quicker roams across river choke points (+2% odds).',
    effect: { type: 'wave_clear_boost', amount: 2 }
  },
  {
    id: 'smiteless_leash',
    name: 'Flawless Jungle Leash',
    rarity: 'common',
    icon: '🐺',
    tagline: 'Clean Camp Clear',
    description: 'A crisp level 1 leash saves Retribution for contested river objectives (+2% odds).',
    effect: { type: 'leash_boost', amount: 2 }
  },
  {
    id: 'target_pinging',
    name: 'Target Focus Pings',
    rarity: 'common',
    icon: '📌',
    tagline: 'Unified Focus Fire',
    description: 'Clear shotcaller pinging collapses all damage onto isolated carries (+2% teamfight odds).',
    effect: { type: 'ping_boost', amount: 2 }
  },
  {
    id: 'comfort_itemization',
    name: 'Situational Item Prep',
    rarity: 'common',
    icon: '🛡️',
    tagline: 'Counter-Item Spikes',
    description: 'Smart defensive item adjustments mitigate early opponent burst (+2% mitigation odds).',
    effect: { type: 'item_boost', amount: 2 }
  },
  {
    id: 'buff_timer_tracking',
    name: 'Buff Respawn Tracking',
    rarity: 'common',
    icon: '⏱️',
    tagline: 'Jungle Clock Timing',
    description: 'Tracking exact neutral respawn timers sets up flawless ambush traps (+2% odds).',
    effect: { type: 'clock_boost', amount: 2 }
  },
  {
    id: 'coach_timeout_reset',
    name: 'Tactical Pep Talk',
    rarity: 'common',
    icon: '🗣️',
    tagline: 'Huddle Reset',
    description: 'A motivational huddle resets mental fatigue and refuels team energy (+2% odds).',
    effect: { type: 'huddle_boost', amount: 2 }
  }
];

/**
 * Returns 3 randomized perk choices for the post-match reward modal.
 * Uses calibrated rarity weights (Legendary: 0.18, Epic: 0.9, Rare: 2.8, Common: 8.0)
 * making Commons abundant, Rares steady, Epics notable, and Legendaries genuinely rare!
 */
export function getPerkChoices(existingPerkIds = []) {
  const available = COACH_PERKS.filter(p => !existingPerkIds.includes(p.id));
  
  const pool = [];
  available.forEach(p => {
    let weight = 8.0;                    // Common: 8.0
    if (p.rarity === 'rare') weight = 2.8; // Rare: 2.8
    if (p.rarity === 'epic') weight = 0.9; // Epic: 0.9
    if (p.rarity === 'legendary') weight = 0.18; // Legendary: 0.18 (rare holy grail!)
    for (let i = 0; i < Math.max(1, Math.round(weight * 10)); i++) {
      pool.push(p);
    }
  });

  const picked = [];
  const pickedIds = new Set();

  while (picked.length < 3 && available.length > picked.length) {
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    if (!pickedIds.has(candidate.id)) {
      pickedIds.add(candidate.id);
      picked.push(candidate);
    }
  }

  return picked;
}

/**
 * Generates balanced, non-excessive AI Coach Perks for Playoff opponents.
 * - Quarter Finals: No perks (clean competitive entry)
 * - Semi Finals: 1 Moderate Perk (Common or Rare, e.g. +2.5% to +3.5%)
 * - Grand Finals: 1 to 2 Moderate Perks (Rare or Epic, strictly NO Legendary)
 */
export function getOpponentCoachPerks(roundIdx) {
  if (roundIdx < 2) return [];

  // Filter strictly to non-legendary perks
  const moderatePerks = COACH_PERKS.filter(p => p.rarity === 'rare' || p.rarity === 'epic' || p.rarity === 'common');
  
  if (roundIdx === 2) {
    // Semis: 1 Rare or Common tactical perk (+2.5% - +3.5%)
    const semisPool = moderatePerks.filter(p => p.rarity === 'rare' || p.rarity === 'common');
    const picked = semisPool[Math.floor(Math.random() * semisPool.length)];
    return picked ? [picked] : [];
  }

  if (roundIdx >= 3) {
    // Grand Finals: 1-2 balanced perks (Rare/Epic, e.g. +3% - +4%, never game-breaking)
    const finalsPool = moderatePerks.filter(p => p.rarity === 'rare' || p.rarity === 'epic');
    const shuffled = [...finalsPool].sort(() => 0.5 - Math.random());
    const count = Math.random() < 0.65 ? 2 : 1;
    return shuffled.slice(0, count);
  }

  return [];
}
