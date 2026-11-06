# Portafolio "La Baraja" (diseño)

Fecha: 2026-11-05. Aprobado en conversación por Alekxander.

## Idea

El portafolio es una baraja. Se descubre jugando con las manos, sin instrucciones; lo importante (proyectos, CV, contacto) se lee siempre sin jugar.

Lectura de diseño: portafolio de desarrollador de videojuegos y web interactiva, para estudios y clientes, con lenguaje de "mesa de cartas de autor", oscuro y cálido. Diales: ENERGY 3 / RHYTHM 3 / MOTION 3 en la entrada, MOTION 2 en el resto.

## Recorrido

1. **Entrada:** una carta boca abajo (reverso con el logo de la telaraña). Sin texto. Si nadie la toca, da un saltito.
   - Arrastrar: se estira según la velocidad (squash & stretch).
   - Soltar en movimiento: sigue y rebota en los bordes (follow-through).
   - Golpe fuerte contra un borde: tiembla la pantalla y saltan fichas (screen shake).
   - Mantener apretada: tiembla, se congela un instante y estalla (hitstop).
   - Clic: se encoge y se voltea (anticipación). La cara es el Joker: nombre y oficio.
   - El nombre del principio aparece después de hacerlo. Contador discreto "n/5".
2. **La mano:** proyectos como cartas repartidas. Palos dibujados en la mesa filtran.
   - ♠ juegos, ♦ web interactiva, ♣ sistemas, ♥ arte y narrativa.
   - El valor dice la importancia: A♠ Baluarte, K♠ Sargazo, Q♠ Museo, J♠ The Others, 10♠ Cadence of Shadows, K♦ Kinet, K♣ Sistemas para salud, Q♥ Eclipse.
   - Cartas sin imagen usan pips de naipe.
3. **El reverso:** clic en una carta abre el caso de estudio (diálogo que se voltea). Una línea, rol, qué resolvió, widget "cómo funciona", slider antes/después (solo si hay par de imágenes reales), enlaces. Enlazable con `#carta/<id>`; Escape cierra.
4. **La Máquina:** la Máquina Expendedora de Baluarte (modelo `.bbmodel` real con sus animaciones Idle/Hit/Random, cargado en three.js). Clic = golpe. Al tercer golpe abre una mesa de blackjack y reparte. Si le ganas, escupe una carta secreta. Nada importante depende de ganar.
5. **El Joker:** sobre mí, CV (dos PDF), correo y redes.

## Reglas

- Español con botón de inglés británico (nunca inglés de EE. UU.).
- Sonido apagado hasta el primer gesto; botón para silenciar.
- `prefers-reduced-motion`: sin temblores ni física, la carta solo se voltea.
- Teclado: la carta de entrada se voltea con Enter/Espacio; cartas, palos, diálogo y blackjack operables con teclado.
- Nada de cifras inventadas; los widgets ilustran mecanismos, no prometen números.
- Contenido en `src/content/` (un archivo por proyecto).

## Técnica

React 19 + Vite, CSS propio con tokens, framer-motion para transiciones, three + @react-three/fiber solo para la Máquina (carga diferida). Despliegue en Vercel.

## Decisiones (una línea cada una)

- **Oscuro:** es una mesa de juego de noche y el oficio es videojuegos; el marfil de las cartas es lo que brilla.
- **Paleta:** tinta cálida + marfil + rojo naipe (acento solo en palos rojos y momentos clave); dorado reservado a la Máquina, como en Baluarte.
- **Tipografía:** Gloock (serif de alto contraste, evoca los índices grabados de un naipe) para valores y títulos; Instrument Sans para leer; RaccoonSerif solo en la voz de la Máquina.
- **Motivo:** la telaraña del logo como reverso de todas las cartas.
- **Cartas como unidad:** el contenido son proyectos de valor distinto; el tamaño y el valor de la carta expresan esa jerarquía.

## Imágenes pendientes (las pone Alekxander)

Pares antes/después: Baluarte (blocking y final), Museo (versión final), Eclipse (boceto e ilustración). Capturas de Sargazo, The Others y Cadence.
