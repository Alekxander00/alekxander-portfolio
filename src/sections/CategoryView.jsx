import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
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
  const [exitPosition, setExitPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isRevealed, setIsRevealed] = useState(false);

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

  useEffect(() => {
    if (!validCategories.includes(categoryName)) {
      navigate('/');
      return;
    }

    setIsRevealed(false);
    setExitPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const animateSequence = async () => {
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

      await controls.start({
        opacity: 1,
        scale: 2.5,
        textShadow: '0 0 100px rgba(255,255,255,1)',
        transition: { duration: 0.3 },
      });

      await new Promise((resolve) => setTimeout(resolve, 600));

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

      const titleElement = document.getElementById('category-title');
      if (titleElement) {
        const rect = titleElement.getBoundingClientRect();
        setExitPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }

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
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ConstellationWater clickPosition={clickPosition} clickId={clickCount} />
      </div>

      <motion.div
        animate={{
          clipPath: isRevealed
            ? `circle(0% at ${exitPosition.x}px ${exitPosition.y}px)`
            : `circle(150% at ${exitPosition.x}px ${exitPosition.y}px)`,
          backgroundColor: 'black',
        }}
        transition={{ duration: isRevealed ? 0.8 : 0 }}
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

      <div
        className="absolute top-4 left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 z-30 cursor-pointer"
        onClick={handleLogoClick}
      >
        <LogoImage opacity={1} size="w-full h-full" />
      </div>

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
                className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-trajan text-center drop-shadow-lg">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Overlay semitransparente con blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProjectId(null)}
              className="fixed inset-0 z-40"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(12px)',
              }}
            />
            {/* Contenido expandido (sin fondo adicional) */}
            <motion.div
              layoutId={`project-${selectedProject.id}`}
              className="fixed inset-4 md:inset-10 z-50 overflow-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProjectId(null)}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 drop-shadow-lg"
              >
                ✕
              </button>
              <div className="max-w-5xl mx-auto text-white">
                <h2 className="text-4xl font-trajan mb-6 text-center md:text-left drop-shadow-lg">
                  {selectedProject.title}
                </h2>

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="md:w-1/2">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full rounded-lg shadow-2xl"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <p className="text-gray-100 text-lg leading-relaxed drop-shadow-md">
                      {selectedProject.description}
                    </p>
                    {selectedProject.link && (
                      <div className="mt-4">
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition shadow-lg"
                        >
                          Ver proyecto en vivo
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-3xl font-trajan mb-4 drop-shadow-lg">Proceso de creación</h3>
                {selectedProject.processImages?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                    {selectedProject.processImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Paso ${idx + 1}`}
                        className="w-full rounded-lg shadow-2xl hover:shadow-3xl transition-shadow"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300">No hay imágenes del proceso disponibles.</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}