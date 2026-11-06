import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../constants/projects';
import { lettersData } from '../../constants/categories';

export default function QuickAccessModal({ isOpen, onClose, onSelectCategory, onSelectProject }) {
  if (!isOpen) return null;

  const handleCategoryClick = (category) => {
    onClose();
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  const handleProjectClick = (proj) => {
    onClose();
    if (onSelectProject) {
      onSelectProject(proj);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl custom-scroll overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[85vh] bg-zinc-950 border border-white/20 rounded-2xl p-6 md:p-8 overflow-y-auto custom-scroll shadow-2xl"
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            ✕
          </button>

          {/* Encabezado */}
          <div className="mb-8 border-b border-white/10 pb-4 text-center">
            <h2 className="text-3xl md:text-4xl font-trajan text-white mb-2">
              Vista Rápida de Proyectos
            </h2>
            <p className="text-zinc-400 text-sm">
              Acceso directo a todas las categorías y trabajos para una exploración rápida.
            </p>
          </div>

          {/* Listado de Categorías y Proyectos */}
          <div className="space-y-8">
            {lettersData.map((cat) => {
              const catProjects = projects.filter((p) => p.category === cat.category);
              const hasProjects = catProjects.length > 0;

              return (
                <div
                  key={cat.index}
                  className={`p-4 rounded-xl border transition-all ${
                    hasProjects
                      ? 'border-white/20 bg-white/5 hover:border-blue-500/50'
                      : 'border-zinc-800 bg-zinc-900/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`flex items-center gap-3 ${hasProjects ? 'cursor-pointer' : ''}`}
                      onClick={() => hasProjects && handleCategoryClick(cat.category)}
                    >
                      <span className="font-trajan text-2xl font-bold text-blue-400">
                        {cat.letter}
                      </span>
                      <h3 className="font-trajan text-xl text-white hover:text-blue-300 transition-colors">
                        {cat.category}
                      </h3>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        hasProjects
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {hasProjects
                        ? `${catProjects.length} Proyecto(s)`
                        : 'En construcción'}
                    </span>
                  </div>

                  {hasProjects ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {catProjects.map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => handleProjectClick(proj)}
                          className="group cursor-pointer rounded-lg overflow-hidden border border-white/10 bg-black/40 hover:border-blue-400 transition-all hover:scale-[1.02] p-2"
                        >
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-24 object-cover rounded mb-2 group-hover:brightness-110 transition-all"
                          />
                          <h4 className="font-trajan text-sm text-white line-clamp-1 group-hover:text-blue-300">
                            {proj.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-xs italic">
                      Esta área está en desarrollo activo. Próximamente se añadirán nuevos proyectos.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
