import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../contexts/NavigationContext';
import { useMenu } from '../../contexts/MenuContext';
import { lettersData } from '../../constants/categories';
import LogoImage from './LogoImage';

export default function Menu({ onSelectCategory }) {
  const { isOpen, setIsOpen } = useMenu();
  const { navigateWithDarkness } = useNavigation();

  const handleItemClick = (path, event) => {
    setIsOpen(false);
    navigateWithDarkness(path, event);
  };

  const handleCategoryClick = (category, event) => {
    setIsOpen(false);
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      navigateWithDarkness(`/?category=${category}`, event);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay de fondo oscuro semitransparente */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 z-[9998]"
          />
          {/* Panel del menú */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 z-[9999] p-6 shadow-2xl bg-zinc-950 border-r border-white/10"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="w-12 h-12">
                <LogoImage opacity={1} size="w-full h-full" />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>
            <nav>
              <ul className="space-y-4">
                <li>
                  <motion.button
                    whileHover={{ textShadow: "0 0 12px rgba(255,255,255,1)" }}
                    onClick={(e) => handleItemClick('/', e)}
                    className="text-white hover:text-white transition-colors text-lg font-trajan text-left w-full"
                    style={{ textShadow: "0 0 5px rgba(255,255,255,0.6)" }}
                  >
                    Inicio
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ textShadow: "0 0 12px rgba(255,255,255,1)" }}
                    onClick={(e) => handleItemClick('/about', e)}
                    className="text-white hover:text-white transition-colors text-lg font-trajan text-left w-full"
                    style={{ textShadow: "0 0 5px rgba(255,255,255,0.6)" }}
                  >
                    Sobre mí
                  </motion.button>
                </li>
                <li className="border-t border-zinc-800 my-2 pt-2"></li>
                {lettersData.map((item) => (
                  <li key={item.index}>
                    <motion.button
                      whileHover={{ textShadow: "0 0 12px rgba(255,255,255,1)" }}
                      onClick={(e) => handleCategoryClick(item.category, e)}
                      className="text-zinc-300 hover:text-white transition-colors text-base font-trajan text-left w-full"
                    >
                      {item.letter} - {item.category}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}