// hooks/useTotK.js
import { useEffect, useState } from 'react';
import { useEasterEggs } from '../components/EasterEggManager';

const useTotK = () => {
  const { unlockEgg, activateEffect, deactivateEffect, isEffectActive } = useEasterEggs();
  const [zKeyPressed, setZKeyPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Solo procesar si no es un input de texto
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key.toLowerCase() === 'z' && !zKeyPressed) {
        setZKeyPressed(true);
        
        // Iniciar temporizador para 3 segundos
        const timer = setTimeout(() => {
          unlockEgg('totk-fragments', 'Fragmentos de Tears of the Kingdom');
          activateEffect('totk-fragments', 5000);
        }, 3000);

        setPressTimer(timer);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key.toLowerCase() === 'z' && zKeyPressed) {
        setZKeyPressed(false);
        if (pressTimer) {
          clearTimeout(pressTimer);
          setPressTimer(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [zKeyPressed, pressTimer, unlockEgg, activateEffect]);

  return {
    isTotKActive: isEffectActive('totk-fragments'),
    isZKeyPressed: zKeyPressed
  };
};

export default useTotK; 