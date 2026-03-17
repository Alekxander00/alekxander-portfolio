import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../contexts/NavigationContext';
import { useMenu } from '../../contexts/MenuContext';
import { lettersData } from '../../constants/categories';
import LogoImage from './LogoImage';

export default function Menu() {
  const { isOpen, setIsOpen } = useMenu();
  const { navigateWithDarkness } = useNavigation();

  const handleItemClick = (path, event) => {
    setIsOpen(false);
    navigateWithDarkness(path, event);
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
            className="fixed inset-0 bg-black bg-opacity-70 z-40"
          />
          {/* Panel del menú con gradiente de izquierda a derecha */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 z-50 p-6 shadow-xl"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.7), rgba(0,0,0,0))',
            }}
          >
            {/* Logo en la misma posición */}
            <div className="mb-8">
              <div className="w-12 h-12">
                <LogoImage opacity={1} size="w-full h-full" />
              </div>
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
                <li className="border-t border-gray-700 my-2 pt-2"></li>
                {lettersData.map((item) => (
                  <li key={item.index}>
                    <motion.button
                      whileHover={{ textShadow: "0 0 12px rgba(255,255,255,1)" }}
                      onClick={(e) => handleItemClick(`/category/${item.category}`, e)}
                      className="text-white hover:text-white transition-colors text-lg font-trajan text-left w-full"
                      style={{ textShadow: "0 0 5px rgba(255,255,255,0.6)" }}
                    >
                      {item.category}
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