import React from 'react';
import logoImg from './Img/logo.png';

export default function BrandLogo({
  label = 'Hackerzz Lobby',
  showLabel = true,
  className = '',
  labelClassName = '',
  imageClassName = '',
  size = 'md',
}) {
  return (
    <div className={`brand-logo brand-logo--${size} ${className}`.trim()}>
      <img
        src={logoImg}
        alt="Hackerzz Lobby logo"
        className={`brand-logo__image ${imageClassName}`.trim()}
        draggable="false"
      />
      {showLabel && <span className={`brand-logo__label ${labelClassName}`.trim()}>{label}</span>}
    </div>
  );
}