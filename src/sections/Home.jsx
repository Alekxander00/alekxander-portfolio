import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import HubScene from '../components/3d/hub/HubScene';
import CategoryMiniWorld from '../components/3d/miniworlds/CategoryMiniWorld';
import LogoImage from '../components/ui/LogoImage';
import LetterExplosion from '../components/ui/LetterExplosion';
import QuickAccessModal from '../components/ui/QuickAccessModal';
import ProjectDetailModal from '../components/ui/ProjectDetailModal';
import Menu from '../components/ui/Menu';
import { useMenu } from '../contexts/MenuContext';
import { projects } from '../constants/projects';

export default function Home() {
  const { isOpen: isMenuOpen, setIsOpen: setIsMenuOpen } = useMenu();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeView, setActiveView] = useState('HUB');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [quickAccessOpen, setQuickAccessOpen] = useState(false);
  const [explosion, setExplosion] = useState({ active: false, position: { x: 0, y: 0 } });

  // Detectar si hay un parámetro de búsqueda ?category=Nombre en la URL
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
      setActiveView('MINI_WORLD');
    }
  }, [searchParams]);

  const handleEnterCategory = (item) => {
    setExplosion({
      active: true,
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    });

    setSelectedCategory(item.category);
    setActiveView('MINI_WORLD');
  };

  const handleReturnToHub = () => {
    setActiveView('HUB');
    setSelectedCategory(null);
    if (searchParams.has('category')) {
      setSearchParams({});
    }
  };

  const handleExplosionComplete = () => {
    setExplosion({ active: false, position: { x: 0, y: 0 } });
  };

  const handleMenuSelectCategory = (category) => {
    setSelectedCategory(category);
    setActiveView('MINI_WORLD');
  };

  // Determinar si algún modal 2D está abierto para ocultar los badges 3D HTML
  const isModalOpen = quickAccessOpen || selectedProject !== null || isMenuOpen;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Escena R3F 3D */}
      <Canvas camera={{ position: [0, 14, 22], fov: 45 }} shadows gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#030308']} />
        <Suspense fallback={null}>
          {activeView === 'HUB' ? (
            <HubScene onEnterCategory={handleEnterCategory} isModalOpen={isModalOpen} />
          ) : (
            <CategoryMiniWorld
              category={selectedCategory}
              onSelectProject={setSelectedProject}
              onReturnToHub={handleReturnToHub}
              hideHtml={isModalOpen}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Explosión Mágica al Entrar a Portal */}
      {explosion.active && (
        <LetterExplosion
          position={explosion.position}
          onComplete={handleExplosionComplete}
        />
      )}

      {/* Header UI Izquierdo: Logo + Menú */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-3">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setIsMenuOpen(true)}
          title="Abrir Menú Principal"
        >
          <LogoImage opacity={1} size="w-full h-full" />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="font-trajan text-white text-lg font-bold tracking-wider leading-none">
            ALEKXANDER
          </span>
          <span className="text-blue-400 text-xs tracking-widest uppercase font-semibold">
            {activeView === 'HUB' ? 'Hub del Mago' : `Dimensión: ${selectedCategory}`}
          </span>
        </div>
      </div>

      {/* Header UI Derecho: Botón Modo Lista Directo */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        {activeView === 'MINI_WORLD' && (
          <button
            onClick={handleReturnToHub}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-950/80 border border-indigo-400 text-white font-trajan text-xs sm:text-sm font-semibold hover:bg-indigo-900 transition-all active:scale-95 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
          >
            <span>Volver al Hub</span>
          </button>
        )}

        <button
          onClick={() => setQuickAccessOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white font-trajan text-xs sm:text-sm font-semibold hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all active:scale-95"
        >
          <span>Ver Todo Directo</span>
        </button>
      </div>

      {/* Pie de Pantalla: Instrucciones de Control del Mago */}
      <AnimatePresence>
        {activeView === 'HUB' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center"
          >
            <div className="px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-md border border-blue-500/30 text-zinc-200 text-xs sm:text-sm font-sans flex items-center gap-3 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
              <span className="text-blue-400 font-bold">Teclas W, A, S, D</span>
              <span>o Flechas para Mover al Mago</span>
              <span className="text-zinc-600">|</span>
              <span>Camina hacia un Portal Mágico</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menú Principal Desplegable */}
      <Menu onSelectCategory={handleMenuSelectCategory} />

      {/* Modal de Acceso Rápido */}
      <QuickAccessModal
        isOpen={quickAccessOpen}
        onClose={() => setQuickAccessOpen(false)}
        onSelectCategory={handleMenuSelectCategory}
        onSelectProject={setSelectedProject}
      />

      {/* Modal de Detalle de Proyecto Seleccionado */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}