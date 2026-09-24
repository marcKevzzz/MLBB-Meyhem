import React, { useState, useEffect } from 'react';
import { getHeroPortraitUrl } from '../data/heroPortraits';

export default function HeroAvatar({ hero, size = 36, side = 'user', showName = false }) {
  const [imgState, setImgState] = useState('loading'); // 'loading' | 'loaded' | 'fallback' | 'initials'
  const portraitUrl = getHeroPortraitUrl(hero);

  useEffect(() => {
    setImgState('loading');
  }, [hero]);

  const ringClass = side === 'user' ? 'ha-ring-user' : 'ha-ring-opp';
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(hero || 'H')}&background=0f142e&color=${side === 'user' ? '00e5ff' : 'ff4d4d'}&bold=true&size=128`;

  const handlePrimaryError = () => {
    setImgState('fallback');
  };

  const handleFallbackError = () => {
    setImgState('initials');
  };

  return (
    <div className="hero-avatar-wrapper" title={hero}>
      <div
        className={`hero-avatar-circle ${ringClass}`}
        style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px` }}
      >
        {imgState !== 'initials' && (
          <img
            src={imgState === 'fallback' ? fallbackUrl : portraitUrl}
            alt={hero}
            className={`hero-avatar-img ${imgState === 'loaded' ? 'ha-img-loaded' : 'ha-img-loading'}`}
            onLoad={() => setImgState(prev => prev === 'fallback' ? 'fallback' : 'loaded')}
            onError={imgState === 'fallback' ? handleFallbackError : handlePrimaryError}
            loading="eager"
            decoding="async"
          />
        )}
        {(imgState === 'initials' || imgState === 'loading') && (
          <span className="hero-avatar-fallback">
            {(hero || 'H').slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      {showName && <span className="hero-avatar-name">{hero}</span>}
    </div>
  );
}
