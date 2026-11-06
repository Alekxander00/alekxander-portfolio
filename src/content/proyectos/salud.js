export default {
  id: 'salud',
  palo: 'treboles',
  valor: 'K',
  titulo: { es: 'Sistemas para salud', en: 'Healthcare systems' },
  imagen: '/images/mesaayuda1.webp',
  imagenAlt: {
    es: 'Panel de la mesa de ayuda con los tickets recientes del usuario.',
    en: 'Helpdesk dashboard showing the user’s recent tickets.',
  },
  linea: {
    es: 'Dos sistemas web para entornos clínicos: una mesa de ayuda con tickets y la firma digital de consentimientos informados.',
    en: 'Two web systems for clinical settings: a ticket helpdesk and digital signing of informed consent forms.',
  },
  rol: { es: 'Full stack, de la base de datos a la interfaz.', en: 'Full stack, from the database to the interface.' },
  ficha: [
    { k: { es: 'Hecho con', en: 'Built with' }, v: 'React · Node · Express · Prisma · PostgreSQL' },
    {
      k: { es: 'Estado', en: 'Status' },
      v: { es: 'Terminados; consentimientos en pruebas clínicas', en: 'Finished; consent forms in clinical testing' },
    },
  ],
  resolvio: {
    es: [
      'Mesa de ayuda con roles de usuario y administrador, acceso con Google, conversación por ticket con imágenes (Cloudinary) y filtros por estado.',
      'Consentimientos: el paciente firma con el dedo en una tablet y se genera el PDF firmado, que queda guardado en la base de datos.',
      'Validación con Zod y relaciones modeladas con Prisma.',
    ],
    en: [
      'Helpdesk with user and admin roles, Google sign-in, a conversation per ticket with images (Cloudinary) and status filters.',
      'Consent forms: the patient signs with a finger on a tablet and a signed PDF is generated and stored in the database.',
      'Validation with Zod and relations modelled with Prisma.',
    ],
  },
  galeria: [
    {
      src: '/images/consentimientos2.webp',
      alt: {
        es: 'Pantalla de firma: datos del paciente, texto del consentimiento y recuadro para firmar.',
        en: 'Signing screen: patient details, consent text and signature pad.',
      },
    },
    {
      src: '/images/mesaayuda4.webp',
      alt: { es: 'Detalle de un ticket con su conversación y archivos adjuntos.', en: 'Ticket detail with its conversation and attachments.' },
    },
  ],
  widget: 'firma',
  antesDespues: null,
  enlaces: [],
}
