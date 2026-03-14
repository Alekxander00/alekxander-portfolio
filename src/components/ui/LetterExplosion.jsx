import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LetterExplosion({ position, onComplete }) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    // Generar 20 líneas con parámetros aleatorios
    const newLines = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: Math.random() * 360,
      distance: 80 + Math.random() * 150, // píxeles que se alejan
      delay: Math.random() * 0.2,
      duration: 0.5 + Math.random() * 0.3,
      length: 20 + Math.random() * 30, // largo de la línea
    }));
    setLines(newLines);

    // La explosión dura máximo 800ms, luego llamamos onComplete
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: 0,
        height: 0,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {lines.map((line) => (
        <motion.div
          key={line.id}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: line.angle,
            scaleY: 1,
          }}
          animate={{
            x: Math.cos((line.angle * Math.PI) / 180) * line.distance,
            y: Math.sin((line.angle * Math.PI) / 180) * line.distance,
            opacity: 0,
            scaleY: 1.5,
          }}
          transition={{
            duration: line.duration,
            delay: line.delay,
            ease: "easeOut",
          }}
          style={{
            position: 'absolute',
            width: '2px',
            height: line.length,
            background: 'white',
            boxShadow: '0 0 8px rgba(255,255,255,0.8)',
            transformOrigin: 'center center',
          }}
        />
      ))}
    </div>
  );
}