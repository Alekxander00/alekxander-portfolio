export const projects = [
  {
    id: 1,
    title: "Proyecto de Animación 1",
    description: "WIP.",
    image: "/images/proyecto1.jpg",
    category: "",
    processImages: ["/images/proceso1-1.jpg", "/images/proceso1-2.jpg"],
    link: "https://...", // opcional
  },
  {
    id: 2,
    title: "App Web con React",
    description: "WIP.",
    image: "/images/proyecto2.jpg",
    category: "",
    processImages: [],
  },{
  id: 3, // Cambia según tu secuencia
  title: "Sistema de Tickets de Soporte (Helpdesk)",
  description: `Plataforma completa de gestión de incidencias con roles (usuario / administrador), autenticación con Google, mensajería en tiempo real y adjunto de imágenes. Los usuarios crean tickets con descripción y capturas; los especialistas responden y cierran incidencias.

=== FUNCIONALIDADES PRINCIPALES ===
• Autenticación con Google (OAuth 2.0)
• Roles diferenciados: usuario (crea tickets, adjunta imágenes, ve respuestas) y administrador (gestiona todos los tickets, responde, cambia estados)
• Sistema de mensajería por ticket con orden cronológico y soporte para imágenes en los mensajes
• Panel de administración con listado de tickets, filtros por estado, búsqueda por usuario o título

=== TECNOLOGÍAS ===
Frontend: React + Vite
Backend: Node.js + Express
ORM: Prisma
Base de datos: PostgreSQL
Autenticación: Firebase Auth (Google)
Almacenamiento de imágenes: Cloudinary
Estilos: Tailwind CSS

=== CARACTERÍSTICAS TÉCNICAS ===
• API RESTful con rutas protegidas por middleware
• Validación de datos con Zod
• Relaciones modeladas con Prisma (User, Ticket, Message, Image)
• Subida de imágenes optimizada con compresión previa en cliente
• Diseño responsive (adaptado a móvil y escritorio)

=== ESTADO ===
Completado y funcional. Se puede desplegar bajo solicitud.`,
  image: "/images/MesaAyuda.png",
  category: "Kode",
  processImages: [
    "/images/MesaAyuda1.png",
    "/images/MesaAyuda2.png",
    "/images/MesaAyuda3.png"
  ],
},{
  id: 4,
  title: "Sistema de Firmas de Consentimientos Médicos",
  description: `Plataforma web para la gestión y firma digital de consentimientos informados en entornos médicos. Permite a los profesionales de la salud acceder a una lista de pacientes, revisar la información del procedimiento y obtener una firma electrónica que genera un PDF legalmente válido, almacenándolo en la base de datos.

=== FUNCIONALIDADES PRINCIPALES ===
• Autenticación segura: inicio de sesión con usuarios admitidos (médicos/administradores), sin integración con Google.
• Lista de pacientes: vista clara de todos los pacientes registrados.
• Detalle del paciente: al seleccionar un paciente, se muestra su información personal y los datos del procedimiento a realizar.
• Firma digital: campo interactivo para que el paciente (o el médico) firme con el mouse o pantalla táctil.
• Generación de PDF: al guardar, se crea un documento PDF con el consentimiento firmado, los datos del paciente y el procedimiento.
• Almacenamiento seguro: el PDF generado se guarda en la base de datos y puede ser recuperado posteriormente.

=== TECNOLOGÍAS ===
Frontend: React + Vite
Backend: Node.js + Express
ORM: Prisma
Base de datos: PostgreSQL
Firma digital: react-signature-canvas / signature_pad
Generación de PDF: jsPDF / react-pdf
Estilos: Tailwind CSS

=== CARACTERÍSTICAS TÉCNICAS ===
• API RESTful con autenticación por sesión o JWT (según implementación)
• Validación de datos con Zod
• Relaciones en base de datos: User (médicos), Patient, ConsentForm, Signature
• Almacenamiento de PDFs en base de datos (campo BYTEA o ruta en servidor)
• Diseño responsive adaptado a tablets (para uso clínico)

=== ESTADO ===
Completado y funcional. Actualmente en pruebas para entornos clínicos.`,
  image: "/images/Consentimientos.png",        // Imagen principal (miniatura)
  category: "Kode",                           // Misma categoría que el sistema de tickets, o "Design" si prefieres
  processImages: [
    "/images/Consentimientos1.png",            // Captura del listado de pacientes
    "/images/Consentimientos2.png"           
  ],
  link: "https://github.com/tuusuario/consentimientos-frontend" // Opcional
},{
  id: 13,
  title: "Artbook: Eclipse - Diseño de Personajes y Entornos",
  description: `Artbook conceptual desarrollado como proyecto de 4to semestre de la carrera. "Eclipse" propone un mundo de fantasía oscura bajo un eclipse perpetuo, donde los héroes buscan grimorios ancestrales para restaurar la luz. Este proyecto incluye el diseño de personajes, props y escenarios, documentando el proceso creativo desde los bocetos iniciales hasta las versiones finales.

=== CONTENIDO DESTACADO ===
• Mundo narrativo: Inspirado en la estética y dificultad de sagas como Dark Souls y Elden Ring, con una atmósfera opresiva y una historia de sacrificio y esperanza.
• Personajes principales: Ashborn Thornfield (heredero polilla), Serena Vanki (nómada aventurera), Duffer Fairchild (bardo rebelde), Urania Musse (vampira antagonista) y Salomón Ravenswood (guerrero mentor).
• Diseño de props: Armas como la "Espada de Sylvaris" o el báculo "Luna Nueva", objetos simbólicos como la "Carta de Rosa" y el "Grimorio de Luna Llena".
• Escenarios clave: Parroquia de Thalassar, Praderas de Sylvaris, Entrada de Valoria y el misterioso lugar del árbol seco y la torre infinita.
• Proceso documentado: Incluye bocetos iniciales, hojas de modelo (model sheets), paletas de color, estudios de poses y evolución de localizaciones.

=== TECNOLOGÍAS Y HERRAMIENTAS ===
Diseño conceptual e ilustración: Adobe Illustrator, Photoshop.
Presentación interactiva: FlipHTML5 (para visualizar el artbook completo)
Formato: PDF interactivo con estructura narrativa (prólogo, personajes, props, escenarios, epílogo)

=== CARACTERÍSTICAS DEL PROYECTO ===
• Narrativa integrada: Cada personaje y escenario está acompañado de una historia que justifica su diseño.
• Coherencia visual: Paletas de color definidas para cada personaje (ej: #CCBFB4, #904552 para Ashborn).
• Exploración de ideas: Se muestran versiones alternativas de localizaciones (ej: la parroquia que pasó de ser un simple edificio a un punto vital de la trama).
• Enfoque en el proceso: El artbook no solo muestra resultados finales, sino también el camino creativo (bocetos, decisiones de diseño).

=== ESTADO ===
Proyecto académico completado. Representa un primer acercamiento al diseño conceptual narrativo. Actualmente sigo formándome para mejorar la calidad artística, pero el proyecto demuestra mi capacidad para construir mundos, definir estilos visuales coherentes y documentar un proceso creativo de principio a fin.`,
  image: "/images/Eclipse.png",        // Aquí pones la captura de la portada que tienes
  category: "Narrative", 
  buttonText: "Ver artbook",                             // O "Design", según organices tu portafolio
  processImages: ["/images/Eclipse1.png"],                           // Si no tienes más capturas, déjalo vacío o pon la misma portada
  link: "https://online.fliphtml5.com/bdmqg/mlfx/"  // Enlace al flipbook interactivo
},{
  id: 14,
  title: "El Museo de las Emociones Perdidas - Videojuego en Unity",
  description: `Proyecto personal de videojuego en desarrollo. Un Metroidvania 3D de acción y plataformas con una fuerte narrativa emocional. La protagonista, Nicol (restauradora de arte), es absorbida por un museo que contiene mundos basados en obras literarias, los cuales están siendo consumidos por "El Olvido Gris". Deberá ayudar a los fantasmas de cada mundo para restaurar el color y las emociones, mientras busca a su novio corrompido.

=== ESTADO ACTUAL ===
Fase 1 en progreso: Mundo 1 "Bosque de los Bocetos" en desarrollo. Sistemas base completamente implementados y funcionales.

=== MECÁNICAS IMPLEMENTADAS ===
• Movimiento 3D robusto: caminar, correr, sprint, salto con coyote time y jump buffer, crouch, dash (horizontal y aéreo como misma habilidad), wall jump, wall run, glide, ground pound, slide, diagonal dash.
• Combate: ataques cuerpo a cuerpo con combo de 3 golpes, ataque a distancia con proyectil de tinta (cargado), bloqueo/parry con ventana de 0.2s.
• Sistema de Inspiración (combo meter): se llena al encadenar acciones sin recibir daño, al 100% activa Modo Inspiración (×1.5 daño, sin coste de energía).
• Checkpoints: sistema de "Lienzos" que guardan el progreso y permiten viaje rápido.
• Guardado automático: al activar Lienzo, al entrar/salir de mundo, cada 2 minutos en el Hub, al cerrar el juego.
• Sistema de diálogos con nodos (ScriptableObjects).
• Pantalla de muerte con fade y opciones de reintentar o salir al menú.
• Enemigo base "Borrón" con IA (cono de visión, embestida, daño por overlap).

=== PRÓXIMAS IMPLEMENTACIONES (Diseñadas en GDD) ===
• Habilidades Metroidvania: Garra de Sombra (escalada), Gancho de Ancla (columpio/tirar objetos), Flash de Cámara (revelar oculto, aturdir espectros), Lente de Tiempo (ralentizar).
• Mundos 2-5: Nueva York de Sombra (Cazadores de Sombras), Puerto del Fin del Mundo (Julio Verne), Ciudad de las Fotografías (El Fotógrafo de Cadáveres), Jardín de los Recuerdos (final emocional).
• Natación, mecánicas de viento, zonas de ensueño opcionales, 3 finales alternativos.

=== TECNOLOGÍAS ===
Motor: Unity + URP (Universal Render Pipeline)
Lenguaje: C#
Herramientas: Cinemachine, Input System, ProBuilder, Timeline, Post Processing, DOTween
Plataforma objetivo: PC (Windows/macOS)
Control: Teclado + ratón / Mando Xbox/PlayStation

=== CARACTERÍSTICAS TÉCNICAS ===
• Máquina de estados para el jugador y enemigos
• Sistema de habilidades extensible (cada habilidad es un MonoBehaviour independiente)
• Gestión de checkpoints con viaje rápido entre Lienzos activados
• Datos persistentes con PlayerPrefs (guardado manual y automático)
• Cámara dinámica con Cinemachine (transiciones suaves, cámara de diálogo)

=== ESTADO ===
🔄 En desarrollo activo. Fase 1 (Mundo 1) en progreso. Todos los sistemas base están implementados y jugables. El diseño completo está documentado en un GDD de 14 secciones.`,
  image: "/images/Museo.png", // ← Cambia por una captura de Unity o arte conceptual cuando tengas
  category: "Experience",  // O "Experience" si prefieres, pero "Kode" ya tiene proyectos similares
  processImages: [], // Aquí puedes añadir capturas del editor de Unity, diagramas de mecánicas, etc.
  link: "", // Si tienes un repositorio de GitHub o una build jugable, pon el enlace aquí
},
{
  id: 15,
  title: "Kinet - Experiencia Web Interactiva en React",
  description: `Proyecto de diseño y desarrollo frontend para una empresa ficticia llamada Kinet, enfocada en comunicación interactiva y branding generativo. La web fue concebida como una pieza de marca y no como una landing convencional: una experiencia visual inmersiva, modular y preparada para mostrar proyectos reales dentro de un laboratorio interactivo.

=== OBJETIVO DEL PROYECTO ===
Diseñar una web que comunicara el valor de Kinet desde la propia experiencia de navegación. La meta no era solo “explicar servicios”, sino demostrar cómo una marca puede verse, sentirse y moverse de forma distinta mediante interacción, ritmo visual y una dirección gráfica clara.

=== CONCEPTO GENERAL ===
La página mezcla lenguaje editorial, composición experimental y comportamiento interactivo. Se construyó como un recorrido de marca inspirado en estudios digitales como MakeMePulse y Active Theory, manteniendo una experiencia usable, clara y adaptable para mostrar trabajos reales.

=== CARACTERÍSTICAS IMPLEMENTADAS ===
• Hero inmersivo con composición tipográfica de alto impacto
• Fondo interactivo en canvas con líneas dinámicas que reaccionan al mouse
• Soundtrack generativo integrado con Web Audio API
• Reacción visual del fondo al audio (graves, medios, agudos y pulsos)
• Cursor personalizado contextual para reforzar interacción
• Header flotante tipo dock con identidad visual propia
• Sección narrativa tipo “story engine” para explicar el valor de la marca
• Módulo “lab” preparado para mostrar proyectos reales, renders, videos o demos
• Cierre/contacto con copy adaptado a tono de marca
• Arquitectura modular para cambiar contenido sin rehacer la UI

=== PROCESO DE DISEÑO Y DESARROLLO ===
1. Investigación visual y conceptual:
Se definió una dirección inspirada en experiencias web experimentales, evitando plantillas tradicionales y buscando una identidad más cercana a una instalación digital que a una página corporativa estándar.

2. Sistema visual:
Se trabajó con la paleta #180F2A, #FFFFFF y #C6FF34, junto con tipografía Poppins + Urbanist. Se ajustó la jerarquía para que el sitio mantuviera personalidad sin perder legibilidad.

3. Arquitectura modular:
El contenido se separó de la interfaz mediante archivos de datos en JavaScript, permitiendo reemplazar proyectos, textos y módulos de forma sencilla desde una sola fuente.

4. Interactividad:
Se desarrollaron efectos propios como cursor custom, backdrop en canvas, movimiento reactivo al puntero y una capa de audio generativo conectada al fondo.

5. Iteración y pulido:
Se corrigieron problemas de tipografía, ritmo visual, espaciado, copy, jerarquía y deploy, afinando la experiencia hasta que la página se sintiera más única y coherente con la propuesta de la marca.

=== TECNOLOGÍAS ===
Framework: React
Bundler: Vite
Estilos: CSS Modules
Interacción visual: Canvas API
Audio: Web Audio API
Lenguaje: JavaScript

=== APRENDIZAJES / ENFOQUE TÉCNICO ===
• Construcción de interfaces de marca no convencionales sin sacrificar usabilidad
• Separación entre contenido y presentación para escalabilidad
• Integración de audio reactivo con elementos visuales en tiempo real
• Diseño de módulos reutilizables para portafolio y storytelling
• Resolución de problemas de deploy y limpieza de repositorio para producción

=== ESTADO ===
✅ Proyecto funcional y terminado como experiencia conceptual de marca.
✅ Preparado para recibir proyectos reales dentro del módulo de laboratorio.
✅ Deploy-ready para producción.`,
  image: "/images/Kinet.png",
  category: "Experience",
  processImages: [],
  link: "https://kinet-web.vercel.app/"
}

];