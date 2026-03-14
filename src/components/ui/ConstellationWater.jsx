import { useEffect, useRef } from 'react';

export default function ConstellationWater({ clickPosition, clickId }) {
  const canvasRef = useRef();
  const wavesRef = useRef([]);
  const starsRef = useRef([]);
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;

    // Parámetros de estrellas
    const NUM_STARS = 120;
    const CONNECTION_DISTANCE = 150; // píxeles

    // Generar estrellas solo una vez
    if (starsRef.current.length === 0) {
      for (let i = 0; i < NUM_STARS; i++) {
        starsRef.current.push({
          x: Math.random(),
          y: Math.random(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.5,
        });
      }
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Función para dibujar una estrella con deformación por ondas
    const drawStar = (x, y, brightness) => {
      let dx = 0, dy = 0;
      wavesRef.current.forEach(wave => {
        const dist = Math.hypot(x - wave.x, y - wave.y);
        if (dist < wave.radius) {
          const factor = (1 - dist / wave.radius) * wave.strength * wave.life;
          const angle = Math.atan2(y - wave.y, x - wave.x);
          dx += Math.cos(angle) * factor;
          dy += Math.sin(angle) * factor;
        }
      });

      const finalX = x + dx;
      const finalY = y + dy;

      ctx.beginPath();
      ctx.arc(finalX, finalY, 2 * brightness, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fill();
    };

    // Función para dibujar una línea entre dos estrellas
    const drawLine = (x1, y1, x2, y2, brightness) => {
      let dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0;
      wavesRef.current.forEach(wave => {
        const dist1 = Math.hypot(x1 - wave.x, y1 - wave.y);
        if (dist1 < wave.radius) {
          const factor = (1 - dist1 / wave.radius) * wave.strength * wave.life;
          const angle = Math.atan2(y1 - wave.y, x1 - wave.x);
          dx1 += Math.cos(angle) * factor;
          dy1 += Math.sin(angle) * factor;
        }
        const dist2 = Math.hypot(x2 - wave.x, y2 - wave.y);
        if (dist2 < wave.radius) {
          const factor = (1 - dist2 / wave.radius) * wave.strength * wave.life;
          const angle = Math.atan2(y2 - wave.y, x2 - wave.x);
          dx2 += Math.cos(angle) * factor;
          dy2 += Math.sin(angle) * factor;
        }
      });

      const fx1 = x1 + dx1;
      const fy1 = y1 + dy1;
      const fx2 = x2 + dx2;
      const fy2 = y2 + dy2;

      ctx.beginPath();
      ctx.moveTo(fx1, fy1);
      ctx.lineTo(fx2, fy2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${brightness * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Actualizar ondas (expandir y desvanecer)
      wavesRef.current = wavesRef.current.filter(wave => {
        wave.radius += 5;
        wave.life *= 0.98;
        return wave.life > 0.01 && wave.radius < wave.maxRadius;
      });

      const time = Date.now() / 1000;

      // Convertir estrellas a píxeles
      const starPositions = starsRef.current.map(s => ({
        x: s.x * width,
        y: s.y * height,
        phase: s.phase,
        speed: s.speed,
      }));

      // --- DIBUJO NORMAL (constelaciones) ---
      // Líneas
      for (let i = 0; i < starPositions.length; i++) {
        for (let j = i + 1; j < starPositions.length; j++) {
          const dx = starPositions[i].x - starPositions[j].x;
          const dy = starPositions[i].y - starPositions[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const brightness = 0.3 * (1 - dist / CONNECTION_DISTANCE) * (0.8 + 0.2 * Math.sin(time + i + j));
            drawLine(
              starPositions[i].x, starPositions[i].y,
              starPositions[j].x, starPositions[j].y,
              brightness
            );
          }
        }
      }

      // Estrellas
      starPositions.forEach((p, index) => {
        const brightness = 0.7 + 0.3 * Math.sin(time * starsRef.current[index].speed + starsRef.current[index].phase);
        drawStar(p.x, p.y, brightness);
      });

      // --- REFLEJO EN EL AGUA (copia invertida con ondas) ---
      ctx.save();
      ctx.globalAlpha = 0.5; // opacidad global del reflejo (se combina con la de las líneas)
      // Reflejo de líneas
      for (let i = 0; i < starPositions.length; i++) {
        for (let j = i + 1; j < starPositions.length; j++) {
          const dx = starPositions[i].x - starPositions[j].x;
          const dy = starPositions[i].y - starPositions[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const brightness = 0.3 * (1 - dist / CONNECTION_DISTANCE) * (0.8 + 0.2 * Math.sin(time + i + j));
            // Coordenadas reflejadas: Y invertida y ondulada
            const x1 = starPositions[i].x;
            const y1 = height - starPositions[i].y + Math.sin(x1 * 0.01 + time * 2) * 12;
            const x2 = starPositions[j].x;
            const y2 = height - starPositions[j].y + Math.sin(x2 * 0.01 + time * 2.2) * 12;
            drawLine(x1, y1, x2, y2, brightness * 0.5); // opacidad reducida
          }
        }
      }

      // Reflejo de estrellas
      starPositions.forEach((p, index) => {
        const brightness = 0.7 + 0.3 * Math.sin(time * starsRef.current[index].speed + starsRef.current[index].phase);
        const x = p.x;
        const y = height - p.y + Math.sin(x * 0.01 + time * 2) * 12;
        drawStar(x, y, brightness * 0.5);
      });
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Efecto separado para añadir ondas cuando hay clics
  useEffect(() => {
    if (clickPosition) {
      wavesRef.current.push({
        x: clickPosition.x,
        y: clickPosition.y,
        radius: 10,
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.8,
        strength: 40,
        life: 1.0,
      });
    }
  }, [clickId, clickPosition]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}