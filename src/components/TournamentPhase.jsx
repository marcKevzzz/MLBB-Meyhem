import React, { useEffect, useRef } from 'react';
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
  const logBoxRef = useRef(null);
  const isQualifier = currentRound === 0;
  const isQuarterFinal = currentRound === 1;
  const showLogs = currentRound >= 2; // Semi Final and Final only

  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [seriesResult?.logs]);

  const finished = isQualifier
    ? (roundState === 'won' || roundState === 'lost')
    : seriesResult && (seriesResult.uw >= 3 || seriesResult.ew >= 3);
  const userWon = isQualifier ? roundState === 'won' : seriesResult?.uw >= 3;

  return (
    <div className="tournament-phase fadein">
      {/* ── Tournament Bracket ── */}
      <div className="bracket-container">
        <div className="bracket-title disp">🏆 Tournament Bracket</div>
        <div className="bracket-track">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentRound || (idx === currentRound && finished);
            const isCurrent = idx === currentRound && !finished;
            const isFuture = idx > currentRound;
            const journeyEntry = journey[idx];
            const won = journeyEntry?.result === 'W';

            let nodeClass = 'bracket-node';
            if (isDone) nodeClass += won ? ' bn-won' : ' bn-lost';
            if (isCurrent) nodeClass += ' bn-active';
            if (isFuture) nodeClass += ' bn-future';

            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div className={`bracket-line ${isDone ? (won ? 'bl-done' : 'bl-fail') : isCurrent ? 'bl-active' : ''}`} />
                )}
                <div className={nodeClass}>
                  <div className="bn-icon">
                    {isDone ? (won ? '✅' : '❌') : isCurrent ? '⚔️' : '🔒'}
                  </div>
                  <div className="bn-label">{stage}</div>
                  {journeyEntry && (
                    <div className="bn-score">{journeyEntry.score}</div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Your Roster (inline mini) ── */}
      <div className="roster-mini">
        <div className="rm-title">Your Dynasty</div>
        <div className="rm-players">
          {ROLES.map((role, i) => {
            const p = roster[role];
            if (!p) return null;
            return (
              <div key={i} className="rm-player">
                <span className="rm-role">{RI[p.role]}</span>
                <span className="rm-ign">{p.ign}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ QUALIFIER VIEW ═══ */}
      {isQualifier && (
        <>
          {roundState === 'waiting' && (
            <div className="match-waiting fadein">
              <div className="mw-stage disp">Qualifier</div>
              <div className="mw-sub">Your roster will be evaluated for the tournament.</div>
              <button className="btn-big btn-play" onClick={onStartRound}>
                ⚔️ Enter Qualifiers
              </button>
            </div>
          )}

          {roundState === 'playing' && (
            <div className="qualifier-eval fadein">
              <div className="qe-spinner">
                <div className="ld-spin" />
              </div>
              <div className="qe-text disp">Evaluating Roster...</div>
              <div className="qe-sub">Checking team composition and player ratings</div>
            </div>
          )}

          {finished && (
            <div className="match-result-banner fadein">
              {userWon ? (
                <div className="mrb mrb-win">
                  <div className="mrb-icon">🎉</div>
                  <div className="mrb-text disp">QUALIFIED!</div>
                  <div className="mrb-sub">Your Dynasty advances to the Quarter Finals!</div>
                </div>
              ) : (
                <div className="mrb mrb-loss">
                  <div className="mrb-icon">💔</div>
                  <div className="mrb-text disp">DID NOT QUALIFY</div>
                  <div className="mrb-sub">Your roster didn't make the cut this time.</div>
                </div>
              )}
              <button
                className="btn-big btn-play"
                onClick={userWon ? onContinueAfterWin : onViewResult}
              >
                {userWon ? '▶ Next: Quarter Final' : '📊 View Results'}
              </button>
            </div>
          )}
        </>
      )}

      {/* ═══ BO5 ROUNDS (QF / SF / Final) ═══ */}
      {!isQualifier && (
        <>
          {roundState === 'waiting' && opponent && (
            <div className="match-waiting fadein">
              <div className="mw-stage disp">{STAGES[currentRound]}</div>
              <div className="mw-sub">Next Match:</div>
              
              <div className="vs-header" style={{ marginBottom: '16px', background: 'var(--ink)' }}>
                <div className="vs-team vs-enemy">
                  <div className="vst-emoji">{opponent.logo}</div>
                  <div className="vst-name disp">{opponent.name}</div>
                  <div className="vst-region">{opponent.country} · {opponent.year}</div>
                </div>
              </div>
              
              <div className="roster-mini" style={{ width: '100%', marginBottom: '24px' }}>
                <div className="rm-title" style={{ color: 'var(--red)' }}>Enemy Roster</div>
                <div className="rm-players" style={{ justifyContent: 'center' }}>
                  {ROLES.map((role, i) => {
                    const p = opponent.players.find(x => x.role === role);
                    if (!p) return null;
                    return (
                      <div key={i} className="rm-player" style={{ background: 'var(--ink)' }}>
                        <span className="rm-role">{RI[p.role]}</span>
                        <span className="rm-ign">{p.ign}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button className="btn-big btn-play" onClick={onStartRound}>
                ⚔️ Play {STAGES[currentRound]}
              </button>
            </div>
          )}

          {(roundState === 'playing' || finished) && opponent && (
            <div className="match-live fadein">
              {/* VS Header */}
              <div className="vs-header mlbb-border">
                <div className="vs-team vs-user">
                  <div className="vst-name disp">Your Roster</div>
                  <div className="vs-roster">
                    {ROLES.map((role, i) => {
                      const p = roster[role];
                      if (!p) return null;
                      return (
                        <div key={i} className="vsr-player">
                          <span className="vsr-role">{RI[p.role]}</span>
                          <span className="vsr-ign">{p.ign}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="vs-middle">
                  <div className="vs-score disp">
                    <span className="vs-uw">{seriesResult?.uw || 0}</span>
                    <span className="vs-dash">—</span>
                    <span className="vs-ew">{seriesResult?.ew || 0}</span>
                  </div>
                  <div className="vs-bo5">Best of 5</div>
                </div>
                <div className="vs-team vs-enemy">
                  <div className="vst-name disp">{opponent.name}</div>
                  <div className="vs-roster">
                    {ROLES.map((role, i) => {
                      const p = opponent.players.find(x => x.role === role);
                      if (!p) return null;
                      return (
                        <div key={i} className="vsr-player">
                          <span className="vsr-role">{RI[p.role]}</span>
                          <span className="vsr-ign">{p.ign}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Game Pips */}
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

              {/* Live Commentary Log (Semi Final & Final only) */}
              {showLogs && seriesResult?.logs?.length > 0 && (
                <div className="log-box" ref={logBoxRef}>
                  {seriesResult.logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`ll ${log.c}`}
                      dangerouslySetInnerHTML={{ __html: log.t }}
                    />
                  ))}
                </div>
              )}

              {/* Simulating indicator */}
              {roundState === 'playing' && !finished && (
                <div className="sim-indicator">
                  <div className="sim-dots"><span /><span /><span /></div>
                  <span>Match in progress...</span>
                </div>
              )}

              {/* Post-match result */}
              {finished && (
                <div className="match-result-banner fadein">
                  {userWon ? (
                    <div className="mrb mrb-win">
                      <div className="mrb-icon">🎉</div>
                      <div className="mrb-text disp">VICTORY!</div>
                      <div className="mrb-sub">Your Dynasty advances!</div>
                    </div>
                  ) : (
                    <div className="mrb mrb-loss">
                      <div className="mrb-icon">💔</div>
                      <div className="mrb-text disp">DEFEATED</div>
                      <div className="mrb-sub">Better luck next time...</div>
                    </div>
                  )}
                  <button
                    className="btn-big btn-play"
                    onClick={userWon ? onContinueAfterWin : onViewResult}
                  >
                    {userWon
                      ? currentRound >= STAGES.length - 1
                        ? '🏆 Claim Championship!'
                        : `▶ Next: ${STAGES[currentRound + 1]}`
                      : '📊 View Results'}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
