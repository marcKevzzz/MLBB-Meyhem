import React, { useState, useEffect, useCallback, useRef } from 'react';
import HeroScreen from './components/HeroScreen';
import TeamPicker from './components/TeamPicker';
import PlayerPicker from './components/PlayerPicker';
import TournamentPhase from './components/TournamentPhase';
import ResultScreen from './components/ResultScreen';
import CoachPerkModal from './components/CoachPerkModal';
import { ROLES, STAGES } from './data/gameData';
import { pickGameHero, calcHeroCounters } from './data/signatureHeroes';
import { computeRosterSynergies } from './data/synergies';
import { getPerkChoices, getOpponentCoachPerks } from './data/coachPerks';

// ── Helpers ──
function rnd(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function shuf(a) {
  let b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    let j = rnd(0, i);
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Cross-Era Matchmaking Engine (60-99 Scale) ──
// 1. Anchored on Objective Era Performance (Player 60-99 baseline)
// 2. Normalized for Meta/Patch Era Power Creep & Era Alignment
// 3. Weighted Team Synergy & Franchise Chemistry vs Individual Skill:
//    - Individual Skill: weighted role differential (Jungler 35%, Gold 30%)
//    - Team Chemistry: substantial boost for authentic franchises (+10-15%), penalty for disconnected solo queue
// 4. Hero Counter Advantage: +2% to +6% edge for counter-picking key match-ups
function calcMatchupOdds(userRoster, oppRoster, roundIdx, activePerks = [], gameIdx = 0, gameMode = 'standard', oppCoachPerks = [], currentState = null) {
  const roleWeights = { Jungler: 1.4, Gold: 1.25, Mid: 1.0, EXP: 0.95, Roamer: 1.1 };
  let laneDiffSum = 0;
  let totalWeight = 0;

  ROLES.forEach(role => {
    const userOvr = userRoster[role]?.ovr || 75;
    const oppOvr = oppRoster?.[role]?.ovr || 80;
    const weight = roleWeights[role] || 1.0;
    laneDiffSum += (userOvr - oppOvr) * weight;
    totalWeight += weight;
  });

  const laneDifferential = laneDiffSum / totalWeight;

  // Separate Team System / Macro Synergy & Franchise Chemistry (Gentle Secondary Influence)
  const { totalSynergyOvr, activeFranchise, isDisconnected } = computeRosterSynergies(userRoster);
  let teamSystemBonus = Math.min(4.5, Math.max(-1.5, totalSynergyOvr * 0.28));
  if (activeFranchise && activeFranchise.count >= 5) {
    teamSystemBonus += 1.0; // Mild bonus for full 5-man franchise
  }
  if (isDisconnected) {
    teamSystemBonus -= 1.5; // Mild solo-queue communication variance
  }

  // Hero Counter & Draft Advantage (Subtle Tactical Flavor, Capped at +/-2.5%)
  const userHeroes = ROLES.map(r => pickGameHero(userRoster[r]?.ign, r, gameIdx, userRoster[r]?.year));
  const oppHeroes = ROLES.map(r => pickGameHero(oppRoster?.[r]?.ign, r, gameIdx, oppRoster?.[r]?.year));
  const draftEval = calcHeroCounters(userHeroes, oppHeroes);
  const heroCounterBonus = Math.max(-2.5, Math.min(2.5, draftEval.netBonus)); // -2.5% to +2.5% max

  // Stage Scaling (Smooth Qualifiers vs Fierce Playoff Finals)
  let stagePressure = 0;
  if (roundIdx === 0) stagePressure = -10;     // Qualifiers: +10% qualification advantage so runs reliably reach the bracket
  else if (roundIdx === 1) stagePressure = 0;  // Quarters: accessible competitive entry
  else if (roundIdx === 2) stagePressure = 4;  // Semis: high-stakes playoff tension
  else if (roundIdx >= 3) stagePressure = 8;  // Grand Finals: world championship final boss pressure

  // Grand Finals Boss Tenacity: Opponent plays with championship composure when deep in a series
  let bossTenacity = 0;
  if (roundIdx >= 3 && gameIdx >= 2) {
    bossTenacity = 3.0;
  }

  // Tactical Coach Perks Catalog (Legendary, Epic, Rare, Common)
  let perkBonus = 0;
  activePerks.forEach(p => {
    // ── Legendary (🌟 Gold Prismatic) ──
    if (p.id === 'm_world_dynasty') perkBonus += (roundIdx === 2 ? 5 : roundIdx >= 3 ? 7 : 2);
    if (p.id === 'silver_bullet_draft') perkBonus += 5.5;
    if (p.id === 'divine_retribution') perkBonus += (gameIdx >= 3 ? 6 : 3);
    if (p.id === 'apex_hypercarry') {
      const topOvr = Math.max(userRoster.Jungler?.ovr || 0, userRoster.Gold?.ovr || 0);
      perkBonus += topOvr >= 85 ? 5 : 2.5;
    }

    // ── Epic (💜 Violet) ──
    if (p.id === 'immortal_armor') perkBonus += 1;
    if (p.id === 'lord_dominance') perkBonus += 4;
    if (p.id === 'blade_of_despair' && gameIdx >= 4) perkBonus += 5;
    if (p.id === 'lvl1_buff_invade') perkBonus += 4;
    if (p.id === 'split_push_telepathy') perkBonus += 4;
    if (p.id === 'flawless_micro') perkBonus += 4;

    // ── Rare (🩵 Cyan) ──
    if (p.id === 'scouting_mastery') perkBonus += 3;
    if (p.id === 'turtle_tempo') perkBonus += 3;
    if (p.id === 'vocal_captain') perkBonus += 3;
    if (p.id === 'home_crowd' && gameIdx <= 1) perkBonus += 4;
    if (p.id === 'gold_lane_funnel') perkBonus += 3;
    if (p.id === 'draft_flexibility') perkBonus += 3.5;
    if (p.id === 'flash_initiation') perkBonus += 3.5;
    if (p.id === 'exp_lane_bully') perkBonus += 3;
    if (p.id === 'crab_neutral_control') perkBonus += 3;
    if (p.id === 'mid_lane_prio') perkBonus += 3;
    if (p.id === 'tier2_tower_defense') perkBonus += 3.5;

    // ── Common (🤍 Silver) ──
    if (p.id === 'bootcamp_drill') perkBonus += 2;
    if (p.id === 'bush_ambush') perkBonus += 2.5;
    if (p.id === 'energy_drink' && gameIdx >= 3) perkBonus += 3.5;
    if (p.id === 'comfort_picks') perkBonus += 2;
    if (p.id === 'minion_wave_mgmt') perkBonus += 2;
    if (p.id === 'mental_fortitude') perkBonus += 2.5;
    if (p.id === 'potion_refill') perkBonus += 2;
    if (p.id === 'scrim_vod_review') perkBonus += 2;
    if (p.id === 'hand_warmers') perkBonus += 2;
    if (p.id === 'wave_clear_rotation') perkBonus += 2;
    if (p.id === 'smiteless_leash') perkBonus += 2;
    if (p.id === 'target_pinging') perkBonus += 2;
    if (p.id === 'comfort_itemization') perkBonus += 2;
    if (p.id === 'buff_timer_tracking') perkBonus += 2;
    if (p.id === 'coach_timeout_reset') perkBonus += 2;
  });

  // ── Enemy Coach Perks Evaluation (Balanced & Non-Excessive) ──
  let enemyPerkBonus = 0;
  if (oppCoachPerks && oppCoachPerks.length > 0) {
    oppCoachPerks.forEach(p => {
      const amt = p.effect?.amount || 3;
      enemyPerkBonus += Math.min(4.0, amt); // Strictly capped to moderate values (+2.5% to +4.0%)
    });
  }

  // ── Adaptive Comeback Resistance (Tactical Timeout) ──
  // If the user is ahead by 2 or on match point (e.g. 2-0 or 2-1) in Semis or Grand Finals,
  // the opposing coach calls a Tactical Timeout to mount a fightback, preventing easy sweeps.
  let comebackResistance = 0;
  if (roundIdx >= 2 && currentState && currentState.uw >= 2 && currentState.uw > currentState.ew) {
    comebackResistance = roundIdx >= 3 ? 4.5 : 3.5; // +4.5% in Finals, +3.5% in Semis (fair, moderate)
  }

  // ── M-Series Gauntlet Mode: Modern Era Evolution Advantage ──
  // Current modern eras possess evolved macro, refined wave state control, and emblem specialization,
  // giving the current era a decisive advantage over previous/vintage eras.
  let gauntletEraBonus = 0;
  if (gameMode === 'gauntlet') {
    const userYears = ROLES.map(r => userRoster[r]?.year || 2024);
    const oppYears = ROLES.map(r => oppRoster?.[r]?.year || 2021);
    const userAvgYear = userYears.reduce((a, b) => a + b, 0) / userYears.length;
    const oppAvgYear = oppYears.reduce((a, b) => a + b, 0) / oppYears.length;

    // +1.8% per year difference of modern meta evolution (capped between -9% and +9%)
    // e.g. 2024 current roster vs 2019 M1 previous champions = +9% modern evolution advantage
    const yearDiff = userAvgYear - oppAvgYear;
    gauntletEraBonus = Math.max(-9, Math.min(9, Math.round(yearDiff * 1.8)));
  }

  // Underdog mode spirit bonus (+8% upset boost)
  const underdogBonus = gameMode === 'underdog' ? 8 : 0;

  let winChance = 52 + (laneDifferential * 1.5) + teamSystemBonus + heroCounterBonus - stagePressure - bossTenacity + perkBonus - enemyPerkBonus - comebackResistance + underdogBonus + gauntletEraBonus;
  return Math.min(88, Math.max(16, Math.round(winChance)));
}

// ── Hero Archetype & Authentic MLBB KDA Generator ──
function getHeroKdaProfile(heroName) {
  const name = (heroName || '').trim().toLowerCase();
  
  // Healers & Enchanter Supports
  if (['estes', 'angela', 'floryn', 'mathilda', 'rafaela', 'diggie', 'chip', 'faramis'].some(h => name.includes(h))) {
    return 'healer_support';
  }
  // Playmaker Tanks & Initiator Roamers
  if (['khufra', 'atlas', 'tigreal', 'minotaur', 'franco', 'grock', 'lolita', 'akai', 'carmilla', 'baxia', 'hylos', 'johnson', 'gatotkaca', 'belerick'].some(h => name.includes(h))) {
    return 'tank_initiator';
  }
  // Artillery & High-Impact AOE Mages
  if (['pharsa', 'yve', 'zhuxin', 'novaria', 'xavier', 'valentina', 'luo yi', 'kagura', 'kadita', 'lunox', 'chang\'e', 'cecilion', 'lylia', 'nana', 'vexana', 'gord', 'odette'].some(h => name.includes(h))) {
    return 'artillery_mage';
  }
  // EXP Fighters & Bruiser Divers
  if (['lapu-lapu', 'paquito', 'yu zhong', 'terizla', 'arlott', 'ruby', 'cici', 'thamuz', 'benedetta', 'fredrinn', 'chou', 'guinevere', 'dyrroth', 'martis', 'alpha', 'leomord', 'badang', 'argus', 'silvanna', 'hilda', 'masha', 'jawhead', 'barats', 'uranus', 'esmeralda'].some(h => name.includes(h))) {
    return 'bruiser_fighter';
  }
  // Carry Marksmen
  if (['beatrix', 'harith', 'claude', 'bruno', 'moskov', 'granger', 'karrie', 'wanwan', 'brody', 'irithel', 'lesley', 'clint', 'popol and kupa', 'natan', 'melissa', 'ixia', 'miya', 'layla', 'hanabi'].some(h => name.includes(h))) {
    return 'marksman_carry';
  }
  // Assassins & High-Burst Finishers
  return 'assassin_finisher';
}

function buildKdaProgression(userWon, userRoster, oppRoster, gameIndex) {
  // Determine pop-off role for both teams so ANY role can star and take MVP
  const pickPopOffRole = () => {
    const roll = Math.random() * 100;
    if (roll < 26) return 'Jungler';
    if (roll < 50) return 'Gold';
    if (roll < 70) return 'Mid';
    if (roll < 88) return 'EXP';
    return 'Roamer';
  };

  const userPopOff = pickPopOffRole();
  const oppPopOff = pickPopOffRole();

  const generateTeamKda = (roster, isWinner, popOffRole) => {
    const stats = {};
    let teamKills = 0;

    ROLES.forEach(role => {
      const p = roster?.[role];
      const hero = pickGameHero(p?.ign, role, gameIndex, p?.year);
      const archetype = getHeroKdaProfile(hero);
      const isPopOff = (role === popOffRole);

      let kills = 0;
      let deaths = 0;
      let assists = 0;

      if (isWinner) {
        if (isPopOff) {
          switch (archetype) {
            case 'healer_support':
              kills = rnd(0, 1);
              deaths = 0;
              assists = rnd(16, 22);
              break;
            case 'tank_initiator':
              kills = rnd(0, 2);
              deaths = rnd(0, 1);
              assists = rnd(14, 20);
              break;
            case 'artillery_mage':
              kills = rnd(6, 10);
              deaths = rnd(0, 1);
              assists = rnd(11, 17);
              break;
            case 'bruiser_fighter':
              kills = rnd(7, 11);
              deaths = rnd(0, 1);
              assists = rnd(6, 12);
              break;
            case 'marksman_carry':
              kills = rnd(8, 13);
              deaths = rnd(0, 1);
              assists = rnd(5, 10);
              break;
            default: // assassin
              kills = rnd(9, 14);
              deaths = rnd(0, 1);
              assists = rnd(4, 9);
              break;
          }
        } else {
          // Regular winning teammate
          switch (archetype) {
            case 'healer_support':
              kills = rnd(0, 1);
              deaths = rnd(1, 2);
              assists = rnd(10, 15);
              break;
            case 'tank_initiator':
              kills = rnd(0, 2);
              deaths = rnd(1, 3);
              assists = rnd(9, 14);
              break;
            case 'artillery_mage':
              kills = rnd(3, 6);
              deaths = rnd(1, 2);
              assists = rnd(7, 13);
              break;
            case 'bruiser_fighter':
              kills = rnd(3, 6);
              deaths = rnd(1, 3);
              assists = rnd(4, 9);
              break;
            case 'marksman_carry':
              kills = rnd(4, 7);
              deaths = rnd(1, 2);
              assists = rnd(3, 7);
              break;
            default: // assassin
              kills = rnd(4, 8);
              deaths = rnd(1, 3);
              assists = rnd(3, 7);
              break;
          }
        }
      } else {
        // Losing team
        if (isPopOff) {
          // Star performer on losing team (SVP contender)
          switch (archetype) {
            case 'healer_support':
            case 'tank_initiator':
              kills = rnd(0, 1);
              deaths = rnd(1, 3);
              assists = rnd(6, 11);
              break;
            case 'artillery_mage':
              kills = rnd(3, 6);
              deaths = rnd(2, 4);
              assists = rnd(4, 8);
              break;
            default:
              kills = rnd(4, 7);
              deaths = rnd(2, 4);
              assists = rnd(2, 5);
              break;
          }
        } else {
          kills = rnd(0, 2);
          deaths = rnd(3, 6);
          assists = rnd(1, 5);
        }
      }

      teamKills += kills;
      stats[role] = { hero, kills, deaths, assists, kda: `${kills}/${deaths}/${assists}` };
    });

    return { stats, teamKills };
  };

  const userGen = generateTeamKda(userRoster, userWon, userPopOff);
  const oppGen = generateTeamKda(oppRoster, !userWon, oppPopOff);

  const finalUserStats = userGen.stats;
  const finalOppStats = oppGen.stats;
  const finalUserKills = userGen.teamKills;
  const finalOppKills = oppGen.teamKills;

  // ── Authentic MLBB MVP Rating Formula ──
  const winningStats = userWon ? finalUserStats : finalOppStats;
  const winningRoster = userWon ? userRoster : oppRoster;
  const winningTeamKills = Math.max(1, userWon ? finalUserKills : finalOppKills);

  let bestRole = 'Jungler';
  let bestScore = -1;

  ROLES.forEach(role => {
    const st = winningStats[role];
    const kp = (st.kills + st.assists) / winningTeamKills;
    const kdaRatio = (st.kills + st.assists) / Math.max(1, st.deaths);

    // Baseline MLBB MVP score formula balancing Kill Participation, KDA Ratio, and Kills
    let score = (kp * 6.5) + Math.min(6.0, kdaRatio * 0.72) + (st.kills * 0.42);

    // Hero & Role Impact bonuses to ensure Tanks, Supports, EXPs and Mages can shine as MVPs
    if (role === 'Roamer') {
      score += 1.6;
      if (st.deaths <= 1 && kp >= 0.70) score += 1.1;
    } else if (role === 'Mid') {
      score += 0.8;
      if (kp >= 0.70) score += 0.8;
    } else if (role === 'EXP') {
      if (st.kills >= 6) score += 1.2;
      if (kdaRatio >= 7) score += 0.8;
    }

    if (score > bestScore) {
      bestScore = score;
      bestRole = role;
    }
  });

  const mvp = {
    ign: winningRoster[bestRole]?.ign || 'Star',
    role: bestRole,
    hero: winningStats[bestRole]?.hero,
    kda: winningStats[bestRole]?.kda
  };

  // ── Progressive KDA Multi-Phase Stages ──
  const phase0User = {};
  const phase0Opp = {};
  ROLES.forEach(r => {
    phase0User[r] = { hero: finalUserStats[r].hero, kills: 0, deaths: 0, assists: 0, kda: '0/0/0' };
    phase0Opp[r] = { hero: finalOppStats[r].hero, kills: 0, deaths: 0, assists: 0, kda: '0/0/0' };
  });

  // Phase 1: Early Game (~20% progression)
  let p1UserKills = 0;
  let p1OppKills = 0;
  const phase1User = {};
  const phase1Opp = {};
  ROLES.forEach(r => {
    const kU = Math.round(finalUserStats[r].kills * 0.22);
    const dU = Math.min(finalUserStats[r].deaths, Math.round(finalUserStats[r].deaths * 0.25));
    const aU = Math.round(finalUserStats[r].assists * 0.22);
    p1UserKills += kU;
    phase1User[r] = { hero: finalUserStats[r].hero, kills: kU, deaths: dU, assists: aU, kda: `${kU}/${dU}/${aU}` };

    const kO = Math.round(finalOppStats[r].kills * 0.22);
    const dO = Math.min(finalOppStats[r].deaths, Math.round(finalOppStats[r].deaths * 0.25));
    const aO = Math.round(finalOppStats[r].assists * 0.22);
    p1OppKills += kO;
    phase1Opp[r] = { hero: finalOppStats[r].hero, kills: kO, deaths: dO, assists: aO, kda: `${kO}/${dO}/${aO}` };
  });

  // Phase 2: Mid Game (~60% progression)
  let p2UserKills = 0;
  let p2OppKills = 0;
  const phase2User = {};
  const phase2Opp = {};
  ROLES.forEach(r => {
    const kU = Math.min(finalUserStats[r].kills, Math.max(phase1User[r].kills, Math.round(finalUserStats[r].kills * 0.65)));
    const dU = Math.min(finalUserStats[r].deaths, Math.max(phase1User[r].deaths, Math.round(finalUserStats[r].deaths * 0.65)));
    const aU = Math.min(finalUserStats[r].assists, Math.max(phase1User[r].assists, Math.round(finalUserStats[r].assists * 0.65)));
    p2UserKills += kU;
    phase2User[r] = { hero: finalUserStats[r].hero, kills: kU, deaths: dU, assists: aU, kda: `${kU}/${dU}/${aU}` };

    const kO = Math.min(finalOppStats[r].kills, Math.max(phase1Opp[r].kills, Math.round(finalOppStats[r].kills * 0.65)));
    const dO = Math.min(finalOppStats[r].deaths, Math.max(phase1Opp[r].deaths, Math.round(finalOppStats[r].deaths * 0.65)));
    const aO = Math.min(finalOppStats[r].assists, Math.max(phase1Opp[r].assists, Math.round(finalOppStats[r].assists * 0.65)));
    p2OppKills += kO;
    phase2Opp[r] = { hero: finalOppStats[r].hero, kills: kO, deaths: dO, assists: aO, kda: `${kO}/${dO}/${aO}` };
  });

  return {
    phase0: { killsUser: 0, killsOpp: 0, userStats: phase0User, oppStats: phase0Opp, showMvp: false },
    phase1: { killsUser: p1UserKills, killsOpp: p1OppKills, userStats: phase1User, oppStats: phase1Opp, showMvp: false },
    phase2: { killsUser: p2UserKills, killsOpp: p2OppKills, userStats: phase2User, oppStats: phase2Opp, showMvp: false },
    phase3: { killsUser: finalUserKills, killsOpp: finalOppKills, userStats: finalUserStats, oppStats: finalOppStats, showMvp: true, mvp }
  };
}

export default function App() {
  const [screen, setScreen] = useState('hero');
  const [phase, setPhase] = useState('teampick');
  const [gameMode, setGameMode] = useState('standard');

  const [teamData, setTeamData] = useState({});
  const [loading, setLoading] = useState(true);

  const [roster, setRoster] = useState({});
  const [chosenTeam, setChosenTeam] = useState(null);
  const [offeredTeams, setOfferedTeams] = useState([]);
  const [refreshCount, setRefreshCount] = useState(3);

  const recentOfferedTeamsRef = useRef([]);

  const [activePerks, setActivePerks] = useState([]);
  const [showPerkModal, setShowPerkModal] = useState(false);
  const [perkChoices, setPerkChoices] = useState([]);
  const [immortalUsed, setImmortalUsed] = useState(false);
  const [timeRewindUsed, setTimeRewindUsed] = useState(false);

  const [currentRound, setCurrentRound] = useState(0);
  const [roundState, setRoundState] = useState('waiting');
  const [currentOpponent, setCurrentOpponent] = useState(null);
  const [seriesResult, setSeriesResult] = useState({ uw: 0, ew: 0, results: [], logs: [] });
  const [currentGameData, setCurrentGameData] = useState(null);
  const [gameTransitionBanner, setGameTransitionBanner] = useState(null);
  const [journey, setJourney] = useState([]);
  const [champ, setChamp] = useState(false);

  const [toast, setToast] = useState({ message: '', type: '' });
  const usedLogsRef = useRef(new Set());

  const showToast = useCallback((message, type = 'n-info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 2800);
  }, []);

  useEffect(() => {
    fetch('/api/players.json')
      .then(res => res.json())
      .then(data => {
        setTeamData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading players API:", err);
        setLoading(false);
      });
  }, []);

  // ── Offer 3 random teams (with 3-year franchise cooldown) ──
  const refreshOfferedTeams = useCallback((data, currentRoster) => {
    const filledRoles = Object.keys(currentRoster || {});
    const draftedTeamKeys = Object.values(currentRoster || {}).map(p => p.teamKey);

    const allKeys = Object.keys(data || teamData);
    const validTeams = allKeys.filter(key => {
      if (draftedTeamKeys.includes(key)) return false;
      const team = (data || teamData)[key];
      return team.players.some(p => !filledRoles.includes(p.role));
    });
    
    const shuffled = shuf(validTeams);
    const picked = [];
    const usedOrgsInThisRoll = new Set();
    const recentRoll = recentOfferedTeamsRef.current || [];

    for (const key of shuffled) {
      if (picked.length >= 3) break;
      const team = (data || teamData)[key];
      const orgName = key.replace(/\s\d{4}$/, '').trim();
      const year = team.year;

      if (usedOrgsInThisRoll.has(orgName)) continue;

      const recentSameOrg = recentRoll.find(r => r.org === orgName);
      if (recentSameOrg && Math.abs(year - recentSameOrg.year) < 3) {
        continue;
      }

      usedOrgsInThisRoll.add(orgName);
      picked.push(key);
    }
    
    if (picked.length < 3) {
      for (const key of shuffled) {
        if (picked.length >= 3) break;
        if (!picked.includes(key)) picked.push(key);
      }
    }

    recentOfferedTeamsRef.current = picked.map(k => {
      const t = (data || teamData)[k];
      return {
        org: k.replace(/\s\d{4}$/, '').trim(),
        year: t?.year || 2024
      };
    });

    setOfferedTeams(picked);
  }, [teamData]);

  const getOpponent = useCallback((roundIdx = 0, mode = gameMode, activeRoster = roster) => {
    if (mode === 'gauntlet') {
      const gauntletBossKeys = [
        'EVOS Legends 2019',            // M1 World Champions (Classic Era)
        'Bren Esports 2021',            // M2 World Champions
        'Blacklist International 2021', // M3 World Champions
        'ECHO 2023',                    // M4 World Champions
        'AP Bren 2023'                  // M5 World Champions (Current Era)
      ];
      const targetKey = gauntletBossKeys[roundIdx] || gauntletBossKeys[0];
      const bossTeam = teamData[targetKey] || Object.values(teamData)[0];
      const enemyRoster = {};
      bossTeam.players.forEach(p => {
        enemyRoster[p.role] = {
          ...p,
          signatureHero: pickGameHero(p.ign, p.role, 0, bossTeam.year),
          teamKey: targetKey,
          country: bossTeam.country,
          year: bossTeam.year
        };
      });

      return {
        name: targetKey.replace(/\s\d{4}$/, '').trim(),
        logo: bossTeam.logo || "⚔️",
        country: bossTeam.country || "",
        year: bossTeam.year || "",
        teamOVR: bossTeam.teamOVR || 90,
        players: Object.values(enemyRoster),
        oppRoster: enemyRoster,
        coachPerks: getOpponentCoachPerks(roundIdx)
      };
    }

    // Anchor opponent scaling dynamically around User's team baseline so vintage authentic rosters (e.g. 80 OVR)
    // aren't mathematically crushed, while random 92 OVR superstar drafts face appropriately fierce competition!
    const effectiveRoster = activeRoster && Object.keys(activeRoster).length ? activeRoster : roster;
    const userPlayers = Object.values(effectiveRoster || {});
    const userAvgOvr = userPlayers.length
      ? Math.round(userPlayers.reduce((sum, p) => sum + (p.ovr || 75), 0) / userPlayers.length)
      : 80;

    let minTargetOvr = Math.max(62, userAvgOvr - 7);
    let maxTargetOvr = Math.max(66, userAvgOvr - 3);
    if (roundIdx === 1) {
      // Quarter Final: Clean competitive matchup within tier (+/- 2 OVR)
      minTargetOvr = Math.max(70, userAvgOvr - 2);
      maxTargetOvr = Math.min(96, userAvgOvr + 2);
    } else if (roundIdx === 2) {
      // Semi Final: Formidable playoff contender (+1 to +5 OVR)
      minTargetOvr = Math.max(76, userAvgOvr + 1);
      maxTargetOvr = Math.min(97, userAvgOvr + 5);
    } else if (roundIdx >= 3) {
      // Grand Final: Pinnacle championship final boss (+4 to +8 OVR, up to 99)
      minTargetOvr = Math.max(82, userAvgOvr + 4);
      maxTargetOvr = Math.min(99, userAvgOvr + 8);
    }

    const playersByRole = { Roamer: [], Jungler: [], EXP: [], Mid: [], Gold: [] };
    const allPlayers = [];
    
    Object.entries(teamData).forEach(([teamKey, team]) => {
      team.players.forEach(p => {
        allPlayers.push({ ...p, teamKey, country: team.country, year: team.year });
      });
    });

    const userIGNs = new Set(Object.values(effectiveRoster).map(p => p.ign));
    const usedEnemyIGNs = new Set();
    journey.forEach(j => {
      if (j.oppRoster) {
        Object.values(j.oppRoster).forEach(p => usedEnemyIGNs.add(p.ign));
      }
    });

    allPlayers.forEach(p => {
      if (!userIGNs.has(p.ign) && playersByRole[p.role]) {
        if (p.ovr >= minTargetOvr && p.ovr <= maxTargetOvr) {
          playersByRole[p.role].push(p);
        }
      }
    });

    const enemyRoster = {};
    ROLES.forEach(role => {
      let pool = playersByRole[role];
      if (pool.length === 0) {
        pool = allPlayers.filter(p => p.role === role && !userIGNs.has(p.ign));
      }
      let unusedPool = pool.filter(p => !usedEnemyIGNs.has(p.ign));
      if (unusedPool.length === 0) unusedPool = pool;

      if (unusedPool.length > 0) {
        const rawPlayer = unusedPool[rnd(0, unusedPool.length - 1)];
        enemyRoster[role] = {
          ...rawPlayer,
          signatureHero: pickGameHero(rawPlayer.ign, role, 0, rawPlayer.year),
          ovr: rawPlayer.ovr
        };
      }
    });

    let eligibleTeams = Object.keys(teamData).filter(key => {
      const team = teamData[key];
      return team.teamOVR >= minTargetOvr && team.teamOVR <= maxTargetOvr && key !== chosenTeam;
    });
    if (eligibleTeams.length === 0) {
      eligibleTeams = Object.keys(teamData).filter(key => key !== chosenTeam);
    }
    const chosenOpponentKey = eligibleTeams[rnd(0, eligibleTeams.length - 1)];
    const oppTeam = teamData[chosenOpponentKey] || { logo: "⚔️", country: "", year: "" };
    const cleanName = chosenOpponentKey.replace(/\s\d{4}$/, '').trim();

    return {
      name: cleanName,
      logo: oppTeam.logo || "⚔️",
      country: oppTeam.country || "",
      year: oppTeam.year || "",
      teamOVR: oppTeam.teamOVR || 85,
      players: Object.values(enemyRoster),
      oppRoster: enemyRoster,
      coachPerks: getOpponentCoachPerks(roundIdx)
    };
  }, [teamData, roster, journey, chosenTeam, gameMode]);

  const handleStartGame = (mode = 'standard') => {
    setGameMode(mode);
    setRoster({});
    setChosenTeam(null);
    setCurrentRound(0);
    setRoundState('waiting');
    setJourney([]);
    setChamp(false);
    setSeriesResult({ uw: 0, ew: 0, results: [], logs: [] });
    setCurrentOpponent(null);
    setCurrentGameData(null);
    setActivePerks([]);
    setImmortalUsed(false);
    setTimeRewindUsed(false);
    setShowPerkModal(false);
    setGameTransitionBanner(null);
    setRefreshCount(mode === 'underdog' ? 5 : 3);
    recentOfferedTeamsRef.current = [];

    refreshOfferedTeams(teamData, {});
    setScreen('draft');
    setPhase('teampick');
    showToast(`Starting ${mode.toUpperCase()} Run! ⚔️`, 'n-good');
  };

  const handleRefreshTeams = () => {
    if (refreshCount > 0) {
      setRefreshCount(prev => prev - 1);
      refreshOfferedTeams(teamData, roster);
    }
  };

  const handleSelectTeam = (key) => {
    setChosenTeam(key);
    setPhase('playerpick');
  };

  const handleDraftPlayer = (teamKey, p) => {
    if (roster[p.role]) {
      showToast(`${p.role} is already filled!`, 'n-bad');
      return;
    }

    const t = teamData[teamKey];
    const playerObj = {
      ...p,
      signatureHero: pickGameHero(p.ign, p.role, 0, t.year),
      year: t.year,
      country: t.country,
      championship: t.championship || null,
      teamKey
    };

    const newRoster = { ...roster, [p.role]: playerObj };

    setRoster(newRoster);
    showToast(`${p.ign} drafted as ${p.role}! 🎉`, 'n-good');

    if (Object.keys(newRoster).length >= 5) {
      setTimeout(() => {
        setCurrentOpponent(getOpponent(0, gameMode, newRoster));
        setScreen('tournament');
        showToast('Roster locked! Tournament begins! ⚔️', 'n-good');
      }, 500);
    } else {
      refreshOfferedTeams(teamData, newRoster);
      setPhase('teampick');
    }
  };

  // ── Single Game Play with Progressive KDA reveal & Smooth Transition ──
  const playOneGame = async (currentState, opp, roundIdx) => {
    const gameIdx = currentState.results.length;

    // Show smooth game transition banner
    const bannerText = roundIdx === 0 ? '⚔️ QUALIFIER MATCH STARTING...' : `⚔️ GAME ${gameIdx + 1} STARTING...`;
    setGameTransitionBanner(bannerText);
    await sleep(750);
    setGameTransitionBanner(null);

    // Adaptive Enemy Comeback Toast when player is 2-0 up in Semis or Grand Finals
    const isComebackTriggered = roundIdx >= 2 && currentState.uw >= 2 && currentState.uw > currentState.ew;
    if (isComebackTriggered) {
      showToast('🛡️ Enemy Coach called a Tactical Timeout! (Comeback Resistance Active)', 'n-bad');
    }

    // M-Series Gauntlet: Modern Era Advantage Toast in Game 1
    if (gameMode === 'gauntlet' && gameIdx === 0) {
      const userYears = ROLES.map(r => roster[r]?.year || 2024);
      const oppYears = ROLES.map(r => opp.oppRoster?.[r]?.year || 2021);
      const userAvg = Math.round(userYears.reduce((a, b) => a + b, 0) / userYears.length);
      const oppAvg = Math.round(oppYears.reduce((a, b) => a + b, 0) / oppYears.length);
      const diff = userAvg - oppAvg;
      if (diff > 0) {
        showToast(`🚀 Modern Meta Advantage: +${Math.min(9, Math.round(diff * 1.8))}% vs ${oppAvg} Era!`, 'n-good');
      } else if (diff < 0) {
        showToast(`⚠️ Era Power Disadvantage: Opponent is from modern ${oppAvg} Era!`, 'n-bad');
      }
    }

    let winChance = calcMatchupOdds(
      roster,
      opp.oppRoster,
      roundIdx,
      activePerks,
      gameIdx,
      gameMode,
      opp.coachPerks || [],
      currentState
    );

    if (activePerks.some(p => p.id === 'high_ground_fortress') && currentState.ew > currentState.uw) {
      winChance = Math.min(80, winChance + 5);
    }
    if (activePerks.some(p => p.id === 'divine_retribution') && (currentState.ew > currentState.uw || gameIdx >= 3)) {
      winChance = Math.min(85, winChance + 6);
    }

    let won = rnd(1, 100) <= winChance;

    if (!won && !immortalUsed && activePerks.some(p => p.id === 'immortal_armor')) {
      won = true;
      setImmortalUsed(true);
      showToast('🛡️ Immortal Armor triggered! Loss negated!', 'n-good');
    } else if (!won && !timeRewindUsed && roundIdx >= 2 && activePerks.some(p => p.id === 'time_rewind_reset')) {
      won = true;
      setTimeRewindUsed(true);
      showToast('🌌 Tactical Time Rewind activated! Playoff defeat negated!', 'n-good');
    }

    const kdaFlow = buildKdaProgression(won, roster, opp.oppRoster, gameIdx);

    // Initial state: 0-0, KDA 0/0/0, no MVP
    setCurrentGameData(kdaFlow.phase0);
    setSeriesResult(prev => ({ ...prev, logs: [] }));
    await sleep(400);

    const gameLogs = getGameLogs(won, kdaFlow.phase3);
    const nextUw = currentState.uw + (won ? 1 : 0);
    const nextEw = currentState.ew + (won ? 0 : 1);
    const nextResults = [...currentState.results, won ? 1 : -1];

    // Log 1: Early game kills increment (-0.5s pause: 1000ms)
    setCurrentGameData(kdaFlow.phase1);
    setSeriesResult({
      uw: currentState.uw,
      ew: currentState.ew,
      results: currentState.results,
      logs: gameLogs.slice(0, 1)
    });
    await sleep(1000);

    // Log 2: Mid game kills increment (-0.5s pause: 1000ms)
    setCurrentGameData(kdaFlow.phase2);
    setSeriesResult({
      uw: currentState.uw,
      ew: currentState.ew,
      results: currentState.results,
      logs: gameLogs.slice(0, 2)
    });
    await sleep(1000);

    // Log 3: Final push kills reach total & score updates (-0.3s: 600ms)
    setCurrentGameData({ ...kdaFlow.phase3, showMvp: false });
    setSeriesResult({
      uw: nextUw,
      ew: nextEw,
      results: nextResults,
      logs: gameLogs
    });
    await sleep(600);

    // Post-Match MVP spotlight appears LAST with reduced pause: 3000ms
    setCurrentGameData(kdaFlow.phase3);
    await sleep(3000);

    return { uw: nextUw, ew: nextEw, results: nextResults, logs: gameLogs };
  };

  const handleStartRound = async () => {
    usedLogsRef.current.clear();
    const stageName = STAGES[currentRound];
    const opp = currentOpponent;

    if (currentRound === 0) {
      setSeriesResult({ uw: 0, ew: 0, results: [], logs: [] });
      setRoundState('playing');
      await sleep(300);

      const finalState = await playOneGame({ uw: 0, ew: 0, results: [], logs: [] }, opp, 0);
      const passed = finalState.uw > 0;

      setJourney(prev => [
        ...prev,
        {
          stage: stageName,
          opp: opp?.name || 'Opponent',
          score: passed ? '✓ Qualified' : '✗ Failed',
          result: passed ? 'W' : 'L',
          oppRoster: opp?.oppRoster
        }
      ]);

      setRoundState(passed ? 'won' : 'lost');
      return;
    }

    setSeriesResult({ uw: 0, ew: 0, results: [], logs: [] });
    setRoundState('playing');

    let state = { uw: 0, ew: 0, results: [], logs: [] };
    while (state.uw < 3 && state.ew < 3) {
      state = await playOneGame(state, opp, currentRound);
      if (state.uw < 3 && state.ew < 3) {
        // Reduced between rounds by 0.5s: 1100ms between games in BO5
        await sleep(1100);
      }
    }

    const won = state.uw >= 3;
    setJourney(prev => [
      ...prev,
      {
        stage: stageName,
        opp: opp?.name || 'Opponent',
        score: `${state.uw}–${state.ew}`,
        result: won ? 'W' : 'L',
        oppRoster: opp.oppRoster
      }
    ]);

    setRoundState(won ? 'won' : 'lost');
  };

  const getGameLogs = (won, kdaData) => {
    const userJungler = roster.Jungler?.ign || 'Your Jungler';
    const userJunglerHero = kdaData?.userStats?.Jungler?.hero || 'Jungler';
    const enemyJungler = currentOpponent?.oppRoster?.Jungler?.ign || 'Enemy Jungler';
    const enemyJunglerHero = kdaData?.oppStats?.Jungler?.hero || 'Enemy Jungler';

    const rosterRoles = ROLES.filter(r => roster[r]);
    const r1 = rosterRoles[rnd(0, rosterRoles.length - 1)];
    const r2 = rosterRoles[rnd(0, rosterRoles.length - 1)];
    const p1 = roster[r1];
    const p2 = roster[r2];
    const h1 = kdaData?.userStats?.[r1]?.hero || '';
    const h2 = kdaData?.userStats?.[r2]?.hero || '';

    const CLASH_WIN_LOGS = [
      `<span>${userJungler} (${userJunglerHero})</span> secures Turtle in a clutch smite!`,
      `<span>${userJungler} (${userJunglerHero})</span> secures the Lord for Your Roster!`,
      `<span>${userJungler} (${userJunglerHero})</span> steals the Lord right from the enemy!`,
      `<span>${p1.ign} (${h1})</span> wins a key duel and claims first blood!`,
      `A magnificent initiation by <span>${p1.ign} (${h1})</span> wipes the enemy squad!`,
      `<span>${p1.ign} (${h1})</span> shuts down the enemy carry with precision!`,
      `Flawless rotation from <span>${p2.ign} (${h2})</span> secures outer turret!`,
      `<span>${p1.ign} (${h1})</span> finds a pickoff and secures full map control.`
    ];

    const CLASH_LOSS_LOGS = [
      `<span>${enemyJungler} (${enemyJunglerHero})</span> secures Turtle for the opponents.`,
      `<span>${enemyJungler} (${enemyJunglerHero})</span> steals the Lord from your team!`,
      `<span>${p1.ign} (${h1})</span> gets caught out by the enemy flank.`,
      `Enemy squad collapses on <span>${p2.ign} (${h2})</span> for a shutdown.`,
      `Your team loses position in the river fight.`,
      `Enemy steals a critical jungle buff and pushes all three lanes.`
    ];

    const WIN_LOGS = [
      `<span>${p1.ign} (${h1})</span> leads the final push straight into the base!`,
      `Lord march unstoppable! Enemy Crystal destroyed!`,
      `Ace for Your Roster! A dominant clean finish!`,
      `<span>${p1.ign} (${h1})</span> closes the game in MVP fashion!`
    ];

    const LOSS_LOGS = [
      `Enemy team completes the late-game wipe. Base falls.`,
      `The Lord push cannot be stopped. Crystal destroyed.`,
      `Base defense collapses in the final clash.`,
      `Enemy secures the victory with superior teamfight coordination.`
    ];

    const getUniqueLog = (pool, fallbackPool) => {
      let available = pool.filter(log => !usedLogsRef.current.has(log));
      if (available.length === 0) {
        available = fallbackPool.filter(log => !usedLogsRef.current.has(log));
        if (available.length === 0) {
          usedLogsRef.current.clear();
          available = pool;
        }
      }
      const selected = available[rnd(0, available.length - 1)];
      usedLogsRef.current.add(selected);
      return selected;
    };

    const log1Win = won ? (rnd(1, 100) <= 70) : (rnd(1, 100) <= 30);
    const log2Win = won ? (rnd(1, 100) <= 70) : (rnd(1, 100) <= 30);

    const log1Text = log1Win 
      ? getUniqueLog(CLASH_WIN_LOGS, CLASH_LOSS_LOGS)
      : getUniqueLog(CLASH_LOSS_LOGS, CLASH_WIN_LOGS);
    const log2Text = log2Win 
      ? getUniqueLog(CLASH_WIN_LOGS, CLASH_LOSS_LOGS)
      : getUniqueLog(CLASH_LOSS_LOGS, CLASH_WIN_LOGS);
    const log3Text = won 
      ? getUniqueLog(WIN_LOGS, LOSS_LOGS) 
      : getUniqueLog(LOSS_LOGS, WIN_LOGS);

    return [
      { t: log1Text, c: log1Win ? 'll-win' : 'll-loss' },
      { t: log2Text, c: log2Win ? 'll-win' : 'll-loss' },
      { t: log3Text, c: won ? 'll-win' : 'll-loss' }
    ];
  };

  const handleContinueAfterWin = () => {
    const nextRound = currentRound + 1;
    if (nextRound >= STAGES.length) {
      setChamp(true);
      setScreen('result');
    } else {
      const choices = getPerkChoices(activePerks.map(p => p.id));
      setPerkChoices(choices);
      setShowPerkModal(true);
    }
  };

  const handleSelectPerk = (perk) => {
    setActivePerks(prev => [...prev, perk]);
    setShowPerkModal(false);
    showToast(`Acquired: ${perk.name}! ${perk.icon}`, 'n-good');

    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setRoundState('waiting');
    setSeriesResult({ uw: 0, ew: 0, results: [], logs: [] });
    setCurrentGameData(null);
    setCurrentOpponent(getOpponent(nextRound, gameMode));
  };

  const handleViewResult = () => {
    setChamp(false);
    setScreen('result');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="ld-spin" />
        <div className="ld-txt">Loading Pro Players...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {toast.message && (
        <div className={`notif ${toast.type}`}>{toast.message}</div>
      )}

      {showPerkModal && (
        <CoachPerkModal
          perkChoices={perkChoices}
          onSelectPerk={handleSelectPerk}
          stageName={STAGES[currentRound]}
        />
      )}

      {screen === 'hero' && (
        <HeroScreen onStart={handleStartGame} />
      )}

      {screen === 'draft' && (
        <div className="draft-screen scr on">
          {phase === 'teampick' && (
            <TeamPicker
              TEAM_DATA={teamData}
              offeredTeams={offeredTeams}
              roster={roster}
              onSelectTeam={handleSelectTeam}
              rosterCount={Object.keys(roster).length}
              refreshCount={refreshCount}
              onRefreshTeams={handleRefreshTeams}
              gameMode={gameMode}
            />
          )}
          {phase === 'playerpick' && (
            <PlayerPicker
              TEAM_DATA={teamData}
              chosenTeam={chosenTeam}
              roster={roster}
              onDraftPlayer={handleDraftPlayer}
            />
          )}
        </div>
      )}

      {screen === 'tournament' && (
        <div className="tournament-screen scr on">
          <TournamentPhase
            roster={roster}
            currentRound={currentRound}
            roundState={roundState}
            opponent={currentOpponent}
            seriesResult={seriesResult}
            journey={journey}
            activePerks={activePerks}
            currentGameData={currentGameData}
            gameTransitionBanner={gameTransitionBanner}
            onStartRound={handleStartRound}
            onContinueAfterWin={handleContinueAfterWin}
            onViewResult={handleViewResult}
          />
        </div>
      )}

      {screen === 'result' && (
        <ResultScreen
          champ={champ}
          round={currentRound}
          journey={journey}
          roster={roster}
          gameMode={gameMode}
          activePerks={activePerks}
          onPlayAgain={() => setScreen('hero')}
        />
      )}
    </div>
  );
}
