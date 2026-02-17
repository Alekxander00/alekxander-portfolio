import React, { useEffect, useRef } from 'react';
import '../styles/particle-bg.css';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];

    // Configuración
    const particleCount = 80;
    const particleColors = [
      '#00ff88', '#00ffff', '#ff00ff', '#0088ff', '#ffff00'
    ];

    // Inicializar canvas
    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Clase Partícula
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.originalColor = this.color;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.glowIntensity = 0;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebotar en los bordes
        if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;

        // Interacción con el mouse
        const dx = mousePosition.current.x - this.x;
        const dy = mousePosition.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          // Repeler partículas del mouse
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
          
          // Cambiar color al acercarse
          this.glowIntensity = 1 - (distance / maxDistance);
          this.color = `rgb(${
            Math.min(255, parseInt(this.originalColor.slice(1, 3), 16) + this.glowIntensity * 100)
          }, ${
            Math.min(255, parseInt(this.originalColor.slice(3, 5), 16) + this.glowIntensity * 100)
          }, ${
            Math.min(255, parseInt(this.originalColor.slice(5, 7), 16) + this.glowIntensity * 100)
          })`;
        } else {
          this.glowIntensity = 0;
          this.color = this.originalColor;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity + this.glowIntensity * 0.3;
        ctx.fill();

        // Glow effect
        if (this.glowIntensity > 0) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            this.x, this.y, this.size,
            this.x, this.y, this.size * 3
          );
          gradient.addColorStop(0, this.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.globalAlpha = this.glowIntensity * 0.2;
          ctx.fill();
        }
      }

      connect(particles) {
        particles.forEach(particle => {
          const dx = this.x - particle.x;
          const dy = this.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = (0.1 * (1 - distance / 100)) + this.glowIntensity * 0.3;
            ctx.lineWidth = 0.5;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
          }
        });
      }
    }

    // Inicializar partículas
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      particlesRef.current = particles;
    };

    // Animar
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Dibujar conexiones
      particles.forEach(particle => {
        particle.connect(particles);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Event Listeners
    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleResize = () => {
      initCanvas();
      initParticles();
    };

    // Inicializar
    initCanvas();
    initParticles();
    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="particle-background"
    />
  );
};

export default ParticleBackground;