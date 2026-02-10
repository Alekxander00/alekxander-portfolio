// components/EasterEggDisplay.jsx
import React, { useState } from 'react';
import { useEasterEggs } from './EasterEggManager';

const EasterEggDisplay = () => {
  const { unlockedEggs } = useEasterEggs();
  const [isVisible, setIsVisible] = useState(false);

  const eggsData = {
  triforce: {
    name: 'Trifuerza Completa',
    description: 'Haz clic en tres triángulos de colores dorado, rojo y azul',
    icon: '▲',
    color: '#ffcc00'
  },
  konami: {
    name: 'Código Konami',
    description: '↑ ↑ ↓ ↓ ← → ← → B A',
    icon: '🎮',
    color: '#9966ff'
  },
  'flcl-bass': {
    name: 'Bajo de FLCL',
    description: 'Presiona las teclas F, L, C, L en secuencia',
    icon: '🎸',
    color: '#9966ff'
  },
  'totk-fragments': {
    name: 'Fragmentos de TotK',
    description: 'Mantén presionada la tecla Z por 3 segundos',
    icon: '⛰️',
    color: '#ff8800'
  },
  'akira-portal': {
    name: 'Portal de Akira',
    description: 'Dibuja un círculo manteniendo clic derecho',
    icon: '🌀',
    color: '#ff3366'
  }
};

  if (unlockedEggs.length === 0) return null;

  return (
    <>
      <button 
        className="easter-egg-toggle"
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, rgba(26,26,46,0.9), rgba(42,42,78,0.7))',
          border: '1px solid rgba(255,204,0,0.3)',
          color: '#ffcc00',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-secondary)',
          letterSpacing: '1px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}
      >
        🎮 {unlockedEggs.length} Easter Egg{unlockedEggs.length !== 1 ? 's' : ''}
      </button>

      {isVisible && (
        <div className="easter-egg-panel"
          style={{
            position: 'fixed',
            bottom: '70px',
            left: '20px',
            zIndex: 9998,
            background: 'linear-gradient(135deg, rgba(26,26,46,0.95), rgba(42,42,78,0.85))',
            border: '2px solid rgba(255,204,0,0.5)',
            borderRadius: '12px',
            padding: '1.5rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            minWidth: '300px'
          }}
        >
          <h3 style={{
            color: '#ffcc00',
            fontFamily: 'var(--font-retro)',
            marginBottom: '1rem',
            fontSize: '1.2rem'
          }}>
            🥚 Easter Eggs Desbloqueados
          </h3>
          
          <div className="eggs-list">
            {unlockedEggs.map(eggId => {
              const egg = eggsData[eggId];
              if (!egg) return null;
              
              return (
                <div key={eggId} className="egg-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    borderLeft: `3px solid ${egg.color}`
                  }}
                >
                  <span className="egg-icon" style={{
                    fontSize: '1.5rem',
                    color: egg.color
                  }}>
                    {egg.icon}
                  </span>
                  <div className="egg-info">
                    <h4 style={{
                      color: '#ffffff',
                      fontFamily: 'var(--font-secondary)',
                      marginBottom: '0.25rem',
                      fontSize: '1rem'
                    }}>
                      {egg.name}
                    </h4>
                    <p style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.8rem',
                      lineHeight: '1.3'
                    }}>
                      {egg.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.5rem',
              background: 'rgba(255,51,102,0.2)',
              border: '1px solid rgba(255,51,102,0.5)',
              color: '#ff3366',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-secondary)',
              letterSpacing: '1px'
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </>
  );
};

export default EasterEggDisplay;