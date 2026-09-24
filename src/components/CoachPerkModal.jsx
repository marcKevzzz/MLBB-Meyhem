import React from 'react';

export default function CoachPerkModal({ perkChoices, onSelectPerk, stageName }) {
  if (!perkChoices || perkChoices.length === 0) return null;

  return (
    <div className="coach-perk-backdrop">
      <div className="coach-perk-modal">
        <div className="cpm-header">
          <div className="cpm-badge">VICTORY REWARD</div>
          <h2 className="cpm-title">Choose Coach Upgrade</h2>
          <p className="cpm-subtitle">
            Advancing past <strong>{stageName}</strong>! Select 1 tactical perk to empower your roster for the remainder of the championship.
          </p>
        </div>

        <div className="cpm-cards-grid">
          {perkChoices.map((perk) => (
            <div
              key={perk.id}
              className={`cpm-card cpm-rarity-${perk.rarity}`}
              onClick={() => onSelectPerk(perk)}
            >
              <div className="cpm-card-glow" />
              <div className="cpm-card-top">
                <div className="cpm-card-top-left">
                  <span className={`cpm-rarity-tag tag-${perk.rarity}`}>
                    {perk.rarity.toUpperCase()}
                  </span>
                  {perk.targetRole && (
                    <span className={`cpm-role-tag role-tag-${perk.targetRole.toLowerCase()}`}>
                      {perk.targetRole === 'Team' ? '👥 TEAM MACRO' : 
                       perk.targetRole === 'Tactical' ? '🎯 TACTICAL' : 
                       `⚔️ ${perk.targetRole.toUpperCase()}`}
                    </span>
                  )}
                </div>
                <span className="cpm-card-icon">{perk.icon}</span>
              </div>

              <h3 className="cpm-card-name">{perk.name}</h3>
              <div className="cpm-card-tagline">{perk.tagline}</div>

              {/* Specific numbers and distinct buff pills */}
              {perk.buffStats && perk.buffStats.length > 0 && (
                <div className="cpm-buff-stats">
                  {perk.buffStats.map((stat, sIdx) => (
                    <span key={sIdx} className={`cpm-stat-pill stat-type-${stat.type}`}>
                      {stat.label}
                    </span>
                  ))}
                </div>
              )}

              <p className="cpm-card-desc">{perk.description}</p>

              <button className="cpm-select-btn">
                <span>Select Upgrade</span>
                <span className="cpm-btn-arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
