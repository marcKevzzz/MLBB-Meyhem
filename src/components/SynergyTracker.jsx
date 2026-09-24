import React from 'react';
import { computeRosterSynergies } from '../data/synergies';

export default function SynergyTracker({ roster }) {
  const { activeSynergies, activeDuos, activeEra, totalSynergyOvr } = computeRosterSynergies(roster);
  const playerCount = Object.keys(roster || {}).length;

  if (playerCount === 0) {
    return (
      <div className="synergy-tracker-empty">
        <span className="syn-icon">⚡</span>
        <span className="syn-tip">Draft players from the same region, era, or legendary duos to unlock <strong>Team Chemistry</strong>!</span>
      </div>
    );
  }

  const hasAnyActive = activeSynergies.length > 0 || activeDuos.length > 0 || activeEra;
  const chemistryTier = totalSynergyOvr >= 6 ? 'MAX CHEMISTRY' : totalSynergyOvr >= 3 ? 'TIER 2 BOOST' : totalSynergyOvr > 0 ? 'TIER 1 BOOST' : 'NO BONUS';

  return (
    <div className="synergy-tracker-card">
      <div className="syn-header">
        <div className="syn-title-wrap">
          <span className="syn-icon-sparkle">✨</span>
          <span className="syn-heading">Team Chemistry & Synergies</span>
        </div>
        <div className="syn-bonus-badge">
          <span className="syn-bonus-label">STATUS</span>
          <span className="syn-bonus-value">{chemistryTier}</span>
        </div>
      </div>

      <div className="syn-pills-row">
        {/* Regional Synergies */}
        {activeSynergies.map((syn) => (
          <div key={syn.id} className="syn-pill syn-pill-region" title={syn.perk}>
            <span className="syn-pill-flag">{syn.flag}</span>
            <span className="syn-pill-name">{syn.name}</span>
            <span className="syn-pill-count">{syn.count}/5</span>
            <span className="syn-pill-boost">ACTIVE</span>
          </div>
        ))}

        {/* Iconic Duos */}
        {activeDuos.map((duo) => (
          <div key={duo.id} className="syn-pill syn-pill-duo" title={duo.description}>
            <span className="syn-pill-flag">{duo.badge}</span>
            <span className="syn-pill-name">{duo.name}</span>
            <span className="syn-pill-boost">LINKED</span>
          </div>
        ))}

        {/* Era Traits */}
        {activeEra && (
          <div className="syn-pill syn-pill-era" title={activeEra.description}>
            <span className="syn-pill-flag">{activeEra.badge}</span>
            <span className="syn-pill-name">{activeEra.name}</span>
            <span className="syn-pill-count">{activeEra.count}/5</span>
            <span className="syn-pill-boost">ACTIVE</span>
          </div>
        )}

        {!hasAnyActive && (
          <div className="syn-pill syn-pill-hint">
            <span>Combine same-country players, eras, or legendary duos for team chemistry!</span>
          </div>
        )}
      </div>
    </div>
  );
}
