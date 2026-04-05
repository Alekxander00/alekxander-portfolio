export const projects = [
  {
    id: 1,
    title: "Proyecto de Animación 1",
    description: "WIP.",
    image: "/images/proyecto1.jpg",
    category: "Animation",
    processImages: ["/images/proceso1-1.jpg", "/images/proceso1-2.jpg"],
    link: "https://...", // opcional
  },
  {
    id: 2,
    title: "App Web con React",
    description: "WIP.",
    image: "/images/proyecto2.jpg",
    category: "Logic",
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
}
  // ... resto de proyectos
];