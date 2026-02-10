import React from 'react';
import '../styles/components.css';

const CRTFilter = ({ children, intensity = 'medium' }) => {
  return (
    <div className={`crt-filter crt-${intensity}`}>
      <div className="crt-scanlines"></div>
      <div className="crt-noise"></div>
      {children}
    </div>
  );
};

export default CRTFilter;