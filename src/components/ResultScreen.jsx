import React from 'react';
import { ROLES, ROLE_SVG, STAGES } from '../data/gameData';

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
  onPlayAgain
}) {
  const title = champ ? 'WORLD CHAMPION' : 'ELIMINATED';
  const titleCls = champ ? 'champ' : 'elim';
  const emoji = champ ? '🏆' : '💔';
  const last = journey[journey.length - 1];

  const rosterArray = Object.values(roster);
  const mvp = rosterArray.length
    ? rosterArray.reduce((best, p) => ((p.ovr || 90) > (best.ovr || 90) ? p : best), rosterArray[0])
    : null;

  const wins = journey.filter(j => j.result === 'W').length;

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
      <span className="res-emoji">{emoji}</span>
      <div className={`res-title disp ${titleCls}`}>{title}</div>

      {/* Tournament Path as Breadcrumbs */}
      <div className="journey-breadcrumbs-container" style={{ width: '100%' }}>
        <div className="jl-title disp" style={{ marginBottom: '20px' }}>Tournament Path</div>
        <div className="overlay-bracket-bar" style={{ background: 'rgba(11, 13, 30, 0.6)', margin: '0 auto 24px' }}>
          {STAGES.map((stage, idx) => {
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

      {/* MVP */}
      {mvp && (
        <div className="mvp-card fadein">
          <div className="mvp-badge">⭐ RUN MVP</div>
          <div className="mvp-name disp">{mvp.ign}</div>
          <div className="mvp-role">
            <RoleIcon role={mvp.role} /> {mvp.role}
          </div>
        </div>
      )}

      {/* Roster Summary redone to 5-slot grid */}
      <div className="result-roster" style={{ width: '100%' }}>
        <div className="rr-title disp">Your Final Roster</div>
        <div className="rd-slots">
          {ROLES.map((role) => {
            const p = roster[role];
            if (!p) return null;
            return (
              <div key={role} className="rd-slot rd-slot-filled">
                <div className="rd-slot-role-icon">
                  <RoleIcon role={role} />
                </div>
                <div className="rd-slot-info">
                  <div className="rd-slot-role-name">{role}</div>
                  <div className="rd-slot-ign disp">{p.ign}</div>
                  <div className="rd-slot-meta">{p.country.slice(0,3).toUpperCase()} · {p.year}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="btn-cta" onClick={onPlayAgain}>🔄 Play Again</button>
    </div>
  );
}
