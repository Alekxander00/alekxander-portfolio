import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoImage from '../components/ui/LogoImage';
import { lettersData } from '../constants/categories';
import LetterExplosion from '../components/ui/LetterExplosion';
import DarknessOverlay from '../components/ui/DarknessOverlay';
import ConstellationWater from '../components/ui/ConstellationWater';

export default function Home() {
  const navigate = useNavigate();
  const [breakingIndex, setBreakingIndex] = useState(null);
  const [explosion, setExplosion] = useState({ active: false, position: { x: 0, y: 0 } });
  const [darkness, setDarkness] = useState({ active: false, position: { x: 0, y: 0 } });
  const [targetCategory, setTargetCategory] = useState(null);
  const [clickPosition, setClickPosition] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  const handleLetterClick = (item, event) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    setBreakingIndex(item.index);
    setTargetCategory(item.category);
    setExplosion({ active: true, position: { x: clientX, y: clientY } });
    setDarkness({ active: true, position: { x: clientX, y: clientY } });
  };

  const handleLogoClick = (event) => {
    event.stopPropagation();
    navigate('/about');
  };

  const handleBackgroundClick = (event) => {
    const { clientX, clientY } = event;
    setClickPosition({ x: clientX, y: clientY });
    setClickCount(prev => prev + 1);
  };

  const handleExplosionComplete = () => {
    setExplosion({ active: false, position: { x: 0, y: 0 } });
  };

  const handleDarknessComplete = () => {
    setDarkness({ active: false, position: { x: 0, y: 0 } });
    if (targetCategory) {
      navigate(`/category/${targetCategory}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div
      className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {/* Fondo de constelaciones */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ConstellationWater
          clickPosition={clickPosition}
          clickId={clickCount}
        />
      </div>

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

      {/* Logo de fondo con animación de aparición */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] pointer-events-auto">
          <LogoImage opacity={0.15} size="w-full h-full" />
          <div
            className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/30 cursor-pointer animate-pulse"
            style={{
              top: '65.2%',
              left: '65.5%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px rgba(255,255,255,0.8)',
            }}
            onClick={handleLogoClick}
            title="Ir a Sobre mí"
          />
        </div>
      </motion.div>

      {/* Nombre con animación escalonada - responsive */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 sm:gap-4 px-2 z-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {lettersData.map((item) => (
          <motion.span
            key={item.index}
            className="cursor-pointer inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-trajan"
            variants={letterVariants}
            whileHover={{
              textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(100,150,255,0.5)',
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
            animate={breakingIndex === item.index ? { opacity: 0, transition: { duration: 0.1 } } : {}}
            onClick={(e) => handleLetterClick(item, e)}
          >
            {item.letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}