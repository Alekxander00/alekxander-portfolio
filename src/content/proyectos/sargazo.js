export default {
  id: 'sargazo',
  palo: 'picas',
  valor: 'K',
  titulo: 'Sargazo',
  imagen: null,
  linea: {
    es: 'Un juego de piratas en 3D donde llevar el timón tiene que sentirse tan bien como abordar y pelear a espada. El barco ya navega: las olas lo mecen y el viento lo empuja según cómo pongas la vela.',
    en: 'A 3D pirate game where taking the helm should feel as good as boarding and sword fighting. The ship already sails: the waves rock it and the wind pushes it depending on how you set the sail.',
  },
  rol: { es: 'Proyecto personal. Diseño y programación.', en: 'Personal project. Design and programming.' },
  ficha: [
    { k: { es: 'Motor', en: 'Engine' }, v: 'Unity 6 · URP' },
    { k: { es: 'Estado', en: 'Status' }, v: { es: 'Prototipo del barco jugable', en: 'Playable ship prototype' } },
  ],
  resolvio: {
    es: [
      'Un mar de olas Gerstner con una sola fórmula para la física y para la malla: lo que ves es lo que te empuja.',
      'Flotación por ocho puntos y viento con ruido: el barco cabecea y escora sin animaciones hechas a mano.',
      'La vela empuja según su ángulo con el viento, con una zona muerta de frente que obliga a zigzaguear.',
      'Teclado y ratón o mando desde el primer día.',
    ],
    en: [
      'A Gerstner-wave sea where one formula drives both physics and mesh: what you see is what pushes you.',
      'Eight-point buoyancy and noisy wind: the ship pitches and heels with no hand-made animation.',
      'The sail pushes according to its angle to the wind, with a dead zone head-on that forces you to tack.',
      'Keyboard and mouse or gamepad from day one.',
    ],
  },
  widget: 'viento',
  antesDespues: null,
  enlaces: [],
}
