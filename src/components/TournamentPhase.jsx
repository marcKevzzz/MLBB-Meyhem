import React, { useState } from 'react';
import { STAGES, getStagesForMode, ROLE_SVG, ROLES } from '../data/gameData';
import HeroAvatar from './HeroAvatar';
import { calcHeroCounters } from '../data/signatureHeroes';
import { computeRosterSynergies } from '../data/synergies';

function RoleIcon({ role }) {
  return (
    <span
      className="role-icon-svg"
      dangerouslySetInnerHTML={{ __html: ROLE_SVG[role] || role }}
    />
  );
}

function SwordClash({ size = 'normal' }) {
  return (
    <div className={`sword-clash-wrap sword-clash-${size}`}>
      <span className="sword-left">🗡️</span>
      <span className="sword-right">🗡️</span>
      <span className="clash-flash">💥</span>
    </div>
  );
}

const COUNTRY_ACRONYMS = {
  'Philippines': 'PH',
  'Indonesia': 'ID',
  'Malaysia': 'MY',
  'Singapore': 'SG',
  'Cambodia': 'KH',
  'Myanmar': 'MM',
  'United States': 'USA',
  'USA': 'USA',
  'Turkey': 'TR',
  'Russia': 'RU',
  'Brazil': 'BR',
  'Mongolia': 'MN',
  'Argentina': 'AR',
  'Vietnam': 'VN',
  'Thailand': 'TH',
  'Saudi Arabia': 'SA',
  'CIS': 'CIS',
  'MENA': 'MENA',
  'LATAM': 'LATAM'
};

function getCountryAcronym(country) {
  if (!country) return '';
  return COUNTRY_ACRONYMS[country] || (country.length > 4 ? country.slice(0, 3).toUpperCase() : country);
}

