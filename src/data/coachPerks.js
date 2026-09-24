// MLBB Roguelike Coach Perks Catalog
// 4 Distinct Rarities: Legendary (🌟 Gold Prismatic), Epic (💜 Violet), Rare (🩵 Cyan), Common (🤍 Silver)
// Rich variety with specific numbers, targeted roles, and tactical buffs so players read and strategize!

export const COACH_PERKS = [
  // ══════════════════════════════════════════════════════════════
  // ── Legendary Perks (🌟 Golden Prismatic Tier: Elusive Jackpots) ──
  // ══════════════════════════════════════════════════════════════
  {
    id: "m_world_dynasty",
    name: "M-World Championship Aura",
    rarity: "legendary",
    icon: "🏆",
    targetRole: "Team",
    tagline: "Grand Stage Composure",
    buffStats: [
      { label: "+15% Championship Composure", type: "clutch" },
      { label: "+25% Late-Game Macro", type: "macro" }
    ],
    description:
      "The aura of world champions flows through your squad. Grants +15% performance in playoff & championship stages, plus +25% macro execution against historic dynasties.",
    effect: { type: "championship_aura", playoffBoost: 6.0, finalsBoost: 7.5 }
  },
  {
    id: "divine_retribution",
    name: "God-Tier Retribution",
    rarity: "legendary",
    icon: "⚡",
    targetRole: "Jungler",
    tagline: "Pixel-Perfect Smite",
    buffStats: [
      { label: "+40% Smite True DMG", type: "smite" },
      { label: "+25% 50/50 Lord Pit Edge", type: "spd" }
    ],
    description:
      "Your Jungler acquires pixel-perfect Retribution timing. Grants +40% true damage on neutral smites and +25% objective steal odds in decider games.",
    effect: { type: "smite_master", baseSmite: 4.5, deciderSmite: 7.5 }
  },
  {
    id: "apex_hypercarry",
    name: "Apex Gold Hypercarry",
    rarity: "legendary",
    icon: "👑",
    targetRole: "Gold",
    tagline: "Marksman Ascension",
    buffStats: [
      { label: "+24% Physical Damage", type: "atk" },
      { label: "+18% Attack Speed", type: "spd" },
      { label: "+15% Late-Game Scaling", type: "crit" }
    ],
    description:
      "All team resources funnel to your Gold Laner. If your Gold Laner has 82+ OVR, they deal +24% bonus damage with +18% attack speed, taking over 5v5 teamfights.",
    effect: { type: "gold_hypercarry", threshold: 82, bonus: 6.0, fallback: 3.0 }
  },
  {
    id: "iron_bastion_roam",
    name: "Impenetrable Vanguard",
    rarity: "legendary",
    icon: "🛡️",
    targetRole: "Roamer",
    tagline: "Unbreakable Frontline",
    buffStats: [
      { label: "+35% Frontline Armor & Res", type: "def" },
      { label: "+500 Team Shield on Engage", type: "hp" }
    ],
    description:
      "Your Roamer transforms into an unkillable frontline fortress. Mitigates +35% incoming burst damage and grants +500 HP team shields during major Lord clashes.",
    effect: { type: "tank_bastion", tankBonus: 5.5 }
  },
  {
    id: "tactical_time_rewind",
    name: "Tactical Time Rewind",
    rarity: "legendary",
    icon: "🌌",
    targetRole: "Tactical",
    tagline: "Defeat Reversal",
    buffStats: [
      { label: "1 Match Loss Negation", type: "clutch" },
      { label: "+10% Rematch Momentum", type: "surge" }
    ],
    description:
      "Once per championship run, completely rewinds and negates a match defeat, granting an immediate second chance with +10% rally momentum.",
    effect: { type: "shield_finals", amount: 1 }
  },

  // ══════════════════════════════════════════════════════════════
  // ── Epic Perks (💜 Violet Tier: Specialized Strategic Weapons) ──
  // ══════════════════════════════════════════════════════════════
  {
    id: "assassin_shadow_ambush",
    name: "Predator Jungle Invade",
    rarity: "epic",
    icon: "🥷",
    targetRole: "Jungler",
    tagline: "Minute-1 Buff Steal",
    buffStats: [
      { label: "+30% Early Buff Invade", type: "spd" },
      { label: "+20% Carry Assassination", type: "atk" }
    ],
    description:
      "Your Jungler coordinates an explosive minute-1 invade, delaying the opposing core's level 4 spike by +30% and isolating priority targets.",
    effect: { type: "jungler_invade", bonus: 4.5 }
  },
  {
    id: "glass_cannon_protocol",
    name: "Glass Cannon Protocol",
    rarity: "epic",
    icon: "💥",
    targetRole: "Team",
    tagline: "High-Risk Pure Lethality",
    buffStats: [
      { label: "+28% Team Burst Damage", type: "atk" },
      { label: "-10% Frontline Armor", type: "penalty" }
    ],
    description:
      "High-risk tactical trade-off! Sacrifices defensive itemization for relentless burst firepower. Adds +28% team burst damage, but reduces frontline defense by -10%.",
    effect: { type: "glass_cannon", bonus: 4.0 }
  },
  {
    id: "base_defense_lockdown",
    name: "High-Ground Fortress",
    rarity: "epic",
    icon: "🏰",
    targetRole: "Tactical",
    tagline: "Anti-Siege Resilience",
    buffStats: [
      { label: "+45% Base Turret Defense", type: "def" },
      { label: "+30% Comeback Odds when Down", type: "surge" }
    ],
    description:
      "Anti-siege base defense mastery. When trailing in a series (0-1 or 1-2), your team rallies with +45% high-ground fortification and +30% comeback odds.",
    effect: { type: "comeback_boost", bonus: 5.0 }
  },
  {
    id: "mid_ap_overload",
    name: "Mid Artillery Overload",
    rarity: "epic",
    icon: "🔮",
    targetRole: "Mid",
    tagline: "Choke-Point Annihilation",
    buffStats: [
      { label: "+22% Magic Burst Power", type: "ap" },
      { label: "+16% Cooldown Reduction", type: "cdr" }
    ],
    description:
      "Enables your Mid Laner's area denial. Grants +22% magic burst power and +16% CDR, making river choke points impenetrable for enemy squishies.",
    effect: { type: "mid_ap", bonus: 4.2 }
  },
  {
    id: "exp_sidelane_split",
    name: "EXP Sidelane Bulldozer",
    rarity: "epic",
    icon: "🏹",
    targetRole: "EXP",
    tagline: "Sidelane Map Splitter",
    buffStats: [
      { label: "+35% Turret Siege Damage", type: "push" },
      { label: "+20% Sidelane Sustain", type: "vamp" }
    ],
    description:
      "Your EXP Laner applies endless sidelane pressure with +35% turret damage and +20% sustain, forcing 2 enemies to rotate away from key objectives.",
    effect: { type: "exp_split", bonus: 4.2 }
  },
  {
    id: "blade_of_despair_clutch",
    name: "Executioner Blade",
    rarity: "epic",
    icon: "⚔️",
    targetRole: "Tactical",
    tagline: "Game 5 Decider Lethality",
    buffStats: [
      { label: "+35% Decider Match Lethality", type: "clutch" },
      { label: "+15% Low-HP Execution", type: "atk" }
    ],
    description:
      "When facing elimination or playing match points (Game 3/5), carries tap into +35% clutch focus to quickly finish off low-HP opponents.",
    effect: { type: "clutch_ovr", bonus: 4.8 }
  },
  {
    id: "immortal_armor_safeguard",
    name: "Immortal Armor Safeguard",
    rarity: "epic",
    icon: "🛡️",
    targetRole: "Tactical",
    tagline: "Playoff Safety Shield",
    buffStats: [
      { label: "1 Match Loss Negation", type: "clutch" },
      { label: "Playoff Bracket Armor", type: "def" }
    ],
    description:
      "Equips your squad with a tournament revive crystal. Automatically negates your first game defeat in the playoff rounds.",
    effect: { type: "shield_loss", amount: 1 }
  },

  // ══════════════════════════════════════════════════════════════
  // ── Rare Perks (🩵 Cyan Tier: Targeted Tactical Upgrades) ──
  // ══════════════════════════════════════════════════════════════
  {
    id: "turtle_tempo_stacking",
    name: "Turtle Stacking Economy",
    rarity: "rare",
    icon: "🐢",
    targetRole: "Team",
    tagline: "Early Gold Shield",
    buffStats: [
      { label: "+350 Team Gold per Turtle", type: "gold" },
      { label: "+15% Early Neutral Shield", type: "def" }
    ],
    description:
      "Prioritizes early neutral objectives. Securing turtles yields +350 bonus team gold and a 15% protective shield across all three lanes.",
    effect: { type: "turtle_tempo", bonus: 3.2 }
  },
  {
    id: "pocket_counterpick",
    name: "Pocket Counterpick Draft",
    rarity: "rare",
    icon: "🎭",
    targetRole: "Tactical",
    tagline: "Draft Trap Mastermind",
    buffStats: [
      { label: "+18% Draft Counter Advantage", type: "macro" },
      { label: "+10% Surprise Pick Burst", type: "atk" }
    ],
    description:
      "Your coach blindsides the enemy draft with an unbanned comfort counterpick, neutralizing key enemy playmakers (+18% draft edge).",
    effect: { type: "counter_draft", bonus: 3.5 }
  },
  {
    id: "shotcaller_vocal_aura",
    name: "Vocal Captain Shotcalling",
    rarity: "rare",
    icon: "📢",
    targetRole: "Roamer",
    tagline: "Macro Rotation Sync",
    buffStats: [
      { label: "+20% Rotation Velocity", type: "macro" },
      { label: "+12% Teamfight Engage Timing", type: "spd" }
    ],
    description:
      "Your Roamer directs rotations cleanly. Grants +20% rotation velocity and +12% teamfight synergy, catching enemies out of position.",
    effect: { type: "roamer_shotcall", bonus: 3.2 }
  },
  {
    id: "marksman_funnel_priority",
    name: "Gold Lane Wave Funnel",
    rarity: "rare",
    icon: "🪙",
    targetRole: "Gold",
    tagline: "Item Spike Acceleration",
    buffStats: [
      { label: "+25% Minion Farm Velocity", type: "gold" },
      { label: "+14% Critical Hit Spike", type: "crit" }
    ],
    description:
      "Allocates extra jungle waves to your Gold Laner, accelerating their first 2 core item spikes by +25% with +14% crit bonus.",
    effect: { type: "gold_funnel", bonus: 3.4 }
  },
  {
    id: "bush_ambush_vision",
    name: "River Bush Ambush Traps",
    rarity: "rare",
    icon: "🔮",
    targetRole: "Team",
    tagline: "Bush Control Pickoffs",
    buffStats: [
      { label: "+28% First Blood Lethality", type: "atk" },
      { label: "+18% Face-Check Trap Odds", type: "spd" }
    ],
    description:
      "Disciplined river vision control. Baiting face-checks creates instant 4v5 pickoff advantages before contested Lord fights.",
    effect: { type: "bush_trap", bonus: 3.5 }
  },
  {
    id: "offlane_brawler_dominance",
    name: "Offlane Brawler Dominance",
    rarity: "rare",
    icon: "🛡️",
    targetRole: "EXP",
    tagline: "Top-Side Lane Pin",
    buffStats: [
      { label: "+22% 1v1 Lane Bullying", type: "atk" },
      { label: "+15% Dual Armor & Resist", type: "def" }
    ],
    description:
      "Your EXP Laner pins down the opposing offlaner with +22% trade damage, granting your Jungler complete freedom to invade.",
    effect: { type: "exp_brawler", bonus: 3.1 }
  },
  {
    id: "mid_lane_fast_clear",
    name: "Mid Lane Fast Push & Roam",
    rarity: "rare",
    icon: "🏛️",
    targetRole: "Mid",
    tagline: "Central Map Authority",
    buffStats: [
      { label: "+25% Wave Clear Velocity", type: "spd" },
      { label: "+16% Side-Lane Gank Lethality", type: "atk" }
    ],
    description:
      "Rapid mid wave clearance opens up lightning fast side-ganks (+25% wave clear, +16% gank lethality onto Gold lane).",
    effect: { type: "mid_roam", bonus: 3.0 }
  },
  {
    id: "gold_crab_neutral_control",
    name: "Neutral Gold Crab Control",
    rarity: "rare",
    icon: "🦀",
    targetRole: "Team",
    tagline: "Lane Economy Lead",
    buffStats: [
      { label: "+180 Gold per Neutral Camp", type: "gold" },
      { label: "+10% Sidelane Gold Lead", type: "gold" }
    ],
    description:
      "Disciplined sidelane neutral monster control provides a steady gold lead into the mid game.",
    effect: { type: "crab_control", bonus: 2.8 }
  },
  {
    id: "inner_turret_fortress",
    name: "Inner Turret Fortification",
    rarity: "rare",
    icon: "🏰",
    targetRole: "Team",
    tagline: "High-Ground Discipline",
    buffStats: [
      { label: "+30% Turret Attack Damage", type: "def" },
      { label: "+20% Defensive Zone Armor", type: "def" }
    ],
    description:
      "Patience under tower stalls aggressive opponent dives, yielding +30% turret damage and +20% defensive zone protection.",
    effect: { type: "turret_defense", bonus: 3.0 }
  },
  {
    id: "home_crowd_roar",
    name: "Arena Momentum Roar",
    rarity: "rare",
    icon: "🏟️",
    targetRole: "Tactical",
    tagline: "Early Game Surge",
    buffStats: [
      { label: "+25% Momentum in Games 1 & 2", type: "surge" },
      { label: "+12% First Blood Odds", type: "atk" }
    ],
    description:
      "The roaring stadium crowd energizes your roster early in the series, boosting Games 1 & 2 performance by +25%.",
    effect: { type: "crowd_momentum", bonus: 3.3 }
  },

  // ══════════════════════════════════════════════════════════════
  // ── Common Perks (🤍 Silver Tier: Foundational Operational Upgrades) ──
  // ══════════════════════════════════════════════════════════════
  {
    id: "comfort_signature_mastery",
    name: "Comfort Hero Mastery",
    rarity: "common",
    icon: "✨",
    targetRole: "Team",
    tagline: "Signature Confidence",
    buffStats: [
      { label: "+12% Comfort Hero Focus", type: "atk" },
      { label: "+8% Micro Precision", type: "spd" }
    ],
    description:
      "Players execute with +12% higher confidence and sharper micro when locked into their primary signature heroes.",
    effect: { type: "signature_comfort", bonus: 2.3 }
  },
  {
    id: "late_night_scrims",
    name: "Late-Night Scrim Drills",
    rarity: "common",
    icon: "🎯",
    targetRole: "Team",
    tagline: "Mechanical Tuning",
    buffStats: [
      { label: "+10% Micro Reaction Time", type: "spd" },
      { label: "+8% Skillshot Accuracy", type: "atk" }
    ],
    description:
      "Sharpened micro-mechanics add a subtle +10% reaction boost to individual lane clashes and skillshot dodges.",
    effect: { type: "scrim_micro", bonus: 2.1 }
  },
  {
    id: "stamina_energy_hydration",
    name: "Endurance Hydration",
    rarity: "common",
    icon: "🥤",
    targetRole: "Tactical",
    tagline: "Stamina in Deciders",
    buffStats: [
      { label: "+20% Stamina in Games 4 & 5", type: "surge" },
      { label: "+10% Focus Retention", type: "clutch" }
    ],
    description:
      "Maintains player focus through long marathons, granting +20% stamina and preventing fatigue in Games 4 & 5.",
    effect: { type: "stamina_boost", bonus: 2.5 }
  },
  {
    id: "sports_psychologist",
    name: "Sports Psychologist",
    rarity: "common",
    icon: "🧠",
    targetRole: "Tactical",
    tagline: "Composure Reset",
    buffStats: [
      { label: "+18% Tilt Prevention", type: "clutch" },
      { label: "+14% Bounceback after Loss", type: "surge" }
    ],
    description:
      "Prevents tilt after a lost game, stabilizing mental composure for a +14% bounceback in the next match.",
    effect: { type: "mental_bounceback", bonus: 2.4 }
  },
  {
    id: "freeze_lane_discipline",
    name: "Freeze Lane Wave Control",
    rarity: "common",
    icon: "🌊",
    targetRole: "EXP",
    tagline: "EXP Wave Denial",
    buffStats: [
      { label: "+15% Wave Denial", type: "gold" },
      { label: "-12% Enemy XP Gain", type: "push" }
    ],
    description:
      "Your EXP Laner manages waves patiently near turret range, denying enemy farm and delaying opposing tower pushes.",
    effect: { type: "wave_freeze", bonus: 2.0 }
  },
  {
    id: "rapid_whiteboard_debrief",
    name: "Post-Game Video Debrief",
    rarity: "common",
    icon: "📋",
    targetRole: "Team",
    tagline: "Whiteboard Video Review",
    buffStats: [
      { label: "+12% Tactical Adaptation", type: "macro" },
      { label: "+10% Positioning Insight", type: "spd" }
    ],
    description:
      "Quick tactical whiteboard review between games grants +12% positional consistency and fixes rotation flaws.",
    effect: { type: "vod_adaptation", bonus: 2.0 }
  },
  {
    id: "hand_warmers_grip",
    name: "Hand Warmers & Grip",
    rarity: "common",
    icon: "🧤",
    targetRole: "Team",
    tagline: "Skillshot Agility",
    buffStats: [
      { label: "+14% Skillshot Reaction Speed", type: "spd" }
    ],
    description:
      "Warm hands maintain lightning-fast response times, granting +14% skillshot consistency on mobile controls.",
    effect: { type: "hand_warmers", bonus: 1.9 }
  },
  {
    id: "crisp_jungle_leash",
    name: "Flawless Jungle Leash",
    rarity: "common",
    icon: "🐺",
    targetRole: "Jungler",
    tagline: "Clean Camp Clear",
    buffStats: [
      { label: "+15% Initial Jungle Clear", type: "spd" },
      { label: "Saves Smite for River", type: "smite" }
    ],
    description:
      "A crisp level 1 leash saves Retribution for contested river objectives and accelerates level 2 rotations by +15%.",
    effect: { type: "clean_leash", bonus: 2.1 }
  },
  {
    id: "target_focus_pings",
    name: "Unified Focus Fire Pings",
    rarity: "common",
    icon: "📌",
    targetRole: "Team",
    tagline: "Carry Shutdown Pings",
    buffStats: [
      { label: "+16% Focus Fire DPS", type: "atk" },
      { label: "+10% Carry Isolation", type: "atk" }
    ],
    description:
      "Clear shotcaller pinging collapses all team damage onto isolated enemy carries during 5v5 teamfights.",
    effect: { type: "focus_fire", bonus: 2.2 }
  },
  {
    id: "situational_item_prep",
    name: "Counter-Item Preparation",
    rarity: "common",
    icon: "🛡️",
    targetRole: "Team",
    tagline: "Counter-Item Spikes",
    buffStats: [
      { label: "+15% Burst Mitigation", type: "def" }
    ],
    description:
      "Smart situational item adjustments mitigate early opponent burst with timely defensive counter-spikes.",
    effect: { type: "counter_items", bonus: 2.0 }
  },
  {
    id: "buff_respawn_clock",
    name: "Buff Respawn Clock Timing",
    rarity: "common",
    icon: "⏱️",
    targetRole: "Jungler",
    tagline: "Jungle Clock Timing",
    buffStats: [
      { label: "+18% Jungle Timer Precision", type: "macro" }
    ],
    description:
      "Tracking exact neutral respawn timers sets up flawless ambush traps around enemy buff spawns.",
    effect: { type: "timer_clock", bonus: 2.0 }
  },
  {
    id: "tactical_pep_talk",
    name: "Tactical Huddle Pep Talk",
    rarity: "common",
    icon: "🗣️",
    targetRole: "Team",
    tagline: "Huddle Reset",
    buffStats: [
      { label: "+12% Team Morale & Energy", type: "surge" }
    ],
    description:
      "A motivational huddle resets mental fatigue and refuels team energy across the roster.",
    effect: { type: "huddle_pep", bonus: 2.0 }
  }
];

