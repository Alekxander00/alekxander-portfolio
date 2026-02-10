// hooks/useKonamiCode.js
import { useEffect } from 'react';
import { useEasterEggs } from '../components/EasterEggManager';

const useKonamiCode = () => {
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
      
      // Mantener solo los últimos 10 inputs
      if (input.length > konamiCode.length) {
        input.shift();
      }
      
      // Verificar si coincide con el código Konami
      if (input.length === konamiCode.length) {
        const isKonami = konamiCode.every((key, index) => key === input[index]);
        
        if (isKonami && !konamiActive) {
          konamiActive = true;
          unlockEgg('konami', 'Código Konami Clásico');
          activateEgg('konami');
          
          // Añadir clase al body para efectos
          document.body.classList.add('konami-active');
          
          // Desactivar después de 10 segundos
          setTimeout(() => {
            konamiActive = false;
            deactivateEgg('konami');
            document.body.classList.remove('konami-active');
          }, 10000);
          
          // Reiniciar input
          input = [];
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [unlockEgg, activateEgg, deactivateEgg]);
};

export default useKonamiCode;