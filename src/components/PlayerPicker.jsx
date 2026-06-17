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

export default function PlayerPicker({
  TEAM_DATA,
  chosenTeam,
  roster,
  onDraftPlayer
}) {
  const t = TEAM_DATA[chosenTeam];
  if (!t) return null;

  return (
    <div className="phase on fadein">
      <div className="draft-header">
        <div className="ph-eyebrow">Step 2 of 2</div>
        <div className="ph-title disp">Pick a Player</div>
        <div className="ph-sub">
          Choose one player from {chosenTeam} to join your roster.
        </div>
      </div>

      <div className="team-header-card">
        <div className="thc-logo">
          <TeamLogo logo={t.logo} name={chosenTeam} />
        </div>
        <div className="thc-info">
          <div className="thc-name disp">{chosenTeam}</div>
          <div className="thc-region">{t.country} · {t.year}</div>
          {t.championship && (
            <span className="tag tag-gold" style={{ marginTop: '4px', display: 'inline-block' }}>
              🏆 {t.championship} Champion
            </span>
          )}
        </div>
      </div>

      <div className="player-grid fadein" style={{ animationDelay: '0.1s' }}>
        {[...t.players].sort((a, b) => ROLES.indexOf(a.role) - ROLES.indexOf(b.role)).map((p) => {
          const isFilled = !!roster[p.role];
          const isMyPick = roster[p.role]?.ign === p.ign;

          if (isFilled && !isMyPick) {
            return (
              <div key={p.ign} className="player-card pc-locked">
                <div className="pc-lock-overlay">
                  <span>🔒</span>
                  <span>Role Filled</span>
                </div>
                <div className="pc-ign">{p.ign}</div>
                <span className={`pc-role-badge rb-${p.role}`}><RoleIcon role={p.role} /> {p.role}</span>
              </div>
            );
          }

          if (isMyPick) {
            return (
              <div key={p.ign} className="player-card pc-selected">
                <div className="pc-selected-badge">✓ DRAFTED</div>
                <div className="pc-ign">{p.ign}</div>
                <span className={`pc-role-badge rb-${p.role}`}><RoleIcon role={p.role} /> {p.role}</span>
              </div>
            );
          }

          return (
            <div
              key={p.ign}
              className="player-card pc-available"
              onClick={() => onDraftPlayer(chosenTeam, p)}
            >
              <div className="pc-ign">{p.ign}</div>
              <span className={`pc-role-badge rb-${p.role}`}><RoleIcon role={p.role} /> {p.role}</span>
              <div className="pc-draft-hint">Tap to draft →</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
