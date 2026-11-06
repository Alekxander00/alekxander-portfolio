# Portafolio "La Baraja" (diseño, versión 2: la mesa 3D)

Fecha: 2026-11-05. Aprobado en conversación por Alekxander.
La versión 1 (plana) está construida (commit 1735727) y queda como plan B sin WebGL.

## Idea

El portafolio es una partida de cartas. Estás sentado a una mesa 3D; el scroll de la página mueve la cámara por la mesa. Todo se descubre jugando, sin instrucciones, y lo importante (proyectos, CV, contacto) se puede leer siempre sin jugar.

Lectura de diseño: portafolio de desarrollador de videojuegos y web interactiva, para estudios y clientes, visto sobre todo en celular. Lenguaje: mesa de juego nocturna, cartas de autor. Diales: ENERGY 3 / RHYTHM 3 / MOTION 3.

## La escena

- Un solo canvas WebGL fijo detrás de toda la página (three + @react-three/fiber).
- Mesa: paño color vino muy oscuro, borde acolchado de madera, una lámpara colgante cálida encima. Lo de fuera de la luz se pierde en penumbra.
- Cámara en primera persona: sentado en la partida. La Máquina queda enfrente, del otro lado de la mesa, como crupier.
- La página conserva su scroll y su altura. Cada sección HTML es una "parada"; el progreso del scroll mueve la cámara por un recorrido entre paradas. El HTML (títulos, textos, botones) va encima del canvas.

## Paradas

1. **Entrada.** Una carta boca abajo sobre el paño, delante de ti. Los cinco principios, ahora en 3D:
   - Arrastrar: la carta se desliza por el paño y se estira con la velocidad (squash & stretch).
   - Soltar en movimiento: resbala y rebota en el borde acolchado (follow-through).
   - Golpe fuerte contra el borde: tiembla la cámara y saltan fichas 3D (screen shake).
   - Mantener apretada: tiembla, se congela un instante y estalla en fichas (hitstop).
   - Clic: se levanta, se encoge y se voltea (anticipación). La cara es el Joker.
   - El nombre del principio aparece después de hacerlo; contador "n/5" en HTML.
2. **La mano.** Al bajar, un mazo a tu lado reparte las ocho cartas en abanico delante de ti. Pasar o tocar una carta la levanta. Los palos filtran (botones HTML). Valores: A♠ Baluarte, K♠ Sargazo, Q♠ Museo, J♠ The Others, 10♠ Cadence, K♦ Kinet, K♣ Sistemas para salud, Q♥ Eclipse.
3. **El caso de estudio.** Clic en una carta: vuela hacia la cámara y se voltea; su reverso es el caso de estudio (la carta marfil grande de la v1, HTML, con scroll propio). Escape o Atrás cierran; enlazable con `#carta/<id>`. La sección "Cómo funciona" de cada reverso es una **escena 3D pequeña** en lugar del dibujo plano de la v1:
   - Baluarte: arena en miniatura con el Núcleo; la niebla suelta enemigos, la noche los multiplica, se les golpea con clic.
   - Sargazo: barco sobre agua que ondula; se arrastra el viento, la vela reacciona y hay zona muerta de frente.
   - Museo: la cápsula de blocking sobre plataformas; las acciones (saltar, dash, pared, planear) cambian el estado y el grafo de estados se ve debajo, en HTML.
   - The Others: un nivel 2.5D de verdad (tres capas: fondo, juego, frente). Visto desde la cámara del juego parece 2D; al arrastrar se gira y aparecen las capas. El personaje solo se mueve en el plano XY.
   - Kinet y Sistemas para salud: se quedan como en la v1 (líneas en canvas 2D y recuadro de firma con PDF). Decisión de Alekxander: así están bien.
   - Cadence y Eclipse: sin escena (no tienen una mecánica propia que mostrar); imágenes y enlaces.
   - Slider antes/después en el reverso cuando haya pares de imágenes reales.
4. **La Máquina.** La cámara levanta la vista: la Máquina (modelo .bbmodel original con Idle/Hit/Random) está enfrente. Clic = golpe. Si lleva un rato sin que nadie la toque, dice "¡Golpéame!". Al tercer golpe reparte: las cartas salen de su boca y se deslizan por el paño. "Otra carta" / "Me planto" en HTML. Si le ganas, escupe la carta secreta sobre cómo está hecha. Nada importante depende de ganar.
5. **El Joker.** La cámara baja a tu lado de la mesa; panel HTML con sobre mí, CV, correo y redes.

## Celular primero

- Mismo recorrido; encuadres de cámara propios para pantalla vertical (más cerca, cartas más grandes).
- dpr máximo 1.5 en celular, sin sombras en tiempo real (manchas de sombra), texturas de cartas dibujadas una vez en canvas, render pausado con la pestaña oculta y fuera de las paradas activas cuando no hay nada animado.
- Áreas de toque de al menos 44 px en lo interactivo 3D (radio de raycast ampliado en táctil).
- Sin WebGL: se muestra la versión plana (v1).

## Accesibilidad

- Cada objeto 3D interactivo tiene un botón HTML equivalente; al enfocarlo con Tab se resalta en la mesa y Enter lo activa.
- `prefers-reduced-motion`: la cámara salta entre paradas sin deslizarse, sin temblores ni física; la carta solo se voltea.
- Español con botón de inglés británico. Sonido apagado hasta el primer gesto.

## Técnica

- Se reutiliza: contenido (`src/content/`), paneles de caso, reglas del blackjack, cargador .bbmodel, sonidos, idioma, versión plana como plan B.
- Nuevo: `escena/` (canvas, mesa, lámpara, cámara por scroll), `Carta3D` (textura generada desde el naipe), física de la carta en el plano del paño, mano 3D, escenas 3D de "Cómo funciona", blackjack 3D.
- Un canvas para la mesa; cada parada monta su contenido 3D cuando se acerca y lo suelta al alejarse.
- Con un reverso abierto, la mesa se pausa y la escena de "Cómo funciona" usa su propio canvas pequeño (solo hay uno abierto a la vez), que se destruye al cerrar.

## Fases (cada una se revisa antes de la siguiente)

1. Mesa, lámpara, cámara por scroll y carta de entrada 3D con los cinco principios.
2. Mano 3D y apertura de casos (la carta vuela y se voltea al reverso), con las pruebas planas de la v1 aún.
3. Escenas 3D de "Cómo funciona".
4. Blackjack 3D con la Máquina de crupier.
5. Joker, plan B sin WebGL y pulido en celular.

## Decisiones (una línea cada una)

- **Oscuro:** es una mesa de juego de noche bajo una lámpara; la luz cae sobre las cartas, que es lo que importa.
- **Paleta:** paño vino oscuro + madera + marfil de las cartas; rojo naipe como acento; dorado solo para la Máquina.
- **Tipografía:** Gloock en índices y títulos, Instrument Sans para leer, RaccoonSerif solo en la voz de la Máquina.
- **Motivo:** la telaraña del logo en el reverso de todas las cartas.
- **Texto en HTML y no en 3D:** se lee mejor en celular, es accesible y lo indexan los buscadores.

## Pendiente de Alekxander

Pares antes/después (Baluarte, Museo, Eclipse), capturas de Sargazo, The Others y Cadence, confirmar su rol en The Others, enlace de itch.io.
