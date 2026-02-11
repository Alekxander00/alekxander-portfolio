import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useEasterEggs } from './EasterEggManager';
import '../styles/triangle-bg.css';

const TriangleBackground = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const animationFrameRef = useRef(null);
  const trianglesRef = useRef([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  // Estados de Easter Eggs
  const [showTriforce, setShowTriforce] = useState(false);
  const [flclActive, setFlclActive] = useState(false);
  const [totkActive, setTotkActive] = useState(false);
  const [portalActive, setPortalActive] = useState(false);
  const [portalPos, setPortalPos] = useState({ x: 0, y: 0 });

  const { unlockEgg, activateEgg, deactivateEgg } = useEasterEggs();

  // ========== CONFIGURACIÓN ==========
  const CONFIG = {
    TRIANGLE_COUNT: {
      desktop: 30, // reducido de 40
      mobile: 15,  // reducido de 20
    },
    MAX_DISTANCE: 150,
    REPEL_FORCE: 4,
    PORTAL_RADIUS: 350,
    PORTAL_DURATION: 10000, // 10s
    TOTK_DURATION: 5000,    // 5s
    FLCL_DURATION: 8000,    // 8s
  };

  const COLORS = [
    '#ffcc00', // oro
    '#ff8800', // naranja
    '#ff3366', // rojo
    '#9966ff', // púrpura
    '#3399ff', // azul
  ];

  // ========== CLASE TRIÁNGULO OPTIMIZADA ==========
  class Triangle {
    constructor(canvasWidth, canvasHeight, id) {
      this.id = id;
      this.size = Math.random() * 35 + 15;
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.015;
      this.colorIndex = Math.floor(Math.random() * COLORS.length);
      this.color = COLORS[this.colorIndex];
      this.originalColor = this.color;
      this.opacity = Math.random() * 0.2 + 0.1;
      this.glow = 0;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseAmp = Math.random() * 0.15 + 0.1;
      this.type = Math.floor(Math.random() * 3);
      this.clickCooldown = 0;

      // Solo algunos triángulos son "especiales" (Trifuerza)
      this.isSpecial = this.colorIndex === 0 || this.colorIndex === 2 || this.colorIndex === 4;
    }

    // Cálculo de vértices - cacheable, pero se llama cada frame
    getVertices(canvasWidth, canvasHeight, pulseTime) {
      const s = this.size * (1 + Math.sin(pulseTime) * this.pulseAmp);
      const cosR = Math.cos(this.rotation);
      const sinR = Math.sin(this.rotation);

      if (this.type === 0) {
        // equilátero
        const h = s * 0.866;
        return [
          { x: this.x + s * cosR, y: this.y + s * sinR },
          { x: this.x - h * sinR, y: this.y + h * cosR },
          { x: this.x + h * sinR, y: this.y - h * cosR },
        ];
      } else if (this.type === 1) {
        // isósceles
        return [
          { x: this.x, y: this.y - s },
          {
            x: this.x - s * 0.866 * cosR - s * 0.5 * sinR,
            y: this.y - s * 0.866 * sinR + s * 0.5 * cosR,
          },
          {
            x: this.x + s * 0.866 * cosR - s * 0.5 * sinR,
            y: this.y + s * 0.866 * sinR + s * 0.5 * cosR,
          },
        ];
      } else {
        // escaleno
        return [
          { x: this.x, y: this.y - s },
          {
            x: this.x - s * 0.8 * cosR - s * 0.6 * sinR,
            y: this.y - s * 0.8 * sinR + s * 0.6 * cosR,
          },
          {
            x: this.x + s * 0.6 * cosR - s * 0.4 * sinR,
            y: this.y + s * 0.6 * sinR + s * 0.4 * cosR,
          },
        ];
      }
    }

    update(canvasWidth, canvasHeight, mouseX, mouseY, portalPos, portalActive) {
      // Movimiento
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.pulse += this.pulseSpeed;
      if (this.clickCooldown > 0) this.clickCooldown--;

      // Límites
      const margin = this.size;
      if (this.x < margin) {
        this.x = margin;
        this.vx *= -1;
      }
      if (this.x > canvasWidth - margin) {
        this.x = canvasWidth - margin;
        this.vx *= -1;
      }
      if (this.y < margin) {
        this.y = margin;
        this.vy *= -1;
      }
      if (this.y > canvasHeight - margin) {
        this.y = canvasHeight - margin;
        this.vy *= -1;
      }

      // Interacción con mouse
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.hypot(dx, dy);
      const maxDist = CONFIG.MAX_DISTANCE;

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * CONFIG.REPEL_FORCE;
        this.y -= Math.sin(angle) * force * CONFIG.REPEL_FORCE;
        this.glow = force;
        // Color dorado más brillante
        if (this.colorIndex === 0) {
          const intensity = Math.min(255, 100 + force * 155);
          this.color = `rgb(${intensity}, ${intensity * 0.6}, 0)`;
        }
      } else {
        this.glow *= 0.9; // suave decaimiento
        this.color = this.originalColor;
      }

      // Efecto Portal: atracción
      if (portalActive && portalPos) {
        const dxp = portalPos.x - this.x;
        const dyp = portalPos.y - this.y;
        const distP = Math.hypot(dxp, dyp);
        if (distP < CONFIG.PORTAL_RADIUS) {
          const force = (CONFIG.PORTAL_RADIUS - distP) / CONFIG.PORTAL_RADIUS;
          this.x += dxp * 0.01 * force;
          this.y += dyp * 0.01 * force;
          this.size *= 0.997; // encogimiento
          if (distP < 10) {
            this.resetPosition(canvasWidth, canvasHeight);
          }
        }
      }
    }

    resetPosition(canvasWidth, canvasHeight) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = Math.random() * 35 + 15;
      this.colorIndex = Math.floor(Math.random() * COLORS.length);
      this.color = COLORS[this.colorIndex];
      this.originalColor = this.color;
    }

    // Dibujado optimizado (menos creación de objetos)
    draw(ctx, canvasWidth, canvasHeight, isFlcl, isTotk, portalActive, portalPos) {
      if (isFlcl) {
        this.drawAsMusicNote(ctx);
        return;
      }
      if (isTotk) {
        this.drawAsFragment(ctx);
        return;
      }

      const vertices = this.getVertices(canvasWidth, canvasHeight, this.pulse);
      if (vertices.length < 3) return;

      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      ctx.lineTo(vertices[1].x, vertices[1].y);
      ctx.lineTo(vertices[2].x, vertices[2].y);
      ctx.closePath();

      // Gradiente
      const grd = ctx.createLinearGradient(
        this.x - this.size,
        this.y - this.size,
        this.x + this.size,
        this.y + this.size
      );
      grd.addColorStop(0, this.color);
      grd.addColorStop(0.5, this.adjustColor(this.color, 40));
      grd.addColorStop(1, this.adjustColor(this.color, -20));

      ctx.fillStyle = grd;
      ctx.globalAlpha = this.opacity + this.glow * 0.3;
      ctx.fill();

      // Borde
      ctx.strokeStyle = this.adjustColor(this.color, 80);
      ctx.lineWidth = 1 + this.glow * 2;
      ctx.globalAlpha = 0.2 + this.glow * 0.6;
      ctx.stroke();

      // Glow exterior
      if (this.glow > 0.1) {
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15 * this.glow;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.glow * 0.15;
        ctx.fill();
        ctx.restore();
      }
    }

    drawAsMusicNote(ctx) {
      const noteSize = this.size * 1.2;
      const bounce = Math.sin(Date.now() * 0.005 + this.id) * 10;

      ctx.save();
      ctx.translate(this.x, this.y + bounce);

      // Cabeza
      ctx.beginPath();
      ctx.ellipse(0, 0, noteSize * 0.35, noteSize * 0.25, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#9966ff';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mástil
      ctx.beginPath();
      ctx.moveTo(noteSize * 0.35, 0);
      ctx.lineTo(noteSize * 0.35, noteSize * 0.9);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Corchea
      ctx.beginPath();
      ctx.arc(noteSize * 0.35, noteSize * 1.0, noteSize * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      ctx.restore();
    }

    drawAsFragment(ctx) {
      const time = Date.now() * 0.001;
      for (let i = 0; i < 3; i++) {
        const angle = time * 2 + i * 2.09;
        const dist = this.size * 0.5;
        const px = this.x + Math.cos(angle) * dist;
        const py = this.y + Math.sin(angle) * dist;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(time + i);
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.2);
        ctx.lineTo(-this.size * 0.15, this.size * 0.15);
        ctx.lineTo(this.size * 0.15, this.size * 0.15);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.restore();
      }
    }

    adjustColor(color, amount) {
      if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match) {
          const r = Math.min(255, Math.max(0, parseInt(match[0]) + amount));
          const g = Math.min(255, Math.max(0, parseInt(match[1]) + amount));
          const b = Math.min(255, Math.max(0, parseInt(match[2]) + amount));
          return `rgb(${r},${g},${b})`;
        }
      }
      return color;
    }

    isPointInside(px, py, canvasWidth, canvasHeight) {
      const v = this.getVertices(canvasWidth, canvasHeight, this.pulse);
      const sign = (p1, p2, p3) =>
        (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
      const d1 = sign({ x: px, y: py }, v[0], v[1]);
      const d2 = sign({ x: px, y: py }, v[1], v[2]);
      const d3 = sign({ x: px, y: py }, v[2], v[0]);
      const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
      const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
      return !(hasNeg && hasPos);
    }
  }

  // ========== INICIALIZACIÓN ==========
  const initTriangles = useCallback((width, height) => {
    const isMobile = width <= 768;
    const count = isMobile ? CONFIG.TRIANGLE_COUNT.mobile : CONFIG.TRIANGLE_COUNT.desktop;
    const newTris = [];
    for (let i = 0; i < count; i++) {
      newTris.push(new Triangle(width, height, i));
    }
    return newTris;
  }, []);

  // ========== EASTER EGGS ==========
  // FLCL
  useEffect(() => {
    const handleFLCL = (e) => {
      if (!flclActive) {
        const sequence = [];
        let lastTime = 0;
        const onKeyDown = (e) => {
          const now = Date.now();
          if (now - lastTime > 2000) sequence.length = 0;
          lastTime = now;
          sequence.push(e.key.toLowerCase());
          if (sequence.length > 4) sequence.shift();
          if (sequence.join('') === 'f l c l'.replace(/ /g, '')) {
            unlockEgg('flcl', 'Bass Guitar de FLCL');
            setFlclActive(true);
            setTimeout(() => setFlclActive(false), CONFIG.FLCL_DURATION);
            sequence.length = 0;
          }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
      }
    };
    handleFLCL();
  }, [flclActive, unlockEgg]);

  // TotK (tecla Z mantenida)
  useEffect(() => {
    let timer;
    const onKeyDown = (e) => {
      if (e.key === 'z' && !totkActive) {
        timer = setTimeout(() => {
          unlockEgg('totk', 'Tears of the Kingdom');
          setTotkActive(true);
          setTimeout(() => setTotkActive(false), CONFIG.TOTK_DURATION);
        }, 3000);
      }
    };
    const onKeyUp = (e) => {
      if (e.key === 'z') clearTimeout(timer);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      clearTimeout(timer);
    };
  }, [totkActive, unlockEgg]);

  // Portal de Akira (clic derecho + círculo)
  useEffect(() => {
    let drawing = false;
    let points = [];
    const onMouseDown = (e) => {
      if (e.button === 2 && !portalActive) {
        drawing = true;
        points = [];
        points.push({ x: e.clientX, y: e.clientY });
      }
    };
    const onMouseMove = (e) => {
      if (drawing) {
        points.push({ x: e.clientX, y: e.clientY });
        if (points.length > 20) points.shift();
      }
    };
    const onMouseUp = (e) => {
      if (e.button === 2 && drawing) {
        drawing = false;
        // Detectar si es aproximadamente un círculo
        if (points.length > 10) {
          let sumX = 0,
            sumY = 0;
          points.forEach((p) => {
            sumX += p.x;
            sumY += p.y;
          });
          const avgX = sumX / points.length;
          const avgY = sumY / points.length;
          let radiusVariance = 0;
          points.forEach((p) => {
            const r = Math.hypot(p.x - avgX, p.y - avgY);
            radiusVariance += Math.abs(r - 100);
          });
          radiusVariance /= points.length;
          if (radiusVariance < 50) {
            unlockEgg('portal', 'Portal de Akira');
            setPortalPos({ x: avgX, y: avgY });
            setPortalActive(true);
            setTimeout(() => setPortalActive(false), CONFIG.PORTAL_DURATION);
          }
        }
      }
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('contextmenu', (e) => e.preventDefault()); // evitar menú contextual
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [portalActive, unlockEgg]);

  // ========== LOOP PRINCIPAL ==========
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    ctxRef.current = ctx;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      trianglesRef.current = initTriangles(width, height);
    };
    resize();
    window.addEventListener('resize', resize);

    let triangles = trianglesRef.current;

    // Animación
    const animate = () => {
      if (!canvas || !ctx) return;

      // Limpiar canvas con gradiente (más económico que crear gradiente cada frame)
      ctx.clearRect(0, 0, width, height);
      const grd = ctx.createLinearGradient(0, 0, width, height);
      grd.addColorStop(0, '#0a0a14');
      grd.addColorStop(0.5, '#1a1a2e');
      grd.addColorStop(1, '#0a0a14');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      // Patrón de fondo (solo en desktop y no en móvil)
      if (width > 768) {
        ctx.save();
        ctx.globalAlpha = 0.015;
        ctx.strokeStyle = '#9966ff';
        ctx.lineWidth = 0.5;
        const grid = 80;
        for (let x = 0; x < width; x += grid) {
          for (let y = 0; y < height; y += grid) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + grid / 2, y + grid / 2);
            ctx.lineTo(x - grid / 2, y + grid / 2);
            ctx.closePath();
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // Actualizar y dibujar triángulos
      triangles.forEach((t) => {
        t.update(width, height, mousePos.current.x, mousePos.current.y, portalPos, portalActive);
        t.draw(ctx, width, height, flclActive, totkActive, portalActive, portalPos);
      });

      // Conexiones (solo si no hay efectos pesados)
      if (!flclActive && !totkActive && width > 768) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        triangles.forEach((t, i) => {
          for (let j = i + 1; j < triangles.length; j++) {
            const t2 = triangles[j];
            const dx = t.x - t2.x;
            const dy = t.y - t2.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(t.x, t.y);
              ctx.lineTo(t2.x, t2.y);
              ctx.strokeStyle = t.color;
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        });
        ctx.restore();
      }

      // Dibujar portal si está activo
      if (portalActive) {
        ctx.save();
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(portalPos.x, portalPos.y, 80, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 51, 102, 0.2)';
        ctx.fill();
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(portalPos.x, portalPos.y, 60, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 51, 102, 0.3)';
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [initTriangles, flclActive, totkActive, portalActive, portalPos]);

  // ========== MOUSE TRACKING ==========
  useEffect(() => {
    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // ========== CLICK PARA TRIFUERZA ==========
  const clickedRef = useRef([]);
  useEffect(() => {
    const handleClick = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = canvas.width;
      const height = canvas.height;

      trianglesRef.current.forEach((tri) => {
        if (tri.clickCooldown === 0 && tri.isPointInside(x, y, width, height)) {
          tri.clickCooldown = 30;
          if (tri.isSpecial) {
            const exists = clickedRef.current.find((c) => c.id === tri.id);
            if (!exists) {
              clickedRef.current.push({
                id: tri.id,
                type: tri.colorIndex,
                tri,
              });
              if (clickedRef.current.length > 3) clickedRef.current.shift();
              if (clickedRef.current.length === 3) {
                const types = clickedRef.current.map((c) => c.type);
                if (types.includes(0) && types.includes(2) && types.includes(4)) {
                  unlockEgg('triforce', 'Trifuerza de la Sabiduría, Poder y Valor');
                  setShowTriforce(true);
                  setTimeout(() => setShowTriforce(false), 3000);
                  clickedRef.current = [];
                }
              }
            }
          }
        }
      });
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [unlockEgg]);

  return (
    <>
      <canvas ref={canvasRef} className="triangle-background" />
      {showTriforce && (
        <div className="triforce-complete">
          <svg width="200" height="173" viewBox="0 0 200 173">
            <polygon points="100,0 50,86.6 150,86.6" fill="#ffcc00" stroke="#ff8800" strokeWidth="3" />
            <polygon points="50,86.6 0,173 100,173" fill="#3399ff" stroke="#0066cc" strokeWidth="3" />
            <polygon points="150,86.6 100,173 200,173" fill="#ff3366" stroke="#cc0066" strokeWidth="3" />
          </svg>
        </div>
      )}
    </>
  );
};

export default TriangleBackground;