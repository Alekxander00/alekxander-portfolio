import { motion } from 'framer-motion';

export default function DarknessOverlay({ position, onComplete }) {
  return (
    <motion.div
      initial={{
        clipPath: `circle(0% at ${position.x}px ${position.y}px)`,
        backgroundColor: 'black',
      }}
      animate={{
        clipPath: `circle(150% at ${position.x}px ${position.y}px)`,
      }}
      transition={{
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1], // curva personalizada para efecto dramático
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 200,
        pointerEvents: 'none',
      }}
    />
  );
}