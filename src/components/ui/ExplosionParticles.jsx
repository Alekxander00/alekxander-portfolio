import { useCallback, useEffect } from 'react';
import { loadSlim } from 'tsparticles-slim';
import Particles from 'react-tsparticles';

export default function ExplosionParticles({ containerId, position, onComplete }) {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 400); // Duración de la explosión
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Caracteres que parecen líneas en diferentes ángulos
  const lineChars = ['|', '/', '-', '\\'];

  return (
    <Particles
      id={containerId}
      init={particlesInit}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
      }}
      options={{
        fullScreen: false,
        fpsLimit: 60,
        particles: {
          number: {
            value: 40,
            density: { enable: false },
          },
          color: { value: "#ffffff" },
          shape: {
            type: "character",
            options: {
              character: {
                value: lineChars,
                font: "24px Arial", // Tamaño de la "línea"
                style: "",
                weight: "400",
                fill: true,
              },
            },
          },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 0,
              sync: false,
            },
          },
          size: {
            value: { min: 10, max: 20 }, // Tamaño de los caracteres
            animation: {
              enable: true,
              speed: 5,
              minimumValue: 0,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 10,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "destroy" },
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: {
              enable: true,
              speed: 5,
            },
          },
        },
        background: { color: "transparent" },
        emitters: {
          position: {
            x: (position.x / window.innerWidth) * 100,
            y: (position.y / window.innerHeight) * 100,
          },
          rate: {
            quantity: 40,
            delay: 0,
          },
          size: {
            width: 10,
            height: 10,
          },
          life: {
            duration: 0.1,
            count: 1,
          },
        },
      }}
    />
  );
}