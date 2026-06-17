import React from 'react';
import { ROLES, RI } from '../data/gameData';

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
      <div className="res-sub">
        {champ
          ? 'Your Roster has conquered the M-Series World Championship. Legendary!'
          : `Eliminated at the ${last?.stage || 'Qualifier'} — defeated by ${last?.opp || 'an opponent'}.`}
      </div>

      <div className="res-stats">
        <div className="rst">
          <div className="rst-v disp">{wins}</div>
          <div className="rst-l">Rounds Won</div>
        </div>
        <div className="rst">
          <div className="rst-v disp">{journey.length}</div>
          <div className="rst-l">Rounds Played</div>
        </div>
      </div>

      {/* Tournament Path */}
      <div className="journey-list">
        <div className="jl-title">Tournament Path</div>
        {journey.map((j, idx) => (
          <div key={idx} className={`jr ${j.result === 'W' ? 'jr-win' : 'jr-loss'}`}>
            <div className="jr-stage">{j.stage}</div>
            <div className="jr-opp">vs {j.opp}</div>
            <div className={`jr-score ${j.result === 'W' ? 'jw' : 'jl'}`}>
              {j.score} {j.result === 'W' ? '✅' : '❌'}
            </div>
          </div>
        ))}
      </div>

      {/* MVP */}
      {mvp && (
        <div className="mvp-card fadein">
          <div className="mvp-badge">⭐ RUN MVP</div>
          <div className="mvp-name disp">{mvp.ign}</div>
          <div className="mvp-role">{RI[mvp.role]} {mvp.role}</div>
        </div>
      )}

      {/* Roster Summary */}
      <div className="result-roster">
        <div className="rr-title">Your Roster</div>
        <div className="rr-players">
          {ROLES.map((role, i) => {
            const p = roster[role];
            if (!p) return null;
            return (
              <div key={i} className="rr-player">
                <span className="rr-role">{RI[p.role]}</span>
                <span className="rr-ign">{p.ign}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button className="btn-cta" onClick={onPlayAgain}>🔄 Play Again</button>
    </div>
  );
}
