import React from 'react';
import { ROLES, ROLE_SVG } from '../data/gameData';

function RoleIcon({ role }) {
  return (
    <span
      className="role-icon-svg"
      dangerouslySetInnerHTML={{ __html: ROLE_SVG[role] || role }}
    />
  );
}

function TeamLogo({ logo, name }) {
  if (logo && (logo.startsWith('http') || logo.startsWith('/'))) {
    return (
      <div className="team-logo-wrap">
        <img src={logo} alt={name} className="team-logo-img" />
      </div>
    );
  }
  return <span className="team-logo-emoji">{logo}</span>;
}

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
              <TeamLogo logo={t.logo} name={key} />
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
                      <RoleIcon role={p.role} /> {p.ign}
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

      <div className="roster-dashboard fadein" style={{ marginTop: '32px' }}>
        <div className="rd-title disp">Your Draft Roster</div>
        <div className="rd-slots">
          {ROLES.map((role) => {
            const p = roster[role];
            return p ? (
              <div key={role} className="rd-slot rd-slot-filled fadein">
                <div className="rd-slot-role-icon">
                  <RoleIcon role={role} />
                </div>
                <div className="rd-slot-info">
                  <div className="rd-slot-role-name">{role}</div>
                  <div className="rd-slot-ign disp">{p.ign}</div>
                  <div className="rd-slot-meta">{p.country} · {p.year}</div>
                </div>
              </div>
            ) : (
              <div key={role} className="rd-slot rd-slot-empty">
                <div className="rd-slot-role-icon empty">
                  <RoleIcon role={role} />
                </div>
                <div className="rd-slot-info">
                  <div className="rd-slot-role-name">{role}</div>
                  <div className="rd-slot-status">PICKING...</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
