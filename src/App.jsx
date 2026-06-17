import React, { useState, useEffect, useCallback } from 'react';
import HeroScreen from './components/HeroScreen';
import TeamPicker from './components/TeamPicker';
import PlayerPicker from './components/PlayerPicker';
import TournamentPhase from './components/TournamentPhase';
import ResultScreen from './components/ResultScreen';
import {
  ROLES,
  STAGES,
} from './data/gameData';

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

// ── OVR-based Power (hidden from UI) ──
function calcRosterPower(roster) {
  const players = Object.values(roster);
  if (!players.length) return 0;
  const avgOvr = players.reduce((s, p) => s + (p.ovr || 90), 0) / players.length;

  // Team synergy bonus (hidden): same-country players boost
  const countries = {};
  players.forEach(p => {
    if (p.country) countries[p.country] = (countries[p.country] || 0) + 1;
  });
  let synBonus = 0;
  Object.values(countries).forEach(n => {
    if (n >= 3) synBonus += n === 5 ? 4 : 2;
  });

  return Math.round(avgOvr + synBonus);
}

// ── App ──
export default function App() {
  const [screen, setScreen] = useState('hero');
  const [phase, setPhase] = useState('teampick');

  // API data
  const [teamData, setTeamData] = useState({});
  const [loading, setLoading] = useState(true);

  // Draft state
  const [roster, setRoster] = useState({});
  const [chosenTeam, setChosenTeam] = useState(null);
  const [offeredTeams, setOfferedTeams] = useState([]);
  const [refreshCount, setRefreshCount] = useState(3);

  // Tournament state
  const [currentRound, setCurrentRound] = useState(0);
  const [roundState, setRoundState] = useState('waiting');
  const [currentOpponent, setCurrentOpponent] = useState(null);
  const [seriesResult, setSeriesResult] = useState({ uw: 0, ew: 0, results: [], logs: [] });
  const [journey, setJourney] = useState([]);
  const [champ, setChamp] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = useCallback((message, type = 'n-info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 2800);
  }, []);

  // Fetch player data
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

  // ── Offer 3 random teams ──
  const refreshOfferedTeams = useCallback((data, filledRoles) => {
    const allKeys = Object.keys(data || teamData);
    // Filter teams that have at least one unfilled role available
    const validTeams = allKeys.filter(key => {
      const team = (data || teamData)[key];
      return team.players.some(p => !filledRoles.includes(p.role));
    });
    
    const shuffled = shuf(validTeams);
    const picked = [];
    const usedOrgs = new Set();
    
    for (const key of shuffled) {
      if (picked.length >= 3) break;
      // Extract base team name by removing trailing year
      const orgName = key.replace(/\s\d{4}$/, '').trim();
      if (!usedOrgs.has(orgName)) {
        usedOrgs.add(orgName);
        picked.push(key);
      }
    }
    
    // Fallback if not enough unique orgs
    if (picked.length < 3) {
      for (const key of shuffled) {
        if (picked.length >= 3) break;
        if (!picked.includes(key)) picked.push(key);
      }
    }

    setOfferedTeams(picked);
  }, [teamData]);

  // ── Start Game ──
  const handleStartGame = () => {
    setRoster({});
    setChosenTeam(null);
    setCurrentRound(0);
    setRoundState('waiting');
    setJourney([]);
    setChamp(false);
    setSeriesResult({ uw: 0, ew: 0, results: [], logs: [] });
    setCurrentOpponent(null);
    setRefreshCount(3);

    refreshOfferedTeams(teamData, []);

    setScreen('draft');
    setPhase('teampick');
  };

  // ── Refresh Teams ──
  const handleRefreshTeams = () => {
    if (refreshCount > 0) {
      setRefreshCount(prev => prev - 1);
      refreshOfferedTeams(teamData, Object.keys(roster));
    }
  };

  // ── Draft: Select Team → go to players (no going back) ──
  const handleSelectTeam = (key) => {
    setChosenTeam(key);
    setPhase('playerpick');
  };

  // ── Draft: Pick Player ──
  const handleDraftPlayer = (teamKey, p) => {
    if (roster[p.role]) {
      showToast(`${p.role} is already filled!`, 'n-bad');
      return;
    }

    const t = teamData[teamKey];
    const playerObj = {
      ...p,
      year: t.year,
      country: t.country,
      championship: t.championship || null,
      teamKey
    };

    const newRoster = { ...roster, [p.role]: playerObj };
    setRoster(newRoster);
    showToast(`${p.ign} drafted as ${p.role}! 🎉`, 'n-good');

    // If all 5 roles filled → go to tournament
    if (Object.keys(newRoster).length >= 5) {
      setTimeout(() => {
        // Pre-generate qualifier opponent so it shows in the waiting screen
        setCurrentOpponent(getOpponent(0));
        setScreen('tournament');
        showToast('Roster locked! Tournament begins! ⚔️', 'n-good');
      }, 600);
    } else {
      // Show 3 new random teams
      const filledRoles = Object.keys(newRoster);
      refreshOfferedTeams(teamData, filledRoles);
      setPhase('teampick');
    }
  };

  // ── Get a random opponent roster ──
  const getOpponent = useCallback((roundIdx = 0) => {
    const playersByRole = { Roamer: [], Jungler: [], EXP: [], Mid: [], Gold: [] };
    const allPlayers = [];
    
    Object.entries(teamData).forEach(([teamKey, team]) => {
      team.players.forEach(p => {
        allPlayers.push({ ...p, teamKey, country: team.country, year: team.year });
      });
    });

    const userIGNs = new Set(Object.values(roster).map(p => p.ign));
    const usedEnemyIGNs = new Set();
    journey.forEach(j => {
      if (j.oppRoster) {
        Object.values(j.oppRoster).forEach(p => usedEnemyIGNs.add(p.ign));
      }
    });

    allPlayers.forEach(p => {
      if (!userIGNs.has(p.ign) && playersByRole[p.role]) {
        playersByRole[p.role].push(p);
      }
    });

    const enemyRoster = {};
    Object.keys(playersByRole).forEach(role => {
      let pool = playersByRole[role];
      let unusedPool = pool.filter(p => !usedEnemyIGNs.has(p.ign));
      if (unusedPool.length === 0) unusedPool = pool;

      if (unusedPool.length > 0) {
        enemyRoster[role] = unusedPool[rnd(0, unusedPool.length - 1)];
      }
    });

    // Pick a random team from teamData to borrow name and logo
    const teamKeys = Object.keys(teamData);
    let randomTeamKey = teamKeys[rnd(0, teamKeys.length - 1)];
    // Try to avoid using the same team as chosenTeam if possible
    if (chosenTeam && randomTeamKey === chosenTeam && teamKeys.length > 1) {
      randomTeamKey = teamKeys.find(k => k !== chosenTeam) || randomTeamKey;
    }
    const oppTeam = teamData[randomTeamKey] || { logo: "⚔️", country: "", year: "" };
    const cleanName = randomTeamKey.replace(/\s\d{4}$/, '').trim();

    return {
      name: cleanName,
      logo: oppTeam.logo || "⚔️",
      country: oppTeam.country || "",
      year: oppTeam.year || "",
      teamOVR: calcRosterPower(enemyRoster),
      players: Object.values(enemyRoster),
      oppRoster: enemyRoster
    };
  }, [teamData, roster, journey, chosenTeam]);

  // ── Tournament: Start a round ──
  const handleStartRound = async () => {
    const stageName = STAGES[currentRound];
    const opp = currentOpponent;

    if (currentRound === 0) {
      // QUALIFIER: Single-game match with full commentary
      setSeriesResult({ uw: 0, ew: 0, results: [], logs: [] });
      setRoundState('playing');
      await sleep(1000);

      const userPower = calcRosterPower(roster);
      const passChance = Math.min(98, Math.max(80, userPower - 5));
      const passed = rnd(1, 100) <= passChance;

      // Play single game with sequential log reveal
      const gameLogs = getGameLogs(passed);
      for (let i = 0; i < gameLogs.length; i++) {
        setSeriesResult({
          uw: 0, ew: 0, results: [],
          logs: gameLogs.slice(0, i + 1)
        });
        await sleep(1000);
      }
      await sleep(1200);

      setJourney(prev => [
        ...prev,
        {
          stage: stageName,
          opp: 'Opponent',
          score: passed ? '✓ Qualified' : '✗ Failed',
          result: passed ? 'W' : 'L',
          oppRoster: opp?.oppRoster
        }
      ]);

      setRoundState(passed ? 'won' : 'lost');
      return;
    }

    // BO5 ROUNDS (Quarter Final, Semi Final, Final)
    setSeriesResult({ uw: 0, ew: 0, results: [], logs: [] });
    setRoundState('playing');

    await autoPlaySeries(opp, currentRound);
  };

  // ── Auto-play BO5 series ──
  const autoPlaySeries = async (opp, roundIdx) => {
    let state = { uw: 0, ew: 0, results: [], logs: [] };
    const stageName = STAGES[roundIdx];

    while (state.uw < 3 && state.ew < 3) {
      state = await playOneGame(state, opp, roundIdx);
    }

    const won = state.uw >= 3;

    setJourney(prev => [
      ...prev,
      {
        stage: stageName,
        opp: 'Opponent',
        score: `${state.uw}–${state.ew}`,
        result: won ? 'W' : 'L',
        oppRoster: opp.oppRoster
      }
    ]);

    setRoundState(won ? 'won' : 'lost');
  };

  // ── Play a single game within a BO5 ──
  const playOneGame = async (currentState, opp, roundIdx) => {
    const gn = currentState.results.length + 1;

    // OVR and synergy based calculation with mathematically forced progressive difficulty
    const userPower = calcRosterPower(roster);
    const oppPower = opp.teamOVR;
    
    // Base win chance derived from OVR difference (each 1 OVR diff = 2.5% chance swing)
    let winChance = 50 + (userPower - oppPower) * 2.5;

    // Apply strict round-based scaling:
    if (roundIdx === 1) {
      // Quarter Final: Very High Odds
      winChance = Math.max(85, winChance + 35); 
    } else if (roundIdx === 2) {
      // Semi Final: Moderate Odds
      winChance = Math.max(60, winChance + 10);
    } else {
      // Final: Hard Odds (cap it to make it challenging)
      winChance = Math.min(85, winChance - 10);
    }

    // Clamp absolute bounds
    winChance = Math.min(98, Math.max(2, winChance));
    
    const won = rnd(1, 100) <= winChance;

    // Generate all 3 commentary logs (3rd defines who wins)
    const gameLogs = getGameLogs(won);
    const nextUw = currentState.uw + (won ? 1 : 0);
    const nextEw = currentState.ew + (won ? 0 : 1);
    const nextResults = [...currentState.results, won ? 1 : -1];

    // Clear logs and wait 1s before showing Game gn's first log
    setSeriesResult(prev => ({ ...prev, logs: [] }));
    await sleep(1000);

    // Reveal logs one by one with 1-second delay
    for (let i = 0; i < gameLogs.length; i++) {
      const isLastLog = i === gameLogs.length - 1;
      setSeriesResult({
        // Score only updates on the final (result) log
        uw: isLastLog ? nextUw : currentState.uw,
        ew: isLastLog ? nextEw : currentState.ew,
        results: isLastLog ? nextResults : currentState.results,
        logs: gameLogs.slice(0, i + 1)
      });
      await sleep(1000);
    }

    // Pause after all 3 logs so player can read before next game
    await sleep(1200);
    const finalState = { uw: nextUw, ew: nextEw, results: nextResults, logs: gameLogs };
    return finalState;
  };

  // ── Game log generation ──
  const getGameLogs = (won) => {
    const rosterArray = Object.values(roster);
    const p1 = rosterArray[rnd(0, rosterArray.length - 1)];
    const p2 = rosterArray[rnd(0, rosterArray.length - 1)];

    const CLASH_WIN_LOGS = [
      `⚔️ <span>${p1.ign}</span> secures the first Turtle of the game, giving Your Roster a gold lead!`,
      `⚔️ A brilliant rotation from <span>${p1.ign}</span> catches the enemy out of position!`,
      `⚔️ Your Roster secures a clean 2-for-0 trade in the mid lane, led by <span>${p1.ign}</span>!`,
      `⚔️ <span>${p1.ign}</span> shuts down the enemy Jungler, securing our jungle buff!`,
      `⚔️ Perfect micro-play from <span>${p1.ign}</span> wins the duel in the EXP lane!`,
      `⚔️ <span>${p1.ign}</span> finds a double kill during a chaotic teamfight!`,
      `⚔️ Your Roster successfully defends the tier-1 turret, with <span>${p1.ign}</span> getting a critical defense!`,
      `⚔️ <span>${p1.ign}</span> intercepts the enemy rotation, securing a solo elimination!`
    ];

    const CLASH_LOSS_LOGS = [
      `💀 The enemy Jungler steals the Turtle, putting Your Roster on the back foot.`,
      `💀 <span>${p1.ign}</span> gets pickoffed in the river after being caught by the enemy tank.`,
      `💀 The enemy team coordinates a 3-man dive, eliminating <span>${p2.ign}</span> under the turret.`,
      `💀 A bad teamfight engage near the Lord pit costs Your Roster two players.`,
      `💀 The enemy EXP laner wins a close duel against <span>${p1.ign}</span> on the sideline.`,
      `💀 The enemy team invades and steals our purple buff, slowing down <span>${p1.ign}</span>'s scaling.`,
      `💀 Your Roster lose the gold lead after the enemy Gold laner secures a double kill.`,
      `💀 <span>${p1.ign}</span> is forced to retreat, giving up map pressure to the enemy.`
    ];

    const WIN_LOGS = [
      `⚔️ <span>VICTORY</span>: Flawless engage by <span>${p1.ign}</span> — the teamfight is a 5-0 wipe and Your Roster destroys the Enemy Crystal!`,
      `⚔️ <span>VICTORY</span>: Clutch Lord steal by <span>${p1.ign}</span>! Your Roster rushes down mid and secures the win!`,
      `⚔️ <span>VICTORY</span>: <span>${p1.ign}</span> lands a perfect setup — the enemy backline collapses and Your Roster claims the match!`,
      `⚔️ <span>VICTORY</span>: Your Roster dominates — <span>${p1.ign}</span> secures the final push to take the game!`,
      `⚔️ <span>VICTORY</span>: <span>${p1.ign}</span> counterflanks perfectly — Lord secured and the enemy defense is crushed!`
    ];

    const LOSS_LOGS = [
      `💀 <span>DEFEAT</span>: The enemy crushes it in a 4v4 at the Lord pit and takes down your Crystal.`,
      `💀 <span>DEFEAT</span>: The enemy secures back-to-back Turtles, snowballs the lead, and completes the wipeout.`,
      `💀 <span>DEFEAT</span>: The enemy catches <span>${p1.ign}</span> out of position, secures the Lord, and breaks your base defense.`,
      `💀 <span>DEFEAT</span>: Late-game throw — the enemy steals the Lord and marches to victory.`,
      `💀 <span>DEFEAT</span>: The enemy base push is too strong — your defense crumbles and the Nexus falls.`
    ];

    // Determine outcomes for first two logs
    // If user won, make logs tend to be wins (e.g. 65% win chance each)
    // If user lost, make logs tend to be losses (e.g. 65% loss chance each)
    const log1Win = won ? (rnd(1, 100) <= 65) : (rnd(1, 100) <= 35);
    const log2Win = won ? (rnd(1, 100) <= 65) : (rnd(1, 100) <= 35);

    const log1Text = log1Win 
      ? CLASH_WIN_LOGS[rnd(0, CLASH_WIN_LOGS.length - 1)]
      : CLASH_LOSS_LOGS[rnd(0, CLASH_LOSS_LOGS.length - 1)];
    const log1Class = log1Win ? 'll-win' : 'll-loss';

    const log2Text = log2Win 
      ? CLASH_WIN_LOGS[rnd(0, CLASH_WIN_LOGS.length - 1)]
      : CLASH_LOSS_LOGS[rnd(0, CLASH_LOSS_LOGS.length - 1)];
    const log2Class = log2Win ? 'll-win' : 'll-loss';

    const log3Text = won 
      ? WIN_LOGS[rnd(0, WIN_LOGS.length - 1)] 
      : LOSS_LOGS[rnd(0, LOSS_LOGS.length - 1)];
    const log3Class = won ? 'll-win' : 'll-loss';

    return [
      { t: log1Text, c: log1Class },
      { t: log2Text, c: log2Class },
      { t: log3Text, c: log3Class }
    ];
  };

  // ── After winning a round ──
  const handleContinueAfterWin = () => {
    const nextRound = currentRound + 1;
    if (nextRound >= STAGES.length) {
      setChamp(true);
      setScreen('result');
    } else {
      setCurrentRound(nextRound);
      setRoundState('waiting');
      setSeriesResult({ uw: 0, ew: 0, results: [], logs: [] });
      // Pre-select the opponent for the new round
      setCurrentOpponent(getOpponent(nextRound));
    }
  };

  // ── View result after loss ──
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
          onPlayAgain={handleStartGame}
        />
      )}
    </div>
  );
}
