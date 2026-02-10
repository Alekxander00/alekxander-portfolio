import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Desplazar al inicio suavemente
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // También resetear el scroll del body por si acaso
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]); // Se ejecuta cada vez que cambia la ruta

  return null; // Este componente no renderiza nada visualmente
};

export default ScrollToTop;