// components/KonamiListener.jsx
import { useEffect } from 'react';
import { useEasterEggs } from './EasterEggManager';

const KonamiListener = () => {
  const { unlockEgg, activateEgg, deactivateEgg } = useEasterEggs();
  
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    
    let input = [];
    let konamiActive = false;

    const handleKeyDown = (e) => {
      input.push(e.key);
      
      if (input.length > konamiCode.length) {
        input.shift();
      }
      
      if (input.length === konamiCode.length) {
        const isKonami = konamiCode.every((key, index) => key === input[index]);
        
        if (isKonami && !konamiActive) {
          konamiActive = true;
          unlockEgg('konami', 'Código Konami Clásico');
          activateEgg('konami');
          
          document.body.classList.add('konami-active');
          
          setTimeout(() => {
            konamiActive = false;
            deactivateEgg('konami');
            document.body.classList.remove('konami-active');
          }, 10000);
          
          input = [];
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [unlockEgg, activateEgg, deactivateEgg]);

  return null; // Este componente no renderiza nada visual
};

export default KonamiListener;