import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectDetailModal({ project, onClose }) {
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [project]);

  if (!project) return null;

  // Función para formatear la descripción (títulos ===, viñetas •)
  const formatDescription = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Encabezados === TÍTULO ===
      const titleMatch = trimmed.match(/^={3,}\s*(.+?)\s*={3,}$/);
      if (titleMatch) {
        elements.push(
          <h3
            key={i}
            className="text-xl md:text-2xl font-trajan text-white border-b border-white/30 pb-2 mt-6 mb-4"
          >
            {titleMatch[1]}
          </h3>
        );
        i++;
        continue;
      }

      // Viñetas • o -
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        const listItems = [];
        while (
          i < lines.length &&
          (lines[i].trim().startsWith('•') || lines[i].trim().startsWith('-'))
        ) {
          const itemText = lines[i].trim().substring(1).trim();
          listItems.push(
            <li key={i} className="ml-5 mb-1 text-white">
              {itemText}
            </li>
          );
          i++;
        }
        elements.push(
          <ul key={`list-${i}`} className="list-disc text-white space-y-1 my-2">
            {listItems}
          </ul>
        );
        continue;
      }

      // Espaciado
      if (trimmed === '') {
        elements.push(<div key={i} className="h-3"></div>);
        i++;
        continue;
      }

      elements.push(
        <p key={i} className="mb-2 leading-relaxed text-white">
          {line}
        </p>
      );
      i++;
    }

    return elements;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-y-auto custom-scroll">
        {/* Backdrop semitransparente con blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal de Detalle */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative min-h-screen flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-zinc-950/95 border border-white/20 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-white"
          >
            {/* Botón Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white text-2xl hover:text-zinc-300 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>

            {/* Título */}
            <h2 className="text-3xl md:text-5xl font-trajan mb-6 text-center drop-shadow-lg">
              {project.title}
            </h2>

            {/* Imagen Principal */}
            <div className="flex justify-center mb-8">
              <div
                className="cursor-pointer group max-w-2xl w-full"
                onClick={() => setZoomedImage(project.image)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] border border-white/20"
                />
              </div>
            </div>

            {/* Descripción Formateada */}
            <div className="prose prose-invert max-w-none mb-6">
              <div className="text-zinc-200 text-sm md:text-base leading-relaxed bg-black/40 p-5 md:p-6 rounded-2xl border border-white/10">
                {formatDescription(project.description)}
              </div>
            </div>

            {/* Enlace al proyecto */}
            {project.link && (
              <div className="flex justify-center mt-6 mb-8">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 rounded-xl border border-white/60 text-white font-semibold transition-all duration-300 hover:border-blue-400 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-105"
                >
                  {project.buttonText || 'Ver proyecto →'}
                </a>
              </div>
            )}

            {/* Capturas de Pantalla Proceso */}
            {project.processImages && project.processImages.length > 0 && (
              <>
                <div className="w-24 h-px bg-white/20 mx-auto my-8"></div>
                <h3 className="text-2xl md:text-3xl font-trajan mb-5 text-center text-white">
                  Capturas de Pantalla
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                  {project.processImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group cursor-pointer"
                      onClick={() => setZoomedImage(img)}
                    >
                      <div className="overflow-hidden rounded-xl shadow-2xl border border-white/10">
                        <img
                          src={img}
                          alt={`Captura ${idx + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Lightbox Portal de Zoom */}
      {zoomedImage &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
          >
            <motion.img
              src={zoomedImage}
              alt="Zoom"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/20"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-zinc-300"
            >
              ✕
            </button>
          </motion.div>,
          document.body
        )}
    </AnimatePresence>
  );
}
