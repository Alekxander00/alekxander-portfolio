import React, { useEffect, useRef } from 'react';
import '../styles/triangle-bg.css';

const TriangleBackground = () => {
    const canvasRef = useRef(null);
    const trianglesRef = useRef([]);
    const animationFrameId = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const timeRef = useRef(0);
    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let triangles = [];

        // Configuración
        const triangleCount = isMobile ? 15 : 40; // menos que antes pero más elegantes
        const colors = [
            'rgba(255, 200, 100, 0.6)', // dorado suave
            'rgba(255, 120, 80, 0.5)',  // coral
            'rgba(180, 130, 255, 0.5)', // lila
            'rgba(100, 200, 255, 0.5)', // celeste
        ];

        const initCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Triangle {
            constructor() {
                this.size = Math.random() * 30 + 15;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.002;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.3 + 0.2;
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.01 + 0.005;
            }

            getVertices() {
                const currentSize = this.size * (1 + Math.sin(this.pulsePhase) * 0.1);
                const angles = [0, 2.094, 4.188]; // 120 grados
                return angles.map(angle => {
                    const a = this.rotation + angle;
                    return {
                        x: this.x + Math.cos(a) * currentSize,
                        y: this.y + Math.sin(a) * currentSize
                    };
                });
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                this.pulsePhase += this.pulseSpeed;

                // Rebote suave en bordes
                if (this.x < 0 || this.x > canvas.width) this.vx *= -0.9;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -0.9;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));

                // Atracción/repulsión suave hacia el mouse
                const dx = mousePosition.current.x - this.x;
                const dy = mousePosition.current.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100 && dist > 0) {
                    const force = (100 - dist) / 1000;
                    this.vx -= (dx / dist) * force;
                    this.vy -= (dy / dist) * force;
                }
            }

            draw() {
                const vertices = this.getVertices();
                ctx.beginPath();
                ctx.moveTo(vertices[0].x, vertices[0].y);
                ctx.lineTo(vertices[1].x, vertices[1].y);
                ctx.lineTo(vertices[2].x, vertices[2].y);
                ctx.closePath();

                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();

                // Borde muy sutil
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        const initTriangles = () => {
            triangles = [];
            for (let i = 0; i < triangleCount; i++) {
                triangles.push(new Triangle());
            }
            trianglesRef.current = triangles;
        };

        const animate = () => {
            timeRef.current += 0.01;

            // Fondo degradado oscuro
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0a0a14');
            gradient.addColorStop(1, '#1a1a2e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            triangles.forEach(t => {
                t.update();
                t.draw();
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const handleResize = () => {
            initCanvas();
            initTriangles();
        };

        initCanvas();
        initTriangles();
        animate();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="triangle-background" />;
};

export default TriangleBackground;