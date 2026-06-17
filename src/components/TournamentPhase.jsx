import React from 'react';
import { STAGES, RI, ROLES } from '../data/gameData';

export default function TournamentPhase({
  roster,
  currentRound,
  roundState,
  opponent,
  seriesResult,
  journey,
  onStartRound,
  onContinueAfterWin,
  onViewResult,
}) {
  const isQualifier = currentRound === 0;

  // 'finished' is purely driven by roundState to avoid dual-overlay conflicts
  const finished = roundState === 'won' || roundState === 'lost';

  const userWon = roundState === 'won';

  // Calculate user roster power (OVR)
  const calcPower = () => {
    const players = Object.values(roster);
    if (!players.length) return 0;
    const avgOvr = players.reduce((s, p) => s + (p.ovr || 90), 0) / players.length;
    const countries = {};
    players.forEach(p => {
      if (p.country) countries[p.country] = (countries[p.country] || 0) + 1;
    });
    let synBonus = 0;
    Object.values(countries).forEach(n => {
      if (n >= 3) synBonus += n === 5 ? 4 : 2;
    });
    return Math.round(avgOvr + synBonus);
  };

  const userPower = calcPower();

  // Bracket component — rendered inside overlays so it shows above the backdrop
  const BracketBar = () => (
    <div className="overlay-bracket-bar">
      {STAGES.map((stage, idx) => {
        const isDone = idx < currentRound || (idx === currentRound && finished);
        const isCurrent = idx === currentRound && !finished;
        const journeyEntry = journey[idx];
        const won = journeyEntry?.result === 'W';

        let nodeClass = 'ob-node';
        if (isDone) nodeClass += won ? ' ob-won' : ' ob-lost';
        if (isCurrent) nodeClass += ' ob-active';
        if (idx > currentRound && !isDone) nodeClass += ' ob-future';

        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <div className={`ob-line ${isDone ? (won ? 'ob-line-done' : 'ob-line-fail') : isCurrent ? 'ob-line-active' : ''}`} />
            )}
            <div className={nodeClass}>
              <span className="ob-icon">
                {isDone ? (won ? '✅' : '❌') : isCurrent ? '⚔️' : '🔒'}
              </span>
              <span className="ob-label">{stage}</span>
              {journeyEntry && <span className="ob-score">{journeyEntry.score}</span>}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );

  // Side-by-side roster matchup: User (left) vs Opponent (right)
  const RosterMatchup = ({ oppPlayers }) => (
    <div className="matchup-grid">
      {/* User side */}
      <div className="matchup-side matchup-user">
        <div className="matchup-team-header">
          <span className="matchup-logo">🛡️</span>
          <div>
            <div className="matchup-team-name disp">Your Roster</div>
          </div>
        </div>
        <div className="matchup-players">
          {ROLES.map((role) => {
            const p = roster[role];
            if (!p) return null;
            return (
              <div key={role} className="matchup-player matchup-player-user">
                <span className="matchup-role-icon">{RI[role]}</span>
                <span className="matchup-role-label">{role}</span>
                <span className="matchup-ign">{p.ign}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* VS divider */}
      <div className="matchup-divider">
        <div className="matchup-vs-text disp">VS</div>
      </div>

      {/* Opponent side */}
      <div className="matchup-side matchup-enemy">
        <div className="matchup-team-header matchup-team-header-enemy">
          <span className="matchup-logo">{opponent?.logo || '⚔️'}</span>
          <div>
            <div className="matchup-team-name disp">Opponent Roster</div>
          </div>
        </div>
        <div className="matchup-players">
          {ROLES.map((role) => {
            const p = oppPlayers?.find(x => x.role === role);
            if (!p) return null;
            return (
              <div key={role} className="matchup-player matchup-player-enemy">
                <span className="matchup-ign">{p.ign}</span>
                <span className="matchup-role-label">{role}</span>
                <span className="matchup-role-icon">{RI[role]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Logs are now set progressively — just display whatever is in seriesResult.logs
  const currentGameLogs = seriesResult?.logs || [];

  return (
    <div className="tournament-phase">

      {/* ═══ OVERLAY: Qualifier waiting ═══ */}
      {isQualifier && roundState === 'waiting' && opponent && (
        <div className="overlay-screen">
          <div className="overlay-bg" />
          <div className="overlay-inner">
            <BracketBar />
            <div className="modal-card modal-bounce">
              <span className="ph-eyebrow">Group Stage</span>
              <h2 className="disp" style={{ fontSize: '28px', color: '#fff', margin: '8px 0 20px' }}>
                {STAGES[currentRound]}
              </h2>

              <RosterMatchup oppPlayers={opponent.players} />

              <button className="btn-cta" onClick={onStartRound} style={{ width: '100%', marginTop: '24px' }}>
                ⚔️ Enter Qualifiers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ OVERLAY: Qualifier match simulation ═══ */}
      {isQualifier && roundState === 'playing' && opponent && (
        <div className="overlay-screen">
          <div className="overlay-bg" />
          <div className="overlay-inner">
            <BracketBar />
            <div className="modal-card modal-bounce" style={{ padding: '28px' }}>
              <span className="ph-eyebrow" style={{ color: 'var(--cyan)' }}>
                {STAGES[currentRound]} — Qualifier Match
              </span>

              <div className="sim-match-header">
                <div className="sim-team-label sim-team-label-user">
                  <span className="sim-team-name disp">Your Roster</span>
                </div>
                <div className="sim-scoreboard">
                  <span className="sim-score-num uw">⚔️</span>
                </div>
                <div className="sim-team-label sim-team-label-enemy">
                  <span className="sim-team-name disp">Opponent Roster</span>
                </div>
              </div>

              {currentGameLogs.length > 0 && (
                <div className="sim-log-box">
                  {currentGameLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`sim-log-entry ${log.c} sim-log-reveal`}
                      dangerouslySetInnerHTML={{ __html: log.t }}
                    />
                  ))}
                </div>
              )}

              <div className="sim-indicator">
                <div className="sim-dots"><span /><span /><span /></div>
                <span>Qualifying...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ OVERLAY: Versus Queue (BO5 rounds) ═══ */}
      {!isQualifier && roundState === 'waiting' && opponent && (
        <div className="overlay-screen">
          <div className="overlay-bg" />
          <div className="overlay-inner">
            <BracketBar />
            <div className="modal-card modal-bounce">
              <span className="ph-eyebrow">Round {currentRound} of 3</span>
              <h2 className="disp" style={{ fontSize: '32px', color: '#fff', margin: '8px 0 20px' }}>
                {STAGES[currentRound]}
              </h2>

              <RosterMatchup oppPlayers={opponent.players} />

              <button className="btn-cta" onClick={onStartRound} style={{ width: '100%', marginTop: '24px' }}>
                ⚔️ PLAY SERIES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ OVERLAY: Match Simulation Console ═══ */}
      {!isQualifier && roundState === 'playing' && opponent && (
        <div className="overlay-screen">
          <div className="overlay-bg" />
          <div className="overlay-inner">
            <BracketBar />
            <div className="modal-card modal-bounce" style={{ padding: '28px' }}>
              <span className="ph-eyebrow" style={{ color: 'var(--cyan)' }}>
                {STAGES[currentRound]} — Game {(seriesResult?.results?.length || 0) + 1}
              </span>

              <div className="sim-match-header">
                <div className="sim-team-label sim-team-label-user">
                  <span className="sim-team-name disp">Your Roster</span>
                </div>
                <div className="sim-scoreboard">
                  <span className="sim-score-num uw">{seriesResult?.uw || 0}</span>
                  <span className="sim-score-sep">—</span>
                  <span className="sim-score-num ew">{seriesResult?.ew || 0}</span>
                </div>
                <div className="sim-team-label sim-team-label-enemy">
                  <span className="sim-team-name disp">Opponent Roster</span>
                </div>
              </div>

              <div className="sim-bo-text">Best of 5 Series</div>

              <div className="pips-row">
                {[...Array(5)].map((_, i) => {
                  const res = seriesResult?.results[i];
                  const cls = res === 1 ? 'pip-w' : res === -1 ? 'pip-l' : '';
                  return (
                    <div key={i} className={`pip ${cls}`}>
                      {res === 1 ? 'W' : res === -1 ? 'L' : i + 1}
                    </div>
                  );
                })}
              </div>

              {currentGameLogs.length > 0 && (
                <div className="sim-log-box">
                  {currentGameLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`sim-log-entry ${log.c} sim-log-reveal`}
                      dangerouslySetInnerHTML={{ __html: log.t }}
                    />
                  ))}
                </div>
              )}

              <div className="sim-indicator">
                <div className="sim-dots"><span /><span /><span /></div>
                <span>Simulating...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ OVERLAY: Series Outcome ═══ */}
      {finished && (
        <div className="overlay-screen">
          <div className="overlay-bg" />
          <div className="overlay-inner">
            <BracketBar />
            <div className={`modal-card modal-bounce celebration-overlay ${userWon ? 'win' : 'loss'}`}>
              {userWon ? (
                <>
                  <div className="trophy-glow">🏆</div>
                  <h2 className="disp mrb-text">VICTORY</h2>
                  <p className="mrb-sub">
                    {isQualifier
                      ? 'Your Roster advances to the Quarter Finals!'
                      : `Your Roster wins the series ${seriesResult?.uw}–${seriesResult?.ew} and advances!`}
                  </p>
                </>
              ) : (
                <>
                  <div className="defeat-glow">💔</div>
                  <h2 className="disp mrb-text" style={{ color: 'var(--red)' }}>DEFEATED</h2>
                  <p className="mrb-sub">
                    {isQualifier
                      ? 'Your roster did not qualify this time.'
                      : `The series ends ${seriesResult?.ew}–${seriesResult?.uw}. Better luck next time.`}
                  </p>
                </>
              )}

              <button
                className="btn-cta"
                onClick={userWon ? onContinueAfterWin : onViewResult}
                style={{ width: '100%' }}
              >
                {userWon
                  ? currentRound >= STAGES.length - 1
                    ? '🏆 Claim Championship!'
                    : `▶ Next: ${STAGES[currentRound + 1]}`
                  : '📊 View Results'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