export default function TournamentPhase({
  roster,
  currentRound,
  roundState,
  opponent,
  seriesResult,
  journey,
  activePerks = [],
  currentGameData = null,
  gameTransitionBanner = null,
  gameMode = 'standard',
  onStartRound,
  onContinueAfterWin,
  onViewResult,
}) {
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  const stages = getStagesForMode(gameMode);
  const isGauntlet = gameMode === 'gauntlet';
  const isQualifier = !isGauntlet && currentRound === 0;
  const finished = roundState === 'won' || roundState === 'lost';
  const userWon = roundState === 'won';

  // Bracket component
  const BracketBar = () => (
    <div className="overlay-bracket-bar">
      {stages.map((stage, idx) => {
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
                {isDone ? (won ? '✅' : '❌') : isCurrent ? '⚡' : '🔒'}
              </span>
              <span className="ob-label">{stage}</span>
              {journeyEntry && <span className="ob-score">{journeyEntry.score}</span>}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );

  // Active Perks Bar
  const ActivePerksBar = () => {
    if (!activePerks || activePerks.length === 0) return null;
    return (
      <div className="active-perks-hud">
        <span className="aph-title">⚡ YOUR COACH PERKS:</span>
        <div className="aph-list">
          {activePerks.map((p) => (
            <div key={p.id} className={`aph-pill aph-rarity-${p.rarity}`} title={p.description}>
              <span>{p.icon}</span>
              <span className="aph-name">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Enemy Active Perks Bar
  const EnemyPerksBar = () => {
    if (!opponent?.coachPerks || opponent.coachPerks.length === 0) return null;
    return (
      <div className="active-perks-hud enemy-perks-hud">
        <span className="aph-title" style={{ color: '#ff6b81' }}>🛡️ ENEMY COACH PERKS:</span>
        <div className="aph-list">
          {opponent.coachPerks.map((p) => (
            <div key={p.id} className={`aph-pill aph-rarity-${p.rarity}`} title={p.description}>
              <span>{p.icon}</span>
              <span className="aph-name">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Spacious, stretched side-by-side roster matchup that stays side-by-side even on mobile
  // Spacious, stretched side-by-side roster matchup that stays side-by-side even on mobile
  const RosterMatchup = ({ oppPlayers }) => (
    <div className="matchup-grid-v2">
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
              <div key={role} className="matchup-player-row-v2 matchup-user-row">
                <div className="mpr-role-badge">
                  <RoleIcon role={role} />
                </div>
                <div className="mpr-details">
                  <div className="mpr-name-line">
                    <span className="mpr-ign">{p.ign}</span>
                  </div>
                  <div className="mpr-sub-line">
                    <span className="mpr-role-text">{role}</span>
                    {p.country && (
                      <span className="mpr-meta-tag mpr-country-tag">
                        <span className="country-full">{p.country}</span>
                        <span className="country-abbr">{getCountryAcronym(p.country)}</span>
                      </span>
                    )}
                    {p.year && <span className="mpr-meta-tag">{p.year}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VS divider */}
      <div className="matchup-divider">
        <div className="matchup-vs-text disp">VS</div>
      </div>

      {/* Opponent side - Enemy icon aligned to the right side */}
      <div className="matchup-side matchup-enemy">
        <div className="matchup-team-header matchup-team-header-enemy">
          <span className="matchup-logo">🛡️</span>
          <div>
            <div className="matchup-team-name disp">{opponent?.name || 'Opponent'}</div>
          </div>
        </div>
        <div className="matchup-players">
          {ROLES.map((role) => {
            const p = oppPlayers?.find(x => x.role === role);
            if (!p) return null;
            return (
              <div key={role} className="matchup-player-row-v2 matchup-opp-row">
                <div className="mpr-details mpr-details-right">
                  <div className="mpr-name-line">
                    <span className="mpr-ign">{p.ign}</span>
                  </div>
                  <div className="mpr-sub-line">
                    {p.year && <span className="mpr-meta-tag">{p.year}</span>}
                    {p.country && (
                      <span className="mpr-meta-tag mpr-country-tag">
                        <span className="country-full">{p.country}</span>
                        <span className="country-abbr">{getCountryAcronym(p.country)}</span>
                      </span>
                    )}
                    <span className="mpr-role-text">{role}</span>
                  </div>
                </div>
                <div className="mpr-role-badge mpr-role-badge-opp">
                  <RoleIcon role={role} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const currentGameLogs = seriesResult?.logs || [];
  const killsUser = currentGameData?.killsUser ?? 0;
  const killsOpp = currentGameData?.killsOpp ?? 0;
  const userStats = currentGameData?.userStats || {};
  const oppStats = currentGameData?.oppStats || {};
  const gameMvp = currentGameData?.mvp;
  const showMvp = currentGameData?.showMvp ?? false;

  return (
    <div className="tournament-phase">

      {/* Smooth Round Transition Flash Banner */}
      {gameTransitionBanner && (
        <div className="game-transition-overlay fadein">
          <div className="gto-card">
            <span className="gto-icon">⚡</span>
            <span className="gto-text disp">{gameTransitionBanner}</span>
          </div>
        </div>
      )}

      {/* Rating Methodology Modal */}
      {showMethodologyModal && (
        <div className="coach-perk-backdrop" onClick={() => setShowMethodologyModal(false)}>
          <div className="coach-perk-modal methodology-modal" onClick={e => e.stopPropagation()}>
            <div className="cpm-badge">TRANSPARENT SIMULATION</div>
            <h2 className="cpm-title">Cross-Era Power Rating (60–99 Scale)</h2>
            <div className="methodology-points">
              <div className="mp-item">
                <span className="mp-num">1</span>
                <div>
                  <strong>Anchored on Objective Era Performance:</strong> Real tournament trophies, win records, and head-to-head dominance in their peak year.
                </div>
              </div>
              <div className="mp-item">
                <span className="mp-num">2</span>
                <div>
                  <strong>Normalized for Meta Power Creep:</strong> Relative dominance against their own era's peers rather than raw inflated stats.
                </div>
              </div>
              <div className="mp-item">
                <span className="mp-num">3</span>
                <div>
                  <strong>Individual Skill vs Team System:</strong> Separate weights for solo carry lane differential (Jungler 35%, Gold 30%) and macro chemistry.
                </div>
              </div>
              <div className="mp-item">
                <span className="mp-num">4</span>
                <div>
                  <strong>Consistent 60–99 Rating System:</strong> Calibrated Elo/OVR distribution providing balanced upset odds and fierce finals.
                </div>
              </div>
              <div className="mp-item">
                <span className="mp-num">5</span>
                <div>
                  <strong>Fan-Facing Speculative Simulation:</strong> Built for high-stakes debate and dream-match drama!
                </div>
              </div>
            </div>
            <button className="btn-cta" onClick={() => setShowMethodologyModal(false)} style={{ marginTop: '20px', width: '100%' }}>
              ✓ Got It
            </button>
          </div>
        </div>
      )}

      {/* ═══ OVERLAY: Qualifier waiting ═══ */}
      {isQualifier && roundState === 'waiting' && opponent && (
        <div className="overlay-screen">
          <div className="overlay-bg" />
          <div className="overlay-inner">
            <BracketBar />
            <div className="modal-card modal-bounce modal-stretched">
              <div className="modal-top-row">
                <span className="ph-eyebrow">Qualifier Series (Best of 3)</span>
                <button className="btn-methodology" onClick={() => setShowMethodologyModal(true)}>
                  ℹ️ Rating System
                </button>
              </div>

              <h2 className="disp" style={{ fontSize: '28px', color: '#fff', margin: '4px 0 10px' }}>
                {stages[currentRound]}
              </h2>

              <ActivePerksBar />
              <EnemyPerksBar />
              <RosterMatchup oppPlayers={opponent.players} />

              <button className="btn-cta" onClick={onStartRound} style={{ width: '100%', marginTop: '20px' }}>
                ⚔️ PLAY QUALIFIER SERIES (BO3)
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
            <div className="modal-card modal-bounce modal-sim-card modal-stretched">
              <span className="ph-eyebrow" style={{ color: 'var(--cyan)' }}>
                {stages[currentRound]} — Game {(seriesResult?.results?.length || 0) + 1} (BO3)
              </span>

              {/* Perfectly Balanced Equal-Size Scoreboard */}
              <div className="broadcast-scoreboard-v2">
                <div className="bs2-side bs2-user">
                  <span className="bs2-team-name disp">YOUR ROSTER</span>
                  <span className="bs2-series-score">{seriesResult?.uw || 0}</span>
                </div>
                <div className="bs2-center">
                  <div className="bs2-kills-wrap">
                    <span className="bs2-kill-num bs2-k-user">{killsUser}</span>
                    <SwordClash size="compact" />
                    <span className="bs2-kill-num bs2-k-opp">{killsOpp}</span>
                  </div>
                  <span className="bs2-live-tag">LIVE KILLS</span>
                </div>
                <div className="bs2-side bs2-opp">
                  <span className="bs2-series-score">{seriesResult?.ew || 0}</span>
                  <span className="bs2-team-name disp">{opponent.name}</span>
                </div>
              </div>

              {/* BO3 Pips */}
              <div className="pips-row">
                {[...Array(3)].map((_, i) => {
                  const res = seriesResult?.results[i];
                  const cls = res === 1 ? 'pip-w' : res === -1 ? 'pip-l' : '';
                  return (
                    <div key={i} className={`pip ${cls}`}>
                      {res === 1 ? 'W' : res === -1 ? 'L' : `G${i + 1}`}
                    </div>
                  );
                })}
              </div>

              {/* In-Game Roster with Circle Hero Avatars & Dynamic KDA (Side by side on mobile) */}
              <div className="kda-roster-grid">
                <div className="kda-col kda-col-user">
                  {ROLES.map(role => {
                    const p = roster[role];
                    const stat = userStats[role] || { kda: '0/0/0', hero: 'Hero' };
                    return p ? (
                      <div key={role} className="kda-player-card">
                        <HeroAvatar hero={stat.hero} size={32} side="user" />
                        <div className="kpc-text">
                            <span className="kpc-ign">{p.ign}</span>
                          <span className="kpc-role">
                              <RoleIcon role={role} />
                              <span className="kpc-role-text">{role}</span>
                            </span>
                        </div>
                          <span className="kpc-kda">{stat.kda}</span>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="kda-col kda-col-opp">
                  {ROLES.map(role => {
                    const p = opponent.oppRoster?.[role];
                    const stat = oppStats[role] || { kda: '0/0/0', hero: 'Hero' };
                    return p ? (
                      <div key={role} className="kda-player-card kpc-opp">
                          <span className="kpc-kda">{stat.kda}</span>
                        <div className="kpc-text kpc-text-right">
                            <span className="kpc-ign">{p.ign}</span>
                          <span className="kpc-role">
                              <span className="kpc-role-text">{role}</span>
                              <RoleIcon role={role} />
                            </span>
                          </div>
                        <HeroAvatar hero={stat.hero} size={32} side="opp" />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Combat Commentary Feed */}
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

              {/* Game MVP Callout - ONLY at end of game */}
              {showMvp && gameMvp && (
                <div className="game-mvp-banner fadein">
                  <HeroAvatar hero={gameMvp.hero} size={30} side="user" />
                  <span className="gmb-text">
                    Match MVP: <strong>{gameMvp.ign}</strong> ({gameMvp.hero}) • {gameMvp.kda}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ OVERLAY: Versus Queue (Playoffs / Gauntlet) ═══ */}
      {!isQualifier && roundState === 'waiting' && opponent && (() => {
        const isBo3 = isGauntlet && currentRound < 4;
        const formatLabel = isBo3 ? 'BO3' : 'BO5';
        return (
          <div className="overlay-screen">
            <div className="overlay-bg" />
            <div className="overlay-inner">
              <BracketBar />
              <div className="modal-card modal-bounce modal-stretched">
                <div className="modal-top-row">
                  <span className="ph-eyebrow">
                    {isGauntlet 
                      ? `M-Series Boss ${currentRound + 1} of 7` 
                      : `Playoff Round ${currentRound} of ${stages.length - 1}`}
                  </span>
                  <button className="btn-methodology" onClick={() => setShowMethodologyModal(true)}>
                    ℹ️ Rating System
                  </button>
                </div>

                <h2 className="disp" style={{ fontSize: '30px', color: '#fff', margin: '4px 0 10px' }}>
                  {stages[currentRound]}
                </h2>

                <ActivePerksBar />
                <EnemyPerksBar />
                <RosterMatchup oppPlayers={opponent.players} />

                <button className="btn-cta" onClick={onStartRound} style={{ width: '100%', marginTop: '20px' }}>
                  ⚔️ {isGauntlet ? `BATTLE ${opponent.name.toUpperCase()} (${formatLabel})` : `PLAY SERIES (${formatLabel})`}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ OVERLAY: Match Simulation Console ═══ */}
      {!isQualifier && roundState === 'playing' && opponent && (() => {
        const isBo3 = isGauntlet && currentRound < 4;
        const formatLabel = isBo3 ? 'BO3' : 'BO5';
        const numPips = isBo3 ? 3 : 5;
        return (
          <div className="overlay-screen">
            <div className="overlay-bg" />
            <div className="overlay-inner">
              <BracketBar />
              <div className="modal-card modal-bounce modal-sim-card modal-stretched">
                <span className="ph-eyebrow" style={{ color: 'var(--cyan)' }}>
                  {stages[currentRound]} — Game {(seriesResult?.results?.length || 0) + 1} ({formatLabel})
                </span>

                {/* Perfectly Balanced Equal-Size Scoreboard */}
                <div className="broadcast-scoreboard-v2">
                  <div className="bs2-side bs2-user">
                    <span className="bs2-team-name disp">YOUR ROSTER</span>
                    <span className="bs2-series-score">{seriesResult?.uw || 0}</span>
                  </div>

                  <div className="bs2-center">
                    <div className="bs2-kills-wrap">
                      <span className="bs2-kill-num bs2-k-user">{killsUser}</span>
                      <SwordClash size="compact" />
                      <span className="bs2-kill-num bs2-k-opp">{killsOpp}</span>
                    </div>
                    <span className="bs2-live-tag">GAME KILLS</span>
                  </div>

                  <div className="bs2-side bs2-opp">
                    <span className="bs2-series-score">{seriesResult?.ew || 0}</span>
                    <span className="bs2-team-name disp">{opponent.name}</span>
                  </div>
                </div>

                {/* Series Pips */}
                <div className="pips-row">
                  {[...Array(numPips)].map((_, i) => {
                    const res = seriesResult?.results[i];
                    const cls = res === 1 ? 'pip-w' : res === -1 ? 'pip-l' : '';
                    return (
                      <div key={i} className={`pip ${cls}`}>
                        {res === 1 ? 'W' : res === -1 ? 'L' : `G${i + 1}`}
                      </div>
                    );
                  })}
                </div>

              {/* In-Game Roster with Circle Hero Avatars & Dynamic KDA (Side by side on mobile) */}
              <div className="kda-roster-grid">
                <div className="kda-col kda-col-user">
                  {ROLES.map(role => {
                    const p = roster[role];
                    const stat = userStats[role] || { kda: '0/0/0', hero: 'Hero' };
                    return p ? (
                      <div key={role} className="kda-player-card">
                        <HeroAvatar hero={stat.hero} size={32} side="user" />
                        <div className="kpc-text">
                            <span className="kpc-ign">{p.ign}</span>
                          <span className="kpc-role">
                              <RoleIcon role={role} />
                              <span className="kpc-role-text">{role}</span>
                            </span>
                        </div>
                          <span className="kpc-kda">{stat.kda}</span>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="kda-col kda-col-opp">
                  {ROLES.map(role => {
                    const p = opponent.oppRoster?.[role];
                    const stat = oppStats[role] || { kda: '0/0/0', hero: 'Hero' };
                    return p ? (
                      <div key={role} className="kda-player-card kpc-opp">
                          <span className="kpc-kda">{stat.kda}</span>
                        <div className="kpc-text kpc-text-right">
                            <span className="kpc-ign">{p.ign}</span>
                          <span className="kpc-role">
                              <span className="kpc-role-text">{role}</span>
                              <RoleIcon role={role} />
                            </span>
                          </div>
                        <HeroAvatar hero={stat.hero} size={32} side="opp" />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Combat Logs */}
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

              {/* Game MVP Callout - ONLY at end of game */}
              {showMvp && gameMvp && (
                <div className="game-mvp-banner fadein">
                  <HeroAvatar hero={gameMvp.hero} size={30} side="user" />
                  <span className="gmb-text">
                    Game MVP: <strong>{gameMvp.ign}</strong> ({gameMvp.hero}) • {gameMvp.kda}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })()}

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
                      ? 'Your Roster won the Qualifier series and advances to the Quarter Finals!'
                      : isGauntlet
                      ? `Your Roster conquered ${opponent?.name || 'the Champions'} ${seriesResult?.uw}–${seriesResult?.ew}!`
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
                      : isGauntlet
                      ? `Fallen to ${opponent?.name || 'the Champions'} ${seriesResult?.ew}–${seriesResult?.uw}. The gauntlet run ends.`
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
                  ? currentRound >= stages.length - 1
                    ? (isGauntlet ? '🏆 Claim M-Series World Championship!' : '🏆 Claim Championship!')
                    : `▶ Claim Reward & Advance to ${stages[currentRound + 1]}`
                  : '📊 View Results'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
