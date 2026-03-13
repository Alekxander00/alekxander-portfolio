// src/components/ui/LogoImage.jsx
import React from 'react';

export default function LogoImage({ 
  className = '', 
  opacity = 1, 
  size = 'w-full h-full',
  onClick = null 
}) {
  return (
    <img
      src="/images/Logo.png"
      alt="Logo"
      className={`object-contain ${size} ${className}`}
      style={{ opacity }}
      onClick={onClick}
    />
  );
}