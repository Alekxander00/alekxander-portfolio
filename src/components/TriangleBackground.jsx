import React, { useEffect, useRef, useState } from 'react';
import { useEasterEggs } from './EasterEggManager';
import '../styles/triangle-bg.css';

const TriangleBackground = () => {
    const canvasRef = useRef(null);
    const trianglesRef = useRef([]);
    const animationFrameId = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const timeRef = useRef(0);

    // Referencias para Easter Eggs
    const clickedTrianglesRef = useRef([]);
    const [showTriforce, setShowTriforce] = useState(false);

    const { unlockEgg, activateEgg, deactivateEgg, isEggActive } = useEasterEggs();
    


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let triangles = [];

        // Configuración
        const isMobile = window.innerWidth <= 768;
        const triangleCount = isMobile ? 20 : 40;

        const triangleColors = [
            '#ffcc00', // Oro (Trifuerza) - 0
            '#ff8800', // Naranja
            '#ff3366', // Rojo Akira - 2
            '#9966ff', // Púrpura
            '#3399ff', // Azul - 4
        ];

        // Inicializar canvas
        const initCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Clase Triángulo con ID único
        class Triangle {
            constructor(id) {
                this.id = id;
                this.size = Math.random() * 40 + 20;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.colorIndex = Math.floor(Math.random() * triangleColors.length);
                this.color = triangleColors[this.colorIndex];
                this.originalColor = this.color;
                this.opacity = Math.random() * 0.3 + 0.1;
                this.glowIntensity = 0;
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.03 + 0.01;
                this.pulseAmplitude = Math.random() * 0.2 + 0.1;
                this.type = Math.floor(Math.random() * 3);
                this.isSpecial = this.colorIndex === 0 || this.colorIndex === 2 || this.colorIndex === 4; // Dorado, Rojo, Azul
                this.clickCooldown = 0;

                // Easter egg: algunos triángulos especiales
                this.isEasterEgg = Math.random() > 0.95;
                if (this.isEasterEgg) {
                    this.easterEggType = Math.floor(Math.random() * 3);
                    this.size *= 1.5;
                    this.pulseAmplitude = 0.3;
                    this.rotationSpeed *= 2;
                }
            }

            getVertices() {
                const vertices = [];
                const currentSize = this.size * (1 + Math.sin(this.pulsePhase) * this.pulseAmplitude);

                switch (this.type) {
                    case 0: // Equilátero (Trifuerza)
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
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                this.pulsePhase += this.pulseSpeed;

                if (this.clickCooldown > 0) this.clickCooldown--;

                // Rebotar en los bordes
                if (this.x <= this.size || this.x >= canvas.width - this.size) this.speedX *= -1;
                if (this.y <= this.size || this.y >= canvas.height - this.size) this.speedY *= -1;

                // Interacción con el mouse
                const dx = mousePosition.current.x - this.x;
                const dy = mousePosition.current.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);

                    this.x -= Math.cos(angle) * force * 5;
                    this.y -= Math.sin(angle) * force * 5;

                    this.glowIntensity = 1 - (distance / maxDistance);

                    if (this.color === '#ffcc00') {
                        const intensity = Math.min(255, 100 + this.glowIntensity * 155);
                        this.color = `rgb(${intensity}, ${intensity * 0.6}, 0)`;
                    }
                } else {
                    this.glowIntensity = 0;
                    this.color = this.originalColor;
                }
            }

            draw() {
                const vertices = this.getVertices();

                const isFLCLActive = window.flclEffectActive; // Lo estableceremos desde fuera
                const isTotKActive = window.totkEffectActive;
                const isPortalActive = window.portalEffectActive;
                const portalPosition = window.portalPosition;

                if (isFLCLActive) {
                    this.drawAsMusicNote();
                    return;
                }

                // Efecto TotK: Fragmentación
                if (isTotKActive) {
                    this.drawAsFragment();
                    return;
                }

                // Efecto Portal de Akira: Ser absorbido
                if (isPortalActive && portalPosition) {
                    const dx = portalPosition.x - this.x;
                    const dy = portalPosition.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 300) { // Radio de atracción
                        this.drawBeingAbsorbed(portalPosition, distance);
                        return;
                    }
                }

                // Dibujar triángulo
                ctx.beginPath();
                ctx.moveTo(vertices[0].x, vertices[0].y);
                for (let i = 1; i < vertices.length; i++) {
                    ctx.lineTo(vertices[i].x, vertices[i].y);
                }
                ctx.closePath();

                // Gradiente
                const gradient = ctx.createLinearGradient(
                    this.x - this.size, this.y - this.size,
                    this.x + this.size, this.y + this.size
                );

                const baseColor = this.color;
                gradient.addColorStop(0, baseColor);
                gradient.addColorStop(0.5, this.adjustColor(baseColor, 50));
                gradient.addColorStop(1, this.adjustColor(baseColor, -30));

                ctx.fillStyle = gradient;
                ctx.globalAlpha = this.opacity + this.glowIntensity * 0.4;
                ctx.fill();

                // Borde
                ctx.strokeStyle = this.adjustColor(baseColor, 100);
                ctx.lineWidth = 1 + this.glowIntensity * 2;
                ctx.globalAlpha = 0.3 + this.glowIntensity * 0.7;
                ctx.stroke();

                // Efecto de glow
                if (this.glowIntensity > 0) {
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
                    ctx.globalAlpha = this.glowIntensity * 0.1;
                    ctx.fill();
                }

                // Easter egg effects
                if (this.isEasterEgg) {
                    this.drawSpecialSymbol();
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

            drawSpecialSymbol() {
                const symbolSize = this.size * 0.3;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.globalAlpha = 0.8;

                switch (this.easterEggType) {
                    case 0: // Trifuerza
                        ctx.beginPath();
                        ctx.moveTo(0, -symbolSize);
                        ctx.lineTo(-symbolSize * 0.866, symbolSize * 0.5);
                        ctx.lineTo(symbolSize * 0.866, symbolSize * 0.5);
                        ctx.closePath();
                        ctx.fillStyle = '#ffffff';
                        ctx.fill();
                        break;

                    case 1: // Akira
                        ctx.font = 'bold 24px "Noto Sans JP"';
                        ctx.fillStyle = '#ff3366';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('力', 0, 0);
                        break;

                    case 2: // FLCL
                        ctx.beginPath();
                        ctx.ellipse(0, 0, symbolSize * 0.2, symbolSize * 0.4, 0, 0, Math.PI * 2);
                        ctx.rect(-symbolSize * 0.05, -symbolSize * 0.6, symbolSize * 0.1, symbolSize * 0.6);
                        ctx.fillStyle = '#9966ff';
                        ctx.fill();
                        break;
                }

                ctx.restore();
            }

            connect(triangles) {
                triangles.forEach(triangle => {
                    if (triangle !== this) {
                        const dx = this.x - triangle.x;
                        const dy = this.y - triangle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 150) {
                            ctx.beginPath();
                            ctx.moveTo(this.x, this.y);
                            ctx.lineTo(triangle.x, triangle.y);

                            const isSameType = this.type === triangle.type;
                            const isSameColor = this.originalColor === triangle.originalColor;

                            let connectionColor;
                            let opacity;

                            if (isSameType && isSameColor) {
                                connectionColor = this.color;
                                opacity = 0.15 + this.glowIntensity * 0.3;
                            } else if (isSameColor) {
                                connectionColor = this.adjustColor(this.color, -50);
                                opacity = 0.1 + this.glowIntensity * 0.2;
                            } else {
                                connectionColor = '#ffffff';
                                opacity = 0.05 + this.glowIntensity * 0.1;
                            }

                            ctx.strokeStyle = connectionColor;
                            ctx.globalAlpha = opacity * (1 - distance / 150);
                            ctx.lineWidth = 0.5 + (this.glowIntensity + triangle.glowIntensity) * 0.5;
                            ctx.stroke();
                        }
                    }
                });
            }

            // Función para verificar si un punto está dentro del triángulo
            isPointInside(px, py) {
                const vertices = this.getVertices();
                const p0 = vertices[0];
                const p1 = vertices[1];
                const p2 = vertices[2];

                const area = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
                const s = 1 / (2 * area) * (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * px + (p0.x - p2.x) * py);
                const t = 1 / (2 * area) * (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * px + (p1.x - p0.x) * py);

                return s > 0 && t > 0 && (1 - s - t) > 0;
            }

            drawAsMusicNote() {
                const ctx = canvas.getContext('2d');
                const noteSize = this.size * 1.5;
                const time = Date.now() * 0.001;

                // Posición animada para el rebote
                const bounceY = Math.sin(time * 2 + this.id * 0.1) * 20;

                ctx.save();
                ctx.translate(this.x, this.y + bounceY);

                // Dibujar cabeza de la nota
                ctx.beginPath();
                ctx.ellipse(0, 0, noteSize * 0.4, noteSize * 0.3, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#9966ff';
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Dibujar mástil
                ctx.beginPath();
                ctx.moveTo(noteSize * 0.4, 0);
                ctx.lineTo(noteSize * 0.4, noteSize * 1.2);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.stroke();

                // Dibujar corchea
                ctx.beginPath();
                ctx.arc(noteSize * 0.4, noteSize * 1.3, noteSize * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();

                ctx.restore();
            }

            drawAsFragment() {
                const ctx = canvas.getContext('2d');
                const time = Date.now() * 0.001;
                const fragmentCount = 3;

                for (let i = 0; i < fragmentCount; i++) {
                    const angle = (i * Math.PI * 2 / fragmentCount) + time;
                    const distance = this.size * 0.7;
                    const px = this.x + Math.cos(angle) * distance;
                    const py = this.y + Math.sin(angle) * distance;

                    ctx.save();
                    ctx.translate(px, py);
                    ctx.rotate(time + i);

                    // Dibujar fragmento triangular
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size * 0.3);
                    ctx.lineTo(-this.size * 0.2, this.size * 0.2);
                    ctx.lineTo(this.size * 0.2, this.size * 0.2);
                    ctx.closePath();

                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = 0.7;
                    ctx.fill();

                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    ctx.restore();
                }
            }

            drawBeingAbsorbed(portalPosition, distance) {
                const ctx = canvas.getContext('2d');
                const time = Date.now() * 0.001;

                // Calcular dirección hacia el portal
                const dx = portalPosition.x - this.x;
                const dy = portalPosition.y - this.y;
                const angle = Math.atan2(dy, dx);

                // Factor de atracción (más fuerte cuanto más cerca)
                const attraction = 1 - (distance / 300);

                // Mover hacia el portal
                this.x += Math.cos(angle) * attraction * 5;
                this.y += Math.sin(angle) * attraction * 5;

                // Reducir tamaño
                this.size *= 0.99;

                // Aumentar rotación
                this.rotationSpeed = attraction * 0.1;

                // Dibujar con efecto de distorsión
                const vertices = this.getVertices();

                ctx.save();

                // Aplicar efecto de distorsión
                ctx.beginPath();
                ctx.moveTo(vertices[0].x, vertices[0].y);
                for (let i = 1; i < vertices.length; i++) {
                    const wave = Math.sin(time * 5 + i) * attraction * 10;
                    ctx.lineTo(vertices[i].x + wave, vertices[i].y + wave);
                }
                ctx.closePath();

                // Color rojo Akira
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 2
                );
                gradient.addColorStop(0, '#ff3366');
                gradient.addColorStop(0.7, '#cc0066');
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.globalAlpha = attraction * 0.5;
                ctx.fill();

                ctx.restore();

                // Si está muy cerca del portal, reiniciar
                if (distance < 10) {
                    this.resetPosition();
                }
            }

            resetPosition() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 40 + 20;
                this.color = triangleColors[Math.floor(Math.random() * triangleColors.length)];
                this.originalColor = this.color;
            }
        }

        // Inicializar triángulos
        const initTriangles = () => {
            triangles = [];
            for (let i = 0; i < triangleCount; i++) {
                triangles.push(new Triangle(i));
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

            // Patrón sutil
            ctx.globalAlpha = 0.02;
            ctx.strokeStyle = '#9966ff';
            ctx.lineWidth = 0.5;

            const gridSize = 100;
            for (let x = 0; x < canvas.width; x += gridSize) {
                for (let y = 0; y < canvas.height; y += gridSize) {
                    const offset = Math.sin(timeRef.current + x * 0.01 + y * 0.01) * 10;

                    ctx.beginPath();
                    ctx.moveTo(x + offset, y);
                    ctx.lineTo(x + gridSize / 2 + offset, y + gridSize / 2);
                    ctx.lineTo(x - gridSize / 2 + offset, y + gridSize / 2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            ctx.globalAlpha = 1;

            // Actualizar y dibujar triángulos
            triangles.forEach(triangle => {
                triangle.update();
                triangle.draw();
            });

            // Dibujar conexiones
            triangles.forEach(triangle => {
                triangle.connect(triangles);
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
            const isMobile = window.innerWidth <= 768;
            triangles = [];
            const newCount = isMobile ? 20 : 40;
            for (let i = 0; i < newCount; i++) {
                triangles.push(new Triangle(i));
            }
            trianglesRef.current = triangles;
        };

        // EASTER EGG 1: TRIFUERZAS OCULTAS
        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Verificar clic en triángulos
            triangles.forEach(triangle => {
                if (triangle.clickCooldown === 0 && triangle.isPointInside(clickX, clickY)) {
                    triangle.clickCooldown = 30; // Cooldown de 0.5 segundos (60fps * 0.5)

                    // Easter Egg de triángulos especiales
                    if (triangle.isEasterEgg) {
                        triangle.glowIntensity = 1;
                        triangle.size *= 1.2;

                        setTimeout(() => {
                            triangle.glowIntensity = 0;
                            triangle.size /= 1.2;
                        }, 1000);
                    }

                    // Trifuerza Easter Egg: Click en 3 triángulos especiales (dorado, rojo, azul)
                    if (triangle.isSpecial && triangle.clickCooldown > 0) {
                        // Añadir a la lista de clics
                        const alreadyClicked = clickedTrianglesRef.current.find(t => t.id === triangle.id);
                        if (!alreadyClicked) {
                            clickedTrianglesRef.current.push({
                                id: triangle.id,
                                type: triangle.colorIndex,
                                triangle: triangle
                            });

                            // Limitar a 3 clics
                            if (clickedTrianglesRef.current.length > 3) {
                                clickedTrianglesRef.current.shift();
                            }

                            // Verificar si tenemos los 3 colores de la trifuerza (0=dorado, 2=rojo, 4=azul)
                            if (clickedTrianglesRef.current.length === 3) {
                                const types = clickedTrianglesRef.current.map(t => t.type);
                                const hasAllColors = types.includes(0) && types.includes(2) && types.includes(4);

                                if (hasAllColors) {
                                    // ¡Trifuerza completada!
                                    unlockEgg('triforce', 'Trifuerza de la Sabiduría, Poder y Valor');
                                    setShowTriforce(true);

                                    // Efecto especial en los triángulos
                                    clickedTrianglesRef.current.forEach(item => {
                                        item.triangle.glowIntensity = 1;
                                        item.triangle.rotationSpeed *= 3;
                                    });

                                    // Resetear después de 3 segundos
                                    setTimeout(() => {
                                        clickedTrianglesRef.current.forEach(item => {
                                            item.triangle.glowIntensity = 0;
                                            item.triangle.rotationSpeed /= 3;
                                        });
                                        clickedTrianglesRef.current = [];
                                        setShowTriforce(false);
                                    }, 3000);
                                }
                            }
                        }
                    }
                }
            });
        };

        // Inicializar
        initCanvas();
        initTriangles();
        animate();

        // Event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        window.addEventListener('click', handleClick);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('click', handleClick);
        };
    }, [unlockEgg]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="triangle-background"
            />
            {showTriforce && (
                <div className="triforce-complete">
                    <svg width="200" height="173" viewBox="0 0 200 173" className="triforce-svg">
                        {/* Triángulo superior */}
                        <polygon
                            points="100,0 50,86.6 150,86.6"
                            fill="#ffcc00"
                            stroke="#ff8800"
                            strokeWidth="3"
                        />
                        {/* Triángulo inferior izquierdo */}
                        <polygon
                            points="50,86.6 0,173 100,173"
                            fill="#3399ff"
                            stroke="#0066cc"
                            strokeWidth="3"
                        />
                        {/* Triángulo inferior derecho */}
                        <polygon
                            points="150,86.6 100,173 200,173"
                            fill="#ff3366"
                            stroke="#cc0066"
                            strokeWidth="3"
                        />
                    </svg>
                </div>
            )}
        </>
    );
};

export default TriangleBackground;