import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import LogoImage from '../components/ui/LogoImage';
import { validCategories } from '../constants/categories';
import { projects } from '../constants/projects';
import { useMenu } from '../contexts/MenuContext';
import ConstellationWater from '../components/ui/ConstellationWater';

export default function CategoryView() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { setIsOpen } = useMenu();
  const controls = useAnimation();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [clickPosition, setClickPosition] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [exitPosition, setExitPosition] = useState({ x: 0, y: 0 });
  const [isRevealed, setIsRevealed] = useState(false);

  // Variante dinámica: recibe la posición y define el clipPath
  const overlayVariants = {
    hidden: (pos) => ({
      clipPath: `circle(150% at ${pos.x}px ${pos.y}px)`,
      backgroundColor: 'black',
    }),
    visible: {
      clipPath: `circle(0% at var(--x) var(--y))`,
      backgroundColor: 'black',
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  // Prevenir scroll cuando el detalle está abierto
  useEffect(() => {
    if (selectedProjectId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProjectId]);

  // Reiniciar todo al cambiar de categoría
  useEffect(() => {
    if (!validCategories.includes(categoryName)) {
      navigate('/');
      return;
    }

    setIsRevealed(false);
    setExitPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const animateSequence = async () => {
      // Configuración inicial: título oculto, centrado, escala grande
      await controls.set({
        opacity: 0,
        scale: 3,
        top: '50%',
        left: '50%',
        x: '-50%',
        y: '-50%',
        position: 'absolute',
        width: '90%',
        textAlign: 'center',
      });

      // Flash brillante
      await controls.start({
        opacity: 1,
        scale: 2.5,
        textShadow: '0 0 100px rgba(255,255,255,1)',
        transition: { duration: 0.3 },
      });

      // Pausa en el centro
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Movimiento hacia el header
      await controls.start({
        scale: 1,
        textShadow: '0 0 20px rgba(255,255,255,0.5)',
        top: '2rem',
        left: '50%',
        x: '-50%',
        y: 0,
        position: 'absolute',
        width: 'auto',
        textAlign: 'center',
        transition: { duration: 0.7 },
      });

      // Obtener la posición final del título
      const titleElement = document.getElementById('category-title');
      if (titleElement) {
        const rect = titleElement.getBoundingClientRect();
        setExitPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }

      // Esperar un frame para asegurar que el DOM se actualizó
      await new Promise((resolve) => requestAnimationFrame(resolve));
      setIsRevealed(true);
    };

    animateSequence();
  }, [categoryName, navigate, controls]);

  const handleLogoClick = () => setIsOpen(true);
  const handleBackgroundClick = (e) => {
    setClickPosition({ x: e.clientX, y: e.clientY });
    setClickCount((c) => c + 1);
  };

  const filteredProjects = projects.filter((p) => p.category === categoryName);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div
      className="relative w-full min-h-screen bg-black overflow-x-hidden"
      onClick={handleBackgroundClick}
    >
      {/* Fondo de constelaciones */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ConstellationWater clickPosition={clickPosition} clickId={clickCount} />
      </div>

      {/* Overlay con variante dinámica (se contrae desde la posición del título) */}
      <motion.div
  animate={{
    clipPath: isRevealed
      ? `circle(0% at ${exitPosition.x}px ${exitPosition.y}px)`
      : `circle(150% at ${exitPosition.x}px ${exitPosition.y}px)`,
    backgroundColor: 'black',
  }}
  transition={{ duration: isRevealed ? 0.8 : 0 }} // Sin transición al inicio
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 20,
    pointerEvents: 'none',
  }}
/>

      {/* Logo para abrir el menú */}
      <div
        className="absolute top-4 left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 z-30 cursor-pointer"
        onClick={handleLogoClick}
      >
        <LogoImage opacity={1} size="w-full h-full" />
      </div>

      {/* Título animado */}
      <motion.h1
        id="category-title"
        animate={controls}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-trajan text-white z-30 px-4"
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          textShadow: '0 0 10px rgba(255,255,255,0.5)',
        }}
      >
        {categoryName}
      </motion.h1>

      {/* Grid de proyectos (siempre presente, pero inicialmente oculto por el overlay) */}
      <div className="container mx-auto pt-24 sm:pt-28 md:pt-32 px-4 pb-8 relative z-10">
        {filteredProjects.length === 0 ? (
          <p className="text-center text-gray-400">Próximamente más proyectos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layoutId={`project-${project.id}`}
                onClick={() => setSelectedProjectId(project.id)}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detalle expandido del proyecto (opcional) */}
      {/* ... mantén aquí tu código del detalle si lo tienes ... */}
    </div>
  );
}