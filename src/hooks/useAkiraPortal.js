// hooks/useAkiraPortal.js
import { useEffect, useState, useRef } from 'react';
import { useEasterEggs } from '../components/EasterEggManager';

const useAkiraPortal = () => {
  const { unlockEgg, activateEffect, deactivateEffect, isEffectActive } = useEasterEggs();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState([]);
  const [portalPosition, setPortalPosition] = useState(null);
  const drawTimeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseDown = (e) => {
      // Solo activar con clic derecho
      if (e.button === 2) {
        setIsDrawing(true);
        setDrawPoints([{ x: e.clientX, y: e.clientY }]);
        e.preventDefault(); // Prevenir menú contextual
      }
    };

    const handleMouseMove = (e) => {
      if (isDrawing) {
        setDrawPoints(prev => [...prev, { x: e.clientX, y: e.clientY }]);
        
        // Verificar si se dibujó un círculo
        if (drawPoints.length > 10) {
          const isCircle = checkIfCircle(drawPoints);
          if (isCircle) {
            setIsDrawing(false);
            setDrawPoints([]);
            
            unlockEgg('akira-portal', 'Portal de Akira - ¡Tetsuo!');
            activateEffect('akira-portal', 10000);
            
            // Establecer posición del portal en el centro del círculo
            const center = calculateCircleCenter(drawPoints);
            setPortalPosition(center);
            
            // Eliminar portal después de 10 segundos
            setTimeout(() => {
              setPortalPosition(null);
            }, 10000);
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (isDrawing) {
        setIsDrawing(false);
        setDrawPoints([]);
      }
    };

    const handleContextMenu = (e) => {
      // Prevenir menú contextual durante el dibujo
      if (isDrawing) {
        e.preventDefault();
      }
    };

    // Verificar si los puntos forman un círculo
    const checkIfCircle = (points) => {
      if (points.length < 10) return false;
      
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];
      
      // Verificar si el inicio y el fin están cerca (círculo cerrado)
      const distance = Math.sqrt(
        Math.pow(lastPoint.x - firstPoint.x, 2) + 
        Math.pow(lastPoint.y - firstPoint.y, 2)
      );
      
      return distance < 50; // Tolerancia de 50px
    };

    const calculateCircleCenter = (points) => {
      let sumX = 0;
      let sumY = 0;
      
      points.forEach(point => {
        sumX += point.x;
        sumY += point.y;
      });
      
      return {
        x: sumX / points.length,
        y: sumY / points.length
      };
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
      
      if (drawTimeoutRef.current) {
        clearTimeout(drawTimeoutRef.current);
      }
    };
  }, [isDrawing, drawPoints, unlockEgg, activateEffect]);

  return {
    isPortalActive: isEffectActive('akira-portal'),
    portalPosition,
    isDrawing,
    drawPoints
  };
};

export default useAkiraPortal;