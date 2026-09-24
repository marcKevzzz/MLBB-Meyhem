import React from 'react';

export const GAME_MODES = [
  {
    id: 'standard',
    title: 'Standard Tournament',
    badge: 'CLASSIC',
    desc: 'Draft 5 pro players and battle through 4 championship rounds.',
    icon: '⚔️',
    cta: 'PLAY STANDARD'
  },
  {
    id: 'underdog',
    title: 'Underdog Ascent',
    badge: 'CHALLENGE',
    desc: 'Draft emerging wildcard squads with +8% Underdog Spirit upset bonus in all matches.',
    icon: '🛡️',
    cta: 'PLAY UNDERDOG'
  },
  {
    id: 'gauntlet',
    title: 'M-Series Gauntlet',
    badge: 'BOSS RUSH',
    desc: 'Face historic World Champions in sequence: M1 → M2 → M3 → M4 → M5.',
    icon: '🔥',
    cta: 'PLAY GAUNTLET'
  }
];

export default function HeroScreen({ onStart }) {
  return (
    <div id="s-hero" className="scr on fadein">
      <div className="hero-glow" />
      <div className="hero-kicker">Mobile Legends Esports Simulator</div>
      <h1 className="hero-title disp">MLBB MAYHEM</h1>
      <p className="hero-sub">
        Choose your game mode to begin your championship run.
      </p>

      {/* Clean, Equal, 1-Click Game Mode Cards */}
      <div className="mode-selector-grid-v2">
        {GAME_MODES.map((m) => (
          <div
            key={m.id}
            className="mode-card-v2"
            onClick={() => onStart(m.id)}
          >
            <div className="mcv2-top">
              <span className="mcv2-icon">{m.icon}</span>
              <span className={`mcv2-badge mcv2-badge-${m.id}`}>{m.badge}</span>
            </div>
            
            <h3 className="mcv2-title disp">{m.title}</h3>
            <p className="mcv2-desc">{m.desc}</p>
            
            <button
              className="mcv2-btn"
              onClick={(e) => {
                e.stopPropagation();
                onStart(m.id);
              }}
            >
              <span>{m.cta}</span>
              <span className="mcv2-btn-arrow">→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
