import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useDarkNavigation() {
  const navigate = useNavigate();
  const [darkness, setDarkness] = useState({ active: false, position: { x: 0, y: 0 } });
  const [targetPath, setTargetPath] = useState(null);

  const navigateWithDarkness = (path, event) => {
    let x = 0, y = 0;
    if (event && event.clientX !== undefined && event.clientY !== undefined) {
      // Usar coordenadas del evento de clic
      x = event.clientX;
      y = event.clientY;
    } else if (event && event.currentTarget) {
      // Fallback: centro del elemento
      const rect = event.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else {
      // Fallback: centro de la pantalla
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }
    setTargetPath(path);
    setDarkness({ active: true, position: { x, y } });
  };

  const handleDarknessComplete = () => {
    setDarkness({ active: false, position: { x: 0, y: 0 } });
    if (targetPath) {
      navigate(targetPath);
      setTargetPath(null);
    }
  };

  return { darkness, navigateWithDarkness, handleDarknessComplete };
}