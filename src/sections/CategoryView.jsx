import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import LogoImage from '../components/ui/LogoImage';
import { validCategories } from '../constants/categories';

export default function CategoryView() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!validCategories.includes(categoryName)) {
      navigate('/');
      return;
    }

    const animateSequence = async () => {
      // 1. Configuración inicial: oculto, centrado, escala grande
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

      // 2. Flash brillante: aparece con escala 2.5 y sombra muy intensa
      await controls.start({
        opacity: 1,
        scale: 2.5,
        textShadow: "0 0 100px rgba(255,255,255,1)",
        transition: { duration: 0.3, ease: "easeOut" }
      });

      // 3. Pequeña pausa: mantenemos el título en el centro
      await new Promise(resolve => setTimeout(resolve, 600)); // 600ms de pausa

      // 4. Movimiento hacia la posición final (header) y reducción de escala
      await controls.start({
        scale: 1,
        textShadow: "0 0 20px rgba(255,255,255,0.5)",
        top: "2rem",
        left: "50%",
        x: "-50%",
        y: 0,
        position: "absolute",
        transition: { duration: 0.7, ease: "easeOut" }
      });

      // 5. Mostrar contenido después de la animación
      setShowContent(true);
    };

    animateSequence();
  }, [categoryName, navigate, controls]);

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Logo para volver al home */}
      <div
        className="absolute top-4 left-4 w-12 h-12 z-30 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <LogoImage opacity={1} size="w-full h-full" />
      </div>

      {/* Título animado */}
      <motion.h1
        animate={controls}
        className="text-6xl md:text-7xl font-trajan text-white whitespace-nowrap z-10"
      >
        {categoryName}
      </motion.h1>

      {/* Contenido de la categoría (aparece después de la animación) */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto pt-32 px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-800 h-48 rounded-lg animate-pulse" />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}