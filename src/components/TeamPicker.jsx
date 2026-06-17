import React from 'react';
import { ROLES, RI } from '../data/gameData';

export default function TeamPicker({
  TEAM_DATA,
  offeredTeams,
  roster,
  onSelectTeam,
  rosterCount,
  refreshCount,
  onRefreshTeams
}) {
  const filledRoles = Object.keys(roster);

  return (
    <div className="phase on fadein">
      <div className="draft-header">
        <div className="ph-eyebrow">Step 1 of 2</div>
        <div className="ph-title disp">Choose a Team</div>
        <div className="ph-sub">
          Tap a team to see their players and pick one.
        </div>
        <div className="draft-progress">
          <div className="dp-bar-bg">
            <div
              className="dp-bar-fill"
              style={{ width: `${(rosterCount / 5) * 100}%` }}
            />
          </div>
          <div className="dp-text">{rosterCount} / 5 players drafted</div>
        </div>
      </div>

      <div className="team-pick-grid">
        {offeredTeams.map((key) => {
          const t = TEAM_DATA[key];
          if (!t) return null;

          const availablePlayers = t.players.filter(p => !filledRoles.includes(p.role));
          const hasAvailable = availablePlayers.length > 0;

          return (
            <div
              key={key}
              className={`team-pick-card fadein ${!hasAvailable ? 'tpc-disabled' : ''}`}
              onClick={hasAvailable ? () => onSelectTeam(key) : undefined}
            >
              <span className="tpc-logo">{t.logo}</span>
              <div className="tpc-name disp">{key}</div>
              <div className="tpc-meta">
                <span className="tpc-year">{t.year}</span>
                <span className="tpc-country">{t.country}</span>
              </div>
              {t.championship && (
                <span className="tag tag-gold">🏆 {t.championship}</span>
              )}
              <div className="tpc-players">
                {[...t.players].sort((a, b) => ROLES.indexOf(a.role) - ROLES.indexOf(b.role)).map((p, pIdx) => {
                  const isFilled = filledRoles.includes(p.role);
                  return (
                    <div key={pIdx} className={isFilled ? 'tp-filled' : ''}>
                      {RI[p.role]} {p.ign}
                      {isFilled && <span className="tp-taken">✓</span>}
                    </div>
                  );
                })}
              </div>
              {!hasAvailable && (
                <div className="tpc-no-slots">All roles filled</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="action-row" style={{ marginTop: '24px', marginInline: 'Auto' }}>
        <button 
          className={`btn-sm ${refreshCount > 0 ? 'btn-outline' : ''}`} 
          onClick={onRefreshTeams}
          disabled={refreshCount <= 0}
          style={{ opacity: refreshCount > 0 ? 1 : 0.5, cursor: refreshCount > 0 ? 'pointer' : 'not-allowed' }}
        >
          🔄 Refresh Teams ({refreshCount})
        </button>
      </div>

      {rosterCount > 0 && (
        <div className="roster-mini fadein" style={{ marginTop: '32px' }}>
          <div className="rm-title">Your Roster (Draft in progress)</div>
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
      )}
    </div>
  );
}
