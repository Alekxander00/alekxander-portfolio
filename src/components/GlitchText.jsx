import React from 'react';
import '../styles/components.css';

const GlitchText = ({ text, tag: Tag = 'span', className = '' }) => {
  return (
    <Tag className={`glitch-text ${className}`} data-text={text}>
      {text}
      <span className="glitch-line glitch-line-1"></span>
      <span className="glitch-line glitch-line-2"></span>
      <span className="glitch-line glitch-line-3"></span>
    </Tag>
  );
};

export default GlitchText;