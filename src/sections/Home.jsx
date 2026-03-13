import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoImage from '../components/ui/LogoImage';
import { lettersData } from '../constants/categories';
import Particles from '../components/ui/Particles'; // lo crearemos después

export default function Home() {
  const navigate = useNavigate();
  const [breakingIndex, setBreakingIndex] = useState(null);
  const [showFlash, setShowFlash] = useState(false);

  const handleLetterClick = (item) => {
    setBreakingIndex(item.index);
    setShowFlash(true);
    // Después de la animación de ruptura (400ms), navegamos
    setTimeout(() => {
      navigate(`/category/${item.category}`);
    }, 400);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Fondo de partículas */}
      <Particles />

      

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
            // Animación de "ruptura" al hacer clic
            animate={breakingIndex === item.index ? {
              scale: [1, 1.5, 0],
              rotate: [0, 10, -10, 0],
              opacity: [1, 1, 0],
              transition: { duration: 0.4 }
            } : {}}
            onClick={() => handleLetterClick(item)}
          >
            {item.letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
}