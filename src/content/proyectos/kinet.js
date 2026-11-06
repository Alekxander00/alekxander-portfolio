export default {
  id: 'kinet',
  palo: 'diamantes',
  valor: 'K',
  titulo: 'Kinet',
  imagen: '/images/kinet.webp',
  imagenEncaje: { ajuste: 'contain', fondo: '#180F2A' },
  imagenAlt: { es: 'Logotipo de Kinet en verde lima sobre morado oscuro.', en: 'The Kinet logo in lime green on dark purple.' },
  linea: {
    es: 'La web de un estudio de comunicación interactiva que no existe. Se recorre como una instalación: las líneas del fondo siguen al ratón y se mueven con una música que se compone sola.',
    en: 'The website of an interactive studio that does not exist. You walk through it like an installation: the background lines follow the mouse and move to music that composes itself.',
  },
  rol: { es: 'Diseño y desarrollo frontend.', en: 'Design and front-end development.' },
  ficha: [
    { k: { es: 'Hecha con', en: 'Built with' }, v: 'React · Canvas · Web Audio' },
    { k: { es: 'Estado', en: 'Status' }, v: { es: 'Publicada', en: 'Live' } },
  ],
  resolvio: {
    es: [
      'Fondo de líneas en canvas que reacciona al ratón.',
      'Banda sonora generativa con Web Audio; el fondo reacciona a graves, medios, agudos y pulsos.',
      'Contenido separado de la interfaz: los proyectos del laboratorio se cambian desde un archivo de datos.',
    ],
    en: [
      'A canvas background of lines that reacts to the mouse.',
      'A generative soundtrack with Web Audio; the background reacts to bass, mids, highs and beats.',
      'Content separated from the interface: lab projects are swapped from a single data file.',
    ],
  },
  widget: 'lineas',
  antesDespues: null,
  enlaces: [{ texto: { es: 'Visitar Kinet', en: 'Visit Kinet' }, href: 'https://kinet-web.vercel.app/' }],
}
