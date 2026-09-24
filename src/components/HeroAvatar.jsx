import React, { useState } from 'react';
import { getHeroPortraitUrl } from '../data/heroPortraits';

export default function HeroAvatar({ hero, size = 36, side = 'user', showName = false }) {
  const [imgError, setImgError] = useState(false);
  const portraitUrl = getHeroPortraitUrl(hero);

  const ringClass = side === 'user' ? 'ha-ring-user' : 'ha-ring-opp';

  return (
    <div className="hero-avatar-wrapper" title={hero}>
      <div
        className={`hero-avatar-circle ${ringClass}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {!imgError && portraitUrl ? (
          <img
            src={portraitUrl}
            alt={hero}
            className="hero-avatar-img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="hero-avatar-fallback">
            {(hero || 'H').slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      {showName && <span className="hero-avatar-name">{hero}</span>}
    </div>
  );
}
