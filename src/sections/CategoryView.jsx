import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import LogoImage from '../components/ui/LogoImage';
import { validCategories } from '../constants/categories';
import DarknessOverlay from '../components/ui/DarknessOverlay';

export default function CategoryView() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [showContent, setShowContent] = useState(false);
  const [darkness, setDarkness] = useState({ active: false, position: { x: 0, y: 0 } });

  useEffect(() => {
    if (!validCategories.includes(categoryName)) {
      navigate('/');
      return;
    }

    const animateSequence = async () => {
      await controls.set({
        opacity: 0,
        scale: 3,
        textShadow: "0 0 0px rgba(255,255,255,0)",
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        position: "absolute"
      });

      await controls.start({
        opacity: 1,
        scale: 2.5,
        textShadow: "0 0 100px rgba(255,255,255,1)",
        transition: { duration: 0.3, ease: "easeOut" }
      });

      await new Promise(resolve => setTimeout(resolve, 600));

      await controls.start({
        scale: 1,
        textShadow: "0 0 20px rgba(255,255,255,0.5)",
        top: "1rem",
        left: "50%",
        x: "-50%",
        y: 0,
        position: "absolute",
        transition: { duration: 0.7, ease: "easeOut" }
      });

      setShowContent(true);
    };

    animateSequence();
  }, [categoryName, navigate, controls]);

  const handleLogoClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setDarkness({ active: true, position: { x: centerX, y: centerY } });
  };

  const handleDarknessComplete = () => {
    setDarkness({ active: false, position: { x: 0, y: 0 } });
    navigate('/');
  };

  return (
    <div className="relative w-full min-h-screen bg-black">
      {darkness.active && (
        <DarknessOverlay
          position={darkness.position}
          onComplete={handleDarknessComplete}
        />
      )}

      {/* Logo para volver al home */}
      <div
        className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 z-30 cursor-pointer"
        onClick={handleLogoClick}
      >
        <LogoImage opacity={1} size="w-full h-full" />
      </div>

      {/* Título animado - responsive */}
      <motion.h1
        animate={controls}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-trajan text-white whitespace-normal text-center px-4 z-10"
      >
        {categoryName}
      </motion.h1>

      {/* Contenido de la categoría */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto pt-24 sm:pt-28 md:pt-32 px-4 pb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-800 h-40 sm:h-48 rounded-lg animate-pulse" />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}