// hooks/useFLCLBass.js
import { useEffect } from 'react';
import { useEasterEggs } from '../components/EasterEggManager';

const useFLCLBass = () => {
  const { unlockEgg, activateEffect, deactivateEffect, isEffectActive } = useEasterEggs();
  
  useEffect(() => {
    const targetSequence = ['f', 'l', 'c', 'l'];
    let input = [];
    let timer;

    const handleKeyDown = (e) => {
      // Solo procesar si no es un input de texto
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key.toLowerCase();
      
      // Resetear si pasa mucho tiempo entre teclas
      clearTimeout(timer);
      timer = setTimeout(() => {
        input = [];
      }, 2000);

      input.push(key);
      
      // Mantener solo los últimos 4 inputs
      if (input.length > targetSequence.length) {
        input.shift();
      }
      
      // Verificar si coincide con la secuencia FLCL
      if (input.length === targetSequence.length) {
        const isFLCL = targetSequence.every((targetKey, index) => targetKey === input[index]);
        
        if (isFLCL) {
          unlockEgg('flcl-bass', 'Bajo de FLCL - Riff de Haruko');
          activateEffect('flcl-bass', 8000);
          
          // Reproducir sonido si está disponible
          playBassSound();
          
          // Reiniciar input
          input = [];
        }
      }
    };

    const playBassSound = () => {
      // Crear contexto de audio
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configurar sonido de bajo
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(110, audioContext.currentTime); // La2
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      // Conectar nodos
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Crear un riff simple
      oscillator.start();
      
      // Cambiar frecuencias para crear un riff
      oscillator.frequency.setValueAtTime(165, audioContext.currentTime + 0.1); // Mi3
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime + 0.2); // La3
      oscillator.frequency.setValueAtTime(165, audioContext.currentTime + 0.3); // Mi3
      oscillator.frequency.setValueAtTime(130, audioContext.currentTime + 0.4); // Do3

      // Detener después de 0.5 segundos
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [unlockEgg, activateEffect, deactivateEffect]);

  return isEffectActive('flcl-bass');
};

export default useFLCLBass;