import React from 'react';

export default function HeroScreen({ onStart }) {
  return (
    <div id="s-hero" className="scr on fadein">
      <div className="hero-glow" />
      <div className="hero-kicker">M-Series World Championship</div>
      <h1 className="hero-title disp">MLBB<br />MAYHEM</h1>
      <p className="hero-sub">
        Pick your dream team of 5 pro players.<br />
        Win 4 rounds to become World Champion! 🏆
      </p>
      <button className="btn-cta" onClick={onStart}>
        🎮 START PLAYING
      </button>
      <div className="hero-chips">
        <span className="chip">🎯 Pick 5 Players</span>
        <span className="chip">⚔️ 4 Tournament Rounds</span>
        <span className="chip">🏆 Win the Championship</span>
        <span className="chip">💬 Live Commentary</span>
      </div>
    </div>
  );
}
