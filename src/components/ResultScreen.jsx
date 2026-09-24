import React from 'react';
import { ROLES, ROLE_SVG, STAGES, getStagesForMode } from '../data/gameData';
import { getSignatureHeroes } from '../data/signatureHeroes';
import { computeRosterSynergies } from '../data/synergies';

function RoleIcon({ role }) {
  return (
    <span
      className="role-icon-svg"
      dangerouslySetInnerHTML={{ __html: ROLE_SVG[role] || '' }}
    />
  );
}

export default function ResultScreen({
  champ,
  round,
  journey,
  roster,
  gameMode = 'standard',
  activePerks = [],
  onPlayAgain
}) {
  const isGauntlet = gameMode === 'gauntlet';
  const stages = getStagesForMode(gameMode);
  const title = champ ? (isGauntlet ? 'M-SERIES CONQUEROR' : 'WORLD CHAMPION') : 'ELIMINATED';
  const titleCls = champ ? 'champ' : 'elim';
  const emoji = champ ? '🏆' : '💔';

  const rosterArray = Object.values(roster);
  const mvp = rosterArray.length
    ? rosterArray.reduce((best, p) => ((p.ovr || 90) > (best.ovr || 90) ? p : best), rosterArray[0])
    : null;

  const { activeSynergies, activeDuos, activeEra } = computeRosterSynergies(roster);

  return (
    <div id="s-result" className="scr on fadein">
      {champ && (
        <div className="confetti-container">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#FFB800', '#A78BFA', '#EF4444', '#22C55E', '#06B6D4'][Math.floor(Math.random() * 5)]
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="res-mode-badge">MODE: {isGauntlet ? 'M-SERIES GAUNTLET (M1 → M7)' : gameMode.toUpperCase()}</div>
      <span className="res-emoji">{emoji}</span>
      <div className={`res-title disp ${titleCls}`}>{title}</div>

      {/* Tournament Path as Breadcrumbs */}
      <div className="journey-breadcrumbs-container" style={{ width: '100%' }}>
        <div className="jl-title disp" style={{ marginBottom: '16px' }}>
          {isGauntlet ? 'M-Series Champions Defeated' : 'Tournament Path'}
        </div>
        <div className="overlay-bracket-bar" style={{ background: 'rgba(11, 13, 30, 0.6)', margin: '0 auto 20px' }}>
          {stages.map((stage, idx) => {
            const journeyEntry = journey[idx];
            const isPlayed = !!journeyEntry;
            const won = journeyEntry?.result === 'W';

            let nodeClass = 'ob-node';
            if (isPlayed) {
              nodeClass += won ? ' ob-won' : ' ob-lost';
            } else {
              nodeClass += ' ob-future';
            }

            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div className={`ob-line ${isPlayed ? (won ? 'ob-line-done' : 'ob-line-fail') : ''}`} />
                )}
                <div className={nodeClass}>
                  <span className="ob-icon">
                    {isPlayed ? (won ? '✅' : '❌') : '🔒'}
                  </span>
                  <span className="ob-label">{stage}</span>
                  {journeyEntry && <span className="ob-score">{journeyEntry.score}</span>}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Coach Perks & Synergies Summary */}
      <div className="res-stats-summary-grid">
        {/* Synergies */}
        <div className="res-summary-card">
          <div className="rsc-header">
            <span>✨</span>
            <span className="rsc-title">Team Chemistry</span>
          </div>
          <div className="rsc-content">
            {activeSynergies.map(s => (
              <span key={s.id} className="syn-pill syn-pill-region">
                {s.flag} {s.name}
              </span>
            ))}
            {activeDuos.map(d => (
              <span key={d.id} className="syn-pill syn-pill-duo">
                {d.badge} {d.name}
              </span>
            ))}
            {activeEra && (
              <span className="syn-pill syn-pill-era">
                {activeEra.badge} {activeEra.name}
              </span>
            )}
            {!activeSynergies.length && !activeDuos.length && !activeEra && (
              <span className="rsc-empty">No active synergies</span>
            )}
          </div>
        </div>

        {/* Perks */}
        <div className="res-summary-card">
          <div className="rsc-header">
            <span>🛡️</span>
            <span className="rsc-title">Coach Upgrades ({activePerks.length})</span>
          </div>
          <div className="rsc-content">
            {activePerks.length > 0 ? (
              activePerks.map(p => (
                <span key={p.id} className={`aph-pill aph-rarity-${p.rarity}`}>
                  {p.icon} {p.name}
                </span>
              ))
            ) : (
              <span className="rsc-empty">No perks acquired</span>
            )}
          </div>
        </div>
      </div>

      {/* MVP */}
      {mvp && (
        <div className="mvp-card fadein" style={{ marginTop: '20px' }}>
          <div className="mvp-badge">⭐ RUN MVP</div>
          <div className="mvp-name disp">{mvp.ign}</div>
          <div className="mvp-role">
            <RoleIcon role={mvp.role} /> {mvp.role}
          </div>
          <div className="mvp-heroes">
            Signature: {getSignatureHeroes(mvp.ign, mvp.role).slice(0, 3).join(', ')}
          </div>
        </div>
      )}

      {/* Roster Summary */}
      <div className="result-roster" style={{ width: '100%', marginTop: '24px' }}>
        <div className="rr-title disp">Your Final Roster</div>
        <div className="rd-slots">
          {ROLES.map((role) => {
            const p = roster[role];
            if (!p) return null;
            const heroes = getSignatureHeroes(p.ign, p.role);
            return (
              <div key={role} className="rd-slot rd-slot-filled">
                <div className="rd-slot-role-icon">
                  <RoleIcon role={role} />
                </div>
                <div className="rd-slot-info">
                  <div className="rd-slot-role-name">{role}</div>
                  <div className="rd-slot-ign disp">{p.ign}</div>
                  <div className="rd-slot-meta">{heroes[0]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="btn-cta" onClick={onPlayAgain} style={{ marginTop: '28px' }}>
        🔄 Play Again
      </button>
    </div>
  );
}