/**
 * Returns 3 randomized perk choices for the post-match reward modal.
 */
export function getPerkChoices(existingPerkIds = []) {
  const available = COACH_PERKS.filter((p) => !existingPerkIds.includes(p.id));

  const pool = [];
  available.forEach((p) => {
    let weight = 2.4; // Common
    if (p.rarity === "rare") weight = 1.9; // Rare
    if (p.rarity === "epic") weight = 1.3; // Epic (~35% appearance)
    if (p.rarity === "legendary") weight = 0.5; // Legendary (~12.5% appearance)
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
 * Generates balanced, non-excessive AI Coach Perks for Playoff / Gauntlet opponents.
 */
export function getOpponentCoachPerks(roundIdx, gameMode = 'standard') {
  if (roundIdx < 1 && gameMode !== 'gauntlet') return [];

  // Filter strictly to non-legendary perks for opponents
  const moderatePerks = COACH_PERKS.filter(
    (p) => p.rarity === "rare" || p.rarity === "epic" || p.rarity === "common",
  );

  if (gameMode === 'gauntlet') {
    // Gauntlet: M1 = 0 perks, M2 = 1 common/rare, M3 = 1 rare, M4 = 1 rare/epic, M5 = 2 rare/epic
    if (roundIdx <= 0) return [];
    if (roundIdx === 1) {
      const p = moderatePerks.filter(p => p.rarity === "common");
      return [p[Math.floor(Math.random() * p.length)]].filter(Boolean);
    }
    if (roundIdx === 2) {
      const p = moderatePerks.filter(p => p.rarity === "rare");
      return [p[Math.floor(Math.random() * p.length)]].filter(Boolean);
    }
    if (roundIdx === 3) {
      const p = moderatePerks.filter(p => p.rarity === "rare" || p.rarity === "epic");
      return [p[Math.floor(Math.random() * p.length)]].filter(Boolean);
    }
    if (roundIdx >= 4) {
      const p = moderatePerks.filter(p => p.rarity === "rare" || p.rarity === "epic");
      const shuffled = [...p].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 2);
    }
  }

  if (roundIdx <= 1) return [];

  if (roundIdx === 2) {
    // Semis: 1 Rare or Common tactical perk
    const semisPool = moderatePerks.filter(
      (p) => p.rarity === "rare" || p.rarity === "common",
    );
    const picked = semisPool[Math.floor(Math.random() * semisPool.length)];
    return picked ? [picked] : [];
  }

  if (roundIdx >= 3) {
    // Grand Finals: 1-2 balanced perks
    const finalsPool = moderatePerks.filter(
      (p) => p.rarity === "rare" || p.rarity === "epic",
    );
    const shuffled = [...finalsPool].sort(() => 0.5 - Math.random());
    const count = Math.random() < 0.65 ? 2 : 1;
    return shuffled.slice(0, count);
  }

  return [];
}
