// Textos de interfaz. Inglés británico.
export const T = {
  saltar: { es: 'Ir a los proyectos', en: 'Skip to the projects' },
  idioma: { es: 'English', en: 'Español' },
  idiomaEtiqueta: { es: 'Cambiar a inglés', en: 'Switch to Spanish' },
  sonidoOn: { es: 'Silenciar', en: 'Mute' },
  sonidoOff: { es: 'Activar sonido', en: 'Turn sound on' },
  cartaEntrada: { es: 'Una carta boca abajo', en: 'A face-down card' },
  cartaEntradaVolteada: { es: 'La carta del Joker: Alekxander', en: 'The Joker card: Alekxander' },
  pistaFlechas: { es: 'Las flechas la empujan por la mesa; con Mayúsculas, más fuerte.', en: 'The arrow keys push it across the table; hold Shift to push harder.' },
  principios: { es: 'Principios encontrados', en: 'Principles found' },
  mano: { es: 'La mano', en: 'The hand' },
  filtro: { es: 'Filtrar por palo', en: 'Filter by suit' },
  todos: { es: 'Toda la mano', en: 'Whole hand' },
  abrirCarta: { es: 'Ver', en: 'Open' },
  cerrar: { es: 'Cerrar', en: 'Close' },
  rol: { es: 'Mi parte', en: 'My part' },
  resolvio: { es: 'Qué resolví', en: 'What I solved' },
  comoFunciona: { es: 'Cómo funciona', en: 'How it works' },
  antes: { es: 'Antes', en: 'Before' },
  despues: { es: 'Después', en: 'After' },
  sinImagen: { es: 'Sin capturas todavía', en: 'No screenshots yet' },
  joker: { es: 'El Joker', en: 'The Joker' },
  escribeme: { es: 'Escríbeme', en: 'Write to me' },
  copiar: { es: 'Copiar correo', en: 'Copy email' },
  copiado: { es: 'Copiado', en: 'Copied' },
  herramientas: { es: 'Con qué trabajo', en: 'What I work with' },
  pie: { es: 'Hecho a mano en Tunja. La Máquina viene de Baluarte.', en: 'Handmade in Tunja. The Machine comes from Baluarte.' },
  cargando: { es: 'Despertando a la Máquina…', en: 'Waking the Machine…' },
  errorMaquina: { es: 'La Máquina no quiso despertar. Recarga la página para intentarlo otra vez.', en: 'The Machine would not wake up. Reload the page to try again.' },
  maquinaEtiqueta: { es: 'La Máquina Expendedora de Baluarte. Golpéala.', en: 'The Vending Machine from Baluarte. Hit it.' },
  golpear: { es: 'Golpear a la Máquina', en: 'Hit the Machine' },
  pedir: { es: 'Otra carta', en: 'Hit me' },
  plantarse: { es: 'Me planto', en: 'Stand' },
  otraMano: { es: 'Otra mano', en: 'Deal again' },
  tu: { es: 'Tú', en: 'You' },
  casa: { es: 'La Máquina', en: 'The Machine' },
  secreta: { es: 'Carta secreta', en: 'Secret card' },
}

export const PRINCIPIOS = {
  estirar: {
    nombre: 'Squash & stretch',
    idea: {
      es: 'Se deforma con la velocidad. Así algo rígido se siente rápido y vivo.',
      en: 'It deforms with speed. That is how something rigid feels quick and alive.',
    },
  },
  inercia: {
    nombre: 'Follow-through',
    idea: {
      es: 'Al soltarla no se detiene en seco: sigue, rebota y se asienta.',
      en: 'Let go and it does not stop dead: it carries on, bounces and settles.',
    },
  },
  sacudida: {
    nombre: 'Screen shake',
    idea: {
      es: 'Un golpe fuerte mueve el mundo entero. El ojo lo lee como peso.',
      en: 'A heavy hit moves the whole world. The eye reads it as weight.',
    },
  },
  hitstop: {
    nombre: 'Hitstop',
    idea: {
      es: 'Congelar un instante antes del estallido hace que el impacto pese más.',
      en: 'Freezing for an instant before the burst makes the impact land harder.',
    },
  },
  anticipacion: {
    nombre: { es: 'Anticipación', en: 'Anticipation' },
    idea: {
      es: 'Antes de voltearse, se encoge. El cuerpo avisa lo que va a hacer.',
      en: 'Before it flips, it crouches. The body warns you what it is about to do.',
    },
  },
}

// Lo que dice la Máquina. Frases cortas: cada una se oye en sílabas.
export const FRASES = {
  pide: { es: '¡Golpéame!', en: 'Hit me!' },
  golpes: [
    { es: '¡Ay!', en: 'Ow!' },
    { es: '¿Otra vez?', en: 'Again?' },
    { es: 'Vale, vale. ¿Una partida?', en: 'Right, fine. Fancy a hand?' },
  ],
  insistir: [
    { es: '¡Que ya te reparto!', en: 'I am dealing, I am dealing!' },
    { es: 'Golpéame en Baluarte, no aquí.', en: 'Hit me in Baluarte, not here.' },
  ],
  reparte: [
    { es: 'Veintiuno. Ni uno más.', en: 'Twenty-one. Not one more.' },
    { es: 'La casa siempre gana. Casi.', en: 'The house always wins. Almost.' },
  ],
  ganas: [
    { es: '¡Me ganaste! Toma, y no se lo digas a nadie.', en: 'You beat me! Here, and do not tell anyone.' },
  ],
  ganasOtraVez: [
    { es: 'Otra vez tú. Ya no me quedan secretos.', en: 'You again. I have no secrets left.' },
  ],
  blackjack: [{ es: '¡Blackjack! Qué descaro.', en: 'Blackjack! The cheek of it.' }],
  mePase: [{ es: '¡Me pasé! Eso no cuenta… bueno, sí cuenta.', en: 'I went bust! That does not count… fine, it counts.' }],
  pierdes: [
    { es: 'La casa gana. Siempre.', en: 'The house wins. Always.' },
    { es: 'Otra vez será.', en: 'Better luck next time.' },
  ],
  tePasaste: [{ es: '¡Te pasaste!', en: 'Bust!' }],
  empate: [{ es: 'Empate. Qué aburrido.', en: 'A draw. How dull.' }],
}
