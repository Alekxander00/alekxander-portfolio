// components/EasterEggListeners.jsx
import React from 'react';
import KonamiListener from './KonamiListener';
import useFLCLBass from '../hooks/useFLCLBass';
import useTotK from '../hooks/useTotK';
import useAkiraPortal from '../hooks/useAkiraPortal';

const EasterEggListeners = () => {
  // Activar todos los hooks
  const isFLCLActive = useFLCLBass();
  const { isTotKActive, isZKeyPressed } = useTotK();
  const { isPortalActive, portalPosition, isDrawing, drawPoints } = useAkiraPortal();

  return (
    <>
      <KonamiListener />
      
      {/* Efectos visuales condicionales */}
      {isFLCLActive && <div className="flcl-effect" />}
      {isTotKActive && <div className="totk-effect" />}
      {isPortalActive && portalPosition && (
        <div 
          className="akira-portal"
          style={{
            position: 'fixed',
            left: `${portalPosition.x}px`,
            top: `${portalPosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
      
      {/* Línea de dibujo para el portal de Akira */}
      {isDrawing && drawPoints.length > 1 && (
        <svg 
          className="drawing-line"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9997
          }}
        >
          <polyline
            points={drawPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#ff3366"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5,5"
          />
        </svg>
      )}
    </>
  );
};

export default EasterEggListeners;