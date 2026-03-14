import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoImage from '../components/ui/LogoImage';
import { lettersData } from '../constants/categories';
import Particles from '../components/ui/Particles';
import LetterExplosion from '../components/ui/LetterExplosion';
import DarknessOverlay from '../components/ui/DarknessOverlay';

export default function Home() {
  const navigate = useNavigate();
  const [breakingIndex, setBreakingIndex] = useState(null);
  const [explosion, setExplosion] = useState({ active: false, position: { x: 0, y: 0 } });
  const [darkness, setDarkness] = useState({ active: false, position: { x: 0, y: 0 } });
  const [targetCategory, setTargetCategory] = useState(null);

  const handleLetterClick = (item, event) => {
    const { clientX, clientY } = event; // posición exacta del clic
    setBreakingIndex(item.index);
    setTargetCategory(item.category);
    setExplosion({ active: true, position: { x: clientX, y: clientY } });
    setDarkness({ active: true, position: { x: clientX, y: clientY } });
  };

  const handleExplosionComplete = () => {
    setExplosion({ active: false, position: { x: 0, y: 0 } });
    // La oscuridad ya se encargará de navegar al terminar
  };

  const handleDarknessComplete = () => {
    setDarkness({ active: false, position: { x: 0, y: 0 } });
    if (targetCategory) {
      navigate(`/category/${targetCategory}`);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Fondo de partículas (estático) */}
      <Particles />

      {/* Oscuridad que crece desde el clic */}
      {darkness.active && (
        <DarknessOverlay
          position={darkness.position}
          onComplete={handleDarknessComplete}
        />
      )}

      {/* Explosión de líneas */}
      {explosion.active && (
        <LetterExplosion
          position={explosion.position}
          onComplete={handleExplosionComplete}
        />
      )}

      {/* Logo de fondo con círculo interactivo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96 md:w-[500px] md:h-[500px]">
          <LogoImage opacity={0.15} size="w-full h-full" />
          <div
            className="absolute w-8 h-8 rounded-full bg-white/30 cursor-pointer animate-pulse"
            style={{
              top: '65.2%',
              left: '65.5%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px rgba(255,255,255,0.8)',
            }}
            onClick={() => navigate('/about')}
            title="Ir a Sobre mí"
          />
        </div>
      </div>

      {/* Nombre con letras interactivas */}
      <div className="flex gap-4 text-8xl md:text-9xl font-trajan z-10 flex-wrap justify-center px-4">
        {lettersData.map((item) => (
          <motion.span
            key={item.index}
            className="cursor-pointer inline-block"
            whileHover={{
              textShadow: "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(100,150,255,0.5)",
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
            animate={breakingIndex === item.index ? { opacity: 0, transition: { duration: 0.1 } } : {}}
            onClick={(e) => handleLetterClick(item, e)}
          >
            {item.letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
}