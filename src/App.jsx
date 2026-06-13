import React, { useState, useEffect, useCallback } from 'react';
import HeroScreen from './components/HeroScreen';
import TeamPicker from './components/TeamPicker';
import PlayerPicker from './components/PlayerPicker';
import TournamentPhase from './components/TournamentPhase';
import ResultScreen from './components/ResultScreen';
import {
  ROLES,
  STAGES,
  generatePredefinedCommentary
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

    const allKeys = Object.keys(teamData);
    setOfferedTeams(shuf(allKeys).slice(0, 3));

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
      // Pre-calculate opponent for the first proper round (Quarter Final = round 1)
      // Note: getOpponent needs to know the user's roster, which is newRoster
      setTimeout(() => {
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

    return {
      name: "Enemy Roster",
      logo: "",
      country: "",
      year: "",
      teamOVR: calcRosterPower(enemyRoster),
      players: Object.values(enemyRoster),
      oppRoster: enemyRoster
    };
  }, [teamData, roster, journey]);

  // ── Tournament: Start a round ──
  const handleStartRound = async () => {
    const stageName = STAGES[currentRound];

    if (currentRound === 0) {
      // QUALIFIER: Simple pass/fail after delay
      setRoundState('playing');

      await sleep(2000);
      const userPower = calcRosterPower(roster);
      // Qualifier: High chance to pass (80% - 100%)
      const passChance = Math.min(100, Math.max(80, userPower - 5));
      const passed = rnd(1, 100) <= passChance;

      await sleep(1500);

      setJourney(prev => [
        ...prev,
        {
          stage: stageName,
          opp: 'Group Stage',
          score: passed ? '✓ Qualified' : '✗ Failed',
          result: passed ? 'W' : 'L'
        }
      ]);

      if (passed) {
        setRoundState('won');
      } else {
        setRoundState('lost');
      }
      return;
    }

    // BO5 ROUNDS (Quarter Final, Semi Final, Final)
    // opponent is already selected during `waiting` phase
    setSeriesResult({ uw: 0, ew: 0, results: [], logs: [] });
    setRoundState('playing');

    await autoPlaySeries(currentOpponent, currentRound);
  };

  // ── Auto-play BO5 series ──
  const autoPlaySeries = async (opp, roundIdx) => {
    let state = { uw: 0, ew: 0, results: [], logs: [] };
    const stageName = STAGES[roundIdx];
    const showCommentary = roundIdx >= 2; // Semi Final and Final only

    while (state.uw < 3 && state.ew < 3) {
      state = await playOneGame(state, opp, roundIdx, showCommentary);
      await sleep(800); // Delay between each game
    }

    const won = state.uw >= 3;

    // Add final series result log
    const seriesLog = {
      t: won
        ? `🏆 Your Dynasty wins the series ${state.uw}–${state.ew}!`
        : `💔 The Enemy takes the series ${state.ew}–${state.uw}.`,
      c: won ? 'll-crit' : 'll-loss'
    };
    state.logs = [...state.logs, seriesLog];

    // Commentary for all rounds
    const rosterArray = Object.values(roster);
    const star = rosterArray.reduce((best, p) => ((p.ovr || 90) > (best.ovr || 90) ? p : best), rosterArray[0]);
    const scoreStr = `${state.uw}–${state.ew}`;
    const commentary = generatePredefinedCommentary(won, star, opp, stageName, scoreStr);
    state.logs = [...state.logs, { t: `💬 ${commentary}`, c: 'll-crit' }];

    setSeriesResult({ ...state });

    setJourney(prev => [
      ...prev,
      {
        stage: stageName,
        opp: opp.name,
        score: `${state.uw}–${state.ew}`,
        result: won ? 'W' : 'L',
        oppRoster: opp.oppRoster
      }
    ]);

    setRoundState(won ? 'won' : 'lost');
  };

  // ── Play a single game within a BO5 ──
  const playOneGame = async (currentState, opp, roundIdx, showCommentary) => {
    const gn = currentState.results.length + 1;

    // Clear previous game's logs so the UI stays clean per match
    let logs = [];
    setSeriesResult(prev => ({ ...prev, logs }));
    await sleep(400);

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

    // Add exactly 3 gameplay logs
    const gameLogs = getGameLogs(won);
    for (const l of gameLogs) {
      logs = [...logs, l];
      setSeriesResult(prev => ({ ...prev, logs: [...logs] }));
      await sleep(600);
    }

    const nextUw = currentState.uw + (won ? 1 : 0);
    const nextEw = currentState.ew + (won ? 0 : 1);
    const nextResults = [...currentState.results, won ? 1 : -1];

    const resultLog = {
      t: won
        ? `✓ Game ${gn}: Your Dynasty wins! (${nextUw}–${nextEw})`
        : `✗ Game ${gn}: The Enemy wins. (${nextUw}–${nextEw})`,
      c: won ? 'll-win' : 'll-loss'
    };
    logs = [...logs, resultLog];

    const newState = { uw: nextUw, ew: nextEw, results: nextResults, logs };
    setSeriesResult({ ...newState });
    return newState;
  };

  // ── Game log generation ──
  const getGameLogs = (won) => {
    const rosterArray = Object.values(roster);
    const p1 = rosterArray[rnd(0, rosterArray.length - 1)];
    const p2 = rosterArray[rnd(0, rosterArray.length - 1)];

    const NEUTRAL_LOGS = [
      `The gold is completely even at 5 minutes in...`,
      `Both teams are trading blows, no clear advantage yet.`,
      `A tense standoff around the Turtle pit.`,
      `<span>${p1.ign}</span> is farming safely, looking for a mid-game spike.`,
      `First blood goes to the enemy, but <span>${p2.ign}</span> trades back a kill!`,
      `A huge rotation forces both teams to reset.`,
      `<span>${p1.ign}</span> is controlling the lane beautifully.`,
      `Jungle invades on both sides! The map is chaotic.`,
      `The macro play from both teams is outstanding so far.`
    ];

    const WIN_LOGS = [
      `Flawless engage by <span>${p1.ign}</span> — the teamfight is a 5-0 wipe!`,
      `Clutch Lord steal by <span>${p1.ign}</span>! Game-changing play!`,
      `<span>${p1.ign}</span> lands a perfect setup — the enemy backline collapses`,
      `Your Dynasty dominates — <span>${p1.ign}</span> secures the final push!`,
      `<span>${p1.ign}</span> counterflanks perfectly — Lord secured and it's over!`
    ];

    const LOSS_LOGS = [
      `The enemy crushes it in a 4v4 at the Lord pit.`,
      `The enemy secures back-to-back Turtles — can't contest.`,
      `The enemy catches <span>${p1.ign}</span> out of position and snowballs.`,
      `Late-game throw — the enemy steals the Lord!`,
      `The enemy base push is too strong, defense crumbles.`
    ];

    const log1 = { t: NEUTRAL_LOGS[rnd(0, NEUTRAL_LOGS.length - 1)], c: 'll-neu' };
    const log2 = { t: NEUTRAL_LOGS[rnd(0, NEUTRAL_LOGS.length - 1)], c: 'll-neu' };
    const log3 = won 
      ? { t: WIN_LOGS[rnd(0, WIN_LOGS.length - 1)], c: 'll-pos' } 
      : { t: LOSS_LOGS[rnd(0, LOSS_LOGS.length - 1)], c: 'll-neg' };

    return [log1, log2, log3];
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
