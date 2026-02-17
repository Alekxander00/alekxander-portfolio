import React, { useEffect, useRef } from 'react';
import '../styles/triangle-bg.css';

const TriangleBackground = () => {
    const canvasRef = useRef(null);
    const trianglesRef = useRef([]);
    const animationFrameId = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const timeRef = useRef(0);
    const targetPositionsRef = useRef([]); // Posiciones de la Trifuerza

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let triangles = [];

        // Configuración
        const isMobile = window.innerWidth <= 768;
        const triangleCount = isMobile ? 15 : 30; // Reducido para rendimiento

        const triangleColors = [
            '#ffcc00', // Oro
            '#ff8800', // Naranja
            '#ff3366', // Rojo
            '#9966ff', // Púrpura
            '#3399ff', // Azul
        ];

        // Inicializar canvas
        const initCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Generar posiciones objetivo que forman una Trifuerza
        const generateTargetPositions = (count) => {
            const positions = [];
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const size = Math.min(canvas.width, canvas.height) * 0.3; // Tamaño de la Trifuerza

            // Tres vértices principales de la Trifuerza
            const top = { x: centerX, y: centerY - size * 0.5 };
            const left = { x: centerX - size * 0.43, y: centerY + size * 0.25 };
            const right = { x: centerX + size * 0.43, y: centerY + size * 0.25 };

            // Generar puntos alrededor de estos vértices para dar densidad
            for (let i = 0; i < count; i++) {
                // Elegir uno de los tres vértices aleatoriamente
                const base = [top, left, right][Math.floor(Math.random() * 3)];
                // Añadir un poco de dispersión
                const offsetX = (Math.random() - 0.5) * size * 0.4;
                const offsetY = (Math.random() - 0.5) * size * 0.4;
                positions.push({
                    x: base.x + offsetX,
                    y: base.y + offsetY
                });
            }
            return positions;
        };

        // Clase Triángulo
        class Triangle {
            constructor(id, targetPos) {
                this.id = id;
                this.size = Math.random() * 30 + 15; // Tamaño reducido
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.01;
                this.color = triangleColors[Math.floor(Math.random() * triangleColors.length)];
                this.originalColor = this.color;
                this.opacity = Math.random() * 0.3 + 0.1;
                this.glowIntensity = 0;
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.02 + 0.005;
                this.pulseAmplitude = Math.random() * 0.1 + 0.05;
                this.type = Math.floor(Math.random() * 3);
                // Posición objetivo (Trifuerza)
                this.targetX = targetPos.x;
                this.targetY = targetPos.y;
                // Fuerza de retorno
                this.returnForce = 0.005;
            }

            getVertices() {
                const vertices = [];
                const currentSize = this.size * (1 + Math.sin(this.pulsePhase) * this.pulseAmplitude);

                switch (this.type) {
                    case 0: // Equilátero
                        for (let i = 0; i < 3; i++) {
                            const angle = this.rotation + i * (Math.PI * 2 / 3);
                            vertices.push({
                                x: this.x + Math.cos(angle) * currentSize,
                                y: this.y + Math.sin(angle) * currentSize
                            });
                        }
                        break;
                    case 1: // Isósceles
                        vertices.push(
                            { x: this.x, y: this.y - currentSize },
                            { x: this.x - currentSize * 0.866, y: this.y + currentSize * 0.5 },
                            { x: this.x + currentSize * 0.866, y: this.y + currentSize * 0.5 }
                        );
                        break;
                    case 2: // Escaleno
                        vertices.push(
                            { x: this.x, y: this.y - currentSize },
                            { x: this.x - currentSize * 0.8, y: this.y + currentSize * 0.6 },
                            { x: this.x + currentSize * 0.6, y: this.y + currentSize * 0.4 }
                        );
                        break;
                }

                return vertices.map(v => {
                    const dx = v.x - this.x;
                    const dy = v.y - this.y;
                    const rotatedX = this.x + dx * Math.cos(this.rotation) - dy * Math.sin(this.rotation);
                    const rotatedY = this.y + dx * Math.sin(this.rotation) + dy * Math.cos(this.rotation);
                    return { x: rotatedX, y: rotatedY };
                });
            }

            update() {
                // Movimiento hacia el objetivo (Trifuerza)
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 1) {
                    // Fuerza proporcional a la distancia
                    const force = Math.min(distance * this.returnForce, 2);
                    this.vx += (dx / distance) * force;
                    this.vy += (dy / distance) * force;
                }

                // Añadir un poco de ruido para movimiento orgánico
                this.vx += (Math.random() - 0.5) * 0.1;
                this.vy += (Math.random() - 0.5) * 0.1;

                // Limitar velocidad
                const maxSpeed = 2;
                if (Math.abs(this.vx) > maxSpeed) this.vx = Math.sign(this.vx) * maxSpeed;
                if (Math.abs(this.vy) > maxSpeed) this.vy = Math.sign(this.vy) * maxSpeed;

                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                this.pulsePhase += this.pulseSpeed;

                // Mantener dentro del canvas (con rebote suave)
                if (this.x < 0 || this.x > canvas.width) this.vx *= -0.8;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -0.8;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));

                // Interacción con el mouse (repeler)
                const mouseDx = mousePosition.current.x - this.x;
                const mouseDy = mousePosition.current.y - this.y;
                const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                const maxDist = 100;

                if (mouseDist < maxDist) {
                    const force = (maxDist - mouseDist) / maxDist;
                    const angle = Math.atan2(mouseDy, mouseDx);
                    this.vx -= Math.cos(angle) * force * 1.5;
                    this.vy -= Math.sin(angle) * force * 1.5;
                    this.glowIntensity = 1 - (mouseDist / maxDist);
                } else {
                    this.glowIntensity = 0;
                }
            }

            draw() {
                const vertices = this.getVertices();

                // Dibujar triángulo
                ctx.beginPath();
                ctx.moveTo(vertices[0].x, vertices[0].y);
                for (let i = 1; i < vertices.length; i++) {
                    ctx.lineTo(vertices[i].x, vertices[i].y);
                }
                ctx.closePath();

                // Gradiente (solo si no está en modo bajo rendimiento)
                if (!isMobile) {
                    const gradient = ctx.createLinearGradient(
                        this.x - this.size, this.y - this.size,
                        this.x + this.size, this.y + this.size
                    );
                    gradient.addColorStop(0, this.color);
                    gradient.addColorStop(1, this.adjustColor(this.color, -50));
                    ctx.fillStyle = gradient;
                } else {
                    ctx.fillStyle = this.color;
                }

                ctx.globalAlpha = this.opacity + this.glowIntensity * 0.3;
                ctx.fill();

                // Borde
                ctx.strokeStyle = this.adjustColor(this.color, 50);
                ctx.lineWidth = 1 + this.glowIntensity * 2;
                ctx.globalAlpha = 0.2 + this.glowIntensity * 0.5;
                ctx.stroke();

                // Glow
                if (this.glowIntensity > 0 && !isMobile) {
                    ctx.beginPath();
                    ctx.moveTo(vertices[0].x, vertices[0].y);
                    for (let i = 1; i < vertices.length; i++) {
                        ctx.lineTo(vertices[i].x, vertices[i].y);
                    }
                    ctx.closePath();

                    const outerGradient = ctx.createRadialGradient(
                        this.x, this.y, this.size,
                        this.x, this.y, this.size * 3
                    );
                    outerGradient.addColorStop(0, this.color);
                    outerGradient.addColorStop(1, 'transparent');

                    ctx.fillStyle = outerGradient;
                    ctx.globalAlpha = this.glowIntensity * 0.2;
                    ctx.fill();
                }
            }

            adjustColor(color, amount) {
                if (color.startsWith('rgb')) {
                    const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
                    if (match) {
                        const r = Math.min(255, Math.max(0, parseInt(match[1]) + amount));
                        const g = Math.min(255, Math.max(0, parseInt(match[2]) + amount));
                        const b = Math.min(255, Math.max(0, parseInt(match[3]) + amount));
                        return `rgb(${r},${g},${b})`;
                    }
                }
                return color;
            }
        }

        // Inicializar triángulos con posiciones objetivo
        const initTriangles = () => {
            triangles = [];
            targetPositionsRef.current = generateTargetPositions(triangleCount);
            for (let i = 0; i < triangleCount; i++) {
                triangles.push(new Triangle(i, targetPositionsRef.current[i]));
            }
            trianglesRef.current = triangles;
        };

        // Animar
        const animate = () => {
            timeRef.current += 0.01;

            // Fondo con gradiente animado
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0a0a14');
            gradient.addColorStop(0.5, '#1a1a2e');
            gradient.addColorStop(1, '#0a0a14');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dibujar triángulos
            triangles.forEach(triangle => {
                triangle.update();
                triangle.draw();
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
            // Recalcular posiciones objetivo al redimensionar
            targetPositionsRef.current = generateTargetPositions(triangleCount);
            triangles.forEach((triangle, index) => {
                triangle.targetX = targetPositionsRef.current[index].x;
                triangle.targetY = targetPositionsRef.current[index].y;
            });
        };

        // Inicializar
        initCanvas();
        initTriangles();
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
            className="triangle-background"
        />
    );
};

export default TriangleBackground;