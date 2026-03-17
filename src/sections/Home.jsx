import { motion } from 'framer-motion';
import { useState } from 'react';
import LogoImage from '../components/ui/LogoImage';
import { lettersData } from '../constants/categories';
import LetterExplosion from '../components/ui/LetterExplosion';
import ConstellationWater from '../components/ui/ConstellationWater';
import { useNavigation } from '../contexts/NavigationContext';
import { useMenu } from '../contexts/MenuContext';

export default function Home() {
  const { navigateWithDarkness } = useNavigation();
  const { setIsOpen } = useMenu();
  const [breakingIndex, setBreakingIndex] = useState(null);
  const [explosion, setExplosion] = useState({ active: false, position: { x: 0, y: 0 } });
  const [clickPosition, setClickPosition] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  const handleLetterClick = (item, event) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    setBreakingIndex(item.index);
    setExplosion({ active: true, position: { x: clientX, y: clientY } });
    // Iniciar oscuridad inmediatamente desde el punto de clic
    navigateWithDarkness(`/category/${item.category}`, event);
  };

  const handleLogoClick = (event) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  const handleBackgroundClick = (event) => {
    const { clientX, clientY } = event;
    setClickPosition({ x: clientX, y: clientY });
    setClickCount(prev => prev + 1);
  };

  const handleExplosionComplete = () => {
    setExplosion({ active: false, position: { x: 0, y: 0 } });
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
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ConstellationWater clickPosition={clickPosition} clickId={clickCount} />
      </div>

      {explosion.active && (
        <LetterExplosion
          position={explosion.position}
          onComplete={handleExplosionComplete}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] pointer-events-auto">
          <LogoImage opacity={0.15} size="w-full h-full" />
          <div
            className="absolute w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/30 cursor-pointer animate-pulse"
            style={{
              top: '65.2%',
              left: '65.5%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px rgba(255,255,255,0.8)',
            }}
            onClick={handleLogoClick}
            title="Abrir menú"
          />
        </div>
      </motion.div>

      <motion.div
        className="flex gap-1 sm:gap-2 md:gap-3 lg:gap-4 z-20 flex-nowrap overflow-x-auto justify-center px-2 sm:px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ scrollbarWidth: 'none' }} /* Oculta scrollbar en Firefox */
      >
        {lettersData.map((item) => (
          <motion.span
            key={item.index}
            className="cursor-pointer inline-block font-trajan text-[clamp(1.8rem,7vw,3.5rem)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl"
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